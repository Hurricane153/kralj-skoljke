'use strict';
/* KRALJ ŠKOLJKE — najgluplja igrica na svijetu */

const ASSETS = window.ASSETS || {};
const src = p => ASSETS[p] || p;
const $ = id => document.getElementById(id);
const rand = (a, b) => a + Math.random() * (b - a);
const ri = (a, b) => Math.floor(rand(a, b + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const chance = p => Math.random() < p;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const wpick = t => { let s = 0; for (const o of t) s += o.w; let r = Math.random() * s; for (const o of t) { r -= o.w; if (r <= 0) return o; } return t[t.length - 1]; };

const NF = 11;
const NO_CROWN = new Set([0, 6]);
const KS = 1.25; // veličina kralja
const faces = [], photos = [];
const API = 'https://n8n.srv1093689.hstgr.cloud/webhook/kralj-skoljke';

/* ---------------- TEKSTOVI ---------------- */
const QUOTES = ['Di mi je senf?!', 'Ovo je moj tron. MOJ!', 'Ne gledaj me dok sjedim', 'Još jedan hot dog pa dijeta',
  'Mama, letim na školjki!', 'Tko je potrošio sav papir?!', 'Kraljevi ne kucaju', 'Ovo nije bilo u opisu posla',
  'Osjećam se kraljevski', 'Školjka ide 0-100 za 3 sekunde', 'Je li netko vidio moje hlače?', 'Hot dog je povrće. Kralj je rekao.',
  'Zašto letim? Ne znam.', 'Gdje je kočnica?!', 'Ja sam kralj, ti si pijun', 'Koja je WiFi lozinka?', 'Ups.', 'Brokula?! FUJ!',
  'Kraljevski izvještaj: sve OK', 'Najbolji dan mog života', 'Gledaj, bez ruku! (lažem)', 'Ne pitaj.', 'Netko je prdnuo. Nisam ja.',
  'Miriše na pobjedu', 'Kruna me žulja', 'Ovo je moj radni dan', 'Trebam veću školjku', 'Hot dog, gdje si?!', 'Kralj je gladan!',
  'Zovite mi senf', 'Plašt je iz Pepca', 'Imam pravo na pauzu', 'Ovo će biti na TikToku'];
const START_QUOTES = ['Polijećemo!', 'Vežite pojaseve!', 'Daska je topla, krećemo!', 'Kralj ide po hot dogove!'];
const BOMB = ['BOK!', 'Što radiš?', 'Jesi vidio moj hot dog?', 'Ja sam i ovdje.', 'Samo prolazim...', 'Psst... imaš senf na licu',
  'Tko je ugasio vodokotlić?', 'Ne igraj se, radi nešto!', 'Ovo je moja igrica', 'Kuc kuc', 'Iznenađenje!', 'Pozdrav iz kupaone'];
const TIPS = ['Savjet: hot dog dobro, brokula loše.', 'Savjet: 👑 pokreće nešto. Ne znamo što.', 'Savjet: 🧻 je život.',
  'Savjet: 🌶️ = TURBO. Vjeruj nam.', 'Ova igrica je testirana na 0 ljudi.', 'Nijedna školjka nije ozlijeđena u izradi ove igre.',
  'Savjet: vuci prstom bilo gdje po ekranu.', 'Savjet: ako se ekran okrene, okreni i mobitel. (nemoj)',
  'Savjet: morski psi ne bi trebali letjeti. Ali lete.', 'Savjet: tapni na sliku kralja.', 'Savjet: tapni naslov 5 puta. Ili nemoj.',
  'Savjet: registriraj se i postani Kralj kraljeva. 🏆', 'Savjet: 🎁 je iznenađenje. Ponekad loše.', 'Savjet: kad zazvoni mama, javi se. Ili nemoj.',
  'Savjet: kad je pod lava, ne stoj na podu.', 'Savjet: jedi hot dogove brzo zaredom za KOMBO.', 'Savjet: baka je spora, ali uporna.',
  'Savjet: 🩴 dolazi od mame. Izbjegavaj.', 'Savjet: 🧲 privlači hot dogove. I probleme.'];
const SUBS = ['Verzija 0.0.1 — 100% bez bugova (laž)', 'Najgluplja igrica na svijetu™', 'Sad i s mirisom! (ne)',
  'Odobreno od strane Kralja', 'Igra godine 2026. (po izboru kralja)', 'Napravljeno u WC-u', 'Bez reklama, samo prdci',
  'Verzija 2.0 — sad s bakom i papučama', 'Sad i s ljestvicom! Tko je pravi kralj?', 'Mama zove. Opet.'];
const LOADS = ['Grijem dasku…', 'Punim vodokotlić…', 'Brišem senf s kamere…', 'Pregovaram s morskim psima…', 'Peglam plašt…',
  'Učitavam 4 GB hot dogova…', 'Kalibriram prdce…', 'Skrivam brokulu…', 'Glancam krunu…', 'Tražim hlače…', 'Odmotavam rolicu…',
  'Zovem mamu…', 'Skrivam papuče…', 'Budim baku…', 'Brojim kraljeve na ljestvici…', 'Grijem lavu…'];
const CAPS = ['Službeni portret, 2026.', 'Kralj na radnom mjestu', 'Ovo je bio ozbiljan sastanak', 'Kad kažeš "samo još jedan hot dog"',
  'Ponedjeljak ujutro', 'Kralj odbija ustati', 'Ova slika visi u Louvreu (u WC-u)', 'Pogled kad netko pokuca', 'Kraljevska audijencija',
  'Snimljeno bez dozvole', 'Školjka je bila topla', 'Najskuplja slika na svijetu', 'Ne pitaj kako je tu dospio',
  'Hot dog je bio odličan, kaže kralj', 'Prije nego što je postao kralj', 'Dokaz na sudu, slika br. 1', 'Kralj i njegov najbolji prijatelj (hot dog)',
  'Ovo je AI. Ili je? 🤔', 'Kad ti netko pojede zadnji hot dog', 'Kraljevski TikTok, epizoda 47'];
const HITS = ['AU!', 'JAOOO!', 'MOJA KRUNA!', 'NEEE!', 'AUČ!', 'TKO TO BACA?!', 'BOLI!', 'MAMAAA!'];
const NOMS = ['NJAM!', 'MMM!', 'SLASNO!', 'JOŠ!', 'NOM NOM', 'GUTLJAJ!', 'MLJAC!'];
const OVERH = ['KRALJ JE PAO SA ŠKOLJKE!', 'KRAJ KRALJEVANJA!', 'GAME OVER (ZA KRALJA)', 'ŠKOLJKA JE POTONULA!', 'KRALJ JE IZGUBIO KRUNU!'];
const T_PRE = ['Njegovo Veličanstvo', 'Car', 'Nadvojvoda', 'Admiral', 'Sveti', 'Vrhovni', 'Grof', 'Princ', 'Šeik', 'Faraon'];
const T_MID = ['Hot Doga', 'Školjke', 'Senfa', 'Rolice', 'Klipa', 'Kečapa', 'Daske', 'Vodokotlića', 'Kobasice', 'Plašta'];
const T_SUF = ['Veliki', 'Sjedeći', 'Neumorni', 'Ljepljivi', 'Leteći', 'Gladni', 'Prdljivi', 'Nepobjedivi', 'Mirisni', 'Nasmijani', 'Bez Hlača'];
const RANKS = [[0, 'Pripravnik za školjku'], [10, 'Vitez Rolice'], [25, 'Barun Kečapa'], [45, 'Vojvoda Senfa'], [70, 'KRALJ ŠKOLJKE'], [110, 'CAR SVIH HOT DOGOVA'], [170, 'BOG ŠKOLJKE (cheater?)']];
const QUIZ = [['Koliko hot dogova je previše?', ['10', 'Ne postoji previše']], ['Smije li kralj ustati sa školjke?', ['Da', 'NIKADA']],
  ['Koliko je 2 + 2?', ['4', '🌭']], ['Tko je kralj?', ['On', 'Također on']], ['Koje je boje senf?', ['Žute', 'Kraljevske']],
  ['Je li ovo najbolja igrica ikad?', ['Da', 'Apsolutno da']], ['Što kralj radi na školjki?', ['Razmišlja', 'Ne tiče te se']],
  ['Kamo leti školjka?', ['Gore', 'Nitko ne zna']], ['Gdje su kraljeve hlače?', ['Na gležnjevima', 'Državna tajna']],
  ['Koliko kralj ima kruna?', ['Jednu', 'Nikad dovoljno']], ['Je li pod lava?', ['Nije', 'UVIJEK']],
  ['Što baka nosi u torbi?', ['Papuču', 'Juhu']], ['Koliko traje kraljevska pauza?', ['5 minuta', '3 sata']],
  ['Smije li se kralju reći ne?', ['Ne', 'Također ne']], ['Koji je kraljev omiljeni sport?', ['Sjedenje', 'Jedenje']]];
const NAME_Q = ['{n}, di mi je senf?!', 'Ovo je za tebe, {n}!', '{n}, ne gledaj!', '{n}, jesi vidio moju krunu?', 'Pozdrav, {n}!',
  '{n} je najbolji kralj. Odmah nakon mene.', '{n}, donesi mi hot dog!', '{n}, ovo nikome ne pričaj.', 'Za {n}! 🌭'];
const DECREES = [
  ['Brokula je od danas hot dog!', 'svi neprijatelji na ekranu su sad hot dogovi', () => { for (const o of G.objs) if (!o.good && !o.side) { o.good = true; o.d = GOOD[0]; } }],
  ['Svi hot dogovi su sad ZLATNI!', 'kralj je danas dobre volje', () => { for (const o of G.objs) if (o.good && o.d.k === 'dog') o.d = GOOD[1]; }],
  ['Ponedjeljak je zabranjen.', 'nema efekta, ali lijepo zvuči', () => { }],
  ['Porez na prdce iznosi 1 hot dog.', 'kralj je platio. nerado.', () => { G.score = Math.max(0, G.score - 1); SFX.fart(.6, 70, .4); }],
  ['Kralj zaslužuje odmor!', 'svi neprijatelji su otpušteni', () => { G.objs = G.objs.filter(o => o.good); }],
  ['Svi moraju jesti brokulu!', 'čak i kralj. nažalost.', () => { for (let i = 0; i < 6; i++) spawn(false, { d: BAD[1], y: -rand(20, H * .6) }); }],
  ['Kralj je proglasio sam sebe kraljem. Opet.', '+1 🧻 za hrabrost', () => { G.lives = Math.min(5, G.lives + 1); }],
  ['Hlače su od danas neobavezne.', 'kralj je zakon ispunio unaprijed', () => { G.score += 2; }]];
const CALL_YES = [
  ['Mama: „Jesi jeo?” Kralj: „Hot dogove.” Mama je ponosna. +1 🧻', () => { G.lives = Math.min(5, G.lives + 1); }],
  ['Mama: „Kad ćeš se oženiti?” Kralj je glumio da nema signala. 📵', () => { }],
  ['Mama: „Kupi kruha usput.” Kralj je kupio hot dogove. +3 🌭', () => { G.score += 3; }],
  ['Mama je pričala 45 minuta. Kralj je zaspao. 😴', () => G.pending.push('sleepy')],
  ['Mama: „Obuci se, hladno je!” Kralj je obukao još jedan plašt. +1 🧻', () => { G.lives = Math.min(5, G.lives + 1); }],
  ['Mama: „Je li to školjka iza tebe?!” Kralj je prekinuo vezu.', () => { }]];
const CALL_NO = [
  ['Mama zove opet. I opet. I opet. 🙃', () => G.pending.push('invert')],
  ['Mama je ljuta. Papuče lete! 🩴', () => slippers(7)],
  ['Mama je poslala baku. 👵', () => G.pending.push('baka')],
  ['Mama je poslala poruku: „??”. Kralj se boji. -1 🌭', () => { G.score = Math.max(0, G.score - 1); }],
  ['Mama je razumjela. (nije) 😐', () => { }]];
const BAKA_Q = ['Jesi jeo?!', 'Dođi ovamo!', 'Obuci se!', 'Gdje su ti hlače?!', 'Pojedi juhu!', 'Ostavi taj hot dog!', 'Kad ćeš se oženiti?'];
const GIFTS = [
  ['🎁 +10 hot dogova!', () => { G.score += 10 * scoreMult(); SFX.fanfare(); }],
  ['🎁 Rolica papira! +1 🧻', () => { G.lives = Math.min(5, G.lives + 1); SFX.coin(); }],
  ['🎁 Čarape. Hvala, bako.', () => { SFX.sad(); }],
  ['🎁 Iznenađenje!', () => randomEvent(true)],
  ['🎁 Brokula u kutiji?! 🥦', o => hurt({ d: { e: '🥦', c: 'Otvorio je poklon. Unutra je bila brokula.' }, x: o.x, y: o.y }, true)]];

function roman(n) { const m = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]; let s = ''; for (const [v, r] of m) while (n >= v) { s += r; n -= v; } return s; }
function royalTitle() { return `${pick(T_PRE)} ${pick(T_MID)} ${roman(chance(.2) ? ri(100, 3999) : ri(1, 49))}. ${pick(T_SUF)}`; }

/* ---------------- CANVAS ---------------- */
const C = $('c'), ctx = C.getContext('2d');
let W = 0, H = 0, DPR = 1, U = 1;
function resize() {
  DPR = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight;
  C.width = Math.round(W * DPR); C.height = Math.round(H * DPR); C.style.width = W + 'px'; C.style.height = H + 'px';
  U = clamp(Math.min(W, H * 0.62) / 400, 0.72, 1.6);
  if (P) clampP();
}
addEventListener('resize', resize);
const FONT = px => `900 ${Math.round(px)}px "Arial Black", Impact, system-ui, sans-serif`;

/* emoji cache */
const EC = new Map();
function emo(e, px) {
  px = Math.max(8, Math.round(px / 4) * 4); const k = e + '|' + px; let c = EC.get(k); if (c) return c;
  c = document.createElement('canvas'); const s = Math.ceil(px * 1.4); c.width = c.height = s; const g = c.getContext('2d');
  g.font = `${px}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(e, s / 2, s / 2 + px * 0.05); EC.set(k, c); return c;
}
function drawEmo(e, x, y, size, rot = 0, alpha = 1) {
  const c = emo(e, size * DPR); const s = (c.width / DPR) * (size * DPR / (Math.max(8, Math.round(size * DPR / 4) * 4)));
  ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(x, y); if (rot) ctx.rotate(rot); ctx.drawImage(c, -s / 2, -s / 2, s, s); ctx.restore();
}
function outText(t, x, y, px, fill = '#fff', align = 'center') {
  ctx.font = FONT(px); ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.lineWidth = Math.max(3, px / 5); ctx.strokeStyle = '#000'; ctx.strokeText(t, x, y); ctx.fillStyle = fill; ctx.fillText(t, x, y);
}
function rrect(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

/* ---------------- ZVUK ---------------- */
let AC = null, NOISE = null, muted = localStorage.getItem('ks_mute') === '1';
function ac() {
  try { if (!AC) { const K = window.AudioContext || window.webkitAudioContext; if (!K) return null; AC = new K(); } if (AC.state === 'suspended') AC.resume(); } catch (e) { return null; }
  return AC;
}
function noiseBuf(a) { if (NOISE) return NOISE; const b = a.createBuffer(1, a.sampleRate * 1.6, a.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return (NOISE = b); }
function env(g, t, peak, att, hold, rel) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + att); g.gain.setValueAtTime(peak, t + att + hold); g.gain.exponentialRampToValueAtTime(0.0001, t + att + hold + rel); }
const SFX = {
  fart(len = rand(.25, .9), p = rand(45, 110), vol = .45) {
    const a = ac(); if (!a || muted) return; const t = a.currentTime;
    const o = a.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(p, t); o.frequency.linearRampToValueAtTime(p * rand(.55, 1.3), t + len);
    const l = a.createOscillator(); l.frequency.setValueAtTime(rand(14, 32), t); const lg = a.createGain(); lg.gain.value = p * .45; l.connect(lg); lg.connect(o.frequency);
    const n = a.createBufferSource(); n.buffer = noiseBuf(a); const ng = a.createGain(); ng.gain.value = .35; n.connect(ng);
    const f = a.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(rand(380, 900), t); f.frequency.linearRampToValueAtTime(rand(200, 400), t + len); f.Q.value = 4;
    const am = a.createGain(); am.gain.value = .55; const l2 = a.createOscillator(); l2.type = 'square'; l2.frequency.value = rand(10, 26); const l2g = a.createGain(); l2g.gain.value = .45; l2.connect(l2g); l2g.connect(am.gain);
    const g = a.createGain(); env(g, t, vol, .02, len * .6, len * .4);
    o.connect(f); ng.connect(f); f.connect(am); am.connect(g); g.connect(a.destination);
    for (const x of [o, l, l2]) { x.start(t); x.stop(t + len + .05); } n.start(t, rand(0, .4)); n.stop(t + len + .05);
  },
  tone(type, f1, f2, len, vol = .25, delay = 0) {
    const a = ac(); if (!a || muted) return; const t = a.currentTime + delay; const o = a.createOscillator(); o.type = type;
    o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(f2, t + len); const g = a.createGain(); env(g, t, vol, .01, len * .3, len * .7);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + len + .05);
  },
  nom() { this.tone('square', rand(500, 700), rand(200, 300), .08, .12); this.tone('square', rand(700, 900), rand(300, 400), .08, .1, .09); },
  coin() { this.tone('square', 880, 880, .07, .1); this.tone('square', 1320, 1320, .14, .1, .07); },
  boing() {
    const a = ac(); if (!a || muted) return; const t = a.currentTime; const o = a.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(420, t); o.frequency.exponentialRampToValueAtTime(70, t + .5); const l = a.createOscillator(); l.frequency.value = 22;
    const lg = a.createGain(); lg.gain.value = 40; l.connect(lg); lg.connect(o.frequency); const g = a.createGain(); env(g, t, .4, .01, .1, .45);
    o.connect(g); g.connect(a.destination); o.start(t); l.start(t); o.stop(t + .62); l.stop(t + .62);
  },
  fanfare() { [523, 659, 784, 1046].forEach((f, i) => this.tone('square', f, f * 1.001, .14, .09, i * .1)); },
  sad() { [392, 370, 349, 330].forEach((f, i) => this.tone('triangle', f, f * .97, .35, .2, i * .3)); },
  sneeze() { this.tone('sine', 300, 900, .25, .15); setTimeout(() => this.fart(.18, 200, .3), 260); },
  kick() { this.tone('sine', 160, 40, .14, .35); },
  noise(len, f1, f2, vol = .3, type = 'lowpass', q = 1) {
    const a = ac(); if (!a || muted) return; const t = a.currentTime;
    const n = a.createBufferSource(); n.buffer = noiseBuf(a); const f = a.createBiquadFilter(); f.type = type; f.Q.value = q;
    f.frequency.setValueAtTime(f1, t); f.frequency.exponentialRampToValueAtTime(f2, t + len);
    const g = a.createGain(); env(g, t, vol, .01, len * .5, len * .5); n.connect(f); f.connect(g); g.connect(a.destination); n.start(t); n.stop(t + len + .05);
  },
  shutter() { this.noise(.06, 4000, 2500, .35, 'bandpass', 2); setTimeout(() => this.noise(.05, 3000, 2000, .25, 'bandpass', 2), 70); },
  flush() { this.noise(1.6, 2400, 160, .5, 'lowpass', 6); [0, .3, .6, .9].forEach(d => this.tone('sine', rand(180, 260), rand(60, 90), .25, .12, d)); },
  quack() { this.tone('sawtooth', 620, 380, .12, .12); this.tone('sawtooth', 560, 340, .12, .1, .13); },
  ring() { [0, .16].forEach(d => { this.tone('square', 1046, 1046, .12, .07, d); this.tone('square', 1318, 1318, .12, .07, d + .07); }); },
  sizzle() { this.noise(.4, 6000, 3000, .15, 'highpass', 1); },
};
function buzz(ms) { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) { } }

/* ---------------- STANJE ---------------- */
const P = { x: 0, y: 0, scale: 1, head: 1, face: 10, faceOv: -1, inv: 0, tilt: 0, rot: 0, lx: 0, vx: 0, vy: 0 };
const G = {
  state: 'load', t: 0, score: 0, lives: 3, best: +(localStorage.getItem('ks_best') || 0), objs: [], parts: [], texts: [], deco: [],
  spawnT: 0, eventT: 0, ev: null, evLeft: 0, shake: 0, cause: '', quoteT: 0, quote: null, bomb: null, hist: [], cloneFaces: [],
  bg: 'sky', flash: 0, flipA: 0, windDir: 1, windT: 0, beatT: 0, fartT: 0, turboT: 0, dieT: 0, secret: false, lastEv: '', pending: [],
  combo: 0, comboT: 0, tm: [], baka: null, pola: null, flushT: 0, lavaK: 0, spinA: 0, lagQ: [], title: '', bnT: 0,
};
const after = (t, fn) => G.tm.push({ t, fn });

const GOOD = [{ e: '🌭', w: 10, k: 'dog' }, { e: '🌭', w: .3, k: 'gold' }, { e: '👑', w: 1.1, k: 'crown' }, { e: '🧻', w: .9, k: 'paper' }, { e: '🌶️', w: .6, k: 'chili' },
  { e: '🎁', w: .45, k: 'gift' }, { e: '🧲', w: .35, k: 'magnet' }];
const PIZZA = { e: '🍕', k: 'pizza' }, DUCK = { e: '🦆', k: 'duck' };
const SLIPPER = { e: '🩴', c: 'Mama je bacila papuču. Precizno, kao i uvijek.', spin: 1 };
const BAD = [
  { e: '🪠', w: 3, c: 'Udaren klipom ravno u krunu', spin: 1 }, { e: '🥦', w: 3, c: 'Pojeo brokulu. Zdravlje ga je ubilo.' },
  { e: '🥗', w: 2, c: 'Netko mu je podvalio salatu' }, { e: '⏰', w: 2, c: 'Zazvonila budilica. Morao je na posao.' },
  { e: '🧾', w: 2, c: 'Stigao mu je račun za struju' }, { e: '📚', w: 2, c: 'Sjetio se da sutra ima ispit' },
  { e: '🧦', w: 2, c: 'Onesvijestio se od smrdljive čarape' }, { e: '🐦', w: 2, c: 'Golub mu je sletio na krunu', zig: 1 },
  { e: '🧹', w: 1.5, c: 'Mama je počela čistiti kupaonicu' }, { e: '🦈', w: 1, c: 'Morski pas mu je ukrao hot dog', zig: 1 },
  { e: '🥒', w: 1.3, c: 'Krastavac. Nema objašnjenja.' }, { e: '📞', w: 1, c: 'Zvala ga je baka. Morao se javiti.' },
  { e: '🩴', w: 1.6, c: 'Mama je bacila papuču. Precizno, kao i uvijek.', spin: 1 }, { e: '🧼', w: 1.1, c: 'Poskliznuo se na sapun. U zraku.' },
  { e: '📧', w: 1.1, c: 'Stigao mu je mail od šefa' }, { e: '🦟', w: 1.1, c: 'Komarac ga je izludio', zig: 1 },
  { e: '🧄', w: .9, c: 'Češnjak. Kralj nije vampir, ali svejedno.' }, { e: '🥬', w: .9, c: 'Kelj. Gore i od brokule.' }];
const SEA_BAD = [{ e: '🦈', w: 3, c: 'Morski pas ga je pojeo zajedno s krunom', zig: 1 }, { e: '🐙', w: 2, c: 'Hobotnica ga je preJAKO zagrlila', zig: 1 },
  { e: '🐡', w: 2, c: 'Ubola ga riba napuhača' }, { e: '🦀', w: 2, c: 'Rak ga je uštipnuo. Ne pitaj gdje.' }, { e: '🪼', w: 1.5, c: 'Opekla ga meduza', zig: 1 }];
const SPACE_BAD = [{ e: '🪐', w: 3, c: 'Zabio se u Saturn. Kralj ne zna voziti.', big: 1 }, { e: '☄️', w: 3, c: 'Pogodio ga je meteor (rijetko, ali eto)' },
  { e: '👽', w: 2, c: 'Oteli su ga vanzemaljci', zig: 1 }, { e: '🛸', w: 1.5, c: 'Pregazio ga je NLO', zig: 1 }, { e: '🌑', w: 1, c: 'Mjesec mu je zaklonio pogled', big: 1 }];

const EVENTS = [
  { id: 'invert', n: '🙃 OBRNUTE KONTROLE', s: 'lijevo je desno. valjda.', d: 7 },
  { id: 'flip', n: '🔄 SVIJET NAOPAČKE', s: 'nije mobitel, to je svemir', d: 7 },
  { id: 'sea', n: '🌊 PODMORJE', s: 'kralj ne zna plivati', d: 9 },
  { id: 'space', n: '🚀 SVEMIR', s: 'školjka je otišla predaleko', d: 9 },
  { id: 'giant', n: '🦍 DIVOVSKI KRALJ', s: 'previše hot dogova', d: 7 },
  { id: 'mini', n: '🐜 MINI KRALJ', s: 'smanjio se na pranju', d: 7 },
  { id: 'bighead', n: '🎈 VELIKA GLAVA', s: 'ego je narastao', d: 7 },
  { id: 'disco', n: '🪩 DISKO ŠKOLJKA', s: 'unce unce unce', d: 8 },
  { id: 'turbo', n: '💨 TURBO PROLJEV', s: 'duplo bodova, duplo brzine', d: 6 },
  { id: 'clones', n: '👯 KLONOVI KRALJA', s: 'pravi je onaj prvi', d: 8 },
  { id: 'wind', n: '🌪️ VJETAR', s: 'netko je otvorio prozor', d: 7 },
  { id: 'slow', n: '🐌 SPORO', s: 'kralj se opustio', d: 6 },
  { id: 'dark', n: '🌚 MRAK', s: 'tko je ugasio svjetlo?!', d: 7 },
  { id: 'quake', n: '🫨 ZEMLJOTRES', s: 'ili je to bio grah', d: 5 },
  { id: 'heavy', n: '🧱 KRALJ JE TEŽAK', s: 'previše senfa. vuci gore!', d: 6 },
  { id: 'double', n: '✨ DUPLI BODOVI', s: 'kralj je velikodušan', d: 8 },
  { id: 'ice', n: '🧊 KLIZAVO', s: 'netko je prolio sapunicu', d: 7 },
  { id: 'magnet', n: '🧲 MAGNET ZA HOT DOGOVE', s: 'kralj je privlačan', d: 7, w: .8 },
  { id: 'ghost', n: '👻 NEVIDLJIVI KRALJ', s: 'ne vidi ni sam sebe', d: 6 },
  { id: 'lava', n: '🌋 POD JE LAVA!', s: 'ne diraj dno ekrana!', d: 8 },
  { id: 'baka', n: '👵 BAKA TE LOVI!', s: 'jesi jeo?!', d: 9 },
  { id: 'sleepy', n: '😴 POSPANI KRALJ', s: 'kralj kasni. kao i uvijek.', d: 6 },
  { id: 'spin', n: '🌀 VRTOGLAVICA', s: 'previše hot dogova', d: 7 },
  { id: 'bounce', n: '🤡 TRAMPOLIN', s: 'sve odskače. sve.', d: 7 },
  { id: 'pizza', n: '🍕 PIZZA PETAK', s: 'nije hot dog, ali ajde. ×2', d: 7, w: .8 },
  { id: 'rain', n: '🌭 HOT DOG KIŠA!', s: 'otvori usta', inst: 1, w: 1.3 },
  { id: 'flush', n: '🚽 VELIKO ISPIRANJE', s: 'sve ide u kanalizaciju', inst: 1, w: .7 },
  { id: 'decree', inst: 1, w: .9 },
  { id: 'mama', inst: 1, w: .6 },
  { id: 'paparazzi', n: '📸 PAPARAZZI!', s: 'kralj je slavan', inst: 1, w: .8 },
  { id: 'ducks', n: '🦆 PATKE U PROLAZU', s: 'kvak = +2', inst: 1, w: .8 },
  { id: 'swap', n: '🔀 NOVI KRALJ', s: 'isti kralj, nova kruna', inst: 1, w: .8 },
  { id: 'sneeze', n: '🤧 HAPČI!', s: 'kralj se teleportirao', inst: 1, w: .8 },
  { id: 'sharks', n: '🦈 MORSKI PSI!', s: 'odakle u zraku?!', inst: 1, w: .8 },
  { id: 'bomb', inst: 1, w: 1.4 },
  { id: 'quiz', inst: 1, w: .7 },
];
EVENTS.forEach(e => { if (e.w == null) e.w = 1; });
const EV = id => EVENTS.find(e => e.id === id);
const evIs = id => G.ev && G.ev.id === id;

/* ---------------- UI ---------------- */
const screens = ['load', 'menu', 'pause', 'quiz', 'over', 'gal', 'view', 'hint', 'lb', 'acc', 'call'];
function showScr(id) { for (const s of screens) $(s).classList.toggle('on', s === id); }
function overlay(id, on) { $(id).classList.toggle('on', on); }
let bannerTO = 0;
function banner(n, s) {
  const b = $('banner'); b.innerHTML = n + (s ? `<small>${s}</small>` : ''); b.classList.remove('on'); void b.offsetWidth; b.classList.add('on');
  clearTimeout(bannerTO); bannerTO = setTimeout(() => b.classList.remove('on'), 2100);
}
let hudCache = '';
function hud() {
  const mult = scoreMult() * comboMult();
  const s = `🌭 ${G.score}${mult > 1 ? ' ×' + mult : ''}|${'🧻'.repeat(Math.max(0, G.lives))}`;
  if (s === hudCache) return; hudCache = s; const [a, b] = s.split('|'); $('hScore').textContent = a; $('hLives').textContent = b || '💀';
}
function setPhoto(el, i) { el.style.backgroundImage = `url("${src('img/p' + i + '.webp')}")`; }

/* ---------------- POZADINA ---------------- */
function setBg(m) {
  G.bg = m; G.flash = 1; G.deco = [];
  const n = m === 'space' ? 70 : m === 'sea' ? 26 : 9;
  for (let i = 0; i < n; i++) G.deco.push(newDeco(rand(-.1, 1.1) * H));
}
function newDeco(y) {
  if (G.bg === 'space') return { x: rand(0, W), y, s: rand(.5, 2.4), sp: rand(.2, 1) };
  if (G.bg === 'sea') return { x: rand(0, W), y, s: rand(3, 10) * U, sp: rand(.3, 1) };
  return { x: rand(-60, W + 60), y, s: rand(.6, 1.6) * U, sp: rand(.25, .6) };
}
function drawBg(dt, wsp) {
  let g;
  if (G.bg === 'space') { g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#05000f'); g.addColorStop(1, '#2b0a4a'); }
  else if (G.bg === 'sea') { g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0a3d62'); g.addColorStop(1, '#19a3c9'); }
  else { g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#2f6fd0'); g.addColorStop(.55, '#8cc8ff'); g.addColorStop(1, '#ffb36b'); }
  ctx.fillStyle = g; ctx.fillRect(-30, -30, W + 60, H + 60);
  for (const d of G.deco) {
    if (G.bg === 'sea') {
      d.y -= (40 + 60 * d.sp) * U * dt; d.x += Math.sin(G.t * 2 + d.y * .02) * .4;
      if (d.y < -20) Object.assign(d, newDeco(H + 20));
      ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(d.x, d.y, d.s, 0, 7); ctx.stroke();
    } else {
      d.y += wsp * d.sp * dt;
      if (d.y > H + 80) Object.assign(d, newDeco(-80));
      if (G.bg === 'space') { ctx.fillStyle = `rgba(255,255,255,${.4 + .6 * d.sp})`; ctx.fillRect(d.x, d.y, d.s, d.s * (1 + d.sp * 3)); }
      else {
        ctx.fillStyle = 'rgba(255,255,255,.85)'; const s = d.s * 30;
        ctx.beginPath(); ctx.arc(d.x, d.y, s, 0, 7); ctx.arc(d.x + s * .9, d.y + s * .2, s * .75, 0, 7); ctx.arc(d.x - s * .9, d.y + s * .25, s * .7, 0, 7); ctx.fill();
      }
    }
  }
  if (G.bg === 'sea') { ctx.fillStyle = 'rgba(255,255,255,.05)'; for (let i = 0; i < 4; i++) { const x = (i * W / 3 + Math.sin(G.t * .5 + i) * 40); ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 60, 0); ctx.lineTo(x - 80, H); ctx.lineTo(x - 160, H); ctx.fill(); } }
}

/* ---------------- KRALJ ---------------- */
function curFace() { return P.faceOv >= 0 ? P.faceOv : P.face; }
function drawKing(x, y, sc, headK, fi, alpha = 1, extraRot = 0) {
  const s = sc * U * KS, t = G.t;
  ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.rotate(Math.sin(t * 2.3) * .05 + P.tilt + extraRot);
  // plamen iz raketa
  for (const side of [-1, 1]) {
    const fx = side * 27 * s, fy = 30 * s, fl = (16 + Math.random() * 16) * s * (evIs('turbo') ? 2 : 1);
    const gr = ctx.createLinearGradient(0, fy, 0, fy + fl); gr.addColorStop(0, '#fff6a0'); gr.addColorStop(.4, '#ffae00'); gr.addColorStop(1, 'rgba(255,40,0,0)');
    ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(fx - 6 * s, fy); ctx.quadraticCurveTo(fx, fy + fl * 1.3, fx + 6 * s, fy); ctx.fill();
  }
  // plašt
  const wv = Math.sin(t * 6) * 4 * s;
  ctx.fillStyle = '#b3122a'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 3 * s;
  ctx.beginPath(); ctx.moveTo(-15 * s, -24 * s); ctx.quadraticCurveTo(-38 * s - wv, -2 * s, -40 * s + wv, 22 * s); ctx.lineTo(40 * s - wv, 22 * s);
  ctx.quadraticCurveTo(38 * s + wv, -2 * s, 15 * s, -24 * s); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#000'; for (let i = -3; i <= 3; i++) { ctx.fillRect(i * 11 * s - s, 20 * s, 2 * s, 3 * s); }
  // rakete
  ctx.fillStyle = '#9aa3ad'; ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5 * s;
  for (const side of [-1, 1]) { rrect(side * 27 * s - 6 * s, 10 * s, 12 * s, 21 * s, 4 * s); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#d4a017'; ctx.fillRect(side * 27 * s - 6 * s, 14 * s, 12 * s, 3 * s); ctx.fillStyle = '#9aa3ad'; }
  // školjka
  ctx.fillStyle = '#f6f6f6'; ctx.strokeStyle = '#7d7d7d'; ctx.lineWidth = 1.6 * s;
  ctx.beginPath(); ctx.moveTo(-28 * s, 8 * s); ctx.bezierCurveTo(-28 * s, 24 * s, -16 * s, 30 * s, -12 * s, 31 * s); ctx.lineTo(-13 * s, 39 * s); ctx.lineTo(13 * s, 39 * s);
  ctx.lineTo(12 * s, 31 * s); ctx.bezierCurveTo(16 * s, 30 * s, 28 * s, 24 * s, 28 * s, 8 * s); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(0, 8 * s, 30 * s, 8 * s, 0, 0, 7); ctx.fill(); ctx.stroke();
  // tijelo (crna majica + lanac)
  ctx.fillStyle = '#1b1b1f'; rrect(-17 * s, -27 * s, 34 * s, 36 * s, 9 * s); ctx.fill();
  ctx.strokeStyle = '#f2c230'; ctx.lineWidth = 2.2 * s; ctx.beginPath(); ctx.moveTo(-10 * s, -25 * s); ctx.quadraticCurveTo(0, -6 * s, 10 * s, -25 * s); ctx.stroke();
  ctx.fillStyle = '#c0102a'; ctx.beginPath(); ctx.arc(0, -14 * s, 3.2 * s, 0, 7); ctx.fill(); ctx.stroke();
  // noge, hlače na gležnjevima, tenisice
  ctx.fillStyle = '#f0c3a4';
  for (const side of [-1, 1]) { ctx.beginPath(); ctx.ellipse(side * 10 * s, 10 * s, 9 * s, 7 * s, 0, 0, 7); ctx.fill(); ctx.fillRect(side * 12 * s - 5 * s, 12 * s, 10 * s, 17 * s); }
  ctx.fillStyle = '#111'; ctx.beginPath(); ctx.ellipse(0, 30 * s, 25 * s, 6 * s, 0, 0, 7); ctx.fill();
  for (const side of [-1, 1]) {
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#999'; ctx.lineWidth = 1.2 * s; ctx.beginPath(); ctx.ellipse(side * 14 * s, 36 * s, 10 * s, 5 * s, 0, 0, 7); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#111'; ctx.lineWidth = 1.6 * s; ctx.beginPath(); ctx.moveTo(side * 14 * s - 5 * s, 36 * s); ctx.quadraticCurveTo(side * 14 * s, 39 * s, side * 14 * s + 6 * s, 33 * s); ctx.stroke();
  }
  // žezlo + ruka
  ctx.strokeStyle = '#d9a514'; ctx.lineWidth = 3.2 * s; ctx.beginPath(); ctx.moveTo(-27 * s, 16 * s); ctx.lineTo(-31 * s, -46 * s); ctx.stroke();
  ctx.fillStyle = '#f2c230'; ctx.beginPath(); ctx.arc(-31 * s, -49 * s, 5.5 * s, 0, 7); ctx.fill(); ctx.fillStyle = '#c0102a'; ctx.beginPath(); ctx.arc(-31 * s, -49 * s, 2.4 * s, 0, 7); ctx.fill();
  ctx.strokeStyle = '#1b1b1f'; ctx.lineCap = 'round'; ctx.lineWidth = 8 * s;
  ctx.beginPath(); ctx.moveTo(-14 * s, -20 * s); ctx.lineTo(-28 * s, -6 * s); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(14 * s, -20 * s); ctx.lineTo(27 * s, -12 * s); ctx.stroke();
  ctx.fillStyle = '#f0c3a4'; ctx.beginPath(); ctx.arc(-29 * s, -5 * s, 4 * s, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(29 * s, -13 * s, 4 * s, 0, 7); ctx.fill();
  drawEmo('🌭', 33 * s, -19 * s, 20 * s, -.5 + Math.sin(t * 4) * .15);
  // glava
  const R = 27 * s * headK, hy = -40 * s - (headK - 1) * 18 * s;
  ctx.save(); ctx.translate(0, hy); ctx.rotate(Math.sin(t * 5) * .09);
  const img = faces[fi];
  ctx.fillStyle = '#e8b52a'; ctx.beginPath(); ctx.arc(0, 0, R + 2.6 * s, 0, 7); ctx.fill();
  if (img) { ctx.save(); ctx.beginPath(); ctx.arc(0, 0, R, 0, 7); ctx.clip(); ctx.drawImage(img, -R, -R, R * 2, R * 2); ctx.restore(); }
  if (NO_CROWN.has(fi)) drawEmo('👑', 0, -R * .95, R * 1.05, -.25);
  ctx.restore();
  ctx.restore();
}
function kingHit(o) {
  const s = P.scale * U * KS, r = o.size * .36;
  const bx = o.x - P.x, by = o.y - (P.y + 6 * s);
  if (bx * bx + by * by < (24 * s + r) ** 2) return true;
  const hy = P.y - 40 * s - (P.head - 1) * 18 * s, R = 24 * s * P.head;
  const hx = o.x - P.x, hh = o.y - hy;
  return hx * hx + hh * hh < (R + r) ** 2;
}
function clampP() { const m = 24 * U * KS * P.scale; P.x = clamp(P.x, m, W - m); P.y = clamp(P.y, H * .12 + 40 * U * KS * P.scale, H - 44 * U * KS * P.scale); }

/* ---------------- IGRA ---------------- */
function scoreMult() { return (evIs('turbo') || evIs('double')) ? 2 : 1; }
function comboMult() { return G.combo >= 15 ? 3 : G.combo >= 6 ? 2 : 1; }
function fallSpeed() { return (150 + Math.min(G.t, 120) * 2.2) * U; }
function lavaTop() { return H * (1 - .2 * G.lavaK); }
function worldK() { return (evIs('slow') ? .45 : 1) * (evIs('turbo') ? 1.7 : 1) * (evIs('sea') ? .7 : 1); }

function spawn(forceGood, opts = {}) {
  const goodP = G.secret ? .7 : .42;
  const good = forceGood != null ? forceGood : chance(goodP);
  const tbl = good ? GOOD : (G.bg === 'sea' ? SEA_BAD : G.bg === 'space' ? SPACE_BAD : BAD);
  let d = opts.d || wpick(tbl);
  if (d.k === 'dog' && evIs('pizza')) d = PIZZA;
  const size = (d.big ? rand(56, 70) : d.k === 'gold' ? 46 : rand(34, 44)) * U;
  const o = { d, good, x: rand(size / 2, W - size / 2), y: opts.y != null ? opts.y : -size, vy: fallSpeed() * rand(.8, 1.25), vx: d.zig ? rand(-70, 70) * U : rand(-15, 15) * U,
    rot: rand(-.3, .3), vr: d.spin ? rand(-6, 6) : rand(-1.5, 1.5), size, ph: rand(0, 6.3) };
  Object.assign(o, opts.o || {}); G.objs.push(o); return o;
}
function addText(t, x, y, px = 22, col = '#fff', life = 1) { G.texts.push({ t, x, y, px: px * U, col, life, max: life }); }
function addPart(e, x, y, n = 6, sp = 160, size = 20) {
  for (let i = 0; i < n; i++) { const a = rand(0, 6.3), v = rand(.3, 1) * sp * U; G.parts.push({ e, x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rand(.5, 1), max: 1, size: size * U * rand(.7, 1.2), rot: rand(0, 6), vr: rand(-6, 6) }); }
}

function startGame() {
  resize();
  Object.assign(G, { state: 'play', t: 0, score: 0, lives: 3, objs: [], parts: [], texts: [], spawnT: .6, eventT: rand(5, 8), ev: null, evLeft: 0, shake: 0,
    cause: 'Nitko ne zna što se dogodilo', quoteT: 2.5, bomb: null, hist: [], flipA: 0, pending: [], fartT: rand(8, 15), dieT: 0,
    combo: 0, comboT: 0, tm: [], baka: null, pola: null, flushT: 0, lavaK: 0, spinA: 0, lagQ: [], bnT: 0, lastEv: '' });
  Object.assign(P, { x: W / 2, y: H * .72, scale: 1, head: 1, face: ri(0, NF - 1), faceOv: -1, inv: 1, tilt: 0, rot: 0, lx: W / 2, vx: 0, vy: 0 });
  C.style.filter = '';
  G.quote = { t: pick(START_QUOTES), life: 2.2 };
  setBg('sky'); G.flash = 0; hudCache = ''; hud();
  showScr(null); $('hud').classList.add('on'); $('mute').style.display = 'none';
  banner('🚽 POLIJEĆEMO!', G.secret ? 'TAJNI HOT DOG MOD 🤫' : 'vuci prstom po ekranu');
  SFX.fart(.7, 60, .5);
}
function startEvent(e) {
  if (!e) return;
  G.lastEv = e.id;
  if (e.inst) return instant(e);
  if (G.ev) endEvent();
  G.ev = e; G.evLeft = e.d; banner(e.n, e.s); SFX.fanfare(); buzz(40);
  if (e.id === 'sea') { setBg('sea'); P.faceOv = 6; }
  if (e.id === 'space') { setBg('space'); P.faceOv = 8; }
  if (e.id === 'clones') G.cloneFaces = [ri(0, NF - 1), ri(0, NF - 1), ri(0, NF - 1)];
  if (e.id === 'wind') { G.windDir = pick([-1, 1]); G.windT = rand(1.5, 3); }
  if (e.id === 'turbo') { G.turboT = 0; SFX.fart(1, 50, .5); }
  if (e.id === 'ice') { P.vx = 0; P.vy = 0; }
  if (e.id === 'baka') { const l = chance(.5); G.baka = { x: l ? -40 : W + 40, y: rand(H * .15, H * .5), cd: 0, throwT: 2, back: 0, leave: false, q: pick(BAKA_Q), qT: 2.2 }; SFX.fart(.5, 140, .3); }
  if (e.id === 'lava') SFX.sizzle();
  if (e.id === 'sleepy') G.lagQ = [];
}
function endEvent() {
  const e = G.ev; if (!e) return; G.ev = null;
  if (e.id === 'sea' || e.id === 'space') setBg('sky');
  if (e.id === 'baka' && G.baka) { G.baka.leave = true; G.baka.q = pick(['Idem gledati sapunicu.', 'Još ćemo se vidjeti!', 'Pojedi nešto!']); G.baka.qT = 2; }
  if (e.id === 'sleepy') { for (const m of G.lagQ) { P.x += m.dx; P.y += m.dy; } G.lagQ = []; clampP(); }
  P.faceOv = -1; C.style.filter = ''; P.vx = P.vy = 0;
}
function slippers(n) {
  for (let i = 0; i < n; i++) {
    const o = spawn(false, { d: SLIPPER, y: -rand(20, H * .5) });
    o.vx = clamp((P.x - o.x) * rand(.25, .45), -160, 160) * U; o.vy *= 1.25;
  }
}
function instant(e) {
  switch (e.id) {
    case 'rain':
      banner(e.n, e.s); SFX.fanfare();
      for (let i = 0; i < 16; i++) spawn(true, { d: chance(.1) ? GOOD[1] : GOOD[0], y: -rand(30, H * .9) });
      break;
    case 'swap': {
      let f; do { f = ri(0, NF - 1); } while (f === P.face); P.face = f; banner(e.n, e.s); SFX.coin(); addPart('✨', P.x, P.y - 40 * U, 10, 200); break;
    }
    case 'sneeze':
      banner(e.n, e.s); addPart('💦', P.x, P.y - 40 * U, 8, 220); SFX.sneeze();
      P.x = rand(40, W - 40) * 1; P.y = rand(H * .35, H * .85); clampP(); addPart('✨', P.x, P.y, 8, 160); break;
    case 'sharks':
      banner(e.n, e.s); SFX.boing();
      for (let i = 0; i < 5; i++) {
        const left = chance(.5), sz = 44 * U;
        G.objs.push({ d: BAD[9], good: false, x: left ? -sz - i * 70 * U : W + sz + i * 70 * U, y: rand(H * .1, H * .75), vy: fallSpeed() * .15, vx: (left ? 1 : -1) * rand(150, 230) * U,
          rot: 0, vr: 0, size: sz, ph: 0, side: 1, flipX: left });
      }
      break;
    case 'bomb':
      G.bomb = { f: ri(0, NF - 1), side: pick(['l', 'r', 'b']), t: 0, dur: 2.8,
        txt: prof && chance(.3) ? pick(['BOK, {n}!', '{n}, što radiš?', 'Vidim te, {n}!', '{n}, daj mi hot dog!']).replace('{n}', prof.name) : pick(BOMB) };
      chance(.5) ? SFX.boing() : SFX.fart(.5, rand(60, 140));
      break;
    case 'quiz': openQuiz(); break;
    case 'mama': openCall(); break;
    case 'flush':
      banner(e.n, e.s); SFX.flush(); buzz([60, 60, 60, 60, 200]); G.flushT = 1.6; G.spawnT = Math.max(G.spawnT, 1.5);
      for (const o of G.objs) { o.fl = 0; o.fa = Math.atan2(o.y - H * .45, o.x - W / 2); o.fr = Math.hypot(o.x - W / 2, o.y - H * .45); }
      break;
    case 'decree': {
      const d = pick(DECREES); banner('📜 ' + d[0], 'kraljevski proglas: ' + d[1]); SFX.fanfare(); d[2](); break;
    }
    case 'paparazzi':
      banner(e.n, e.s);
      [0, .22, .44].forEach(t => after(t, () => { G.flash = .95; SFX.shutter(); }));
      after(.6, () => { G.pola = { i: ri(0, NF - 1), t: 0, dur: 3.2, cap: pick(CAPS), r: rand(-.18, .18), side: pick([-1, 1]) }; });
      break;
    case 'ducks': {
      banner(e.n, e.s); SFX.quack(); const left = chance(.5), y0 = rand(H * .25, H * .65);
      for (let i = 0; i < 6; i++) {
        const sz = 40 * U;
        G.objs.push({ d: DUCK, good: true, x: left ? -sz - i * 55 * U : W + sz + i * 55 * U, y: y0 + Math.sin(i) * 26 * U, vy: 0, vx: (left ? 1 : -1) * 150 * U,
          rot: 0, vr: 0, size: sz, ph: i, side: 1, flipX: left, duck: 1 });
      }
      break;
    }
  }
}
function randomEvent(fromCrown) {
  let pool = EVENTS.filter(e => e.id !== G.lastEv && (fromCrown || !G.ev || e.inst) && !((e.id === 'quiz' || e.id === 'mama') && G.t < 12));
  startEvent(wpick(pool));
}

function bumpCombo(o) {
  const before = comboMult(); G.combo++; G.comboT = 2.4;
  const now = comboMult();
  if (now > before) { addText(`KOMBO ×${now}!`, W / 2, H * .3, 34, now === 3 ? '#ff5bd1' : '#7dff6b', 1.4); SFX.coin(); buzz(30); addPart('🔥', o.x, o.y, 6, 200, 18); }
}
function collect(o) {
  const k = o.d.k;
  if (k === 'dog' || k === 'gold' || k === 'pizza' || k === 'duck') bumpCombo(o);
  const m = scoreMult() * comboMult();
  if (k === 'dog') { G.score += m; SFX.nom(); addText(chance(.35) ? pick(NOMS) : '+' + m, o.x, o.y, 22, '#ffe14d', .9); addPart('✨', o.x, o.y, 3, 90, 14); }
  else if (k === 'pizza') { G.score += 2 * m; SFX.nom(); addText(pick(['MAMMA MIA!', 'PIZZA! +' + 2 * m, 'NIJE HOT DOG. NJAM.', '+' + 2 * m]), o.x, o.y, 22, '#ffb347', 1); addPart('🧀', o.x, o.y, 3, 90, 14); }
  else if (k === 'duck') { G.score += 2 * m; SFX.quack(); addText('KVAK! +' + 2 * m, o.x, o.y, 22, '#fff', 1); addPart('🪶', o.x, o.y, 4, 120, 16); }
  else if (k === 'gift') { const g = pick(GIFTS); addText(g[0], o.x, o.y - 10 * U, 22, '#fff', 1.6); addPart('🎉', o.x, o.y, 8, 200, 18); g[1](o); }
  else if (k === 'magnet') { addText('PRIVLAČAN SAM!', o.x, o.y, 24, '#ff6b6b', 1.2); startEvent(EV('magnet')); }
  else if (k === 'gold') { G.score += 10 * m; SFX.fanfare(); addText('ZLATNI HOT DOG! +' + 10 * m, o.x, o.y, 24, '#ffd700', 1.4); addPart('⭐', o.x, o.y, 10, 220, 18); buzz(60); }
  else if (k === 'crown') { G.score += 5 * m; SFX.coin(); addText('+' + 5 * m + ' 👑', o.x, o.y, 24, '#ffd700', 1); randomEvent(true); }
  else if (k === 'paper') {
    if (G.lives < 5) { G.lives++; addText('+1 🧻', o.x, o.y, 24, '#fff', 1); } else { G.score += 3 * m; addText('Previše papira! +3', o.x, o.y, 20, '#fff', 1.2); }
    SFX.coin();
  }
  else if (k === 'chili') { addText('LJUUUTO!', o.x, o.y, 28, '#ff3b3b', 1.2); startEvent(EV('turbo')); }
}
function hurt(o) {
  if (P.inv > 0) return;
  G.lives--; P.inv = 1.6; G.shake = 14 * U; G.cause = o.d.c || 'Nešto ga je udarilo';
  SFX.boing(); SFX.fart(.4, rand(70, 120), .35); buzz([80, 40, 120]);
  if (G.combo >= 6) addText('KOMBO IZGUBLJEN 😭', W / 2, H * .32, 24, '#ffb3b3', 1.3);
  G.combo = 0; G.comboT = 0;
  addText(o.d.e === '🥦' ? 'NE BROKULA!' : pick(HITS), P.x, P.y - 80 * U * KS * P.scale, 26, '#ff4d4d', 1.1); addPart('💥', o.x, o.y, 5, 160, 26);
  if (G.lives <= 0) die();
}
function die() {
  G.state = 'dying'; G.dieT = 0; G.bomb = null; G.pola = null; G.baka = null; G.tm = []; endEvent(); $('hud').classList.remove('on'); SFX.sad(); buzz(400);
  setTimeout(() => SFX.fart(1.3, 48, .55), 1250);
}
function showOver() {
  G.state = 'over';
  const best = G.score > G.best; if (best) { G.best = G.score; localStorage.setItem('ks_best', G.best); }
  $('overHead').textContent = pick(OVERH);
  $('overCause').textContent = '☠️ ' + G.cause;
  setPhoto($('overPic'), ri(0, NF - 1));
  G.title = royalTitle();
  $('overTitle').textContent = (prof ? prof.name + ', ' : '') + G.title;
  let rank = RANKS[0][1]; for (const [v, n] of RANKS) if (G.score >= v) rank = n;
  $('overScore').textContent = '🌭 ' + G.score;
  $('overBest').textContent = (best && G.score > 0 ? '🎉 NOVI REKORD! 🎉  ' : `Rekord: ${G.best}  ·  `) + 'Rang: ' + rank;
  $('mute').style.display = '';
  showScr('over');
  afterGame();
}

/* ---------------- KVIZ ---------------- */
const QRES = [
  ['TOČNO! +5 🌭', () => { G.score += 5; }], ['Krivo. Ali dobivaš hot dog. +1 🌭', () => { G.score += 1; }],
  ['Kralj je ponosan. +1 🧻', () => { G.lives = Math.min(5, G.lives + 1); }], ['NETOČNO! Kazna: obrnute kontrole 🙃', () => G.pending.push('invert')],
  ['Oba odgovora su točna. I netočna. +3 🌭', () => { G.score += 3; }], ['Kralj nije slušao. Ništa se ne događa.', () => { }],
  ['Nagrada: HOT DOG KIŠA! 🌭', () => G.pending.push('rain')], ['Kazna: VELIKA GLAVA 🎈', () => G.pending.push('bighead')],
  ['Točno! Ali kralj je ljubomoran. -1 🌭', () => { G.score = Math.max(0, G.score - 1); }], ['Odgovor prihvaćen. Nagrada: DISKO 🪩', () => G.pending.push('disco')]];
function openQuiz() {
  G.state = 'quiz'; G.flash = 0; SFX.tone('sine', 660, 990, .25, .2);
  const [q, ans] = pick(QUIZ); $('qText').textContent = q; $('qRes').textContent = '';
  const box = $('qBtns'); box.innerHTML = '';
  for (const a of (chance(.5) ? ans : [...ans].reverse())) {
    const b = document.createElement('button'); b.className = 'btn sm'; b.textContent = a; box.appendChild(b);
    b.onclick = () => {
      if (box.dataset.done) return; box.dataset.done = 1; ac();
      const r = pick(QRES); $('qRes').textContent = r[0]; r[1](); SFX.coin();
      setTimeout(() => { delete box.dataset.done; overlay('quiz', false); G.state = 'play'; drag = null; hudCache = ''; hud(); }, 1500);
    };
  }
  overlay('quiz', true);
}
let ringIv = 0;
function openCall() {
  G.state = 'quiz'; G.flash = 0; $('callRes').textContent = ''; $('callBtns').style.visibility = '';
  overlay('call', true); SFX.ring(); buzz([300, 200, 300]);
  clearInterval(ringIv); ringIv = setInterval(() => { SFX.ring(); buzz(200); }, 1100);
}
function answerCall(yes) {
  if ($('callBtns').style.visibility === 'hidden') return;
  clearInterval(ringIv); $('callBtns').style.visibility = 'hidden';
  const r = pick(yes ? CALL_YES : CALL_NO); $('callRes').textContent = r[0];
  yes ? SFX.coin() : SFX.fart(.5, 90, .35);
  setTimeout(() => { overlay('call', false); G.state = 'play'; drag = null; r[1](); hudCache = ''; hud(); }, 2300);
}

/* ---------------- UPDATE ---------------- */
const keys = {};
function update(dt) {
  G.t += dt;
  const wk = worldK(), wdt = dt * wk;
  // tipkovnica
  const kx = (keys.ArrowRight || keys.d ? 1 : 0) - (keys.ArrowLeft || keys.a ? 1 : 0), ky = (keys.ArrowDown || keys.s ? 1 : 0) - (keys.ArrowUp || keys.w ? 1 : 0);
  if (kx || ky) move(kx * 340 * U * dt, ky * 340 * U * dt, true);
  // event
  if (G.ev) { G.evLeft -= dt; if (G.evLeft <= 0) endEvent(); }
  G.eventT -= dt; if (G.eventT <= 0) { randomEvent(false); G.eventT = rand(6, 11); }
  while (G.pending.length) startEvent(EV(G.pending.shift()));
  // timeri
  for (let i = G.tm.length - 1; i >= 0; i--) { const x = G.tm[i]; x.t -= dt; if (x.t <= 0) { G.tm.splice(i, 1); x.fn(); } }
  // kombo
  if (G.comboT > 0) { G.comboT -= dt; if (G.comboT <= 0) { if (G.combo >= 6) addText('kombo gotov', W / 2, H * .32, 18, '#fff', 1); G.combo = 0; } }
  // ciljane veličine
  const ts = evIs('giant') ? 2 : evIs('mini') ? .5 : 1, th = evIs('bighead') ? 2.4 : 1;
  P.scale += (ts - P.scale) * Math.min(1, dt * 5); P.head += (th - P.head) * Math.min(1, dt * 5);
  if (evIs('wind')) { G.windT -= dt; if (G.windT <= 0) { G.windDir *= -1; G.windT = rand(1.5, 3); } P.x += G.windDir * 150 * U * dt; if (chance(dt * 12)) G.parts.push({ e: '💨', x: G.windDir > 0 ? -20 : W + 20, y: rand(0, H), vx: G.windDir * 420 * U, vy: 0, life: 1.6, max: 1.6, size: 26 * U, rot: G.windDir > 0 ? Math.PI : 0, vr: 0 }); }
  if (evIs('heavy')) P.y += 170 * U * dt;
  if (evIs('quake')) G.shake = Math.max(G.shake, 7 * U);
  if (evIs('disco')) { C.style.filter = `hue-rotate(${(G.t * 400) % 360}deg) saturate(1.8)`; G.beatT -= dt; if (G.beatT <= 0) { G.beatT = .3; SFX.kick(); } }
  if (evIs('turbo')) { G.turboT -= dt; if (G.turboT <= 0) { G.turboT = .45; SFX.fart(.25, rand(60, 120), .25); } if (chance(dt * 20)) G.parts.push({ e: chance(.85) ? '💨' : '💩', x: P.x + rand(-10, 10), y: P.y + 40 * U * P.scale, vx: rand(-40, 40), vy: rand(120, 220) * U, life: .8, max: .8, size: 22 * U, rot: 0, vr: rand(-3, 3) }); }
  const flipT = evIs('flip') ? Math.PI : 0; G.flipA += (flipT - G.flipA) * Math.min(1, dt * 4);
  G.spinA += ((evIs('spin') ? Math.sin(G.t * 1.5) * .55 : 0) - G.spinA) * Math.min(1, dt * 3);
  if (evIs('ice')) {
    P.x += P.vx * dt; P.y += P.vy * dt; const f = Math.max(0, 1 - 1.3 * dt); P.vx *= f; P.vy *= f;
    const m = 24 * U * KS * P.scale;
    if (P.x <= m || P.x >= W - m) P.vx *= -.7;
    if (P.y <= H * .12 + 40 * U * KS * P.scale || P.y >= H - 44 * U * KS * P.scale) P.vy *= -.7;
    if (chance(dt * 8) && Math.hypot(P.vx, P.vy) > 120 * U) G.parts.push({ e: '💦', x: P.x, y: P.y + 40 * U, vx: -P.vx * .2, vy: 40 * U, life: .6, max: .6, size: 16 * U, rot: 0, vr: 2 });
  }
  if (evIs('sleepy')) {
    while (G.lagQ.length && G.lagQ[0].t <= G.t) { const m = G.lagQ.shift(); P.x += m.dx; P.y += m.dy; }
    if (chance(dt * 2.5)) G.parts.push({ e: '💤', x: P.x + 24 * U, y: P.y - 80 * U, vx: 30 * U, vy: -45 * U, life: 1.5, max: 1.5, size: 22 * U, rot: 0, vr: .5 });
  }
  G.lavaK += ((evIs('lava') ? 1 : 0) - G.lavaK) * Math.min(1, dt * 3);
  if (G.lavaK > .02 && chance(dt * 7 * G.lavaK)) G.parts.push({ e: chance(.6) ? '🔥' : '🫧', x: rand(0, W), y: lavaTop() + 8 * U, vx: 0, vy: -70 * U, life: .7, max: .7, size: 18 * U, rot: 0, vr: 0 });
  if (G.lavaK > .5 && G.state === 'play') {
    const s = P.scale * U * KS, top = lavaTop();
    if (P.y + 36 * s > top) {
      if (P.inv <= 0) { hurt({ d: { e: '🌋', c: 'Stao je na lavu. Pod JE bio lava. 🌋' }, x: P.x, y: P.y + 30 * s }); SFX.sizzle(); addPart('🔥', P.x, P.y + 30 * s, 6, 180, 22); }
      P.y = Math.min(P.y, top - 36 * s - 34 * U); P.vy = 0;
    }
  }
  if (G.baka) {
    const b = G.baka, sp = 118 * U * (evIs('slow') ? .5 : 1);
    if (b.leave) { b.y += 260 * U * dt; if (b.y > H + 90) G.baka = null; }
    else {
      if (b.back > 0) { b.back -= dt; b.x -= Math.sign(P.x - b.x) * sp * 1.6 * dt; b.y -= Math.sign(P.y - b.y) * sp * 1.6 * dt; }
      else { const dx = P.x - b.x, dy = P.y - 20 * U - b.y, d = Math.hypot(dx, dy) || 1; b.x += dx / d * sp * dt; b.y += dy / d * sp * dt; }
      b.x = clamp(b.x, -60, W + 60); b.y = clamp(b.y, -60, H + 60);
      b.throwT -= dt;
      if (b.throwT <= 0) {
        b.throwT = rand(1.8, 3); const o = spawn(false, { d: SLIPPER, y: b.y }); o.x = b.x;
        const dx = P.x - b.x, dy = P.y - b.y, d = Math.hypot(dx, dy) || 1; o.vx = dx / d * 240 * U; o.vy = Math.max(70 * U, dy / d * 240 * U);
        SFX.tone('triangle', 520, 200, .15, .1);
      }
      const s = P.scale * U * KS;
      if (G.state === 'play' && Math.hypot(P.x - b.x, P.y - 10 * s - b.y) < 30 * s + 24 * U) {
        if (P.inv <= 0) hurt({ d: { e: '👵', c: 'Baka ga je uhvatila i natjerala da pojede juhu. 🍲' }, x: b.x, y: b.y });
        b.back = 1.2; b.q = pick(['Pojedi juhu!', 'Eto ti!', 'Uhvatila sam te!']); b.qT = 1.6;
      }
    }
    if (b.qT > 0) b.qT -= dt; else if (chance(dt * .45)) { b.q = pick(BAKA_Q); b.qT = 1.8; }
  }
  if (G.flushT > 0) G.flushT -= dt;
  if (G.bnT > 0) G.bnT -= dt;
  if (G.pola) { G.pola.t += dt; if (G.pola.t > G.pola.dur) G.pola = null; }
  clampP();
  P.tilt += (clamp((P.x - P.lx) / Math.max(dt, .001) * .0009, -.35, .35) - P.tilt) * Math.min(1, dt * 8); P.lx = P.x;
  if (P.inv > 0) P.inv -= dt;
  G.hist.unshift({ x: P.x, y: P.y }); if (G.hist.length > 60) G.hist.length = 60;
  // spawn
  const widthK = clamp(W / (420 * U), 1, 2.4);
  G.spawnT -= wdt; if (G.spawnT <= 0) { spawn(); G.spawnT = Math.max(.3, .85 - G.t * .005) / widthK * rand(.7, 1.3); }
  // objekti
  for (let i = G.objs.length - 1; i >= 0; i--) {
    const o = G.objs[i];
    if (o.fl != null) { // ispiranje
      o.fl += dt; o.fa += dt * (3 + o.fl * 7); o.fr *= Math.max(0, 1 - dt * 2.3); o.rot += dt * 12; o.size *= Math.max(.2, 1 - dt * .8);
      o.x = W / 2 + Math.cos(o.fa) * o.fr; o.y = H * .45 + Math.sin(o.fa) * o.fr;
      if (o.fl > 1.4 || o.fr < 5) G.objs.splice(i, 1);
      continue;
    }
    o.y += o.vy * wdt; o.x += o.vx * wdt; o.rot += o.vr * wdt;
    if (o.d.zig && !o.side) o.x += Math.sin(G.t * 3 + o.ph) * 90 * U * wdt;
    if (o.duck) o.y += Math.sin(G.t * 6 + o.ph) * 40 * U * dt;
    if (o.bn) o.vy += fallSpeed() * 1.5 * wdt;
    if (evIs('bounce') && !o.side && o.vy > 0 && o.y > H - o.size * .6 && (o.bn || 0) < 3) {
      o.vy = -fallSpeed() * rand(1.5, 2.1); o.bn = (o.bn || 0) + 1; o.vr = rand(-8, 8);
      if (G.bnT <= 0) { SFX.boing(); G.bnT = .3; }
    }
    if (evIs('magnet') && o.good) { const dx = P.x - o.x, dy = P.y - o.y; if (dx * dx + dy * dy < (Math.max(W, H) * .55) ** 2) { o.x += dx * 2.4 * dt; o.y += dy * 2.4 * dt; } }
    if (evIs('quake')) o.x += rand(-3, 3);
    if (!o.side && (o.x < o.size / 2 || o.x > W - o.size / 2)) { o.vx *= -1; o.x = clamp(o.x, o.size / 2, W - o.size / 2); }
    if (o.y > H + o.size * 2 || (o.side && (o.x < -400 * U || o.x > W + 400 * U))) { G.objs.splice(i, 1); continue; }
    if (G.state === 'play' && kingHit(o)) { G.objs.splice(i, 1); if (o.good) collect(o); else hurt(o); if (G.state !== 'play') break; }
  }
  // ostalo
  G.quoteT -= dt;
  if (G.quoteT <= 0) {
    let q = pick(QUOTES);
    if (prof && chance(.22)) q = pick(NAME_Q).replace('{n}', prof.name);
    if (evIs('baka')) q = pick(['BAKA, NE!', 'Jeo sam, bako!', 'Ne trebam juhu!', 'Spasite kralja!']);
    if (evIs('lava')) q = pick(['VRUĆE! VRUĆE!', 'Ne diram pod!', 'Tko je ovo zapalio?!']);
    G.quote = { t: q, life: 2.4 }; G.quoteT = rand(4.5, 8.5);
  }
  if (G.quote) { G.quote.life -= dt; if (G.quote.life <= 0) G.quote = null; }
  G.fartT -= dt; if (G.fartT <= 0) { G.fartT = rand(10, 20); SFX.fart(rand(.3, .8), rand(50, 120), .3); addText(pick(['(netko je prdnuo)', '(nisam ja)', '*prrrrt*', '(oprostite)']), rand(W * .25, W * .75), rand(H * .25, H * .6), 16, '#fff', 1.6); }
  if (G.bomb) { G.bomb.t += dt; if (G.bomb.t > G.bomb.dur) G.bomb = null; }
  hud();
}
function updateFx(dt) {
  for (let i = G.parts.length - 1; i >= 0; i--) { const p = G.parts[i]; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; p.life -= dt; if (p.life <= 0) G.parts.splice(i, 1); }
  for (let i = G.texts.length - 1; i >= 0; i--) { const t = G.texts[i]; t.y -= 50 * U * dt; t.life -= dt; if (t.life <= 0) G.texts.splice(i, 1); }
  if (G.shake > 0) G.shake = Math.max(0, G.shake - 40 * dt);
  if (G.flash > 0) G.flash = Math.max(0, G.flash - dt * 2.5);
}

/* ---------------- RENDER ---------------- */
function wrap(t, maxW) { const w = t.split(' '), out = []; let line = ''; for (const x of w) { const tt = line ? line + ' ' + x : x; if (ctx.measureText(tt).width > maxW && line) { out.push(line); line = x; } else line = tt; } if (line) out.push(line); return out; }
function bubble(text, x, y, px) {
  ctx.font = FONT(px); const lines = wrap(text, 190 * U); const lh = px * 1.15;
  const w = Math.max(...lines.map(l => ctx.measureText(l).width)) + 18 * U, h = lines.length * lh + 12 * U;
  const bx = clamp(x - w / 2, 6, W - w - 6), by = Math.max(6, y - h - 12 * U);
  ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 3; rrect(bx, by, w, h, 12 * U); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(clamp(x, bx + 14, bx + w - 14) - 8 * U, by + h - 1); ctx.lineTo(clamp(x, bx + 14, bx + w - 14), by + h + 11 * U); ctx.lineTo(clamp(x, bx + 14, bx + w - 14) + 8 * U, by + h - 1); ctx.fill();
  ctx.fillStyle = '#111'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  lines.forEach((l, i) => ctx.fillText(l, bx + w / 2, by + 6 * U + lh * (i + .5)));
}
function render(dt) {
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.save();
  if (G.shake > 0) ctx.translate(rand(-G.shake, G.shake), rand(-G.shake, G.shake));
  const rotA = G.flipA + G.spinA;
  if (Math.abs(rotA) > .001) { ctx.translate(W / 2, H / 2); ctx.rotate(rotA); if (G.spinA) ctx.scale(1.12, 1.12); ctx.translate(-W / 2, -H / 2); }
  const wsp = (G.state === 'play' ? fallSpeed() * worldK() : 30 * U) * .6;
  drawBg(G.state === 'quiz' || G.state === 'pause' ? 0 : dt, wsp);
  if (G.flushT > 0) {
    const k = Math.min(1, G.flushT / .5);
    ctx.save(); ctx.translate(W / 2, H * .45); ctx.rotate(G.t * 7);
    for (let i = 0; i < 6; i++) { ctx.strokeStyle = `rgba(150,215,255,${.55 * k})`; ctx.lineWidth = 7 * U; ctx.beginPath(); ctx.arc(0, 0, (18 + i * 24) * U, i, i + 3.4); ctx.stroke(); }
    ctx.restore(); drawEmo('🚽', W / 2, H * .45, 60 * U * k, Math.sin(G.t * 9) * .2, k);
  }
  for (const o of G.objs) {
    if (o.d.k === 'gold') { ctx.save(); ctx.globalAlpha = .5 + .3 * Math.sin(G.t * 10); ctx.fillStyle = '#ffd700'; ctx.beginPath(); ctx.arc(o.x, o.y, o.size * .65, 0, 7); ctx.fill(); ctx.restore(); }
    if (o.flipX) { ctx.save(); ctx.translate(o.x, o.y); ctx.scale(-1, 1); drawEmo(o.d.e, 0, 0, o.size, 0); ctx.restore(); }
    else drawEmo(o.d.e, o.x, o.y, o.size, o.rot);
  }
  for (const p of G.parts) drawEmo(p.e, p.x, p.y, p.size, p.rot, clamp(p.life / p.max * 1.5, 0, 1));
  if (G.lavaK > .01) {
    const top = lavaTop(), g = ctx.createLinearGradient(0, top, 0, H);
    g.addColorStop(0, '#ffe066'); g.addColorStop(.2, '#ff7a00'); g.addColorStop(1, '#a80f00');
    ctx.save(); ctx.globalAlpha = Math.min(1, G.lavaK * 1.2); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-60, H + 60);
    for (let x = -60; x <= W + 60; x += 16) ctx.lineTo(x, top + Math.sin(x * .035 + G.t * 3) * 6 * U + Math.sin(x * .011 - G.t * 2) * 4 * U);
    ctx.lineTo(W + 60, H + 60); ctx.closePath(); ctx.shadowColor = '#ff6a00'; ctx.shadowBlur = 24; ctx.fill(); ctx.restore();
  }
  if (evIs('clones')) [14, 28, 42].forEach((k, i) => { const h = G.hist[Math.min(k, G.hist.length - 1)]; if (h) drawKing(h.x + Math.sin(G.t * 3 + i) * 30 * U, h.y + 20 * U * (i + 1), P.scale * .9, P.head, G.cloneFaces[i], .55); });
  if (G.state === 'dying') { G.dieT += dt; P.y += (G.dieT * 600 - 200) * U * dt; drawKing(P.x, P.y, P.scale * Math.max(.2, 1 - G.dieT * .3), P.head, curFace(), 1, G.dieT * 9); if (G.dieT > 1.3) showOver(); }
  else {
    let al = P.inv > 0 && Math.floor(G.t * 12) % 2 ? .35 : 1;
    if (evIs('ghost')) al *= .14 + .1 * Math.sin(G.t * 6);
    drawKing(P.x, P.y + Math.sin(G.t * 3) * 3 * U, P.scale, P.head, curFace(), al);
    if (evIs('magnet')) drawEmo('🧲', P.x, P.y - (92 + (P.head - 1) * 45) * U * KS * P.scale, 28 * U, Math.PI + Math.sin(G.t * 10) * .3);
  }
  if (G.baka) {
    const b = G.baka;
    drawEmo('👵', b.x, b.y + Math.sin(G.t * 8) * 3 * U, 66 * U, Math.sin(G.t * 5) * .12);
    drawEmo('🩴', b.x + 32 * U, b.y - 18 * U, 26 * U, G.t * 7);
    if (b.qT > 0 && G.state === 'play') bubble(b.q, b.x, b.y - 30 * U, 13 * U);
  }
  for (const t of G.texts) { ctx.globalAlpha = clamp(t.life / t.max * 2, 0, 1); outText(t.t, t.x, t.y, t.px, t.col); ctx.globalAlpha = 1; }
  if (G.quote && G.state === 'play') bubble(G.quote.t, P.x, P.y - (70 + (P.head - 1) * 45) * U * KS * P.scale, 14 * U);
  if (evIs('dark')) {
    const g = ctx.createRadialGradient(P.x, P.y - 20 * U, 55 * U * P.scale, P.x, P.y - 20 * U, 150 * U * P.scale);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.97)'); ctx.fillStyle = g; ctx.fillRect(-40, -40, W + 80, H + 80);
  }
  ctx.restore();
  // ekran (ne rotira se)
  if (G.ev && G.state === 'play') outText(`${G.ev.n.split(' ')[0]} ${Math.ceil(G.evLeft)}s`, W / 2, Math.max(64, 54 * U) + 4, 18 * U, '#ffd84a');
  if (G.combo >= 3 && G.state === 'play') outText(`🔥 ${G.combo}`, 12, Math.max(64, 54 * U) + 4, 17 * U, comboMult() > 1 ? '#ff9b3d' : '#fff', 'left');
  if (G.pola) {
    const p = G.pola, img = photos[p.i];
    const k = clamp(p.t < .35 ? p.t / .35 : p.t > p.dur - .35 ? (p.dur - p.t) / .35 : 1, 0, 1);
    const w = Math.min(W * .5, 230 * U), iw = w - 16 * U, ih = iw * 4 / 3, h = ih + 50 * U;
    const x = p.side > 0 ? W - w * .5 - 12 * U + (1 - k) * (w + 60) : w * .5 + 12 * U - (1 - k) * (w + 60);
    ctx.save(); ctx.translate(x, H * .46); ctx.rotate(p.r);
    ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 18; ctx.fillStyle = '#fffdf4'; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.shadowBlur = 0;
    if (img) {
      const ar = iw / ih, iar = img.width / img.height; let sw, sh, sx, sy;
      if (iar > ar) { sh = img.height; sw = sh * ar; sx = (img.width - sw) / 2; sy = 0; } else { sw = img.width; sh = sw / ar; sx = 0; sy = (img.height - sh) * .3; }
      ctx.drawImage(img, sx, sy, sw, sh, -iw / 2, -h / 2 + 8 * U, iw, ih);
    }
    ctx.font = `700 ${Math.round(13 * U)}px "Comic Sans MS","Segoe Print","Chalkboard SE",cursive,sans-serif`; ctx.fillStyle = '#222'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    wrap(p.cap, iw).slice(0, 2).forEach((l, i, a) => ctx.fillText(l, 0, h / 2 - 22 * U + (i - (a.length - 1) / 2) * 15 * U));
    drawEmo('📸', w / 2 - 6 * U, -h / 2 + 6 * U, 26 * U, .3);
    ctx.restore();
  }
  if (G.bomb) {
    const b = G.bomb, R = Math.min(W, H) * .34;
    let k = b.t < .35 ? 1 - Math.pow(1 - b.t / .35, 3) * 1 : b.t > b.dur - .3 ? (b.dur - b.t) / .3 : 1;
    k = clamp(k, 0, 1);
    let x, y, r;
    if (b.side === 'l') { x = -R + k * R * 1.15; y = H * .5; r = .5; } else if (b.side === 'r') { x = W + R - k * R * 1.15; y = H * .45; r = -.5; } else { x = W * .5; y = H + R - k * R * 1.25; r = 0; }
    ctx.save(); ctx.translate(x, y); ctx.rotate(r + Math.sin(G.t * 8) * .05);
    ctx.fillStyle = '#e8b52a'; ctx.beginPath(); ctx.arc(0, 0, R + 6, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, R, 0, 7); ctx.clip(); if (faces[b.f]) ctx.drawImage(faces[b.f], -R, -R, R * 2, R * 2); ctx.restore();
    if (k > .8) bubble(b.txt, clamp(b.side === 'l' ? x + R * .9 : b.side === 'r' ? x - R * .9 : x, 60, W - 60), b.side === 'b' ? y - R * 1.05 : y - R * .7, 17 * U);
  }
  if (G.flash > 0) { ctx.fillStyle = `rgba(255,255,255,${G.flash})`; ctx.fillRect(0, 0, W, H); }
}

/* ---------------- INPUT ---------------- */
let drag = null;
function move(dx, dy, raw) {
  if (G.flipA > Math.PI / 2) { dx = -dx; dy = -dy; }
  if (evIs('invert')) { dx = -dx; dy = -dy; }
  const k = raw ? 1 : 1.3 * (evIs('sea') ? .8 : 1);
  dx *= k; dy *= k;
  if (evIs('ice')) {
    const f = raw ? 5 : 1.5; P.vx += dx * f; P.vy += dy * f;
    const v = Math.hypot(P.vx, P.vy), mx = 650 * U; if (v > mx) { P.vx *= mx / v; P.vy *= mx / v; }
    return;
  }
  if (evIs('sleepy')) { G.lagQ.push({ dx, dy, t: G.t + .5 }); return; }
  P.x += dx; P.y += dy; clampP();
}
C.addEventListener('pointerdown', e => { ac(); drag = { id: e.pointerId, x: e.clientX, y: e.clientY }; try { C.setPointerCapture(e.pointerId); } catch (_) { } if (G.state === 'play' && chance(.06)) SFX.fart(.2, rand(80, 160), .2); });
C.addEventListener('pointermove', e => { if (!drag || e.pointerId !== drag.id) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.x = e.clientX; drag.y = e.clientY; if (G.state === 'play') move(dx, dy); });
const endDrag = e => { if (drag && e.pointerId === drag.id) drag = null; };
C.addEventListener('pointerup', endDrag); C.addEventListener('pointercancel', endDrag);
addEventListener('keydown', e => { if (e.target && e.target.tagName === 'INPUT') { if (e.key === 'Enter') accSubmit(); return; } keys[e.key.length === 1 ? e.key.toLowerCase() : e.key] = true; if ((e.key === 'Escape' || e.key === 'p') && G.state === 'play') pauseGame(); if (e.key.startsWith('Arrow')) e.preventDefault(); });
addEventListener('keyup', e => { keys[e.key.length === 1 ? e.key.toLowerCase() : e.key] = false; });
function pauseGame() { if (G.state !== 'play') return; G.state = 'pause'; $('pauseSub').textContent = pick(['Kralj je otišao po papir', 'Vodokotlić se puni…', 'Pauza je kraljevsko pravo', 'Kralj pere ruke (napokon)', 'Netko kuca na vrata']); overlay('pause', true); $('mute').style.display = ''; }
function resumeGame() { overlay('pause', false); G.state = 'play'; drag = null; $('mute').style.display = 'none'; }
document.addEventListener('visibilitychange', () => { if (document.hidden) pauseGame(); });

/* ---------------- GUMBI ---------------- */
const tap = (id, fn) => $(id).addEventListener('click', e => { ac(); fn(e); });
tap('playBtn', startGame);
tap('againBtn', startGame);
tap('pauseBtn', pauseGame);
tap('resumeBtn', resumeGame);
tap('quitBtn', () => { overlay('pause', false); G.cause = 'Odustao. Kralj je razočaran.'; G.state = 'over'; $('hud').classList.remove('on'); showOver(); });
tap('menuBtn', toMenu);
tap('galBtn', () => { showScr('gal'); SFX.fart(.3, 90, .3); });
tap('galBack', toMenu);
let menuPic = 10;
tap('menuPic', () => { let n; do { n = ri(0, NF - 1); } while (n === menuPic); menuPic = n; setPhoto($('menuPic'), n); SFX.fart(rand(.3, .9), rand(50, 120)); $('tip').textContent = '„' + pick(CAPS) + '”'; });
let logoTaps = 0;
tap('logo', () => { logoTaps++; SFX.tone('square', 300 + logoTaps * 120, 300 + logoTaps * 120, .08, .12); if (logoTaps >= 5) { logoTaps = 0; G.secret = !G.secret; SFX.fanfare(); $('menuSub').textContent = G.secret ? '🤫 TAJNI HOT DOG MOD UKLJUČEN' : 'Tajni mod isključen. Dosadno.'; } });
let viewIdx = 0;
function openView(i) { viewIdx = i; $('viewImg').src = src('img/p' + i + '.webp'); $('viewCap').textContent = pick(CAPS); overlay('view', true); }
tap('viewNext', () => { openView((viewIdx + 1) % NF); SFX.fart(rand(.2, .5), rand(70, 140), .25); });
tap('viewClose', () => overlay('view', false));
tap('mute', () => { muted = !muted; localStorage.setItem('ks_mute', muted ? '1' : '0'); $('mute').textContent = muted ? '🔇' : '🔊'; if (!muted) SFX.fart(.4, 80, .4); });
tap('callYes', () => answerCall(true));
tap('callNo', () => answerCall(false));
tap('lbBtn', () => openLb());
tap('overLbBtn', () => openLb());
tap('lbRefresh', () => { $('lbSub').textContent = '📡 Pitam kralja…'; refreshLb(true); SFX.fart(.2, 120, .2); });
tap('lbAcc', () => openAcc(prof ? 'profile' : 'reg'));
tap('lbBack', () => { if (lbFrom === 'over') showScr('over'); else toMenu(); });
tap('profBtn', () => openAcc(prof ? 'profile' : 'reg'));
tap('menuKing', () => openLb());
tap('accGo', accSubmit);
tap('accSwitch', () => { if (accMode === 'profile') logout(); else { accMode = accMode === 'reg' ? 'login' : 'reg'; renderAcc(); } });
tap('accBack', () => { if (lbFrom === 'over') showScr('over'); else toMenu(); });
tap('shareBtn', async () => {
  const text = `Pojeo sam ${G.score} hot dogova u igrici KRALJ ŠKOLJKE 👑🚽🌭${prof && prof.rank ? ` Na ljestvici sam #${prof.rank}!` : ''} Možeš li bolje?`;
  const url = location.protocol.startsWith('http') ? location.href.split('#')[0] : undefined;
  try { if (navigator.share) { await navigator.share({ title: 'Kralj Školjke', text, url }); return; } } catch (e) { return; }
  try { await navigator.clipboard.writeText(text + (url ? ' ' + url : '')); $('overBest').textContent = '📋 Kopirano! Zalijepi prijateljima.'; } catch (e) { $('overBest').textContent = text; }
});
function toMenu() {
  G.state = 'menu'; overlay('view', false); $('hud').classList.remove('on'); $('mute').style.display = ''; C.style.filter = '';
  menuPic = ri(0, NF - 1); setPhoto($('menuPic'), menuPic);
  $('menuSub').textContent = G.secret ? '🤫 TAJNI HOT DOG MOD UKLJUČEN' : pick(SUBS);
  $('tip').textContent = pick(TIPS) + (G.best ? `  ·  Rekord: 🌭 ${G.best}` : '');
  lbFrom = 'menu'; updProf(); showScr('menu'); menuKing();
}

/* ---------------- LJESTVICA I RAČUN ---------------- */
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } },
};
let prof = LS.get('ks_prof', null);
if (prof && !(prof.name && prof.key)) prof = null;
let lbCache = null, lbFrom = 'menu', accMode = 'reg', accBusy = false;
const normName = s => String(s || '').replace(/[\u0000-\u001f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 16);
const statKey = () => prof ? 'ks_st_' + prof.name.toLowerCase() : 'ks_st_anon';
const getStats = () => LS.get(statKey(), null) || { games: 0, dogs: 0, pb: null, dirty: false };
const saveProf = () => LS.set('ks_prof', prof);
const plural = (n, f) => { const a = n % 10, b = n % 100; return a === 1 && b !== 11 ? f[0] : a >= 2 && a <= 4 && (b < 12 || b > 14) ? f[1] : f[2]; };
const hashName = s => { let h = 7; for (const c of s.toLowerCase()) h = (h * 31 + c.codePointAt(0)) >>> 0; return h; };

async function api(body) {
  if (navigator.onLine === false) return { ok: false, net: true, err: 'Nema interneta. 📡' };
  const ctl = window.AbortController ? new AbortController() : null; const to = setTimeout(() => ctl && ctl.abort(), 12000);
  try {
    const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, body: JSON.stringify(body), signal: ctl ? ctl.signal : undefined, cache: 'no-store' });
    const j = await r.json(); return j && typeof j === 'object' ? j : { ok: false, err: 'Kralj ne razumije odgovor.' };
  } catch (e) { return { ok: false, net: true, err: 'Kraljevstvo se ne javlja. Provjeri internet. 📡' }; }
  finally { clearTimeout(to); }
}
async function keyFor(name, pin) {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('kralj-skoljke|' + name.toLowerCase() + '|' + pin));
  return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 40);
}
function recordGame() {
  const st = getStats(); st.games++; st.dogs += G.score;
  const cur = Math.max(st.pb ? st.pb.s : 0, prof ? prof.srvBest || 0 : 0);
  if (G.score > cur) st.pb = { s: G.score, dur: Math.round(G.t), cause: G.cause, title: G.title, face: P.face };
  st.dirty = true; LS.set(statKey(), st);
}
async function sync() {
  if (!prof) return null;
  const st = getStats(), body = { a: 'sync', name: prof.name, key: prof.key, games: st.games, dogs: st.dogs };
  if (st.pb && st.pb.s > (prof.srvBest || 0)) body.pb = st.pb;
  const r = await api(body);
  if (r.ok) {
    Object.assign(prof, { srvBest: r.best, rank: r.rank, players: r.players }); saveProf();
    const s2 = getStats(); s2.dirty = false; if (r.sus) s2.pb = null; LS.set(statKey(), s2);
    if (r.top) lbCache = { at: Date.now(), top: r.top, players: r.players };
  }
  return r;
}
async function afterGame() {
  recordGame();
  const el = $('overLb');
  if (!prof) { el.innerHTML = '👤 <u>Registriraj se</u> i uđi na kraljevsku ljestvicu!'; el.onclick = () => { ac(); openAcc('reg'); }; return; }
  el.onclick = () => { ac(); openLb(); }; el.textContent = '📡 Šaljem rezultat kralju…';
  const r = await sync();
  if (!r || !$('over').classList.contains('on')) return;
  if (r.ok) el.textContent = r.sus ? '🤨 Kralj sumnja na varanje. Rezultat nije upisan.' : (r.newBest ? '🎉 NOVI REKORD NA LJESTVICI! ' : '') + `🏆 Ti si #${r.rank} od ${r.players} ${plural(r.players, ['kralja', 'kralja', 'kraljeva'])}`;
  else el.textContent = r.net ? '📡 Nema interneta — rezultat šaljem kad se spojiš' : '⚠️ ' + r.err;
  if (r.ok && r.newBest && r.rank === 1) { SFX.fanfare(); buzz([100, 50, 100, 50, 300]); }
}
function lbRow(p, r, me) {
  const d = document.createElement('div'); d.className = 'lbr' + (me ? ' me' : '');
  const f = p.f >= 0 && p.f < NF ? p.f : hashName(p.n) % NF;
  d.innerHTML = `<span class="rk">${r === 1 ? '👑' : r === 2 ? '🥈' : r === 3 ? '🥉' : '#' + r}</span><span class="av"></span><span class="nm"></span><span class="sc">🌭 ${+p.b || 0}</span>`;
  d.querySelector('.av').style.backgroundImage = `url("${src('img/face' + f + '.webp')}")`;
  const nm = d.querySelector('.nm'); nm.textContent = p.n;
  const s1 = document.createElement('small'); s1.textContent = p.t || (p.g ? `${p.g} ${plural(p.g, ['igra', 'igre', 'igara'])}, bez titule` : 'još nije sjeo na tron'); nm.appendChild(s1);
  if (p.c) { const s2 = document.createElement('small'); s2.textContent = '☠️ ' + p.c; nm.appendChild(s2); }
  return d;
}
function renderLb() {
  const box = $('lbList'); box.innerHTML = '';
  $('lbAcc').textContent = prof ? '👤 ' + prof.name : '👤 Registriraj se';
  if (!lbCache) { box.innerHTML = '<div class="lbe">📡 Pitam kralja…</div>'; return; }
  $('lbSub').textContent = `${lbCache.players} ${plural(lbCache.players, ['kralj', 'kralja', 'kraljeva'])} u kraljevstvu. Samo jedan je pravi.`;
  if (!lbCache.top.length) box.innerHTML = '<div class="lbe">Još nitko nije sjeo na tron. Budi prvi! 👑</div>';
  const my = prof ? prof.name.toLowerCase() : ''; let shown = false;
  lbCache.top.forEach((p, i) => { const me = !!my && p.n.toLowerCase() === my; shown = shown || me; box.appendChild(lbRow(p, i + 1, me)); });
  if (prof && !shown && prof.rank) {
    const gap = document.createElement('div'); gap.className = 'lbe'; gap.textContent = '⋮'; box.appendChild(gap);
    box.appendChild(lbRow({ n: prof.name, b: prof.srvBest || 0, g: getStats().games, f: -1 }, prof.rank, true));
  }
  if (!prof) { const e = document.createElement('div'); e.className = 'lbe'; e.textContent = '👤 Registriraj se da i ti budeš ovdje!'; box.appendChild(e); }
}
async function refreshLb(force) {
  if (!force && lbCache && Date.now() - lbCache.at < 15000) return;
  const r = prof && getStats().dirty ? await sync() : await api({ a: 'top' });
  if (r && r.ok && r.top) lbCache = { at: Date.now(), top: r.top, players: r.players };
  else if (r && !r.ok && $('lb').classList.contains('on')) { $('lbSub').textContent = '⚠️ ' + r.err; if (!lbCache) $('lbList').innerHTML = '<div class="lbe">🏰 Dvorac je zatvoren. Pokušaj kasnije.</div>'; return; }
  if ($('lb').classList.contains('on')) renderLb();
}
function openLb(fromAcc) {
  if (!fromAcc) lbFrom = $('over').classList.contains('on') ? 'over' : 'menu';
  $('lbSub').textContent = 'Najveći jedači hot dogova u kraljevstvu'; showScr('lb'); renderLb(); refreshLb(!!fromAcc);
  SFX.tone('square', 523, 523, .08, .08); SFX.tone('square', 784, 784, .12, .08, .08);
}
function openAcc(mode) {
  if (!$('acc').classList.contains('on')) lbFrom = $('over').classList.contains('on') ? 'over' : lbFrom;
  accMode = prof ? 'profile' : (mode || 'reg'); showScr('acc'); renderAcc();
}
function renderAcc() {
  const reg = accMode === 'reg', pr = accMode === 'profile';
  $('accHead').textContent = pr ? '👤 ' + prof.name : reg ? '👑 POSTANI KRALJ' : '🔑 PRIJAVA';
  if (pr) {
    const st = getStats();
    $('accTxt').textContent = `🏆 Rekord na ljestvici: 🌭 ${prof.srvBest || 0}` + (prof.rank ? ` · mjesto #${prof.rank} od ${prof.players}` : '') +
      `\n🎮 Odigrano: ${st.games} ${plural(st.games, ['igra', 'igre', 'igara'])} · pojedeno 🌭 ${st.dogs}`;
  } else $('accTxt').textContent = reg ? 'Izaberi kraljevsko ime i PIN od 4 broja. Zapamti PIN — treba ti ako igraš na drugom mobitelu.' : 'Upiši svoje kraljevsko ime i PIN.';
  $('accName').style.display = $('accPin').style.display = pr ? 'none' : '';
  $('accGo').textContent = pr ? '🏆 LJESTVICA' : reg ? '👑 REGISTRIRAJ ME' : '🔑 PRIJAVI ME';
  $('accSwitch').textContent = pr ? '🚪 Odjavi se' : reg ? 'Već imam račun → Prijava' : 'Nemam račun → Registracija';
  $('accErr').textContent = '';
}
async function accSubmit() {
  if (accBusy || !$('acc').classList.contains('on')) return;
  if (accMode === 'profile') return openLb();
  const name = normName($('accName').value), pin = $('accPin').value.trim();
  const err = t => { $('accErr').textContent = t; SFX.fart(.3, 120, .25); buzz(60); };
  if (name.length < 2) return err('Ime mora imati barem 2 slova.');
  if (!/^\d{4}$/.test(pin)) return err('PIN mora imati točno 4 broja.');
  if (!window.crypto || !crypto.subtle) return err('Otvori igricu preko linka da bi se mogao registrirati.');
  accBusy = true; $('accGo').disabled = true; $('accErr').textContent = '📡 Kucam na vrata dvorca…';
  try {
    const key = await keyFor(name, pin);
    const r = await api({ a: accMode === 'reg' ? 'reg' : 'login', name, key });
    if (!r.ok) return err(r.err || 'Nešto je pošlo po zlu.');
    const anon = LS.get('ks_st_anon', null);
    prof = { name: r.name, key, srvBest: r.best || 0, rank: r.rank, players: r.players }; saveProf();
    if (!LS.get(statKey(), null)) {
      const st = { games: r.games || 0, dogs: r.dogs || 0, pb: null, dirty: false };
      if (accMode === 'reg' && anon && anon.games) { st.games += anon.games; st.dogs += anon.dogs; st.pb = anon.pb; st.dirty = true; LS.set('ks_st_anon', null); }
      LS.set(statKey(), st);
    }
    $('accPin').value = ''; SFX.fanfare(); buzz(80); updProf();
    if (getStats().dirty) await sync();
    openLb(true);
  } finally { accBusy = false; $('accGo').disabled = false; }
}
function logout() { prof = null; LS.set('ks_prof', null); accMode = 'reg'; renderAcc(); updProf(); SFX.sad(); }
function updProf() { $('profBtn').textContent = prof ? '👤 ' + prof.name : '👤 Prijava'; }
async function menuKing() {
  const el = $('menuKing');
  const show = () => {
    if (!lbCache || !lbCache.top.length || !lbCache.top[0].b) { el.textContent = prof ? '' : '🏆 Registriraj se i natječi se s prijateljima!'; return; }
    const k = lbCache.top[0];
    el.textContent = prof && k.n.toLowerCase() === prof.name.toLowerCase() ? `👑 TI si Kralj kraljeva! (🌭 ${k.b}) Brani tron!` : `👑 Kralj kraljeva: ${k.n} — 🌭 ${k.b}`;
  };
  show();
  if (!lbCache || Date.now() - lbCache.at > 60000) { await refreshLb(true); if (G.state === 'menu') show(); }
}
addEventListener('online', () => { if (prof && getStats().dirty) sync(); });

/* ---------------- INSTALACIJA ---------------- */
let deferredPrompt = null;
const isStandalone = () => matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: fullscreen)').matches || navigator.standalone === true;
addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; });
addEventListener('appinstalled', () => { $('instBtn').style.display = 'none'; deferredPrompt = null; });
if (isStandalone()) $('instBtn').style.display = 'none';
tap('instBtn', async () => {
  if (deferredPrompt) { deferredPrompt.prompt(); try { await deferredPrompt.userChoice; } catch (e) { } deferredPrompt = null; return; }
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  let t;
  if (!location.protocol.startsWith('http')) t = 'Ova je verzija otvorena kao datoteka pa se ne može instalirati. Otvori link igrice u pregledniku (Chrome ili Safari) i stisni ovaj gumb opet.';
  else if (ios) t = 'iPhone: otvori ovu stranicu u Safariju, stisni gumb Dijeli (kvadrat sa strelicom ⬆️) i odaberi „Dodaj na početni zaslon”. Gotovo, kralj je na mobitelu! 👑';
  else t = 'Android: u Chromeu stisni ⋮ (gore desno) i odaberi „Instaliraj aplikaciju” ili „Dodaj na početni zaslon”. 👑';
  $('hintTxt').textContent = t; overlay('hint', true);
});
tap('hintOk', () => overlay('hint', false));
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => { }));

/* ---------------- START ---------------- */
let last = performance.now();
function frame(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  if (G.state === 'play') update(dt);
  if (G.state === 'play' || G.state === 'dying') updateFx(dt);
  if (G.state === 'play' || G.state === 'dying' || G.state === 'pause' || G.state === 'quiz') render(G.state === 'pause' || G.state === 'quiz' ? 0 : dt);
  requestAnimationFrame(frame);
}
function loadImg(p) { return new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src(p); }); }
(async function boot() {
  resize(); $('mute').textContent = muted ? '🔇' : '🔊';
  const grid = $('galGrid');
  for (let i = 0; i < NF; i++) { const d = document.createElement('div'); setPhoto(d, i); d.onclick = () => { ac(); openView(i); SFX.fart(rand(.2, .6), rand(60, 140), .3); }; grid.appendChild(d); }
  let done = 0; const total = NF * 2; const t0 = performance.now();
  const fill = $('loadFill'), txt = $('loadTxt'); let li = 0; const msgs = [...LOADS].sort(() => Math.random() - .5);
  const tick = setInterval(() => { txt.textContent = msgs[li++ % msgs.length]; }, 420);
  const jobs = [];
  for (let i = 0; i < NF; i++) {
    jobs.push(loadImg('img/face' + i + '.webp').then(im => { faces[i] = im; done++; }));
    jobs.push(loadImg('img/p' + i + '.webp').then(im => { photos[i] = im; done++; }));
  }
  const prog = setInterval(() => { const real = done / total, tt = Math.min(1, (performance.now() - t0) / 2200); fill.style.width = Math.min(real, tt) * 100 + '%'; }, 50);
  await Promise.all(jobs);
  await new Promise(r => setTimeout(r, Math.max(0, 2300 - (performance.now() - t0))));
  clearInterval(tick); clearInterval(prog); fill.style.width = '100%';
  txt.textContent = 'Kralj je spreman. 👑';
  setTimeout(toMenu, 350);
  requestAnimationFrame(frame);
})();
