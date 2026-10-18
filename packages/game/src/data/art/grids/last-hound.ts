import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Hound of the Last Hunt: the King's hounds were loosed on the night of the Binding
 * and are still following the scent. A gaunt pale sighthound snarling low, hackles raised
 * in spikes, the ribs and the knuckled spine showing through a hide worn thin, the belly
 * tucked hollow; the King's gold collar with a violet stone and a broken chain swinging
 * from it, violet fire in the eye, the tail burning off into violet at the tip.
 */
export const LAST_HOUND: CreatureGrid = {
  rows: [
    "",
    "................................g.....gg",
    "...............................gggg..hg",
    ".............................gghggchhff",
    "............................g.hhffghgff.gggg",
    "........................g..hgehgdfhhfffghgc",
    "........................hg.hgehgdhhgffhhgff.ggggfd",
    ".......................ghggggghgdhhgehggdddgghgff",
    ".................g...fgghgggggghghgeeegddcgeggfff",
    ".................gggehgghehdggggddgdeegghggecdddfffd",
    ".......ee.......ghggeheeghgddeeedddghhhhiiihhhgeffdd",
    "......eee.......ghgggheehggaaaaeehhhiiiiiihhhhhhhffffff",
    "......eee.....gghgdffeghgggaaaaahhhhiiiiiihiiihiihhfddg",
    ".....ggghe..eggfhfddfhhfghghgaaaaiihhhiiiihiiihhiiihghge",
    ".....gghhgffegcfeffdihfghhhhhaahahiiiihhiiiiiiihhihhhhhhhg",
    ".....gghhgffgggfeeeiicghghhiihaaaaiiiiihhihiiiiihiihhhhihhhe",
    ".....hgeggfggghhhghihcghhgiiihaaaahiiiihhihiiiiiihihhhhhihhhg",
    ".....hgggghhhiiiihhhgggghhhihiaaaahiiiiihhhiiiiiiihihhhhihihhg",
    ".....hghgiiiiiiiihhgcgggghihhhaaaaehiiiihhhhiiiiiiihihhhhgiihhgg",
    ".....ghhhiiiiiiiihecccghgghhhhabaaeiiiiihhhhiiiiiiihhhhhhhhiihhee",
    ".....hhhiiiiihiiiihhghgcgghhhhaaaagiiiiihghhiiiiihiihhhhhhhiiihh",
    "....hhhhiiiiiihhihhhgcccghghggaaaaeiiiiiighhiiihihihhhhhhhhhiihhh",
    "...hihhihiihggghhhhgccggggghegbaaagiiihiihhhiiiiiihihhhhhhhhiihihe",
    "...ghhhhhiiggcghhihhgcggggghedbaaagiiihiihhhhihihihihhhhhhhhiihihh",
    "....hghheggEEghiiihhhgggggeecaaaaahiihhiihhhhihihihhhghghgghiihihhg",
    "....dhhhggcgghhhihhiiheggheeababadhiiihiihhhhhhihihhhghgheehiiiiihg",
    "....hiihhggghhhihhhihheddghcaaaaadhiiihiihhgghhhhhhhhghggeeiihiiihh",
    "...hhiiiiiihhhihhhiiheeeefccbahaeehhiiihhhhgghhhhhhhgggggeeiiiiiihhf",
    "..hhiiiihhihiihhhhihhhcecgccaaaagghiiiihhhgggghhhhghghgggggiiiiiihhe",
    "..hhiiiiihhhhghhhghhecdgdaaccccgghiihiihhhgcghhhghghggghhchiiiiiihhgc",
    ".dddgiiihhhghhhhhggdecdgdaaacccddhiiihihhhhgehghghgggggehchiiiiiihhgg.............h",
    "deddeiiihgcccdhhhhddccddccaaacccdhiiihihhhihegghghhgggcccchiiiiiihhgg.............hh",
    "eecchiihgccccchhhedccccccccaaddcehhiiihhhhihhggggggeecdcdchiiihihhhghg.............hh",
    ".ccchhhhgccgcchhceegccccccccdgdcehhhhhhhghihhdgggggcccdddchiiihihhhghg.............hhh",
    ".gcceehigcggcghe....gccccccddgdddghghhhhgiiihheeggccccccdchiiihihhhggh.............hhhh",
    "..hhaihidfggghg.....ggccccdddgggdeghgghgghiihhdecccccc..dchiiihhhhhgghg............hhhh",
    "...h...hdgheehc......gggdcdddegheeeggggghhhihhhcccccc....chiiihhghgeghhg...........hhhhh",
    "......dddggdggaa.....ghgdedeeegghegcgghhihhhhhhgccccc....chiiihhhheeghhgg...........hhhhh",
    "......dddgidh.ah.....ghggeceeggggfcccccghhhhhhhhcddc......hhiihhhheegghhg...........hhhhh",
    "......hdehegh.aa.....ggg.gccccccccccccceeehiihggcddc......ghiihhhhheeghhhg.........hhhhhh",
    "......ddeeeh...a......gg.hcccccccccccc.cehiiihgcddcc......eehhghiihdegghhgg........hhihhh",
    ".......eeegg...a........hgccccccc.......dhiiihgcddddc.....eegghhhhhdegghhhgc.......hhhhhh",
    "...............aa.......hddccccc........ghiihhddddcccc.....cgghghhgddggghhhgc....hhhihhhh",
    "...............ia.......hddcddc.........hiihhgdddddccc......gggggggdegggghhihggghhhhhhhh",
    "...............aa......hgddeddd........ghiihhg...dddcc.......geeggeeeecggghhhhhhhhhhhhhh",
    "...............ah......hedeed..........hiihhge..hgddcc..........ccdggecgggghhhhihhhhghhh",
    "...............aa.....heedee...........hiihhe...hgddd............cdgge.gggggghhhhggghhh",
    ".....................hgggee...........ghihhee..hhddd.............gghhe..gggggghhhhghh",
    ".....................heggee...........hiihgg..hhged..............gghhe....eegggggghh",
    "....................hghhge...........hhiihgeegggeed..............hhhhd.....eegghh",
    "....................hghhg............hiiihffefeeee...............hhhh",
    "...................hhhhhg...........hhiihgdddfddee..............ghhhh",
    "...................hhhhgg..........ghiiiheedcccc................gghhh",
    "..................hhgheec..........hhihhhe....................eehhegg",
    "..............ggggeehhecc..........hhiihe....................ggeeddhg",
    ".............fgggchhhge...........hhihige....................ccdddddg",
    ".............ffdffehhgg.........ghhhhhhe.......................cccdd",
    ".............fddfffggg.........hhghhgghd",
    "..............................ghgghgghhe",
    ".............................fgddghddehc",
    ".............................fcddddddec",
    "................................d"
  ],
  legend: {
    E: { pal: C.essenceLight, glow: true },
    a: { m: "collar", step: 0 },
    b: { m: "collar", step: 1 },
    c: { m: "dark", step: 0 },
    d: { m: "dark", step: 1 },
    e: { m: "dark", step: 2 },
    f: { m: "fur", step: 0 },
    g: { m: "fur", step: 1 },
    h: { m: "fur", step: 2 },
    i: { m: "fur", step: 3 }
  },
  idle: {
    // A hound's panting snarl: two quick heaves of the ribs, twice a cycle.
    waist: 37,
    breath: [0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0],
    // Once in a cycle, the hackles rise.
    twitch: {
      frames: [7],
      patches: [
        { x: 20, y: -1, rows: ["", "............g.....gg", "...........g.gg..h._", ".........ggh..chhff", "........g_h.ffg.g...gggg", "....g..h.e.gd.h.f..gh.c_", "....hg.......h.g..hhgff.ggggfd", "...g..gg.g......ehggdddg.h.f._", ".fg.......ghg.ge.e.d.cge.gf", "eh...ehd...gdd.d...ghg..cddd.ffd", "..eeghg.deee..dghhhhiiihhhge..d", "g...hg.aaaa.ehhhiiii..h...hhh.fffff", "feghg......ah..........iii.iihh.ddg", ".hhf.h.hg...aii.hh.........h.iihgh.e", "i.fgh.h.h..h.h.iiihh..i...i.h.h.h.hhhg", "______________________________________"] }
      ]
    }
  }
};
