import { callAI } from '@/lib/ai';
import { DraftRequest } from '@/lib/gameTypes';
import {
  assembleActDrafts,
  extractDefaultReactions,
  ReactionLine,
  scriptSkeleton,
} from '@/lib/gameData';
import { buildDraftPrompt } from '@/lib/prompts';
import { sanitizeVisibleActDrafts } from '@/lib/visibleText';

export const maxDuration = 240;

function roleNamesForBeat(reaction = '') {
  return Array.from(reaction.matchAll(/<actor role="([^"]+)">/g)).map((match) => match[1]);
}

function buildMindsetFallbackReactions(
  body: DraftRequest,
  defaultReactions: Record<string, ReactionLine[]>
) {
  const roleToCast = new Map<string, DraftRequest['casting'][number]>();
  body.casting.forEach((cast) => {
    cast.scriptRoleName.split('/').forEach((name) => {
      roleToCast.set(name.trim(), cast);
    });
  });

  const reactions: Record<string, ReactionLine[]> = { ...defaultReactions };

  body.scriptSkeleton.forEach((act) => {
    act.beats.forEach((beat) => {
      const roleNames = roleNamesForBeat(beat.defaultSetReaction);
      if (roleNames.length === 0) return;

      const additions = roleNames
        .map((roleName) => {
          const cast = roleToCast.get(roleName);
          if (!cast) return null;
          const actor = body.selectedActors.find((item) => item.id === cast.actorId);
          const recruit = body.recruitResults.find((item) => item.actorId === cast.actorId);
          if (!actor || !recruit) return null;
          return {
            speaker: actor.name,
            text: `${actor.name}接到这段时没有只按${roleName}演，先把自己那句“${recruit.mindset.description}”听进去了；${actor.lossDirection}`,
            mood: beat.riskTag,
          };
        })
        .filter((item): item is ReactionLine => Boolean(item));

      if (additions.length === 0) return;
      reactions[beat.beatId] = [...(reactions[beat.beatId] || []), ...additions];
    });
  });

  return reactions;
}

export async function POST(request: Request) {
  const body = (await request.json()) as DraftRequest;

  // 用默认反应作为 fallback
  const defaultReactions = buildMindsetFallbackReactions(
    body,
    extractDefaultReactions(body.scriptSkeleton, body.casting)
  );

  if (!process.env.AI_API_KEY) {
    const episodeDraft = assembleActDrafts(body.scriptSkeleton, defaultReactions);
    return Response.json({ episodeDraft: sanitizeVisibleActDrafts(episodeDraft) });
  }

  try {
    const prompt = buildDraftPrompt(body);
    const result = await callAI(prompt.system, prompt.user, [], 0.85, 8000, 210000);
    const parsed = result.parsed as { reactions?: Record<string, ReactionLine[]> } | null;

    const reactions =
      parsed?.reactions && typeof parsed.reactions === 'object'
        ? { ...defaultReactions, ...parsed.reactions }
        : defaultReactions;

    const episodeDraft = assembleActDrafts(body.scriptSkeleton, reactions);
    return Response.json({ episodeDraft: sanitizeVisibleActDrafts(episodeDraft) });
  } catch (error) {
    console.error('Draft error:', error);
    const episodeDraft = assembleActDrafts(body.scriptSkeleton, defaultReactions);
    return Response.json({ episodeDraft: sanitizeVisibleActDrafts(episodeDraft) });
  }
}
