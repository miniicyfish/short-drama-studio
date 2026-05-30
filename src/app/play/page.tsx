'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingIndicator from '@/components/LoadingIndicator';
import VNStage, { VNLineKind } from '@/components/VNStage';
import { installAudioUnlock, playBgm, playOneShot, stopBgm } from '@/lib/audioPlayer';
import {
  actBackgrounds,
  actors,
  initialStats,
  roleActorPortraits,
  rolePortraits,
  scriptSkeleton,
  tools,
} from '@/lib/gameData';
import {
  ActDraft,
  ActorState,
  CanonEntry,
  EpilogueResponse,
  GameSession,
  InterventionResponse,
  ShootLine,
  Stats,
  ToolType,
} from '@/lib/gameTypes';
import { sanitizeVisibleActDrafts } from '@/lib/visibleText';

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function applyStats(base: Stats, delta: Stats): Stats {
  return {
    budget: clamp(base.budget + delta.budget),
    buzz: clamp(base.buzz + delta.buzz),
    dignity: clamp(base.dignity + delta.dignity),
    control: clamp(base.control + delta.control),
  };
}

function statLabel(key: keyof Stats) {
  return {
    budget: '预算',
    buzz: '爆相',
    dignity: '体面',
    control: '可控',
  }[key];
}

function formatStatDelta(key: keyof Stats, value: number) {
  if (value === 0) return null;
  return `${statLabel(key)} ${value > 0 ? '+' : ''}${value}`;
}

function scoreDeltaLabels(delta?: Stats) {
  if (!delta) return [];
  return (Object.keys(delta) as Array<keyof Stats>)
    .map((key) => formatStatDelta(key, delta[key]))
    .filter((item): item is string => Boolean(item));
}

function zeroDelta(): Stats {
  return { budget: 0, buzz: 0, dignity: 0, control: 0 };
}

function lineSeed(line: ShootLine) {
  return Array.from(`${line.lineId}:${line.text}`).reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function lineTone(signal: ShootLine['riskSignal']) {
  if (signal === 'critical') return 'border-accent-red/50 bg-accent-red/10';
  if (signal === 'high') return 'border-accent-gold/45 bg-accent-gold/8';
  if (signal === 'medium') return 'border-accent-blue/30 bg-accent-blue/8';
  return 'border-border bg-bg-card/85';
}

function vnKindFromLine(type?: ShootLine['type']): VNLineKind {
  if (type === 'dialogue') return 'dialogue';
  if (type === 'actor_reaction') return 'reaction';
  if (type === 'action' || type === 'director') return 'action';
  if (type === 'inner') return 'inner';
  return 'system';
}

function lineScoreImpact(line: ShootLine): { delta: Stats; reason: string } | null {
  const delta = zeroDelta();
  const reasons: string[] = [];
  const seed = lineSeed(line);
  const variant = seed % 4;

  if (line.riskSignal === 'medium') {
    delta.buzz += 1 + (variant === 0 ? 1 : 0);
    delta.control -= variant === 1 ? 2 : 1;
    reasons.push('片场开始偏离');
  }
  if (line.riskSignal === 'high') {
    delta.budget -= variant === 0 ? 1 : 0;
    delta.buzz += 2 + (variant % 2);
    delta.dignity -= 1 + (variant === 2 ? 2 : 1);
    delta.control -= 2 + (variant === 3 ? 2 : 0);
    reasons.push('高风险爆点');
  }
  if (line.riskSignal === 'critical') {
    delta.buzz += 5 + variant;
    delta.budget -= 2 + (variant === 1 ? 2 : 0);
    delta.dignity -= 4 + (variant === 2 ? 2 : 0);
    delta.control -= 5 + (variant === 3 ? 3 : 0);
    reasons.push('关键爆点失控');
  }

  if (line.type === 'inner' || line.innerThought) {
    delta.buzz += /不认|确认|明白|拒绝|醒/.test(line.text) ? 2 : 1;
    delta.dignity += /清醒|拒绝|夺回/.test(line.text) ? 1 : 0;
    delta.dignity -= /羞辱|难堪|疯|病/.test(line.text) ? 1 : 0;
    delta.control -= /犹豫|慌|失控|疯/.test(line.text) ? 2 : 1;
    reasons.push('内心波动');
  }

  if (line.type === 'actor_reaction') {
    delta.buzz += /笑|切片|名场面|更真|有戏|保留/.test(line.text) ? 3 : 1 + (variant % 2);
    delta.budget -= /补拍|加钱|房东|群演|灯|摄影|收音|道具|安全线|出画/.test(line.text) ? 2 : variant === 0 ? 1 : 0;
    delta.dignity -= /尴尬|下跪|强吻|羞辱|不体面|丢人|疯/.test(line.text) ? 2 : 0;
    delta.control -= /接不住|卡|停顿|误会|憋笑|提醒|绊|撞|下意识/.test(line.text) ? 3 : 1;
    reasons.push('演员现场反应');
  }

  if (line.type === 'action' || line.type === 'director') {
    delta.budget -= /群演|灯|摄影|收音|道具|豪宅|房东|补拍|安全线|黑屏/.test(line.text) ? 1 + (variant === 2 ? 1 : 0) : 0;
    delta.buzz += /黑屏|钩子|留在|碎|审判|灯火|红毯/.test(line.text) ? 1 + (variant === 1 ? 1 : 0) : 0;
    delta.control -= /围观|冲|撞|碎|黑屏|彻底/.test(line.text) ? 1 : 0;
    if (delta.budget || delta.buzz || delta.control) reasons.push('场面调度成本');
  }

  if (line.type === 'dialogue' && /强吻|下跪|有病|疯|离婚|顾家|白月光|外人|由不得|下贱|女主人|少夫人|排队/.test(line.text)) {
    delta.buzz += /下贱|疯|强吻|女主人|排队/.test(line.text) ? 3 + (variant === 3 ? 1 : 0) : 1 + (variant % 2);
    delta.dignity -= /下贱|下跪|强吻|羞辱|外人|女主人|少夫人/.test(line.text) ? 2 : 1;
    delta.control -= /由不得|疯|顾家|抢|吻|跪/.test(line.text) ? 2 + (variant === 1 ? 1 : 0) : 1;
    reasons.push('爆点台词');
  }

  if (!delta.budget && !delta.buzz && !delta.dignity && !delta.control) return null;

  return {
    delta,
    reason: reasons.slice(0, 2).join(' / '),
  };
}

function progressLineType(type: ShootLine['type']) {
  return {
    action: '场面',
    dialogue: '台词',
    inner: '内心',
    director: '场面',
    actor_reaction: '反应',
  }[type];
}

function progressLineSpeaker(line: ShootLine) {
  if (line.type === 'action' || line.type === 'director' || line.type === 'inner') return '镜头';
  return line.speaker;
}

function ScoreDeltaBadges({ delta }: { delta?: Stats }) {
  const labels = scoreDeltaLabels(delta);
  if (labels.length === 0) return null;
  return (
    <span className="play-score-badges">
      {labels.map((label) => (
        <span key={label}>{label}</span>
      ))}
    </span>
  );
}

export default function PlayPage() {
  const router = useRouter();
  const [session, setSession] = useState<GameSession | null>(null);
  const [acts, setActs] = useState<ActDraft[]>([]);
  const [actorStates, setActorStates] = useState<ActorState[]>([]);
  const [canonLedger, setCanonLedger] = useState<CanonEntry[]>([]);
  const [stats, setStats] = useState<Stats>(initialStats);
  const [actIndex, setActIndex] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [usedThisAct, setUsedThisAct] = useState(0);
  const [actOutcomes, setActOutcomes] = useState<Record<string, ActDraft['defaultOutcome']>>({});
  const [revisedActs, setRevisedActs] = useState<Record<string, boolean>>({});
  const [accidents, setAccidents] = useState<string[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rewriteOpen, setRewriteOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [rewritePrompt, setRewritePrompt] = useState('');
  const [epilogue, setEpilogue] = useState<EpilogueResponse | null>(null);
  const [autoMode, setAutoMode] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [scoredLineIds, setScoredLineIds] = useState<string[]>([]);
  const progressListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem('short-drama-session');
    if (!raw) {
      router.push('/');
      return;
    }
    const parsed = JSON.parse(raw) as GameSession;
    setSession(parsed);
    setStats(parsed.stats);
    setActorStates(
      parsed.casting.map((cast) => {
        const recruit = parsed.recruitResults.find((item) => item.actorId === cast.actorId);
        const actor = parsed.selectedActors.find((item) => item.id === cast.actorId);
        return {
          actorId: cast.actorId,
          actorName: cast.actorName,
          scriptRoleId: cast.scriptRoleId,
          scriptRoleName: cast.scriptRoleName,
          mindset: recruit?.mindset || {
            description: '临时被拉来救场。',
            behaviorBias: actor?.lossDirection || '会按自己的现实身份理解短剧。',
            conflictTriggers: [actor?.uncontrolledPoint || '片场失控'],
            toolSensitivity: {
              cut: '会紧张',
              rewrite: '会重新理解台词',
              chicken: '会重新计算这份活值不值',
              demo: '会照着模仿但带偏',
            },
          },
          mood: '入组',
          pressure: 0,
          bias: recruit?.mindset.behaviorBias || actor?.lossDirection || '',
        };
      })
    );
  }, [router]);

  useEffect(() => {
    installAudioUnlock();
    playBgm('/audio/bgm-shooting.mp3', 0.22);
    return () => stopBgm();
  }, []);

  useEffect(() => {
    if (!session || acts.length > 0 || loading) return;
    const generateDraft = async () => {
      setLoading('生成第一集拍摄稿');
      setError(null);
      try {
        const res = await fetch('/api/draft', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            project: session.project,
            scriptSkeleton,
            casting: session.casting,
            selectedActors: session.selectedActors,
            recruitResults: session.recruitResults,
            initialStats: session.stats,
          }),
        });
        if (!res.ok) throw new Error('生成拍摄稿失败');
        const data = (await res.json()) as { episodeDraft: ActDraft[] };
        setActs(sanitizeVisibleActDrafts(data.episodeDraft));
      } catch (err) {
        setError(err instanceof Error ? err.message : '生成拍摄稿失败');
      } finally {
        setLoading(null);
      }
    };
    generateDraft();
  }, [acts.length, loading, session]);

  useEffect(() => {
    if (acts.length === 0) return;
    const sanitizedActs = sanitizeVisibleActDrafts(acts);
    const removedLines = sanitizedActs.some(
      (act, index) => act.lines.length !== acts[index]?.lines.length
    );
    if (!removedLines) return;
    setActs(sanitizedActs);
    setLineIndex((current) => {
      const maxIndex = Math.max(0, (sanitizedActs[actIndex]?.lines.length || 1) - 1);
      return Math.min(current, maxIndex);
    });
  }, [actIndex, acts]);

  const currentAct = acts[actIndex];
  const currentLine = currentAct?.lines[lineIndex];
  const interventionLimit = actIndex === 1 || actIndex === 5 || actIndex === 7 ? 2 : 1;
  const canIntervene = Boolean(currentLine) && usedThisAct < interventionLimit && !loading;
  const historyLines = currentAct ? currentAct.lines.slice(Math.max(0, lineIndex - 6), lineIndex + 1) : [];
  const shootingProgressRows = useMemo(() => {
    if (!currentAct) return [];
    const rows: Array<{
      id: string;
      scriptLine: ShootLine | null;
      reactions: ShootLine[];
      active: boolean;
    }> = [];
    currentAct.lines.slice(0, lineIndex + 1).forEach((line) => {
      if (line.type === 'actor_reaction') {
        const target =
          rows.findLast((row) => row.scriptLine?.sourceBeatId && row.scriptLine.sourceBeatId === line.sourceBeatId) ||
          rows.at(-1);
        if (target) {
          target.reactions.push(line);
          if (line.lineId === currentLine?.lineId) target.active = true;
          return;
        }
        rows.push({
          id: line.lineId,
          scriptLine: null,
          reactions: [line],
          active: line.lineId === currentLine?.lineId,
        });
        return;
      }
      rows.push({
        id: line.lineId,
        scriptLine: line,
        reactions: [],
        active: line.lineId === currentLine?.lineId,
      });
    });
    return rows.slice(-7);
  }, [currentAct, currentLine?.lineId, lineIndex]);

  useEffect(() => {
    const progressList = progressListRef.current;
    if (!progressList) return;
    progressList.scrollTo({
      top: progressList.scrollHeight,
      behavior: 'smooth',
    });
  }, [shootingProgressRows]);

  useEffect(() => {
    if (!currentLine || loading || scoredLineIds.includes(currentLine.lineId)) return;
    const impact = lineScoreImpact(currentLine);
    setScoredLineIds((current) => [...current, currentLine.lineId]);
    if (!impact) return;
    setStats((current) => applyStats(current, impact.delta));
  }, [currentLine, loading, scoredLineIds]);

  const isBlackoutLine =
    currentLine?.speaker === '镜头' && currentLine.text.replace(/[。.!！?\s]/g, '') === '黑屏';
  const currentBackground = isBlackoutLine
    ? '__blackout__'
    : currentAct
    ? actBackgrounds[currentAct.actId] || '/pixels/scene-gu-banquet-corridor.png'
    : '/pixels/scene-gu-banquet-corridor.png';
  const isPreparingDraft = loading === '生成第一集拍摄稿';
  const isGeneratingEpilogue = loading === '生成样片结算';
  const isBlockingLoading = isPreparingDraft || isGeneratingEpilogue;

  const currentSpeakerCasting = useMemo(() => {
    if (!session || !currentLine || currentLine.speaker === '镜头') return null;
    return session.casting.find((cast) => {
      const roleNames = cast.scriptRoleName.split('/').map((item) => item.trim());
      return (
        currentLine.speaker === cast.actorName ||
        roleNames.some((name) => currentLine.speaker.includes(name)) ||
        currentLine.speaker.includes(cast.scriptRoleName)
      );
    });
  }, [currentLine, session]);

  const currentSpeakerActor = currentSpeakerCasting
    ? actors.find((actor) => actor.id === currentSpeakerCasting.actorId)
    : null;
  const currentSpeakerPortrait = currentSpeakerCasting
    ? currentLine?.type === 'actor_reaction'
      ? currentSpeakerActor?.avatar ||
        roleActorPortraits[currentSpeakerCasting.scriptRoleId]?.[currentSpeakerCasting.actorId] ||
        rolePortraits[currentSpeakerCasting.scriptRoleId]
      : roleActorPortraits[currentSpeakerCasting.scriptRoleId]?.[currentSpeakerCasting.actorId] ||
        rolePortraits[currentSpeakerCasting.scriptRoleId] ||
        currentSpeakerActor?.avatar
    : null;
  const currentSpeakerDisplayName =
    currentLine?.type === 'actor_reaction'
      ? currentSpeakerActor?.name || currentLine?.speaker
      : currentSpeakerCasting?.scriptRoleName || currentLine?.speaker;

  const currentSkeleton = useMemo(
    () => (currentAct ? scriptSkeleton.find((item) => item.actId === currentAct.actId) : null),
    [currentAct]
  );

  const reviseActIfNeeded = useCallback(
    async (nextIndex: number, ledgerOverride?: CanonEntry[]) => {
      const nextAct = acts[nextIndex];
      const skeleton = scriptSkeleton.find((item) => item.actId === nextAct?.actId);
      const ledger = ledgerOverride || canonLedger;
      if (!session || !nextAct || !skeleton) return;
      const toolEntries = ledger.filter((entry) => entry.toolType && entry.toolType !== 'roll');
      const affected = toolEntries.some((entry) => (entry.affectedFutureActs || []).includes(nextAct.actId));
      if (!affected || revisedActs[nextAct.actId]) return;

      setLoading('按片场事实修订下一幕');
      try {
        const res = await fetch('/api/revise-act', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            project: session.project,
            actId: nextAct.actId,
            originalActDraft: nextAct,
            scriptSkeletonAct: skeleton,
            canonLedger: ledger,
            actorStates,
            stats,
          }),
        });
        if (!res.ok) throw new Error('修订下一幕失败');
        const data = (await res.json()) as { revisedAct: ActDraft };
        const revisedAct = sanitizeVisibleActDrafts([data.revisedAct])[0];
        setActs((current) =>
          current.map((item, index) => (index === nextIndex ? revisedAct : item))
        );
        setRevisedActs((current) => ({ ...current, [nextAct.actId]: true }));
      } catch (err) {
        setError(err instanceof Error ? err.message : '修订下一幕失败');
      } finally {
        setLoading(null);
      }
    },
    [acts, actorStates, canonLedger, revisedActs, session, stats]
  );

  const finishAct = useCallback(async () => {
    if (!currentAct) return;
    const hasInterventionOutcome = Boolean(actOutcomes[currentAct.actId]);
    const outcome = actOutcomes[currentAct.actId] || currentAct.defaultOutcome;
    const nextLedger: CanonEntry[] = [
      ...canonLedger,
      {
        actId: currentAct.actId,
        toolType: hasInterventionOutcome ? undefined : 'roll',
        memory: outcome.memory,
      },
    ];
    if (!hasInterventionOutcome) {
      setStats((current) => applyStats(current, outcome.statDelta));
    }
    setCanonLedger(nextLedger);

    if (actIndex >= acts.length - 1) {
      return;
    }
    const nextIndex = actIndex + 1;
    setActIndex(nextIndex);
    setLineIndex(0);
    setUsedThisAct(0);
    await reviseActIfNeeded(nextIndex, nextLedger);
  }, [actIndex, actOutcomes, acts.length, canonLedger, currentAct, reviseActIfNeeded]);

  const nextLine = useCallback(async () => {
    if (!currentAct || loading) return;
    if (lineIndex < currentAct.lines.length - 1) {
      setLineIndex((current) => current + 1);
      return;
    }
    await finishAct();
  }, [currentAct, finishAct, lineIndex, loading]);

  useEffect(() => {
    if (!autoMode || loading || rewriteOpen || epilogue || !currentAct || !currentLine) return;
    const isFinalLine = actIndex >= acts.length - 1 && lineIndex >= currentAct.lines.length - 1;
    if (isFinalLine) return;

    const delay = Math.min(4800, Math.max(1700, currentLine.text.length * 70));
    const timer = window.setTimeout(() => {
      void nextLine();
    }, delay);
    return () => window.clearTimeout(timer);
  }, [
    actIndex,
    acts.length,
    autoMode,
    currentAct,
    currentLine,
    epilogue,
    lineIndex,
    loading,
    nextLine,
    rewriteOpen,
  ]);

  const applyIntervention = (toolType: ToolType, data: InterventionResponse) => {
    if (!currentAct || !currentLine) return;
    const playedBefore = currentAct.lines.slice(0, lineIndex);
    const newLines = [
      ...playedBefore,
      data.immediate.replacementCurrentLine,
      ...data.immediate.patchedRemainingLines,
    ];
    const sanitizedAct = sanitizeVisibleActDrafts([
      {
        ...currentAct,
        lines: newLines,
        defaultOutcome: data.actOutcome,
      },
    ])[0];
    setActs((current) =>
      current.map((act, index) =>
        index === actIndex
          ? sanitizedAct
          : act
      )
    );
    setActOutcomes((current) => ({ ...current, [currentAct.actId]: data.actOutcome }));
    setCanonLedger((current) => [
      ...current,
      {
        patchId: data.globalPatch.patchId,
        actId: currentAct.actId,
        lineId: currentLine.lineId,
        toolType,
        memory: data.actOutcome.memory,
        canonChange: data.globalPatch.canonChange,
        futureDirectives: data.globalPatch.futureDirectives,
        affectedFutureActs: data.globalPatch.affectedFutureActs,
      },
    ]);
    setStats((current) => applyStats(current, data.statDelta));
    setActorStates((current) =>
      current.map((actor) => {
        const delta = data.actorStateDelta.find((item) => item.actorId === actor.actorId);
        if (!delta) return actor;
        return {
          ...actor,
          mood: delta.mood,
          pressure: Math.max(0, actor.pressure + delta.pressureDelta),
          bias: delta.biasChange || actor.bias,
        };
      })
    );
    setAccidents((current) => [...current, data.accidentTag]);
    setUsedThisAct((current) => current + 1);
    playOneShot(toolType === 'cut' ? '/audio/sfx-thunder.wav' : '/audio/sfx-task-sparkle.mp3', 0.42);
  };

  const useTool = async (toolType: ToolType, rewrite?: { text: string; prompt: string }) => {
    if (!session || !currentAct || !currentLine || !canIntervene) return;
    setRewriteOpen(false);
    const currentBeat = currentSkeleton?.beats.find((beat) => beat.beatId === currentLine.sourceBeatId);
    const currentBeatIndex = currentBeat
      ? currentSkeleton?.beats.findIndex((beat) => beat.beatId === currentBeat.beatId) ?? -1
      : -1;
    const remainingBeats =
      currentSkeleton && currentBeatIndex >= 0 ? currentSkeleton.beats.slice(currentBeatIndex + 1) : undefined;
    setLoading('工具正在改写片场事实');
    setError(null);
    try {
      const res = await fetch('/api/intervene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: session.project,
          actId: currentAct.actId,
          lineId: currentLine.lineId,
          toolType,
          currentLine,
          currentBeat,
          playedLines: currentAct.lines.slice(0, lineIndex),
          remainingLines: currentAct.lines.slice(lineIndex + 1),
          remainingBeats,
          canonLedger,
          actorStates,
          stats,
          interventionBudget: {
            usedThisAct,
            limitThisAct: interventionLimit,
          },
          selectedText: rewrite?.text,
          playerRewritePrompt: rewrite?.prompt,
        }),
      });
      if (!res.ok) throw new Error('工具干预失败');
      const data = (await res.json()) as InterventionResponse;
      applyIntervention(toolType, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '工具干预失败');
    } finally {
      setLoading(null);
    }
  };

  const generateEpilogue = async () => {
    if (!session) return;
    setLoading('生成样片结算');
    setError(null);
    try {
      const finalAct = currentAct;
      const finalHasIntervention = finalAct ? Boolean(actOutcomes[finalAct.actId]) : false;
      const finalOutcome = finalAct
        ? actOutcomes[finalAct.actId] || finalAct.defaultOutcome
        : null;
      const finalStats =
        finalOutcome && !finalHasIntervention ? applyStats(stats, finalOutcome.statDelta) : stats;
      const finalLedger =
        finalOutcome && finalAct
          ? [
              ...canonLedger,
              {
                actId: finalAct.actId,
                toolType: finalHasIntervention ? undefined : ('roll' as const),
                memory: finalOutcome.memory,
              },
            ]
          : canonLedger;
      const res = await fetch('/api/epilogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectTitle: session.project.title,
          selectedActors: session.casting.map((cast) => {
            const recruit = session.recruitResults.find((item) => item.actorId === cast.actorId);
            return {
              actorId: cast.actorId,
              name: cast.actorName,
              scriptRole: cast.scriptRoleName,
              mindset: recruit?.mindset.description || '',
            };
          }),
          canonLedger: finalLedger,
          collectedAccidents: accidents,
          finalStats,
        }),
      });
      if (!res.ok) throw new Error('生成结算失败');
      const data = (await res.json()) as EpilogueResponse;
      setStats(finalStats);
      setCanonLedger(finalLedger);
      setEpilogue(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成结算失败');
    } finally {
      setLoading(null);
    }
  };

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg-deep">
        <LoadingIndicator text="进入片场" />
      </main>
    );
  }

  if (epilogue) {
    return (
      <main className="min-h-screen bg-bg-deep px-5 py-8 text-text-primary">
        <div className="mx-auto max-w-3xl border border-border bg-bg-card p-6">
          <div className="pixel-text mb-3 text-xs tracking-[0.3em] text-accent-blue">
            SAMPLE LOCKED
          </div>
          <h1 className="mb-4 text-3xl font-black text-accent-gold">{epilogue.sampleTitle}</h1>
          <div className="mb-5 flex flex-wrap gap-2">
            {epilogue.flavorTags.map((tag) => (
              <span key={tag} className="border border-accent-gold/30 px-2 py-1 text-xs text-accent-gold">
                {tag}
              </span>
            ))}
          </div>
          <p className="mb-5 leading-8 text-text-primary">{epilogue.description}</p>
          <p className="mb-5 border-l border-accent-blue pl-4 text-sm leading-7 text-text-secondary">
            {epilogue.highlight}
          </p>
          <p className="mb-6 text-sm leading-7 text-text-dim">{epilogue.verdict}</p>
          <div className="mb-6 border border-border bg-bg-deep p-4 text-center text-accent-gold">
            “{epilogue.shareText}”
          </div>
          <button
            onClick={() => router.push('/')}
            className="border border-accent-gold px-6 py-2 text-sm text-accent-gold hover:bg-accent-gold/10 pixel-text"
          >
            重新开一组
          </button>
        </div>
      </main>
    );
  }

  const playCharacters =
    currentSpeakerPortrait && currentLine?.speaker !== '镜头'
      ? [
          {
            id: currentSpeakerCasting?.scriptRoleId || currentLine?.speaker || 'speaker',
            name: currentSpeakerDisplayName || '角色',
            image: currentSpeakerPortrait,
            position: 'center' as const,
            active: true,
          },
        ]
      : [];

  return (
    <>
      <VNStage
        background={currentBackground}
        title={currentAct?.title || session.project.title}
        subtitle={`第 ${actIndex + 1}/${acts.length || 9} 幕 · ${currentAct ? lineIndex + 1 : 0}/${currentAct?.lines.length || 0} 句`}
        speaker={currentLine?.speaker || '片场'}
        text={currentLine?.text || (loading ? loading : '正在准备片场。')}
        kind={vnKindFromLine(currentLine?.type)}
        characters={playCharacters}
        layout="shooting"
        characterDisplay="stage"
        controls={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHistoryOpen((current) => !current)}
              className="border border-border px-3 py-2 text-xs text-text-secondary"
            >
              记录
            </button>
            <button
              onClick={() => setAutoMode((current) => !current)}
              className={`border px-3 py-2 text-xs ${
                autoMode ? 'border-accent-blue text-accent-blue' : 'border-accent-gold text-accent-gold'
              }`}
            >
              {autoMode ? '自动' : '手动'}
            </button>
            {!autoMode && currentLine && (
              <button
                disabled={Boolean(loading)}
                onClick={
                  actIndex >= acts.length - 1 && lineIndex >= (currentAct?.lines.length || 1) - 1
                    ? generateEpilogue
                    : nextLine
                }
                className="border border-accent-gold px-3 py-2 text-xs text-accent-gold disabled:opacity-40"
              >
                {actIndex >= acts.length - 1 && lineIndex >= (currentAct?.lines.length || 1) - 1
                  ? '生成样片'
                  : '下一句'}
              </button>
            )}
            {autoMode && currentLine && actIndex >= acts.length - 1 && lineIndex >= (currentAct?.lines.length || 1) - 1 && (
              <button
                disabled={Boolean(loading)}
                onClick={generateEpilogue}
                className="border border-accent-gold px-3 py-2 text-xs text-accent-gold disabled:opacity-40"
              >
                生成样片
              </button>
            )}
          </div>
        }
        overlay={
          <div className="play-hud">
            <div className="play-left-stack">
              <div className="play-panel play-status-panel">
                <div className="mb-3 text-sm font-bold text-accent-gold">片场状态</div>
                <div className="grid grid-cols-4 gap-2">
                  {(Object.keys(stats) as Array<keyof Stats>).map((key) => (
                    <div key={key} className="border border-border bg-bg-card/80 px-2 py-1 text-center">
                      <div className="text-[10px] text-text-dim">{statLabel(key)}</div>
                      <div className="text-sm font-bold text-accent-gold">{stats[key]}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="play-panel play-progress-panel">
                <div className="mb-3 text-sm font-bold text-accent-gold">片场进度</div>
                <div className="play-progress-head">
                  <span>剧本 / 镜头调度</span>
                  <span>演员反应</span>
                </div>
                <div ref={progressListRef} className="play-progress-list">
                  {shootingProgressRows.length === 0 ? (
                    <div className="play-progress-empty">正在等第一句开拍。</div>
                  ) : (
                    shootingProgressRows.map((row) => (
                      <div key={row.id} className={`play-progress-row ${row.active ? 'is-active' : ''}`}>
                        <div className="play-progress-cell">
                          {row.scriptLine ? (
                            <>
                              <div className="play-progress-meta">
                                {progressLineSpeaker(row.scriptLine)} · {progressLineType(row.scriptLine.type)}
                              </div>
                              <p>{row.scriptLine.type === 'dialogue' ? `“${row.scriptLine.text}”` : row.scriptLine.text}</p>
                              <ScoreDeltaBadges delta={lineScoreImpact(row.scriptLine)?.delta} />
                            </>
                          ) : (
                            <span className="text-text-dim">上一句拍法延伸</span>
                          )}
                        </div>
                        <div className="play-progress-cell reaction">
                          {row.reactions.length > 0 ? (
                            row.reactions.map((reaction) => (
                              <p key={reaction.lineId}>
                                <span>{reaction.speaker}：</span>
                                {reaction.text}
                                <ScoreDeltaBadges delta={lineScoreImpact(reaction)?.delta} />
                              </p>
                            ))
                          ) : (
                            <span className="text-text-dim">还没有现场反应</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {historyOpen && (
                <div className="play-panel max-h-64 overflow-y-auto p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-xs text-accent-blue">最近几句</div>
                    <button onClick={() => setHistoryOpen(false)} className="text-xs text-text-dim">
                      收起
                    </button>
                  </div>
                  <div className="space-y-2">
                    {historyLines.map((lineItem) => (
                      <div key={lineItem.lineId} className={`border p-3 ${lineTone(lineItem.riskSignal)}`}>
                        <div className="mb-1 text-xs text-accent-gold">{lineItem.speaker}</div>
                        <p className="text-xs leading-6 text-text-secondary">
                          {lineItem.type === 'dialogue' ? `“${lineItem.text}”` : lineItem.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentLine?.innerThought && (
                <div className="play-inner-note">
                  画外内心：{currentLine.innerThought}
                </div>
              )}
              {loading && !isBlockingLoading && (
                <div className="play-panel play-loading-panel">
                  <LoadingIndicator text={loading} />
                </div>
              )}
              {error && <div className="play-panel border-accent-red/40 bg-accent-red/10 text-sm text-accent-red">{error}</div>}
            </div>

            <aside className="play-sidebar">
              <div className="play-panel">
                <div className="mb-1 text-xs text-accent-blue">场记板</div>
                <p>{currentAct?.title || '正在准备片场。'}</p>
                <p className="mt-2 text-xs text-text-dim">
                  本幕干预 {usedThisAct}/{interventionLimit} · 片场每一秒都在烧钱
                </p>
              </div>

              <div className="play-panel">
                <div className="mb-3 text-sm font-bold text-accent-gold">导演工具</div>
                <div className="grid grid-cols-2 gap-2">
                  {tools.map((tool) => (
                    <button
                      key={tool.id}
                      disabled={!canIntervene}
                      onClick={() => {
                        if (tool.id === 'rewrite') {
                          setSelectedText(currentLine?.text || '');
                          setRewritePrompt('');
                          setRewriteOpen(true);
                        } else {
                          useTool(tool.id);
                        }
                      }}
                      className="director-tool-button border border-border bg-bg-card/80 text-left transition-colors hover:border-accent-gold disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <div className="mb-1 text-lg">{tool.icon}</div>
                      <div className="text-accent-gold">{tool.name}</div>
                      <div className="mt-1 text-xs leading-5 text-text-dim">{tool.description}</div>
                    </button>
                  ))}
                </div>
              </div>

            </aside>
          </div>
        }
      />

      {isBlockingLoading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-bg-deep/72 px-6 backdrop-blur-sm">
          <div className="shooting-loading-card">
            {isPreparingDraft && (
              <>
                <div className="pixel-text text-xs text-accent-blue">ROLLING IN</div>
                <div className="shooting-countdown" aria-hidden="true">
                  <span>3</span>
                  <span>2</span>
                  <span>1</span>
                </div>
              </>
            )}
            <LoadingIndicator text={loading} />
          </div>
        </div>
      )}

      {rewriteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-deep/80 px-4 backdrop-blur">
          <div className="w-full max-w-xl border border-border bg-bg-card p-5 shadow-2xl">
            <h3 className="mb-3 text-lg font-bold text-accent-gold">改词</h3>
            <label className="mb-2 block text-xs text-text-dim">选中的剧本文字</label>
            <div className="mb-4 min-h-20 w-full border border-border bg-bg-deep/80 p-3 text-sm leading-7 text-text-primary">
              {selectedText}
            </div>
            <label className="mb-2 block text-xs text-text-dim">你想怎么改</label>
            <input
              value={rewritePrompt}
              onChange={(event) => setRewritePrompt(event.target.value)}
              placeholder="比如：更狠，但别脏；不要真亲，改成语言压迫"
              className="mb-5 w-full border border-border bg-bg-deep p-3 text-sm text-text-primary outline-none focus:border-accent-gold"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRewriteOpen(false)}
                className="border border-border px-5 py-2 text-sm text-text-secondary"
              >
                取消
              </button>
              <button
                onClick={() =>
                  useTool('rewrite', {
                    text: selectedText,
                    prompt: rewritePrompt || '让这句更能继续拍下去',
                  })
                }
                className="border border-accent-gold bg-accent-gold/15 px-5 py-2 text-sm text-accent-gold"
              >
                提交改词
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
