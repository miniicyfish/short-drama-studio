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
  ScriptBeat,
  ShootLine,
  Stats,
} from './gameTypes';

function zeroStats(delta?: Partial<Stats>): Stats {
  return {
    budget: delta?.budget ?? 0,
    buzz: delta?.buzz ?? 0,
    dignity: delta?.dignity ?? 0,
    control: delta?.control ?? 0,
  };
}

export function mockRecruit(input: RecruitRequest): { recruitResults: RecruitResult[] } {
  return {
    recruitResults: input.selectedActors.map((actor) => {
      const persuasionLine = actor.persuasionTemplate.replace('____', actor.playerWord);
      const actorReply = `${actor.name}停了一下，说：“行，我试试。但你别到时候又说我理解错了。”`;
      return {
        actorId: actor.id,
        persuasionLine,
        actorReply,
        visibleConversation: [
          { speaker: '玩家', text: persuasionLine },
          { speaker: '演员', text: actorReply },
          {
            speaker: '老赵',
            text: `老赵把人往门口一送，小声说：“看着是答应了，至于他心里怎么听的，等开机就知道。”`,
          },
        ],
        accepted: true,
        visibleHint: '你不知道他真正怎么理解了这句话，但这种理解会写进后面的片场反应。',
        innerThought: `他/她开始把这次短剧理解成一次关于“${actor.playerWord}”的机会。`,
        mindset: {
          description: `我来这里，是因为他们看见了我身上“${actor.playerWord}”的东西。`,
          behaviorBias: `${actor.lossDirection}压力越大，这个偏向越明显。`,
          conflictTriggers: [
            actor.uncontrolledPoint,
            '被频繁打断',
            '被别人当成笑话',
            `别人否定“${actor.playerWord}”这件事`,
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

function line(
  actId: string,
  index: number,
  speaker: string,
  text: string,
  riskSignal: ShootLine['riskSignal'] = 'medium',
  type: ShootLine['type'] = 'dialogue',
  sourceBeatId?: string,
  innerThought?: string | null
): ShootLine {
  return {
    lineId: `${actId}_l${String(index).padStart(2, '0')}`,
    sourceBeatId,
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

function beatRisk(beat: ScriptBeat): ShootLine['riskSignal'] {
  if (beat.riskTag.includes('必炸') || beat.riskTag.includes('最炸')) return 'critical';
  if (beat.riskTag.includes('越线') || beat.riskTag.includes('说不出口') || beat.riskTag.includes('长台词')) {
    return 'high';
  }
  if (beat.mustKeep) return 'medium';
  return 'low';
}

function beatType(beat: ScriptBeat): ShootLine['type'] {
  if (beat.beatType === 'dialogue' || beat.beatType === 'turning_point') return 'dialogue';
  if (beat.beatType === 'inner') return 'inner';
  if (beat.beatType === 'shot' || beat.beatType === 'action') return 'action';
  return 'director';
}

export function mockDraft(input: DraftRequest): { episodeDraft: ActDraft[] } {
  return {
    episodeDraft: input.scriptSkeleton.map((act, actIndex) => {
      const actNo = actIndex + 1;
      const lines: ShootLine[] = [];
      const addLine = (
        speaker: string,
        text: string,
        risk: ShootLine['riskSignal'],
        type: ShootLine['type'],
        sourceBeatId?: string,
        innerThought?: string | null
      ) => {
        if (lines.length >= act.targetLineCount.max) return;
        lines.push(line(act.actId, lines.length + 1, speaker, text, risk, type, sourceBeatId, innerThought));
      };

      act.beats.forEach((beat) => {
        const risk = beatRisk(beat);
        if (beat.actionCue) {
          addLine('镜头', beat.actionCue, risk, 'action', beat.beatId, null);
        }
        addLine(beat.speaker || '镜头', beat.referenceText, risk, beatType(beat), beat.beatId, beat.innerCue || null);
        if (beat.innerCue && beat.beatType !== 'inner') {
          addLine(beat.speaker || '镜头', beat.innerCue, risk, 'inner', beat.beatId, null);
        }
      });

      addLine('导演', `这一幕的片场雷点是：${act.bombPoint}`, 'critical', 'director');

      while (lines.length < act.targetLineCount.min) {
        addLine(
          '镜头',
          `镜头没有急着切走，继续压住${act.title}里的别扭空气，让演员把这场难堪多撑一秒。`,
          'medium',
          'action'
        );
      }

      return {
        actId: act.actId,
        title: act.title,
        lines,
        defaultOutcome: {
          summary: `第${actNo}幕无人干预，${act.requiredOutcome}`,
          statDelta: zeroStats({ buzz: 6 + actNo, dignity: -4, control: -3 }),
          memory: `${act.title}按默认失控路线拍完：${act.requiredOutcome}`,
        },
      };
    }),
  };
}

export function mockIntervention(input: InterventionRequest): InterventionResponse {
  const toolName = {
    cut: '喊卡',
    rewrite: '改词',
    chicken: '加鸡腿',
    demo: '导演示范',
  }[input.toolType];
  const replacementText =
    input.toolType === 'rewrite' && input.selectedText
      ? `导演把「${input.selectedText}」改成了更贴近“${input.playerRewritePrompt || '能继续拍'}”的版本。`
      : `导演使用「${toolName}」截住了当前失控点。`;
  const patchedRemainingLines =
    input.remainingLines.length > 0
      ? input.remainingLines.map((item, index) => ({
          ...item,
          lineId: `${input.actId}_p${String(index + 1).padStart(2, '0')}`,
          text:
            index === 0
              ? `${item.text} 但这次所有人都带着刚才干预后的别扭感继续往下演。`
              : item.text,
        }))
      : [
          line(
            input.actId,
            90,
            '镜头',
            '这一幕被临场改了方向，但还没散，老赵在监视器后面轻轻说：能剪。',
            'high',
            'director'
          ),
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
        text: replacementText,
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
    actorStateDelta: input.actorStates.slice(0, 1).map((actor) => ({
      actorId: actor.actorId,
      mood: '被影响',
      pressureDelta: input.toolType === 'cut' || input.toolType === 'demo' ? 1 : 0,
      biasChange: `${actor.actorName}之后会把这次${toolName}理解进自己的表演里。`,
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
  const directive = input.canonLedger
    .flatMap((entry) => entry.futureDirectives || [])
    .slice(-2)
    .join('；');
  return {
    revisedAct: {
      ...input.originalActDraft,
      title: `${input.originalActDraft.title}（受前场影响）`,
      lines: input.originalActDraft.lines.map((item, index) => ({
        ...item,
        lineId: `${input.actId}_r${String(index + 1).padStart(2, '0')}`,
        text:
          index === 0 && directive
            ? `${item.text} 前面留下的片场事实正在改写这一幕：${directive}`
            : item.text,
      })),
      defaultOutcome: {
        ...input.originalActDraft.defaultOutcome,
        memory: `${input.originalActDraft.title}承接前文补丁继续拍完。`,
      },
    },
  };
}

export function mockEpilogue(input: EpilogueRequest): EpilogueResponse {
  return {
    sampleTitle: '顾家没稳住，片场先疯了',
    flavorTags: ['体面崩塌', '豪门集体发病', '草台名场面'],
    description: `这条样片最后被拍成了${input.collectedAccidents.slice(0, 2).join('、') || '顾家公开发病'}的怪味版本。演员入组心态一路影响表演，顾家越想把沈知意拖回秩序，片场越像在拆这个秩序。`,
    highlight:
      input.canonLedger.at(-1)?.memory || '最炸的是导演没有把所有事故修掉，反而让事故变成了这条样片的气质。',
    verdict: `最终爆相 ${input.finalStats.buzz}，体面 ${input.finalStats.dignity}。这不精致，但很像会被剪出来吵三天的短剧样片。`,
    shareText: '顾家没稳住，片场先疯了',
  };
}
