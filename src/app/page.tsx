'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingIndicator from '@/components/LoadingIndicator';
import VNStage, { VNCharacter, VNHistoryLine, VNLineKind } from '@/components/VNStage';
import { installAudioUnlock, playBgm, playOneShot, setAudioEnabled, stopBgm } from '@/lib/audioPlayer';
import { actors, assignCasting, initialStats, project, scriptRoles } from '@/lib/gameData';
import { Actor, Casting, GameSession, RecruitResult } from '@/lib/gameTypes';

type Stage =
  | 'intro'
  | 'casting-task'
  | 'casting'
  | 'role-assign'
  | 'persuasion-transition'
  | 'persuasion-task'
  | 'persuasion-input'
  | 'persuasion-playback'
  | 'pre-shoot-rules'
  | 'pre-shoot-cover'
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
  image: '/pixels/actor-real-laozhao.png',
  position: 'right',
  active: true,
};

const MAX_VN_TEXT_LENGTH = 36;
const CASTING_LIMIT = {
  total: 4,
  female: 2,
  male: 2,
};

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

function baseLineId(id?: string) {
  return id?.replace(/-\d+$/, '') || '';
}

function bgmForStage(stage: Stage, line?: VNLine) {
  const id = baseLineId(line?.id);
  if (stage === 'intro') {
    if (id.startsWith('awards') || id.startsWith('room')) return '/audio/bgm-inner.mp3';
    return '/audio/bgm-zhao.mp3';
  }
  if (stage === 'persuasion-transition' || stage === 'persuasion-input' || stage === 'persuasion-playback') {
    return '/audio/bgm-persuasion.mp3';
  }
  if (stage === 'casting-task' || stage === 'casting' || stage === 'role-assign' || stage === 'pre-shoot-rules' || stage === 'pre-shoot-task') {
    return '/audio/bgm-zhao.mp3';
  }
  return null;
}

function sfxForLine(line?: VNLine) {
  const id = baseLineId(line?.id);
  if (id === 'awards-03') return '/audio/sfx-grand-entrance.mp3';
  if (id === 'awards-08') return '/audio/sfx-time-travel-heavy.mp3';
  if (id === 'room-01') return '/audio/sfx-time-travel-wind.mp3';
  if (id === 'room-02' || id === 'room-04') return '/audio/sfx-heartbeat.mp3';
  if (id === 'room-06') return '/audio/sfx-phone-call.wav';
  if (id.endsWith('-meet-01')) return '/audio/sfx-memory-whoosh.mp3';
  return null;
}

function voiceForLine(line: VNLine | undefined, activeActor?: Actor) {
  if (!line || line.kind !== 'dialogue') return null;
  if (line.speaker === '你' || line.speaker === '主持人') return null;

  const text = line.text;
  if (line.speaker === '老赵') {
    if (text.includes('？') || text.includes('吗')) return '/audio/voice/male-question.mp3';
    if (text.includes('不是') || text.includes('别') || text.includes('诈骗')) return '/audio/voice/male-awkward.mp3';
    if (text.includes('！') || text.includes('啊')) return '/audio/voice/male-surprised.mp3';
    return '/audio/voice/male-default.mp3';
  }

  if (!activeActor || line.speaker !== activeActor.name) return null;
  if (activeActor.gender === 'female') {
    if (text.includes('？') || text.includes('吗')) return '/audio/voice/female-confused.mp3';
    if (text.includes('啊') || text.includes('！')) return '/audio/voice/female-surprised.mp3';
    if (text.includes('不') || text.includes('算了')) return '/audio/voice/female-speechless.mp3';
    return '/audio/voice/female-default.mp3';
  }
  if (text.includes('？') || text.includes('吗')) return '/audio/voice/male-question.mp3';
  if (text.includes('啊') || text.includes('！')) return '/audio/voice/male-surprised.mp3';
  if (text.includes('不') || text.includes('确定')) return '/audio/voice/male-awkward.mp3';
  return '/audio/voice/male-default.mp3';
}

const rawIntroLines: VNLine[] = [
  {
    id: 'awards-01',
    background: '/pixels/scene-awards-ceremony.png',
    title: '星芒短剧年度盛典',
    subtitle: '十年后',
    kind: 'narration',
    text: '追光灯从舞台中央扫过来，掠过第一排嘉宾的胸针，最后停在巨大的金色片名上。',
  },
  {
    id: 'awards-02',
    background: '/pixels/scene-awards-ceremony.png',
    title: '星芒短剧年度盛典',
    subtitle: '十年后',
    kind: 'narration',
    text: '大屏：《离婚夜，顾总当众强吻我后，白月光也疯了》',
  },
  {
    id: 'awards-03',
    background: '/pixels/scene-awards-ceremony.png',
    title: '星芒短剧年度盛典',
    subtitle: '十年后',
    kind: 'dialogue',
    speaker: '主持人',
    text: '获得年度最具商业价值短剧的是——',
  },
  {
    id: 'awards-04',
    background: '/pixels/scene-awards-ceremony.png',
    title: '星芒短剧年度盛典',
    subtitle: '十年后',
    kind: 'action',
    text: '掌声像潮水一样翻起来。有人站起来鼓掌，有人举着手机拍屏幕上的播放量曲线。你坐在后排，也跟着鼓掌。',
  },
  {
    id: 'awards-05',
    background: '/pixels/scene-awards-ceremony.png',
    title: '星芒短剧年度盛典',
    subtitle: '十年后',
    kind: 'narration',
    text: '台上的获奖人拥抱、落泪，背后的年度回顾正好播到男主雨夜下跪，女主冷笑转身，白月光扶着香槟塔缓缓倒下。',
  },
  {
    id: 'awards-06',
    background: '/pixels/scene-awards-ceremony.png',
    title: '星芒短剧年度盛典',
    subtitle: '十年后',
    kind: 'action',
    text: '全场笑了，掌声更响。你看着那一幕，没有笑。',
  },
  {
    id: 'awards-07',
    background: '/pixels/scene-awards-ceremony.png',
    title: '星芒短剧年度盛典',
    subtitle: '十年后',
    kind: 'inner',
    speaker: '你',
    text: '十年前，没人愿意把这种东西叫作品。十年后，他们把它叫内容资产、叫超级 IP、叫年度增长曲线。',
  },
  {
    id: 'awards-08',
    background: '/pixels/scene-awards-ceremony.png',
    title: '星芒短剧年度盛典',
    subtitle: '十年后',
    kind: 'action',
    text: '灯光忽然炸白。掌声被拉长、扭曲，像一条被剪坏的音轨。',
  },
  {
    id: 'room-01',
    background: '/pixels/scene-zhao-room-day.png',
    title: '破出租屋单间',
    subtitle: '十年前',
    kind: 'narration',
    text: '再睁眼时，天花板上有一块潮斑。风扇转得很慢，泡面桶倒在桌边，电脑屏幕还停在一个没剪完的工程文件上。',
  },
  {
    id: 'room-02',
    background: '/pixels/scene-zhao-room-day.png',
    title: '破出租屋单间',
    subtitle: '十年前',
    kind: 'inner',
    speaker: '你',
    text: '这个房间……我租过。十年前，城中村，三楼，窗户关不上。',
  },
  {
    id: 'room-03',
    background: '/pixels/scene-zhao-room-day.png',
    title: '破出租屋单间',
    subtitle: '十年前',
    kind: 'action',
    text: '手机震了一下。欠费提醒、房租催缴、一个未接来电。日期停在短剧还没被平台认真看见的那一年。',
  },
  {
    id: 'room-04',
    background: '/pixels/scene-zhao-room-day.png',
    title: '破出租屋单间',
    subtitle: '十年前',
    kind: 'inner',
    speaker: '你',
    text: '台上的掌声还在耳边，可这个年代，没人会为一条竖屏短剧鼓掌。',
  },
  {
    id: 'room-05',
    background: '/pixels/scene-zhao-room-day.png',
    title: '破出租屋单间',
    subtitle: '十年前',
    kind: 'narration',
    text: '电脑屏幕上，旧剪辑软件卡在第 37 秒。一个男人正对着镜头说：“女人，你这是在玩火。”',
  },
  {
    id: 'room-06',
    background: '/pixels/scene-zhao-room-day.png',
    title: '破出租屋单间',
    subtitle: '十年前',
    kind: 'action',
    text: '你盯着那句台词看了三秒，忽然拿起手机，拨给老赵。',
  },
  {
    id: 'call-01',
    background: '/pixels/scene-zhao-room-day.png',
    title: '破出租屋单间',
    subtitle: '半夜电话',
    kind: 'dialogue',
    speaker: '老赵',
    text: '大半夜的，你最好是死了。',
    characters: [zhaoCharacter],
  },
  {
    id: 'call-02',
    background: '/pixels/scene-zhao-room-day.png',
    title: '破出租屋单间',
    subtitle: '半夜电话',
    kind: 'dialogue',
    speaker: '你',
    text: '你明天能不能找四个人。',
  },
  {
    id: 'call-03',
    background: '/pixels/scene-zhao-room-day.png',
    title: '破出租屋单间',
    subtitle: '半夜电话',
    kind: 'dialogue',
    speaker: '老赵',
    text: '干嘛？打麻将？',
    characters: [zhaoCharacter],
  },
  {
    id: 'call-04',
    background: '/pixels/scene-zhao-room-day.png',
    title: '破出租屋单间',
    subtitle: '半夜电话',
    kind: 'dialogue',
    speaker: '你',
    text: '拍豪门。',
  },
  {
    id: 'call-05',
    background: '/pixels/scene-zhao-room-day.png',
    title: '破出租屋单间',
    subtitle: '半夜电话',
    kind: 'dialogue',
    speaker: '老赵',
    text: '你在哪儿豪？城中村三楼吗？',
    characters: [zhaoCharacter],
  },
  {
    id: 'zhao-00',
    background: '/pixels/scene-zhao-room-day.png',
    title: '老赵登场',
    subtitle: '被你拉来的草台搭子',
    kind: 'action',
    text: '第二天中午，老赵叼着半根没点着的烟坐在你对面，盯着你写在纸上的片名看了很久。',
    characters: [zhaoCharacter],
  },
  {
    id: 'zhao-01',
    background: '/pixels/scene-zhao-room-day.png',
    title: '老赵登场',
    subtitle: '被你拉来的草台搭子',
    kind: 'dialogue',
    speaker: '老赵',
    text: '《离婚夜，顾总当众强吻我后，白月光也疯了》。',
    characters: [zhaoCharacter],
  },
  {
    id: 'zhao-02',
    background: '/pixels/scene-zhao-room-day.png',
    title: '老赵登场',
    subtitle: '被你拉来的草台搭子',
    kind: 'dialogue',
    speaker: '老赵',
    text: '你这不是片名，你这是把民政局、夜总会和精神科挂一个号里了。',
    characters: [zhaoCharacter],
  },
  {
    id: 'zhao-03',
    background: '/pixels/scene-zhao-room-day.png',
    title: '老赵登场',
    subtitle: '被你拉来的草台搭子',
    kind: 'action',
    text: '你把纸往他面前推了推。纸上只有三行字：豪门、离婚、当众发疯。',
    characters: [zhaoCharacter],
  },
  {
    id: 'zhao-04',
    background: '/pixels/scene-zhao-room-day.png',
    title: '老赵登场',
    subtitle: '被你拉来的草台搭子',
    kind: 'dialogue',
    speaker: '你',
    text: '我只要它今天能拍。',
    characters: [zhaoCharacter],
  },
  {
    id: 'zhao-05',
    background: '/pixels/scene-zhao-room-day.png',
    title: '老赵登场',
    subtitle: '被你拉来的草台搭子',
    kind: 'dialogue',
    speaker: '老赵',
    text: '今天能拍的东西很多。楼下修车店老板娘骂老公，我现在就能给你拍三十集。',
    characters: [zhaoCharacter],
  },
  {
    id: 'zhao-06',
    background: '/pixels/scene-zhao-room-day.png',
    title: '老赵登场',
    subtitle: '被你拉来的草台搭子',
    kind: 'dialogue',
    speaker: '你',
    text: '不行，要像豪门。',
    characters: [zhaoCharacter],
  },
  {
    id: 'zhao-07',
    background: '/pixels/scene-zhao-room-day.png',
    title: '老赵登场',
    subtitle: '被你拉来的草台搭子',
    kind: 'dialogue',
    speaker: '老赵',
    text: '像豪门？',
    characters: [zhaoCharacter],
  },
  {
    id: 'zhao-08',
    background: '/pixels/scene-zhao-room-day.png',
    title: '老赵登场',
    subtitle: '被你拉来的草台搭子',
    kind: 'action',
    text: '老赵抬头看了一眼墙皮开裂的出租屋，又看了一眼桌上那桶没泡开的红烧牛肉面。',
    characters: [zhaoCharacter],
  },
  {
    id: 'zhao-09',
    background: '/pixels/scene-zhao-room-day.png',
    title: '老赵登场',
    subtitle: '被你拉来的草台搭子',
    kind: 'dialogue',
    speaker: '老赵',
    text: '那我们这个豪门，门槛确实挺低的。',
    characters: [zhaoCharacter],
  },
  {
    id: 'pool-01',
    background: '/pixels/scene-casting-calls.png',
    title: '凑班底',
    subtitle: '电话打了一圈',
    kind: 'action',
    text: '老赵还是帮你打了几个电话。第一通，对方听到“竖屏短剧”就说自己最近在排话剧。',
    characters: [zhaoCharacter],
  },
  {
    id: 'pool-02',
    background: '/pixels/scene-casting-calls.png',
    title: '凑班底',
    subtitle: '电话打了一圈',
    kind: 'dialogue',
    speaker: '老赵',
    text: '他排个屁话剧，他上个月还在酒吧门口演尸体。',
    characters: [zhaoCharacter],
  },
  {
    id: 'pool-03',
    background: '/pixels/scene-casting-calls.png',
    title: '凑班底',
    subtitle: '电话打了一圈',
    kind: 'action',
    text: '第二通，对方问有没有化妆车、有没有围读、有没有角色小传。',
    characters: [zhaoCharacter],
  },
  {
    id: 'pool-04',
    background: '/pixels/scene-casting-calls.png',
    title: '凑班底',
    subtitle: '电话打了一圈',
    kind: 'dialogue',
    speaker: '老赵',
    text: '有，化妆车是共享单车，围读是我俩围着泡面读，角色小传是你前夫很有钱。',
    characters: [zhaoCharacter],
  },
  {
    id: 'pool-05',
    background: '/pixels/scene-casting-calls.png',
    title: '凑班底',
    subtitle: '电话打了一圈',
    kind: 'action',
    text: '第三通，对方沉默了十秒，问能不能日结。',
    characters: [zhaoCharacter],
  },
  {
    id: 'pool-06',
    background: '/pixels/scene-casting-calls.png',
    title: '凑班底',
    subtitle: '电话打了一圈',
    kind: 'dialogue',
    speaker: '老赵',
    text: '这位比较务实，但他要求演顾总的时候必须自带墨镜，因为他说霸总不能直视太阳。',
    characters: [zhaoCharacter],
  },
  {
    id: 'pool-07',
    background: '/pixels/scene-casting-calls.png',
    title: '凑班底',
    subtitle: '电话打了一圈',
    kind: 'dialogue',
    speaker: '你',
    text: '可以。',
    characters: [zhaoCharacter],
  },
  {
    id: 'pool-08',
    background: '/pixels/scene-casting-calls.png',
    title: '凑班底',
    subtitle: '电话打了一圈',
    kind: 'dialogue',
    speaker: '老赵',
    text: '你不要什么都可以，你这样很像诈骗。',
    characters: [zhaoCharacter],
  },
  {
    id: 'pool-09',
    background: '/pixels/scene-casting-calls.png',
    title: '凑班底',
    subtitle: '电话打了一圈',
    kind: 'action',
    text: '傍晚，老赵把手机往桌上一扣，通讯录被他翻得像一锅糊掉的粥。',
    characters: [zhaoCharacter],
  },
  {
    id: 'pool-10',
    background: '/pixels/scene-casting-calls.png',
    title: '凑班底',
    subtitle: '电话打了一圈',
    kind: 'dialogue',
    speaker: '老赵',
    text: '正经演员就别想了。嫌丢人的、嫌钱少的、嫌你片名不吉利的，都很坚定。',
    characters: [zhaoCharacter],
  },
  {
    id: 'pool-11',
    background: '/pixels/scene-casting-calls.png',
    title: '凑班底',
    subtitle: '电话打了一圈',
    kind: 'dialogue',
    speaker: '你',
    text: '不正经的呢？',
    characters: [zhaoCharacter],
  },
  {
    id: 'pool-12',
    background: '/pixels/scene-casting-calls.png',
    title: '凑班底',
    subtitle: '电话打了一圈',
    kind: 'dialogue',
    speaker: '老赵',
    text: '那我倒是有。',
    characters: [zhaoCharacter],
  },
  {
    id: 'pool-13',
    background: '/pixels/scene-amateur-pool.png',
    title: '凑班底',
    subtitle: '能来但不好说',
    kind: 'action',
    text: '老赵打开一个备注叫“能来但不好说”的分组，里面躺着夜场主持、美甲店老板、写字楼门岗、失业同学和一个自称学过三天表演的人。',
    characters: [zhaoCharacter],
  },
  {
    id: 'pool-14',
    background: '/pixels/scene-amateur-pool.png',
    title: '凑班底',
    subtitle: '能来但不好说',
    kind: 'dialogue',
    speaker: '老赵',
    text: '能来的都不一定会演，会演的今天不一定能来。你要拍，就从这里面捞。',
    characters: [zhaoCharacter],
  },
  {
    id: 'project-01',
    background: '/pixels/scene-project-planning.png',
    title: project.title,
    subtitle: '第一条样片',
    kind: 'action',
    text: '你把那张纸翻过来，在背面画了一个简陋的宴会厅走位。三个圈，一个箭头，一行字：必须当众失控。',
    characters: [zhaoCharacter],
  },
  {
    id: 'project-02',
    background: '/pixels/scene-project-planning.png',
    title: project.title,
    subtitle: '第一条样片',
    kind: 'dialogue',
    speaker: '老赵',
    text: '你为什么非要当众？',
    characters: [zhaoCharacter],
  },
  {
    id: 'project-03',
    background: '/pixels/scene-project-planning.png',
    title: project.title,
    subtitle: '第一条样片',
    kind: 'dialogue',
    speaker: '你',
    text: '因为便宜。',
    characters: [zhaoCharacter],
  },
  {
    id: 'project-04',
    background: '/pixels/scene-project-planning.png',
    title: project.title,
    subtitle: '第一条样片',
    kind: 'dialogue',
    speaker: '老赵',
    text: '当众哪里便宜？',
    characters: [zhaoCharacter],
  },
  {
    id: 'project-05',
    background: '/pixels/scene-project-planning.png',
    title: project.title,
    subtitle: '第一条样片',
    kind: 'dialogue',
    speaker: '你',
    text: '一个场景，所有人都在，所有关系一次炸完。',
    characters: [zhaoCharacter],
  },
  {
    id: 'project-06',
    background: '/pixels/scene-project-planning.png',
    title: project.title,
    subtitle: '第一条样片',
    kind: 'action',
    text: '老赵愣了一下，像是第一次觉得你这个疯法有一点预算逻辑。',
    characters: [zhaoCharacter],
  },
  {
    id: 'project-07',
    background: '/pixels/scene-project-planning.png',
    title: project.title,
    subtitle: '第一条样片',
    kind: 'dialogue',
    speaker: '老赵',
    text: '行。豪门、强吻、下跪、白月光晕倒。听着很贵，拍起来很省。',
    characters: [zhaoCharacter],
  },
  {
    id: 'project-08',
    background: '/pixels/scene-project-planning.png',
    title: project.title,
    subtitle: '第一条样片',
    kind: 'dialogue',
    speaker: '老赵',
    text: '但我提醒你，这帮人一旦真信了自己在演豪门，可能比豪门本人还难伺候。',
    characters: [zhaoCharacter],
  },
];

const introLines = splitVNLines(rawIntroLines);

function actorCharacter(actor?: Actor | null, position: VNCharacter['position'] = 'left', active = true): VNCharacter[] {
  if (!actor) return [];
  return [
    {
      id: actor.id,
      name: actor.name,
      image: actor.avatar,
      position,
      active,
    },
  ];
}

function actorSceneCharacters(actor?: Actor | null, focus: 'zhao' | 'actor' | 'both' = 'both'): VNCharacter[] {
  if (!actor) return [zhaoCharacter];
  const actorStandee = actorCharacter(actor, 'left', focus !== 'zhao')[0];
  const zhaoStandee = {
    ...zhaoCharacter,
    active: focus !== 'actor',
  };
  return [actorStandee, zhaoStandee];
}

function genderLabel(gender: Actor['gender']) {
  return gender === 'female' ? '女' : '男';
}

function roleShortName(roleName?: string) {
  return roleName?.split('/')[0].trim();
}

function actorMeetLines(actor: Actor, assignedRoleName?: string): VNLine[] {
  const roleName = roleShortName(assignedRoleName);
  const background =
    {
      'sun-manli': '/pixels/scene-sun-wang-invite.png',
      'wang-nana': '/pixels/scene-sun-wang-invite.png',
      'zhang-jiahao': '/pixels/scene-zhang-invite.png',
      'qiu-peng': '/pixels/scene-lin-qiu-invite.png',
      'guo-gang': '/pixels/scene-guo-invite.png',
      'lin-xiaoman': '/pixels/scene-lin-qiu-invite.png',
    }[actor.id] || '/pixels/scene-gu-side-corridor.png';
  const target = {
    'sun-manli': ['美甲店门口', '老赵把你带到小区美甲店门口。玻璃门上贴着“今日爆款：富贵千金甲”。', '老板娘正在给客人讲前男友的八卦，听到“豪门离婚”四个字，剪刀停在半空。'],
    'wang-nana': ['美甲店后间', '王娜娜坐在补光灯前试口红，手机支架比人还稳。', '老赵说她今天本来要拍变装，听说有镜头，立刻把假睫毛贴得像要出征。'],
    'zhang-jiahao': ['夜场后门', '老赵带你绕到夜场后门，张嘉豪刚从一场生日局下来，衬衫领口还亮着银粉。', `他听见要演${roleName || '顾沉舟'}，第一反应是问要不要自备香水。`],
    'qiu-peng': ['城中村楼下', '邱鹏拎着一袋打折面包站在楼下，朋友圈刚发完“人生不会一直低谷”。', `老赵小声说，别刺激他。他现在把“${roleName || '一个角色'}”也听得像命运重新开机。`],
    'guo-gang': ['写字楼门岗', '夜班门岗灯光惨白，郭港坐在监控屏前，像一个被迫守护豪门秘密的男人。', `老赵说他演${roleName || '豪门相关人物'}最贵的地方是不说话，一说话就容易回到物业频道。`],
    'lin-xiaoman': ['排练室外廊', '林小满站在旧排练室外，帽檐压得很低，像随时准备从镜头里退出去。', '老赵说她懂镜头，但你最好别让她觉得这又是一次被人拿去截图的热闹。'],
  }[actor.id] || ['临时见面点', `老赵把你带去见${actor.name}。`, '这人能来，但为什么能来，老赵也说不太清。'];

  return splitVNLines([
    {
      id: `${actor.id}-meet-01`,
      background,
      title: target[0],
      subtitle: '逐个说服入组',
      kind: 'action',
      text: target[1],
      characters: actorSceneCharacters(actor, 'both'),
    },
    {
      id: `${actor.id}-meet-02`,
      background,
      title: target[0],
      subtitle: '逐个说服入组',
      kind: 'action',
      text: target[2],
      characters: actorSceneCharacters(actor, 'actor'),
    },
    {
      id: `${actor.id}-meet-03`,
      background,
      title: target[0],
      subtitle: '逐个说服入组',
      kind: 'dialogue',
      speaker: '老赵',
      text: '就一句，别讲太满。讲太满的人，最后都要加钱。',
      characters: actorSceneCharacters(actor, 'zhao'),
    },
  ]);
}

const preShootLines = splitVNLines([
  {
    id: 'pre-shoot-rule-01',
    background: '/pixels/scene-gu-banquet-corridor.png',
    title: '开机前',
    subtitle: '老赵算账',
    kind: 'dialogue' as VNLineKind,
    speaker: '老赵',
    text: '先说清楚，豪宅只租半天。超一分钟，房东就会从艺术支持者变成按小时收费者。',
    characters: [zhaoCharacter],
  },
  {
    id: 'pre-shoot-rule-02',
    background: '/pixels/scene-gu-banquet-corridor.png',
    title: '开机前',
    subtitle: '老赵算账',
    kind: 'dialogue' as VNLineKind,
    speaker: '老赵',
    text: '群演是临时叫来的，站久了要补钱；站太久，还会开始问自己到底是不是顾家亲戚。',
    characters: [zhaoCharacter],
  },
  {
    id: 'pre-shoot-rule-03',
    background: '/pixels/scene-gu-banquet-corridor.png',
    title: '开机前',
    subtitle: '老赵算账',
    kind: 'dialogue' as VNLineKind,
    speaker: '老赵',
    text: '摄影、灯光、收音都是熟人价。熟人价的意思是，熟人也会翻脸。',
    characters: [zhaoCharacter],
  },
  {
    id: 'pre-shoot-rule-04',
    background: '/pixels/scene-gu-banquet-corridor.png',
    title: '开机前',
    subtitle: '老赵算账',
    kind: 'dialogue' as VNLineKind,
    speaker: '老赵',
    text: '演员不是专业班底。喊卡太多会崩，改词太多会把霸总改成村支书。',
    characters: [zhaoCharacter],
  },
  {
    id: 'pre-shoot-rule-05',
    background: '/pixels/scene-gu-banquet-corridor.png',
    title: '开机前',
    subtitle: '老赵算账',
    kind: 'dialogue' as VNLineKind,
    speaker: '老赵',
    text: '所以不是你不能管，是这个组经不起你每句都管。你能救最要命的地方，救不了所有地方。',
    characters: [zhaoCharacter],
  },
]);

export default function Home() {
  const router = useRouter();
  const [hasStarted, setHasStarted] = useState(false);
  const [audioOn, setAudioOn] = useState(true);
  const [stage, setStage] = useState<Stage>('intro');
  const [introIndex, setIntroIndex] = useState(0);
  const [persuasionSceneIndex, setPersuasionSceneIndex] = useState(0);
  const [activePersuasionActorIndex, setActivePersuasionActorIndex] = useState(0);
  const [persuasionLineIndex, setPersuasionLineIndex] = useState(0);
  const [preShootLineIndex, setPreShootLineIndex] = useState(0);
  const [selectedActorIds, setSelectedActorIds] = useState<string[]>([]);
  const [castingIndex, setCastingIndex] = useState(0);
  const [castingDirection, setCastingDirection] = useState<'left' | 'right'>('right');
  const [manualCasting, setManualCasting] = useState<Record<string, string>>({}); // actorId → scriptRoleId
  const [words, setWords] = useState<Record<string, string>>({});
  const [recruitResults, setRecruitResults] = useState<RecruitResult[]>([]);
  const [autoPlay, setAutoPlay] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedActors = useMemo(
    () => actors.filter((actor) => selectedActorIds.includes(actor.id)),
    [selectedActorIds]
  );
  const selectedGenderCounts = useMemo(
    () => ({
      female: selectedActors.filter((actor) => actor.gender === 'female').length,
      male: selectedActors.filter((actor) => actor.gender === 'male').length,
    }),
    [selectedActors]
  );
  const castingReady =
    selectedActorIds.length === CASTING_LIMIT.total &&
    selectedGenderCounts.female === CASTING_LIMIT.female &&
    selectedGenderCounts.male === CASTING_LIMIT.male;
  const casting: Casting[] = useMemo(() => {
    // If manual casting is complete (4 assignments), build from that
    const entries = Object.entries(manualCasting);
    if (entries.length === scriptRoles.length) {
      return entries.map(([actorId, roleId]) => {
        const role = scriptRoles.find((r) => r.id === roleId)!;
        const actor = actors.find((a) => a.id === actorId)!;
        return {
          scriptRoleId: role.id,
          scriptRoleName: role.name,
          actorId: actor.id,
          actorName: actor.name,
        };
      });
    }
    return assignCasting(selectedActors);
  }, [manualCasting, selectedActors]);

  const currentIntro = introLines[introIndex];
  const activeActor = selectedActors[activePersuasionActorIndex];
  const activeCasting = activeActor
    ? casting.find((item) => item.actorId === activeActor.id)
    : undefined;
  const persuasionSceneLines = useMemo(
    () => (activeActor ? actorMeetLines(activeActor, activeCasting?.scriptRoleName) : []),
    [activeActor, activeCasting?.scriptRoleName]
  );
  const currentPersuasionSceneLine = persuasionSceneLines[persuasionSceneIndex];
  const persuasionLines = useMemo(() => {
    if (!activeActor) return [];
    const result = recruitResults.find((item) => item.actorId === activeActor.id);
    if (!result) return [];
      return splitVNLines([
        ...(result.visibleConversation || []).map((line, index): VNLine => ({
          id: `${result.actorId}-${index}`,
          background: actorMeetLines(activeActor, activeCasting?.scriptRoleName)[0]?.background || '/pixels/scene-gu-side-corridor.png',
          title: '逐个说服入组',
          subtitle: activeActor.name,
          kind: 'dialogue',
          speaker: line.speaker === '演员' ? activeActor.name : line.speaker,
          text: line.text,
          characters:
            line.speaker === '老赵'
              ? actorSceneCharacters(activeActor, 'zhao')
              : line.speaker === '演员'
                ? actorSceneCharacters(activeActor, 'actor')
                : actorSceneCharacters(activeActor, 'both'),
        })),
        {
          id: `${result.actorId}-hint`,
          background: actorMeetLines(activeActor, activeCasting?.scriptRoleName)[0]?.background || '/pixels/scene-gu-side-corridor.png',
          title: '逐个说服入组',
          subtitle: activeActor.name,
          kind: 'system' as VNLineKind,
          speaker: '系统',
          text: result.visibleHint || '你不知道他真正怎么理解了这句话，但会影响后续拍摄。',
          characters: actorSceneCharacters(activeActor, 'actor'),
        },
      ]);
  }, [activeActor, activeCasting?.scriptRoleName, recruitResults]);
  const currentPersuasionLine = persuasionLines[persuasionLineIndex];
  const currentPreShootLine = preShootLines[preShootLineIndex];
  const currentAudioLine =
    stage === 'intro'
      ? currentIntro
      : stage === 'persuasion-transition'
        ? currentPersuasionSceneLine
        : stage === 'persuasion-playback'
          ? currentPersuasionLine
          : stage === 'pre-shoot-rules'
            ? currentPreShootLine
            : undefined;

  const toggleActor = (actorId: string) => {
    setSelectedActorIds((current) => {
      if (current.includes(actorId)) return current.filter((id) => id !== actorId);
      const actor = actors.find((item) => item.id === actorId);
      if (!actor || current.length >= CASTING_LIMIT.total) return current;
      const sameGenderSelected = actors.filter(
        (item) => current.includes(item.id) && item.gender === actor.gender
      ).length;
      if (sameGenderSelected >= CASTING_LIMIT[actor.gender]) return current;
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
              assignedRole: activeCasting,
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
    setPreShootLineIndex(0);
    setStage('pre-shoot-rules');
  };

  const nextPersuasionSceneLine = () => {
    if (persuasionSceneIndex < persuasionSceneLines.length - 1) {
      setPersuasionSceneIndex((current) => current + 1);
      return;
    }
    setStage('persuasion-task');
  };

  const nextPreShootLine = () => {
    if (preShootLineIndex < preShootLines.length - 1) {
      setPreShootLineIndex((current) => current + 1);
      return;
    }
    setStage('pre-shoot-cover');
  };

  useEffect(() => {
    if (!hasStarted || !autoPlay) return;
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
    if (stage === 'pre-shoot-rules' && currentPreShootLine) {
      const timer = window.setTimeout(nextPreShootLine, autoDelayFor(currentPreShootLine.text));
      return () => window.clearTimeout(timer);
    }
  }, [
    autoPlay,
    currentIntro,
    currentPreShootLine,
    currentPersuasionLine,
    currentPersuasionSceneLine,
    hasStarted,
    introIndex,
    preShootLineIndex,
    persuasionLineIndex,
    persuasionSceneIndex,
    stage,
  ]);

  useEffect(() => {
    installAudioUnlock();
    return () => stopBgm();
  }, []);

  useEffect(() => {
    setAudioEnabled(audioOn);
  }, [audioOn]);

  useEffect(() => {
    if (!hasStarted) return;
    const bgm = bgmForStage(stage, currentAudioLine);
    if (bgm) {
      playBgm(bgm, stage === 'persuasion-transition' || stage === 'persuasion-playback' ? 0.24 : 0.2);
    }
  }, [audioOn, currentAudioLine?.id, hasStarted, stage]);

  useEffect(() => {
    if (!hasStarted) return;
    if (stage === 'casting-task' || stage === 'persuasion-task' || stage === 'pre-shoot-task') {
      playOneShot('/audio/sfx-task-sparkle.mp3', 0.45);
      return;
    }

    const sfx = sfxForLine(currentAudioLine);
    if (sfx) playOneShot(sfx, 0.5);

    const voice = voiceForLine(currentAudioLine, activeActor);
    if (voice) {
      const timer = window.setTimeout(() => playOneShot(voice, 0.42), sfx ? 180 : 0);
      return () => window.clearTimeout(timer);
    }
  }, [activeActor, currentAudioLine?.id, hasStarted, stage]);

  const goToCastingCard = useCallback((direction: 'left' | 'right') => {
    setCastingDirection(direction);
    setCastingIndex((i) =>
      direction === 'right'
        ? Math.min(i + 1, actors.length - 1)
        : Math.max(i - 1, 0)
    );
  }, []);

  useEffect(() => {
    if (stage !== 'casting') return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && castingIndex < actors.length - 1) goToCastingCard('right');
      if (e.key === 'ArrowLeft' && castingIndex > 0) goToCastingCard('left');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [stage, castingIndex, goToCastingCard]);

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

  const beginGame = () => {
    setIntroIndex(0);
    setStage('intro');
    setAutoPlay(true);
    setHasStarted(true);
  };

  const toggleAudio = () => {
    setAudioOn((current) => !current);
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

  if (!hasStarted) {
    return (
      <main className="game-cover-screen">
        <Image
          src="/pixels/game-cover.jpg"
          alt="短剧退步十年，而我保持不变"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="game-cover-vignette" />
        <div className="game-cover-controls">
          <button onClick={beginGame} className="game-cover-start">
            开始游戏
          </button>
          <button
            onClick={toggleAudio}
            className={`game-cover-audio ${audioOn ? 'is-on' : 'is-off'}`}
          >
            音效 {audioOn ? '开' : '关'}
          </button>
        </div>
      </main>
    );
  }

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
        background="/pixels/scene-amateur-pool.png"
        title="片场任务"
        subtitle="开拍前"
        kind="task"
        speaker="任务 01｜从素人池里捞 4 个人"
        text={'目标：选出今天能到、能撑住豪门疯戏的班底。\n限制：只能选 4 个，其中女演员 2 个、男演员 2 个。盒饭和预算不够全上。'}
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
    const currentActor = actors[castingIndex];
    const isSelected = selectedActorIds.includes(currentActor.id);
    const genderFull =
      !isSelected && selectedGenderCounts[currentActor.gender] >= CASTING_LIMIT[currentActor.gender];
    const totalFull = !isSelected && selectedActorIds.length >= CASTING_LIMIT.total;
    const isDisabled = genderFull || totalFull;

    return (
      <VNStage
        background="/pixels/scene-amateur-pool.png"
        title="6 选 4 捞人"
        subtitle="老赵的素人池"
        speaker="老赵"
        text="我给你摸了六个。每个都能来，每个都多少有点问题。"
        kind="dialogue"
        characters={[zhaoCharacter]}
        controls={
          <button
            disabled={!castingReady}
            onClick={() => {
              // Pre-fill manual casting with auto-assigned defaults
              const defaultCasting = assignCasting(selectedActors);
              const defaults: Record<string, string> = {};
              defaultCasting.forEach((c) => { defaults[c.actorId] = c.scriptRoleId; });
              setManualCasting(defaults);
              setStage('role-assign');
            }}
            className="border border-accent-gold px-4 py-2 text-xs text-accent-gold disabled:opacity-35"
          >
            确认班底
          </button>
        }
        overlay={
          <div className="casting-carousel">
            <div className="casting-status-bar text-xs">
              <span className="border border-border bg-bg-deep/82 px-3 py-2 text-text-secondary">
                已选 {selectedActorIds.length}/{CASTING_LIMIT.total}
              </span>
              <span className={`border px-3 py-2 ${
                selectedGenderCounts.female === CASTING_LIMIT.female
                  ? 'border-accent-gold text-accent-gold'
                  : 'border-border text-text-secondary'
              }`}>
                女 {selectedGenderCounts.female}/{CASTING_LIMIT.female}
              </span>
              <span className={`border px-3 py-2 ${
                selectedGenderCounts.male === CASTING_LIMIT.male
                  ? 'border-accent-gold text-accent-gold'
                  : 'border-border text-text-secondary'
              }`}>
                男 {selectedGenderCounts.male}/{CASTING_LIMIT.male}
              </span>
              <span className="px-2 text-text-dim">
                {castingIndex + 1} / {actors.length}
              </span>
            </div>

            <div className="casting-card-wrapper">
              <button
                className="casting-nav-arrow"
                disabled={castingIndex === 0}
                onClick={() => goToCastingCard('left')}
                aria-label="上一个"
              >
                ‹
              </button>

              <div
                key={currentActor.id}
                className={`casting-card ${isSelected ? 'is-selected' : ''} ${isDisabled ? 'is-disabled' : ''} ${
                  castingDirection === 'right' ? 'casting-card-animate-right' : 'casting-card-animate-left'
                }`}
              >
                <div className="casting-card-top">
                  <div className="casting-card-portrait">
                    <Image
                      src={currentActor.avatar}
                      alt={currentActor.name}
                      fill
                      sizes="380px"
                      className="object-contain object-bottom"
                    />
                  </div>
                  <div className="casting-card-topinfo">
                    <div className="casting-card-header">
                      <span className="casting-card-name">{currentActor.name}</span>
                      <span className="casting-card-gender">{genderLabel(currentActor.gender)}</span>
                      {isSelected && <span className="casting-card-check">✓</span>}
                    </div>
                    <div className="casting-card-label">{currentActor.label}</div>
                    <div className="casting-card-hook">{currentActor.hook}</div>
                  </div>
                </div>

                <div className="casting-card-body">
                  <div className="casting-card-grid">
                    <div className="casting-card-cell">
                      <div className="casting-card-cell-title">邪门价值</div>
                      <div className="casting-card-cell-text">{currentActor.weirdValue}</div>
                    </div>
                    <div className="casting-card-cell">
                      <div className="casting-card-cell-title">不受控点</div>
                      <div className="casting-card-cell-text">{currentActor.uncontrolledPoint}</div>
                    </div>
                  </div>
                  <div className="casting-card-danger">
                    <span className="casting-card-cell-title">失控方向</span>
                    <span className="casting-card-danger-text">{currentActor.lossDirection}</span>
                  </div>
                </div>

                <button
                  className={`casting-card-select-btn ${isSelected ? 'is-selected' : ''}`}
                  disabled={isDisabled}
                  onClick={() => toggleActor(currentActor.id)}
                >
                  {isSelected ? '✓ 已选入班底' : isDisabled ? '名额已满' : '选入班底'}
                </button>
              </div>

              <button
                className="casting-nav-arrow"
                disabled={castingIndex === actors.length - 1}
                onClick={() => goToCastingCard('right')}
                aria-label="下一个"
              >
                ›
              </button>
            </div>

            <div className="casting-dots">
              {actors.map((actor, index) => (
                <button
                  key={actor.id}
                  className={`casting-dot ${index === castingIndex ? 'is-active' : ''} ${
                    selectedActorIds.includes(actor.id) ? 'is-selected' : ''
                  }`}
                  onClick={() => {
                    setCastingDirection(index > castingIndex ? 'right' : 'left');
                    setCastingIndex(index);
                  }}
                  aria-label={actor.name}
                />
              ))}
            </div>
          </div>
        }
      />
    );
  }

  if (stage === 'role-assign') {
    const femaleActors = selectedActors.filter((a) => a.gender === 'female');
    const maleActors = selectedActors.filter((a) => a.gender === 'male');
    const femaleRoles = scriptRoles.filter((r) => r.id === 'shen-zhiyi' || r.id === 'wen-ya');
    const maleRoles = scriptRoles.filter((r) => r.id === 'gu-chenzhou' || r.id === 'zhou-assistant');
    const allAssigned = Object.keys(manualCasting).length === scriptRoles.length;

    const assignRole = (actorId: string, roleId: string, genderGroup: Actor[]) => {
      setManualCasting((prev) => {
        const next = { ...prev };
        const sameGenderRoles = genderGroup[0]?.gender === 'female' ? femaleRoles : maleRoles;
        const otherActor = genderGroup.find((a) => a.id !== actorId);
        const otherRole = sameGenderRoles.find((r) => r.id !== roleId);
        next[actorId] = roleId;
        if (otherActor && otherRole) {
          next[otherActor.id] = otherRole.id;
        }
        return next;
      });
    };

    const renderGroup = (groupActors: Actor[], groupRoles: typeof scriptRoles) => (
      <div className="flex flex-col gap-4">
        {groupActors.map((actor) => {
          const assignedRoleId = manualCasting[actor.id];
          return (
            <div key={actor.id} className="border border-border bg-bg-card/90 p-4">
              <div className="mb-3 flex items-center gap-3">
                <span className="text-base font-bold text-text-primary">{actor.name}</span>
                <span className="text-xs text-text-dim">{actor.label}</span>
              </div>
              <div className="flex gap-2">
                {groupRoles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => assignRole(actor.id, role.id, groupActors)}
                    className={`flex-1 border px-3 py-3 text-left transition-colors ${
                      assignedRoleId === role.id
                        ? 'border-accent-gold bg-accent-gold/15 text-accent-gold'
                        : 'border-border text-text-secondary hover:border-text-dim'
                    }`}
                  >
                    <div className="text-sm font-bold">{role.name}</div>
                    <div className="mt-1 text-xs opacity-70">{role.function}</div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );

    return (
      <VNStage
        background="/pixels/scene-amateur-pool.png"
        title="角色分配"
        subtitle="谁演谁"
        speaker="老赵"
        text="班底到了，谁演谁你说了算。"
        kind="dialogue"
        characters={[zhaoCharacter]}
        controls={
          <button
            disabled={!allAssigned}
            onClick={() => {
              setActivePersuasionActorIndex(0);
              setPersuasionSceneIndex(0);
              setPersuasionLineIndex(0);
              setAutoPlay(true);
              setStage('persuasion-transition');
            }}
            className="border border-accent-gold px-4 py-2 text-xs text-accent-gold disabled:opacity-35"
          >
            确认角色
          </button>
        }
        overlay={
          <div className="mx-auto flex max-w-2xl flex-col gap-5 overflow-y-auto px-4 pt-2 pb-4" style={{ maxHeight: 'calc(100vh - 320px)' }}>
            <div>
              <div className="mb-2 text-xs tracking-widest text-text-dim">女演员</div>
              {renderGroup(femaleActors, femaleRoles)}
            </div>
            <div>
              <div className="mb-2 text-xs tracking-widest text-text-dim">男演员</div>
              {renderGroup(maleActors, maleRoles)}
            </div>
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
        characterDisplay="stage"
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
        background="/pixels/scene-amateur-pool.png"
        title="片场任务"
        subtitle="逐个说服入组"
        kind="task"
        speaker={`任务 02｜说服 ${activeActor.name}`}
        text={`目标：用一句话把${activeActor.name}拉进组，预定角色：${activeCasting?.scriptRoleName || '待分配'}。\n方式：只填一个词，让说辞击中他/她最在意的地方。\n风险：你看不到真实心态，但它会写进后续拍摄。`}
        characters={actorCharacter(activeActor)}
        characterDisplay="stage"
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
        background="/pixels/scene-amateur-pool.png"
        title="逐个说服入组"
        subtitle={activeActor.name}
        speaker="老赵"
        text="把话压短。这个年代，没人会为了一个太完整的梦想停下脚步。"
        kind="dialogue"
        characters={actorSceneCharacters(activeActor, 'zhao')}
        characterDisplay="stage"
        controls={
          <button onClick={recruit} className="border border-accent-gold px-4 py-2 text-xs text-accent-gold">
            {loading ? '说服中' : '说出口'}
          </button>
        }
        overlay={
          <div className="vn-persuasion-card">
            <div className="border border-accent-gold/35 bg-bg-deep/88 p-5 backdrop-blur">
              <div className="mb-4 flex items-center gap-3">
                <div className="relative h-14 w-14 overflow-hidden border border-border">
                  <Image
                    src={activeActor.avatar}
                    alt={activeActor.name}
                    fill
                    sizes="56px"
                    className="bg-white/90 object-contain object-bottom"
                  />
                </div>
                <div>
                  <div className="font-bold text-accent-gold">{activeActor.name}</div>
                  <div className="text-xs text-accent-blue">
                    {activeActor.label} · 预定 {activeCasting?.scriptRoleName || '待分配'}
                  </div>
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
        characterDisplay="stage"
        history={historyFromLines(persuasionLines, persuasionLineIndex)}
        controls={playbackControls(nextPersuasionLine, persuasionLineIndex >= persuasionLines.length - 1, '去片场')}
      />
    );
  }

  if (stage === 'pre-shoot-rules' && currentPreShootLine) {
    return (
      <VNStage
        background={currentPreShootLine.background}
        title={currentPreShootLine.title}
        subtitle={currentPreShootLine.subtitle}
        speaker={currentPreShootLine.speaker}
        text={currentPreShootLine.text}
        kind={currentPreShootLine.kind}
        characters={currentPreShootLine.characters}
        history={historyFromLines(preShootLines, preShootLineIndex)}
        controls={playbackControls(
          nextPreShootLine,
          preShootLineIndex >= preShootLines.length - 1,
          '看任务'
        )}
      />
    );
  }

  if (stage === 'pre-shoot-cover') {
    return (
      <main className="inner-drama-cover-screen">
        <Image
          src="/pixels/inner-drama-cover.jpg"
          alt="《离婚夜，霸总强吻我后，白月光也疯了》剧中剧封面"
          fill
          sizes="100vw"
          className="inner-drama-cover-full"
          priority
        />
        <div className="inner-drama-cover-shade" />
        <button onClick={() => setStage('pre-shoot-task')} className="inner-drama-start-button">
          开拍
        </button>
      </main>
    );
  }

  if (stage === 'pre-shoot-task') {
    return (
      <main className="shooting-task-screen">
        <Image
          src="/pixels/scene-gu-banquet-corridor.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="pre-shoot-briefing-vignette" />
        <section className="shooting-task-layout">
          <div className="shooting-task-card">
            <div className="pixel-text text-xs text-accent-blue">TASK 03 / 正式开拍</div>
            <h1>拍完这支第一集样片</h1>
            <p className="shooting-task-lead">
              接下来你是片场导演。镜头会自动往前拍，你要判断什么时候放任失控，什么时候出手救场。
            </p>
            <div className="shooting-task-sections">
              <div className="shooting-task-section">
                <h2>你要做什么</h2>
                <p>拍完 9 幕第一集样片。每一句会自动播放，演员会根据入组心态产生现场反应。</p>
                <p>你不需要每句都管，只在最影响成片方向的时刻使用工具。</p>
              </div>
              <div className="shooting-task-section">
                <h2>数值机制</h2>
                <div className="shooting-task-grid">
                  <div><span>预算</span>演员反应、补救和拖延都会烧钱。</div>
                  <div><span>爆相</span>越狗血越上涨，但爆相高也可能更失控。</div>
                  <div><span>体面</span>羞辱、下跪、强吻和发疯台词会扣体面。</div>
                  <div><span>可控</span>演员越把现实身份带进戏，现场越难收住。</div>
                </div>
              </div>
              <div className="shooting-task-section">
                <h2>导演工具</h2>
                <div className="shooting-tool-brief">
                  <div><b>喊卡</b> 打断当前表演，重新校准这一句。</div>
                  <div><b>改词</b> 选中当前剧本文字，输入修改方向。</div>
                  <div><b>加鸡腿</b> 花钱安抚当前最不稳的演员。</div>
                  <div><b>导演示范</b> 亲自示范这一段该怎么演。</div>
                </div>
              </div>
              <div className="shooting-task-section is-warning">
                每幕通常只能干预 1 次，关键幕会给 2 次。不开工具时，片场会继续自动拍下去。
              </div>
            </div>
            <button onClick={start} className="pre-shoot-start-button">
              进入拍摄
            </button>
          </div>
        </section>
      </main>
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
    />
  );
}
