import { getAllSlang, getSlangBySlug, searchSlang } from "@/lib/slang";

describe("slang dictionary", () => {
  it("loads all terms with unique slugs", () => {
    const all = getAllSlang();
    expect(all.length).toBeGreaterThan(0);
    const slugs = new Set(all.map((t) => t.slug));
    expect(slugs.size).toBe(all.length);
  });

  it("looks up a term by slug", () => {
    const first = getAllSlang()[0];
    expect(getSlangBySlug(first.slug)).toEqual(first);
    expect(getSlangBySlug("definitely-not-a-real-slug")).toBeUndefined();
  });

  it("filters by phrase or meaning, case-insensitively", () => {
    const term = getAllSlang()[0];
    const res = searchSlang(term.phrase.toUpperCase(), 1, 20);
    expect(res.items.some((t) => t.slug === term.slug)).toBe(true);
  });

  it("returns the full list when the query is empty", () => {
    const res = searchSlang("", 1, 1000);
    expect(res.total).toBe(getAllSlang().length);
  });

  it("paginates results", () => {
    const pageSize = 5;
    const p1 = searchSlang("", 1, pageSize);
    const p2 = searchSlang("", 2, pageSize);
    expect(p1.items).toHaveLength(pageSize);
    expect(p1.items[0].slug).not.toBe(p2.items[0].slug);
  });
});
