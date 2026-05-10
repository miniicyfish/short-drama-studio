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

你现在负责"捞人/说服"阶段。根据每个素人的现实身份、邪门价值、不受控点、被分配到的 assignedRole、说服模板和你填入的词，生成你可见的说服对话，以及你不可见的入组心态。

入组心态不是好感度，而是演员对"来这个片场拍短剧"这件事的理解。这个理解会影响后续所有拍摄行为。

注意：
1. visibleConversation 是你看得到的表面说服过程，必须根据演员身份、assignedRole、说服模板和填入的词实时生成，不要套用固定流程。
2. innerThought 和 mindset 是隐藏信息，不能在 visibleConversation 里明说。
3. 老赵可以做一句草台旁白，但不要替你解释系统规则。
4. visibleConversation 的 speaker 使用"你""演员""老赵"，不要使用"玩家"。
5. visibleConversation 写 4-6 句，像真实说服过程：你先说完整说辞，演员质疑或接话，你再顺着填入的词补一句，演员表面答应，老赵补一句片场现实。
6. text 只写角色真正说出口的话，不要写"某某说："、不要外包中文引号、不要写旁白动作。
7. 如果演员被分到的不是顾沉舟，不要让他说"演顾总/霸总"之类不匹配的话；比如分到周特助/顾家长辈，就围绕助理、长辈、下跪、拱火、顾家秩序来聊。`;

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
  const taggedBeats = input.scriptSkeleton.flatMap((act) =>
    act.beats
      .filter((beat) => beat.defaultSetReaction?.includes('<actor'))
      .map((beat) => ({
        beatId: beat.beatId,
        actId: act.actId,
        actTitle: act.title,
        referenceText: beat.referenceText,
        defaultSetReaction: beat.defaultSetReaction,
        actorRewriteTargets: beat.actorRewriteTargets,
        setPressure: beat.setPressure,
        riskTag: beat.riskTag,
      }))
  );

  const actorContext = input.casting.map((cast) => {
    const actor = input.selectedActors.find((a) => a.id === cast.actorId);
    const recruit = input.recruitResults.find((r) => r.actorId === cast.actorId);
    return {
      actorName: cast.actorName,
      scriptRole: cast.scriptRoleName,
      realIdentity: actor?.realIdentity,
      weirdValue: actor?.weirdValue,
      uncontrolledPoint: actor?.uncontrolledPoint,
      mindset: recruit?.mindset,
    };
  });

  const system = `${WORLD_BRIEF}

你现在负责"开拍前个性化"阶段。

我们有三层叙事结构：
- Layer 1（剧中剧台词）：预写好的剧本台词，已固定，你不需要碰。
- Layer 2（通用演员反应）：用 <actor role="角色名">演员标记</actor> XML tag 标记的通用反应——任何正常人面对这种雷剧情都会有的反应。
- Layer 3（个性化改写）：你的工作。根据每个真实演员的入组心态、真实身份和性格特征，对 XML tag 包裹的通用反应进行个性化改写。

规则：
1. 你只改写 <actor> tag 标记的通用演员反应。不要碰剧本台词（referenceText）。
2. 改写自由度非常高：
   - 可以润色扩写，让反应更贴合这个特定演员的身份和心态
   - 可以改成一个片场小情境（比如演员和老赵之间的互动）
   - 可以判断"这个演员根本不会有这个反应"而直接返回空数组
   - 可以加入老赵的片场指挥
3. 语言风格必须保持整体调性：尴尬、搞笑、博眼球、炸裂，跟入组阶段敲定的文字风格一致。
4. 每个 tag 改写后输出 1-3 条反应行。speaker 填真实演员姓名（不是角色名）。
5. 结合 actorRewriteTargets 的 focus 指引，但你的创意判断优先。
6. 如果通用反应涉及多个演员（多个 <actor> tag），为每个相关演员分别生成反应。
7. 不要输出任何内部标注（雷点、炸点、AI 指令、canonLedger 等）。
8. text 只写现场发生的事，不要写"演员心想"、不要解释入组心态。`;

  const user = `请为以下 ${taggedBeats.length} 个标记点生成个性化演员反应。

演员信息：
${JSON.stringify(actorContext, null, 2)}

标记点列表：
${JSON.stringify(taggedBeats, null, 2)}

返回格式：
{
  "reactions": {
    "beat_id": [
      {
        "speaker": "真实演员姓名",
        "text": "个性化后的片场反应文本",
        "mood": "情绪标签"
      }
    ]
  }
}`;

  return { system, user };
}

export function buildInterventionPrompt(input: InterventionRequest) {
  const system = `${WORLD_BRIEF}

你现在负责处理"你"在某一句/某个画面上的工具干预。

关键原则：
1. 工具影响当前点之后的本局拍摄事实，并写入 globalPatch，影响剩余所有幕。
2. 当前句可能带有 currentBeat；工具必须理解它是在改变这个 beat 之后的拍法，而不是回头改整幕历史。currentBeat.referenceText 是剧中内容，currentBeat.defaultSetReaction 是演员现场反应母版。
3. 改词工具必须使用 selectedText 和 playerRewritePrompt，生成一段玩家可见的片场重拍过程，而不是静默替换。
3a. 改词工具的 replacementCurrentLine 必须是 type="actor_reaction"、speaker="你"，text 写成你喊停并宣布新词，例如：停停停，刚刚那句改成：xxxxx。
3b. 改词工具的 patchedRemainingLines 开头必须依次包含：演员/片场听到改词后的反应、原说话人重新说出改词后版本、老赵对新方向的短反馈，然后再接当前幕剩余内容。
4. 喊卡、加鸡腿、导演示范也都必须产生 canonChange 和 futureDirectives。
5. 不要只写局部反馈。必须说明后续哪些幕会受影响。
6. patchedRemainingLines 只重写当前幕剩余内容；剩余幕通过 globalPatch 在进入时再修订。
7. 如果当前工具改变了关键动作或关键台词，futureDirectives 必须说明后续 beat 如何同步变形。
8. replacementCurrentLine 和 patchedRemainingLines 是玩家可见文本，禁止出现"雷点""炸点""如果前文""同步变形""机械保留""工具改写""canonLedger"等幕后编排说明。
9. 如果工具影响了带 XML actor 标签的反应点，要把真实演员姓名、现实身份和入组心态写进后续 actor_reaction 行里；不要只写角色剧情改变。
10. 工具结果不要只替换当前一句。replacementCurrentLine 可以改当前可见结果，但 patchedRemainingLines 必须自然展开成一小段新的片场过程：导演动作、演员重新理解、同场演员接不住或接住、剧中剧情继续滑向新方向。
11. statDelta 数值要克制，单项通常在 -20 到 +20 之间。`;

  const user = `你在当前句使用工具，请返回当前幕补丁和全局片场事实补丁。

${JSON.stringify(input, null, 2)}

返回格式：
{
  "immediate": {
    "visibleEffect": "你立即看到的工具效果",
    "replacementCurrentLine": {
      "lineId": "当前lineId或新lineId",
      "type": "action/dialogue/inner/actor_reaction/director",
      "speaker": "说话人、镜头、或真实演员姓名",
      "text": "替换当前句的文本",
      "innerThought": "内心OS或null",
      "mood": "情绪标签",
      "riskSignal": "low/medium/high/critical"
    },
    "patchedRemainingLines": [
      {
        "lineId": "补丁后的后续lineId",
        "sourceBeatId": "来源beatId，可省略",
        "type": "action/dialogue/inner/actor_reaction/director",
        "speaker": "说话人、镜头、或真实演员姓名",
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
  const taggedBeats = input.scriptSkeletonAct.beats
    .filter((beat) => beat.defaultSetReaction?.includes('<actor'))
    .map((beat) => ({
      beatId: beat.beatId,
      referenceText: beat.referenceText,
      defaultSetReaction: beat.defaultSetReaction,
      actorRewriteTargets: beat.actorRewriteTargets,
      setPressure: beat.setPressure,
      riskTag: beat.riskTag,
    }));

  const system = `${WORLD_BRIEF}

你现在负责在进入某一幕时，根据 canonLedger（片场事实账本）重新个性化该幕的演员反应。

之前发生的工具干预改变了片场事实，因此这一幕里 <actor> tag 标记的通用演员反应需要重新改写，以反映：
1. canonLedger 里的片场事实变化（例如强吻被改成了语言压迫，后续反应不能再提"看到强吻"）。
2. futureDirectives 里的新方向要求。
3. 演员当前的 mood 和 pressure 状态。

规则：
1. 只改写 <actor> tag 标记的内容。剧本台词（referenceText）不变。
2. 改写规则和开拍前个性化相同：自由度高，可扩写、改情境、删掉。
3. 语言风格保持一致：尴尬、搞笑、博眼球、炸裂。
4. 每个 tag 输出 1-3 条反应行，speaker 填真实演员姓名。
5. 不要输出内部标注。`;

  const user = `请根据片场事实重新个性化以下幕的演员反应。

幕信息：${input.actId} - ${input.scriptSkeletonAct.title}

canonLedger（片场已发生的事实）：
${JSON.stringify(input.canonLedger, null, 2)}

演员当前状态：
${JSON.stringify(input.actorStates, null, 2)}

需要重新个性化的标记点：
${JSON.stringify(taggedBeats, null, 2)}

返回格式：
{
  "reactions": {
    "beat_id": [
      {
        "speaker": "真实演员姓名",
        "text": "重新个性化后的片场反应文本",
        "mood": "情绪标签"
      }
    ]
  }
}`;

  return { system, user };
}

export function buildEpiloguePrompt(input: EpilogueRequest) {
  const system = `${WORLD_BRIEF}

你现在负责出片结算。根据演员、入组心态、片场事实账本、事故标签和最终状态，生成这条样片最后被拍成什么怪味。

要求：
1. 必须读取 canonLedger 里的真实工具干预（toolType 不为空且不是 roll），总结玩家到底改过什么。
2. 如果玩家使用过改词（toolType="rewrite"），highlight 必须点名这次改词造成的片场事实变化，不能只写泛泛的豪门发疯。
3. flavorTags 里至少保留 1 个工具相关标签，例如"临场改词"、"喊卡救场"、"导演示范翻车"。
4. description 要说明这条样片是如何被玩家干预带偏的；如果没有工具干预，才写成纯默认拍摄路线。
5. 不要输出系统字段名、canonLedger、toolType 等幕后字段。`;

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
