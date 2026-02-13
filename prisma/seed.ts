import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const slangData = [
  { phrase: "G'day", meaning: "Hello; good day", example: "G'day mate! How are you going?" },
  { phrase: "Arvo", meaning: "Afternoon", example: "See you this arvo." },
  { phrase: "Mate", meaning: "Friend; buddy", example: "He's a good mate of mine." },
  { phrase: "Barbie", meaning: "Barbecue", example: "We're having a barbie on the weekend." },
  { phrase: "Brekkie", meaning: "Breakfast", example: "Let's grab brekkie before work." },
  { phrase: "Bogan", meaning: "Uncultured or unsophisticated person", example: "He's a bit of a bogan but he's harmless." },
  { phrase: "Chockers", meaning: "Very full; packed", example: "The pub was chockers last night." },
  { phrase: "Crikey", meaning: "Expression of surprise", example: "Crikey! That was close." },
  { phrase: "Dunny", meaning: "Toilet", example: "Where's the dunny in this place?" },
  { phrase: "Esky", meaning: "Portable cooler for drinks", example: "Don't forget to bring the esky to the beach." },
  { phrase: "Fair dinkum", meaning: "Genuine; really true", example: "That's fair dinkum? I can't believe it." },
  { phrase: "Footy", meaning: "Australian rules football (or rugby)", example: "We're watching the footy tonight." },
  { phrase: "Heaps", meaning: "A lot; very much", example: "Thanks heaps for your help." },
  { phrase: "Lollies", meaning: "Sweets; candy", example: "The kids want some lollies." },
  { phrase: "Maccas", meaning: "McDonald's", example: "Let's get Maccas for dinner." },
  { phrase: "No worries", meaning: "You're welcome; it's fine", example: "No worries, I'll get it done." },
  { phrase: "Ripper", meaning: "Excellent; great", example: "That was a ripper of a game!" },
  { phrase: "Servo", meaning: "Service station; petrol station", example: "We need to stop at the servo." },
  { phrase: "She'll be right", meaning: "It will be okay; no problem", example: "Don't stress, she'll be right." },
  { phrase: "Stoked", meaning: "Very pleased; excited", example: "I'm stoked we won the match." },
  { phrase: "Strine", meaning: "Australian English; Aussie accent", example: "He speaks pure strine." },
  { phrase: "Ta", meaning: "Thank you", example: "Ta mate, I owe you one." },
  { phrase: "Thongs", meaning: "Flip-flops; sandals", example: "Just wearing thongs to the beach." },
  { phrase: "Tucker", meaning: "Food", example: "There's plenty of tucker for everyone." },
  { phrase: "Ute", meaning: "Pickup truck; utility vehicle", example: "He loaded the ute and drove off." },
  { phrase: "Whinge", meaning: "Complain; whine", example: "Stop whingeing and get on with it." },
  { phrase: "Yakka", meaning: "Work; hard work", example: "That's hard yakka in the sun." },
  { phrase: "Bloke", meaning: "Man; guy", example: "He's a decent bloke." },
  { phrase: "Sheila", meaning: "Woman (old-fashioned)", example: "That sheila over there is my sister." },
  { phrase: "Rooted", meaning: "Exhausted; broken", example: "I'm rooted after that run." },
];

async function main() {
  await prisma.quizChoice.deleteMany({});
  await prisma.quizQuestion.deleteMany({});
  await prisma.slangTerm.deleteMany({});

  const created: { id: string; phrase: string }[] = [];
  for (const s of slangData) {
    const term = await prisma.slangTerm.create({ data: s });
    created.push({ id: term.id, phrase: term.phrase });
  }

  const byPhrase = (p: string) => created.find((c) => c.phrase === p)!;

  const quizData: Array<{
    question: string;
    explanation: string;
    phrase: string;
    choices: { text: string; isCorrect: boolean }[];
  }> = [
    {
      phrase: "G'day",
      question: "What does 'G'day' mean?",
      explanation: "G'day is a casual Australian greeting meaning hello or good day.",
      choices: [
        { text: "Goodbye", isCorrect: false },
        { text: "Hello; good day", isCorrect: true },
        { text: "Thank you", isCorrect: false },
      ],
    },
    {
      phrase: "Arvo",
      question: "What does 'arvo' mean?",
      explanation: "Arvo is short for afternoon.",
      choices: [
        { text: "Morning", isCorrect: false },
        { text: "Afternoon", isCorrect: true },
        { text: "Evening", isCorrect: false },
      ],
    },
    {
      phrase: "Barbie",
      question: "If someone invites you to a 'barbie', what are they inviting you to?",
      explanation: "Barbie means barbecue – an outdoor cooking event.",
      choices: [
        { text: "A doll party", isCorrect: false },
        { text: "A barbecue", isCorrect: true },
        { text: "A beach trip", isCorrect: false },
      ],
    },
    {
      phrase: "Mate",
      question: "What does 'mate' usually mean in Australia?",
      explanation: "Mate is a friendly term for a friend or any person.",
      choices: [
        { text: "Enemy", isCorrect: false },
        { text: "Friend; buddy", isCorrect: true },
        { text: "Teacher", isCorrect: false },
      ],
    },
    {
      phrase: "No worries",
      question: "When an Aussie says 'no worries', what do they mean?",
      explanation: "No worries means you're welcome, or that something is fine.",
      choices: [
        { text: "I am very worried", isCorrect: false },
        { text: "You're welcome; it's fine", isCorrect: true },
        { text: "Do not ask again", isCorrect: false },
      ],
    },
    {
      phrase: "Dunny",
      question: "Where would you go if someone said 'the dunny is out the back'?",
      explanation: "Dunny is the toilet.",
      choices: [
        { text: "The garden", isCorrect: false },
        { text: "The toilet", isCorrect: true },
        { text: "The garage", isCorrect: false },
      ],
    },
    {
      phrase: "Maccas",
      question: "What is 'Maccas'?",
      explanation: "Maccas is slang for McDonald's.",
      choices: [
        { text: "A type of kangaroo", isCorrect: false },
        { text: "McDonald's", isCorrect: true },
        { text: "A beach", isCorrect: false },
      ],
    },
    {
      phrase: "Ripper",
      question: "If something is a 'ripper', what does that mean?",
      explanation: "Ripper means excellent or great.",
      choices: [
        { text: "Broken", isCorrect: false },
        { text: "Excellent; great", isCorrect: true },
        { text: "Boring", isCorrect: false },
      ],
    },
    {
      phrase: "She'll be right",
      question: "What does 'she'll be right' express?",
      explanation: "It means things will be okay; no need to worry.",
      choices: [
        { text: "A woman is correct", isCorrect: false },
        { text: "It will be okay; no problem", isCorrect: true },
        { text: "Something is wrong", isCorrect: false },
      ],
    },
    {
      phrase: "Thongs",
      question: "In Australia, what are 'thongs'?",
      explanation: "Thongs are flip-flops or sandals, not underwear.",
      choices: [
        { text: "Underwear", isCorrect: false },
        { text: "Flip-flops; sandals", isCorrect: true },
        { text: "A type of meat", isCorrect: false },
      ],
    },
    {
      phrase: "Ute",
      question: "What is a 'ute'?",
      explanation: "A ute is a pickup truck or utility vehicle.",
      choices: [
        { text: "A musical instrument", isCorrect: false },
        { text: "A pickup truck", isCorrect: true },
        { text: "A type of fruit", isCorrect: false },
      ],
    },
    {
      phrase: "Chockers",
      question: "If a place is 'chockers', what does that mean?",
      explanation: "Chockers means very full or packed.",
      choices: [
        { text: "Empty", isCorrect: false },
        { text: "Very full; packed", isCorrect: true },
        { text: "Closed", isCorrect: false },
      ],
    },
    {
      phrase: "Fair dinkum",
      question: "What does 'fair dinkum' mean?",
      explanation: "Fair dinkum means genuine or really true.",
      choices: [
        { text: "Unfair", isCorrect: false },
        { text: "Genuine; really true", isCorrect: true },
        { text: "A type of drink", isCorrect: false },
      ],
    },
    {
      phrase: "Tucker",
      question: "What is 'tucker'?",
      explanation: "Tucker is food.",
      choices: [
        { text: "A truck", isCorrect: false },
        { text: "Food", isCorrect: true },
        { text: "Money", isCorrect: false },
      ],
    },
    {
      phrase: "Stoked",
      question: "If someone is 'stoked', how do they feel?",
      explanation: "Stoked means very pleased or excited.",
      choices: [
        { text: "Angry", isCorrect: false },
        { text: "Very pleased; excited", isCorrect: true },
        { text: "Tired", isCorrect: false },
      ],
    },
  ];

  for (const q of quizData) {
    const slang = byPhrase(q.phrase);
    await prisma.quizQuestion.create({
      data: {
        question: q.question,
        explanation: q.explanation,
        slangId: slang.id,
        choices: { create: q.choices },
      },
    });
  }

  console.log(`Seed completed: ${created.length} slang terms, ${quizData.length} quiz questions.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
