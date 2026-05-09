import {
  Actor,
  Casting,
  Project,
  ScriptRole,
  ScriptSkeletonAct,
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
        beatId: 'act_01_b04',
        beatType: 'action',
        speaker: '顾沉舟',
        referenceText: '顾沉舟从人群里走出来，盯着她，说：知意，跟我进去。',
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
        beatId: 'act_01_b08',
        beatType: 'turning_point',
        speaker: '顾沉舟',
        referenceText: '我最后说一遍，跟我进去。沈知意回：我要是不呢？顾沉舟说：由不得你。',
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
        beatId: 'act_02_b05',
        beatType: 'shot',
        referenceText: '全场安静，几秒后沈知意猛地推开他，抬手就是一巴掌。',
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
        beatId: 'act_04_b04',
        beatType: 'action',
        speaker: '顾沉舟',
        referenceText: '顾沉舟立刻把温雅推开：温雅，你够了！',
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
      { roleName: '沈知意', focus: '把进门被围观的尴尬演成被临时拉进豪门审判局的不适。' },
      { roleName: '顾家长辈', focus: '把低成本群演装豪门的别扭感带出来。' },
    ],
    mustPreserve: '沈知意进入顾家晚宴外廊，并立刻感到自己被围观审判。',
  },
  act_01_b02: {
    setPressure: '第一句羞辱台词必须压住场，但群演离收音太近，所有人都听得见笑场前的吸气。',
    defaultSetReaction:
      '<actor role="顾家长辈">顾家长辈演员</actor>第一次说“外人”时说得太像物业调解，自己也觉得不像豪门。旁边一个群演跟着点头点早了，像在参加业委会投票。',
    actorRewriteTargets: [{ roleName: '顾家长辈', focus: '结合演员本人的社会身份，把羞辱台词演成一种不太高级但很用力的体面。' }],
    mustPreserve: '顾家长辈公开羞辱沈知意，把她定义成外人。',
  },
  act_01_b03: {
    setPressure: '女主第一句反击要立住，不能像吵架短视频，也不能太正剧。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>听见“外人”后下意识想用现实逻辑反驳，但剧本要求她又美又冷。她停了半拍，像在心里确认：这帮人真的是在一条走廊上审我吗？',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '结合演员入组心态，把清醒反击演成“知道荒唐但不陪他们疯”。' }],
    mustPreserve: '沈知意不示弱，正面回击顾家羞辱。',
  },
  act_01_b04: {
    setPressure: '男主必须第一次出场就有霸总压迫感，但场地太窄，走两步就会踩到地贴。',
    defaultSetReaction:
      '<actor role="顾沉舟">顾沉舟演员</actor>从人群里走出来时被地上的胶带绊了一下，立刻把这一下绷成“危险停顿”。老赵在监视器后面小声说：“别管，像顾总在压怒火。”',
    actorRewriteTargets: [{ roleName: '顾沉舟', focus: '把现实里的不顺脚转化成角色的压迫感，或者反过来带偏成尴尬。' }],
    mustPreserve: '顾沉舟出场，并强势要求沈知意跟他进去。',
  },
  act_01_b05: {
    setPressure: '“三年前就不是顾家的人”是女主切身份的关键句，不能被演成普通斗嘴。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>说到“三年前”时看了一眼顾沉舟演员，像在确认对方到底有没有听懂这句不是撒娇。顾沉舟演员本能想接近一步，结果被摄影提醒别出画。',
    actorRewriteTargets: [
      { roleName: '沈知意', focus: '把身份切割演成冷静划线，不是吃醋。' },
      { roleName: '顾沉舟', focus: '让男主演员对“前妻不归顾家”产生自己的误读。' },
    ],
    mustPreserve: '沈知意明确切断自己和顾家的身份关系。',
  },
  act_01_b06: {
    setPressure: '温雅第一句要像体面现任，但台词本身又很拱火。',
    defaultSetReaction:
      '<actor role="温雅">温雅演员</actor>原本准备端着说完，结果“才算”两个字太像门口保安查资格，她自己听完都微微停顿。群演误以为停顿是给反应，立刻齐刷刷看向沈知意。',
    actorRewriteTargets: [{ roleName: '温雅', focus: '把体面挑衅和“我也觉得这话怪怪的”的尴尬缝在一起。' }],
    mustPreserve: '温雅宣示自己能站在顾家位置上，挑衅沈知意。',
  },
  act_01_b07: {
    setPressure: '短句打脸需要精准停顿，过了就像段子，轻了又没爽感。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>说“你站得挺稳的”时真的看了一眼温雅的鞋，现场一瞬间以为她要评价造型。<actor role="温雅">温雅演员</actor>被这个眼神带到，僵笑比剧本要求更真。',
    actorRewriteTargets: [
      { roleName: '沈知意', focus: '把短句打脸演成不经意但扎人。' },
      { roleName: '温雅', focus: '把被看穿位置焦虑的僵硬反应演出来。' },
    ],
    mustPreserve: '沈知意用短句打回温雅。',
  },
  act_01_b08: {
    setPressure: '这一拍要把“带进去”推到下一幕，但不能真的拖拽过猛，群演也快站不住了。',
    defaultSetReaction:
      '<actor role="顾沉舟">顾沉舟演员</actor>说“由不得你”时本能往前压，<actor role="沈知意">沈知意演员</actor>下意识退半步，刚好撞到走廊花柱。老赵没喊停，因为这一下比剧本还像低成本豪门里的困兽。',
    actorRewriteTargets: [
      { roleName: '顾沉舟', focus: '把霸总越界演成控制欲，但不要变成单纯粗鲁。' },
      { roleName: '沈知意', focus: '把退半步处理成被冒犯后的防御，而不是害怕。' },
    ],
    mustPreserve: '顾沉舟越过沟通边界，强行把沈知意推向下一幕冲突。',
  },

  act_02_b01: {
    setPressure: '第二幕开机时场地已经开始催时间，上一幕的走位还没完全顺。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>说“三年前你让我滚”时忽然把戏里的旧账说得像现实里真被人赶过。<actor role="顾沉舟">顾沉舟演员</actor>没立刻接上，像被这句怼醒：原来这不是普通霸总撒疯。',
    actorRewriteTargets: [
      { roleName: '沈知意', focus: '让旧伤台词从爽剧语气里长出一点真实刺痛。' },
      { roleName: '顾沉舟', focus: '让男主演员短暂意识到角色逻辑荒唐。' },
    ],
    mustPreserve: '沈知意把顾沉舟现在的挽回和三年前的驱逐放在一起。',
  },
  act_02_b02: {
    setPressure: '抓手腕要拍出越线，但现场要求借力，不能真的拽疼。',
    defaultSetReaction:
      '<actor role="顾沉舟">顾沉舟演员</actor>第一次伸手太礼貌，像扶人过马路。老赵在旁边急了：“不是文明城市宣传片，是顾总失控。”第二次他用力又怕过界，手悬在半空尴尬了半秒。',
    actorRewriteTargets: [{ roleName: '顾沉舟', focus: '根据演员本人对“霸总压迫感”的理解，把礼貌、过猛或职业惯性变成现场小事故。' }],
    mustPreserve: '顾沉舟主动抓住沈知意手腕，动作越过正常边界。',
  },
  act_02_b03: {
    setPressure: '女主必须明确抗拒，不能被拍成偶像剧心动。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>喊“你干什么”时先看了一眼顾沉舟的手，像在确认真抓还是借位。这个确认被镜头吃进去，反而让抗拒多了一点真实的慌。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '让演员对亲密距离的真实防御变成角色被冒犯的反应。' }],
    mustPreserve: '沈知意第一反应是抗拒和被冒犯。',
  },
  act_02_b04: {
    setPressure: '强吻是第一集爆点，但现场没有亲密指导，只有老赵拿着一张皱掉的分镜纸。',
    defaultSetReaction:
      '<actor role="顾沉舟">顾沉舟演员</actor>和<actor role="沈知意">沈知意演员</actor>同时确认“是真亲还是借位”，两个人都说得很小声，结果收音刚好收到。群演憋笑憋到肩膀抖，老赵硬着头皮说：“借位，借位也要有顾总不要脸的气势。”',
    actorRewriteTargets: [
      { roleName: '顾沉舟', focus: '结合男演员现实身份，决定他会把强吻理解成压迫、仪式感、还是完全手足无措。' },
      { roleName: '沈知意', focus: '结合女演员心态，决定她会如何守住“被强吻但不能输”。' },
    ],
    mustPreserve: '顾沉舟当众制造亲密越界爆点，沈知意被冒犯。',
  },
  act_02_b05: {
    setPressure: '巴掌要借位，声效后期补，但群演已经准备看真打。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>抬手前下意识说了句“我借位啊”，声音小到像咬牙。<actor role="顾沉舟">顾沉舟演员</actor>提前闭眼，巴掌还没到，脸已经开始演疼。',
    actorRewriteTargets: [
      { roleName: '沈知意', focus: '把动作安全确认藏进角色的怒气里。' },
      { roleName: '顾沉舟', focus: '让男主演员对被打的预判制造低成本喜剧感。' },
    ],
    mustPreserve: '沈知意反击顾沉舟的越界行为。',
  },
  act_02_b06: {
    setPressure: '“有病吧”要像角色判断，不是演员吐槽剧本。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>这句说得太顺，顺到现场所有人都短暂分不清她是在骂顾沉舟，还是在替大家骂这场戏。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '让吐槽贴着剧情走，但带出现场全员觉得剧本离谱的共振。' }],
    mustPreserve: '沈知意明确否定顾沉舟的越界行为。',
  },
  act_02_b07: {
    setPressure: '男主疯批深情台词很容易像自我感动，必须撑住不笑。',
    defaultSetReaction:
      '<actor role="顾沉舟">顾沉舟演员</actor>说“我就没正常过”时停顿太久，像真的在复盘自己这段戏合不合理。温雅演员在旁边听得脸色复杂，像已经准备报警又想起自己也有强吻戏。',
    actorRewriteTargets: [{ roleName: '顾沉舟', focus: '把疯批深情演成自洽的病，或者让演员的困惑漏出一点喜剧裂缝。' }],
    mustPreserve: '顾沉舟把自己的失控包装成深情。',
  },
  act_02_b08: {
    setPressure: '温雅必须被点燃，但她还没正式爆，镜头只给表情。',
    defaultSetReaction:
      '<actor role="温雅">温雅演员</actor>听见顾沉舟说没正常过，表情先是“你们男的真麻烦”，又立刻想起自己下一幕要更麻烦。这个犹豫被镜头拍到，像温雅体面裂开前的一道缝。',
    actorRewriteTargets: [{ roleName: '温雅', focus: '把旁观刺激演成“我也知道离谱，但我必须输不起”。' }],
    mustPreserve: '温雅被顾沉舟对沈知意的失控刺激，埋下下一幕爆发。',
  },

  act_03_b01: {
    setPressure: '现场所有人还在消化强吻，第三幕要立刻接一句清醒反击。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>说“别拉着我”时没有往偶像剧方向接，而是像真的想退出这个荒唐群聊。老赵听完点头：“对，就是这种不想加班的清醒。”',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '把拒绝深情绑架演成清醒撤离，而不是欲拒还迎。' }],
    mustPreserve: '沈知意拒绝把顾沉舟的失控理解成爱情。',
  },
  act_03_b02: {
    setPressure: '“这一口，是你欠顾家的”非常难说，稍微不对就像反派自曝。',
    defaultSetReaction:
      '<actor role="顾沉舟">顾沉舟演员</actor>念到“欠顾家”时明显卡了一下，像正常人终于被台词绊倒。老赵在监视器后面用气声提醒：“别理解，先说。”',
    actorRewriteTargets: [{ roleName: '顾沉舟', focus: '让男演员对债务式深情的困惑自然滑进角色的控制欲。' }],
    mustPreserve: '顾沉舟把刚才的越界说成沈知意欠顾家的东西。',
  },
  act_03_b03: {
    setPressure: '这句之后必须有全场空白，空白越长越像事故。',
    defaultSetReaction:
      '群演没人知道该震惊还是该嫌弃，有人吸了一口气，像听到亲戚饭桌上最糟糕的发言。<actor role="顾家长辈">顾家长辈演员</actor>慢半拍才想起自己应该维护顾家，表情已经先背叛了。',
    actorRewriteTargets: [{ roleName: '顾家长辈', focus: '让长辈演员也被这句台词雷到，但还要装作顾家能圆。' }],
    mustPreserve: '全场因顾沉舟的冒犯逻辑陷入死寂。',
  },
  act_03_b04: {
    setPressure: '女主怒极反笑不能太文艺，要像真的被荒唐气笑。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>笑出来那一下不是美强惨，是“你们真的敢这么写”的荒唐。摄影没切，反而让这笑变成沈知意看穿顾家的证据。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '把演员被台词雷到的笑转化为角色怒极反笑。' }],
    mustPreserve: '沈知意确认顾家仍然把她当债务。',
  },
  act_03_b05: {
    setPressure: '“有脸”两个字要打中顾家，但不能演成普通骂街。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>把“有脸”咬得很准，准到群演里有人差点鼓掌。老赵赶紧压手势：这不是庭审现场，是豪门晚宴。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '让反击有短剧爽感，但保留现场差点拍成审判大会的滑稽。' }],
    mustPreserve: '沈知意正面反击顾家的债务逻辑。',
  },
  act_03_b06: {
    setPressure: '男主想给名分，但台词听起来像宣布所有权。',
    defaultSetReaction:
      '<actor role="顾沉舟">顾沉舟演员</actor>说“顾家认的人”时自己先皱了下眉，像突然发现角色把恋爱谈成了户口本。这个皱眉被老赵保留，因为像顾总在和自己较劲。',
    actorRewriteTargets: [{ roleName: '顾沉舟', focus: '把演员意识到台词荒唐的停顿变成角色控制欲裂缝。' }],
    mustPreserve: '顾沉舟公开把沈知意和顾家绑定。',
  },
  act_03_b07: {
    setPressure: '长辈的“疯了”既是剧中反应，也是现场观感。',
    defaultSetReaction:
      '<actor role="顾家长辈">顾家长辈演员</actor>这句说得太真，像终于替所有群演发言。老赵没喊停，因为顾家自己都觉得顾家疯了，反而更像第一集钩子。',
    actorRewriteTargets: [{ roleName: '顾家长辈', focus: '把正常人吐槽和顾家长辈失控缝在一起。' }],
    mustPreserve: '顾家内部也被顾沉舟的公开失控震到。',
  },
  act_03_b08: {
    setPressure: '温雅只用三个字接住下一幕，必须像被当众戳到命门。',
    defaultSetReaction:
      '<actor role="温雅">温雅演员</actor>说“只有她”时先看向顾沉舟，再看向沈知意，像在等别人告诉她这场戏到底谁才是现任。没人接，她只能自己把体面咽回去。',
    actorRewriteTargets: [{ roleName: '温雅', focus: '把被比较、被悬空的反应演成下一幕主动失控的起点。' }],
    mustPreserve: '温雅被顾沉舟对沈知意的偏向点燃。',
  },

  act_04_b01: {
    setPressure: '抓领带动作要准，领带是临时借的，不能扯坏。',
    defaultSetReaction:
      '<actor role="温雅">温雅演员</actor>第一次抓领带时抓到了领夹，顾沉舟演员疼得表情真空了一秒。老赵立刻说：“很好，这就是顾总欠她的。”',
    actorRewriteTargets: [
      { roleName: '温雅', focus: '把动作失误转化成她抢回位置的急切。' },
      { roleName: '顾沉舟', focus: '让男主演员的真实疼痛成为角色被温雅打断控制的反应。' },
    ],
    mustPreserve: '温雅主动拉近顾沉舟，准备反击沈知意。',
  },
  act_04_b02: {
    setPressure: '第二个亲密动作比第一个更尴尬，现场已经没人敢大声讨论借位。',
    defaultSetReaction:
      '<actor role="温雅">温雅演员</actor>和<actor role="顾沉舟">顾沉舟演员</actor>同时偏头，借位借成了互相找镜头。沈知意演员站在旁边看着，表情像第一次现场围观短剧工业事故。',
    actorRewriteTargets: [
      { roleName: '温雅', focus: '让她抢回“吻”的动作带着荒唐的胜负欲。' },
      { roleName: '顾沉舟', focus: '让男主演员在两场亲密戏之间越来越失去控制。' },
    ],
    mustPreserve: '温雅用同样越界的方式刺激顾沉舟和沈知意。',
  },
  act_04_b03: {
    setPressure: '女主吐槽要帮观众泄压，但不能变成破坏第四面墙。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>这句说得像真心提问，现场有人差点接“不是”。老赵瞪了一圈，大家才想起这还是顾家晚宴，不是剧本围读。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '把观众会吐槽的话留在角色逻辑里。' }],
    mustPreserve: '沈知意用冷讽拆穿顾家的荒唐。',
  },
  act_04_b04: {
    setPressure: '推开动作要安全，但情绪要像顾沉舟终于失控。',
    defaultSetReaction:
      '<actor role="顾沉舟">顾沉舟演员</actor>推开温雅时轻得像递文件，温雅演员差点没反应。老赵只好补一句：“你们这是修罗场，不是交接班。”',
    actorRewriteTargets: [
      { roleName: '顾沉舟', focus: '结合演员对冲突的处理方式，让推开动作在安全和失控之间摇摆。' },
      { roleName: '温雅', focus: '让温雅被推开的羞辱感来自现场真实落差。' },
    ],
    mustPreserve: '顾沉舟推开温雅，把她推到对立面。',
  },
  act_04_b05: {
    setPressure: '温雅终于撕开体面，台词长且情绪满，容易演成吵架。',
    defaultSetReaction:
      '<actor role="温雅">温雅演员</actor>越说越像真的在质问这段关系为什么轮不到她，台词里的狗血突然有了生活感。群演本来准备看热闹，结果被她说得安静了。',
    actorRewriteTargets: [{ roleName: '温雅', focus: '让女二从工具人吃醋变成一个知道自己位置尴尬的人。' }],
    mustPreserve: '温雅公开质问顾沉舟，让自己的羞辱摊开。',
  },
  act_04_b06: {
    setPressure: '“你不能拿她赢我”抽象但抓马，是短剧味的关键。',
    defaultSetReaction:
      '<actor role="温雅">温雅演员</actor>说完这句后自己也停了一秒，像在确认“赢我”到底是什么比赛。老赵在监视器后面轻轻鼓掌：对，就是这种不知道在争什么但必须争的劲。',
    actorRewriteTargets: [{ roleName: '温雅', focus: '把台词的抽象感演成短剧人物真信这套输赢。' }],
    mustPreserve: '温雅把感情问题说成位置输赢。',
  },
  act_04_b07: {
    setPressure: '这句要把温雅的地位焦虑顶出来，不能只是尖叫。',
    defaultSetReaction:
      '<actor role="温雅">温雅演员</actor>说“今晚站在这里的人就是我”时真的往灯光中心挪了一步，像怕再不挪就没位置。这个多出来的一步把群演队形挤歪了。',
    actorRewriteTargets: [{ roleName: '温雅', focus: '让抢位置这件事从台词变成身体动作。' }],
    mustPreserve: '温雅暴露自己害怕失去顾家席位。',
  },
  act_04_b08: {
    setPressure: '女主必须拒绝雌竞逻辑，不能加入抢男人。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>说“你站啊”时语气太平，像真的愿意让出灯位。温雅演员反而更接不住，因为这不是她准备好的吵架节奏。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '把“不抢”演成更锋利的拒绝。' }],
    mustPreserve: '沈知意拒绝和温雅争顾家位置。',
  },
  act_04_b09: {
    setPressure: '男主控场必须失败，否则后面顾家集体发病起不来。',
    defaultSetReaction:
      '<actor role="顾沉舟">顾沉舟演员</actor>喊“闭嘴”时声音压得很低，结果被现场空调声盖了一点。大家没立刻闭，反而更像顾总已经管不住这个组。',
    actorRewriteTargets: [{ roleName: '顾沉舟', focus: '让控场失败同时发生在剧情和片场。' }],
    mustPreserve: '顾沉舟试图控场，但顾家局面已经压不住。',
  },

  act_05_b01: {
    setPressure: '长辈入场是从年轻修罗场切到顾家秩序，群演要重新站位。',
    defaultSetReaction:
      '<actor role="顾家长辈">顾家长辈演员</actor>等了四幕终于入场，一开口先找机位，像真以为自己是来主持家族会议。老赵让群演往后退，结果大家退得像婚礼让主桌。',
    actorRewriteTargets: [{ roleName: '顾家长辈', focus: '把长辈入场演成低成本顾家权力登场。' }],
    mustPreserve: '顾家长辈接管局面，把私人修罗场升级成家族秩序。',
  },
  act_05_b02: {
    setPressure: '“谁能留下谁就是顾家女主人”封建又土，必须土得理直气壮。',
    defaultSetReaction:
      '<actor role="顾家长辈">顾家长辈演员</actor>说完“女主人”后自己先看了一眼沈知意和温雅，像在等她们报名。两个女演员都没有立刻接，因为正常人听到这句都会先怀疑自己是不是走错年代。',
    actorRewriteTargets: [
      { roleName: '顾家长辈', focus: '把荒唐规则说成他真心觉得公平的安排。' },
      { roleName: '沈知意', focus: '让女主对“被选”的反感自然出现。' },
      { roleName: '温雅', focus: '让女二既被冒犯又忍不住想赢。' },
    ],
    mustPreserve: '顾家长辈公开提出顾家女主人位置，把两位女性放上秤。',
  },
  act_05_b03: {
    setPressure: '温雅听见“女主人”要立刻被拱火，但不能抢台词。',
    defaultSetReaction:
      '<actor role="温雅">温雅演员</actor>呼吸急了一下，像听到一个很冒犯但又很想要的奖项。她想往前一步，又看见沈知意没动，只好把脚尖收回去。',
    actorRewriteTargets: [{ roleName: '温雅', focus: '让“想赢”和“知道羞耻”同时存在。' }],
    mustPreserve: '温雅被“女主人”这个位置刺激。',
  },
  act_05_b04: {
    setPressure: '沈知意必须拆规则，而不是参加比赛。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>说“连人都要这么选”时扫了一圈群演，像在问全场有没有人觉得这正常。群演被她一扫，突然都不敢继续装豪门。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '把女主的识破演成对整个顾家场景的反问。' }],
    mustPreserve: '沈知意识破顾家把人当位置来选。',
  },
  act_05_b05: {
    setPressure: '长辈必须把封建话说得像公司 KPI。',
    defaultSetReaction:
      '<actor role="顾家长辈">顾家长辈演员</actor>把“撑住体面”说得像在讲月度指标，群演一边点头一边更像员工大会。豪门感没上去，顾家机器感倒是有了。',
    actorRewriteTargets: [{ roleName: '顾家长辈', focus: '让长辈的荒唐逻辑带一点现实管理话术。' }],
    mustPreserve: '顾家长辈把女性位置和家族体面绑定。',
  },
  act_05_b06: {
    setPressure: '顾沉舟要阻止长辈，但不能真正跳出顾家逻辑。',
    defaultSetReaction:
      '<actor role="顾沉舟">顾沉舟演员</actor>说“够了”时像终于想起自己是男主，但下一句又不知道该站哪边。这个犹豫正好暴露：他护人也护得不干净。',
    actorRewriteTargets: [{ roleName: '顾沉舟', focus: '让男主的保护和默认占有互相打架。' }],
    mustPreserve: '顾沉舟试图阻止长辈，但仍没真正否定顾家逻辑。',
  },
  act_05_b07: {
    setPressure: '女主要剖男主核心，台词锋利但不能太讲道理。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>这句没有吼，反而像在替顾沉舟补完他自己不敢说的话。顾沉舟演员被她看着，明显少了一点霸总气，多了一点心虚。',
    actorRewriteTargets: [
      { roleName: '沈知意', focus: '把剖核心演成不动声色的揭穿。' },
      { roleName: '顾沉舟', focus: '让男主被揭穿后短暂失语。' },
    ],
    mustPreserve: '沈知意指出顾沉舟的保护仍包着私心。',
  },
  act_05_b08: {
    setPressure: '周特助冲场要像低成本剧突然加大招，现场通道很窄。',
    defaultSetReaction:
      '<actor role="周特助">周特助演员</actor>从人群外冲进来时差点撞到灯架，硬是把绕路演成“忠心太急”。老赵在旁边低声说：“好，顾家的疯终于有腿了。”',
    actorRewriteTargets: [{ roleName: '周特助', focus: '结合演员本人状态，把冲场演成忠心、慌乱或现实疲惫的混合。' }],
    mustPreserve: '周特助冲入现场，带出下一幕下跪求回顾家。',
  },

  act_06_b01: {
    setPressure: '下跪是总助名场面，地面很硬，护膝只有一副还找不到。',
    defaultSetReaction:
      '<actor role="周特助">周特助演员</actor>跪到一半先看地面，身体诚实地迟疑了。老赵没喊停，只让摄影推近，因为“一个成年人真的不想跪”比假忠心更有戏。',
    actorRewriteTargets: [{ roleName: '周特助', focus: '把演员对下跪的现实抗拒转化成角色荒唐忠心的挣扎。' }],
    mustPreserve: '周特助以过度动作求沈知意回顾家。',
  },
  act_06_b02: {
    setPressure: '周特助台词像家庭伦理和公司汇报混在一起，容易过火。',
    defaultSetReaction:
      '<actor role="周特助">周特助演员</actor>喊“顾总别闹了”时像真在劝老板别在客户面前丢人。顾沉舟演员被他一喊，表情从霸总变成被员工公开提醒的尴尬。',
    actorRewriteTargets: [
      { roleName: '周特助', focus: '让助理忠心带出现实职场救火感。' },
      { roleName: '顾沉舟', focus: '让男主被自己助理拆台。' },
    ],
    mustPreserve: '周特助用顾家危机绑架沈知意。',
  },
  act_06_b03: {
    setPressure: '“少夫人”称呼必须让女主不适，不能变成甜宠。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>听见“少夫人”时眉头是真的皱了，像被一个早该注销的会员称呼重新绑定。周特助演员还跪着，抬头等她接，场面更尴尬。',
    actorRewriteTargets: [
      { roleName: '沈知意', focus: '把称呼反感演成被旧秩序强行贴标签。' },
      { roleName: '周特助', focus: '让助理跪着坚持叫错身份的荒唐感更强。' },
    ],
    mustPreserve: '沈知意反感“少夫人”称呼。',
  },
  act_06_b04: {
    setPressure: '“顾家不能没有您”要忠心到离谱，但不能像年会朗诵。',
    defaultSetReaction:
      '<actor role="周特助">周特助演员</actor>这句说得太郑重，像顾家离开沈知意就断电断网。群演里有人低头看手机，像突然想确认顾家是不是真的快倒闭。',
    actorRewriteTargets: [{ roleName: '周特助', focus: '让过度忠心听起来荒唐但真诚。' }],
    mustPreserve: '周特助继续把顾家命运压到沈知意身上。',
  },
  act_06_b05: {
    setPressure: '这句道德绑架太满，演员容易演成苦情短视频。',
    defaultSetReaction:
      '<actor role="周特助">周特助演员</actor>越说越像在替顾家写病危通知，连顾家长辈演员都被他说得坐直了。沈知意演员低头看他，像终于明白这家人把助理也逼疯了。',
    actorRewriteTargets: [
      { roleName: '周特助', focus: '把苦情用力和现实荒唐混在一起。' },
      { roleName: '沈知意', focus: '让女主看清顾家秩序如何压迫每个人。' },
    ],
    mustPreserve: '周特助用顾家痛苦继续道德绑架沈知意。',
  },
  act_06_b06: {
    setPressure: '全场尴尬要被拍出来，不能只写“安静”。',
    defaultSetReaction:
      '群演不敢看跪着的人，也不敢看顾沉舟，最后集体看地毯。<actor role="温雅">温雅演员</actor>脸色越来越白，因为她忽然发现自己连被跪求的资格都没有。',
    actorRewriteTargets: [{ roleName: '温雅', focus: '让女二在周特助下跪时感到自己被排除在顾家真正秩序外。' }],
    mustPreserve: '周特助下跪让所有人尴尬，温雅被进一步刺激。',
  },
  act_06_b07: {
    setPressure: '女主内心看清顾家，但画面上不能停成说教。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>看着周特助跪在地上，没有立刻说话，只往后退了一点。这个退后像正常人躲开荒唐，也像沈知意终于退出顾家的剧本。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '用身体距离表现她看清顾家而不是口头解释。' }],
    mustPreserve: '沈知意看清顾家秩序荒唐。',
  },
  act_06_b08: {
    setPressure: '周特助要把失控推向下一幕最尴尬台词，现场已经没人敢猜他还要说什么。',
    defaultSetReaction:
      '<actor role="周特助">周特助演员</actor>跪着调整了一下呼吸，像准备做最后汇报。老赵在监视器前把耳机摘了一半，又戴回去，因为他知道下一句更炸。',
    actorRewriteTargets: [{ roleName: '周特助', focus: '让演员在最尴尬台词前出现“我真的要说吗”的停顿。' }],
    mustPreserve: '周特助继续升级，为下一幕炸裂台词铺垫。',
  },

  act_07_b01: {
    setPressure: '最炸台词要说出口，现场收音、群演和演员本人都会先沉默。',
    defaultSetReaction:
      '<actor role="周特助">周特助演员</actor>看着这句台词沉默了两秒，像在判断自己说完还能不能做人。老赵只说：“说，竖屏会喜欢。”他说出口后，<actor role="顾沉舟">顾沉舟演员</actor>和<actor role="温雅">温雅演员</actor>同时露出一种“别把我也带上”的表情。',
    actorRewriteTargets: [
      { roleName: '周特助', focus: '让演员对尴尬台词的抗拒自然演化成忠心失控。' },
      { roleName: '顾沉舟', focus: '让男主被助理公开总结亲密史。' },
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
    actorRewriteTargets: [{ roleName: '顾沉舟', focus: '让男主演员的真实尴尬成为顾沉舟被助理拆穿的反应。' }],
    mustPreserve: '顾沉舟被周特助的忠心台词弄僵。',
  },
  act_07_b04: {
    setPressure: '温雅破防要有“我为什么也被统计”的荒唐。',
    defaultSetReaction:
      '<actor role="温雅">温雅演员</actor>质问周特助时差点喊成演员真名，又硬生生咬回角色名。这个咬回去的动作，像温雅把最后一点体面也咬住了。',
    actorRewriteTargets: [{ roleName: '温雅', focus: '让女二破防来自被公开当作对照组。' }],
    mustPreserve: '温雅被周特助的说法公开羞辱。',
  },
  act_07_b05: {
    setPressure: '女主总结疯感是观众出口，必须短、准、冷。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>说“没一个正常人”时现场没人觉得她过分。连老赵都沉默了一下，像在承认这句台词骂到了片场。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '让女主像替观众和片场同时下结论。' }],
    mustPreserve: '沈知意指出顾家集体不正常。',
  },
  act_07_b06: {
    setPressure: '周特助继续加码，必须让观众觉得顾家真的把责任往沈知意身上倒。',
    defaultSetReaction:
      '<actor role="周特助">周特助演员</actor>说“顾家今晚就散了”时语气像公司群里最后一个还在救项目的人。顾家长辈演员听完竟然点头，点得太真。',
    actorRewriteTargets: [{ roleName: '周特助', focus: '把助理救火感和顾家道德绑架结合。' }],
    mustPreserve: '周特助继续把顾家散不散绑在沈知意身上。',
  },
  act_07_b07: {
    setPressure: '温雅必须承认“我算什么”，这句不能只是撒泼。',
    defaultSetReaction:
      '<actor role="温雅">温雅演员</actor>这句说出来后突然没那么用力，像她自己也想知道答案。短剧的狗血在这一秒变得有点扎人，但下一秒群演又因为跪着的人挪膝盖回到荒唐。',
    actorRewriteTargets: [{ roleName: '温雅', focus: '让女二破防里露出一点真实位置焦虑。' }],
    mustPreserve: '温雅公开质问自己的身份位置。',
  },
  act_07_b08: {
    setPressure: '周特助最后补刀温雅，必须像忠心也像职场误伤。',
    defaultSetReaction:
      '<actor role="周特助">周特助演员</actor>说“您不是顾家的人”时非常礼貌，礼貌到更伤人。温雅演员听完闭了下眼，像被一份盖章文件打在脸上。',
    actorRewriteTargets: [
      { roleName: '周特助', focus: '让助理用礼貌说出最残忍的顾家规则。' },
      { roleName: '温雅', focus: '让女二被排除出顾家秩序。' },
    ],
    mustPreserve: '周特助把温雅排除在顾家认可之外。',
  },

  act_08_b01: {
    setPressure: '女主开大前要安静，但现场刚经历最尴尬台词，大家都不敢呼吸。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>看着跪着的、站着的、脸白的几个人，是真的沉默了一会儿。这个沉默不是忘词，而像正常人终于决定不再替这场荒唐圆场。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '把审判前静默演成“我看够了”。' }],
    mustPreserve: '沈知意从接招转为主动审判。',
  },
  act_08_b02: {
    setPressure: '长台词第一段要准确回收前文事故，演员容易像念清单。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>每数一件事，现场对应演员都轻微动一下，像被点名批评。周特助演员还跪着，听到“当众下跪”时甚至想调整姿势，又忍住了。',
    actorRewriteTargets: [
      { roleName: '沈知意', focus: '把总结前文演成逐个点名，而不是念设定。' },
      { roleName: '周特助', focus: '让被点到的羞耻反应留在镜头里。' },
    ],
    mustPreserve: '沈知意逐个点出今晚发生的荒唐事。',
  },
  act_08_b03: {
    setPressure: '冷讽收束要像一刀，不要太喜剧。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>说“真够热闹”时看了一眼满场灯和花，像终于发现这个豪门布景只是在替一群成年人遮羞。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '把豪门热闹拆成荒唐热闹。' }],
    mustPreserve: '沈知意冷讽顾家今晚的集体失控。',
  },
  act_08_b04: {
    setPressure: '男主迟到补偿要足够大，但不能显得真的有用。',
    defaultSetReaction:
      '<actor role="顾沉舟">顾沉舟演员</actor>说“顾家的一切都是你的”时语气很认真，认真到像在推销一个没人想接手的烂摊子。沈知意演员没立刻接，反而让这句更空。',
    actorRewriteTargets: [
      { roleName: '顾沉舟', focus: '让男主真以为资源可以补偿一切。' },
      { roleName: '沈知意', focus: '让女主对补偿的无动于衷压住对方。' },
    ],
    mustPreserve: '顾沉舟用顾家资源挽回沈知意。',
  },
  act_08_b05: {
    setPressure: '女主拒绝施舍要爽，但不是炫富。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>说“缺这口饭吗”时语气像真的被一桌难吃饭菜冒犯了。群演里有人看了一眼道具餐，突然更理解这句。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '让拒绝施舍落在具体荒唐现场里。' }],
    mustPreserve: '沈知意拒绝顾家的资源施舍。',
  },
  act_08_b06: {
    setPressure: '男主要把占有说成归还，必须保留荒唐自洽。',
    defaultSetReaction:
      '<actor role="顾沉舟">顾沉舟演员</actor>说“本来属于你”时眼神很用力，像真把顾家当成礼物。老赵在监视器后叹了一口气：这人送的是锁，不是花。',
    actorRewriteTargets: [{ roleName: '顾沉舟', focus: '让男主的补偿逻辑暴露成控制。' }],
    mustPreserve: '顾沉舟把顾家控制包装成归还。',
  },
  act_08_b07: {
    setPressure: '女主问出核心，要把烂戏这个词从剧情打到片场。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>说“收拾这场烂戏”时停了一下，现场所有人都知道她说的是顾家，也像在说这条样片。没人敢笑，因为她说得太准。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '让“烂戏”双关但不破坏沉浸。' }],
    mustPreserve: '沈知意指出顾沉舟想让她收拾顾家的烂摊子。',
  },
  act_08_b08: {
    setPressure: '长台词最难，演员要把所有人的动机一口气剖开。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>长台词说到一半，顾沉舟演员和温雅演员都在她的停顿里被迫重新接住自己的角色。周特助演员还跪着，像这段审判里最尴尬的证物。',
    actorRewriteTargets: [
      { roleName: '沈知意', focus: '让长台词变成一段现场审判，而不是说明书。' },
      { roleName: '顾沉舟', focus: '让男主听见自己被定义为后悔和占有。' },
      { roleName: '温雅', focus: '让女二听见自己被定义为输赢。' },
      { roleName: '周特助', focus: '让助理听见自己被定义为顾家道德绑架。' },
    ],
    mustPreserve: '沈知意逐个剖开顾沉舟、温雅和周特助的动机。',
  },
  act_08_b09: {
    setPressure: '主题句要落地，不能像作者发言。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>最后问“我还想不想踏进这个门”时真的看向门口，像已经准备走。摄影本来想推脸，结果跟着她看门，反而把“离开”拍出来了。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '用视线和身体方向让主题句变成行动。' }],
    mustPreserve: '沈知意明确拒绝顾家替她定义选择。',
  },

  act_09_b01: {
    setPressure: '男主最后挽回要从命令变成乞求，但表达方式仍旧霸总。',
    defaultSetReaction:
      '<actor role="顾沉舟">顾沉舟演员</actor>说“把整个顾家掀了”时自己都觉得像拆迁承诺，语气差点飘。沈知意演员没有回头，逼得他把这句荒唐话说完整。',
    actorRewriteTargets: [
      { roleName: '顾沉舟', focus: '让最后挽回听起来仍然像控制。' },
      { roleName: '沈知意', focus: '用不回头压住男主最后的失控。' },
    ],
    mustPreserve: '顾沉舟最后试图用极端承诺留住沈知意。',
  },
  act_09_b02: {
    setPressure: '门口停顿是最后一刀前的喘息，不能拖太长，场地快到点。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>停在门口，没有回头，只轻轻笑了一下。现场所有人都知道她要放狠话，连收音师都把杆子往前送了一点。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '让冷笑成为最后一刀的预备动作。' }],
    mustPreserve: '沈知意停在门口，准备留下最后一刀。',
  },
  act_09_b03: {
    setPressure: '终场狠台词很容易太脏或太直，要狠但有短剧爽感。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>念到“下贱”前停了一瞬，像正常人最后确认这词真的要说。她说出口后，群演先吸气，后面一个人差点鼓掌，被老赵用眼神按住。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '把演员对狠词的迟疑转化成角色最后的刀。' }],
    mustPreserve: '沈知意用狠话钉住顾家的求人方式。',
  },
  act_09_b04: {
    setPressure: '离开动作要干脆，不能回头留恋。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>转身走得太快，差点走出灯区。摄影追得有点狼狈，反而像顾家和片场都追不上她。',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '让女主离开成为夺回行动权。' }],
    mustPreserve: '沈知意转身离开，顾家拦不住。',
  },
  act_09_b05: {
    setPressure: '男主最后追喊要保留控制余波，但不能追回女主。',
    defaultSetReaction:
      '<actor role="顾沉舟">顾沉舟演员</actor>追喊时往前迈了一步，又被场记提醒不能出安全线。他只好站在原地喊，像顾沉舟终于被一条看不见的线拦住。',
    actorRewriteTargets: [{ roleName: '顾沉舟', focus: '让男主的控制欲被现场限制变成剧情限制。' }],
    mustPreserve: '顾沉舟仍试图用顾家力量追回沈知意。',
  },
  act_09_b06: {
    setPressure: '爽感收尾必须短，不能解释。',
    defaultSetReaction:
      '<actor role="沈知意">沈知意演员</actor>“让他们排队”说得像门口叫号，土得刚刚好。老赵在监视器后面小声说：“这个能当切片标题。”',
    actorRewriteTargets: [{ roleName: '沈知意', focus: '让短句兼具爽感和土味切片感。' }],
    mustPreserve: '沈知意用一句话彻底拒绝顾家追回。',
  },
  act_09_b07: {
    setPressure: '顾家崩塌画面要留下余波，群演可以终于松一口气。',
    defaultSetReaction:
      '沈知意走出灯区后，群演才敢换脚站。<actor role="顾家长辈">顾家长辈演员</actor>看着门口，像终于意识到这个家不是没人撑，是撑法太难看。',
    actorRewriteTargets: [{ roleName: '顾家长辈', focus: '让顾家体面碎掉后仍然想维持姿态。' }],
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
