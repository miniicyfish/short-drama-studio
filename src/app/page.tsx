'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingIndicator from '@/components/LoadingIndicator';
import VNStage, { VNCharacter, VNHistoryLine, VNLineKind } from '@/components/VNStage';
import { actors, assignCasting, initialStats, project } from '@/lib/gameData';
import { Actor, GameSession, RecruitResult } from '@/lib/gameTypes';

type Stage =
  | 'intro'
  | 'casting-task'
  | 'casting'
  | 'persuasion-transition'
  | 'persuasion-task'
  | 'persuasion-input'
  | 'persuasion-playback'
  | 'pre-shoot-task'
  | 'pre-shoot';

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

const MAX_VN_TEXT_LENGTH = 36;

function splitTextForVN(text: string) {
  if (text.length <= MAX_VN_TEXT_LENGTH) return [text];
  const sentenceParts = text.match(/[^。！？；]+[。！？；]?/g) || [text];
  const parts = sentenceParts.flatMap((part) => {
    if (part.length <= MAX_VN_TEXT_LENGTH) return [part];
    return part.match(/[^，、]+[，、]?/g) || [part];
  });
  const chunks: string[] = [];
  let current = '';
  parts.forEach((part) => {
    if (!current) {
      current = part;
      return;
    }
    if ((current + part).length <= MAX_VN_TEXT_LENGTH) {
      current += part;
      return;
    }
    chunks.push(current);
    current = part;
  });
  if (current) chunks.push(current);
  return chunks;
}

function splitVNLines(lines: VNLine[]) {
  return lines.flatMap((line) => {
    const parts = splitTextForVN(line.text);
    if (parts.length === 1) return [line];
    return parts.map((text, index) => ({
      ...line,
      id: `${line.id}-${index + 1}`,
      text,
    }));
  });
}

function autoDelayFor(text?: string) {
  const length = text?.length || 0;
  return Math.min(4200, Math.max(2100, 1500 + length * 58));
}

function historyFromLines(lines: VNLine[], currentIndex: number): VNHistoryLine[] {
  return lines.slice(Math.max(0, currentIndex - 11), currentIndex + 1).map((line) => ({
    speaker: line.speaker,
    text: line.text,
    kind: line.kind,
  }));
}

const rawIntroLines: VNLine[] = [
  {
    id: 'awards-01',
    background: '/pixels/scene-gu-banquet-hall.png',
    title: '星芒短剧年度盛典',
    subtitle: '十年后',
    kind: 'narration',
    text: '追光灯从舞台中央扫过来，掠过第一排嘉宾的胸针，最后停在巨大的金色片名上。',
  },
  {
    id: 'awards-02',
    background: '/pixels/scene-gu-banquet-hall.png',
    title: '星芒短剧年度盛典',
    subtitle: '十年后',
    kind: 'narration',
    text: '大屏：《离婚夜，顾总当众强吻我后，白月光也疯了》',
  },
  {
    id: 'awards-03',
    background: '/pixels/scene-gu-banquet-hall.png',
    title: '星芒短剧年度盛典',
    subtitle: '十年后',
    kind: 'dialogue',
    speaker: '主持人',
    text: '获得年度最具商业价值短剧的是——',
  },
  {
    id: 'awards-04',
    background: '/pixels/scene-gu-banquet-hall.png',
    title: '星芒短剧年度盛典',
    subtitle: '十年后',
    kind: 'action',
    text: '掌声像潮水一样翻起来。有人站起来鼓掌，有人举着手机拍屏幕上的播放量曲线。你坐在后排，也跟着鼓掌。',
  },
  {
    id: 'awards-05',
    background: '/pixels/scene-gu-banquet-hall.png',
    title: '星芒短剧年度盛典',
    subtitle: '十年后',
    kind: 'narration',
    text: '台上的获奖人拥抱、落泪，背后的年度回顾正好播到男主雨夜下跪，女主冷笑转身，白月光扶着香槟塔缓缓倒下。',
  },
  {
    id: 'awards-06',
    background: '/pixels/scene-gu-banquet-hall.png',
    title: '星芒短剧年度盛典',
    subtitle: '十年后',
    kind: 'action',
    text: '全场笑了，掌声更响。你看着那一幕，没有笑。',
  },
  {
    id: 'awards-07',
    background: '/pixels/scene-gu-banquet-hall.png',
    title: '星芒短剧年度盛典',
    subtitle: '十年后',
    kind: 'inner',
    speaker: '你',
    text: '十年前，没人愿意把这种东西叫作品。十年后，他们把它叫内容资产、叫超级 IP、叫年度增长曲线。',
  },
  {
    id: 'awards-08',
    background: '/pixels/scene-gu-banquet-hall.png',
    title: '星芒短剧年度盛典',
    subtitle: '十年后',
    kind: 'action',
    text: '灯光忽然炸白。掌声被拉长、扭曲，像一条被剪坏的音轨。',
  },
  {
    id: 'room-01',
    background: '/pixels/scene-gu-night-exit.png',
    title: '破出租屋单间',
    subtitle: '十年前',
    kind: 'narration',
    text: '再睁眼时，天花板上有一块潮斑。风扇转得很慢，泡面桶倒在桌边，电脑屏幕还停在一个没剪完的工程文件上。',
  },
  {
    id: 'room-02',
    background: '/pixels/scene-gu-night-exit.png',
    title: '破出租屋单间',
    subtitle: '十年前',
    kind: 'inner',
    speaker: '你',
    text: '这个房间……我租过。十年前，城中村，三楼，窗户关不上。',
  },
  {
    id: 'room-03',
    background: '/pixels/scene-gu-night-exit.png',
    title: '破出租屋单间',
    subtitle: '十年前',
    kind: 'action',
    text: '手机震了一下。欠费提醒、房租催缴、一个未接来电。日期停在短剧还没被平台认真看见的那一年。',
  },
  {
    id: 'room-04',
    background: '/pixels/scene-gu-night-exit.png',
    title: '破出租屋单间',
    subtitle: '十年前',
    kind: 'inner',
    speaker: '你',
    text: '台上的掌声还在耳边，可这个年代，没人会为一条竖屏短剧鼓掌。',
  },
  {
    id: 'room-05',
    background: '/pixels/scene-gu-night-exit.png',
    title: '破出租屋单间',
    subtitle: '十年前',
    kind: 'narration',
    text: '电脑屏幕上，旧剪辑软件卡在第 37 秒。一个男人正对着镜头说：“女人，你这是在玩火。”',
  },
  {
    id: 'room-06',
    background: '/pixels/scene-gu-night-exit.png',
    title: '破出租屋单间',
    subtitle: '十年前',
    kind: 'action',
    text: '你盯着那句台词看了三秒，忽然拿起手机，拨给老赵。',
  },
  {
    id: 'call-01',
    background: '/pixels/scene-gu-night-exit.png',
    title: '破出租屋单间',
    subtitle: '半夜电话',
    kind: 'dialogue',
    speaker: '老赵',
    text: '大半夜的，你最好是死了。',
    characters: [zhaoCharacter],
  },
  {
    id: 'call-02',
    background: '/pixels/scene-gu-night-exit.png',
    title: '破出租屋单间',
    subtitle: '半夜电话',
    kind: 'dialogue',
    speaker: '你',
    text: '你明天能不能找四个人。',
  },
  {
    id: 'call-03',
    background: '/pixels/scene-gu-night-exit.png',
    title: '破出租屋单间',
    subtitle: '半夜电话',
    kind: 'dialogue',
    speaker: '老赵',
    text: '干嘛？打麻将？',
    characters: [zhaoCharacter],
  },
  {
    id: 'call-04',
    background: '/pixels/scene-gu-night-exit.png',
    title: '破出租屋单间',
    subtitle: '半夜电话',
    kind: 'dialogue',
    speaker: '你',
    text: '拍豪门。',
  },
  {
    id: 'call-05',
    background: '/pixels/scene-gu-night-exit.png',
    title: '破出租屋单间',
    subtitle: '半夜电话',
    kind: 'dialogue',
    speaker: '老赵',
    text: '你在哪儿豪？城中村三楼吗？',
    characters: [zhaoCharacter],
  },
  {
    id: 'zhao-00',
    background: '/pixels/scene-gu-side-corridor.png',
    title: '老赵登场',
    subtitle: '被你拉来的草台搭子',
    kind: 'action',
    text: '第二天中午，老赵叼着半根没点着的烟坐在你对面，盯着你写在纸上的片名看了很久。',
    characters: [zhaoCharacter],
  },
  {
    id: 'zhao-01',
    background: '/pixels/scene-gu-side-corridor.png',
    title: '老赵登场',
    subtitle: '被你拉来的草台搭子',
    kind: 'dialogue',
    speaker: '老赵',
    text: '《离婚夜，顾总当众强吻我后，白月光也疯了》。',
    characters: [zhaoCharacter],
  },
  {
    id: 'zhao-02',
    background: '/pixels/scene-gu-side-corridor.png',
    title: '老赵登场',
    subtitle: '被你拉来的草台搭子',
    kind: 'dialogue',
    speaker: '老赵',
    text: '你这不是片名，你这是把民政局、夜总会和精神科挂一个号里了。',
    characters: [zhaoCharacter],
  },
  {
    id: 'zhao-03',
    background: '/pixels/scene-gu-side-corridor.png',
    title: '老赵登场',
    subtitle: '被你拉来的草台搭子',
    kind: 'action',
    text: '你把纸往他面前推了推。纸上只有三行字：豪门、离婚、当众发疯。',
    characters: [zhaoCharacter],
  },
  {
    id: 'zhao-04',
    background: '/pixels/scene-gu-side-corridor.png',
    title: '老赵登场',
    subtitle: '被你拉来的草台搭子',
    kind: 'dialogue',
    speaker: '你',
    text: '我只要它今天能拍。',
    characters: [zhaoCharacter],
  },
  {
    id: 'zhao-05',
    background: '/pixels/scene-gu-side-corridor.png',
    title: '老赵登场',
    subtitle: '被你拉来的草台搭子',
    kind: 'dialogue',
    speaker: '老赵',
    text: '今天能拍的东西很多。楼下修车店老板娘骂老公，我现在就能给你拍三十集。',
    characters: [zhaoCharacter],
  },
  {
    id: 'zhao-06',
    background: '/pixels/scene-gu-side-corridor.png',
    title: '老赵登场',
    subtitle: '被你拉来的草台搭子',
    kind: 'dialogue',
    speaker: '你',
    text: '不行，要像豪门。',
    characters: [zhaoCharacter],
  },
  {
    id: 'zhao-07',
    background: '/pixels/scene-gu-side-corridor.png',
    title: '老赵登场',
    subtitle: '被你拉来的草台搭子',
    kind: 'dialogue',
    speaker: '老赵',
    text: '像豪门？',
    characters: [zhaoCharacter],
  },
  {
    id: 'zhao-08',
    background: '/pixels/scene-gu-side-corridor.png',
    title: '老赵登场',
    subtitle: '被你拉来的草台搭子',
    kind: 'action',
    text: '老赵抬头看了一眼墙皮开裂的出租屋，又看了一眼桌上那桶没泡开的红烧牛肉面。',
    characters: [zhaoCharacter],
  },
  {
    id: 'zhao-09',
    background: '/pixels/scene-gu-side-corridor.png',
    title: '老赵登场',
    subtitle: '被你拉来的草台搭子',
    kind: 'dialogue',
    speaker: '老赵',
    text: '那我们这个豪门，门槛确实挺低的。',
    characters: [zhaoCharacter],
  },
  {
    id: 'pool-01',
    background: '/pixels/scene-gu-side-corridor.png',
    title: '凑班底',
    subtitle: '电话打了一圈',
    kind: 'action',
    text: '老赵还是帮你打了几个电话。第一通，对方听到“竖屏短剧”就说自己最近在排话剧。',
    characters: [zhaoCharacter],
  },
  {
    id: 'pool-02',
    background: '/pixels/scene-gu-side-corridor.png',
    title: '凑班底',
    subtitle: '电话打了一圈',
    kind: 'dialogue',
    speaker: '老赵',
    text: '他排个屁话剧，他上个月还在酒吧门口演尸体。',
    characters: [zhaoCharacter],
  },
  {
    id: 'pool-03',
    background: '/pixels/scene-gu-side-corridor.png',
    title: '凑班底',
    subtitle: '电话打了一圈',
    kind: 'action',
    text: '第二通，对方问有没有化妆车、有没有围读、有没有角色小传。',
    characters: [zhaoCharacter],
  },
  {
    id: 'pool-04',
    background: '/pixels/scene-gu-side-corridor.png',
    title: '凑班底',
    subtitle: '电话打了一圈',
    kind: 'dialogue',
    speaker: '老赵',
    text: '有，化妆车是共享单车，围读是我俩围着泡面读，角色小传是你前夫很有钱。',
    characters: [zhaoCharacter],
  },
  {
    id: 'pool-05',
    background: '/pixels/scene-gu-side-corridor.png',
    title: '凑班底',
    subtitle: '电话打了一圈',
    kind: 'action',
    text: '第三通，对方沉默了十秒，问能不能日结。',
    characters: [zhaoCharacter],
  },
  {
    id: 'pool-06',
    background: '/pixels/scene-gu-side-corridor.png',
    title: '凑班底',
    subtitle: '电话打了一圈',
    kind: 'dialogue',
    speaker: '老赵',
    text: '这位比较务实，但他要求演顾总的时候必须自带墨镜，因为他说霸总不能直视太阳。',
    characters: [zhaoCharacter],
  },
  {
    id: 'pool-07',
    background: '/pixels/scene-gu-side-corridor.png',
    title: '凑班底',
    subtitle: '电话打了一圈',
    kind: 'dialogue',
    speaker: '你',
    text: '可以。',
    characters: [zhaoCharacter],
  },
  {
    id: 'pool-08',
    background: '/pixels/scene-gu-side-corridor.png',
    title: '凑班底',
    subtitle: '电话打了一圈',
    kind: 'dialogue',
    speaker: '老赵',
    text: '你不要什么都可以，你这样很像诈骗。',
    characters: [zhaoCharacter],
  },
  {
    id: 'pool-09',
    background: '/pixels/scene-gu-side-corridor.png',
    title: '凑班底',
    subtitle: '电话打了一圈',
    kind: 'action',
    text: '傍晚，老赵把手机往桌上一扣，通讯录被他翻得像一锅糊掉的粥。',
    characters: [zhaoCharacter],
  },
  {
    id: 'pool-10',
    background: '/pixels/scene-gu-side-corridor.png',
    title: '凑班底',
    subtitle: '电话打了一圈',
    kind: 'dialogue',
    speaker: '老赵',
    text: '正经演员就别想了。嫌丢人的、嫌钱少的、嫌你片名不吉利的，都很坚定。',
    characters: [zhaoCharacter],
  },
  {
    id: 'pool-11',
    background: '/pixels/scene-gu-side-corridor.png',
    title: '凑班底',
    subtitle: '电话打了一圈',
    kind: 'dialogue',
    speaker: '你',
    text: '不正经的呢？',
    characters: [zhaoCharacter],
  },
  {
    id: 'pool-12',
    background: '/pixels/scene-gu-side-corridor.png',
    title: '凑班底',
    subtitle: '电话打了一圈',
    kind: 'dialogue',
    speaker: '老赵',
    text: '那我倒是有。',
    characters: [zhaoCharacter],
  },
  {
    id: 'pool-13',
    background: '/pixels/scene-gu-side-corridor.png',
    title: '凑班底',
    subtitle: '能来但不好说',
    kind: 'action',
    text: '老赵打开一个备注叫“能来但不好说”的分组，里面躺着夜场主持、美甲店老板、写字楼门岗、失业同学和一个自称学过三天表演的人。',
    characters: [zhaoCharacter],
  },
  {
    id: 'pool-14',
    background: '/pixels/scene-gu-side-corridor.png',
    title: '凑班底',
    subtitle: '能来但不好说',
    kind: 'dialogue',
    speaker: '老赵',
    text: '能来的都不一定会演，会演的今天不一定能来。你要拍，就从这里面捞。',
    characters: [zhaoCharacter],
  },
  {
    id: 'project-01',
    background: project.cover,
    title: project.title,
    subtitle: '第一条样片',
    kind: 'action',
    text: '你把那张纸翻过来，在背面画了一个简陋的宴会厅走位。三个圈，一个箭头，一行字：必须当众失控。',
    characters: [zhaoCharacter],
  },
  {
    id: 'project-02',
    background: project.cover,
    title: project.title,
    subtitle: '第一条样片',
    kind: 'dialogue',
    speaker: '老赵',
    text: '你为什么非要当众？',
    characters: [zhaoCharacter],
  },
  {
    id: 'project-03',
    background: project.cover,
    title: project.title,
    subtitle: '第一条样片',
    kind: 'dialogue',
    speaker: '你',
    text: '因为便宜。',
    characters: [zhaoCharacter],
  },
  {
    id: 'project-04',
    background: project.cover,
    title: project.title,
    subtitle: '第一条样片',
    kind: 'dialogue',
    speaker: '老赵',
    text: '当众哪里便宜？',
    characters: [zhaoCharacter],
  },
  {
    id: 'project-05',
    background: project.cover,
    title: project.title,
    subtitle: '第一条样片',
    kind: 'dialogue',
    speaker: '你',
    text: '一个场景，所有人都在，所有关系一次炸完。',
    characters: [zhaoCharacter],
  },
  {
    id: 'project-06',
    background: project.cover,
    title: project.title,
    subtitle: '第一条样片',
    kind: 'action',
    text: '老赵愣了一下，像是第一次觉得你这个疯法有一点预算逻辑。',
    characters: [zhaoCharacter],
  },
  {
    id: 'project-07',
    background: project.cover,
    title: project.title,
    subtitle: '第一条样片',
    kind: 'dialogue',
    speaker: '老赵',
    text: '行。豪门、强吻、下跪、白月光晕倒。听着很贵，拍起来很省。',
    characters: [zhaoCharacter],
  },
  {
    id: 'project-08',
    background: project.cover,
    title: project.title,
    subtitle: '第一条样片',
    kind: 'dialogue',
    speaker: '老赵',
    text: '但我提醒你，这帮人一旦真信了自己在演豪门，可能比豪门本人还难伺候。',
    characters: [zhaoCharacter],
  },
];

const introLines = splitVNLines(rawIntroLines);

function actorCharacter(actor?: Actor | null): VNCharacter[] {
  if (!actor) return [];
  return [
    {
      id: actor.id,
      name: actor.name,
      image: actor.avatar,
      position: 'right',
      active: true,
    },
  ];
}

function actorMeetLines(actor: Actor): VNLine[] {
  const target = {
    'sun-manli': ['美甲店门口', '老赵把你带到小区美甲店门口。玻璃门上贴着“今日爆款：富贵千金甲”。', '老板娘正在给客人讲前男友的八卦，听到“豪门离婚”四个字，剪刀停在半空。'],
    'wang-nana': ['美甲店后间', '王娜娜坐在补光灯前试口红，手机支架比人还稳。', '老赵说她今天本来要拍变装，听说有镜头，立刻把假睫毛贴得像要出征。'],
    'zhang-jiahao': ['夜场后门', '老赵带你绕到夜场后门，张嘉豪刚从一场生日局下来，衬衫领口还亮着银粉。', '他听见“顾总”两个字，第一反应是问要不要自备香水。'],
    'qiu-peng': ['城中村楼下', '邱鹏拎着一袋打折面包站在楼下，朋友圈刚发完“人生不会一直低谷”。', '老赵小声说，别刺激他，他最近把每个机会都当成命运重新开机。'],
    'guo-gang': ['写字楼门岗', '夜班门岗灯光惨白，郭港坐在监控屏前，像一个被迫守护豪门秘密的男人。', '老赵说他只要不说话就很贵，一说话就容易回到物业频道。'],
    'lin-xiaoman': ['排练室外廊', '林小满站在旧排练室外，帽檐压得很低，像随时准备从镜头里退出去。', '老赵说她懂镜头，但你最好别让她觉得这又是一次被人拿去截图的热闹。'],
  }[actor.id] || ['临时见面点', `老赵把你带去见${actor.name}。`, '这人能来，但为什么能来，老赵也说不太清。'];

  return splitVNLines([
    {
      id: `${actor.id}-meet-01`,
      background: '/pixels/scene-gu-side-corridor.png',
      title: target[0],
      subtitle: '逐个说服入组',
      kind: 'action',
      text: target[1],
      characters: [zhaoCharacter],
    },
    {
      id: `${actor.id}-meet-02`,
      background: '/pixels/scene-gu-side-corridor.png',
      title: target[0],
      subtitle: '逐个说服入组',
      kind: 'action',
      text: target[2],
      characters: actorCharacter(actor),
    },
    {
      id: `${actor.id}-meet-03`,
      background: '/pixels/scene-gu-side-corridor.png',
      title: target[0],
      subtitle: '逐个说服入组',
      kind: 'dialogue',
      speaker: '老赵',
      text: '就一句，别讲太满。讲太满的人，最后都要加钱。',
      characters: [zhaoCharacter],
    },
  ]);
}

const shootRules = [
  '豪宅只租半天。超一分钟，房东就会从“艺术支持者”变成“按小时收费者”。',
  '群演是临时叫来的，站久了要补钱；站太久，还会开始问自己到底是不是顾家亲戚。',
  '摄影、灯光、收音都是熟人价。熟人价的意思是：熟人也会翻脸。',
  '演员不是专业班底。喊卡太多会崩，改词太多会把霸总改成村支书。',
  '每幕只有 1-2 次干预机会，任何工具都会消耗次数。',
];

export default function Home() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('intro');
  const [introIndex, setIntroIndex] = useState(0);
  const [persuasionSceneIndex, setPersuasionSceneIndex] = useState(0);
  const [activePersuasionActorIndex, setActivePersuasionActorIndex] = useState(0);
  const [persuasionLineIndex, setPersuasionLineIndex] = useState(0);
  const [selectedActorIds, setSelectedActorIds] = useState<string[]>([]);
  const [words, setWords] = useState<Record<string, string>>({});
  const [recruitResults, setRecruitResults] = useState<RecruitResult[]>([]);
  const [autoPlay, setAutoPlay] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedActors = useMemo(
    () => actors.filter((actor) => selectedActorIds.includes(actor.id)),
    [selectedActorIds]
  );
  const casting = useMemo(() => assignCasting(selectedActors), [selectedActors]);

  const currentIntro = introLines[introIndex];
  const activeActor = selectedActors[activePersuasionActorIndex];
  const persuasionSceneLines = useMemo(
    () => (activeActor ? actorMeetLines(activeActor) : []),
    [activeActor]
  );
  const currentPersuasionSceneLine = persuasionSceneLines[persuasionSceneIndex];
  const persuasionLines = useMemo(() => {
    if (!activeActor) return [];
    const result = recruitResults.find((item) => item.actorId === activeActor.id);
    if (!result) return [];
      return splitVNLines([
        ...(result.visibleConversation || []).map((line, index): VNLine => ({
          id: `${result.actorId}-${index}`,
          background: '/pixels/scene-gu-side-corridor.png',
          title: '逐个说服入组',
          subtitle: activeActor.name,
          kind: 'dialogue',
          speaker: line.speaker === '演员' ? activeActor.name : line.speaker,
          text: line.text,
          characters: line.speaker === '老赵' ? [zhaoCharacter] : actorCharacter(activeActor),
        })),
        {
          id: `${result.actorId}-hint`,
          background: '/pixels/scene-gu-side-corridor.png',
          title: '逐个说服入组',
          subtitle: activeActor.name,
          kind: 'system' as VNLineKind,
          speaker: '系统',
          text: result.visibleHint || '你不知道他真正怎么理解了这句话，但会影响后续拍摄。',
          characters: actorCharacter(activeActor),
        },
      ]);
  }, [activeActor, recruitResults]);
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
    setStage('casting-task');
  };

  const recruit = async () => {
    if (!activeActor) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/recruit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project,
          selectedActors: [
            {
              ...activeActor,
              playerWord: words[activeActor.id] || activeActor.defaultWord,
            },
          ],
        }),
      });
      if (!res.ok) throw new Error('说服失败');
      const data = (await res.json()) as { recruitResults: RecruitResult[] };
      setRecruitResults((current) => [
        ...current.filter((result) => result.actorId !== activeActor.id),
        ...data.recruitResults,
      ]);
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
    if (activePersuasionActorIndex < selectedActors.length - 1) {
      setActivePersuasionActorIndex((current) => current + 1);
      setPersuasionSceneIndex(0);
      setPersuasionLineIndex(0);
      setStage('persuasion-transition');
      return;
    }
    setStage('pre-shoot-task');
  };

  const nextPersuasionSceneLine = () => {
    if (persuasionSceneIndex < persuasionSceneLines.length - 1) {
      setPersuasionSceneIndex((current) => current + 1);
      return;
    }
    setStage('persuasion-task');
  };

  useEffect(() => {
    if (!autoPlay) return;
    if (stage === 'intro' && currentIntro) {
      const timer = window.setTimeout(nextIntro, autoDelayFor(currentIntro.text));
      return () => window.clearTimeout(timer);
    }
    if (stage === 'persuasion-transition' && currentPersuasionSceneLine) {
      const timer = window.setTimeout(nextPersuasionSceneLine, autoDelayFor(currentPersuasionSceneLine.text));
      return () => window.clearTimeout(timer);
    }
    if (stage === 'persuasion-playback' && currentPersuasionLine) {
      const timer = window.setTimeout(nextPersuasionLine, autoDelayFor(currentPersuasionLine.text));
      return () => window.clearTimeout(timer);
    }
  }, [
    autoPlay,
    currentIntro,
    currentPersuasionLine,
    currentPersuasionSceneLine,
    introIndex,
    persuasionLineIndex,
    persuasionSceneIndex,
    stage,
  ]);

  const playbackControls = (onNext: () => void, isLast: boolean, lastLabel: string) => (
    <div className="vn-playback-controls">
      <button
        onClick={() => setAutoPlay((current) => !current)}
        className={`vn-control-button secondary ${autoPlay ? '' : 'is-paused'}`}
      >
        {autoPlay ? '自动中' : '手动中'}
      </button>
      <button onClick={onNext} className="vn-control-button">
        {isLast ? lastLabel : autoPlay ? '跳过' : '下一句'}
      </button>
    </div>
  );

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
        history={historyFromLines(introLines, introIndex)}
        controls={playbackControls(nextIntro, introIndex >= introLines.length - 1, '开始捞人')}
      />
    );
  }

  if (stage === 'casting-task') {
    return (
      <VNStage
        background="/pixels/scene-gu-side-corridor.png"
        title="片场任务"
        subtitle="开拍前"
        kind="task"
        speaker="任务 01｜从素人池里捞 4 个人"
        text={'目标：选出今天能到、能撑住豪门疯戏的班底。\n限制：只能选 4 个。盒饭和预算不够全上。'}
        characters={[zhaoCharacter]}
        controls={
          <button onClick={() => setStage('casting')} className="vn-control-button">
            开始捞人
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
        text="我给你摸了六个。每个都能来，每个都多少有点问题。"
        kind="dialogue"
        characters={[zhaoCharacter]}
        controls={
          <button
            disabled={selectedActorIds.length !== 4}
            onClick={() => {
              setActivePersuasionActorIndex(0);
              setPersuasionSceneIndex(0);
              setPersuasionLineIndex(0);
              setAutoPlay(true);
              setStage('persuasion-transition');
            }}
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

  if (stage === 'persuasion-transition' && currentPersuasionSceneLine) {
    return (
      <VNStage
        background={currentPersuasionSceneLine.background}
        title={currentPersuasionSceneLine.title}
        subtitle={currentPersuasionSceneLine.subtitle}
        speaker={currentPersuasionSceneLine.speaker}
        text={currentPersuasionSceneLine.text}
        kind={currentPersuasionSceneLine.kind}
        characters={currentPersuasionSceneLine.characters}
        history={historyFromLines(persuasionSceneLines, persuasionSceneIndex)}
        controls={playbackControls(
          nextPersuasionSceneLine,
          persuasionSceneIndex >= persuasionSceneLines.length - 1,
          '开始说服'
        )}
      />
    );
  }

  if (stage === 'persuasion-task' && activeActor) {
    return (
      <VNStage
        background="/pixels/scene-gu-side-corridor.png"
        title="片场任务"
        subtitle="逐个说服入组"
        kind="task"
        speaker={`任务 02｜说服 ${activeActor.name}`}
        text={`目标：用一句话把${activeActor.name}拉进组。\n方式：只填一个词，让说辞击中他/她最在意的地方。\n风险：你看不到真实心态，但它会写进后续拍摄。`}
        characters={actorCharacter(activeActor)}
        controls={
          <button onClick={() => setStage('persuasion-input')} className="vn-control-button">
            去说服
          </button>
        }
      />
    );
  }

  if (stage === 'persuasion-input' && activeActor) {
    return (
      <VNStage
        background="/pixels/scene-gu-side-corridor.png"
        title="逐个说服入组"
        subtitle={activeActor.name}
        speaker="老赵"
        text="把话压短。这个年代，没人会为了一个太完整的梦想停下脚步。"
        kind="dialogue"
        characters={[zhaoCharacter]}
        controls={
          <button onClick={recruit} className="border border-accent-gold px-4 py-2 text-xs text-accent-gold">
            {loading ? '说服中' : '说出口'}
          </button>
        }
        overlay={
          <div className="mx-auto max-w-3xl">
            <div className="border border-accent-gold/35 bg-bg-deep/88 p-5 backdrop-blur">
              <div className="mb-4 flex items-center gap-3">
                <div className="relative h-14 w-14 overflow-hidden border border-border">
                  <Image src={activeActor.avatar} alt={activeActor.name} fill sizes="56px" className="object-cover" />
                </div>
                <div>
                  <div className="font-bold text-accent-gold">{activeActor.name}</div>
                  <div className="text-xs text-accent-blue">{activeActor.label}</div>
                </div>
              </div>
              <div className="text-base leading-8 text-text-secondary">
                {activeActor.persuasionTemplate.split('____')[0]}
                <input
                  value={words[activeActor.id] ?? activeActor.defaultWord}
                  onChange={(event) =>
                    setWords((current) => ({
                      ...current,
                      [activeActor.id]: event.target.value,
                    }))
                  }
                  className="mx-2 w-32 border-b border-accent-gold bg-transparent px-2 py-1 text-center text-xl text-accent-gold outline-none"
                />
                {activeActor.persuasionTemplate.split('____')[1]}
              </div>
            </div>
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
        history={historyFromLines(persuasionLines, persuasionLineIndex)}
        controls={playbackControls(nextPersuasionLine, persuasionLineIndex >= persuasionLines.length - 1, '去片场')}
      />
    );
  }

  if (stage === 'pre-shoot-task') {
    return (
      <VNStage
        background="/pixels/scene-gu-banquet-corridor.png"
        title="片场任务"
        subtitle="开机前"
        kind="task"
        speaker="任务 03｜记住片场限制"
        text={'目标：在真正拍摄前理解工具限制。\n规则：每幕只能干预 1-2 次，任何工具都会消耗次数。\n原因：钱、人、场地、面子都撑不住你每句都管。'}
        characters={[zhaoCharacter]}
        controls={
          <button onClick={() => setStage('pre-shoot')} className="vn-control-button">
            听老赵算账
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
      text="不是你不能管，是这个组经不起你每句都管。救最要命的地方。"
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
