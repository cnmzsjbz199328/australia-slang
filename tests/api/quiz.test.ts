
/**
 * API tests for /api/quiz (GET questions) and /api/quiz/submit (POST answers).
 */
import { GET as quizGet } from "@/app/api/quiz/route";
import { POST as quizSubmit } from "@/app/api/quiz/submit/route";

describe("Quiz API", () => {
  describe("GET /api/quiz", () => {
    it("returns random questions list", async () => {
      const req = new Request("http://localhost/api/quiz?limit=5");
      const res = await quizGet(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty("questions");
      expect(Array.isArray(data.questions)).toBe(true);
      // If DB has data, length might be > 0. If empty, it's 0. 
      // We assume DB might be empty in test env without seed, but structure checks pass.
    });

    it("respects limit parameter", async () => {
      const req = new Request("http://localhost/api/quiz?limit=2");
      const res = await quizGet(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.questions.length).toBeLessThanOrEqual(2);
    });
  });

  describe("POST /api/quiz/submit", () => {
    it("evaluates answers correctly structure", async () => {
      const body = {
        answers: [
          { questionId: "test-id", choiceId: "choice-id" }
        ]
      };
      const req = new Request("http://localhost/api/quiz/submit", {
        method: "POST",
        body: JSON.stringify(body),
      });
      const res = await quizSubmit(req);
      
      // Even if IDs don't exist, it should return a valid structure with 0 correct
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty("total", 1);
      expect(data).toHaveProperty("correct", 0);
      expect(data).toHaveProperty("details");
      expect(data.details).toHaveLength(1);
    });

    it("returns 400 for invalid input", async () => {
      const body = { answers: "invalid" }; // Not an array
      const req = new Request("http://localhost/api/quiz/submit", {
        method: "POST",
        body: JSON.stringify(body),
      });
      const res = await quizSubmit(req);
      expect(res.status).toBe(400);
    });
  });
});
