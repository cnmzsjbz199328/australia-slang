# AI Data Generation Prompt - Australia Slang Database

## 数据库结构说明

本项目使用 Prisma + PostgreSQL 存储澳大利亚俚语数据，包含3个关联表：

### 1. SlangTerm（俚语词条表）
- `id`: 自动生成的唯一ID（cuid）
- `phrase`: 俚语短语（必填）
- `meaning`: 俚语含义（必填）
- `example`: 使用示例（可选）
- `createdAt`: 创建时间（自动生成）

### 2. QuizQuestion（测验问题表）
- `id`: 自动生成的唯一ID（cuid）
- `slangId`: 关联的俚语词条ID（可为空）
- `question`: 问题文本（必填）
- `explanation`: 答案解释（可选）
- `createdAt`: 创建时间（自动生成）

### 3. QuizChoice（测验选项表）
- `id`: 自动生成的唯一ID（cuid）
- `questionId`: 关联的问题ID（必填）
- `text`: 选项文本（必填）
- `isCorrect`: 是否为正确答案（布尔值，默认false）

## AI 生成数据提示词模板

---

### 📝 提示词（中文版）

```
你是一位澳大利亚文化和语言专家。请为我生成 [数量] 条真实、准确的澳大利亚俚语数据，用于教育学习平台。

**数据格式要求：**

每条俚语包含：
1. **phrase（俚语短语）**：地道的澳大利亚俚语词汇或短语
2. **meaning（含义）**：简洁清晰的中文或英文解释
3. **example（使用示例）**：一个真实、自然的对话场景例句
4. **关联测验题（可选）**：每条俚语可配1-2道测验题，每题包含：
   - question：测试对这个俚语理解的问题
   - explanation：正确答案的解释说明
   - choices：3-4个选项，其中1个正确答案，2-3个迷惑项

**内容要求：**
- 选择真实存在、常用的澳大利亚俚语，避免生僻或过时的表达
- 涵盖不同场景：日常问候、食物、地点、情感、活动等
- 例句要自然、口语化，体现澳大利亚文化特色
- 测验题的迷惑选项要有一定干扰性，但不能太离谱
- 确保所有内容准确、友好、无冒犯性

**输出格式（JSON）：**

```json
[
  {
    "phrase": "G'day",
    "meaning": "你好；美好的一天",
    "example": "G'day mate! How are you going?",
    "quiz": {
      "question": "What does 'G'day' mean?",
      "explanation": "G'day is a casual Australian greeting meaning hello or good day.",
      "choices": [
        { "text": "Goodbye", "isCorrect": false },
        { "text": "Hello; good day", "isCorrect": true },
        { "text": "Thank you", "isCorrect": false }
      ]
    }
  }
]
```

请生成 [数量] 条数据。
```

---

### 📝 Prompt (English Version)

```
You are an Australian culture and language expert. Please generate [NUMBER] authentic and accurate Australian slang entries for an educational learning platform.

**Data Format Requirements:**

Each slang entry should include:
1. **phrase**: An authentic Australian slang word or phrase
2. **meaning**: A clear and concise explanation
3. **example**: A realistic, natural conversational example sentence
4. **quiz (optional)**: Each slang can have 1-2 quiz questions, each containing:
   - question: A question testing understanding of the slang
   - explanation: Explanation of the correct answer
   - choices: 3-4 options with 1 correct answer and 2-3 distractors

**Content Requirements:**
- Choose real, commonly used Australian slang, avoid obscure or outdated expressions
- Cover diverse scenarios: daily greetings, food, places, emotions, activities, etc.
- Example sentences should be natural, colloquial, and reflect Australian culture
- Quiz distractor options should be plausible but not absurd
- Ensure all content is accurate, friendly, and inoffensive

**Output Format (JSON):**

```json
[
  {
    "phrase": "Arvo",
    "meaning": "Afternoon",
    "example": "See you this arvo.",
    "quiz": {
      "question": "What does 'arvo' mean?",
      "explanation": "Arvo is short for afternoon.",
      "choices": [
        { "text": "Morning", "isCorrect": false },
        { "text": "Afternoon", "isCorrect": true },
        { "text": "Evening", "isCorrect": false }
      ]
    }
  },
  {
    "phrase": "Brekkie",
    "meaning": "Breakfast",
    "example": "Let's grab brekkie before work.",
    "quiz": {
      "question": "If someone asks 'Want to grab brekkie?', what are they suggesting?",
      "explanation": "Brekkie is Australian slang for breakfast.",
      "choices": [
        { "text": "Going for lunch", "isCorrect": false },
        { "text": "Having breakfast", "isCorrect": true },
        { "text": "Taking a break", "isCorrect": false },
        { "text": "Going to the beach", "isCorrect": false }
      ]
    }
  }
]
```

Please generate [NUMBER] entries.
```

---

## 使用方法

### 方法1：使用 ChatGPT/Claude 等 AI 工具
1. 复制上述提示词
2. 将 `[数量]` 替换为你需要的数据条数（建议一次生成 20-50 条）
3. 粘贴到 AI 对话框中
4. 复制生成的 JSON 数据
5. 保存为 `.json` 文件或直接用于数据导入

### 方法2：批量生成脚本
创建一个生成脚本 `generate-data.ts`：

```typescript
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";

const prisma = new PrismaClient();

async function importGeneratedData(jsonFilePath: string) {
  const data = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));
  
  for (const item of data) {
    const slangTerm = await prisma.slangTerm.create({
      data: {
        phrase: item.phrase,
        meaning: item.meaning,
        example: item.example,
      },
    });
    
    if (item.quiz) {
      await prisma.quizQuestion.create({
        data: {
          slangId: slangTerm.id,
          question: item.quiz.question,
          explanation: item.quiz.explanation,
          choices: {
            create: item.quiz.choices,
          },
        },
      });
    }
  }
  
  console.log(`✅ Successfully imported ${data.length} slang terms`);
}

// 使用方法: npx tsx generate-data.ts generated-slangs.json
const jsonFile = process.argv[2];
if (!jsonFile) {
  console.error("❌ Please provide JSON file path");
  process.exit(1);
}

importGeneratedData(jsonFile)
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### 方法3：直接在 seed.ts 中添加
将生成的数据直接添加到 `prisma/seed.ts` 的 `slangData` 数组中，然后运行：
```bash
npx prisma db seed
```

---

## 示例主题分类（可按需生成）

为了保证数据多样性，可以按以下主题分类生成：

### 🍴 食物与饮料类
- Brekkie, Tucker, Maccas, Sanga, Cuppa, etc.

### 🏖️ 地点与活动类  
- Servo, Bottle-o, Barbie, Beach, Footy, etc.

### 👥 人物与称呼类
- Mate, Bloke, Sheila, Ankle-biter, Oldies, etc.

### 💬 日常用语类
- G'day, No worries, She'll be right, Fair dinkum, etc.

### 😊 情感与状态类
- Stoked, Rooted, Knackered, Rapt, etc.

### 🚗 交通与物品类
- Ute, Thongs, Esky, Rego, etc.

---

## 质量检查清单

在导入数据前，请确保：
- [ ] 所有 phrase 都是真实存在的澳大利亚俚语
- [ ] meaning 准确且易于理解
- [ ] example 是自然的对话场景
- [ ] 测验题 question 清晰明确
- [ ] 每题有且仅有一个正确答案（isCorrect: true）
- [ ] 迷惑选项有合理性，不会造成误导
- [ ] 所有文本内容友好、无冒犯性
- [ ] JSON 格式正确，无语法错误

---

## 扩展建议

如果未来需要更丰富的数据结构，可以考虑在 Prisma Schema 中添加：
- `difficulty`: 难度等级（beginner/intermediate/advanced）
- `region`: 地区标签（Queensland/NSW/Victoria等）
- `category`: 分类标签（food/greeting/emotion等）
- `audioUrl`: 发音音频链接
- `popularity`: 使用频率评分

当前版本已简化为核心字段，便于快速启动和学习。
