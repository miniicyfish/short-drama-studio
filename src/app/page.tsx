'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingIndicator from '@/components/LoadingIndicator';
import { actors, assignCasting, initialStats, project } from '@/lib/gameData';
import { GameSession, RecruitResult } from '@/lib/gameTypes';

type Stage =
  | 'future-awards'
  | 'rental-room'
  | 'zhao-briefing'
  | 'project'
  | 'casting'
  | 'persuasion'
  | 'recruit-result'
  | 'pre-shoot';

const taskFlow: Array<{ id: Stage; label: string; title: string }> = [
  { id: 'future-awards', label: '任务 01', title: '看见风口' },
  { id: 'rental-room', label: '任务 02', title: '醒在十年前' },
  { id: 'zhao-briefing', label: '任务 03', title: '找到草台搭子' },
  { id: 'project', label: '任务 04', title: '确定第一条样片' },
  { id: 'casting', label: '任务 05', title: '6 选 4 捞人' },
  { id: 'persuasion', label: '任务 06', title: '逐个说服入组' },
  { id: 'pre-shoot', label: '任务 07', title: '开机前算账' },
];

const zhaoLines = [
  '老赵，前群演统筹，现任什么都接的野路子副导演。',
  '他摸得到的人，不在经纪公司，也不在表演班。他们在夜场、美甲店、写字楼门岗和失业同学群里。',
  '他说专业演员现在不信短剧，信的人你也请不起。要拍，就先从这些神人里捞。',
];

const shootRules = [
  '豪宅只租半天，超时按小时加钱。',
  '群演是临时叫来的，站久了要补钱，走了就凑不回这个阵仗。',
  '摄影、灯光、收音都是熟人价，不能陪你一条一条磨。',
  '演员不是专业班底，喊卡太多会崩，改词太多会乱，示范太多会被他们学歪。',
  '所以每幕只能有限干预。不管喊卡、改词、加鸡腿还是导演示范，都会消耗这幕机会。',
];

function taskIndex(stage: Stage) {
  const index = taskFlow.findIndex((task) => task.id === stage);
  return index < 0 ? taskFlow.length - 1 : index;
}

function nextTask(stage: Stage): Stage {
  const index = taskIndex(stage);
  return taskFlow[Math.min(index + 1, taskFlow.length - 1)].id;
}

export default function Home() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('future-awards');
  const [selectedActorIds, setSelectedActorIds] = useState<string[]>([]);
  const [words, setWords] = useState<Record<string, string>>({});
  const [recruitResults, setRecruitResults] = useState<RecruitResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentTaskIndex = taskIndex(stage);
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

      if (!res.ok) throw new Error('说服失败');
      const data = (await res.json()) as { recruitResults: RecruitResult[] };
      setRecruitResults(data.recruitResults);
      setStage('recruit-result');
    } catch (err) {
      setError(err instanceof Error ? err.message : '说服失败');
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
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-0 px-5 py-6 md:grid-cols-[260px_1fr]">
        <aside className="border-b border-border pb-4 md:border-b-0 md:border-r md:pr-5">
          <div className="pixel-text mb-2 text-xs tracking-[0.35em] text-accent-blue">
            SHORT DRAMA STUDIO
          </div>
          <h1 className="mb-6 text-3xl font-black text-accent-gold">我的短剧超失控</h1>
          <div className="space-y-2">
            {taskFlow.map((task, index) => {
              const active = task.id === stage || (stage === 'recruit-result' && task.id === 'persuasion');
              const done =
                stage === 'recruit-result'
                  ? index <= taskIndex('persuasion')
                  : index < currentTaskIndex;
              return (
                <div
                  key={task.id}
                  className={`border px-3 py-2 ${
                    active
                      ? 'border-accent-gold bg-accent-gold/10'
                      : done
                        ? 'border-accent-blue/35 bg-accent-blue/5'
                        : 'border-border bg-bg-card'
                  }`}
                >
                  <div className="text-[10px] text-text-dim">{task.label}</div>
                  <div className="text-sm text-text-primary">{task.title}</div>
                </div>
              );
            })}
          </div>
        </aside>

        <section className="min-h-screen py-6 md:pl-8">
          {stage === 'future-awards' && (
            <div className="grid min-h-[720px] gap-6 md:grid-cols-[1fr_0.9fr]">
              <div className="flex flex-col justify-center">
                <div className="mb-4 text-sm text-accent-blue">十年后 · 星芒短剧年度盛典</div>
                <h2 className="mb-5 max-w-3xl text-5xl font-black leading-tight text-text-primary">
                  追光灯扫过台上，你终于看见短剧站上了主桌。
                </h2>
                <p className="mb-4 max-w-2xl text-lg leading-8 text-text-secondary">
                  爆款项目、平台高层、演员和品牌方坐满前排。台上正在颁“年度最具商业价值短剧”，台下每个人都在谈下一轮投放。
                </p>
                <p className="mb-8 max-w-2xl text-sm leading-7 text-text-dim">
                  你坐在后排，看着那些曾经被嫌土、嫌短、嫌没门槛的东西，变成了所有人抢着入场的行业。
                </p>
                <button
                  onClick={() => setStage(nextTask(stage))}
                  className="w-fit border border-accent-gold bg-accent-gold/15 px-8 py-3 text-sm text-accent-gold transition-colors hover:bg-accent-gold/25 pixel-text"
                >
                  继续
                </button>
              </div>
              <div className="relative min-h-96 overflow-hidden border border-border bg-bg-card">
                <Image
                  src="/pixels/scene-gu-banquet-hall.png"
                  alt="短剧颁奖礼"
                  fill
                  priority
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg-deep/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 border border-border bg-bg-deep/75 p-4 text-sm leading-7 text-text-secondary backdrop-blur">
                  台上星光璀璨，台下你只想起一件事：如果能早十年入场，一切会不会不一样。
                </div>
              </div>
            </div>
          )}

          {stage === 'rental-room' && (
            <div className="mx-auto flex min-h-[720px] max-w-3xl flex-col justify-center">
              <div className="mb-4 text-sm text-accent-blue">十年前 · 破出租屋单间</div>
              <h2 className="mb-5 text-5xl font-black leading-tight text-text-primary">
                你在泡面味和施工声里醒来。
              </h2>
              <div className="space-y-4 text-base leading-8 text-text-secondary">
                <p>手机屏幕停在欠费短信，旧电脑风扇像要散架，窗外广告牌还在招募“网络小剧场演员”。</p>
                <p>这个年代，没人说“短剧工业”。平台还没押注，投流还没烧起来，所有人都觉得竖屏小剧只是段子。</p>
                <p>但你记得十年后的颁奖礼，也记得那些名字后来怎么被追光灯照亮。</p>
              </div>
              <button
                onClick={() => setStage(nextTask(stage))}
                className="mt-8 w-fit border border-accent-gold bg-accent-gold/15 px-8 py-3 text-sm text-accent-gold transition-colors hover:bg-accent-gold/25 pixel-text"
              >
                我得拍一条
              </button>
            </div>
          )}

          {stage === 'zhao-briefing' && (
            <div className="mx-auto flex min-h-[720px] max-w-4xl flex-col justify-center">
              <div className="mb-4 text-sm text-accent-blue">老赵登场</div>
              <h2 className="mb-5 text-4xl font-black leading-tight text-text-primary">
                没有成熟工业，就先找一个认识所有怪人的人。
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                {zhaoLines.map((line) => (
                  <div key={line} className="border border-border bg-bg-card p-4 text-sm leading-7 text-text-secondary">
                    {line}
                  </div>
                ))}
              </div>
              <div className="mt-6 border border-accent-gold/35 bg-accent-gold/5 p-4 text-sm leading-7 text-accent-gold">
                老赵拍着你的旧电脑说：“你要抢风口可以，但别装大公司。你现在能组起来的，就是一支草台班子。”
              </div>
              <button
                onClick={() => setStage(nextTask(stage))}
                className="mt-8 w-fit border border-accent-gold bg-accent-gold/15 px-8 py-3 text-sm text-accent-gold transition-colors hover:bg-accent-gold/25 pixel-text"
              >
                看第一条样片
              </button>
            </div>
          )}

          {stage === 'project' && (
            <section className="grid min-h-[720px] gap-6 md:grid-cols-[1.1fr_0.9fr]">
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
                <Image
                  src={project.cover}
                  alt={project.title}
                  fill
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg-deep/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 border border-border bg-bg-deep/75 p-4 backdrop-blur">
                  <p className="text-sm leading-7 text-text-secondary">
                    老赵说：豪门、强吻、下跪、全员发疯。土是土，但这个年代没人知道观众以后就爱看这个。
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
                    专业演员请不起，也不信这个东西。老赵只能从素人池里捞人。
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
                          <Image
                            src={actor.avatar}
                            alt={actor.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
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
                每个人只填一个词。你会看到表面说服过程，但看不到他真正怎么理解。
              </p>
              <div className="space-y-4">
                {selectedActors.map((actor) => (
                  <div key={actor.id} className="border border-border bg-bg-card p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden border border-border">
                        <Image src={actor.avatar} alt={actor.name} fill sizes="48px" className="object-cover" />
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
                <LoadingIndicator text="逐个说服入组" />
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
                    说出口
                  </button>
                </div>
              )}
            </section>
          )}

          {stage === 'recruit-result' && (
            <section>
              <h2 className="mb-2 text-2xl font-bold text-accent-gold">他们表面上答应了</h2>
              <p className="mb-6 text-sm text-text-dim">
                你不知道这些话在他们心里拐成了什么弯，但它会影响后面的拍摄。
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
                      <div className="space-y-3">
                        {(result.visibleConversation || [
                          { speaker: '玩家' as const, text: result.persuasionLine },
                          { speaker: '演员' as const, text: result.actorReply },
                        ]).map((line, index) => (
                          <div key={`${result.actorId}-${index}`} className="border border-border bg-bg-deep p-3">
                            <div className="mb-1 text-xs text-accent-gold">{line.speaker}</div>
                            <p className="text-sm leading-7 text-text-primary">{line.text}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 border border-accent-blue/25 bg-accent-blue/5 p-3 text-xs leading-6 text-accent-blue">
                        {result.visibleHint || '你不知道他真正怎么理解了这句话，但会影响后续拍摄。'}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setStage('pre-shoot')}
                  className="border border-accent-gold bg-accent-gold/15 px-8 py-3 text-sm text-accent-gold hover:bg-accent-gold/25 pixel-text"
                >
                  去片场
                </button>
              </div>
            </section>
          )}

          {stage === 'pre-shoot' && (
            <section className="mx-auto flex min-h-[720px] max-w-4xl flex-col justify-center">
              <div className="mb-4 text-sm text-accent-blue">开机前 · 老赵算账</div>
              <h2 className="mb-5 text-4xl font-black leading-tight text-text-primary">
                你可以救最要命的地方，救不了所有地方。
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                {shootRules.map((rule) => (
                  <div key={rule} className="border border-border bg-bg-card p-4 text-sm leading-7 text-text-secondary">
                    {rule}
                  </div>
                ))}
              </div>
              <div className="mt-5 border border-accent-red/35 bg-accent-red/10 p-4 text-sm leading-7 text-accent-red">
                老赵：“记住，不是你不能管，是这个组经不起你每句都管。每一幕只有 1-2 次干预机会，工具会改掉后面的片场事实。”
              </div>
              <button
                onClick={start}
                className="mt-8 w-fit border border-accent-gold bg-accent-gold/15 px-8 py-3 text-sm text-accent-gold hover:bg-accent-gold/25 pixel-text"
              >
                开机
              </button>
            </section>
          )}
        </section>
      </div>
    </main>
  );
}
