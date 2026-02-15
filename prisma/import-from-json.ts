import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

interface GeneratedSlangData {
    phrase: string;
    meaning: string;
    example?: string;
    quiz?: {
        question: string;
        explanation?: string;
        choices: Array<{
            text: string;
            isCorrect: boolean;
        }>;
    };
}

async function importGeneratedData(jsonFilePath: string) {
    console.log(`📖 Reading data from: ${jsonFilePath}`);

    // 读取 JSON 文件
    const fileContent = fs.readFileSync(jsonFilePath, "utf-8");
    const data: GeneratedSlangData[] = JSON.parse(fileContent);

    console.log(`📊 Found ${data.length} slang terms to import`);

    let successCount = 0;
    let errorCount = 0;

    for (const item of data) {
        try {
            // 验证必填字段
            if (!item.phrase || !item.meaning) {
                console.warn(`⚠️  Skipping invalid entry: missing phrase or meaning`);
                errorCount++;
                continue;
            }

            // 检查是否已存在相同的 phrase
            const existing = await prisma.slangTerm.findFirst({
                where: { phrase: item.phrase },
            });

            if (existing) {
                console.warn(`⚠️  Skipping duplicate: "${item.phrase}" already exists`);
                errorCount++;
                continue;
            }

            // 创建 SlangTerm
            const slangTerm = await prisma.slangTerm.create({
                data: {
                    phrase: item.phrase,
                    meaning: item.meaning,
                    example: item.example || null,
                },
            });

            console.log(`✅ Created slang term: "${item.phrase}"`);

            // 如果有 quiz 数据，创建 QuizQuestion 和 QuizChoices
            if (item.quiz) {
                // 验证 quiz 数据
                if (!item.quiz.question || !item.quiz.choices || item.quiz.choices.length < 2) {
                    console.warn(`⚠️  Invalid quiz data for "${item.phrase}", skipping quiz`);
                } else {
                    const correctChoices = item.quiz.choices.filter(c => c.isCorrect);
                    if (correctChoices.length !== 1) {
                        console.warn(`⚠️  Quiz for "${item.phrase}" must have exactly 1 correct answer, skipping quiz`);
                    } else {
                        await prisma.quizQuestion.create({
                            data: {
                                slangId: slangTerm.id,
                                question: item.quiz.question,
                                explanation: item.quiz.explanation || null,
                                choices: {
                                    create: item.quiz.choices,
                                },
                            },
                        });
                        console.log(`   ✓ Created quiz question with ${item.quiz.choices.length} choices`);
                    }
                }
            }

            successCount++;
        } catch (error) {
            console.error(`❌ Error importing "${item.phrase}":`, error);
            errorCount++;
        }
    }

    console.log("\n" + "=".repeat(50));
    console.log(`🎉 Import completed!`);
    console.log(`   ✅ Successfully imported: ${successCount} slang terms`);
    console.log(`   ❌ Errors/Skipped: ${errorCount}`);
    console.log("=".repeat(50) + "\n");
}

// 使用方法: npx tsx prisma/import-from-json.ts <json-file-path>
const main = async () => {
    const jsonFile = process.argv[2];

    if (!jsonFile) {
        console.error("❌ Error: Please provide a JSON file path");
        console.log("\nUsage:");
        console.log("  npx tsx prisma/import-from-json.ts <json-file-path>");
        console.log("\nExample:");
        console.log("  npx tsx prisma/import-from-json.ts generated-slangs.json");
        process.exit(1);
    }

    // 检查文件是否存在
    if (!fs.existsSync(jsonFile)) {
        console.error(`❌ Error: File not found: ${jsonFile}`);
        process.exit(1);
    }

    try {
        await importGeneratedData(jsonFile);
    } catch (error) {
        console.error("❌ Fatal error during import:", error);
        process.exit(1);
    }
};

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
