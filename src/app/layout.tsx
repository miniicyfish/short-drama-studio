import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '短剧倒退十年而我不变',
  description: 'AI 片场救火互动叙事 Demo',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
