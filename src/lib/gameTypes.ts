export type ToolType = 'cut' | 'rewrite' | 'chicken' | 'demo';

export interface Project {
  id: string;
  title: string;
  logline: string;
  tone: string;
  cover: string;
}

export interface Actor {
  id: string;
  name: string;
  label: string;
  realIdentity: string;
  hook: string;
  weirdValue: string;
  uncontrolledPoint: string;
  suitableRoles: string[];
  lossDirection: string;
  avatar: string;
  persuasionTemplate: string;
  defaultWord: string;
}

export interface ScriptRole {
  id: string;
  name: string;
  function: string;
}

export interface Casting {
  scriptRoleId: string;
  scriptRoleName: string;
  actorId: string;
  actorName: string;
}

export interface Mindset {
  description: string;
  behaviorBias: string;
  conflictTriggers: string[];
  toolSensitivity: Record<ToolType, string>;
}

export interface RecruitResult {
  actorId: string;
  persuasionLine: string;
  actorReply: string;
  innerThought: string;
  mindset: Mindset;
}

export interface Stats {
  budget: number;
  buzz: number;
  dignity: number;
  control: number;
}

export type ScriptBeatType = 'shot' | 'dialogue' | 'action' | 'inner' | 'turning_point';

export interface ScriptBeat {
  beatId: string;
  beatType: ScriptBeatType;
  speaker?: string;
  referenceText: string;
  actionCue?: string;
  innerCue?: string;
  riskTag: string;
  mustKeep: boolean;
}

export interface ScriptSkeletonAct {
  actId: string;
  title: string;
  scene: string;
  mustHappen: string;
  bombPoint: string;
  requiredOutcome: string;
  targetLineCount: {
    min: number;
    max: number;
  };
  beats: ScriptBeat[];
}

export interface ShootLine {
  lineId: string;
  sourceBeatId?: string;
  type: 'action' | 'dialogue' | 'inner' | 'director';
  speaker: string;
  text: string;
  innerThought: string | null;
  mood: string;
  riskSignal: 'low' | 'medium' | 'high' | 'critical';
}

export interface ActOutcome {
  summary: string;
  statDelta: Stats;
  memory: string;
}

export interface ActDraft {
  actId: string;
  title: string;
  lines: ShootLine[];
  defaultOutcome: ActOutcome;
}

export interface CanonEntry {
  patchId?: string;
  actId?: string;
  lineId?: string;
  toolType?: ToolType | 'roll';
  memory: string;
  canonChange?: string;
  futureDirectives?: string[];
  affectedFutureActs?: string[];
}

export interface ActorState {
  actorId: string;
  actorName: string;
  scriptRoleId: string;
  scriptRoleName: string;
  mindset: Mindset;
  mood: string;
  pressure: number;
  bias: string;
}

export interface ToolDefinition {
  id: ToolType;
  name: string;
  icon: string;
  description: string;
}

export interface RecruitRequest {
  project: Project;
  selectedActors: Array<Actor & { playerWord: string }>;
}

export interface DraftRequest {
  project: Project;
  scriptSkeleton: ScriptSkeletonAct[];
  casting: Casting[];
  selectedActors: Actor[];
  recruitResults: RecruitResult[];
  initialStats: Stats;
}

export interface InterventionRequest {
  project: Project;
  actId: string;
  lineId: string;
  toolType: ToolType;
  currentLine: ShootLine;
  currentBeat?: ScriptBeat;
  playedLines: ShootLine[];
  remainingLines: ShootLine[];
  remainingBeats?: ScriptBeat[];
  canonLedger: CanonEntry[];
  actorStates: ActorState[];
  stats: Stats;
  interventionBudget: {
    usedThisAct: number;
    limitThisAct: number;
  };
  selectedText?: string;
  playerRewritePrompt?: string;
}

export interface InterventionResponse {
  immediate: {
    visibleEffect: string;
    replacementCurrentLine: ShootLine;
    patchedRemainingLines: ShootLine[];
  };
  globalPatch: {
    patchId: string;
    canonChange: string;
    futureDirectives: string[];
    affectedFutureActs: string[];
  };
  statDelta: Stats;
  actorStateDelta: Array<{
    actorId: string;
    mood: string;
    pressureDelta: number;
    biasChange: string;
  }>;
  accidentTag: string;
  actOutcome: ActOutcome;
}

export interface ReviseActRequest {
  project: Project;
  actId: string;
  originalActDraft: ActDraft;
  scriptSkeletonAct: ScriptSkeletonAct;
  canonLedger: CanonEntry[];
  actorStates: ActorState[];
  stats: Stats;
}

export interface ReviseActResponse {
  revisedAct: ActDraft;
}

export interface EpilogueRequest {
  projectTitle: string;
  selectedActors: Array<{
    actorId: string;
    name: string;
    scriptRole: string;
    mindset: string;
  }>;
  canonLedger: CanonEntry[];
  collectedAccidents: string[];
  finalStats: Stats;
}

export interface EpilogueResponse {
  sampleTitle: string;
  flavorTags: string[];
  description: string;
  highlight: string;
  verdict: string;
  shareText: string;
}

export interface GameSession {
  project: Project;
  selectedActors: Actor[];
  persuasionWords: Record<string, string>;
  recruitResults: RecruitResult[];
  casting: Casting[];
  stats: Stats;
}
