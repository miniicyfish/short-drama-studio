import {
  ActDraft,
  DraftRequest,
  EpilogueRequest,
  EpilogueResponse,
  InterventionRequest,
  InterventionResponse,
  RecruitRequest,
  RecruitResult,
  ReviseActRequest,
  ReviseActResponse,
  ShootLine,
  Stats,
} from './gameTypes';
import { assembleActDrafts, extractDefaultReactions } from './gameData';

function zeroStats(delta?: Partial<Stats>): Stats {
  return {
    budget: delta?.budget ?? 0,
    buzz: delta?.buzz ?? 0,
    dignity: delta?.dignity ?? 0,
    control: delta?.control ?? 0,
  };
}

const recruitScenes: Record<
  string,
  {
    challenge: string | ((roleName?: string) => string);
    playerNudge: (word: string) => string;
    accept: (word: string) => string;
    zhao: string | ((roleName?: string) => string);
  }
> = {
  'lin-xiaoman': {
    challenge: '你说得好听，但这种镜头最会把人剪成另一个意思。',
    playerNudge: (word) => `所以我只拍你怎么在"${word}"之后站稳，不拍别人怎么议论你。`,
    accept: () => '我可以来。台词先发我，我要看有没有容易被截出去的句子。',
    zhao: '她答应了，但她会盯每个词。到时候谁乱加暧昧，谁自己解释。',
  },
  'sun-manli': {
    challenge: '你们这个本子，男的强吻，女的冷笑，白月光还疯了，关系挺乱啊。',
    playerNudge: (word) => `乱才需要懂"${word}"的人，不然我们只会拍成四个人互相吼。`,
    accept: () => '行，我去。我倒要看看顾总到底是爱人，还是单纯有病。',
    zhao: '老板娘一旦入戏，可能会现场给顾总做情感诊断，你先有个心理准备。',
  },
  'wang-nana': {
    challenge: '有镜头吗？能拍好看吗？我不想又当别人背景板。',
    playerNudge: (word) => `这场戏要的就是你那种"${word}"的劲，镜头会追着你走。`,
    accept: () => '那我来，但我要最显脸小的机位。',
    zhao: '她现在信了，而且信得很具体。你最好真给她一个机位。',
  },
  'zhang-jiahao': {
    challenge: (roleName) =>
      roleName?.includes('周特助')
        ? '助理我也能演，但他是商务助理，还是那种会替老板挡酒的助理？'
        : '霸总我懂，但你这个顾总，是冷一点，还是危险一点？',
    playerNudge: (word) => `不是夜场那种近，是"${word}"到让人想躲，但又躲不开。`,
    accept: () => '懂了，少笑，多看人。这个我能试。',
    zhao: (roleName) =>
      roleName?.includes('周特助')
        ? '他说懂了。以我的经验，他演助理也会像刚从包厢门口进来。'
        : '他说懂了。以我的经验，他懂的东西通常会带一点灯球味。',
  },
  'qiu-peng': {
    challenge: (roleName) =>
      roleName?.includes('周特助')
        ? '你确定找我演助理？我现在看起来像比老板还需要人扶一把。'
        : '你确定找我？我现在这个状态，演顾总是不是太抽象了。',
    playerNudge: (word) => `我要的不是像有钱，是"${word}"之后还硬撑体面的那股劲。`,
    accept: () => '那我试试。反正我现在也没什么不能丢人的。',
    zhao: '这句说到他心里了，但也可能说深了。深了就容易真疼。',
  },
  'guo-gang': {
    challenge: '我不会演。我就站着，别让我说太多。',
    playerNudge: (word) => `站着就够了，你身上那个"${word}"比很多台词都像豪门。`,
    accept: () => '那行。说少点，钱日结。',
    zhao: '他要求很合理：少说、日结、不加戏。我们尽量珍惜这种清醒。',
  },
};

export function mockRecruit(input: RecruitRequest): { recruitResults: RecruitResult[] } {
  return {
    recruitResults: input.selectedActors.map((actor) => {
      const persuasionLine = actor.persuasionTemplate.replace('____', actor.playerWord);
      const roleName = actor.assignedRole?.scriptRoleName;
      const scene = recruitScenes[actor.id] || {
        challenge: '你们这个听着不太靠谱。',
        playerNudge: (word: string) => `不靠谱才需要你身上那种"${word}"的东西。`,
        accept: () => '行，我可以来看看。',
        zhao: '看着是答应了，至于心里怎么听的，等开机就知道。',
      };
      const challenge =
        typeof scene.challenge === 'function' ? scene.challenge(roleName) : scene.challenge;
      const zhao = typeof scene.zhao === 'function' ? scene.zhao(roleName) : scene.zhao;
      const actorReply = scene.accept(actor.playerWord);
      return {
        actorId: actor.id,
        persuasionLine,
        actorReply,
        visibleConversation: [
          { speaker: '你', text: persuasionLine },
          { speaker: '演员', text: challenge },
          { speaker: '你', text: scene.playerNudge(actor.playerWord) },
          { speaker: '演员', text: actorReply },
          { speaker: '老赵', text: zhao },
        ],
        accepted: true,
        visibleHint: '你不知道他真正怎么理解了这句话，但这种理解会写进后面的片场反应。',
        innerThought: `他/她开始把这次短剧理解成一次关于"${actor.playerWord}"的机会。`,
        mindset: {
          description: `我来这里，是因为他们看见了我身上"${actor.playerWord}"的东西。`,
          behaviorBias: `${actor.lossDirection}压力越大，这个偏向越明显。`,
          conflictTriggers: [
            actor.uncontrolledPoint,
            '被频繁打断',
            '被别人当成笑话',
            `别人否定"${actor.playerWord}"这件事`,
          ],
          toolSensitivity: {
            cut: '会先怀疑是不是自己理解错了，也可能因此更用力。',
            rewrite: '如果改词贴近他的理解，会明显变强；如果改得更悬浮，会更跑偏。',
            chicken: '能短暂提高配合度，但可能让他重新审视这是不是又一个草台活。',
            demo: '会认真模仿导演示范，但一定会带上自己的职业惯性。',
          },
        },
      };
    }),
  };
}

export function mockDraft(input: DraftRequest): { episodeDraft: ActDraft[] } {
  const reactions = extractDefaultReactions(input.scriptSkeleton, input.casting);
  return { episodeDraft: assembleActDrafts(input.scriptSkeleton, reactions) };
}

function matchRoleName(fullRoleName: string, roleName: string) {
  return fullRoleName
    .split('/')
    .map((item) => item.trim())
    .some((item) => item === roleName || item.includes(roleName) || roleName.includes(item));
}

function actorStateForRole(input: InterventionRequest | ReviseActRequest, roleName: string) {
  return input.actorStates.find((item) => matchRoleName(item.scriptRoleName, roleName)) || null;
}

function renderStateReaction(input: InterventionRequest | ReviseActRequest, reaction: string) {
  let firstSpeaker = '';
  const text = reaction.replace(/<actor role="([^"]+)">.*?<\/actor>/g, (_, roleName: string) => {
    const matched = actorStateForRole(input, roleName);
    if (matched && !firstSpeaker) firstSpeaker = matched.actorName;
    return matched?.actorName || `${roleName}演员`;
  });
  return {
    speaker: firstSpeaker || '老赵',
    text,
  };
}

function targetActorStates(input: InterventionRequest) {
  const targets: typeof input.actorStates = [];
  const add = (actor?: (typeof input.actorStates)[number] | null) => {
    if (actor && !targets.some((item) => item.actorId === actor.actorId)) targets.push(actor);
  };

  input.actorStates.forEach((actor) => {
    const roleParts = actor.scriptRoleName.split('/').map((item) => item.trim());
    if (
      input.currentLine.speaker === actor.actorName ||
      roleParts.some((role) => input.currentLine.speaker.includes(role)) ||
      input.currentLine.text.includes(actor.scriptRoleName) ||
      input.currentLine.text.includes(actor.actorName)
    ) {
      add(actor);
    }
  });

  if (input.currentBeat?.speaker) add(actorStateForRole(input, input.currentBeat.speaker));

  const rolesInReaction = Array.from(
    (input.currentBeat?.defaultSetReaction || '').matchAll(/<actor role="([^"]+)">/g)
  ).map((match) => match[1]);
  rolesInReaction.forEach((roleName) => add(actorStateForRole(input, roleName)));

  return targets;
}

function extractQuotedRewrite(prompt: string) {
  return (
    prompt.match(/[“"「『](.+?)[”"」』]/)?.[1]?.trim() ||
    prompt.match(/(?:改成|改为|换成|写成|说成)[:：]?\s*(.+)$/)?.[1]?.trim() ||
    ''
  );
}

function rewriteCurrentText(input: InterventionRequest) {
  const prompt = (input.playerRewritePrompt || '').trim();
  const selectedText = (input.selectedText || input.currentLine.text).trim();
  const directRewrite = extractQuotedRewrite(prompt);
  if (directRewrite) {
    return input.currentLine.text.includes(selectedText)
      ? input.currentLine.text.replace(selectedText, directRewrite)
      : directRewrite;
  }

  const target = prompt || '让这句更能继续拍下去';
  if (/不要真亲|不真亲|别真亲|借位|语言压迫|别亲/.test(target)) {
    return input.currentLine.type === 'dialogue'
      ? '别靠这么近。你想证明什么，就当着所有人说清楚。'
      : '导演把亲密动作撤掉，改成顾沉舟逼近半步，用停顿和眼神压住现场。';
  }
  if (/更狠|狠一点|更强硬|别软/.test(target)) {
    return input.currentLine.type === 'dialogue'
      ? '你们顾家把人逼到这一步，现在还想装作自己体面？'
      : '镜头没有退，反而压近到她的眼神上，让这一下拒绝更硬。';
  }
  if (/温和|克制|别脏|干净|体面/.test(target)) {
    return input.currentLine.type === 'dialogue'
      ? '我可以把话说清楚，但不会陪你们把场面闹得更难看。'
      : '导演把动作收住，只留下角色之间的距离和沉默。';
  }
  if (/好笑|喜剧|尴尬|土/.test(target)) {
    return input.currentLine.type === 'dialogue'
      ? '你们这阵仗不像豪门，像小区业委会临时加戏。'
      : '现场停了一拍，所有人都意识到这段豪门戏突然土得很真。';
  }

  return input.currentLine.type === 'dialogue'
    ? `${selectedText}，但这次语气按"${target}"的方向重新落下。`
    : `导演把这一拍改成"${target}"的方向，现场重新接住当前情绪。`;
}

function toolFallbackText(
  input: InterventionRequest,
  toolName: string,
  primaryActors: ReturnType<typeof targetActorStates>
) {
  const actor = primaryActors[0];

  if (!actor) {
    return `老赵把「${toolName}」塞进现场调度，所有人停了半拍，又硬着头皮按新的节奏继续拍。`;
  }

  switch (input.toolType) {
    case 'cut':
      return `${actor.actorName}听见喊卡后没有放松，反而把刚才那点不服气憋进下一条，老赵只能让机位继续压近。`;
    case 'chicken':
      return `${actor.actorName}接过鸡腿没立刻吃，先看了一眼老赵：“这是安抚，还是算进日结？”现场笑声一乱，刚才的失控被拽成了新的尴尬。`;
    case 'demo':
      return `${actor.actorName}照着导演示范重来了一遍，但把动作放大得过了头，老赵在监视器后面沉默了两秒才说继续。`;
    case 'rewrite':
    default:
      return rewriteCurrentText(input);
  }
}

function line(
  actId: string,
  index: number,
  speaker: string,
  text: string,
  riskSignal: ShootLine['riskSignal'] = 'medium',
  type: ShootLine['type'] = 'dialogue',
  _sourceBeatId?: string,
  innerThought?: string | null
): ShootLine {
  return {
    lineId: `${actId}_l${String(index).padStart(2, '0')}`,
    sourceBeatId: _sourceBeatId,
    type,
    speaker,
    text,
    innerThought:
      innerThought !== undefined
        ? innerThought
        : type === 'dialogue'
          ? `${speaker}心里知道这句很不体面，但镜头已经推过来了。`
          : null,
    mood: riskSignal === 'critical' ? '失控' : riskSignal === 'high' ? '绷紧' : '试探',
    riskSignal,
  };
}

export function mockIntervention(input: InterventionRequest): InterventionResponse {
  const toolName = {
    cut: '喊卡',
    rewrite: '改词',
    chicken: '加鸡腿',
    demo: '导演示范',
  }[input.toolType];
  const affectedActors = targetActorStates(input);
  const primaryActors = affectedActors.length > 0 ? affectedActors : input.actorStates.slice(0, 1);
  const mindsetCollisionLines = primaryActors.slice(0, 2).map((actor, index) => ({
    ...input.currentLine,
    lineId: `${input.actId}_mindset_${index + 1}`,
    type: 'actor_reaction' as const,
    speaker: actor.actorName,
    text: `${actor.actorName}把这次「${toolName}」理解成了自己的那套片场逻辑，接下来的反应明显偏向：${actor.mindset.toolSensitivity[input.toolType]}`,
    innerThought: null,
    mood: '心态碰撞',
    riskSignal: 'high' as const,
  }));
  const replacementText =
    input.toolType === 'rewrite'
      ? rewriteCurrentText(input)
      : toolFallbackText(input, toolName, primaryActors);
  const rewriteReactionLines =
    input.toolType === 'rewrite'
      ? [
          {
            ...input.currentLine,
            lineId: `${input.actId}_rw01`,
            type: 'actor_reaction' as const,
            speaker: '片场',
            text: `${input.currentLine.speaker}演员听到这个修改，先松了一口气，又马上重新找了一遍情绪。`,
            innerThought: null,
            mood: '重新接戏',
            riskSignal: input.currentLine.riskSignal,
          },
          {
            ...input.currentLine,
            lineId: `${input.actId}_rw02`,
            text: replacementText,
            innerThought: null,
            mood: '改词重拍',
          },
          {
            ...input.currentLine,
            lineId: `${input.actId}_rw03`,
            type: 'actor_reaction' as const,
            speaker: '老赵',
            text: '对，就按这个方向往下走，别解释，镜头接着滚。',
            innerThought: null,
            mood: '片场校准',
            riskSignal: 'medium' as const,
          },
        ]
      : [];
  const patchedRemainingLines =
    input.remainingLines.length > 0
      ? [
          ...rewriteReactionLines,
          ...mindsetCollisionLines,
          ...(input.currentBeat?.defaultSetReaction
            ? [
                (() => {
                  const reaction = renderStateReaction(input, input.currentBeat.defaultSetReaction || '');
                  return {
                    ...input.currentLine,
                    lineId: `${input.actId}_p00`,
                    sourceBeatId: input.currentBeat?.beatId,
                    type: 'actor_reaction' as const,
                    speaker: reaction.speaker,
                    text:
                      input.toolType === 'rewrite'
                        ? `改词后现场短暂停了一下。${reaction.text}`
                        : `${toolName}把现场节奏推歪了一点。${reaction.text}`,
                    innerThought: null,
                    mood: '临场改向',
                    riskSignal: input.currentLine.riskSignal,
                  };
                })(),
              ]
            : []),
          ...input.remainingLines.map((item, index) => ({
            ...item,
            lineId: `${input.actId}_p${String(index + 1).padStart(2, '0')}`,
            text:
              index === 0
                ? `${item.text} 但这次所有人都按刚才改过的拍法继续往下演。`
                : item.text,
          })),
        ]
      : [
          ...rewriteReactionLines,
          ...mindsetCollisionLines,
          ...(input.toolType === 'rewrite'
            ? []
            : [
                line(
                  input.actId,
                  90,
                  '镜头',
                  '这一幕被临场改了方向，但还没散，老赵在监视器后面轻轻说：能剪。',
                  'high',
                  'director'
                ),
              ]),
        ];

  const statDeltaMap: Record<typeof input.toolType, Stats> = {
    cut: zeroStats({ buzz: -2, dignity: -5, control: 10 }),
    rewrite: zeroStats({ buzz: 5, dignity: 3, control: 6 }),
    chicken: zeroStats({ budget: -15, buzz: 3, dignity: -2, control: 8 }),
    demo: zeroStats({ buzz: 15, dignity: -15, control: -4 }),
  };

  return {
    immediate: {
      visibleEffect: `${toolName}生效：${replacementText}`,
      replacementCurrentLine: {
        ...input.currentLine,
        lineId: `${input.currentLine.lineId}_patched`,
        type: input.toolType === 'rewrite' ? 'actor_reaction' : input.currentLine.type,
        speaker: input.toolType === 'rewrite' ? '你' : input.currentLine.speaker,
        text:
          input.toolType === 'rewrite'
            ? `停停停，刚刚那句改成：${replacementText}`
            : replacementText,
        innerThought: null,
        mood: '被改向',
      },
      patchedRemainingLines,
    },
    globalPatch: {
      patchId: `patch_${Date.now()}`,
      canonChange: `${input.actId} 的片场事实被「${toolName}」改向：${replacementText}`,
      futureDirectives: [
        `后续所有幕都要承认 ${input.actId} 已经被导演用「${toolName}」改过方向。`,
        '演员后续反应必须带着这次干预后的心理余波。',
      ],
      affectedFutureActs: ['act_04', 'act_06', 'act_08', 'act_09'],
    },
    statDelta: statDeltaMap[input.toolType],
    actorStateDelta: primaryActors.slice(0, 2).map((actor) => ({
      actorId: actor.actorId,
      mood: '被影响',
      pressureDelta: input.toolType === 'cut' || input.toolType === 'demo' ? 1 : 0,
      biasChange: `${actor.actorName}之后会按「${actor.mindset.toolSensitivity[input.toolType]}」继续理解这场戏。`,
    })),
    accidentTag: `${toolName}改向`,
    actOutcome: {
      summary: `${input.actId} 因「${toolName}」改变拍法，后续幕需要接住这个新事实。`,
      statDelta: statDeltaMap[input.toolType],
      memory: `${input.actId} 使用「${toolName}」后，本局路线发生变化：${replacementText}`,
    },
  };
}

export function mockReviseAct(input: ReviseActRequest): ReviseActResponse {
  const casting = input.actorStates.map((s) => ({
    scriptRoleId: s.scriptRoleId,
    scriptRoleName: s.scriptRoleName,
    actorId: s.actorId,
    actorName: s.actorName,
  }));
  const reactions = extractDefaultReactions([input.scriptSkeletonAct], casting);
  const [revisedAct] = assembleActDrafts([input.scriptSkeletonAct], reactions);
  return { revisedAct };
}

export function mockEpilogue(input: EpilogueRequest): EpilogueResponse {
  const interventionEntries = input.canonLedger.filter((entry) => entry.toolType && entry.toolType !== 'roll');
  const lastIntervention = interventionEntries.at(-1);
  const toolLabels = interventionEntries.map((entry) => {
    if (entry.toolType === 'cut') return '喊卡救场';
    if (entry.toolType === 'rewrite') return '临场改词';
    if (entry.toolType === 'chicken') return '加鸡腿安抚';
    if (entry.toolType === 'demo') return '导演示范';
    return '片场改向';
  });
  const uniqueToolLabels = Array.from(new Set(toolLabels));
  const accidentSummary = input.collectedAccidents.slice(0, 2).join('、') || uniqueToolLabels.slice(0, 2).join('、');
  const interventionSummary =
    uniqueToolLabels.length > 0
      ? `中途被你用${uniqueToolLabels.join('、')}改过方向，`
      : '';

  return {
    sampleTitle: uniqueToolLabels.includes('临场改词') ? '改词改出新名场面' : '顾家没稳住，片场先疯了',
    flavorTags: ['体面崩塌', ...(uniqueToolLabels.length > 0 ? uniqueToolLabels.slice(0, 2) : ['豪门集体发病']), '草台名场面'],
    description: `这条样片最后被拍成了${accidentSummary || '顾家公开发病'}的怪味版本。${interventionSummary}演员入组心态一路影响表演，顾家越想把沈知意拖回秩序，片场越像在拆这个秩序。`,
    highlight:
      lastIntervention?.canonChange ||
      lastIntervention?.memory ||
      input.canonLedger.at(-1)?.memory ||
      '最炸的是导演没有把所有事故修掉，反而让事故变成了这条样片的气质。',
    verdict: `最终爆相 ${input.finalStats.buzz}，体面 ${input.finalStats.dignity}。这不精致，但很像会被剪出来吵三天的短剧样片。`,
    shareText: uniqueToolLabels.includes('临场改词') ? '一句改词，把片场改疯了' : '顾家没稳住，片场先疯了',
  };
}
