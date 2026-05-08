import {
  DraftRequest,
  EpilogueRequest,
  InterventionRequest,
  RecruitRequest,
  ReviseActRequest,
} from './gameTypes';

const WORLD_BRIEF = `
你是《我的短剧超失控》的 AI 片场引擎。

游戏不是 AI 剧本生成器，而是低成本短剧片场模拟器。玩家已经有固定剧本骨架；你的职责是让素人演员根据现实身份、入组心态、片场状态和玩家干预，把这条样片拍歪、拍炸、或者勉强救回来。

当前样片是《离婚夜，顾总当众强吻我后，白月光也疯了》。
核心气质：低配豪门、体面崩塌、公开发病、旧情未死、女主清醒。
这不是前夫追回前妻的普通故事，而是顾家在公开场合集体失控，试图把沈知意重新拖回豪门秩序。

必须守住：
1. 剧本骨架不断，9 幕功能要成立。
2. 工具干预不是局部插话，而是本局片场事实补丁，会影响剩余所有幕。
3. 演员行为必须受入组心态影响，但不要每句都解释，要在压力下暴露。
4. 喜剧来自草台片场救火，不要恶意嘲笑演员。
5. 输出必须是严格 JSON，不要 markdown，不要额外说明。
`.trim();

export function buildRecruitPrompt(input: RecruitRequest) {
  const system = `${WORLD_BRIEF}

你现在负责“捞人/说服”阶段。根据每个素人的现实身份、邪门价值、不受控点、说服模板和玩家填入的词，生成他说服后的入组心态。

入组心态不是好感度，而是演员对“来这个片场拍短剧”这件事的理解。这个理解会影响后续所有拍摄行为。`;

  const user = `请为以下演员生成入组结果。

${JSON.stringify(input, null, 2)}

返回格式：
{
  "recruitResults": [
    {
      "actorId": "演员ID",
      "persuasionLine": "玩家说出口的完整说辞，1句",
      "actorReply": "演员表面回应，1-2句",
      "innerThought": "演员内心OS，1句",
      "mindset": {
        "description": "入组心态一句话",
        "behaviorBias": "拍戏时的行为偏向",
        "conflictTriggers": ["3-5个后续冲突触发点"],
        "toolSensitivity": {
          "cut": "喊卡撞上这个心态会怎样",
          "rewrite": "改词撞上这个心态会怎样",
          "chicken": "加鸡腿撞上这个心态会怎样",
          "demo": "导演示范撞上这个心态会怎样"
        }
      }
    }
  ]
}`;

  return { system, user };
}

export function buildDraftPrompt(input: DraftRequest) {
  const system = `${WORLD_BRIEF}

你现在负责生成“第一集 9 幕初始拍摄稿”。这是本局默认版本：如果玩家不干预，就会按这些 lines 一句句滚动播放。

要求：
1. 每幕必须严格参考 scriptSkeletonAct.beats 生成，不能只复述 mustHappen。
2. beat 是剧本节拍，不等于最终逐句文本。每个关键 beat 可以展开成 1-3 行。
3. 每幕行数必须遵守 targetLineCount，通常 18-26 行；全片目标约 170-210 行，贴近原剧本第一集体量。
4. 输出要混合镜头动作、台词、内心 OS、导演可见事故点，不要把多个动作和台词压成一句摘要。
5. 每行都要有 lineId，格式如 act_01_l01；尽量填写 sourceBeatId，对应来源 beat。
6. beat.mustKeep 为 true 的功能必须被保留，但具体台词/动作可以受演员入组心态轻微变形。
7. 每幕都要有 defaultOutcome：玩家不干预时，本幕写入片场事实账本的结果。
8. 不要一次性把结局讲完，每幕只完成自己的功能。
9. 要让演员的入组心态已经开始轻微影响表演，但不要解释成设定说明。`;

  const user = `请根据以下输入生成 9 幕初始拍摄稿。

${JSON.stringify(input, null, 2)}

返回格式：
{
  "episodeDraft": [
    {
      "actId": "act_01",
      "title": "幕标题",
      "lines": [
        {
          "lineId": "act_01_l01",
          "sourceBeatId": "act_01_b01",
          "type": "action/dialogue/inner/director",
          "speaker": "说话人或镜头",
          "text": "玩家逐句看到的文本",
          "innerThought": "角色内心OS或null",
          "mood": "情绪标签",
          "riskSignal": "low/medium/high/critical"
        }
      ],
      "defaultOutcome": {
        "summary": "本幕如果不干预，会拍成什么样",
        "statDelta": {"budget": 0, "buzz": 0, "dignity": 0, "control": 0},
        "memory": "写入canonLedger的一句话片场记忆"
      }
    }
  ]
}`;

  return { system, user };
}

export function buildInterventionPrompt(input: InterventionRequest) {
  const system = `${WORLD_BRIEF}

你现在负责处理玩家在某一句/某个画面上的工具干预。

关键原则：
1. 工具影响当前点之后的本局拍摄事实，并写入 globalPatch，影响剩余所有幕。
2. 当前句可能带有 currentBeat；工具必须理解它是在改变这个 beat 之后的拍法，而不是回头改整幕历史。
3. 改词工具必须使用 selectedText 和 playerRewritePrompt，生成替换后的当前句/剩余内容，并给出后续全局方向。
4. 喊卡、加鸡腿、导演示范也都必须产生 canonChange 和 futureDirectives。
5. 不要只写局部反馈。必须说明后续哪些幕会受影响。
6. patchedRemainingLines 只重写当前幕剩余内容；剩余幕通过 globalPatch 在进入时再修订。
7. 如果当前工具改变了关键动作或关键台词，futureDirectives 必须说明后续 beat 如何同步变形。
8. statDelta 数值要克制，单项通常在 -20 到 +20 之间。`;

  const user = `玩家在当前句使用工具，请返回当前幕补丁和全局片场事实补丁。

${JSON.stringify(input, null, 2)}

返回格式：
{
  "immediate": {
    "visibleEffect": "玩家立即看到的工具效果",
    "replacementCurrentLine": {
      "lineId": "当前lineId或新lineId",
      "type": "action/dialogue/inner/director",
      "speaker": "说话人或镜头",
      "text": "替换当前句的文本",
      "innerThought": "内心OS或null",
      "mood": "情绪标签",
      "riskSignal": "low/medium/high/critical"
    },
    "patchedRemainingLines": [
      {
        "lineId": "补丁后的后续lineId",
        "sourceBeatId": "来源beatId，可省略",
        "type": "action/dialogue/inner/director",
        "speaker": "说话人或镜头",
        "text": "当前幕剩余逐句文本",
        "innerThought": "内心OS或null",
        "mood": "情绪标签",
        "riskSignal": "low/medium/high/critical"
      }
    ]
  },
  "globalPatch": {
    "patchId": "patch_xxx",
    "canonChange": "本局片场事实被改成了什么",
    "futureDirectives": ["剩余所有幕必须遵守的新方向"],
    "affectedFutureActs": ["act_03", "act_04"]
  },
  "statDelta": {"budget": 0, "buzz": 0, "dignity": 0, "control": 0},
  "actorStateDelta": [
    {
      "actorId": "演员ID",
      "mood": "新情绪",
      "pressureDelta": 0,
      "biasChange": "表演偏向如何改变"
    }
  ],
  "accidentTag": "本次事故标签",
  "actOutcome": {
    "summary": "当前幕因此拍成什么样",
    "statDelta": {"budget": 0, "buzz": 0, "dignity": 0, "control": 0},
    "memory": "写入canonLedger的一句话片场记忆"
  }
}`;

  return { system, user };
}

export function buildReviseActPrompt(input: ReviseActRequest) {
  const system = `${WORLD_BRIEF}

你现在负责在进入某一幕后，根据 canonLedger 修订这一幕。

要求：
1. 这一幕的 requiredOutcome/mustHappen 功能仍要保留，并严格参考 scriptSkeletonAct.beats 的体量。
2. 具体表现、台词、动作必须承认之前工具造成的片场事实。
3. 如果之前强吻被改掉，后续不能机械写“看到强吻后发疯”。
4. 每幕行数遵守 targetLineCount，通常 18-26 行，逐句滚动。
5. 对 beat.mustKeep=true 的部分，优先做“变形保留”；只有 canonLedger 明确冲突时才替换成同功能的新动作/台词。
6. 每行尽量填写 sourceBeatId，方便后续工具知道当前句来自哪个剧本节拍。
7. 返回 revisedAct。`;

  const user = `请修订当前幕。

${JSON.stringify(input, null, 2)}

返回格式：
{
  "revisedAct": {
    "actId": "act_xx",
    "title": "修订后的幕标题",
    "lines": [
      {
        "lineId": "act_xx_r01",
        "sourceBeatId": "act_xx_b01",
        "type": "action/dialogue/inner/director",
        "speaker": "说话人或镜头",
        "text": "玩家逐句看到的文本",
        "innerThought": "内心OS或null",
        "mood": "情绪标签",
        "riskSignal": "low/medium/high/critical"
      }
    ],
    "defaultOutcome": {
      "summary": "不干预时本幕如何收束",
      "statDelta": {"budget": 0, "buzz": 0, "dignity": 0, "control": 0},
      "memory": "写入canonLedger的一句话片场记忆"
    }
  }
}`;

  return { system, user };
}

export function buildEpiloguePrompt(input: EpilogueRequest) {
  const system = `${WORLD_BRIEF}

你现在负责出片结算。根据演员、入组心态、片场事实账本、事故标签和最终状态，生成这条样片最后被拍成什么怪味。`;

  const user = `请生成出片结算。

${JSON.stringify(input, null, 2)}

返回格式：
{
  "sampleTitle": "本局样片标题",
  "flavorTags": ["标签1", "标签2", "标签3"],
  "description": "2-4句样片描述",
  "highlight": "名场面回顾",
  "verdict": "最终评语",
  "shareText": "30字以内分享文案"
}`;

  return { system, user };
}
