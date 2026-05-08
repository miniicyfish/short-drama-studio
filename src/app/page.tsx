'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingIndicator from '@/components/LoadingIndicator';
import { actors, assignCasting, initialStats, project } from '@/lib/gameData';
import { GameSession, RecruitResult } from '@/lib/gameTypes';

type Stage = 'project' | 'casting' | 'persuasion' | 'result';

export default function Home() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('project');
  const [selectedActorIds, setSelectedActorIds] = useState<string[]>([]);
  const [words, setWords] = useState<Record<string, string>>({});
  const [recruitResults, setRecruitResults] = useState<RecruitResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedActors = useMemo(
    () => actors.filter((actor) => selectedActorIds.includes(actor.id)),
    [selectedActorIds]
  );
  const casting = useMemo(() => assignCasting(selectedActors), [selectedActors]);

  const toggleActor = (actorId: string) => {
    setSelectedActorIds((current) => {
      if (current.includes(actorId)) {
        return current.filter((id) => id !== actorId);
      }
      if (current.length >= 4) return current;
      return [...current, actorId];
    });
  };

  const recruit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/recruit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project,
          selectedActors: selectedActors.map((actor) => ({
            ...actor,
            playerWord: words[actor.id] || actor.defaultWord,
          })),
        }),
      });

      if (!res.ok) throw new Error('入组心态生成失败');
      const data = (await res.json()) as { recruitResults: RecruitResult[] };
      setRecruitResults(data.recruitResults);
      setStage('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : '入组心态生成失败');
    } finally {
      setLoading(false);
    }
  };

  const start = () => {
    const session: GameSession = {
      project,
      selectedActors,
      persuasionWords: Object.fromEntries(
        selectedActors.map((actor) => [actor.id, words[actor.id] || actor.defaultWord])
      ),
      recruitResults,
      casting,
      stats: initialStats,
    };
    window.localStorage.setItem('short-drama-session', JSON.stringify(session));
    router.push('/play');
  };

  return (
    <main className="min-h-screen bg-bg-deep text-text-primary">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-8">
        <header className="mb-8 flex items-start justify-between border-b border-border pb-5">
          <div>
            <div className="pixel-text mb-2 text-xs tracking-[0.35em] text-accent-blue">
              SHORT DRAMA STUDIO
            </div>
            <h1 className="text-3xl font-black text-accent-gold md:text-5xl">
              我的短剧超失控
            </h1>
          </div>
          <div className="hidden max-w-xs text-right text-sm leading-6 text-text-dim md:block">
            片场每一秒都在烧钱。你不能解决所有问题，只能在最要命的时候出手。
          </div>
        </header>

        {stage === 'project' && (
          <section className="grid flex-1 gap-6 md:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col justify-center">
              <div className="mb-5 text-sm text-text-dim">本次样片</div>
              <h2 className="mb-5 max-w-3xl text-4xl font-black leading-tight text-text-primary md:text-6xl">
                {project.title}
              </h2>
              <p className="mb-6 max-w-2xl text-lg leading-8 text-text-secondary">
                {project.logline}
              </p>
              <div className="mb-10 inline-flex w-fit border border-accent-gold/40 px-3 py-1 text-xs text-accent-gold">
                {project.tone}
              </div>
              <button
                onClick={() => setStage('casting')}
                className="w-fit border border-accent-gold bg-accent-gold/15 px-8 py-3 text-sm text-accent-gold transition-colors hover:bg-accent-gold/25 pixel-text"
              >
                开始捞人
              </button>
            </div>
            <div className="relative min-h-96 overflow-hidden border border-border bg-bg-card">
              <Image src={project.cover} alt={project.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg-deep/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 border border-border bg-bg-deep/75 p-4 backdrop-blur">
                <p className="text-sm leading-7 text-text-secondary">
                  剧本骨架固定，但每一次喊卡、改词、加鸡腿和导演示范，都会写进本局片场事实账本，改变剩下所有幕。
                </p>
              </div>
            </div>
          </section>
        )}

        {stage === 'casting' && (
          <section>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2 className="mb-2 text-2xl font-bold text-accent-gold">6 选 4</h2>
                <p className="text-sm text-text-dim">
                  你选的不是谁更会演，而是这条片子会以什么方式失控。
                </p>
              </div>
              <div className="text-sm text-text-secondary">已选 {selectedActorIds.length}/4</div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {actors.map((actor) => {
                const selected = selectedActorIds.includes(actor.id);
                return (
                  <button
                    key={actor.id}
                    onClick={() => toggleActor(actor.id)}
                    className={`group text-left border p-4 transition-all ${
                      selected
                        ? 'border-accent-gold bg-accent-gold/10'
                        : 'border-border bg-bg-card hover:border-accent-blue/60'
                    }`}
                  >
                    <div className="mb-3 flex gap-3">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-border bg-bg-surface">
                        <Image src={actor.avatar} alt={actor.name} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-accent-gold">{actor.name}</div>
                        <div className="mb-2 text-xs text-accent-blue">{actor.label}</div>
                        <div className="text-xs leading-5 text-text-dim">{actor.hook}</div>
                      </div>
                    </div>
                    <p className="mb-2 text-xs leading-5 text-text-secondary">{actor.weirdValue}</p>
                    <p className="text-xs leading-5 text-accent-red/80">{actor.lossDirection}</p>
                  </button>
                );
              })}
            </div>
            <div className="mt-8 flex justify-end">
              <button
                disabled={selectedActorIds.length !== 4}
                onClick={() => setStage('persuasion')}
                className="border border-accent-gold px-8 py-3 text-sm text-accent-gold transition-colors hover:bg-accent-gold/10 disabled:cursor-not-allowed disabled:opacity-40 pixel-text"
              >
                去说服他们
              </button>
            </div>
          </section>
        )}

        {stage === 'persuasion' && (
          <section>
            <h2 className="mb-2 text-2xl font-bold text-accent-gold">一句话说服</h2>
            <p className="mb-6 text-sm text-text-dim">
              每个人只填一个词。这个词会变成他的入组心态，并写进后续所有拍摄 prompt。
            </p>
            <div className="space-y-4">
              {selectedActors.map((actor) => (
                <div key={actor.id} className="border border-border bg-bg-card p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden border border-border">
                      <Image src={actor.avatar} alt={actor.name} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-accent-gold">{actor.name}</div>
                      <div className="text-xs text-text-dim">{actor.label}</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 md:flex-row md:items-center">
                    <div className="flex-1 text-sm leading-7 text-text-secondary">
                      {actor.persuasionTemplate.split('____')[0]}
                      <input
                        value={words[actor.id] ?? actor.defaultWord}
                        onChange={(event) =>
                          setWords((current) => ({
                            ...current,
                            [actor.id]: event.target.value,
                          }))
                        }
                        className="mx-2 w-28 border-b border-accent-gold bg-transparent px-2 py-1 text-center text-accent-gold outline-none"
                      />
                      {actor.persuasionTemplate.split('____')[1]}
                    </div>
                    <div className="text-xs text-text-dim">默认：{actor.defaultWord}</div>
                  </div>
                </div>
              ))}
            </div>
            {error && <div className="mt-4 text-sm text-accent-red">{error}</div>}
            {loading ? (
              <LoadingIndicator text="生成入组心态" />
            ) : (
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStage('casting')}
                  className="border border-border px-6 py-2 text-sm text-text-secondary hover:border-text-dim"
                >
                  重选演员
                </button>
                <button
                  onClick={recruit}
                  className="border border-accent-gold bg-accent-gold/15 px-8 py-3 text-sm text-accent-gold hover:bg-accent-gold/25 pixel-text"
                >
                  生成入组心态
                </button>
              </div>
            )}
          </section>
        )}

        {stage === 'result' && (
          <section>
            <h2 className="mb-2 text-2xl font-bold text-accent-gold">入组心态已写入片场</h2>
            <p className="mb-6 text-sm text-text-dim">
              之后每次拍摄和工具干预，都会带着这些心态继续滚。
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {recruitResults.map((result) => {
                const actor = actors.find((item) => item.id === result.actorId);
                const cast = casting.find((item) => item.actorId === result.actorId);
                return (
                  <div key={result.actorId} className="border border-border bg-bg-card p-4">
                    <div className="mb-3 text-sm text-accent-blue">
                      {actor?.name} 饰 {cast?.scriptRoleName}
                    </div>
                    <p className="mb-2 text-sm leading-7 text-text-primary">{result.persuasionLine}</p>
                    <p className="mb-3 text-sm leading-7 text-text-secondary">{result.actorReply}</p>
                    <div className="border border-accent-gold/25 bg-accent-gold/5 p-3 text-xs leading-6 text-accent-gold">
                      {result.mindset.description}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={start}
                className="border border-accent-gold bg-accent-gold/15 px-8 py-3 text-sm text-accent-gold hover:bg-accent-gold/25 pixel-text"
              >
                进片场开拍
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
