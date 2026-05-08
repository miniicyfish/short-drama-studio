'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingIndicator from '@/components/LoadingIndicator';
import VNStage, { VNCharacter, VNLineKind } from '@/components/VNStage';
import { actors, assignCasting, initialStats, project } from '@/lib/gameData';
import { GameSession, RecruitResult } from '@/lib/gameTypes';

type Stage = 'intro' | 'casting' | 'persuasion-input' | 'persuasion-playback' | 'pre-shoot';

interface VNLine {
  id: string;
  background: string;
  title: string;
  subtitle: string;
  kind: VNLineKind;
  speaker?: string;
  text: string;
  characters?: VNCharacter[];
}

const zhaoCharacter: VNCharacter = {
  id: 'zhao',
  name: '老赵',
  image: '/pixels/role-zhou-assistant.png',
  position: 'right',
  active: true,
};

const introLines: VNLine[] = [
  {
    id: 'awards-01',
    background: '/pixels/scene-gu-banquet-hall.png',
    title: '星芒短剧年度盛典',
    subtitle: '十年后',
    kind: 'narration',
    text: '追光灯扫过台上，短剧演员、平台高层和品牌方坐满前排。',
  },
  {
    id: 'awards-02',
    background: '/pixels/scene-gu-banquet-hall.png',
    title: '星芒短剧年度盛典',
    subtitle: '十年后',
    kind: 'dialogue',
    speaker: '主持人',
    text: '获得年度最具商业价值短剧的是——',
  },
  {
    id: 'awards-03',
    background: '/pixels/scene-gu-banquet-hall.png',
    title: '星芒短剧年度盛典',
    subtitle: '十年后',
    kind: 'inner',
    speaker: '你',
    text: '原来这些曾经被嫌土、嫌短、嫌没门槛的东西，最后真的站上了主桌。',
  },
  {
    id: 'room-01',
    background: '/pixels/scene-gu-night-exit.png',
    title: '破出租屋单间',
    subtitle: '十年前',
    kind: 'action',
    text: '画面一黑。你在泡面味、旧电脑风扇声和窗外施工声里醒来。',
  },
  {
    id: 'room-02',
    background: '/pixels/scene-gu-night-exit.png',
    title: '破出租屋单间',
    subtitle: '十年前',
    kind: 'inner',
    speaker: '你',
    text: '我回来了？短剧还没起飞，平台还没押注，投流还没烧起来。',
  },
  {
    id: 'room-03',
    background: '/pixels/scene-gu-night-exit.png',
    title: '破出租屋单间',
    subtitle: '十年前',
    kind: 'inner',
    speaker: '你',
    text: '如果我知道风口会来，那我现在要做的事就只有一件：先拍出第一条。',
  },
  {
    id: 'zhao-00',
    background: '/pixels/scene-gu-side-corridor.png',
    title: '老赵登场',
    subtitle: '被你拉来的草台搭子',
    kind: 'action',
    text: '你把老赵从一个群演饭局里拽出来，摊开纸，说自己要拍一条竖屏小短剧。',
    characters: [zhaoCharacter],
  },
  {
    id: 'zhao-01',
    background: '/pixels/scene-gu-side-corridor.png',
    title: '老赵登场',
    subtitle: '被你拉来的草台搭子',
    kind: 'dialogue',
    speaker: '老赵',
    text: '你说拍竖屏小短剧？这玩意儿有人看吗？',
    characters: [zhaoCharacter],
  },
  {
    id: 'zhao-02',
    background: '/pixels/scene-gu-side-corridor.png',
    title: '老赵登场',
    subtitle: '被你拉来的草台搭子',
    kind: 'dialogue',
    speaker: '老赵',
    text: '别跟我讲什么未来风口，我只认今天账上有多少钱。你要真拍，我只能给你找便宜人。',
    characters: [zhaoCharacter],
  },
  {
    id: 'zhao-03',
    background: '/pixels/scene-gu-side-corridor.png',
    title: '老赵登场',
    subtitle: '被你拉来的草台搭子',
    kind: 'dialogue',
    speaker: '老赵',
    text: '夜场、美甲店、写字楼门岗、失业同学群……能来的都不一定会演，但至少今天能到。',
    characters: [zhaoCharacter],
  },
  {
    id: 'project-01',
    background: project.cover,
    title: project.title,
    subtitle: '第一条样片',
    kind: 'inner',
    speaker: '你',
    text: '你不能告诉老赵十年后的答案，只能把未来会爆的东西，包装成一条现在能拍得起的样片。',
    characters: [zhaoCharacter],
  },
  {
    id: 'project-02',
    background: project.cover,
    title: project.title,
    subtitle: '第一条样片',
    kind: 'dialogue',
    speaker: '老赵',
    text: '豪门、强吻、下跪、全员发疯。这个本子够集中，够便宜，吵起来也像有钱人。',
    characters: [zhaoCharacter],
  },
];

const shootRules = [
  '豪宅只租半天，超时按小时加钱。',
  '群演是临时叫来的，站久了要补钱。',
  '摄影、灯光、收音都是熟人价，不能陪你一条一条磨。',
  '演员不是专业班底，喊卡太多会崩，改词太多会乱。',
  '每幕只有 1-2 次干预机会，任何工具都会消耗次数。',
];

export default function Home() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('intro');
  const [introIndex, setIntroIndex] = useState(0);
  const [persuasionLineIndex, setPersuasionLineIndex] = useState(0);
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

  const currentIntro = introLines[introIndex];
  const persuasionLines = useMemo(() => {
    return recruitResults.flatMap((result) => {
      const actor = actors.find((item) => item.id === result.actorId);
      const actorCharacter: VNCharacter | null = actor
        ? {
            id: actor.id,
            name: actor.name,
            image: actor.avatar,
            position: 'right',
            active: true,
          }
        : null;
      return [
        ...(result.visibleConversation || []).map((line, index): VNLine => ({
          id: `${result.actorId}-${index}`,
          background: '/pixels/scene-gu-side-corridor.png',
          title: '逐个说服入组',
          subtitle: actor?.name || '演员',
          kind: 'dialogue',
          speaker: line.speaker === '演员' ? actor?.name || '演员' : line.speaker,
          text: line.text,
          characters: line.speaker === '老赵' ? [zhaoCharacter] : actorCharacter ? [actorCharacter] : [],
        })),
        {
          id: `${result.actorId}-hint`,
          background: '/pixels/scene-gu-side-corridor.png',
          title: '逐个说服入组',
          subtitle: actor?.name || '演员',
          kind: 'system' as VNLineKind,
          speaker: '系统',
          text: result.visibleHint || '你不知道他真正怎么理解了这句话，但会影响后续拍摄。',
          characters: actorCharacter ? [actorCharacter] : [],
        },
      ];
    });
  }, [recruitResults]);
  const currentPersuasionLine = persuasionLines[persuasionLineIndex];

  const toggleActor = (actorId: string) => {
    setSelectedActorIds((current) => {
      if (current.includes(actorId)) return current.filter((id) => id !== actorId);
      if (current.length >= 4) return current;
      return [...current, actorId];
    });
  };

  const nextIntro = () => {
    if (introIndex < introLines.length - 1) {
      setIntroIndex((current) => current + 1);
      return;
    }
    setStage('casting');
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
      setPersuasionLineIndex(0);
      setStage('persuasion-playback');
    } catch (err) {
      setError(err instanceof Error ? err.message : '说服失败');
    } finally {
      setLoading(false);
    }
  };

  const nextPersuasionLine = () => {
    if (persuasionLineIndex < persuasionLines.length - 1) {
      setPersuasionLineIndex((current) => current + 1);
      return;
    }
    setStage('pre-shoot');
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

  if (stage === 'intro') {
    return (
      <VNStage
        background={currentIntro.background}
        title={currentIntro.title}
        subtitle={currentIntro.subtitle}
        speaker={currentIntro.speaker}
        text={currentIntro.text}
        kind={currentIntro.kind}
        characters={currentIntro.characters}
        controls={
          <button onClick={nextIntro} className="border border-accent-gold px-4 py-2 text-xs text-accent-gold">
            {introIndex >= introLines.length - 1 ? '开始捞人' : '下一句'}
          </button>
        }
      />
    );
  }

  if (stage === 'casting') {
    return (
      <VNStage
        background="/pixels/scene-gu-side-corridor.png"
        title="6 选 4 捞人"
        subtitle="老赵的素人池"
        speaker="老赵"
        text="专业演员你请不起，愿意来的也看不上这活。你先从我能摸到的人里挑四个。"
        kind="dialogue"
        characters={[zhaoCharacter]}
        controls={
          <button
            disabled={selectedActorIds.length !== 4}
            onClick={() => setStage('persuasion-input')}
            className="border border-accent-gold px-4 py-2 text-xs text-accent-gold disabled:opacity-35"
          >
            确认班底
          </button>
        }
        overlay={
          <div className="mx-auto grid max-h-[58vh] max-w-5xl gap-3 overflow-y-auto md:grid-cols-3">
            {actors.map((actor) => {
              const selected = selectedActorIds.includes(actor.id);
              return (
                <button
                  key={actor.id}
                  onClick={() => toggleActor(actor.id)}
                  className={`border bg-bg-deep/82 p-3 text-left backdrop-blur transition-colors ${
                    selected ? 'border-accent-gold' : 'border-border hover:border-accent-blue'
                  }`}
                >
                  <div className="mb-3 flex gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-border">
                      <Image src={actor.avatar} alt={actor.name} fill sizes="64px" className="object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-accent-gold">{actor.name}</div>
                      <div className="text-xs text-accent-blue">{actor.label}</div>
                    </div>
                  </div>
                  <p className="mb-2 text-xs leading-5 text-text-secondary">{actor.hook}</p>
                  <p className="text-xs leading-5 text-accent-red/85">{actor.lossDirection}</p>
                </button>
              );
            })}
          </div>
        }
      />
    );
  }

  if (stage === 'persuasion-input') {
    return (
      <VNStage
        background="/pixels/scene-gu-side-corridor.png"
        title="逐个说服入组"
        subtitle="填一个词，说出口"
        speaker="老赵"
        text="这些人不是专业演员。你只能用一句话把他们拉进来，至于他们心里怎么听，开机后才知道。"
        kind="dialogue"
        characters={[zhaoCharacter]}
        controls={
          <button onClick={recruit} className="border border-accent-gold px-4 py-2 text-xs text-accent-gold">
            {loading ? '说服中' : '说出口'}
          </button>
        }
        overlay={
          <div className="mx-auto max-h-[58vh] max-w-4xl space-y-3 overflow-y-auto">
            {selectedActors.map((actor) => (
              <div key={actor.id} className="border border-border bg-bg-deep/86 p-4 backdrop-blur">
                <div className="mb-3 flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden border border-border">
                    <Image src={actor.avatar} alt={actor.name} fill sizes="48px" className="object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-accent-gold">{actor.name}</div>
                    <div className="text-xs text-text-dim">{actor.label}</div>
                  </div>
                </div>
                <div className="text-sm leading-7 text-text-secondary">
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
              </div>
            ))}
            {loading && <LoadingIndicator text="逐个说服入组" />}
            {error && <div className="border border-accent-red/40 bg-accent-red/10 p-3 text-sm text-accent-red">{error}</div>}
          </div>
        }
      />
    );
  }

  if (stage === 'persuasion-playback' && currentPersuasionLine) {
    return (
      <VNStage
        background={currentPersuasionLine.background}
        title={currentPersuasionLine.title}
        subtitle={currentPersuasionLine.subtitle}
        speaker={currentPersuasionLine.speaker}
        text={currentPersuasionLine.text}
        kind={currentPersuasionLine.kind}
        characters={currentPersuasionLine.characters}
        controls={
          <button onClick={nextPersuasionLine} className="border border-accent-gold px-4 py-2 text-xs text-accent-gold">
            {persuasionLineIndex >= persuasionLines.length - 1 ? '去片场' : '下一句'}
          </button>
        }
      />
    );
  }

  return (
    <VNStage
      background="/pixels/scene-gu-banquet-corridor.png"
      title="开机前"
      subtitle="老赵算账"
      speaker="老赵"
      text="记住，不是你不能管，是这个组经不起你每句都管。你能救最要命的地方，救不了所有地方。"
      kind="dialogue"
      characters={[zhaoCharacter]}
      controls={
        <button onClick={start} className="border border-accent-gold px-4 py-2 text-xs text-accent-gold">
          开机
        </button>
      }
      overlay={
        <div className="mx-auto grid max-w-4xl gap-3 md:grid-cols-2">
          {shootRules.map((rule) => (
            <div key={rule} className="border border-border bg-bg-deep/84 p-4 text-sm leading-7 text-text-secondary backdrop-blur">
              {rule}
            </div>
          ))}
        </div>
      }
    />
  );
}
