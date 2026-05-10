import {
  Actor,
  ActDraft,
  Casting,
  Project,
  ScriptRole,
  ScriptSkeletonAct,
  ShootLine,
  Stats,
  ToolDefinition,
} from './gameTypes';

export const project: Project = {
  id: 'divorce-night-gu-family',
  title: '离婚夜，顾总当众强吻我后，白月光也疯了',
  logline:
    '离开顾家三年的沈知意被重新叫回晚宴。顾沉舟、温雅、周特助和顾家长辈在公开场合集体失控，试图把她重新拖回豪门秩序。',
  tone: '低配豪门、当众发病、体面崩塌、旧情未死、女主清醒',
  cover: '/pixels/scene-gu-banquet-corridor.png',
};

export const initialStats: Stats = {
  budget: 100,
  buzz: 30,
  dignity: 70,
  control: 60,
};

export const tools: ToolDefinition[] = [
  {
    id: 'cut',
    name: '喊卡',
    icon: '✂',
    description: '打断当前表演，重新校准片场方向',
  },
  {
    id: 'rewrite',
    name: '改词',
    icon: '✎',
    description: '选中当前剧本文字，输入一个修改方向',
  },
  {
    id: 'chicken',
    name: '加鸡腿',
    icon: '▣',
    description: '花钱安抚当前最不稳的演员',
  },
  {
    id: 'demo',
    name: '导演示范',
    icon: '▤',
    description: '亲自示范这一段该怎么演',
  },
];

export const actors: Actor[] = [
  {
    id: 'lin-xiaoman',
    name: '林小满',
    gender: 'female',
    label: '地下偶像退役成员',
    realIdentity: '前地下偶像成员，曾因被恶意解读的“偷吃”词条炎上退团。',
    hook: '她最懂镜头，也最怕镜头后的人把一句话听成另一个意思。',
    weirdValue: '镜头感强，表情管理好，能把被误解和强装体面演得很真。',
    uncontrolledPoint: '对双关、暧昧关系、可被截图传播的词句极度敏感。',
    suitableRoles: ['沈知意', '温雅'],
    lossDirection: '把短剧片场变成随时可能被误读的公关危机。',
    avatar: '/pixels/actor-real-lin-xiaoman.png',
    persuasionTemplate: '这场戏不是消费你，是需要你身上那种____之后还要站稳的体面。',
    defaultWord: '被误解',
  },
  {
    id: 'sun-manli',
    name: '孙曼丽',
    gender: 'female',
    label: '美甲店老板娘',
    realIdentity: '小区美甲店老板娘，长期听客人聊感情八卦，也护着王娜娜。',
    hook: '她不是在演短剧，她是在给这段关系做诊断。',
    weirdValue: '极懂狗血关系里的心理动机，说出来的话像观众弹幕。',
    uncontrolledPoint: '会边演边分析人物关系，忍不住拆穿“这男的到底哪里不对”。',
    suitableRoles: ['顾家长辈', '温雅', '片场关系顾问'],
    lossDirection: '把剧情变成情感调解。',
    avatar: '/pixels/actor-real-sun-manli.png',
    persuasionTemplate: '这戏缺的不是演员，是一个真正懂____的人。',
    defaultWord: '关系',
  },
  {
    id: 'wang-nana',
    name: '王娜娜',
    gender: 'female',
    label: '美甲店临时工 / 快手小主播预备役',
    realIdentity: '美甲店临时帮工，常拍快手对口型和变装，正被本地直播公会画饼。',
    hook: '她不是没机会，她只是太容易相信每一个说她能火的人。',
    weirdValue: '漂亮、不怯镜头、动作表现欲强，土、直、冲，但很有平台感。',
    uncontrolledPoint: '会把所有戏都演成“我今天必须让别人记住我”。',
    suitableRoles: ['沈知意', '温雅'],
    lossDirection: '把短剧拍成精神小妹狠狠爱，土但很带劲。',
    avatar: '/pixels/actor-real-wang-nana.png',
    persuasionTemplate: '你不是土，你是有一种____的镜头生命力。',
    defaultWord: '能火',
  },
  {
    id: 'zhang-jiahao',
    name: '张嘉豪',
    gender: 'male',
    label: '夜场商务男模',
    realIdentity: '夜场商务演出男模，常接生日局、富婆局和酒吧主题夜。',
    hook: '他不是不会演深情，他只是会把所有深情都演成“姐姐今晚开心吗”。',
    weirdValue: '身体表现力强，镜头侵略感强，很会制造暧昧和压迫。',
    uncontrolledPoint: '会把霸总、危险感、深情都演成服务型暧昧营业。',
    suitableRoles: ['顾沉舟'],
    lossDirection: '把霸总戏演成夜场互动。',
    avatar: '/pixels/actor-real-zhang-jiahao.png',
    persuasionTemplate: '我找你来，不是因为你像夜场，是因为你身上有一种____的危险感。',
    defaultWord: '失控',
  },
  {
    id: 'qiu-peng',
    name: '邱鹏',
    gender: 'male',
    label: '失业高中同学',
    realIdentity: '导演的高中同学，最近失业，朋友圈常发低谷期重启文案。',
    hook: '他不是来演戏的，他是来证明自己还没废。',
    weirdValue: '便宜、好说话、时间多，身上有真实失败感。',
    uncontrolledPoint: '台词碰到失败、没钱、被抛弃时，容易和现实重叠。',
    suitableRoles: ['顾沉舟', '周特助'],
    lossDirection: '把短剧里的落魄男主演成真实人生危机。',
    avatar: '/pixels/actor-real-qiu-peng.png',
    persuasionTemplate: '这个角色需要的不是演技，是你身上那种____之后还要撑住体面的劲儿。',
    defaultWord: '跌下来',
  },
  {
    id: 'guo-gang',
    name: '郭港',
    gender: 'male',
    label: '夜班保安',
    realIdentity: '主角前司写字楼夜班保安，脸和身形很有压迫感。',
    hook: '长得像幕后大佬，其实只是困。',
    weirdValue: '不说话时特别像黑道、豪门管家、沉默父亲。',
    uncontrolledPoint: '极度怕麻烦，不想多说，不想多动，一开口神秘感掉一半。',
    suitableRoles: ['顾家长辈', '保镖', '沉默父亲'],
    lossDirection: '沉默很好用，但无法承受复杂表演。',
    avatar: '/pixels/actor-real-guo-gang.png',
    persuasionTemplate: '这场戏最缺的，是你这种不用说话也有____的气场。',
    defaultWord: '压迫',
  },
];

export const scriptRoles: ScriptRole[] = [
  {
    id: 'shen-zhiyi',
    name: '沈知意',
    function: '离开顾家三年的前妻，唯一试图保持正常的人。',
  },
  {
    id: 'gu-chenzhou',
    name: '顾沉舟',
    function: '顾家继承人，越想挽回越把事情搞得更糟。',
  },
  {
    id: 'wen-ya',
    name: '温雅',
    function: '体面现任，发现自己始终不是顾家真正认下的人。',
  },
  {
    id: 'zhou-assistant',
    name: '周特助 / 顾家长辈',
    function: '顾家秩序的荒唐出口，负责下跪、拱火和把顾家机器说出口。',
  },
];

const rolePreference: Record<string, string[]> = {
  'shen-zhiyi': ['lin-xiaoman', 'wang-nana', 'sun-manli'],
  'gu-chenzhou': ['zhang-jiahao', 'qiu-peng'],
  'wen-ya': ['lin-xiaoman', 'wang-nana', 'sun-manli'],
  'zhou-assistant': ['qiu-peng', 'guo-gang', 'sun-manli'],
};

export function assignCasting(selectedActors: Actor[]): Casting[] {
  if (selectedActors.length < scriptRoles.length) return [];

  const remaining = [...selectedActors];
  return scriptRoles.map((role) => {
    const preferred = rolePreference[role.id] || [];
    const matchIndex = remaining.findIndex((actor) => preferred.includes(actor.id));
    const actor = remaining.splice(matchIndex >= 0 ? matchIndex : 0, 1)[0];

    return {
      scriptRoleId: role.id,
      scriptRoleName: role.name,
      actorId: actor.id,
      actorName: actor.name,
    };
  });
}

const baseScriptSkeleton: ScriptSkeletonAct[] = [
  {
    actId: 'act_01',
    title: '顾家晚宴外廊羞辱',
    scene: '顾家晚宴外廊，灯火通明，两侧站着顾家亲戚和宾客，像在等人，也像在等笑话。',
    mustHappen: '沈知意被顾家亲戚和宾客围观羞辱，顾沉舟出场要求她进去。',
    bombPoint: '顾家人一边把她当外人，一边又默认她必须回到顾家秩序里。',
    requiredOutcome: '沈知意意识到今晚不是普通见面，而是顾家公开设局。',
    targetLineCount: { min: 18, max: 22 },
    beats: [
      {
        beatId: 'act_01_b01',
        beatType: 'shot',
        referenceText: '顾家晚宴外廊灯火很满，宾客和亲戚站在两侧，空气像提前排好的一场审判。',
        actionCue: '镜头从水晶灯扫到沈知意停下的脚步。',
        innerCue: '沈知意一进来就知道这不是一顿好饭。',
        riskTag: '围观压迫',
        mustKeep: true,
      },
      {
        beatId: 'act_01_b02',
        beatType: 'dialogue',
        speaker: '顾家长辈',
        referenceText: '还知道回来。顾家这些年，倒是第一次为了一个外人这么热闹。',
        riskTag: '长辈羞辱台词',
        mustKeep: true,
      },
      {
        beatId: 'act_01_b03',
        beatType: 'dialogue',
        speaker: '沈知意',
        referenceText: '不是你们叫我来的么。现在我来了，又摆这副脸给谁看？',
        innerCue: '她不是怕，是在确认顾家到底想把她放到什么位置。',
        riskTag: '女主反击开场',
        mustKeep: true,
      },
      {
        beatId: 'act_01_b04a',
        beatType: 'action',
        speaker: '顾沉舟',
        referenceText: '顾沉舟从人群里走出来，盯着她。',
        riskTag: '霸总登场',
        mustKeep: true,
      },
      {
        beatId: 'act_01_b04b',
        beatType: 'dialogue',
        speaker: '顾沉舟',
        referenceText: '知意，跟我进去。',
        actionCue: '他不是邀请，是宣布。',
        riskTag: '霸总压迫感',
        mustKeep: true,
      },
      {
        beatId: 'act_01_b05',
        beatType: 'dialogue',
        speaker: '沈知意',
        referenceText: '顾总是不是忘了，我三年前就不是顾家的人了。',
        innerCue: '她主动把“前妻”身份切断。',
        riskTag: '身份切割',
        mustKeep: true,
      },
      {
        beatId: 'act_01_b06',
        beatType: 'dialogue',
        speaker: '温雅',
        referenceText: '是不是顾家的人，不是你一句话说了算。今晚能站在这里的人，才算。',
        innerCue: '温雅表面体面，实际在宣示席位。',
        riskTag: '现任挑衅',
        mustKeep: true,
      },
      {
        beatId: 'act_01_b07',
        beatType: 'dialogue',
        speaker: '沈知意',
        referenceText: '那你站得挺稳的。',
        actionCue: '温雅笑意僵住。',
        riskTag: '短句打脸',
        mustKeep: true,
      },
      {
        beatId: 'act_01_b08a',
        beatType: 'dialogue',
        speaker: '顾沉舟',
        referenceText: '我最后说一遍，跟我进去。',
        riskTag: '最后通牒',
        mustKeep: true,
      },
      {
        beatId: 'act_01_b08b',
        beatType: 'dialogue',
        speaker: '沈知意',
        referenceText: '我要是不呢？',
        riskTag: '女主对抗',
        mustKeep: true,
      },
      {
        beatId: 'act_01_b08c',
        beatType: 'turning_point',
        speaker: '顾沉舟',
        referenceText: '由不得你。',
        actionCue: '顾沉舟开始越过正常沟通边界。',
        riskTag: '强制带入下一幕',
        mustKeep: true,
      },
    ],
  },
  {
    actId: 'act_02',
    title: '顾沉舟公开越线',
    scene: '晚宴外廊中央，宾客距离很近，所有人的目光都卡在顾沉舟和沈知意身上。',
    mustHappen: '顾沉舟试图用强势方式把沈知意拖回顾家。',
    bombPoint: '原剧本是当众强吻，素人演员会对动作边界、人物逻辑和体面感产生抗拒。',
    requiredOutcome: '顾沉舟公开失控，温雅被刺激，沈知意被冒犯。',
    targetLineCount: { min: 20, max: 24 },
    beats: [
      {
        beatId: 'act_02_b01',
        beatType: 'dialogue',
        speaker: '沈知意',
        referenceText: '三年前你让我滚的时候，也说过这句。',
        innerCue: '她把顾沉舟现在的“挽回”和当年的驱逐放在一起。',
        riskTag: '旧伤翻出',
        mustKeep: true,
      },
      {
        beatId: 'act_02_b02',
        beatType: 'action',
        speaker: '顾沉舟',
        referenceText: '顾沉舟眼神一沉，突然上前，一把拽住她手腕。',
        actionCue: '动作要明显越线，但可以根据工具干预改成拦路、抓袖口或逼近。',
        riskTag: '肢体边界',
        mustKeep: true,
      },
      {
        beatId: 'act_02_b03',
        beatType: 'dialogue',
        speaker: '沈知意',
        referenceText: '你干什么——',
        innerCue: '她的第一反应是被冒犯，不是心动。',
        riskTag: '女主抗拒',
        mustKeep: true,
      },
      {
        beatId: 'act_02_b04',
        beatType: 'action',
        speaker: '顾沉舟',
        referenceText: '顾沉舟直接将她拽到面前，当众强吻。',
        actionCue: '镜头贴近两人的距离变化，动作可以根据现场状态处理成借位、错位、停在半步外或被及时打断。',
        riskTag: '必炸动作',
        mustKeep: true,
      },
      {
        beatId: 'act_02_b05a',
        beatType: 'shot',
        referenceText: '全场安静。',
        riskTag: '空气冻结',
        mustKeep: true,
      },
      {
        beatId: 'act_02_b05b',
        beatType: 'action',
        speaker: '沈知意',
        referenceText: '几秒后沈知意猛地推开他，抬手就是一巴掌。',
        actionCue: '片场如果前面改掉强吻，这里也必须跟着改成对应反击。',
        riskTag: '强反击动作',
        mustKeep: true,
      },
      {
        beatId: 'act_02_b06',
        beatType: 'dialogue',
        speaker: '沈知意',
        referenceText: '顾沉舟，你有病吧？！',
        riskTag: '价值观撞击',
        mustKeep: true,
      },
      {
        beatId: 'act_02_b07',
        beatType: 'dialogue',
        speaker: '顾沉舟',
        referenceText: '对，我有病。从你签字离婚那天起，我就没正常过。',
        innerCue: '他把后悔说成病，把失控包装成深情。',
        riskTag: '疯批深情',
        mustKeep: true,
      },
      {
        beatId: 'act_02_b08',
        beatType: 'inner',
        speaker: '温雅',
        referenceText: '温雅站在旁边，笑了一下，但眼神已经不对了。',
        innerCue: '她意识到自己站在顾沉舟身边，也未必是被承认的人。',
        riskTag: '女二被点燃',
        mustKeep: true,
      },
    ],
  },
  {
    actId: 'act_03',
    title: '这一口是你欠顾家的',
    scene: '同一条外廊，强行越线后的寂静还没有散，顾家人和宾客都在等下一句怎么收场。',
    mustHappen: '顾沉舟说出一句把沈知意重新绑定顾家的冒犯台词。',
    bombPoint: '“这一口，是你欠顾家的”太疯也太脏，演员可能要求改。',
    requiredOutcome: '顾沉舟的挽回被证明仍然裹着顾家的控制和债务逻辑。',
    targetLineCount: { min: 18, max: 22 },
    beats: [
      {
        beatId: 'act_03_b01',
        beatType: 'dialogue',
        speaker: '沈知意',
        referenceText: '你发疯别拉着我。',
        innerCue: '她拒绝把他的失控理解成爱情。',
        riskTag: '女主清醒',
        mustKeep: true,
      },
      {
        beatId: 'act_03_b02',
        beatType: 'dialogue',
        speaker: '顾沉舟',
        referenceText: '这一口，是你欠顾家的。',
        actionCue: '镜头落在众人的反应上，让刚才那场难堪变成所有人都无法假装没看见的空气。',
        riskTag: '台词说不出口',
        mustKeep: true,
      },
      {
        beatId: 'act_03_b03',
        beatType: 'shot',
        referenceText: '全场直接死寂，连顾家长辈都愣住了一秒。',
        riskTag: '空气冻结',
        mustKeep: true,
      },
      {
        beatId: 'act_03_b04',
        beatType: 'inner',
        speaker: '沈知意',
        referenceText: '沈知意像是被这句话雷到，气得都笑了。',
        innerCue: '她不是被打动，是确认顾家仍然把她当债务。',
        riskTag: '怒极反笑',
        mustKeep: true,
      },
      {
        beatId: 'act_03_b05',
        beatType: 'dialogue',
        speaker: '沈知意',
        referenceText: '我欠顾家？你们顾家是有脸说这种话的？',
        riskTag: '女主打脸',
        mustKeep: true,
      },
      {
        beatId: 'act_03_b06',
        beatType: 'dialogue',
        speaker: '顾沉舟',
        referenceText: '我就是要让所有人看清楚——顾家认的人，从来都只有你。',
        innerCue: '他以为这是给名分，实际更像公开占有。',
        riskTag: '深情变控制',
        mustKeep: true,
      },
      {
        beatId: 'act_03_b07',
        beatType: 'dialogue',
        speaker: '顾家长辈',
        referenceText: '疯了……真疯了……',
        riskTag: '顾家也被吓到',
        mustKeep: false,
      },
      {
        beatId: 'act_03_b08',
        beatType: 'turning_point',
        speaker: '温雅',
        referenceText: '只有她？',
        actionCue: '温雅从旁观者变成下一幕的主动失控者。',
        riskTag: '女二反击起点',
        mustKeep: true,
      },
    ],
  },
  {
    actId: 'act_04',
    title: '温雅失控反击',
    scene: '外廊人群中央，温雅从顾沉舟身侧走出来，体面表情开始裂开。',
    mustHappen: '温雅被顾沉舟对沈知意的偏向刺激，当众失去体面。',
    bombPoint: '原剧本是温雅反强吻顾沉舟，动作和动机会让演员炸锅。',
    requiredOutcome: '温雅不再只是体面现任，而成为修罗场第二个发病的人。',
    targetLineCount: { min: 20, max: 24 },
    beats: [
      {
        beatId: 'act_04_b01',
        beatType: 'action',
        speaker: '温雅',
        referenceText: '温雅一步一步走过去，猛地拽住顾沉舟领带，把人拉下来。',
        actionCue: '动作要体现“我要把你刚才给她的东西抢回来”。',
        riskTag: '女二动作越线',
        mustKeep: true,
      },
      {
        beatId: 'act_04_b02',
        beatType: 'action',
        speaker: '温雅',
        referenceText: '温雅当着沈知意的面强吻了顾沉舟。',
        actionCue: '可根据前文补丁改成近距离逼视、贴脸宣示、抓领带逼问。',
        riskTag: '必炸动作',
        mustKeep: true,
      },
      {
        beatId: 'act_04_b03',
        beatType: 'dialogue',
        speaker: '沈知意',
        referenceText: '你们顾家平时吃饭都这么演吗？',
        riskTag: '女主吐槽降维',
        mustKeep: true,
      },
      {
        beatId: 'act_04_b04a',
        beatType: 'action',
        speaker: '顾沉舟',
        referenceText: '顾沉舟立刻把温雅推开。',
        riskTag: '推开动作',
        mustKeep: true,
      },
      {
        beatId: 'act_04_b04b',
        beatType: 'dialogue',
        speaker: '顾沉舟',
        referenceText: '温雅，你够了！',
        riskTag: '男主把女二推到对立面',
        mustKeep: true,
      },
      {
        beatId: 'act_04_b05',
        beatType: 'dialogue',
        speaker: '温雅',
        referenceText: '我够了？顾沉舟，你当着我的面吻她，现在还说我够了？',
        innerCue: '她终于把体面话撕开，说出自己被当空气的羞辱。',
        riskTag: '现任崩盘',
        mustKeep: true,
      },
      {
        beatId: 'act_04_b06',
        beatType: 'dialogue',
        speaker: '温雅',
        referenceText: '你可以拿她刺激我，但你不能拿她赢我。',
        innerCue: '她不是单纯吃醋，是输不起位置。',
        riskTag: '抽象短剧台词',
        mustKeep: true,
      },
      {
        beatId: 'act_04_b07',
        beatType: 'dialogue',
        speaker: '温雅',
        referenceText: '如果不是你，今晚站在这里的人就是我！',
        riskTag: '女二地位焦虑',
        mustKeep: true,
      },
      {
        beatId: 'act_04_b08',
        beatType: 'dialogue',
        speaker: '沈知意',
        referenceText: '那你站啊。我又没跟你抢。',
        innerCue: '沈知意拒绝进入雌竞逻辑。',
        riskTag: '女主拒绝陪演',
        mustKeep: true,
      },
      {
        beatId: 'act_04_b09',
        beatType: 'turning_point',
        speaker: '顾沉舟',
        referenceText: '都给我闭嘴。',
        actionCue: '男主试图重新控场，但已经压不住顾家集体发病。',
        riskTag: '控场失败',
        mustKeep: true,
      },
    ],
  },
  {
    actId: 'act_05',
    title: '顾家选女主人',
    scene: '晚宴厅入口被吵声吸引，顾家长辈终于从体面外壳里伸手干预。',
    mustHappen: '顾家长辈把私人修罗场升级成顾家秩序问题。',
    bombPoint: '“今晚谁能留下，谁就是顾家的女主人”封建又拱火，演员可能说不出口。',
    requiredOutcome: '沈知意确认顾家从头到尾仍把她当成一个位置。',
    targetLineCount: { min: 18, max: 22 },
    beats: [
      {
        beatId: 'act_05_b01',
        beatType: 'shot',
        referenceText: '一位顾家长辈终于忍不住开口，声音不大，却足够让所有人听见。',
        actionCue: '镜头从年轻人的修罗场切到顾家秩序本身。',
        riskTag: '长辈入场',
        mustKeep: true,
      },
      {
        beatId: 'act_05_b02',
        beatType: 'dialogue',
        speaker: '顾家长辈',
        referenceText: '今晚谁能留下，谁就是顾家的女主人。',
        innerCue: '长辈不认为这是侮辱，而认为这是给位置。',
        riskTag: '封建台词',
        mustKeep: true,
      },
      {
        beatId: 'act_05_b03',
        beatType: 'inner',
        speaker: '温雅',
        referenceText: '温雅呼吸都急了。',
        innerCue: '她听见“女主人”三个字，第一反应是自己终于被放上秤，但也可能输。',
        riskTag: '女二被拱火',
        mustKeep: true,
      },
      {
        beatId: 'act_05_b04',
        beatType: 'dialogue',
        speaker: '沈知意',
        referenceText: '你们顾家现在连人都要这么选？',
        innerCue: '她确认自己不是被邀请，是被公开估价。',
        riskTag: '女主识破机制',
        mustKeep: true,
      },
      {
        beatId: 'act_05_b05',
        beatType: 'dialogue',
        speaker: '顾家长辈',
        referenceText: '顾家的体面不能没人撑，谁能撑住，谁就留下。',
        riskTag: '顾家机器说人话',
        mustKeep: false,
      },
      {
        beatId: 'act_05_b06',
        beatType: 'dialogue',
        speaker: '顾沉舟',
        referenceText: '够了，这不是你们能决定的事。',
        innerCue: '他想护沈知意，但仍然默认她和顾家的关系可以被讨论。',
        riskTag: '男主护人失败',
        mustKeep: true,
      },
      {
        beatId: 'act_05_b07',
        beatType: 'dialogue',
        speaker: '沈知意',
        referenceText: '你现在拦他们，是怕他们羞辱我，还是怕他们把你的心思说太明白？',
        riskTag: '女主剖开男主',
        mustKeep: true,
      },
      {
        beatId: 'act_05_b08',
        beatType: 'turning_point',
        referenceText: '人群外传来急促脚步声，周特助冲进来。',
        actionCue: '下一幕从长辈封建，升级成助理殉道式下跪。',
        riskTag: '周特助冲场',
        mustKeep: true,
      },
    ],
  },
  {
    actId: 'act_06',
    title: '周特助下跪',
    scene: '晚宴厅边缘，周特助从人群后冲出来，像比顾沉舟本人更急。',
    mustHappen: '周特助冲出来跪求沈知意回顾家。',
    bombPoint: '总助突然下跪动作过满，演员会问“我真的要跪吗”。',
    requiredOutcome: '顾家集体发病具象化，周特助比主子还投入。',
    targetLineCount: { min: 18, max: 22 },
    beats: [
      {
        beatId: 'act_06_b01',
        beatType: 'action',
        speaker: '周特助',
        referenceText: '周特助突然冲上来，眼圈发红，扑通一声跪下。',
        actionCue: '镜头压住周特助身体下沉的瞬间，动作可以根据现场状态处理成半跪、扶桌、深鞠躬或跪到一半被拦。',
        riskTag: '必炸动作',
        mustKeep: true,
      },
      {
        beatId: 'act_06_b02',
        beatType: 'dialogue',
        speaker: '周特助',
        referenceText: '顾总！别闹了！老爷子撑着一口气，就是想见少夫人回家！',
        innerCue: '他像顾家机器里最真诚也最荒唐的零件。',
        riskTag: '总助过度投入',
        mustKeep: true,
      },
      {
        beatId: 'act_06_b03',
        beatType: 'dialogue',
        speaker: '沈知意',
        referenceText: '你叫谁少夫人？',
        riskTag: '称呼反感',
        mustKeep: true,
      },
      {
        beatId: 'act_06_b04',
        beatType: 'dialogue',
        speaker: '周特助',
        referenceText: '少夫人，顾家不能没有您！',
        riskTag: '台词说不出口',
        mustKeep: true,
      },
      {
        beatId: 'act_06_b05',
        beatType: 'dialogue',
        speaker: '周特助',
        referenceText: '这三年顾总没睡过一个安稳觉，老爷也没真正高兴过一天！',
        innerCue: '他把顾家的所有痛苦都压到沈知意该回去这件事上。',
        riskTag: '道德绑架',
        mustKeep: true,
      },
      {
        beatId: 'act_06_b06',
        beatType: 'shot',
        referenceText: '全场没人敢接话，顾沉舟僵住，温雅脸色越来越白。',
        riskTag: '全员尴尬',
        mustKeep: true,
      },
      {
        beatId: 'act_06_b07',
        beatType: 'inner',
        speaker: '沈知意',
        referenceText: '沈知意看着跪在地上的周特助，像终于看懂顾家这套秩序有多荒唐。',
        riskTag: '女主看清顾家',
        mustKeep: true,
      },
      {
        beatId: 'act_06_b08',
        beatType: 'turning_point',
        speaker: '周特助',
        referenceText: '周特助越说越激动，彻底豁出去了。',
        actionCue: '铺垫下一幕最炸台词。',
        riskTag: '失控升级',
        mustKeep: true,
      },
    ],
  },
  {
    actId: 'act_07',
    title: '只有您和温小姐的嘴',
    scene: '顾家晚宴现场空气冻结，周特助仍跪着，所有人已经不确定这场戏还能不能拍下去。',
    mustHappen: '周特助说出极炸、极尴尬的忠心台词。',
    bombPoint: '“顾总三年碰过的女人，只有您和温小姐的嘴”会让全场沉默。',
    requiredOutcome: '片场空气冻结，顾家荒唐忠心被推到顶点。',
    targetLineCount: { min: 18, max: 22 },
    beats: [
      {
        beatId: 'act_07_b01',
        beatType: 'dialogue',
        speaker: '周特助',
        referenceText: '少夫人，顾总这三年碰过的女人，只有您和温小姐的嘴！',
        actionCue: '镜头扫过顾沉舟和温雅，空气里只剩下说不出口的尴尬。',
        riskTag: '最炸台词',
        mustKeep: true,
      },
      {
        beatId: 'act_07_b02',
        beatType: 'shot',
        referenceText: '全场彻底安静，不是震惊，是那种“这也能说”的空白。',
        riskTag: '空气冻结',
        mustKeep: true,
      },
      {
        beatId: 'act_07_b03',
        beatType: 'inner',
        speaker: '顾沉舟',
        referenceText: '顾沉舟都僵了一瞬。',
        innerCue: '他第一次发现自己的失控被助理说成了顾家公文。',
        riskTag: '男主尴尬',
        mustKeep: true,
      },
      {
        beatId: 'act_07_b04',
        beatType: 'dialogue',
        speaker: '温雅',
        referenceText: '周特助，你疯了吗？！',
        innerCue: '温雅被公开放在和沈知意同一张荒唐表格上。',
        riskTag: '女二破防',
        mustKeep: true,
      },
      {
        beatId: 'act_07_b05',
        beatType: 'dialogue',
        speaker: '沈知意',
        referenceText: '……你们顾家，是真没一个正常人了。',
        riskTag: '女主总结疯感',
        mustKeep: true,
      },
      {
        beatId: 'act_07_b06',
        beatType: 'dialogue',
        speaker: '周特助',
        referenceText: '少夫人，您要是不回去，顾家今晚就真的散了！',
        riskTag: '道德绑架加码',
        mustKeep: true,
      },
      {
        beatId: 'act_07_b07',
        beatType: 'dialogue',
        speaker: '温雅',
        referenceText: '够了！我到底算什么？！',
        innerCue: '她终于承认自己害怕的是没有名分。',
        riskTag: '女二崩溃',
        mustKeep: true,
      },
      {
        beatId: 'act_07_b08',
        beatType: 'dialogue',
        speaker: '周特助',
        referenceText: '温小姐，您不是顾家的人。可少夫人，是老爷亲口认下的。',
        riskTag: '顾家认人机制',
        mustKeep: true,
      },
    ],
  },
  {
    actId: 'act_08',
    title: '沈知意全员审判',
    scene: '晚宴厅中央，所有人的失控都堆在沈知意面前，她终于不再只接招。',
    mustHappen: '沈知意把顾沉舟、温雅、周特助和顾家长辈全部剖开。',
    bombPoint: '女主长篇审判爽但难演，演员可能想从总结陈词改成直接骂人。',
    requiredOutcome: '沈知意说清自己不是回来被选，而是拒绝再次被顾家定义。',
    targetLineCount: { min: 22, max: 26 },
    beats: [
      {
        beatId: 'act_08_b01',
        beatType: 'shot',
        referenceText: '沈知意看着眼前跪着的、疯着的、哭着的、盯着她的这一群人，彻底冷下来。',
        innerCue: '她不是情绪崩溃，而是进入审判状态。',
        riskTag: '女主开大前静默',
        mustKeep: true,
      },
      {
        beatId: 'act_08_b02',
        beatType: 'dialogue',
        speaker: '沈知意',
        referenceText: '一个当众强吻，一个当众发疯，一个当众下跪，一个当众选女主人。',
        actionCue: '沈知意把今晚发生过的难堪一件件摆回桌面，语速不快，但每句都像落锤。',
        riskTag: '总结前文事故',
        mustKeep: true,
      },
      {
        beatId: 'act_08_b03',
        beatType: 'dialogue',
        speaker: '沈知意',
        referenceText: '你们顾家今晚这出戏，真够热闹的。',
        riskTag: '冷讽收束',
        mustKeep: true,
      },
      {
        beatId: 'act_08_b04',
        beatType: 'dialogue',
        speaker: '顾沉舟',
        referenceText: '知意，跟我回去。只要你点头，顾家的一切都是你的。',
        innerCue: '他仍然以为给出顾家资源就是补偿。',
        riskTag: '男主迟到补偿',
        mustKeep: true,
      },
      {
        beatId: 'act_08_b05',
        beatType: 'dialogue',
        speaker: '沈知意',
        referenceText: '我现在看起来，很像缺你们顾家这口饭吗？',
        riskTag: '女主拒绝施舍',
        mustKeep: true,
      },
      {
        beatId: 'act_08_b06',
        beatType: 'dialogue',
        speaker: '顾沉舟',
        referenceText: '你可以不要我。但你不能不要本来就属于你的东西。',
        riskTag: '占有包装成归还',
        mustKeep: true,
      },
      {
        beatId: 'act_08_b07',
        beatType: 'dialogue',
        speaker: '沈知意',
        referenceText: '你现在是想让我回顾家，还是想让我回去，替你们所有人收拾这场烂戏？',
        riskTag: '女主剖核心',
        mustKeep: true,
      },
      {
        beatId: 'act_08_b08',
        beatType: 'dialogue',
        speaker: '沈知意',
        referenceText: '你当众吻我，是想证明你后悔了。她当众吻你，是想证明她没输。你助理跪下来求我，是想证明顾家离不开我。',
        actionCue: '她的目光从顾家人脸上扫过，把这场晚宴里发生过的荒唐一笔一笔还回去。',
        riskTag: '长台词难演',
        mustKeep: true,
      },
      {
        beatId: 'act_08_b09',
        beatType: 'dialogue',
        speaker: '沈知意',
        referenceText: '可你们从头到尾，没有一个人问过——我还想不想踏进这个门。',
        riskTag: '主题句',
        mustKeep: true,
      },
    ],
  },
  {
    actId: 'act_09',
    title: '真够下贱的',
    scene: '顾家晚宴门口，沈知意已经转身，顾沉舟最后一次试图把她留住。',
    mustHappen: '沈知意留下最后一刀，转身离开，黑屏收尾。',
    bombPoint: '“你们顾家求人回去的方式，真够下贱的”太狠，演员可能想收。',
    requiredOutcome: '第一集以沈知意离开和顾家继续失控收尾。',
    targetLineCount: { min: 18, max: 22 },
    beats: [
      {
        beatId: 'act_09_b01',
        beatType: 'dialogue',
        speaker: '顾沉舟',
        referenceText: '那你说。只要你开口，我今天就把整个顾家掀了，也把你请回去。',
        innerCue: '他终于从命令变成乞求，但表达仍然像控制。',
        riskTag: '男主最后挽回',
        mustKeep: true,
      },
      {
        beatId: 'act_09_b02',
        beatType: 'shot',
        referenceText: '沈知意冷笑一声，停在门口，没有回头。',
        riskTag: '最后一刀前停顿',
        mustKeep: true,
      },
      {
        beatId: 'act_09_b03',
        beatType: 'dialogue',
        speaker: '沈知意',
        referenceText: '顾总。你们顾家求人回去的方式，真够下贱的。',
        actionCue: '沈知意停在门口，声音不高，却把顾家的求人方式钉在原地。',
        riskTag: '终场狠台词',
        mustKeep: true,
      },
      {
        beatId: 'act_09_b04',
        beatType: 'action',
        speaker: '沈知意',
        referenceText: '她转身就走。',
        actionCue: '镜头跟住沈知意离开的背影，顾家的人留在原地，没有人再拦得住她。',
        riskTag: '女主夺回行动权',
        mustKeep: true,
      },
      {
        beatId: 'act_09_b05',
        beatType: 'dialogue',
        speaker: '顾沉舟',
        referenceText: '沈知意！你今天不回顾家，明天他们也会来请你！',
        riskTag: '男主控制余波',
        mustKeep: true,
      },
      {
        beatId: 'act_09_b06',
        beatType: 'dialogue',
        speaker: '沈知意',
        referenceText: '那就让他们排队。',
        riskTag: '爽感收尾',
        mustKeep: true,
      },
      {
        beatId: 'act_09_b07',
        beatType: 'shot',
        referenceText: '顾家人留在灯火里，体面终于彻底碎在地上。',
        innerCue: '第一集不是爱情和解，而是顾家秩序第一次被她公开拒绝。',
        riskTag: '顾家崩塌画面',
        mustKeep: true,
      },
      {
        beatId: 'act_09_b08',
        beatType: 'turning_point',
        referenceText: '黑屏。',
        actionCue: '结尾要像短剧第一集钩子，留下顾家明天还会继续发疯的余波。',
        riskTag: '第一集钩子',
        mustKeep: true,
      },
    ],
  },
];

const shootingBeatDetails: Record<string, Partial<ScriptSkeletonAct['beats'][number]>> = {
  act_01_b01: {
    setPressure: '酒店外廊只借到两个小时，群演站位像公司年会，摄影一直让大家别看镜头。',
    defaultSetReaction:
      '群演把“豪门亲戚”站成了迎宾队，<actor role="沈知意">沈知意演员</actor>进场时先被反光板晃了一下，差点以为自己要走红毯。<actor role="顾家长辈">顾家长辈演员</actor>压低声音问老赵：“我现在是瞪她，还是像欠她钱？”',
    actorRewriteTargets: [
      { roleName: '沈知意', focus: '如果是小满，进门会先扫镜头位置确认没有偷拍角度；如果是娜娜，进门像走红毯选秀。把被围观的尴尬演成被临时拉进豪门审判局的不适。' },
      { roleName: '顾家长辈', focus: '如果是曼丽，会先点评群演站位像社区调解现场；如果是郭港，沉默站着反而比开口更像豪门。把低成本群演装豪门的别扭感带出来。' },
    ],
    mustPreserve: '沈知意进入顾家晚宴外廊，并立刻感到自己被围观审判。',
  },
  act_01_b02: {
    setPressure: '第一句羞辱台词必须压住场，但群演离收音太近，所有人都听得见笑场前的吸气。',
    defaultSetReaction:
      '<actor role="顾家长辈">顾家长辈演员</actor>第一次说“外人”时说得太像物业调解，自己也觉得不像豪门。旁边一个群演跟着点头点早了，像在参加业委会投票。',
    actorRewriteTargets: [{ roleName: '顾家长辈', focus: '如果是曼丽，会把羞辱说成对客人诊断式的点评；如果是郭港，低沉少话反而让"外人"两个字像保安盘查。把羞辱台词演成一种不太高级但很用力的体面。' }],
    mustPreserve: '顾家长辈公开羞辱沈知意，把她定义成外人。',
  },
  act_01_b03: {
    setPressure: '女主第一句反击要立住，不能像吵架短视频，也不能太正剧。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>听见“外人”后下意识想用现实逻辑反驳，但剧本要求她又美又冷。她停了半拍，像在心里确认：这帮人真的是在一条走廊上审我吗？',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '如果是小满，会用偶像舞台上练出的冷笑控场；如果是娜娜，反击会更冲更直像快手评论区开怼。把清醒反击演成”知道荒唐但不陪他们疯”。' }],
    mustPreserve: '沈知意不示弱，正面回击顾家羞辱。',
  },
  act_01_b04a: {
    setPressure: '男主必须第一次出场就有霸总压迫感，但场地太窄，走两步就会踩到地贴。',
    defaultSetReaction:
      '<actor role=”顾沉舟”>顾沉舟演员</actor>从人群里走出来时被地上的胶带绊了一下，立刻把这一下绷成”危险停顿”。老赵在监视器后面小声说：”别管，像顾总在压怒火。”',
    actorRewriteTargets: [{ roleName: '顾沉舟', focus: '如果是嘉豪，绊脚后会立刻用身体表演把失误转成撩人的慢动作；如果是邱鹏，绊脚后会硬撑体面但越撑越像真的跌了。把现实里的不顺脚转化成角色的压迫感或尴尬。' }],
    mustPreserve: '顾沉舟出场。',
  },
  act_01_b04b: {
    mustPreserve: '顾沉舟强势要求沈知意跟他进去。',
  },
  act_01_b05: {
    setPressure: '“三年前就不是顾家的人”是女主切身份的关键句，不能被演成普通斗嘴。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>说到“三年前”时看了一眼顾沉舟演员，像在确认对方到底有没有听懂这句不是撒娇。顾沉舟演员本能想接近一步，结果被摄影提醒别出画。',
    actorRewriteTargets: [
      { roleName: '沈知意', focus: '如果是小满，划线会像发声明一样精准克制；如果是娜娜，划线会更直白像甩人。把身份切割演成冷静划线，不是吃醋。' },
      { roleName: '顾沉舟', focus: '如果是嘉豪，会把”前妻”误读成”还有机会约”的暧昧暗示；如果是邱鹏，会把”不归顾家”听成自己也快不归哪里了。让男主演员对台词产生自己的误读。' },
    ],
    mustPreserve: '沈知意明确切断自己和顾家的身份关系。',
  },
  act_01_b06: {
    setPressure: '温雅第一句要像体面现任，但台词本身又很拱火。',
    defaultSetReaction:
      '<actor role="温雅">温雅演员</actor>原本准备端着说完，结果“才算”两个字太像门口保安查资格，她自己听完都微微停顿。群演误以为停顿是给反应，立刻齐刷刷看向沈知意。',
    actorRewriteTargets: [{ roleName: '温雅', focus: '如果是小满，会用表情管理把挑衅裹在得体里但眼神泄露不安；如果是娜娜，挑衅会直接外放像直播间连麦battle；如果是曼丽，会边说边自己诊断这句话哪里不对。把体面挑衅和尴尬缝在一起。' }],
    mustPreserve: '温雅宣示自己能站在顾家位置上，挑衅沈知意。',
  },
  act_01_b07: {
    setPressure: '短句打脸需要精准停顿，过了就像段子，轻了又没爽感。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>说“你站得挺稳的”时真的看了一眼温雅的鞋，现场一瞬间以为她要评价造型。<actor role="温雅">温雅演员</actor>被这个眼神带到，僵笑比剧本要求更真。',
    actorRewriteTargets: [
      { roleName: '沈知意', focus: '如果是小满，打脸会像舞台上一个精准的微表情反击；如果是娜娜，打脸会更像快手评论区式直球怼人。把短句打脸演成不经意但扎人。' },
      { roleName: '温雅', focus: '如果是小满，僵笑会像偶像在台上被cue到不想回答的问题；如果是娜娜，会直接绷不住脸色变；如果是曼丽，会下意识想分析对方为什么这样看她。把被看穿位置焦虑的僵硬反应演出来。' },
    ],
    mustPreserve: '沈知意用短句打回温雅。',
  },
  act_01_b08c: {
    setPressure: '这一拍要把”带进去”推到下一幕，但不能真的拖拽过猛，群演也快站不住了。',
    defaultSetReaction:
      '<actor role=”顾沉舟”>顾沉舟演员</actor>说”由不得你”时本能往前压，<actor role=”沈知意”>沈知意演员</actor>下意识退半步，刚好撞到走廊花柱。老赵没喊停，因为这一下比剧本还像低成本豪门里的困兽。',
    actorRewriteTargets: [
      { roleName: '顾沉舟', focus: '如果是嘉豪，越界会像夜场里逼近VIP包厢的姿态——身体侵略性强但带着服务式微笑；如果是邱鹏，越界会像走投无路的人最后一次赌。把霸总越界演成控制欲，不要变成单纯粗鲁。' },
      { roleName: '沈知意', focus: '如果是小满，退半步会像偶像避开私生的本能动作——镜头敏感但不示弱；如果是娜娜，退半步后会立刻摆出能反击的架势。把退半步处理成被冒犯后的防御，而不是害怕。' },
    ],
    mustPreserve: '顾沉舟越过沟通边界，强行把沈知意推向下一幕冲突。',
  },

  act_02_b01: {
    setPressure: '第二幕开机时场地已经开始催时间，上一幕的走位还没完全顺。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>说“三年前你让我滚”时忽然把戏里的旧账说得像现实里真被人赶过。<actor role="顾沉舟">顾沉舟演员</actor>没立刻接上，像被这句怼醒：原来这不是普通霸总撒疯。',
    actorRewriteTargets: [
      { roleName: '沈知意', focus: '如果是小满，"三年前你让我滚"会像她真的被退团的记忆闪回；如果是娜娜，会说得像质问前男友——土但情绪是真的。让旧伤台词从爽剧语气里长出一点真实刺痛。' },
      { roleName: '顾沉舟', focus: '如果是嘉豪，被怼后会愣住像夜场里第一次被客人真骂——不知道怎么接不是奉承的话；如果是邱鹏，会被"你让我滚"扎到现实痛点短暂失神。让男主演员短暂意识到角色逻辑荒唐。' },
    ],
    mustPreserve: '沈知意把顾沉舟现在的挽回和三年前的驱逐放在一起。',
  },
  act_02_b02: {
    setPressure: '抓手腕要拍出越线，但现场要求借力，不能真的拽疼。',
    defaultSetReaction:
      '<actor role="顾沉舟">顾沉舟演员</actor>第一次伸手太礼貌，像扶人过马路。老赵在旁边急了：“不是文明城市宣传片，是顾总失控。”第二次他用力又怕过界，手悬在半空尴尬了半秒。',
    actorRewriteTargets: [{ roleName: '顾沉舟', focus: '如果是嘉豪，伸手会像夜场拉人入座的职业手势——丝滑但目的感太强；如果是邱鹏，伸手会犹豫得像借钱时的手。根据演员现实身份把礼貌、过猛或职业惯性变成现场小事故。' }],
    mustPreserve: '顾沉舟主动抓住沈知意手腕，动作越过正常边界。',
  },
  act_02_b03: {
    setPressure: '女主必须明确抗拒，不能被拍成偶像剧心动。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>喊“你干什么”时先看了一眼顾沉舟的手，像在确认真抓还是借位。这个确认被镜头吃进去，反而让抗拒多了一点真实的慌。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '如果是小满，被抓手腕会触发偶像时期被私生拉扯的应激——反应会更快更本能；如果是娜娜，会直接大声质问像直播间里怼骚扰者。让真实防御变成角色被冒犯的反应。' }],
    mustPreserve: '沈知意第一反应是抗拒和被冒犯。',
  },
  act_02_b04: {
    setPressure: '强吻是第一集爆点，但现场没有亲密指导，只有老赵拿着一张皱掉的分镜纸。',
    defaultSetReaction:
      '<actor role="顾沉舟">顾沉舟演员</actor>和<actor role="沈知意">沈知意演员</actor>同时确认“是真亲还是借位”，两个人都说得很小声，结果收音刚好收到。群演憋笑憋到肩膀抖，老赵硬着头皮说：“借位，借位也要有顾总不要脸的气势。”',
    actorRewriteTargets: [
      { roleName: '顾沉舟', focus: '如果是嘉豪，会把强吻演成夜场式的贴脸暧昧——身体靠近丝滑到像谄媚富婆，霸气全变成性感服务感；如果是邱鹏，会紧张到像第一次约会的男生——手不知道放哪，嘴也不知道该不该凑。决定男演员怎么把强吻带偏。' },
      { roleName: '沈知意', focus: '如果是小满，会在借位确认时暗中计算哪个角度最不容易被截图传播；如果是娜娜，会先跟摄影确认自己好不好看再讨论亲不亲。决定女演员怎么守住”被强吻但不能输”。' },
    ],
    mustPreserve: '顾沉舟当众制造亲密越界爆点，沈知意被冒犯。',
  },
  act_02_b05b: {
    setPressure: '巴掌要借位，声效后期补，但群演已经准备看真打。',
    defaultSetReaction:
      '<actor role=”沈知意”>沈知意演员</actor>抬手前下意识说了句”我借位啊”，声音小到像咬牙。<actor role=”顾沉舟”>顾沉舟演员</actor>提前闭眼，巴掌还没到，脸已经开始演疼。',
    actorRewriteTargets: [
      { roleName: '沈知意', focus: '如果是小满，会把"我借位啊"说得像偶像舞台上确认走位——专业但压着火；如果是娜娜，会大声说"我借位啊"像在直播间宣布规则。把动作安全确认藏进角色的怒气里。' },
      { roleName: '顾沉舟', focus: '如果是嘉豪，提前闭眼会像夜场挨打练出的本能——姿态还在线；如果是邱鹏，提前闭眼加缩脖子像真怕疼。让男主演员对被打的预判制造喜剧感。' },
    ],
    mustPreserve: '沈知意反击顾沉舟的越界行为。',
  },
  act_02_b06: {
    setPressure: '“有病吧”要像角色判断，不是演员吐槽剧本。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>这句说得太顺，顺到现场所有人都短暂分不清她是在骂顾沉舟，还是在替大家骂这场戏。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '如果是小满，吐槽会像退团后第一次公开发言——克制但字字扎心；如果是娜娜，吐槽会像快手评论区置顶热评——直、狠、带节奏。让吐槽贴着剧情走但带出现场共振。' }],
    mustPreserve: '沈知意明确否定顾沉舟的越界行为。',
  },
  act_02_b07: {
    setPressure: '男主疯批深情台词很容易像自我感动，必须撑住不笑。',
    defaultSetReaction:
      '<actor role="顾沉舟">顾沉舟演员</actor>说“我就没正常过”时停顿太久，像真的在复盘自己这段戏合不合理。温雅演员在旁边听得脸色复杂，像已经准备报警又想起自己也有强吻戏。',
    actorRewriteTargets: [{ roleName: '顾沉舟', focus: '如果是嘉豪，疯批深情会像夜场里对着金主说"姐姐我是真的"——他自己可能都分不清是营业还是真心；如果是邱鹏，"我就没正常过"会和他现实失业状态重叠到让人心酸。让演员的理解方式制造喜剧或意外心酸。' }],
    mustPreserve: '顾沉舟把自己的失控包装成深情。',
  },
  act_02_b08: {
    setPressure: '温雅必须被点燃，但她还没正式爆，镜头只给表情。',
    defaultSetReaction:
      '<actor role="温雅">温雅演员</actor>听见顾沉舟说没正常过，表情先是“你们男的真麻烦”，又立刻想起自己下一幕要更麻烦。这个犹豫被镜头拍到，像温雅体面裂开前的一道缝。',
    actorRewriteTargets: [{ roleName: '温雅', focus: '如果是小满，旁观时表情管理会一层层裂开——像偶像在台上看到对家拿了自己的位置；如果是娜娜，会忍不住小声嘀咕像直播间里的实时反应；如果是曼丽，会开始给顾沉舟做情感诊断式的分析。把旁观刺激演成”我也知道离谱但必须输不起”。' }],
    mustPreserve: '温雅被顾沉舟对沈知意的失控刺激，埋下下一幕爆发。',
  },

  act_03_b01: {
    setPressure: '现场所有人还在消化强吻，第三幕要立刻接一句清醒反击。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>说“别拉着我”时没有往偶像剧方向接，而是像真的想退出这个荒唐群聊。老赵听完点头：“对，就是这种不想加班的清醒。”',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '如果是小满，拒绝会像切割公关声明——"我和这个人没有关系"；如果是娜娜，拒绝会更冲——"别拉着我"像拒绝不靠谱的直播公会签约。把拒绝深情绑架演成清醒撤离。' }],
    mustPreserve: '沈知意拒绝把顾沉舟的失控理解成爱情。',
  },
  act_03_b02: {
    setPressure: '“这一口，是你欠顾家的”非常难说，稍微不对就像反派自曝。',
    defaultSetReaction:
      '<actor role="顾沉舟">顾沉舟演员</actor>念到“欠顾家”时明显卡了一下，像正常人终于被台词绊倒。老赵在监视器后面用气声提醒：“别理解，先说。”',
    actorRewriteTargets: [{ roleName: '顾沉舟', focus: '如果是嘉豪，"欠顾家"说出来像夜场里催最低消费——理直气壮但根基荒唐；如果是邱鹏，会被"欠"字卡住因为他现实里也在被催债。让演员对债务式深情的困惑滑进角色的控制欲。' }],
    mustPreserve: '顾沉舟把刚才的越界说成沈知意欠顾家的东西。',
  },
  act_03_b03: {
    setPressure: '这句之后必须有全场空白，空白越长越像事故。',
    defaultSetReaction:
      '群演没人知道该震惊还是该嫌弃，有人吸了一口气，像听到亲戚饭桌上最糟糕的发言。<actor role="顾家长辈">顾家长辈演员</actor>慢半拍才想起自己应该维护顾家，表情已经先背叛了。',
    actorRewriteTargets: [{ roleName: '顾家长辈', focus: '如果是曼丽，会忍不住用老板娘的口气点评"这男的不行"然后硬拉回角色；如果是郭港，沉默的表情本身就像在替顾家判死刑。让长辈演员被台词雷到但还要装作顾家能圆。' }],
    mustPreserve: '全场因顾沉舟的冒犯逻辑陷入死寂。',
  },
  act_03_b04: {
    setPressure: '女主怒极反笑不能太文艺，要像真的被荒唐气笑。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>笑出来那一下不是美强惨，是“你们真的敢这么写”的荒唐。摄影没切，反而让这笑变成沈知意看穿顾家的证据。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '如果是小满，笑会像偶像在发布会上听到荒唐问题时的冷笑——职业但致命；如果是娜娜，笑会更外放像刷到离谱视频时的"哈？"。把演员被台词雷到的笑转化为角色怒极反笑。' }],
    mustPreserve: '沈知意确认顾家仍然把她当债务。',
  },
  act_03_b05: {
    setPressure: '“有脸”两个字要打中顾家，但不能演成普通骂街。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>把“有脸”咬得很准，准到群演里有人差点鼓掌。老赵赶紧压手势：这不是庭审现场，是豪门晚宴。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '如果是小满，反击会像精准拟好的公关回应——一个字都不多但字字见血；如果是娜娜，反击会更像直播翻车后硬刚——爽但土到冒烟。让反击有短剧爽感，保留差点拍成审判大会的滑稽。' }],
    mustPreserve: '沈知意正面反击顾家的债务逻辑。',
  },
  act_03_b06: {
    setPressure: '男主想给名分，但台词听起来像宣布所有权。',
    defaultSetReaction:
      '<actor role="顾沉舟">顾沉舟演员</actor>说“顾家认的人”时自己先皱了下眉，像突然发现角色把恋爱谈成了户口本。这个皱眉被老赵保留，因为像顾总在和自己较劲。',
    actorRewriteTargets: [{ roleName: '顾沉舟', focus: '如果是嘉豪，说"顾家认的人"时会不自觉带出夜场里"姐这桌我罩的"的口气——霸总味和商务味混在一起；如果是邱鹏，会停在"认"字上像自己也没被谁认过。把停顿变成角色控制欲裂缝。' }],
    mustPreserve: '顾沉舟公开把沈知意和顾家绑定。',
  },
  act_03_b07: {
    setPressure: '长辈的“疯了”既是剧中反应，也是现场观感。',
    defaultSetReaction:
      '<actor role="顾家长辈">顾家长辈演员</actor>这句说得太真，像终于替所有群演发言。老赵没喊停，因为顾家自己都觉得顾家疯了，反而更像第一集钩子。',
    actorRewriteTargets: [{ roleName: '顾家长辈', focus: '如果是曼丽，吐槽会像美甲店老板娘终于忍不住对客人说"你这个男的不行赶紧分"；如果是郭港，一句"疯了"会低沉到像保安在汇报安全事故。把正常人吐槽和顾家长辈失控缝在一起。' }],
    mustPreserve: '顾家内部也被顾沉舟的公开失控震到。',
  },
  act_03_b08: {
    setPressure: '温雅只用三个字接住下一幕，必须像被当众戳到命门。',
    defaultSetReaction:
      '<actor role="温雅">温雅演员</actor>说“只有她”时先看向顾沉舟，再看向沈知意，像在等别人告诉她这场戏到底谁才是现任。没人接，她只能自己把体面咽回去。',
    actorRewriteTargets: [{ roleName: '温雅', focus: '如果是小满，被悬空时会像失去center位的偶像——面上稳但手在抖；如果是娜娜，被比较后会开始抢镜头像直播间被挤出画面的主播；如果是曼丽，会开始分析"我在这段关系里到底算什么"。把被悬空演成下一幕主动失控的起点。' }],
    mustPreserve: '温雅被顾沉舟对沈知意的偏向点燃。',
  },

  act_04_b01: {
    setPressure: '抓领带动作要准，领带是临时借的，不能扯坏。',
    defaultSetReaction:
      '<actor role="温雅">温雅演员</actor>第一次抓领带时抓到了领夹，顾沉舟演员疼得表情真空了一秒。老赵立刻说：“很好，这就是顾总欠她的。”',
    actorRewriteTargets: [
      { roleName: '温雅', focus: '如果是小满，抓领带会像偶像排练里精准但用力过猛的走位；如果是娜娜，直接上手像快手拍段子不管道具会不会坏；如果是曼丽，抓之前会犹豫一下像还在判断这个男的值不值得她出手。把动作失误转化成抢回位置的急切。' },
      { roleName: '顾沉舟', focus: '如果是嘉豪，被抓领夹会疼得表情管理都散了——夜场营业微笑第一次崩盘；如果是邱鹏，疼到像终于找到一个理由可以不演了。让真实疼痛成为角色被打断控制的反应。' },
    ],
    mustPreserve: '温雅主动拉近顾沉舟，准备反击沈知意。',
  },
  act_04_b02: {
    setPressure: '第二个亲密动作比第一个更尴尬，现场已经没人敢大声讨论借位。',
    defaultSetReaction:
      '<actor role="温雅">温雅演员</actor>和<actor role="顾沉舟">顾沉舟演员</actor>同时偏头，借位借成了互相找镜头。沈知意演员站在旁边看着，表情像第一次现场围观短剧工业事故。',
    actorRewriteTargets: [
      { roleName: '温雅', focus: '如果是小满，借位会像偶像舞台上找镜头角度——技术到位但完全不像热恋；如果是娜娜，会冲上去像拍短视频名场面不管尴不尴尬；如果是曼丽，可能会在贴脸前突然停下来分析”这个动机对不对”。让抢回”吻”的动作带着荒唐胜负欲。' },
      { roleName: '顾沉舟', focus: '如果是嘉豪，第二次被亲近会开始混乱——夜场职业本能让他条件反射配合，然后意识到不对；如果是邱鹏，会完全懵住像社恐遇到双重社死。让男主在两场亲密戏之间越来越失控。' },
    ],
    mustPreserve: '温雅用同样越界的方式刺激顾沉舟和沈知意。',
  },
  act_04_b03: {
    setPressure: '女主吐槽要帮观众泄压，但不能变成破坏第四面墙。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>这句说得像真心提问，现场有人差点接“不是”。老赵瞪了一圈，大家才想起这还是顾家晚宴，不是剧本围读。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '如果是小满，冷讽会像偶像在综艺上说出制片人不想听的话——优雅但致命；如果是娜娜，会说得像弹幕本人下场——"你们这帮人有毛病吧"的劲。把观众会吐槽的话留在角色逻辑里。' }],
    mustPreserve: '沈知意用冷讽拆穿顾家的荒唐。',
  },
  act_04_b04a: {
    setPressure: '推开动作要安全，但情绪要像顾沉舟终于失控。',
    defaultSetReaction:
      '<actor role=”顾沉舟”>顾沉舟演员</actor>推开温雅时轻得像递文件，温雅演员差点没反应。老赵只好补一句：”你们这是修罗场，不是交接班。”',
    actorRewriteTargets: [
      { roleName: '顾沉舟', focus: '如果是嘉豪，推人会像夜场劝架——手法专业但怎么看都像在送客；如果是邱鹏，推开动作会很轻像怕得罪任何一边。让推开动作在安全和失控之间摇摆。' },
      { roleName: '温雅', focus: '如果是小满，被推开后会用偶像式表情管理硬撑一秒再崩；如果是娜娜，被推开后会直接变脸像被插队的怒气；如果是曼丽，会开始给顾沉舟下诊断书。让被推开的羞辱感来自现场真实落差。' },
    ],
    mustPreserve: '顾沉舟推开温雅。',
  },
  act_04_b04b: {
    mustPreserve: '顾沉舟把温雅推到对立面。',
  },
  act_04_b05: {
    setPressure: '温雅终于撕开体面，台词长且情绪满，容易演成吵架。',
    defaultSetReaction:
      '<actor role="温雅">温雅演员</actor>越说越像真的在质问这段关系为什么轮不到她，台词里的狗血突然有了生活感。群演本来准备看热闹，结果被她说得安静了。',
    actorRewriteTargets: [{ roleName: '温雅', focus: '如果是小满，质问会像被公司冷藏后质问经纪人——体面碎裂但仍然有腔调；如果是娜娜，质问会更像直播间被人说"你不配"后的反击——猛但不讲逻辑；如果是曼丽，质问会像给闺蜜分析完之后发现自己也是那个倒霉蛋。让女二从工具人吃醋变成一个知道自己位置尴尬的人。' }],
    mustPreserve: '温雅公开质问顾沉舟，让自己的羞辱摊开。',
  },
  act_04_b06: {
    setPressure: '“你不能拿她赢我”抽象但抓马，是短剧味的关键。',
    defaultSetReaction:
      '<actor role="温雅">温雅演员</actor>说完这句后自己也停了一秒，像在确认“赢我”到底是什么比赛。老赵在监视器后面轻轻鼓掌：对，就是这种不知道在争什么但必须争的劲。',
    actorRewriteTargets: [{ roleName: '温雅', focus: '如果是小满，"赢我"会说得像在比人气排名——她太懂这种输赢了；如果是娜娜，会把"赢"理解成谁更红谁更有流量——非常直白；如果是曼丽，会一边说一边自己拆解这句话哪里不对。把台词的抽象感演成短剧人物真信这套输赢。' }],
    mustPreserve: '温雅把感情问题说成位置输赢。',
  },
  act_04_b07: {
    setPressure: '这句要把温雅的地位焦虑顶出来，不能只是尖叫。',
    defaultSetReaction:
      '<actor role="温雅">温雅演员</actor>说“今晚站在这里的人就是我”时真的往灯光中心挪了一步，像怕再不挪就没位置。这个多出来的一步把群演队形挤歪了。',
    actorRewriteTargets: [{ roleName: '温雅', focus: '如果是小满，挪步会像舞台上抢C位一样精准——一步到位找灯光；如果是娜娜，直接往中间挤像直播间抢最佳机位；如果是曼丽，会犹豫要不要站过去然后决定"不能输"。让抢位置从台词变成身体动作。' }],
    mustPreserve: '温雅暴露自己害怕失去顾家席位。',
  },
  act_04_b08: {
    setPressure: '女主必须拒绝雌竞逻辑，不能加入抢男人。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>说“你站啊”时语气太平，像真的愿意让出灯位。温雅演员反而更接不住，因为这不是她准备好的吵架节奏。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '如果是小满，”你站啊”会像偶像让出center后的冷笑——我不稀罕但你站着也不像；如果是娜娜，会说得特别直像”行你上你NB”的劲。把”不抢”演成更锋利的拒绝。' }],
    mustPreserve: '沈知意拒绝和温雅争顾家位置。',
  },
  act_04_b09: {
    setPressure: '男主控场必须失败，否则后面顾家集体发病起不来。',
    defaultSetReaction:
      '<actor role="顾沉舟">顾沉舟演员</actor>喊“闭嘴”时声音压得很低，结果被现场空调声盖了一点。大家没立刻闭，反而更像顾总已经管不住这个组。',
    actorRewriteTargets: [{ roleName: '顾沉舟', focus: '如果是嘉豪，"闭嘴"会像夜场控场失败——声音压不住因为他习惯哄不习惯吼；如果是邱鹏，喊出来会带着真的疲惫像管不住的失业焦虑溢出来。让控场失败同时发生在剧情和片场。' }],
    mustPreserve: '顾沉舟试图控场，但顾家局面已经压不住。',
  },

  act_05_b01: {
    setPressure: '长辈入场是从年轻修罗场切到顾家秩序，群演要重新站位。',
    defaultSetReaction:
      '<actor role="顾家长辈">顾家长辈演员</actor>等了四幕终于入场，一开口先找机位，像真以为自己是来主持家族会议。老赵让群演往后退，结果大家退得像婚礼让主桌。',
    actorRewriteTargets: [{ roleName: '顾家长辈', focus: '如果是曼丽，入场会像美甲店老板娘来处理客诉——气场有但豪门感全靠自信；如果是郭港，沉默入场自带写字楼夜班保安的压迫感——不说话比说话更像大佬。把长辈入场演成低成本顾家权力登场。' }],
    mustPreserve: '顾家长辈接管局面，把私人修罗场升级成家族秩序。',
  },
  act_05_b02: {
    setPressure: '“谁能留下谁就是顾家女主人”封建又土，必须土得理直气壮。',
    defaultSetReaction:
      '<actor role="顾家长辈">顾家长辈演员</actor>说完“女主人”后自己先看了一眼沈知意和温雅，像在等她们报名。两个女演员都没有立刻接，因为正常人听到这句都会先怀疑自己是不是走错年代。',
    actorRewriteTargets: [
      { roleName: '顾家长辈', focus: '如果是曼丽，”女主人”说出来像在美甲店给客人安排最贵的款——真心觉得这是好东西；如果是郭港，沉稳地说出荒唐规则反而更可怕像物业通知不可抗拒。把荒唐规则说成他真心觉得公平的安排。' },
      { roleName: '沈知意', focus: '如果是小满，对”被选”的反感会像偶像被选秀节目当棋子——太懂这种被安排的感觉；如果是娜娜，反感会更直接像”凭什么你们替我决定”。让女主对”被选”的反感自然出现。' },
      { roleName: '温雅', focus: '让女二既被冒犯又忍不住想赢。' },
    ],
    mustPreserve: '顾家长辈公开提出顾家女主人位置，把两位女性放上秤。',
  },
  act_05_b03: {
    setPressure: '温雅听见“女主人”要立刻被拱火，但不能抢台词。',
    defaultSetReaction:
      '<actor role="温雅">温雅演员</actor>呼吸急了一下，像听到一个很冒犯但又很想要的奖项。她想往前一步，又看见沈知意没动，只好把脚尖收回去。',
    actorRewriteTargets: [{ roleName: '温雅', focus: '如果是小满，会像偶像听到出道名额时的复杂——知道规则恶心但还是想要；如果是娜娜，会更直接地往前凑像抢直播间福利；如果是曼丽，会犹豫然后忍不住自我分析”我怎么也开始争了”。让”想赢”和”知道羞耻”同时存在。' }],
    mustPreserve: '温雅被“女主人”这个位置刺激。',
  },
  act_05_b04: {
    setPressure: '沈知意必须拆规则，而不是参加比赛。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>说“连人都要这么选”时扫了一圈群演，像在问全场有没有人觉得这正常。群演被她一扫，突然都不敢继续装豪门。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '如果是小满，识破会像偶像看穿选秀内定的冷静——"你们这套我见过"；如果是娜娜，会说得更炸更像短视频评论区锐评——"这不就是PUA吗"。把识破演成对整个顾家场景的反问。' }],
    mustPreserve: '沈知意识破顾家把人当位置来选。',
  },
  act_05_b05: {
    setPressure: '长辈必须把封建话说得像公司 KPI。',
    defaultSetReaction:
      '<actor role="顾家长辈">顾家长辈演员</actor>把“撑住体面”说得像在讲月度指标，群演一边点头一边更像员工大会。豪门感没上去，顾家机器感倒是有了。',
    actorRewriteTargets: [{ roleName: '顾家长辈', focus: '如果是曼丽，"撑住体面"会说得像美甲店的月度目标会议——认真但场景不对；如果是郭港，会用保安式简短命令说出来——"规矩就这样"。让长辈的荒唐逻辑带一点现实管理话术。' }],
    mustPreserve: '顾家长辈把女性位置和家族体面绑定。',
  },
  act_05_b06: {
    setPressure: '顾沉舟要阻止长辈，但不能真正跳出顾家逻辑。',
    defaultSetReaction:
      '<actor role="顾沉舟">顾沉舟演员</actor>说“够了”时像终于想起自己是男主，但下一句又不知道该站哪边。这个犹豫正好暴露：他护人也护得不干净。',
    actorRewriteTargets: [{ roleName: '顾沉舟', focus: '如果是嘉豪，"够了"会像夜场里挡在金主和别人之间——保护姿态但底色是"这个人是我的客户"；如果是邱鹏，会说得像终于鼓起勇气反驳一个权威但声音还在抖。让男主的保护和默认占有互相打架。' }],
    mustPreserve: '顾沉舟试图阻止长辈，但仍没真正否定顾家逻辑。',
  },
  act_05_b07: {
    setPressure: '女主要剖男主核心，台词锋利但不能太讲道理。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>这句没有吼，反而像在替顾沉舟补完他自己不敢说的话。顾沉舟演员被她看着，明显少了一点霸总气，多了一点心虚。',
    actorRewriteTargets: [
      { roleName: '沈知意', focus: '如果是小满，揭穿会像偶像在直播里不经意说出行业真相——冷静但一刀见骨；如果是娜娜，揭穿会更像吵架时突然说中要害——不讲究措辞但扎进去了。把剖核心演成不动声色的揭穿。' },
      { roleName: '顾沉舟', focus: '如果是嘉豪，被揭穿后会第一次露出夜场营业表情下面的空——他可能也不知道自己到底什么意思；如果是邱鹏，被揭穿后的失语会像被面试官问到"你到底会什么"。让男主被揭穿后短暂失语。' },
    ],
    mustPreserve: '沈知意指出顾沉舟的保护仍包着私心。',
  },
  act_05_b08: {
    setPressure: '周特助冲场要像低成本剧突然加大招，现场通道很窄。',
    defaultSetReaction:
      '<actor role="周特助">周特助演员</actor>从人群外冲进来时差点撞到灯架，硬是把绕路演成“忠心太急”。老赵在旁边低声说：“好，顾家的疯终于有腿了。”',
    actorRewriteTargets: [{ roleName: '周特助', focus: '如果是嘉豪，冲进来会像夜场气氛组救场——动作大但方向不明确，差点把灯架当舞台装置绕；如果是邱鹏，冲进来会带着真实的气喘——失业久了体力也跟着下降。结合演员本人状态把冲场演成忠心、慌乱或现实疲惫的混合。' }],
    mustPreserve: '周特助冲入现场，带出下一幕下跪求回顾家。',
  },

  act_06_b01: {
    setPressure: '下跪是总助名场面，地面很硬，护膝只有一副还找不到。',
    defaultSetReaction:
      '<actor role="周特助">周特助演员</actor>跪到一半先看地面，身体诚实地迟疑了。老赵没喊停，只让摄影推近，因为“一个成年人真的不想跪”比假忠心更有戏。',
    actorRewriteTargets: [{ roleName: '周特助', focus: '如果是嘉豪，下跪前会习惯性整理衣服像夜场工作素养——跪也要跪得帅；如果是邱鹏，跪下去的那一刻会和现实重叠——他可能真的在生活里低过头，这次更难装。把演员对下跪的现实抗拒转化成角色荒唐忠心的挣扎。' }],
    mustPreserve: '周特助以过度动作求沈知意回顾家。',
  },
  act_06_b02: {
    setPressure: '周特助台词像家庭伦理和公司汇报混在一起，容易过火。',
    defaultSetReaction:
      '<actor role="周特助">周特助演员</actor>喊“顾总别闹了”时像真在劝老板别在客户面前丢人。顾沉舟演员被他一喊，表情从霸总变成被员工公开提醒的尴尬。',
    actorRewriteTargets: [
      { roleName: '周特助', focus: '如果是嘉豪，劝老板会像夜场里劝喝多的客人——"哥消消气"的职业味太重；如果是邱鹏，会带着真实职场底层劝领导的卑微——他可能真的劝过。让助理忠心带出现实职场救火感。' },
      { roleName: '顾沉舟', focus: '如果是嘉豪，被助理公开提醒会像被服务员当面纠正——营业笑容裂开；如果是邱鹏，被拆台后会更像"算了我也管不了"的放弃感。让男主被自己助理拆台。' },
    ],
    mustPreserve: '周特助用顾家危机绑架沈知意。',
  },
  act_06_b03: {
    setPressure: '“少夫人”称呼必须让女主不适，不能变成甜宠。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>听见“少夫人”时眉头是真的皱了，像被一个早该注销的会员称呼重新绑定。周特助演员还跪着，抬头等她接，场面更尴尬。',
    actorRewriteTargets: [
      { roleName: '沈知意', focus: '如果是小满，听到"少夫人"的反感会像偶像被叫过时的艺名——那个身份已经和她无关了；如果是娜娜，会更直接地翻白眼像被喊错名字的不耐烦。把称呼反感演成被旧秩序强行贴标签。' },
      { roleName: '周特助', focus: '如果是嘉豪，跪着叫"少夫人"会带着夜场式的恭敬——姿态太到位反而更荒唐；如果是邱鹏，跪着坚持的画面会更心酸——他是真的在低处习惯了。让助理跪着坚持叫错身份的荒唐感更强。' },
    ],
    mustPreserve: '沈知意反感“少夫人”称呼。',
  },
  act_06_b04: {
    setPressure: '“顾家不能没有您”要忠心到离谱，但不能像年会朗诵。',
    defaultSetReaction:
      '<actor role="周特助">周特助演员</actor>这句说得太郑重，像顾家离开沈知意就断电断网。群演里有人低头看手机，像突然想确认顾家是不是真的快倒闭。',
    actorRewriteTargets: [{ roleName: '周特助', focus: '如果是嘉豪，忠心会像夜场里对金主表忠心——"姐您说什么都对"的味道，荒唐但他是真诚的；如果是邱鹏，忠心会带着失业人对工作的珍惜——"这份活我不能丢"的底色。让过度忠心荒唐但真诚。' }],
    mustPreserve: '周特助继续把顾家命运压到沈知意身上。',
  },
  act_06_b05: {
    setPressure: '这句道德绑架太满，演员容易演成苦情短视频。',
    defaultSetReaction:
      '<actor role="周特助">周特助演员</actor>越说越像在替顾家写病危通知，连顾家长辈演员都被他说得坐直了。沈知意演员低头看他，像终于明白这家人把助理也逼疯了。',
    actorRewriteTargets: [
      { roleName: '周特助', focus: '如果是嘉豪，越说越像在替VIP客户做年度汇报——认真到荒唐；如果是邱鹏，越说越像在描述自己公司倒闭前的挣扎——苦情溢出来是因为有现实底色。把苦情用力和现实荒唐混在一起。' },
      { roleName: '沈知意', focus: '如果是小满，看周特助的眼神会像看到同行被压榨的同情——她懂被组织消耗的感觉；如果是娜娜，会更直接地心疼——"你们顾家把人都逼成什么样了"。让女主看清顾家秩序如何压迫每个人。' },
    ],
    mustPreserve: '周特助用顾家痛苦继续道德绑架沈知意。',
  },
  act_06_b06: {
    setPressure: '全场尴尬要被拍出来，不能只写“安静”。',
    defaultSetReaction:
      '群演不敢看跪着的人，也不敢看顾沉舟，最后集体看地毯。<actor role="温雅">温雅演员</actor>脸色越来越白，因为她忽然发现自己连被跪求的资格都没有。',
    actorRewriteTargets: [{ roleName: '温雅', focus: '如果是小满，发现自己不被跪求时的表情管理会最后一次崩盘——连装都装不住了；如果是娜娜，会直接红眼像被当面说"你不重要"；如果是曼丽，会开始算自己在这段关系里的沉没成本。让女二感到自己被排除在顾家真正秩序外。' }],
    mustPreserve: '周特助下跪让所有人尴尬，温雅被进一步刺激。',
  },
  act_06_b07: {
    setPressure: '女主内心看清顾家，但画面上不能停成说教。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>看着周特助跪在地上，没有立刻说话，只往后退了一点。这个退后像正常人躲开荒唐，也像沈知意终于退出顾家的剧本。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '如果是小满，退后的动作会像偶像退出组合——不声不响但决绝；如果是娜娜，退后会更大幅像物理上拉开距离——"你们别过来"。用身体距离表现她看清顾家而不是口头解释。' }],
    mustPreserve: '沈知意看清顾家秩序荒唐。',
  },
  act_06_b08: {
    setPressure: '周特助要把失控推向下一幕最尴尬台词，现场已经没人敢猜他还要说什么。',
    defaultSetReaction:
      '<actor role="周特助">周特助演员</actor>跪着调整了一下呼吸，像准备做最后汇报。老赵在监视器前把耳机摘了一半，又戴回去，因为他知道下一句更炸。',
    actorRewriteTargets: [{ roleName: '周特助', focus: '如果是嘉豪，停顿时会深呼吸像夜场上台前的准备——他知道下一句要卖命；如果是邱鹏，停顿会更长像真的在考虑人生——“我沦落到要说这种话了吗”。让演员在最尴尬台词前出现”我真的要说吗”的停顿。' }],
    mustPreserve: '周特助继续升级，为下一幕炸裂台词铺垫。',
  },

  act_07_b01: {
    setPressure: '最炸台词要说出口，现场收音、群演和演员本人都会先沉默。',
    defaultSetReaction:
      '<actor role="周特助">周特助演员</actor>看着这句台词沉默了两秒，像在判断自己说完还能不能做人。老赵只说：“说，竖屏会喜欢。”他说出口后，<actor role="顾沉舟">顾沉舟演员</actor>和<actor role="温雅">温雅演员</actor>同时露出一种“别把我也带上”的表情。',
    actorRewriteTargets: [
      { roleName: '周特助', focus: '如果是嘉豪，说"那些夜晚"时会不自觉带上夜场叙事的暧昧气息——他习惯了把所有"夜晚"都说得很旖旎；如果是邱鹏，说出来会像在念一份不忍直视的工作汇报——尴尬到想辞职。让演员对尴尬台词的抗拒自然演化成忠心失控。' },
      { roleName: '顾沉舟', focus: '如果是嘉豪，被公开总结亲密史时营业笑容会彻底碎裂——夜场里最怕被人公开说细节；如果是邱鹏，会红到耳根像社恐的人被点名发言。让男主被助理公开总结亲密史。' },
      { roleName: '温雅', focus: '让女二被放进荒唐比较表。' },
    ],
    mustPreserve: '周特助说出关于顾沉舟、沈知意和温雅的极尴尬忠心台词。',
  },
  act_07_b02: {
    setPressure: '这句之后的静默要像片场和剧中同时断电。',
    defaultSetReaction:
      '现场静得能听见灯架电流声。一个群演的手机震了一下，所有人都看过去，像终于有东西比周特助那句话正常。',
    actorRewriteTargets: [],
    mustPreserve: '全场因周特助台词陷入空白。',
  },
  act_07_b03: {
    setPressure: '顾沉舟必须意识到助理把他的失控写成了公文。',
    defaultSetReaction:
      '<actor role="顾沉舟">顾沉舟演员</actor>僵住那一下不是演的，他像第一次知道自己角色的亲密史还能被助理如此精确汇报。老赵没切，因为这份尴尬太值钱。',
    actorRewriteTargets: [{ roleName: '顾沉舟', focus: '如果是嘉豪，僵住是因为夜场黄金法则"绝不让客人看到你的真实反应"被打破了；如果是邱鹏，僵住是因为真的没想到台词里有这种东西——像面试时被问到简历里编的经历。让真实尴尬成为角色被拆穿的反应。' }],
    mustPreserve: '顾沉舟被周特助的忠心台词弄僵。',
  },
  act_07_b04: {
    setPressure: '温雅破防要有“我为什么也被统计”的荒唐。',
    defaultSetReaction:
      '<actor role="温雅">温雅演员</actor>质问周特助时差点喊成演员真名，又硬生生咬回角色名。这个咬回去的动作，像温雅把最后一点体面也咬住了。',
    actorRewriteTargets: [{ roleName: '温雅', focus: '如果是小满，破防会像偶像看到自己被做成对比图的那一刻——她经历过被公开比较；如果是娜娜，破防会更外放像直播间被人当面说"你不如那个谁"；如果是曼丽，会冷静一秒然后爆发——"你什么意思"。让女二破防来自被公开当作对照组。' }],
    mustPreserve: '温雅被周特助的说法公开羞辱。',
  },
  act_07_b05: {
    setPressure: '女主总结疯感是观众出口，必须短、准、冷。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>说“没一个正常人”时现场没人觉得她过分。连老赵都沉默了一下，像在承认这句台词骂到了片场。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '如果是小满，"没一个正常人"会说得像终于说出粉丝一直想让她说的话——克制的愤怒；如果是娜娜，会说得像短视频热评——直白、狠、带着替天行道的劲。让女主像替观众和片场同时下结论。' }],
    mustPreserve: '沈知意指出顾家集体不正常。',
  },
  act_07_b06: {
    setPressure: '周特助继续加码，必须让观众觉得顾家真的把责任往沈知意身上倒。',
    defaultSetReaction:
      '<actor role="周特助">周特助演员</actor>说“顾家今晚就散了”时语气像公司群里最后一个还在救项目的人。顾家长辈演员听完竟然点头，点得太真。',
    actorRewriteTargets: [{ roleName: '周特助', focus: '如果是嘉豪，道德绑架会说得像夜场里挽留大客户——"姐您走了我们这桌就散了"；如果是邱鹏，会说得像真的在恳求不要裁员——他理解被散伙的恐惧。把助理救火感和顾家道德绑架结合。' }],
    mustPreserve: '周特助继续把顾家散不散绑在沈知意身上。',
  },
  act_07_b07: {
    setPressure: '温雅必须承认“我算什么”，这句不能只是撒泼。',
    defaultSetReaction:
      '<actor role="温雅">温雅演员</actor>这句说出来后突然没那么用力，像她自己也想知道答案。短剧的狗血在这一秒变得有点扎人，但下一秒群演又因为跪着的人挪膝盖回到荒唐。',
    actorRewriteTargets: [{ roleName: '温雅', focus: '如果是小满，这句会让她想起自己在组合里的位置——站最边上的那个；如果是娜娜，会更像"我在这里到底算什么"——直播间里没人看的那种委屈；如果是曼丽，会一边哭一边自我分析——"我早就该看清的"。让女二破防里露出一点真实位置焦虑。' }],
    mustPreserve: '温雅公开质问自己的身份位置。',
  },
  act_07_b08: {
    setPressure: '周特助最后补刀温雅，必须像忠心也像职场误伤。',
    defaultSetReaction:
      '<actor role="周特助">周特助演员</actor>说“您不是顾家的人”时非常礼貌，礼貌到更伤人。温雅演员听完闭了下眼，像被一份盖章文件打在脸上。',
    actorRewriteTargets: [
      { roleName: '周特助', focus: '如果是嘉豪，礼貌会像夜场里跟不够级别的客人说"这个包厢已经有人预定了"——笑着但意思很明确；如果是邱鹏，礼貌会更卑微但同样残忍——他习惯了用低姿态传达坏消息。让助理用礼貌说出最残忍的顾家规则。' },
      { roleName: '温雅', focus: '如果是小满，被排除的反应会像被通知"你不在下一期"——她太熟悉这种被系统性淘汰的感觉；如果是娜娜，会更直接地崩——"你凭什么说我不是"；如果是曼丽，会短暂失语像突然发现自己也是受害者。让女二被排除出顾家秩序。' },
    ],
    mustPreserve: '周特助把温雅排除在顾家认可之外。',
  },

  act_08_b01: {
    setPressure: '女主开大前要安静，但现场刚经历最尴尬台词，大家都不敢呼吸。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>看着跪着的、站着的、脸白的几个人，是真的沉默了一会儿。这个沉默不是忘词，而像正常人终于决定不再替这场荒唐圆场。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '如果是小满，静默会像偶像在退团声明前的最后沉默——已经决定了但要让对方感受到重量；如果是娜娜，静默会更短因为她忍不住——但那几秒也够沉。把审判前静默演成”我看够了”。' }],
    mustPreserve: '沈知意从接招转为主动审判。',
  },
  act_08_b02: {
    setPressure: '长台词第一段要准确回收前文事故，演员容易像念清单。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>每数一件事，现场对应演员都轻微动一下，像被点名批评。周特助演员还跪着，听到“当众下跪”时甚至想调整姿势，又忍住了。',
    actorRewriteTargets: [
      { roleName: '沈知意', focus: '如果是小满，点名会像偶像在控评——每一条都精准回击不带多余情绪；如果是娜娜，点名会更像主播连麦审判——"你你你都别跑"。把总结前文演成逐个点名而不是念设定。' },
      { roleName: '周特助', focus: '如果是嘉豪，被点到"当众下跪"时会条件反射想站起来——夜场里最怕被当众揭短；如果是邱鹏，会更深地缩进跪姿里——他连被点名的力气都没了。让被点到的羞耻反应留在镜头里。' },
    ],
    mustPreserve: '沈知意逐个点出今晚发生的荒唐事。',
  },
  act_08_b03: {
    setPressure: '冷讽收束要像一刀，不要太喜剧。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>说“真够热闹”时看了一眼满场灯和花，像终于发现这个豪门布景只是在替一群成年人遮羞。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '如果是小满，"真够热闹"的语气会像退圈后看到旧团体撕逼的冷眼——过来人的通透；如果是娜娜，会说得更带劲像围观吃瓜后的总结陈词。把豪门热闹拆成荒唐热闹。' }],
    mustPreserve: '沈知意冷讽顾家今晚的集体失控。',
  },
  act_08_b04: {
    setPressure: '男主迟到补偿要足够大，但不能显得真的有用。',
    defaultSetReaction:
      '<actor role="顾沉舟">顾沉舟演员</actor>说“顾家的一切都是你的”时语气很认真，认真到像在推销一个没人想接手的烂摊子。沈知意演员没立刻接，反而让这句更空。',
    actorRewriteTargets: [
      { roleName: '顾沉舟', focus: '如果是嘉豪，"顾家的一切都是你的"说出来像夜场里开最贵的酒——他真心觉得这就是最大诚意了；如果是邱鹏，会说得像在描述一个自己也没有的东西——声音里有羡慕也有心虚。让男主真以为资源可以补偿一切。' },
      { roleName: '沈知意', focus: '如果是小满，无动于衷会像偶像拒绝不靠谱的经纪合同——她见过太多画饼了；如果是娜娜，会更直接地嗤之以鼻——"就这？"。让女主对补偿的无动于衷压住对方。' },
    ],
    mustPreserve: '顾沉舟用顾家资源挽回沈知意。',
  },
  act_08_b05: {
    setPressure: '女主拒绝施舍要爽，但不是炫富。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>说“缺这口饭吗”时语气像真的被一桌难吃饭菜冒犯了。群演里有人看了一眼道具餐，突然更理解这句。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '如果是小满，拒绝会像退团声明里最硬的一句——不要你们的资源也不要你们的人设；如果是娜娜，拒绝会像拒绝直播公会的不平等合同——"我自己能行"。让拒绝施舍落在具体荒唐现场里。' }],
    mustPreserve: '沈知意拒绝顾家的资源施舍。',
  },
  act_08_b06: {
    setPressure: '男主要把占有说成归还，必须保留荒唐自洽。',
    defaultSetReaction:
      '<actor role="顾沉舟">顾沉舟演员</actor>说“本来属于你”时眼神很用力，像真把顾家当成礼物。老赵在监视器后叹了一口气：这人送的是锁，不是花。',
    actorRewriteTargets: [{ roleName: '顾沉舟', focus: '如果是嘉豪，"本来属于你"说出来像夜场里哄人——他真觉得自己在付出但其实在标价；如果是邱鹏，会说得像在推销自己最后的筹码——失业者把仅有的东西摆出来的悲壮。让补偿逻辑暴露成控制。' }],
    mustPreserve: '顾沉舟把顾家控制包装成归还。',
  },
  act_08_b07: {
    setPressure: '女主问出核心，要把烂戏这个词从剧情打到片场。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>说“收拾这场烂戏”时停了一下，现场所有人都知道她说的是顾家，也像在说这条样片。没人敢笑，因为她说得太准。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '如果是小满，”烂戏”会让她想起自己团里的烂剧本——说出来有切肤之痛；如果是娜娜，会说得特别自然因为她在快手上天天看烂戏——“这不就是那种三流短剧吗”。让”烂戏”双关但不破坏沉浸。' }],
    mustPreserve: '沈知意指出顾沉舟想让她收拾顾家的烂摊子。',
  },
  act_08_b08: {
    setPressure: '长台词最难，演员要把所有人的动机一口气剖开。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>长台词说到一半，顾沉舟演员和温雅演员都在她的停顿里被迫重新接住自己的角色。周特助演员还跪着，像这段审判里最尴尬的证物。',
    actorRewriteTargets: [
      { roleName: '沈知意', focus: '如果是小满，长台词会像偶像最后一次直播的告别——每句都在切割过去；如果是娜娜，长台词会像短视频里那种"姐妹清醒语录"——句句土但句句到位。让长台词变成一段现场审判而不是说明书。' },
      { roleName: '顾沉舟', focus: '如果是嘉豪，听到"后悔"和"占有"时会像夜场里被人说透底色——第一次无法用营业笑遮过去；如果是邱鹏，会被"后悔"扎到像在回顾自己人生所有后悔的决定。让男主听见自己被定义为后悔和占有。' },
      { roleName: '温雅', focus: '让女二听见自己被定义为输赢。' },
      { roleName: '周特助', focus: '让助理听见自己被定义为顾家道德绑架。' },
    ],
    mustPreserve: '沈知意逐个剖开顾沉舟、温雅和周特助的动机。',
  },
  act_08_b09: {
    setPressure: '主题句要落地，不能像作者发言。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>最后问“我还想不想踏进这个门”时真的看向门口，像已经准备走。摄影本来想推脸，结果跟着她看门，反而把“离开”拍出来了。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '如果是小满，看向门口会像偶像准备退场——动作克制但方向坚定；如果是娜娜，会更大幅度地转身——像要走就走不拖泥带水的劲。用视线和身体方向让主题句变成行动。' }],
    mustPreserve: '沈知意明确拒绝顾家替她定义选择。',
  },

  act_09_b01: {
    setPressure: '男主最后挽回要从命令变成乞求，但表达方式仍旧霸总。',
    defaultSetReaction:
      '<actor role="顾沉舟">顾沉舟演员</actor>说“把整个顾家掀了”时自己都觉得像拆迁承诺，语气差点飘。沈知意演员没有回头，逼得他把这句荒唐话说完整。',
    actorRewriteTargets: [
      { roleName: '顾沉舟', focus: '如果是嘉豪，"把整个顾家掀了"会像夜场里最后的豪言——声音大但底气空，霸总承诺听起来像买单承诺；如果是邱鹏，会说得像要做一件自己完全做不到的事——悲壮感溢出角色。让最后挽回听起来仍然像控制。' },
      { roleName: '沈知意', focus: '如果是小满，不回头是偶像退团后再不看评论区的决绝——这种冷一旦下定就不会反复；如果是娜娜，不回头会更潇洒更利落像直播下播——"拜拜了各位"。用不回头压住男主最后的失控。' },
    ],
    mustPreserve: '顾沉舟最后试图用极端承诺留住沈知意。',
  },
  act_09_b02: {
    setPressure: '门口停顿是最后一刀前的喘息，不能拖太长，场地快到点。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>停在门口，没有回头，只轻轻笑了一下。现场所有人都知道她要放狠话，连收音师都把杆子往前送了一点。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '如果是小满，冷笑会像偶像在发布会上对黑粉提问的最后一个微笑——优雅到极致的蔑视；如果是娜娜，笑会更野更有劲——像快手主播准备放大招前的表情。让冷笑成为最后一刀的预备动作。' }],
    mustPreserve: '沈知意停在门口，准备留下最后一刀。',
  },
  act_09_b03: {
    setPressure: '终场狠台词很容易太脏或太直，要狠但有短剧爽感。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>念到“下贱”前停了一瞬，像正常人最后确认这词真的要说。她说出口后，群演先吸气，后面一个人差点鼓掌，被老赵用眼神按住。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '如果是小满，说"下贱"前的停顿会像偶像权衡这个词会不会被截图——但最终还是说了因为这次她不在乎了；如果是娜娜，会更快更不犹豫——她在快手上说过更狠的。把对狠词的迟疑转化成角色最后的刀。' }],
    mustPreserve: '沈知意用狠话钉住顾家的求人方式。',
  },
  act_09_b04: {
    setPressure: '离开动作要干脆，不能回头留恋。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>转身走得太快，差点走出灯区。摄影追得有点狼狈，反而像顾家和片场都追不上她。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '如果是小满，转身走出灯区会像偶像最后一次离开舞台——背影克制但每一步都在说"我选的"；如果是娜娜，会走得很快很决绝——像下播关摄像头一样利落。让女主离开成为夺回行动权。' }],
    mustPreserve: '沈知意转身离开，顾家拦不住。',
  },
  act_09_b05: {
    setPressure: '男主最后追喊要保留控制余波，但不能追回女主。',
    defaultSetReaction:
      '<actor role="顾沉舟">顾沉舟演员</actor>追喊时往前迈了一步，又被场记提醒不能出安全线。他只好站在原地喊，像顾沉舟终于被一条看不见的线拦住。',
    actorRewriteTargets: [{ roleName: '顾沉舟', focus: '如果是嘉豪，被安全线拦住会像夜场里被保安拦——他太熟悉这种"不能再往前"了，身体本能就停了；如果是邱鹏，被拦住后会更无力——像生活里追不上的东西又一次跑了。让现场限制变成剧情限制。' }],
    mustPreserve: '顾沉舟仍试图用顾家力量追回沈知意。',
  },
  act_09_b06: {
    setPressure: '爽感收尾必须短，不能解释。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>“让他们排队”说得像门口叫号，土得刚刚好。老赵在监视器后面小声说：“这个能当切片标题。”',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '如果是小满，"让他们排队"会说得像偶像最后一句粉丝喊话——冷但有范；如果是娜娜，会说得像快手爆款文案——土到冒烟但就是让人想截图。让短句兼具爽感和土味切片感。' }],
    mustPreserve: '沈知意用一句话彻底拒绝顾家追回。',
  },
  act_09_b07: {
    setPressure: '顾家崩塌画面要留下余波，群演可以终于松一口气。',
    defaultSetReaction:
      '沈知意走出灯区后，群演才敢换脚站。<actor role="顾家长辈">顾家长辈演员</actor>看着门口，像终于意识到这个家不是没人撑，是撑法太难看。',
    actorRewriteTargets: [{ roleName: '顾家长辈', focus: '如果是曼丽，体面碎了之后会像美甲店遇到恶评——先想怎么回复维护口碑；如果是郭港，会沉默地看着门口像保安目送最后一个下班的人——什么都不说但什么都知道。让顾家体面碎掉后仍然想维持姿态。' }],
    mustPreserve: '顾家众人留在灯火里，体面彻底碎掉。',
  },
  act_09_b08: {
    setPressure: '黑屏前必须有短剧钩子，老赵需要确认这一集能剪。',
    defaultSetReaction:
      '老赵盯着监视器里的黑屏，过了两秒才说：“行，虽然不像豪门，但像能被骂上去。”演员们没人立刻庆祝，大家都在等他下一句是不是还要补拍。',
    actorRewriteTargets: [],
    mustPreserve: '第一集以黑屏钩子结束，留下顾家继续发疯的余波。',
  },
};

export const scriptSkeleton: ScriptSkeletonAct[] = baseScriptSkeleton.map((act) => ({
  ...act,
  beats: act.beats.map((beat) => ({
    ...beat,
    ...shootingBeatDetails[beat.beatId],
  })),
}));

export const actBackgrounds: Record<string, string> = {
  act_01: '/pixels/scene-gu-banquet-corridor.png',
  act_02: '/pixels/scene-gu-side-corridor.png',
  act_03: '/pixels/scene-gu-side-corridor.png',
  act_04: '/pixels/scene-gu-banquet-hall.png',
  act_05: '/pixels/scene-gu-mansion-room.png',
  act_06: '/pixels/scene-gu-mansion-room.png',
  act_07: '/pixels/scene-gu-mansion-room.png',
  act_08: '/pixels/scene-gu-side-corridor.png',
  act_09: '/pixels/scene-gu-night-exit.png',
};

export const rolePortraits: Record<string, string> = {
  'shen-zhiyi': '/pixels/role-shen-zhiyi.png',
  'gu-chenzhou': '/pixels/role-gu-chenzhou.png',
  'wen-ya': '/pixels/role-wen-ya.png',
  'zhou-assistant': '/pixels/role-zhou-assistant.png',
};

export const roleActorPortraits: Record<string, Record<string, string>> = {
  'shen-zhiyi': {
    'lin-xiaoman': '/pixels/role-shen-lin.png',
    'sun-manli': '/pixels/role-shen-sun.png',
    'wang-nana': '/pixels/role-shen-wang.png',
  },
  'wen-ya': {
    'lin-xiaoman': '/pixels/role-wen-lin.png',
    'sun-manli': '/pixels/role-wen-sun.png',
    'wang-nana': '/pixels/role-wen-wang.png',
  },
  'gu-chenzhou': {
    'zhang-jiahao': '/pixels/role-gu-zhang.png',
    'qiu-peng': '/pixels/role-gu-qiu.png',
    'guo-gang': '/pixels/role-gu-guo.png',
  },
  'zhou-assistant': {
    'zhang-jiahao': '/pixels/role-zhou-assistant-zhang.png',
    'qiu-peng': '/pixels/role-zhou-assistant-qiu.png',
    'guo-gang': '/pixels/role-zhou-assistant-guo.png',
  },
};

export interface ReactionLine {
  speaker: string;
  text: string;
  mood: string;
}

function splitDisplaySentences(text: string): string[] {
  let normalized = text.replace(/\s+/g, ' ').trim();
  if (/^[“”"'‘’]+$/.test(normalized)) return [];
  if (/^[“"‘'].*[”"’']$/.test(normalized)) {
    normalized = normalized.slice(1, -1).trim();
  }
  if (!normalized) return [];
  const sentences = normalized.match(/[^。！？!?]+[。！？!?]+[”"’'）)]*|[^。！？!?]+$/g) || [normalized];
  return sentences
    .map((item) => item.trim())
    .map((item) => item.replace(/^[“"‘']+|[”"’']+$/g, '').trim())
    .filter((item) => item && !/^[“”"'‘’。！？!?，,、；;：:]+$/.test(item));
}

/**
 * 将剧本骨架 + 个性化演员反应组装为可播放的 ActDraft[]。
 * Layer 1（剧中剧台词）来自 beat.referenceText。
 * Layer 2/3（演员反应）来自 reactions map。
 */
export function assembleActDrafts(
  skeleton: ScriptSkeletonAct[],
  reactions: Record<string, ReactionLine[]>
): ActDraft[] {
  return skeleton.map((act) => {
    const lines: ShootLine[] = [];
    let lineNum = 1;

    for (const beat of act.beats) {
      let type: ShootLine['type'];
      let speaker = beat.speaker || '镜头';

      switch (beat.beatType) {
        case 'shot':
          type = 'action';
          speaker = '镜头';
          break;
        case 'dialogue':
          type = 'dialogue';
          break;
        case 'action':
          type = 'action';
          break;
        case 'inner':
          type = 'inner';
          break;
        case 'turning_point':
          type = beat.speaker ? 'dialogue' : 'action';
          break;
        default:
          type = 'action';
      }

      const scriptSentences = splitDisplaySentences(beat.referenceText);
      for (const [sentenceIndex, sentence] of scriptSentences.entries()) {
        const lineId = `${act.actId}_l${String(lineNum).padStart(2, '0')}`;
        lineNum++;
        lines.push({
          lineId,
          sourceBeatId: beat.beatId,
          type,
          speaker,
          text: sentence,
          innerThought: sentenceIndex === 0 ? beat.innerCue || null : null,
          mood: beat.riskTag || '',
          riskSignal: 'low',
        });
      }

      const reactionLines = reactions[beat.beatId];
      if (reactionLines) {
        for (const reaction of reactionLines) {
          for (const sentence of splitDisplaySentences(reaction.text)) {
            const rLineId = `${act.actId}_l${String(lineNum).padStart(2, '0')}`;
            lineNum++;
            lines.push({
              lineId: rLineId,
              sourceBeatId: beat.beatId,
              type: 'actor_reaction',
              speaker: reaction.speaker,
              text: sentence,
              innerThought: null,
              mood: reaction.mood,
              riskSignal: 'low',
            });
          }
        }
      }
    }

    return {
      actId: act.actId,
      title: act.title,
      lines,
      defaultOutcome: {
        summary: act.requiredOutcome,
        statDelta: { budget: -3, buzz: 5, dignity: -2, control: -3 },
        memory: act.mustHappen,
      },
    };
  });
}

/**
 * 从剧本骨架提取默认（未个性化）的演员反应，用于 mock/fallback。
 * 将 <actor> XML tag 替换为真实演员姓名。
 */
export function extractDefaultReactions(
  skeleton: ScriptSkeletonAct[],
  casting: Casting[]
): Record<string, ReactionLine[]> {
  const reactions: Record<string, ReactionLine[]> = {};

  // Build a role→actorName map for all casting entries
  const roleNameMap: Record<string, string> = {};
  for (const c of casting) {
    for (const part of c.scriptRoleName.split('/').map((s) => s.trim())) {
      roleNameMap[part] = c.actorName;
    }
  }

  for (const act of skeleton) {
    for (const beat of act.beats) {
      if (!beat.defaultSetReaction?.includes('<actor')) continue;

      let text = beat.defaultSetReaction;
      const tagRegex = /<actor role="([^"]+)">([^<]+)<\/actor>/g;

      // Replace XML tags with real actor names
      text = text.replace(tagRegex, (_, roleName: string) => {
        return roleNameMap[roleName] || roleName + '演员';
      });

      // Replace plain-text "{roleName}演员" references outside XML tags
      for (const [roleName, actorName] of Object.entries(roleNameMap)) {
        text = text.replaceAll(roleName + '演员', actorName);
      }

      // Split into one-sentence-per-line for display.
      // Split after: 。！？ or after closing quotes （。"  ！"  ？"） when followed by more text.
      const splitLines = splitDisplaySentences(text);
      const lines: ReactionLine[] = splitLines.length > 0
        ? splitLines.map((s) => ({ speaker: '片场', text: s.trim(), mood: beat.riskTag || '' }))
        : [{ speaker: '片场', text, mood: beat.riskTag || '' }];

      reactions[beat.beatId] = lines;
    }
  }

  return reactions;
}
