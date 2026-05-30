import { ActDraft, InterventionResponse, ShootLine } from './gameTypes';

const MAX_VISIBLE_LINE_CHARS = 46;

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
    .flatMap(splitDenseSentence)
    .filter((item) => item && !/^[“”"'‘’。！？!?，,、；;：:]+$/.test(item));
}

function splitDenseSentence(text: string): string[] {
  if (text.length <= MAX_VISIBLE_LINE_CHARS) return [text];

  const chunks = text.match(/[^，,、；;：:]+[，,、；;：:]*|[^，,、；;：:]+$/g) || [text];
  const lines: string[] = [];
  let current = '';

  for (const rawChunk of chunks) {
    const chunk = rawChunk.trim();
    if (!chunk) continue;

    if (!current) {
      current = chunk;
      continue;
    }

    if ((current + chunk).length <= MAX_VISIBLE_LINE_CHARS) {
      current += chunk;
    } else {
      lines.push(current);
      current = chunk;
    }
  }

  if (current) lines.push(current);

  return lines.flatMap((line) => {
    if (line.length <= MAX_VISIBLE_LINE_CHARS) return [line];
    const hardChunks: string[] = [];
    for (let index = 0; index < line.length; index += MAX_VISIBLE_LINE_CHARS) {
      hardChunks.push(line.slice(index, index + MAX_VISIBLE_LINE_CHARS));
    }
    return hardChunks;
  });
}

function splitVisibleLine(line: ShootLine): ShootLine[] {
  const sentences = splitDisplaySentences(line.text);
  if (sentences.length === 0) return [];
  if (sentences.length <= 1) return [{ ...line, text: sentences[0] || line.text }];
  return sentences.map((sentence, index) => ({
    ...line,
    lineId: index === 0 ? line.lineId : `${line.lineId}_s${index + 1}`,
    text: sentence,
    innerThought: index === 0 ? line.innerThought : null,
  }));
}

export function sanitizeVisibleActDrafts(acts: ActDraft[]) {
  return acts.map((act) => ({
    ...act,
    lines: act.lines.filter((line) => !isInternalLine(line)).flatMap(splitVisibleLine),
  }));
}

export function sanitizeVisibleLines(lines: ShootLine[]) {
  return lines.filter((line) => !isInternalLine(line)).flatMap(splitVisibleLine);
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
