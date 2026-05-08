import { ActDraft, ShootLine } from './gameTypes';

const INTERNAL_PATTERNS = [
  /雷点/g,
  /炸点/g,
  /导演可见/g,
  /事故点/g,
  /本幕最大/g,
  /AI\s*可根据/g,
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
