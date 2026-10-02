import { describe, expect, it } from "vitest";
import { strideStart, utcDay } from "./stride";

describe("Stride window", () => {
  it("names days by the UTC calendar, whatever the hour", () => {
    expect(utcDay(new Date("2026-10-02T00:00:00Z"))).toBe("2026-10-02");
    expect(utcDay(new Date("2026-10-02T23:59:59.999Z"))).toBe("2026-10-02");
  });

  it("spans seven days, today included", () => {
    expect(strideStart(new Date("2026-10-02T12:00:00Z"))).toBe("2026-09-26");
    // Across a month and a year boundary.
    expect(strideStart(new Date("2027-01-03T00:30:00Z"))).toBe("2026-12-28");
  });
});
