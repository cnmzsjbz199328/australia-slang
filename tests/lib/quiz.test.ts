import { getAllQuestions, pickRandomQuestions, scoreAnswers } from "@/lib/quiz";
import { records } from "@/lib/dataset";

describe("quiz", () => {
  it("builds one question per record, each with at least two choices", () => {
    const questions = getAllQuestions();
    expect(questions.length).toBe(records.length);
    for (const q of questions) {
      expect(q.choices.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("picks the requested number of questions", () => {
    expect(pickRandomQuestions(5)).toHaveLength(5);
    expect(pickRandomQuestions(100000).length).toBe(getAllQuestions().length);
  });

  it("scores a correct answer as correct and a wrong one as incorrect", () => {
    const record = records[0];
    const correctIndex = record.quiz.choices.findIndex((c) => c.isCorrect);
    const correctChoiceId = `${record.slug}-c${correctIndex}`;
    const wrongChoiceId = `${record.slug}-c${(correctIndex + 1) % record.quiz.choices.length}`;

    const good = scoreAnswers([{ questionId: record.slug, choiceId: correctChoiceId }]);
    expect(good.correct).toBe(1);
    expect(good.details[0].correct).toBe(true);
    expect(good.details[0].correctChoiceId).toBe(correctChoiceId);

    const bad = scoreAnswers([{ questionId: record.slug, choiceId: wrongChoiceId }]);
    expect(bad.correct).toBe(0);
    expect(bad.details[0].correct).toBe(false);
  });

  it("ignores unknown question ids without crashing", () => {
    const res = scoreAnswers([{ questionId: "nope", choiceId: "nope-c0" }]);
    expect(res.correct).toBe(0);
    expect(res.details[0].correct).toBe(false);
  });
});
