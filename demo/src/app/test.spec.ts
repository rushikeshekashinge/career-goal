import { average, capitalize, sum } from "./data-utils";


describe("data.utils", () => {
  describe("sum", () => {
    it("should add two positive numbers", () => {
      expect(sum(2, 3)).toBe(5);
    });

    it("should handle negative numbers", () => {
      expect(sum(-2, 3)).toBe(1);
    });
  });

  describe("average", () => {
    it("should return the average of numbers", () => {
      expect(average([2, 4, 6])).toBe(4);
    });

    it("should return 0 for an empty array", () => {
      expect(average([])).toBe(0);
    });
  });

  describe("capitalize", () => {
    it("should capitalize the first letter", () => {
      expect(capitalize("hello")).toBe("Hello");
    });

    it("should return an empty string if input is empty", () => {
      expect(capitalize("")).toBe("");
    });
  });
});
