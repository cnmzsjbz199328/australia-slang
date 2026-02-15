import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function verifyData() {
    const slangCount = await prisma.slangTerm.count();
    const quizCount = await prisma.quizQuestion.count();
    const choiceCount = await prisma.quizChoice.count();

    console.log("📊 Database Statistics:");
    console.log(`   Total SlangTerms: ${slangCount}`);
    console.log(`   Total QuizQuestions: ${quizCount}`);
    console.log(`   Total QuizChoices: ${choiceCount}`);

    console.log("\n📝 Recent Slang Entries (last 15):");
    const recent = await prisma.slangTerm.findMany({
        take: 15,
        orderBy: { createdAt: "desc" },
        select: { phrase: true, meaning: true, createdAt: true },
    });

    recent.forEach((entry, index) => {
        console.log(`   ${index + 1}. ${entry.phrase} - ${entry.meaning}`);
    });

    console.log("\n✅ Verification complete!\n");
}

verifyData()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
