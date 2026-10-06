import { L, DLG, EMO, EN, P_EN, SPEAK_EN, TYPE_EN, Q_EN } from "../data/content.js";

export { L, DLG, SPEAK_EN };

// ===== SETUP: merge English interface content into the lesson data =====
export const LESSON_DAYS = Object.keys(L).map(Number).sort((a, b) => a - b);
LESSON_DAYS.forEach(d => { if (L[d].d) DLG[d] = L[d].d; });
LESSON_DAYS.forEach(d => {
  const e = EN[d];
  if (e) { L[d].t = e[0]; L[d].g.n = e[1]; L[d].g.r = e[2]; L[d].s = e[3]; if (DLG[d]) DLG[d].c = e[4]; }
  if (P_EN[d] && DLG[d]) DLG[d].p = P_EN[d];
  L[d].q.forEach(q => {
    const r = Q_EN[q[0]];
    if (!r) return;
    if (typeof r === "string") q[0] = r; else { q[0] = r[0]; q[1] = r[1]; }
  });
});

export const ALL_WORDS = LESSON_DAYS.flatMap(d => L[d].v);
export const pic = w => w[4] || EMO[w[0]] || "🔤";
export const wtype = w => TYPE_EN[w[1]] || w[1];

export const MONTHS = [
  { name: "Foundations", level: "A2", weeks: [["Week 1", "Everyday life"], ["Week 2", "Work"], ["Week 3", "Travel"], ["Week 4", "Sharing stories"]] },
  { name: "Confident Conversations", level: "B1", weeks: [["Week 5", "Services & daily life"], ["Week 6", "Relationships"], ["Week 7", "Workplace skills"], ["Week 8", "Society & news"]] },
  { name: "Expressing Ideas", level: "B1+", weeks: [["Week 9", "Stories & descriptions"], ["Week 10", "Opinions & debate"], ["Week 11", "Real-world English"], ["Week 12", "Grammar mastery"]] },
];
export const WEEKS = [];
export const REV = {};
MONTHS.forEach((m, mi) => m.weeks.forEach((w, wi) => {
  const s = mi * 30 + wi * 7 + 1;
  WEEKS.push({ name: w[0], theme: w[1], days: [0, 1, 2, 3, 4, 5, 6].map(k => s + k), month: mi });
  REV[s + 6] = WEEKS.length - 1;
}));

export const TOTAL = 90;
export const monthOf = d => Math.ceil(d / 30);
export const weekOf = d => WEEKS.find(w => w.days.includes(d));
export function kind(d) { return L[d] ? "lesson" : (d in REV) ? "review" : "final"; }
export function title(d) {
  if (L[d]) return L[d].t;
  if (d in REV) return WEEKS[REV[d]].name + " Review";
  if (d === 89) return "3-Month Review";
  if (d === 90) return "Final Test";
  const m = monthOf(d);
  return d % 30 === 29 ? "Month " + m + " Review" : "Month " + m + " Test";
}
export function kindLabel(d) {
  const k = kind(d);
  return k === "lesson" ? "New lesson" : k === "review" ? "Review day" : (d % 30 === 0 ? "Test day" : "Review day");
}
export function sub(d) {
  const k = kind(d);
  if (k === "lesson") return L[d].v.length + " new words, 1 dialogue, 1 grammar point";
  if (k === "review") return "Review this week's words, dialogues and grammar";
  return d % 30 === 0 ? "A mixed test covering everything so far" : "A full review before the test";
}
export function scope(d) {
  if (L[d]) return [d];
  if (d in REV) return WEEKS[REV[d]].days.filter(x => L[x]);
  if (d >= 89) return LESSON_DAYS;
  const m = monthOf(d);
  return LESSON_DAYS.filter(x => monthOf(x) === m);
}

// ===== DAILY PLAN (4 SESSIONS) =====
// item: [id, minutes, label, tab, vocabMode?]
export function planFor(d) {
  const k = kind(d), n = L[d] ? L[d].v.length : 0;
  if (k === "lesson") return [
    { n: "Morning", h: "Right after you wake up", items: [["m1", 15, "Review earlier words with picture cards", "old"], ["m2", 15, d === 1 ? "Listen to today's dialogue and repeat each line" : "Listen to yesterday's dialogue and shadow it", d === 1 ? "talk" : "old"]] },
    { n: "Noon", h: "New material", items: [["n1", 15, "Learn " + n + " new words with picture-first cards", "vocab", "pic"], ["n2", 15, "Study the grammar point and read the examples aloud", "grammar"]] },
    { n: "Afternoon", h: "Deep practice", items: [["a1", 20, "Dialogue: listen, then role-play each character", "talk"], ["a2", 10, "Picture matching game", "vocab", "match"], ["a3", 10, "Sentence builder", "build"], ["a4", 10, "Listening and dictation", "dict"], ["a5", 10, "Practice quiz", "quiz"]] },
    { n: "Evening", h: "Wrap up the day", items: [["e1", 20, "Write to the prompt, then read it aloud", "speak"], ["e2", 10, "Go through today's cards and flag words you don't know yet", "vocab", "word"]] }];
  if (k === "review") return [
    { n: "Morning", h: "Right after you wake up", items: [["m1", 15, "Review earlier words with picture cards", "old"], ["m2", 15, "Review all of this week's words (flagged words first)", "vocab", "pic"]] },
    { n: "Noon", h: "Consolidate", items: [["n1", 15, "Review this week's grammar points", "grammar"], ["n2", 15, "Sentence builder", "build"]] },
    { n: "Afternoon", h: "Deep practice", items: [["a1", 20, "Role-play this week's dialogues again", "talk"], ["a2", 15, "Listening and dictation", "dict"], ["a3", 25, "Weekly review quiz", "quiz"]] },
    { n: "Evening", h: "Wrap up the week", items: [["e1", 20, "Write your weekly summary, then read it aloud", "speak"], ["e2", 10, "Picture matching game", "vocab", "match"]] }];
  return [
    { n: "Morning", h: "Right after you wake up", items: [["m1", 30, "Review vocabulary with picture cards (flagged words first)", "vocab", "pic"]] },
    { n: "Noon", h: "Consolidate", items: [["n1", 20, "Grammar review", "grammar"], ["n2", 10, "Sentence builder", "build"]] },
    { n: "Afternoon", h: d % 30 === 0 ? "Test time" : "Mixed practice", items: [["a1", 15, "Role-play a few dialogues", "talk"], ["a2", 10, "Listening and dictation", "dict"], ["a3", 35, d % 30 === 0 ? "Take the test" : "Mixed review quiz", "quiz"]] },
    { n: "Evening", h: "Speaking and writing", items: [["e1", 30, "Write or record yourself on the prompt", "speak"]] }];
}
export const planMins = s => s.items.reduce((t, i) => t + i[1], 0);
export const fmtMin = m => m >= 60 ? Math.floor(m / 60) + " h" + (m % 60 ? " " + (m % 60) + " min" : "") : m + " min";
export function studiedMin(act) {
  let t = 0;
  for (const d in act) { const a = act[d]; planFor(+d).forEach(s => s.items.forEach(i => { if (a[i[0]]) t += i[1]; })); }
  return t;
}
export const allTasksDone = (d, a) => planFor(d).every(s => s.items.every(i => a[i[0]]));

// ===== HELPERS =====
export const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const isHard = (hard, w) => hard.includes(w[0]);
export const toks = s => s.replace(/[.,!?]/g, "").split(/\s+/).filter(Boolean);
export const norm = s => s.toLowerCase().replace(/[’‘]/g, "'").replace(/[.,!?;:"“”]/g, "").replace(/\s+/g, " ").trim();

// ===== WORD SETS =====
export function deck(d, hard) {
  const w = scope(d).flatMap(x => L[x].v);
  if (L[d]) return w;
  return [...w.filter(x => isHard(hard, x)), ...w.filter(x => !isHard(hard, x))];
}
export function oldDeck(d, hard) {
  const seen = new Set(), out = [];
  const add = w => { if (!seen.has(w[0])) { seen.add(w[0]); out.push(w); } };
  LESSON_DAYS.filter(x => x < d).forEach(x => L[x].v.filter(w => isHard(hard, w)).forEach(add));
  [1, 2, 4, 7, 14, 30, 60].forEach(k => { const x = d - k; if (L[x]) L[x].v.forEach(add); });
  return out;
}
export function lastDlgDay(d) { for (let x = d - 1; x >= 1; x--) if (DLG[x]) return x; return 0; }
export function sentPool(d) {
  const out = [];
  scope(d).forEach(x => {
    (DLG[x] ? DLG[x].l : []).forEach(l => out.push({ en: l[1], vi: l[2] }));
    L[x].v.forEach(w => out.push({ en: w[3], hint: "Example sentence for “" + w[0] + "”" }));
    L[x].g.ex.forEach(e => out.push({ en: e, hint: "Grammar example: " + L[x].g.n }));
  });
  return out;
}
export const talkDays = d => scope(d).filter(x => DLG[x]);

// ===== GAMES =====
export function newMatch(d, dk) {
  const ws = shuffle(dk).slice(0, 6);
  return { d, ws, pics: shuffle(ws.map((_, i) => i)), words: shuffle(ws.map((_, i) => i)), sp: null, ok: [], bad: null, tries: 0 };
}
export function newBuild(d, prev) {
  const pool = sentPool(d).filter(s => { const n = toks(s.en).length; return n >= 4 && n <= 12; });
  const s = pool[Math.floor(Math.random() * pool.length)];
  const t = toks(s.en);
  let order = shuffle(t.map((_, i) => i));
  if (order.every((v, i) => v === i)) order.reverse();
  const keep = prev && prev.d === d;
  return { d, s, t, order, ans: [], res: null, score: keep ? prev.score : 0, n: keep ? prev.n : 0 };
}
export function newDict(d) {
  const pool = sentPool(d);
  const dl = pool.filter(s => s.vi), ex = pool.filter(s => !s.vi);
  return { d, list: [...shuffle(dl).slice(0, 6), ...shuffle(ex).slice(0, 4)], i: 0, res: null, val: "", score: 0 };
}
function qCounts(d) {
  if (L[d]) return [L[d].v.length, 3];
  if (d in REV) return [10, 8];
  if (d === 90) return [20, 20];
  if (d === 89) return [15, 15];
  return d % 30 === 0 ? [15, 12] : [12, 10];
}
export function buildQuiz(d, hard) {
  const words = deck(d, hard), gq = scope(d).flatMap(x => L[x].q), [nv, ng] = qCounts(d);
  let vw = L[d] ? shuffle(words) : [...shuffle(words.filter(x => isHard(hard, x))), ...shuffle(words.filter(x => !isHard(hard, x)))];
  vw = shuffle(vw.slice(0, nv));
  const items = vw.map(w => {
    const others = shuffle(ALL_WORDS.filter(x => x[0] !== w[0] && x[2] !== w[2] && pic(x) !== pic(w))).slice(0, 3);
    const opts = shuffle([w, ...others]);
    const r = Math.random();
    if (r < .34) return { p: "Which word matches this picture?", pic: pic(w), o: opts.map(x => x[0]), a: opts.indexOf(w) };
    return r < .67
      ? { p: "Which word means “" + w[2] + "” in Vietnamese?", o: opts.map(x => x[0]), a: opts.indexOf(w) }
      : { p: "What does “" + w[0] + "” mean? Choose the Vietnamese meaning.", o: opts.map(x => x[2]), a: opts.indexOf(w), vi: true };
  });
  shuffle(gq).slice(0, ng).forEach(q => {
    const idx = shuffle([0, 1, 2]);
    items.push({ p: q[0], o: idx.map(i => q[1][i]), a: idx.indexOf(q[2]) });
  });
  return { d, items, ans: items.map(() => null) };
}

export const TABS = [["plan", "Today's plan"], ["old", "Review"], ["vocab", "Vocabulary"], ["talk", "Dialogue"], ["grammar", "Grammar"], ["build", "Sentence builder"], ["dict", "Dictation"], ["quiz", "Quiz"], ["speak", "Writing & speaking"]];
