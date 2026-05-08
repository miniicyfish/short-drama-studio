'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingIndicator from '@/components/LoadingIndicator';
import {
  actBackgrounds,
  actors,
  initialStats,
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

function lineTone(signal: ShootLine['riskSignal']) {
  if (signal === 'critical') return 'border-accent-red/50 bg-accent-red/10';
  if (signal === 'high') return 'border-accent-gold/45 bg-accent-gold/8';
  if (signal === 'medium') return 'border-accent-blue/30 bg-accent-blue/8';
  return 'border-border bg-bg-card/85';
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
        setActs(data.episodeDraft);
      } catch (err) {
        setError(err instanceof Error ? err.message : '生成拍摄稿失败');
      } finally {
        setLoading(null);
      }
    };
    generateDraft();
  }, [acts.length, loading, session]);

  const currentAct = acts[actIndex];
  const currentLine = currentAct?.lines[lineIndex];
  const interventionLimit = actIndex === 1 || actIndex === 5 || actIndex === 7 ? 2 : 1;
  const canIntervene = Boolean(currentLine) && usedThisAct < interventionLimit && !loading;
  const visibleLines = currentAct ? currentAct.lines.slice(0, lineIndex + 1) : [];

  const currentBackground = currentAct
    ? actBackgrounds[currentAct.actId] || '/pixels/scene-gu-banquet-corridor.png'
    : '/pixels/scene-gu-banquet-corridor.png';

  const currentSpeakerCasting = useMemo(() => {
    if (!session || !currentLine || currentLine.speaker === '镜头') return null;
    return session.casting.find((cast) => {
      const roleNames = cast.scriptRoleName.split('/').map((item) => item.trim());
      return (
        roleNames.some((name) => currentLine.speaker.includes(name)) ||
        currentLine.speaker.includes(cast.scriptRoleName)
      );
    });
  }, [currentLine, session]);

  const currentSpeakerActor = currentSpeakerCasting
    ? actors.find((actor) => actor.id === currentSpeakerCasting.actorId)
    : null;
  const currentSpeakerPortrait = currentSpeakerCasting
    ? rolePortraits[currentSpeakerCasting.scriptRoleId] || currentSpeakerActor?.avatar
    : null;

  const currentSkeleton = useMemo(
    () => (currentAct ? scriptSkeleton.find((item) => item.actId === currentAct.actId) : null),
    [currentAct]
  );

  const affectedByLedger = useCallback(
    (actId: string) =>
      canonLedger.some(
        (entry) =>
          (entry.affectedFutureActs || []).includes(actId) ||
          (entry.futureDirectives && entry.futureDirectives.length > 0)
      ),
    [canonLedger]
  );

  const reviseActIfNeeded = useCallback(
    async (nextIndex: number, ledgerOverride?: CanonEntry[]) => {
      const nextAct = acts[nextIndex];
      const skeleton = scriptSkeleton.find((item) => item.actId === nextAct?.actId);
      const ledger = ledgerOverride || canonLedger;
      if (!session || !nextAct || !skeleton) return;
      const affected = ledger.some(
        (entry) =>
          (entry.affectedFutureActs || []).includes(nextAct.actId) ||
          (entry.futureDirectives && entry.futureDirectives.length > 0)
      );
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
        setActs((current) =>
          current.map((item, index) => (index === nextIndex ? data.revisedAct : item))
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

  const nextLine = async () => {
    if (!currentAct || loading) return;
    if (lineIndex < currentAct.lines.length - 1) {
      setLineIndex((current) => current + 1);
      return;
    }
    await finishAct();
  };

  const applyIntervention = (toolType: ToolType, data: InterventionResponse) => {
    if (!currentAct || !currentLine) return;
    const playedBefore = currentAct.lines.slice(0, lineIndex);
    const newLines = [
      ...playedBefore,
      data.immediate.replacementCurrentLine,
      ...data.immediate.patchedRemainingLines,
    ];
    setActs((current) =>
      current.map((act, index) =>
        index === actIndex
          ? {
              ...act,
              lines: newLines,
              defaultOutcome: data.actOutcome,
            }
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
  };

  const useTool = async (toolType: ToolType, rewrite?: { text: string; prompt: string }) => {
    if (!session || !currentAct || !currentLine || !canIntervene) return;
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
      setRewriteOpen(false);
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

  return (
    <main className="min-h-screen bg-bg-deep text-text-primary">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col">
        <header className="border-b border-border bg-bg-deep/95 px-4 py-3">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-accent-gold">{session.project.title}</div>
              <div className="text-xs text-text-dim">
                第 {actIndex + 1}/{acts.length || 9} 幕 · {currentAct?.title || '生成中'}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(stats) as Array<keyof Stats>).map((key) => (
                <div key={key} className="min-w-16 border border-border bg-bg-card px-2 py-1 text-center">
                  <div className="text-[10px] text-text-dim">{statLabel(key)}</div>
                  <div className="text-sm font-bold text-accent-gold">{stats[key]}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-xs text-text-dim">
            本幕可干预：{usedThisAct}/{interventionLimit}。片场每一秒都在烧钱，不能每个问题都掰开揉碎。
          </div>
        </header>

        <section className="grid flex-1 md:grid-cols-[1fr_360px]">
          <div className="relative min-h-[620px] overflow-hidden border-r border-border">
            <Image src={currentBackground} alt={currentAct?.title || '片场'} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-bg-deep/30 via-bg-deep/5 to-bg-deep/95" />

            <div className="absolute left-4 right-4 top-4 border border-border bg-bg-deep/80 p-4 backdrop-blur">
              <div className="mb-2 text-xs text-accent-blue">本幕功能</div>
              <p className="text-sm leading-7 text-text-secondary">
                {currentSkeleton?.mustHappen || '正在准备片场。'}
              </p>
              {currentSkeleton && (
                <p className="mt-2 text-xs leading-6 text-accent-red/80">
                  炸点：{currentSkeleton.bombPoint}
                </p>
              )}
            </div>

            {currentSpeakerPortrait && (
              <div className="pointer-events-none absolute bottom-24 right-2 hidden h-[460px] w-[300px] md:block lg:right-8 lg:h-[520px] lg:w-[350px]">
                <Image
                  src={currentSpeakerPortrait}
                  alt={currentSpeakerCasting?.scriptRoleName || currentLine?.speaker || '角色'}
                  fill
                  className="object-contain object-bottom drop-shadow-2xl"
                  priority
                />
                <div className="absolute bottom-0 left-10 right-10 h-24 bg-gradient-to-t from-bg-deep/80 to-transparent" />
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 max-h-[56vh] overflow-y-auto p-4">
              <div className="space-y-3">
                {visibleLines.map((lineItem) => (
                  <div
                    key={lineItem.lineId}
                    className={`animate-fade-in border p-4 backdrop-blur ${lineTone(lineItem.riskSignal)}`}
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="text-sm font-bold text-accent-gold">{lineItem.speaker}</div>
                      <div className="text-xs text-text-dim">{lineItem.mood}</div>
                    </div>
                    <p className="text-sm leading-7 text-text-primary">
                      {lineItem.type === 'dialogue' ? `“${lineItem.text}”` : lineItem.text}
                    </p>
                    {lineItem.innerThought && (
                      <p className="mt-2 border-l border-accent-blue/35 pl-3 text-xs leading-6 text-text-secondary italic">
                        内心：{lineItem.innerThought}
                      </p>
                    )}
                  </div>
                ))}
                {loading && <LoadingIndicator text={loading} />}
                {error && (
                  <div className="border border-accent-red/40 bg-accent-red/10 p-3 text-sm text-accent-red">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-4 bg-bg-deep p-4">
            <div className="border border-border bg-bg-card p-4">
              <div className="mb-3 text-sm font-bold text-accent-gold">本局演员</div>
              <div className="space-y-3">
                {session.casting.map((cast) => {
                  const actor = actors.find((item) => item.id === cast.actorId);
                  const state = actorStates.find((item) => item.actorId === cast.actorId);
                  return (
                    <div key={cast.actorId} className="flex gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden border border-border">
                        {actor && <Image src={actor.avatar} alt={actor.name} fill className="object-cover" />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm text-text-primary">
                          {cast.actorName} <span className="text-text-dim">饰</span> {cast.scriptRoleName}
                        </div>
                        <div className="text-xs leading-5 text-text-dim">{state?.mindset.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border border-border bg-bg-card p-4">
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
                    className="border border-border bg-bg-deep px-3 py-3 text-left text-sm transition-colors hover:border-accent-gold disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <div className="mb-1 text-lg">{tool.icon}</div>
                    <div className="text-accent-gold">{tool.name}</div>
                    <div className="mt-1 text-xs leading-5 text-text-dim">{tool.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={Boolean(loading) || !currentAct}
              onClick={actIndex >= acts.length - 1 && lineIndex >= (currentAct?.lines.length || 1) - 1 ? generateEpilogue : nextLine}
              className="border border-accent-gold bg-accent-gold/15 px-6 py-3 text-sm text-accent-gold transition-colors hover:bg-accent-gold/25 disabled:opacity-40 pixel-text"
            >
              {actIndex >= acts.length - 1 && lineIndex >= (currentAct?.lines.length || 1) - 1
                ? '生成样片'
                : '继续拍'}
            </button>

            <div className="flex-1 border border-border bg-bg-card p-4">
              <div className="mb-3 text-sm font-bold text-accent-gold">片场事实账本</div>
              <div className="max-h-56 space-y-2 overflow-y-auto text-xs leading-5 text-text-dim">
                {canonLedger.length === 0 ? (
                  <p>还没有事故被写进本局事实。</p>
                ) : (
                  canonLedger.slice(-8).map((entry, index) => (
                    <p key={`${entry.patchId || entry.actId}-${index}`}>· {entry.memory}</p>
                  ))
                )}
              </div>
            </div>
          </aside>
        </section>
      </div>

      {rewriteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-deep/80 px-4 backdrop-blur">
          <div className="w-full max-w-xl border border-border bg-bg-card p-5 shadow-2xl">
            <h3 className="mb-3 text-lg font-bold text-accent-gold">改词</h3>
            <label className="mb-2 block text-xs text-text-dim">选中的剧本文字</label>
            <textarea
              value={selectedText}
              onChange={(event) => setSelectedText(event.target.value)}
              rows={3}
              className="mb-4 w-full border border-border bg-bg-deep p-3 text-sm text-text-primary outline-none focus:border-accent-gold"
            />
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
    </main>
  );
}
