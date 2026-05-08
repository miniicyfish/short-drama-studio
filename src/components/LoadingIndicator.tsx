'use client';

export default function LoadingIndicator({ text = '生成中' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-8 text-text-secondary text-sm">
      <span className="relative flex h-4 w-4">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-gold opacity-40" />
        <span className="relative inline-flex h-4 w-4 rounded-full bg-accent-gold" />
      </span>
      <span className="pixel-text">{text}</span>
      <span className="loading-dots">
        <span>·</span>
        <span>·</span>
        <span>·</span>
      </span>
    </div>
  );
}
