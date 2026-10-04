import { describe, expect, it } from "vitest";
import { usernameKey, validateUsername } from "./moderation";

describe("username look-alikes", () => {
  it("refuses reserved names spelled with look-alike letters", () => {
    for (const name of ["ADMlN", "Adm1n", "Adrnin", "OFFlClAL", "ldlebound", "SUPPØRT", "Moderatør", "St4ff_0fficiel"]) {
      expect(validateUsername(name), name).toEqual({ ok: false, reason: "reserved" });
    }
  });

  it("refuses banned words spelled with look-alike letters", () => {
    for (const name of ["Hitlør", "Nazl", "Pornø", "Big_Cøck", "Rnilf", "Rnasturb"]) {
      expect(validateUsername(name), name).toEqual({ ok: false, reason: "forbidden" });
    }
  });

  it("spells out ligatures and letters NFD leaves whole", () => {
    expect(validateUsername("Ståff").ok).toBe(false);
    expect(validateUsername("Shæt").ok).toBe(true);
    expect(validateUsername("Faßcist").ok).toBe(true);
    expect(validateUsername("Aßhole")).toEqual({ ok: false, reason: "forbidden" });
  });

  it("keeps accepting ordinary names that hold an l, an rn or an ø", () => {
    for (const name of [
      "Tilt", "Lilian", "Philippe", "Emilie", "Camille", "Debbie", "Lionel", "Cyril", "Nail", "Tilly",
      "Bjørn", "Søren", "Ørjan", "Turner", "Cornelius", "Hornet", "Learner", "Smiles", "Mobile", "Gentille",
      "Milou", "Molly", "Twilight", "Pupille", "Æsir", "Þor"
    ]) {
      expect(validateUsername(name), name).toMatchObject({ ok: true });
    }
  });

  it("leaves the uniqueness key as it was: accounts already stored keep theirs", () => {
    expect(usernameKey("ADMlN")).toBe("admln");
    expect(usernameKey("Bjørn")).toBe("bjørn");
    expect(usernameKey("Maëlle")).toBe("maelle");
  });
});
