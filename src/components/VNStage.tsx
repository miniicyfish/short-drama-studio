'use client';

import Image from 'next/image';
import { ReactNode } from 'react';

export type VNLineKind = 'narration' | 'dialogue' | 'action' | 'inner' | 'system' | 'task';

export interface VNCharacter {
  id: string;
  name: string;
  image: string;
  position?: 'left' | 'center' | 'right';
  active?: boolean;
}

interface VNStageProps {
  background: string;
  title?: string;
  subtitle?: string;
  speaker?: string;
  text?: string;
  kind?: VNLineKind;
  characters?: VNCharacter[];
  children?: ReactNode;
  overlay?: ReactNode;
  controls?: ReactNode;
}

const positionClass = {
  left: 'left-[4%] md:left-[9%]',
  center: 'left-1/2 -translate-x-1/2',
  right: 'right-[4%] md:right-[9%]',
};

function kindLabel(kind: VNLineKind) {
  return {
    narration: '镜头',
    dialogue: '台词',
    action: '动作',
    inner: '内心',
    system: '提示',
    task: '任务',
  }[kind];
}

function frameClass(kind: VNLineKind) {
  return {
    narration: 'vn-frame vn-frame-narration',
    dialogue: 'vn-frame vn-frame-dialogue',
    action: 'vn-frame vn-frame-action',
    inner: 'vn-frame vn-frame-inner',
    system: 'vn-frame vn-frame-system',
    task: 'vn-frame vn-frame-task',
  }[kind];
}

function bodyClass(kind: VNLineKind) {
  return {
    narration: 'vn-text vn-text-narration',
    dialogue: 'vn-text vn-text-dialogue',
    action: 'vn-text vn-text-action',
    inner: 'vn-text vn-text-inner',
    system: 'vn-text vn-text-system',
    task: 'vn-text vn-text-task',
  }[kind];
}

function formatText(kind: VNLineKind, value: string) {
  if (kind === 'dialogue') return `“${value}”`;
  return value;
}

export default function VNStage({
  background,
  title,
  subtitle,
  speaker,
  text,
  kind = 'narration',
  characters = [],
  children,
  overlay,
  controls,
}: VNStageProps) {
  const displaySpeaker =
    speaker ||
    (kind === 'task' ? kindLabel(kind) : undefined);
  const displayKind = kind === 'inner' || kind === 'narration' ? kindLabel(kind) : undefined;
  const showHeader = Boolean(displaySpeaker || displayKind || controls);
  const frame = text ? (
    <div key={`${kind}-${speaker || ''}-${text}`} className={`${frameClass(kind)} animate-fade-in`}>
      {showHeader && (
        <div className="vn-frame-head">
          {(displaySpeaker || displayKind) && (
            <div className="vn-frame-name">
              {displayKind && <span className="vn-frame-kind">{displayKind}</span>}
              {displaySpeaker && <span className="vn-frame-speaker">{displaySpeaker}</span>}
            </div>
          )}
          {controls}
        </div>
      )}
      <p className={bodyClass(kind)}>{formatText(kind, text)}</p>
    </div>
  ) : null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-bg-deep text-text-primary">
      <Image
        src={background}
        alt={title || '场景'}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-bg-deep/35 via-bg-deep/5 to-bg-deep/95" />
      <div className="absolute inset-0 vn-grain" />

      {title && (
        <div className="absolute left-4 top-4 border border-border bg-bg-deep/70 px-4 py-3 backdrop-blur md:left-6 md:top-6">
          <div className="text-xs text-accent-blue">{subtitle}</div>
          <div className="mt-1 text-sm font-bold text-accent-gold">{title}</div>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-28 top-16 pointer-events-none">
        {characters.map((character) => (
          <div
            key={character.id}
            className={`standee-shell absolute bottom-0 h-[68vh] w-[34vw] max-w-[320px] transition-all duration-300 ${
              positionClass[character.position || 'center']
            } ${character.active === false ? 'opacity-55 saturate-50' : 'opacity-100'}`}
          >
            <Image
              src={character.image}
              alt={character.name}
              fill
              sizes="(min-width: 768px) 360px, 48vw"
              className="character-standee object-cover object-top drop-shadow-2xl"
            />
          </div>
        ))}
      </div>

      {overlay && <div className="absolute inset-x-4 top-20 z-10 md:inset-x-8 md:top-24">{overlay}</div>}

      {kind === 'task' && frame && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4">{frame}</div>
      )}

      <div className="absolute inset-x-0 bottom-0 z-10 p-4 md:p-6">
        <div className="mx-auto max-w-5xl">
          {children}
          {kind !== 'task' && frame}
        </div>
      </div>
    </main>
  );
}
