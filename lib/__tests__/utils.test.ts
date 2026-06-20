import { cn, initials } from "../utils";

describe("utils", () => {
  describe("cn", () => {
    it("joins class names correctly", () => {
      expect(cn("a", "b", "c")).toBe("a b c");
      expect(cn("a", false, "b", undefined, null)).toBe("a b");
    });
  });

  describe("initials", () => {
    it("returns initials for a name", () => {
      expect(initials("John Doe")).toBe("JD");
      expect(initials("single")).toBe("S");
      expect(initials("three words name")).toBe("TW");
    });

    it("returns empty string for falsy values", () => {
      expect(initials("")).toBe("");
      expect(initials(null as any)).toBe("");
    });
  });
});
