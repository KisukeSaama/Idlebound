import { afterEach, describe, expect, it, vi } from "vitest";
import { gameNow, noteServerTime, resetClock } from "./clock";

describe("the game's clock", () => {
  afterEach(() => {
    resetClock();
    vi.restoreAllMocks();
  });

  it("keeps the server's time, whatever the device's clock says", () => {
    let steady = 1_000;
    vi.spyOn(performance, "now").mockImplementation(() => steady);
    const device = vi.spyOn(Date, "now").mockReturnValue(5_000_000);
    expect(gameNow()).toBe(5_000_000);
    // Sent at 1000, answered at 1200: the server's time was read halfway.
    steady = 1_200;
    noteServerTime("2000000", 1_000);
    expect(gameNow()).toBe(2_000_100);
    // The device's clock is set back a day: the game's clock walks on.
    device.mockReturnValue(5_000_000 - 86_400_000);
    steady = 61_200;
    expect(gameNow()).toBe(2_060_100);
  });

  it("lets the network's jitter pass, and follows a server read far off", () => {
    let steady = 0;
    vi.spyOn(performance, "now").mockImplementation(() => steady);
    noteServerTime("1000000", 0);
    steady = 10_000;
    noteServerTime("1010800", 10_000);
    expect(gameNow()).toBe(1_010_000);
    noteServerTime("1020000", 10_000);
    expect(gameNow()).toBe(1_020_000);
    noteServerTime("not a time", 10_000);
    noteServerTime(null, 10_000);
    expect(gameNow()).toBe(1_020_000);
  });
});
