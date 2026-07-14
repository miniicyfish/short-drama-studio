# 短剧倒退十年而我不变 · Short Drama Studio

AI 片场救火互动叙事 Demo。

在线试玩：

https://short-drama-studio-zpha.vercel.app/play

## Run

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Env

The backend API uses OpenAI-compatible chat completions:

```env
AI_API_KEY=your_key
AI_BASE_URL=https://api.example.com/v1
AI_MODEL=model_name
```

## Core Files

- `src/app/page.tsx`：选择短剧项目、6 选 4 捞人、入组说服
- `src/app/play/page.tsx`：逐句拍摄、导演工具、片场事实账本
- `src/app/api/recruit/route.ts`：入组心态生成
- `src/app/api/draft/route.ts`：第一集 9 幕初始拍摄稿生成
- `src/app/api/intervene/route.ts`：导演工具 AI 干预
- `src/app/api/revise-act/route.ts`：按片场事实修订后续幕
- `src/app/api/epilogue/route.ts`：出片结算
- `src/lib/gameData.ts`：项目、演员池、角色、剧本蓝图、素材路径
- `src/lib/gameTypes.ts`：核心数据类型
- `src/lib/mockAI.ts`：无 API key 时的本地 fallback
- `src/lib/prompts.ts`：AI Prompt
