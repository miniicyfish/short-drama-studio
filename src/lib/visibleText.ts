import { ActDraft, InterventionResponse, ShootLine } from './gameTypes';

const INTERNAL_PATTERNS = [
  /雷点/,
  /炸点/,
  /导演可见/,
  /事故点/,
  /本幕最大/,
  /AI\s*可根据/,
  /如果前文/,
  /如果前一幕/,
  /如果你前文/,
  /同步变形/,
  /同步改写/,
  /机械保留/,
  /工具改写/,
  /canonLedger/,
  /必须根据/,
  /必须保留.*功能/,
  /本局事故/,
  /futureDirectives/,
  /globalPatch/,
  /碰撞入口/,
  /正常反应点/,
  /<actor\b/,
  /<\/actor>/,
];

function isInternalLine(line: ShootLine) {
  if (line.type === 'director' || line.speaker === '导演') return true;
  return INTERNAL_PATTERNS.some((pattern) => pattern.test(line.text));
}

export function sanitizeVisibleActDrafts(acts: ActDraft[]) {
  return acts.map((act) => ({
    ...act,
    lines: act.lines.filter((line) => !isInternalLine(line)),
  }));
}

export function sanitizeVisibleLines(lines: ShootLine[]) {
  return lines.filter((line) => !isInternalLine(line));
}

export function sanitizeVisibleIntervention(
  response: InterventionResponse,
  fallbackCurrentLine?: ShootLine
) {
  const replacementCurrentLine = isInternalLine(response.immediate.replacementCurrentLine)
    ? fallbackCurrentLine || response.immediate.replacementCurrentLine
    : response.immediate.replacementCurrentLine;

  return {
    ...response,
    immediate: {
      ...response.immediate,
      replacementCurrentLine,
      patchedRemainingLines: sanitizeVisibleLines(response.immediate.patchedRemainingLines),
    },
  };
}
