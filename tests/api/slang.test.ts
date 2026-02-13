/**
 * API tests for /api/slang (GET list).
 * Requires DATABASE_URL and migrated DB for full integration; otherwise mock Prisma.
 */
import { GET } from "@/app/api/slang/route";

describe("GET /api/slang", () => {
  it("returns 200 and list shape when no query", async () => {
    const req = new Request("http://localhost/api/slang");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty("items");
    expect(data).toHaveProperty("total");
    expect(Array.isArray(data.items)).toBe(true);
  });

  it("accepts query params", async () => {
    const req = new Request("http://localhost/api/slang?page=1&pageSize=5");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.items.length).toBeLessThanOrEqual(5);
  });
});
