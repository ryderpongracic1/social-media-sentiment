import {
  cn,
  formatNumber,
  formatPercentage,
  truncateText,
  debounce,
  sleep,
  generateId,
  isEmpty,
  safeJsonParse,
  formatRelativeTime,
  capitalize,
  camelToKebab,
  kebabToCamel
} from "../utils";

describe("Utils", () => {
  describe("cn (className utility)", () => {
    it("should merge class names correctly", () => {
      expect(cn("class1", "class2")).toBe("class1 class2");
    });

    it("should handle conditional classes", () => {
      expect(cn("base", true && "conditional", false && "hidden")).toBe(
        "base conditional"
      );
    });

    it("should handle undefined and null values", () => {
      expect(cn("base", undefined, null, "valid")).toBe("base valid");
    });

    it("should merge Tailwind classes correctly", () => {
      expect(cn("p-4", "p-2")).toBe("p-2");
    });
  });

  describe("formatPercentage", () => {
    it("should format percentage correctly", () => {
      expect(formatPercentage(75.5)).toBe("75.5%");
    });

    it("should handle custom decimal places", () => {
      expect(formatPercentage(75.555, 2)).toBe("75.56%");
    });

    it("should handle zero", () => {
      expect(formatPercentage(0)).toBe("0.0%");
    });
  });

  describe("truncateText", () => {
    it("should truncate long text", () => {
      expect(truncateText("This is a long text", 10)).toBe("This is a ...");
    });

    it("should not truncate short text", () => {
      expect(truncateText("Short", 10)).toBe("Short");
    });
  });

  describe("formatRelativeTime", () => {
    it("should format recent time as 'just now'", () => {
      const now = new Date();
      expect(formatRelativeTime(now)).toBe("just now");
    });

    it("should format minutes ago", () => {
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
      expect(formatRelativeTime(twoMinutesAgo)).toBe("2m ago");
    });

    it("should format hours ago", () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      expect(formatRelativeTime(twoHoursAgo)).toBe("2h ago");
    });
  });

  describe("isEmpty", () => {
    it("should return true for null and undefined", () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    it("should return true for empty string", () => {
      expect(isEmpty("")).toBe(true);
      expect(isEmpty("   ")).toBe(true);
    });

    it("should return true for empty array", () => {
      expect(isEmpty([])).toBe(true);
    });

    it("should return true for empty object", () => {
      expect(isEmpty({})).toBe(true);
    });

    it("should return false for non-empty values", () => {
      expect(isEmpty("text")).toBe(false);
      expect(isEmpty([1, 2, 3])).toBe(false);
      expect(isEmpty({ key: "value" })).toBe(false);
    });
  });

  describe("capitalize", () => {
    it("should capitalize first letter", () => {
      expect(capitalize("hello")).toBe("Hello");
    });

    it("should handle empty string", () => {
      expect(capitalize("")).toBe("");
    });
  });

  describe("formatNumber", () => {
    it("should format numbers with commas", () => {
      expect(formatNumber(1234567)).toBe("1,234,567");
    });

    it("should handle decimals", () => {
      expect(formatNumber(1234.56)).toBe("1,234.56");
    });

    it("should handle zero", () => {
      expect(formatNumber(0)).toBe("0");
    });

    it("should handle negative numbers", () => {
      expect(formatNumber(-1234)).toBe("-1,234");
    });
  });

  describe("debounce", () => {
    jest.useFakeTimers();

    it("should delay function execution", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("should cancel previous calls", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
      jest.clearAllTimers();
    });
  });

  describe("generateId", () => {
    it("should generate a string", () => {
      const id = generateId();
      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
    });

    it("should generate unique IDs", () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });
  });

  describe("safeJsonParse", () => {
    it("should parse valid JSON", () => {
      const result = safeJsonParse('{"key": "value"}', {});
      expect(result).toEqual({ key: "value" });
    });

    it("should return fallback for invalid JSON", () => {
      const fallback = { default: true };
      const result = safeJsonParse("invalid json", fallback);
      expect(result).toBe(fallback);
    });
  });
});