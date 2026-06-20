import { getPostBySlug } from "../blogData";

describe("blogData", () => {
  it("gets post by slug", () => {
    const post = getPostBySlug("things-successful-businessman-leader-implement");
    expect(post).toBeDefined();
    expect(post?.slug).toBe("things-successful-businessman-leader-implement");
  });

  it("returns undefined for non-existent slug", () => {
    const post = getPostBySlug("non-existent-slug");
    expect(post).toBeUndefined();
  });
});
