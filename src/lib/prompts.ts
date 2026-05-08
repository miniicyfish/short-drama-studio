import {
  DraftRequest,
  EpilogueRequest,
  InterventionRequest,
  RecruitRequest,
  ReviseActRequest,
} from './gameTypes';

const WORLD_BRIEF = `
你是《我的短剧超失控》的 AI 片场引擎。

游戏不是 AI 剧本生成器，而是低成本短剧片场模拟器。你已经有固定剧本骨架；你的职责是让素人演员根据现实身份、入组心态、片场状态和你的干预，把这条样片拍歪、拍炸、或者勉强救回来。

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

你现在负责“捞人/说服”阶段。根据每个素人的现实身份、邪门价值、不受控点、被分配到的 assignedRole、说服模板和你填入的词，生成你可见的说服对话，以及你不可见的入组心态。

入组心态不是好感度，而是演员对“来这个片场拍短剧”这件事的理解。这个理解会影响后续所有拍摄行为。

注意：
1. visibleConversation 是你看得到的表面说服过程，必须根据演员身份、assignedRole、说服模板和填入的词实时生成，不要套用固定流程。
2. innerThought 和 mindset 是隐藏信息，不能在 visibleConversation 里明说。
3. 老赵可以做一句草台旁白，但不要替你解释系统规则。
4. visibleConversation 的 speaker 使用“你”“演员”“老赵”，不要使用“玩家”。
5. visibleConversation 写 4-6 句，像真实说服过程：你先说完整说辞，演员质疑或接话，你再顺着填入的词补一句，演员表面答应，老赵补一句片场现实。
6. text 只写角色真正说出口的话，不要写“某某说：”、不要外包中文引号、不要写旁白动作。
7. 如果演员被分到的不是顾沉舟，不要让他说“演顾总/霸总”之类不匹配的话；比如分到周特助/顾家长辈，就围绕助理、长辈、下跪、拱火、顾家秩序来聊。`;

  const user = `请为以下演员生成入组结果。

${JSON.stringify(input, null, 2)}

返回格式：
{
  "recruitResults": [
    {
      "actorId": "演员ID",
      "persuasionLine": "你说出口的完整说辞，1句",
      "actorReply": "演员表面回应，1-2句",
      "visibleConversation": [
        {"speaker": "你", "text": "你说出口的完整说辞，不带引号"},
        {"speaker": "演员", "text": "演员基于自身经历提出一句质疑或误解，不带引号"},
        {"speaker": "你", "text": "你顺着填入的词补一句说服，不带引号"},
        {"speaker": "演员", "text": "演员表面答应，但保留一点个人理解，不带引号"},
        {"speaker": "老赵", "text": "老赵从草台片场角度补一句，不带引号"}
      ],
      "accepted": true,
      "visibleHint": "给你看的提示：你不知道他真正怎么理解了这句话，但会影响后续拍摄。",
      "innerThought": "演员真实内心OS，隐藏，不给你直接展示",
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

你现在负责生成“第一集 9 幕初始拍摄稿”。这是本局默认版本：如果你不干预，就会按这些 lines 一句句滚动播放。

要求：
1. 每幕必须严格参考 scriptSkeletonAct.beats 生成，不能只复述 mustHappen。
2. beat 是剧本节拍，不等于最终逐句文本。每个关键 beat 可以展开成 1-3 行。
3. 每幕行数必须遵守 targetLineCount，通常 18-26 行；全片目标约 170-210 行，贴近原剧本第一集体量。
4. 输出要混合镜头动作、台词、内心 OS，不要把多个动作和台词压成一句摘要；内部事故判断只能放在 type=director，不能伪装成镜头或台词。
4a. 玩家可见 lines 里禁止出现“雷点”“炸点”“导演可见”“事故点”“AI 可根据”“本幕最大”“如果前文”“同步变形”“机械保留”“工具改写”“canonLedger”“必须保留功能”等内部设计/编排标注。
5. 每行都要有 lineId，格式如 act_01_l01；尽量填写 sourceBeatId，对应来源 beat。
6. beat.mustKeep 为 true 的功能必须被保留，但具体台词/动作可以受演员入组心态轻微变形。
7. 每幕都要有 defaultOutcome：你不干预时，本幕写入片场事实账本的结果。
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
          "text": "你逐句看到的文本",
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

你现在负责处理“你”在某一句/某个画面上的工具干预。

关键原则：
1. 工具影响当前点之后的本局拍摄事实，并写入 globalPatch，影响剩余所有幕。
2. 当前句可能带有 currentBeat；工具必须理解它是在改变这个 beat 之后的拍法，而不是回头改整幕历史。
3. 改词工具必须使用 selectedText 和 playerRewritePrompt，生成替换后的当前句/剩余内容，并给出后续全局方向。
4. 喊卡、加鸡腿、导演示范也都必须产生 canonChange 和 futureDirectives。
5. 不要只写局部反馈。必须说明后续哪些幕会受影响。
6. patchedRemainingLines 只重写当前幕剩余内容；剩余幕通过 globalPatch 在进入时再修订。
7. 如果当前工具改变了关键动作或关键台词，futureDirectives 必须说明后续 beat 如何同步变形。
8. replacementCurrentLine 和 patchedRemainingLines 是玩家可见文本，禁止出现“雷点”“炸点”“如果前文”“同步变形”“机械保留”“工具改写”“canonLedger”等幕后编排说明。
9. statDelta 数值要克制，单项通常在 -20 到 +20 之间。`;

  const user = `你在当前句使用工具，请返回当前幕补丁和全局片场事实补丁。

${JSON.stringify(input, null, 2)}

返回格式：
{
  "immediate": {
    "visibleEffect": "你立即看到的工具效果",
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
        "text": "你逐句看到的文本",
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
