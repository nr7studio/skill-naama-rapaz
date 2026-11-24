gsap.registerPlugin(CustomEase);
// curvas aprovadas (segura e explode / chega rapido e freia com cauda longa)
CustomEase.create('exitE', 'M0,0 C0.5,0 0.72,0.04 0.84,0.16 0.93,0.26 0.98,0.55 1,1');
CustomEase.create('enterE', 'M0,0 C0.02,0.38 0.12,0.78 0.3,0.92 0.5,1 0.7,1 1,1');
CustomEase.create('popE', 'M0,0 C0.16,0.62 0.28,1.08 0.46,1.08 0.62,1.08 0.78,0.995 1,1');

const q = (s) => (typeof s === 'string' ? document.querySelector(s) : s), qa = (s) => [...document.querySelectorAll(s)];
const NS = 'http://www.w3.org/2000/svg';
const tl = gsap.timeline({paused: true, defaults: {ease: 'expo.out'}});
const DUR = 71.6;
// tempos das palavras na locucao editada (segundos)
const T = {RAP: .40, P: 1.35, NEM: 2.24, FER: 2.79, CARA: 3.51, DA: 4.35, PRA: 4.69, ACR: 4.77, QUE: 5.63, VID: 5.85, INT: 6.33, PELO: 7.35, CLA: 7.63,
  O: 8.40, ANTES: 8.69, VOCE: 9.23, PERG: 9.63, NAO: 10.27, EU: 10.67, ABRI: 10.99, OO: 11.39, AFTER: 11.55, EFF: 11.75, ENEM: 12.37, NENHUM: 13.15,
  PROG: 13.47, EDI: 13.95, ETB: 14.78, NFOI: 15.06, HIG: 15.46, NEM2: 16.34, KAT: 16.74};

/* ---------- helpers ---------- */
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const defs = q('#fx defs'); let fid = 0; const allMB = [], syncers = [];
function mb(el) {
  el = q(el); if (el._mb) return el._mb;
  const id = 'mb' + (fid++);
  defs.insertAdjacentHTML('beforeend', `<filter id="${id}" x="-60%" y="-60%" width="220%" height="220%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="0 0"/></filter>`);
  const fe = defs.lastElementChild.firstElementChild;
  const p = {x: 0, y: 0, update() {
    if (p.x + p.y < .05) { el.style.filter = 'none'; return; }
    fe.setAttribute('stdDeviation', p.x.toFixed(2) + ' ' + p.y.toFixed(2)); el.style.filter = `url(#${id})`;
  }};
  el._mb = p; allMB.push(p); return p;
}
function refresh() { allMB.forEach((p) => p.update()); syncers.forEach((f) => f()); hud(); }
function blurSet(el, x, y) { const p = mb(el); p.x = x; p.y = y; p.update(); }
function blur(el, x, y, dur, ease, at) { const p = mb(el); tl.to(p, {x, y, duration: dur, ease, onUpdate: p.update}, at); }
function cut(from, to, at) { if (to) tl.set(to, {visibility: 'visible'}, at); if (from) tl.set(from, {visibility: 'hidden'}, at); }
function split(el) {
  el = q(el); const nodes = [...el.childNodes], out = []; el.textContent = '';
  nodes.forEach((n) => {
    if (n.nodeType === 3) { [...n.textContent].forEach((c) => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = c === ' ' ? ' ' : c; el.appendChild(s); out.push(s); }); }
    else { el.appendChild(n); out.push(n); }
  }); return out;
}
function burst(svg, n, r1, r2, color, width, seed) {
  const g = q(svg).querySelector('g'), R = rng(seed);
  for (let i = 0; i < n; i++) {
    const a = i / n * Math.PI * 2 + R() * .25, l1 = r1 * (.7 + R() * .6), l2 = r2 * (.6 + R() * .8);
    const ln = document.createElementNS(NS, 'line');
    ln.setAttribute('x1', Math.cos(a) * l1); ln.setAttribute('y1', Math.sin(a) * l1);
    ln.setAttribute('x2', Math.cos(a) * l2); ln.setAttribute('y2', Math.sin(a) * l2);
    ln.setAttribute('stroke', color); ln.setAttribute('stroke-width', width * (.5 + R())); ln.setAttribute('stroke-linecap', 'round');
    g.appendChild(ln);
  } return g;
}
function fire(g, at, s0 = .2, s1 = 1.3, s2 = 2.6, op = 1) {
  gsap.set(g, {scale: s0, opacity: 0, svgOrigin: '0 0'});
  tl.to(g, {scale: s1, opacity: op, duration: .12, ease: 'power2.out'}, at).to(g, {scale: s2, opacity: 0, duration: .5, ease: 'power2.out'}, at + .12);
}
function bokeh(box, n, seed) {
  const R = rng(seed), arr = [];
  for (let i = 0; i < n; i++) { const d = document.createElement('div'); d.className = 'bk'; const s = 8 + R() * 34;
    Object.assign(d.style, {width: s + 'px', height: s + 'px', left: (R() * 1280) + 'px', top: (R() * 720) + 'px', opacity: .25 + R() * .6, filter: `blur(${R() * 3}px)`});
    q(box).appendChild(d); arr.push(d); }
  return arr;
}
function shake(at, a = 10, d = .24) { tl.to('#cam', {keyframes: [{x: a, y: -a * .6}, {x: -a * .8, y: a * .5}, {x: a * .5, y: -a * .3}, {x: -a * .25, y: a * .15}, {x: 0, y: 0}], duration: d, ease: 'none'}, at); }
function steps(el, prop, vals, at, fps = 30) { vals.forEach((v, i) => tl.set(el, {[prop]: v}, at + i / fps)); }
function pop(el, at, x, y, rot) { gsap.set(el, {x, y, rotation: rot, scale: 0}); tl.to(el, {scale: 1, duration: .3, ease: 'back.out(3)'}, at); }
function flash(at, o = .8, d = .14) { tl.to('#flash', {opacity: o, duration: .04, ease: 'none'}, at).to('#flash', {opacity: 0, duration: d, ease: 'power1.out'}, at + .04); }
function ringFx(el, at, to = 5, d = .6) { gsap.set(el, {scale: .3, opacity: 0}); tl.to(el, {keyframes: {opacity: [0, .85, 0], scale: [.3, to * .4, to]}, duration: d, ease: 'power2.out'}, at); }
// centro de um elemento em coordenadas do palco (antes de qualquer transform)
function ctr(el) { const r = q(el).getBoundingClientRect(), s = q('#stage').getBoundingClientRect(), k = s.width / 1280; return {x: (r.left + r.width / 2 - s.left) / k, y: (r.top + r.height / 2 - s.top) / k, w: r.width / k, h: r.height / k}; }
// marca do curso (meia estrela), desenhada em vetor a partir do arquivo da logo
function mark(svg, color) {
  const g = q(svg).querySelector('g'), L = [234, 307, 235, 306, 235, 307, 234], out = [];
  const cp = document.createElementNS(NS, 'clipPath'); cp.id = 'half' + (fid++); cp.innerHTML = '<rect x="-400" y="-400" width="400" height="800"/>'; q(svg).appendChild(cp);
  g.setAttribute('clip-path', `url(#${cp.id})`);
  L.forEach((len, i) => { const a = (90 + i * 30) * Math.PI / 180, ln = document.createElementNS(NS, 'line');
    ln.setAttribute('x1', 0); ln.setAttribute('y1', 0); ln.setAttribute('x2', Math.cos(a) * len); ln.setAttribute('y2', -Math.sin(a) * len);
    ln.setAttribute('stroke', color); ln.setAttribute('stroke-width', 56); ln.setAttribute('stroke-linecap', 'round');
    gsap.set(ln, {strokeDasharray: len + 60, strokeDashoffset: len + 60}); g.appendChild(ln); out.push(ln); });
  return out;
}

function build() {
/* medidas que dependem do layout (antes dos transforms) */
const pTrack = ctr('#s5track'), pQ = ctr('#s7q'), pCls = ctr('#s11cls');

/* fundo da identidade: brilhos laranja derivando o tempo todo */
tl.to('#blobA', {x: 200, y: 110, scale: 1.3, duration: DUR, ease: 'sine.inOut'}, 0);
tl.to('#blobB', {x: -220, y: -120, scale: 1.25, duration: DUR, ease: 'sine.inOut'}, 0);
tl.to('#dots', {x: -52, y: -26, duration: DUR, ease: 'none'}, 0);

/* ===== [0:00] Rapaaaaz. ===== */
tl.set('#s1', {visibility: 'visible'}, 0);
gsap.set('#s1dot', {scale: 0});
tl.to('#s1dot', {scale: 1, duration: .16, ease: 'back.out(3)'}, .03);
const mk = mark('#s1mark', '#D97757');
gsap.set('#s1mark g', {scale: .5, rotation: -50, svgOrigin: '0 0'});
tl.to(mk, {strokeDashoffset: 0, duration: .16, stagger: .012, ease: 'power3.out'}, .09);
tl.to('#s1mark g', {rotation: 10, scale: .62, duration: .26, ease: 'power2.out'}, .09);
tl.to('#s1mark g', {scale: 3.4, rotation: 60, opacity: 0, duration: .18, ease: 'power3.in'}, .30);
const b1 = burst('#s1burst', 34, 40, 150, '#F2A07E', 2.4, 1); fire(b1, .36, .2, 1.5, 3.4);
tl.to('#s1dot', {scale: 2.8, duration: .1, ease: 'power2.out'}, .30).to('#s1dot', {scale: 0, duration: .1, ease: 'power2.in'}, .40);

const rz = split('#s1word'); rz.forEach((c) => c.style.verticalAlign = 'top'); rz[8].style.verticalAlign = 'bottom'; rz[8].style.marginBottom = '.135em';
const base = [rz[0], rz[1], rz[2], rz[3], rz[7]], extra = [rz[4], rz[5], rz[6]], pd1 = rz[8];
extra.forEach((c) => { c._w = c.offsetWidth; c.style.overflow = 'hidden'; c.style.width = '0px'; });
gsap.set(base, {opacity: 0, scale: 2.4, y: -40}); blurSet('#s1word', 30, 30);
tl.to(base, {opacity: 1, scale: 1, y: 0, duration: .36, stagger: .025, ease: 'enterE'}, T.RAP); blur('#s1word', 0, 0, .28, 'expo.out', T.RAP);
ringFx('#s1ring', T.RAP + .04, 6);
gsap.set('#s1glow', {opacity: 0, scale: .5}); tl.to('#s1glow', {opacity: .9, scale: 1, duration: .5}, T.RAP);
shake(T.RAP + .03, 13);
// borracha: estica no "Raaaa", segura no "p" e solta no "paaaz"
tl.to('#s1word', {scaleX: 1.46, scaleY: .82, duration: .62, ease: 'power2.out'}, T.RAP + .1);
tl.to('#s1word', {scaleX: .84, scaleY: 1.16, duration: .2, ease: 'power2.inOut'}, T.P - .22);
tl.to('#s1word', {scaleX: 1, scaleY: 1, duration: .75, ease: 'elastic.out(1.15,.3)'}, T.P);
extra.forEach((c, i) => { gsap.set(c, {scaleX: 2.8, scaleY: .7});
  tl.to(c, {width: c._w, scaleX: 1, scaleY: 1, duration: .34, ease: 'back.out(2.4)'}, T.P + i * .11); });
shake(T.P, 8, .2);
const R1 = rng(3);
for (let i = 0; i < 12; i++) { const d = document.createElement('div'); d.className = 'streak'; const w = 160 + R1() * 380;
  Object.assign(d.style, {width: w + 'px', top: (60 + R1() * 600) + 'px', left: '0px', opacity: .15 + R1() * .5}); q('#s1streaks').appendChild(d);
  gsap.set(d, {x: -700}); tl.to(d, {x: 1500, duration: .34 + R1() * .3, ease: 'power1.in'}, T.RAP + .12 + R1() * 1.3); }
tl.to(rz.slice(0, 8), {keyframes: {scaleY: [1, 1.24, .9, 1], y: [0, -34, 6, 0]}, duration: .36, ease: 'sine.inOut', stagger: .028}, 1.72);
gsap.set(pd1, {scale: 0, y: -330}); tl.to(pd1, {scale: 1, y: 0, duration: .34, ease: 'bounce.out'}, 1.62);
gsap.set('#s1cam', {rotationY: -10, rotationX: 5, scale: 1.3});
tl.to('#s1cam', {rotationY: 7, rotationX: -2, duration: 1.75, ease: 'sine.inOut'}, T.RAP);
tl.to('#s1cam', {scale: 1.13, duration: .9, ease: 'none'}, T.RAP).to('#s1cam', {scale: 1, duration: .5, ease: 'power3.out'}, T.P).to('#s1cam', {scale: 1.05, duration: .3, ease: 'none'}, T.P + .5);
tl.to('#s1glow', {keyframes: {opacity: [.9, .6, 1]}, duration: 1, ease: 'sine.inOut'}, 1.0);
// passagem de bastao: o ponto final cresce e vira o fundo laranja
tl.to(rz.slice(0, 8), {x: -24, duration: .08, ease: 'power2.out'}, 2.02);
tl.to(rz.slice(0, 8), {x: -700, opacity: 0, duration: .13, stagger: -.006, ease: 'power3.in'}, 2.09);
tl.to(pd1, {scale: .7, duration: .07, ease: 'power2.out'}, 2.03).to(pd1, {scale: 90, duration: .14, ease: 'expo.in'}, 2.10);

/* ===== [0:03] Nem ferrando, cara. Ha ha. ===== */
cut('#s1', '#s2', T.NEM);
const nm = split('#s2nem');
gsap.set('#s2nem', {scale: 2.3, opacity: 0, rotationX: 38}); blurSet('#s2nem', 36, 12);
tl.to('#s2nem', {scale: 1, opacity: 1, rotationX: 0, duration: .34, ease: 'enterE'}, T.NEM); blur('#s2nem', 0, 0, .26, 'expo.out', T.NEM);
tl.to(nm, {keyframes: {scaleY: [1, .84, 1.08, 1]}, duration: .32, stagger: .035, ease: 'sine.inOut'}, T.NEM + .08);
fire(burst('#s2burst', 46, 250, 330, '#0B0A0A', 2.2, 7), T.NEM, .8, 1.15, 1.8, .7);
shake(T.NEM + .02, 15);
gsap.set('#s2ghost', {x: 260}); tl.to('#s2ghost', {x: -620, duration: 1.3, ease: 'power2.inOut'}, T.NEM);
tl.to('#s2cam', {scale: 1.06, duration: 1.27, ease: 'none'}, T.NEM);
// camera chicoteia para a direita ate FERRANDO, (antecipa, acelera, freia)
tl.to('#s2world', {x: 46, duration: .1, ease: 'power2.out'}, T.FER - .2);
tl.to('#s2world', {x: -1500, duration: .23, ease: 'power4.inOut'}, T.FER - .1);
blur('#s2cam', 80, 0, .11, 'power2.in', T.FER - .1); blur('#s2cam', 0, 0, .16, 'power2.out', T.FER + .01);
const fr = split('#s2fer'); gsap.set(fr, {skewX: -26, x: 130});
tl.to(fr, {skewX: 0, x: 0, duration: .55, stagger: .02, ease: 'elastic.out(1,.5)'}, T.FER + .02);
gsap.set('#s2laser', {rotation: -8, scaleX: 0, x: -110});
tl.to('#s2laser', {scaleX: 1, duration: .07, ease: 'power2.in'}, T.CARA - .09);
flash(T.CARA - .02, .9, .12);

cut('#s2', '#s3', T.CARA);
gsap.set(['#s3hA', '#s3hB'], {rotation: -8});
tl.to('#s3hA', {y: -820, duration: .32, ease: 'expo.out'}, T.CARA); tl.to('#s3hB', {y: 820, duration: .32, ease: 'expo.out'}, T.CARA);
const ca = split('#s3cara');
gsap.set('#s3cara', {scale: 1.5, opacity: 0}); blurSet('#s3cara', 26, 26);
tl.to('#s3cara', {scale: 1, opacity: 1, duration: .32, ease: 'enterE'}, T.CARA); blur('#s3cara', 0, 0, .26, 'expo.out', T.CARA);
gsap.set('#s3pd', {scale: 0}); tl.to('#s3pd', {scale: 1, duration: .4, ease: 'back.out(3)'}, T.CARA + .1);
ringFx('#s3ring', T.CARA, 2, .7);
fire(burst('#s3burst', 52, 270, 330, '#2a2622', 1.8, 9), T.CARA, .8, 1.15, 1.7, .7);
shake(T.CARA + .01, 12);
// recomposicao: CARA. encolhe e a frase inteira se monta em volta
tl.to('#s3cara', {y: 158, scale: .56, duration: .34, ease: 'expo.inOut'}, 3.70);
const n3 = split('#s3nem'); gsap.set('#s3nem', {y: -600}); blurSet('#s3nem', 0, 40);
tl.to('#s3nem', {y: -212, duration: .3, ease: 'power4.out'}, 3.76); blur('#s3nem', 0, 0, .24, 'expo.out', 3.76);
tl.to(n3, {keyframes: {scaleY: [1, .72, 1.12, 1]}, duration: .3, stagger: .03, ease: 'sine.inOut'}, 3.9);
const f3 = split('#s3fer'); gsap.set('#s3fer', {y: -58}); gsap.set(f3, {x: -90, opacity: 0, skewX: 24});
tl.to(f3, {x: 0, opacity: 1, skewX: 0, duration: .34, stagger: .016, ease: 'back.out(2)'}, 3.82);
pop('#s3ha1', 3.86, 440, -200, -10); pop('#s3ha2', 3.99, -470, -70, 8); pop('#s3ha3', 4.10, 480, 150, -6);
tl.to(ca.slice(0, 4), {keyframes: {y: [0, -34, 0]}, duration: .2, ease: 'power1.inOut', stagger: .035}, 3.9);
tl.to(['#s3ha1', '#s3ha2', '#s3ha3'], {keyframes: {rotation: ['+=0', '+=9', '-=9', '+=0'], y: ['+=0', '-=14', '+=0']}, duration: .22, ease: 'sine.inOut', stagger: .05}, 4.02);
gsap.set('#s3cam', {rotationY: 8}); tl.to('#s3cam', {rotationY: -6, scale: 1.05, duration: .72, ease: 'sine.inOut'}, T.CARA);
// a folha de papel tomba para tras e revela o escuro
gsap.set('#s3', {zIndex: 60, transformOrigin: '50% 100%'});
tl.set('#s4', {visibility: 'visible'}, 4.17);
tl.to('#s3', {rotationX: 6, duration: .06, ease: 'power2.out'}, 4.13);
tl.to('#s3', {rotationX: -84, y: 240, scale: .84, duration: .17, ease: 'expo.in'}, 4.19);
tl.set('#s3', {visibility: 'hidden'}, 4.36);

/* ===== [0:06] Dá pra acreditar que esse vídeo aqui foi feito inteirinho pelo Claude? ===== */
gsap.set('#s4a', {y: 220, rotationX: -82, opacity: 0, transformOrigin: '50% 100%'}); blurSet('#s4a', 0, 30);
tl.to('#s4a', {y: 0, rotationX: 0, opacity: 1, duration: .42, ease: 'enterE'}, T.DA - .04); blur('#s4a', 0, 0, .3, 'expo.out', T.DA - .04);
const ac = split('#s4b'); split('#s4fill > div');
gsap.set(ac, {y: 100, opacity: 0, rotationX: -70});
tl.to(ac, {y: 0, opacity: 1, rotationX: 0, duration: .34, stagger: .02, ease: 'back.out(1.7)'}, T.PRA - .02);
tl.to('#s4fill', {width: '100%', duration: .72, ease: 'power1.inOut'}, T.ACR + .04);
tl.to('#s4stack', {keyframes: {scale: [1, 1.05, 1]}, duration: .2, ease: 'sine.inOut'}, T.ACR + .72);
tl.fromTo('#s4floor', {backgroundPosition: '0px 0px'}, {backgroundPosition: '0px 360px', duration: 1.5, ease: 'none'}, 4.17);
const bk4 = bokeh('#s4bk', 14, 4); tl.to(bk4, {y: '-=90', duration: 1.5, ease: 'none'}, 4.17);
gsap.set('#s4glow', {opacity: 0}); tl.to('#s4glow', {opacity: .75, duration: .5}, T.DA);
gsap.set('#s4cam', {rotationY: -13, scale: .95}); tl.to('#s4cam', {rotationY: 9, scale: 1.06, duration: 1.3, ease: 'sine.inOut'}, 4.2);
// grua: a camera sobe
tl.to('#s4cam', {y: -26, duration: .08, ease: 'power2.out'}, 5.42);
tl.to('#s4cam', {y: 780, duration: .13, ease: 'expo.in'}, 5.5); blur('#s4cam', 0, 70, .13, 'expo.in', 5.5);

cut('#s4', '#s5', T.QUE);
gsap.set('#s5cam', {y: -300, transformOrigin: `${pTrack.x}px ${pTrack.y}px`}); blurSet('#s5cam', 0, 46);
tl.to('#s5cam', {y: 0, duration: .36, ease: 'enterE'}, T.QUE); blur('#s5cam', 0, 0, .2, 'expo.out', T.QUE);
const qa5 = split('#s5a'); gsap.set(qa5, {opacity: 0, x: -30});
tl.to(qa5, {opacity: 1, x: 0, duration: .2, stagger: .018, ease: 'power3.out'}, T.QUE + .04);
const vb = split('#s5b'); gsap.set(vb, {y: -190, opacity: 0, scaleY: 1.6});
tl.to(vb, {y: 0, opacity: 1, scaleY: 1, duration: .36, stagger: .026, ease: 'back.out(2)'}, T.VID - .02);
const aq = split('#s5c'); gsap.set(aq, {y: 140, opacity: 0, rotation: 8});
tl.to(aq, {y: 0, opacity: 1, rotation: 0, duration: .32, stagger: .026, ease: 'back.out(2.4)'}, T.VID + .2);
gsap.set('#s5card', {x: 330, y: -260, rotationX: 64, rotationY: -20, opacity: .6});
tl.to('#s5card', {y: -10, rotationX: 0, rotationY: 0, opacity: 1, duration: .46, ease: 'back.out(1.5)'}, T.QUE);
tl.to('#s5card', {rotationY: 10, rotationX: -4, duration: .5, ease: 'sine.inOut'}, T.QUE + .56);
gsap.set('#s5btn', {scale: 0}); tl.to('#s5btn', {scale: 1, duration: .36, ease: 'back.out(3)'}, T.QUE + .28);
gsap.set('#s5fill', {scaleX: 0}); tl.to('#s5fill', {scaleX: .32, duration: .6, ease: 'none'}, T.QUE + .2);
const al = q('#s5arrow').getTotalLength(); gsap.set('#s5arrow', {strokeDasharray: al, strokeDashoffset: al, opacity: 0});
tl.set('#s5arrow', {opacity: 1}, 6.08); tl.to('#s5arrow', {strokeDashoffset: 0, duration: .2, ease: 'power2.inOut'}, 6.08);
gsap.set('#s5cur', {x: 600, y: 340, opacity: 0});
tl.to('#s5cur', {x: 350, y: -24, opacity: 1, duration: .32, ease: 'power3.out'}, 5.9);
tl.to('#s5cur', {scale: .78, duration: .05, yoyo: true, repeat: 1, ease: 'power1.inOut'}, 6.18);
tl.to('#s5btn', {keyframes: {scale: [1, .8, 1.28, 1]}, duration: .22, ease: 'power2.out'}, 6.19);
gsap.set('#s5glow', {opacity: 0}); tl.to('#s5glow', {opacity: .75, duration: .4}, T.QUE + .1);
// mergulho na barrinha do player, que vira a barra de progresso gigante
tl.to('#s5cam', {scale: .955, duration: .08, ease: 'power2.out'}, 6.15);
tl.to('#s5cam', {scale: 7.5, duration: .11, ease: 'expo.in'}, 6.23); blur('#s5cam', 34, 4, .11, 'expo.in', 6.23);

cut('#s5', '#s6', T.INT);
gsap.set('#s6barw', {y: 20, scaleX: 1.9, scaleY: .14}); blurSet('#s6barw', 30, 0);
tl.to('#s6barw', {scaleX: 1, scaleY: 1, duration: .34, ease: 'back.out(1.6)'}, T.INT); blur('#s6barw', 0, 0, .2, 'expo.out', T.INT);
const fo = split('#s6foi'); gsap.set(fo, {y: 34, opacity: 0});
tl.to(fo, {y: 0, opacity: 1, duration: .2, stagger: .018, ease: 'back.out(2.4)'}, T.INT + .04);
gsap.set('#s6pct', {opacity: 0}); tl.to('#s6pct', {opacity: 1, duration: .15}, T.INT + .08);
const pc = {v: 0}, pctEl = q('#s6pct'); syncers.push(() => { pctEl.textContent = Math.round(pc.v) + '%'; });
tl.to('#s6fill', {width: 1060, duration: .78, ease: 'power1.inOut'}, 6.40);
tl.to(pc, {v: 100, duration: .78, ease: 'power1.inOut'}, 6.40);
gsap.set('#s6glow', {opacity: .2, scale: .7}); tl.to('#s6glow', {opacity: .95, scale: 1.1, duration: .8, ease: 'power1.in'}, 6.40);
gsap.set('#s6cam', {rotationX: 16, rotationY: -12, scale: .93}); tl.to('#s6cam', {rotationX: 0, rotationY: 9, scale: 1.05, duration: .92, ease: 'sine.inOut'}, T.INT);
tl.to('#s6barw', {keyframes: {scale: [1, 1.08, 1]}, duration: .14, ease: 'sine.inOut'}, 7.18);
tl.to('#s6pct', {color: '#D97757', scale: 1.3, duration: .1, ease: 'back.out(3)'}, 7.18);
gsap.set('#s6burst', {x: 500, y: 20}); fire(burst('#s6burst', 22, 20, 120, '#F2A07E', 2.2, 5), 7.18, .2, 1.2, 2.2);
// colapso num ponto de luz
gsap.set('#s6dot', {scale: 0});
tl.to([fo, '#s6pct'], {y: -90, opacity: 0, duration: .09, ease: 'power2.in'}, 7.26);
tl.to('#s6barw', {scaleX: .02, scaleY: .1, duration: .09, ease: 'expo.in'}, 7.26);
tl.set('#s6barw', {opacity: 0}, 7.345); tl.set('#s6dot', {scale: 1}, 7.34);

cut('#s6', '#s7', T.PELO);
gsap.set('#s7pelo', {opacity: 0, letterSpacing: '.8em'});
tl.to('#s7pelo', {opacity: 1, letterSpacing: '.14em', duration: .28, ease: 'power3.out'}, T.PELO);
tl.to('#s7dot', {scale: 1.5, duration: .14, ease: 'sine.inOut'}, T.PELO).to('#s7dot', {scale: .45, duration: .12, ease: 'power2.in'}, T.CLA - .13)
  .to('#s7dot', {scale: 7, opacity: 0, duration: .22, ease: 'power2.out'}, T.CLA);
const cl = split('#s7cl'), cle = cl.slice(0, 6);
gsap.set(cle, {scaleY: 3, y: 70, opacity: 0}); blurSet('#s7cl', 0, 46);
tl.to(cle, {scaleY: 1, y: 0, opacity: 1, duration: .34, stagger: {each: .022, from: 'center'}, ease: 'enterE'}, T.CLA); blur('#s7cl', 0, 0, .28, 'expo.out', T.CLA);
gsap.set('#s7q', {rotation: 110, x: 280, opacity: 0, scale: .5});
tl.to('#s7q', {rotation: 0, x: 0, opacity: 1, scale: 1, duration: .5, ease: 'back.out(2.3)'}, T.CLA + .12);
ringFx('#s7r1', T.CLA, 7, .7); ringFx('#s7r2', T.CLA + .08, 5, .7);
fire(burst('#s7rays', 46, 70, 520, '#F2A07E', 2.6, 11), T.CLA, .1, 1, 1.6, .9);
gsap.set('#s7glow', {opacity: 0, scale: .4}); tl.to('#s7glow', {opacity: 1, scale: 1.2, duration: .4}, T.CLA)
  .to('#s7glow', {keyframes: {opacity: [1, .7, 1]}, duration: .5, ease: 'sine.inOut'}, T.CLA + .4);
shake(T.CLA + .02, 16, .28); flash(T.CLA, .4, .16);
const bk7 = bokeh('#s7bk', 14, 7); tl.to(bk7, {y: '-=70', duration: 1.1, ease: 'none'}, T.PELO);
tl.to(cle, {keyframes: {y: [0, -26, 0], scaleY: [1, 1.1, 1]}, duration: .26, ease: 'sine.inOut', stagger: .03}, 7.98);
gsap.set('#s7cam', {scale: .93, rotationY: 8}); tl.to('#s7cam', {scale: 1.06, rotationY: -6, duration: .9, ease: 'sine.inOut'}, T.PELO);
// passagem de bastao: o "?" abre a cena seguinte e vira o "?" gigante
gsap.set('#s8', {clipPath: `circle(0px at ${pQ.x}px ${pQ.y}px)`});
tl.set('#s8', {visibility: 'visible'}, 8.24);
tl.to('#s8', {clipPath: `circle(1600px at ${pQ.x}px ${pQ.y}px)`, duration: .17, ease: 'power3.in'}, 8.24);
tl.set('#s7', {visibility: 'hidden'}, 8.42);

/* ===== [0:10] E antes que você pergunte: não. ===== */
gsap.set('#s8q', {x: pQ.x - 640, y: pQ.y - 360, scale: .36, rotation: 0});
tl.to('#s8q', {x: 400, y: 10, scale: 1, rotation: 8, duration: .55, ease: 'back.out(1.35)'}, 8.25);
tl.to('#s8q', {rotation: 15, y: -14, duration: 1.4, ease: 'sine.inOut'}, 8.82);
const a8 = split('#s8a'); gsap.set(a8, {y: 70, opacity: 0, scaleY: 1.5});
[[0, 1, T.O + .14], [2, 7, T.ANTES - .03], [8, 11, 9.04]].forEach(([i0, i1, at]) => tl.to(a8.slice(i0, i1), {y: 0, opacity: 1, scaleY: 1, duration: .26, stagger: .02, ease: 'back.out(2.2)'}, at));
const v8 = split('#s8b'); gsap.set(v8, {y: -520, scaleY: 1.4});
tl.to(v8, {y: 0, scaleY: 1, duration: .3, stagger: .03, ease: 'power3.in'}, T.VOCE - .26);
tl.to(v8, {keyframes: {scaleY: [1, .7, 1.14, 1]}, duration: .3, stagger: .03, ease: 'sine.inOut'}, T.VOCE + .04);
shake(T.VOCE + .04, 7, .18);
const p8 = split('#s8c'), R8 = rng(8); p8.forEach((c) => gsap.set(c, {y: 130, opacity: 0, rotation: (R8() - .5) * 40}));
tl.to(p8, {y: 0, opacity: 1, rotation: 0, duration: .32, stagger: .024, ease: 'back.out(2.6)'}, T.PERG - .02);
for (let i = 0; i < 5; i++) { const d = document.createElement('div'); d.className = 't ' + ['k', 'outk'][i % 2]; d.textContent = '?';
  const sz = 90 + R8() * 90, x = 70 + R8() * 250, y = -270 + R8() * 520; d.style.cssText = `position:absolute;font-size:${sz}px`;
  q('#s8rain').appendChild(d); gsap.set(d, {x, y: -520, rotation: (R8() - .5) * 90});
  tl.to(d, {y, rotation: (R8() - .5) * 30, duration: .5, ease: 'bounce.out'}, 9.70 + i * .06); }
gsap.set('#s8cam', {rotationY: 10, x: 36}); tl.to('#s8cam', {rotationY: -8, x: -36, scale: 1.06, duration: 1.8, ease: 'sine.inOut'}, 8.42);
tl.to('#s8cam', {scale: 1.0, duration: .08, ease: 'power2.out'}, 10.19);

cut('#s8', '#s9', T.NAO);
gsap.set('#s9no', {opacity: 0});
steps('#s9g1', 'x', [-110, 70, -40, 20, 0], T.NAO); steps('#s9g2', 'x', [90, -60, 34, -12, 0], T.NAO); steps('#s9g3', 'x', [-60, 80, -24, 10, 0], T.NAO);
tl.set('#s9no', {opacity: 1}, T.NAO + .16); tl.set(['#s9g1', '#s9g2', '#s9g3'], {opacity: 0}, T.NAO + .16);
fire(burst('#s9burst', 40, 300, 380, '#0B0A0A', 2.4, 13), T.NAO, .8, 1.15, 1.7, .7);
shake(T.NAO, 16, .26);
tl.to('#s9cam', {scale: 1.07, duration: .26, ease: 'none'}, T.NAO);
tl.to('#s9blk', {opacity: 1, duration: .09, ease: 'none'}, 10.51);
tl.to('#s9no', {color: '#ffffff', duration: .08, ease: 'none'}, 10.51);
tl.to('#s9no', {rotationX: -10, duration: .05, ease: 'power2.out'}, 10.47);
tl.to('#s9no', {rotationX: 80, y: 290, scale: .8, duration: .15, ease: 'expo.in'}, 10.52); blur('#s9no', 0, 22, .15, 'expo.in', 10.52);

/* ===== [0:13] Eu não abri o After Effects nem nenhum programa de edição. ===== */
cut('#s9', '#s10', T.EU);
gsap.set('#s10line', {scaleX: 0}); tl.to('#s10line', {scaleX: 1, duration: .26}, T.EU);
gsap.set('#s10dot', {x: -560}); tl.to('#s10dot', {x: 560, duration: .26}, T.EU).to('#s10dot', {opacity: 0, duration: .12}, T.EU + .27);
gsap.set('#s10eu', {y: 300}); blurSet('#s10eu', 0, 26); tl.to('#s10eu', {y: 0, duration: .32, ease: 'enterE'}, T.EU + .02); blur('#s10eu', 0, 0, .26, 'expo.out', T.EU + .02);
gsap.set('#s10abri', {y: -300}); blurSet('#s10abri', 0, 26); tl.to('#s10abri', {y: 0, duration: .32, ease: 'enterE'}, T.ABRI - .03); blur('#s10abri', 0, 0, .26, 'expo.out', T.ABRI - .03);
gsap.set('#s10glow', {opacity: 0}); tl.to('#s10glow', {opacity: .85, duration: .4}, T.EU + .05);
gsap.set('#s10big', {rotationY: -8, scale: .97}); tl.to('#s10big', {rotationY: 6, scale: 1.05, duration: .6, ease: 'sine.inOut'}, T.EU);
tl.to('#s10big', {y: 24, duration: .07, ease: 'power2.out'}, 11.2);
tl.to('#s10big', {y: -680, duration: .12, ease: 'expo.in'}, 11.27); blur('#s10big', 0, 64, .12, 'expo.in', 11.27);

cut('#s10', '#s11', T.OO);
const h1 = split('#s11h1'); gsap.set(h1, {opacity: 0, y: 30});
tl.to(h1, {opacity: 1, y: 0, duration: .16, stagger: .02, ease: 'back.out(2.4)'}, T.OO);
gsap.set('#s11card', {y: 560, rotationX: 64, opacity: 0, transformOrigin: '50% 100%'});
tl.to('#s11card', {y: 60, rotationX: 0, opacity: 1, duration: .42, ease: 'back.out(1.25)'}, T.OO + .02);
const bars = qa('#s11card .tb'), kfs = qa('#s11card .kf');
gsap.set(bars, {scaleX: 0}); tl.to(bars, {scaleX: 1, duration: .32, stagger: .04}, T.OO + .2);
gsap.set(kfs, {scale: 0, rotation: 45}); tl.to(kfs, {scale: 1, duration: .2, ease: 'back.out(3)', stagger: .018}, T.OO + .28);
tl.to('#s11ph', {x: 300, duration: .62, ease: 'none'}, T.OO + .2);
const cX = pCls.x - 640 + 16, cY = pCls.y - 360 + 82;
gsap.set('#s11cur', {x: 440, y: 330, opacity: 0});
tl.to('#s11cur', {x: cX, y: cY, opacity: 1, duration: .36, ease: 'power3.inOut'}, T.AFTER + .02);
tl.to('#s11cur', {scale: .76, duration: .05, yoyo: true, repeat: 1, ease: 'power1.inOut'}, 11.96);
tl.to('#s11cls', {backgroundColor: '#D97757', scale: 1.35, duration: .08, ease: 'back.out(3)'}, 11.97);
gsap.set('#s11glow', {opacity: 0}); tl.to('#s11glow', {opacity: .7, duration: .4}, T.OO + .1);
gsap.set('#s11cam', {rotationY: -7}); tl.to('#s11cam', {rotationY: 5, scale: 1.04, duration: .64, ease: 'sine.inOut'}, T.OO);
// a janela e destruida: 12 cacos com gravidade
const SH = q('#s11shards'), R11 = rng(21), cw = 760, chh = 372, gx = [], gy = [];
for (let j = 0; j <= 3; j++) { gy.push([]); gx.push([]); for (let i = 0; i <= 4; i++) {
  gx[j].push((i === 0 || i === 4) ? i * cw / 4 : i * cw / 4 + (R11() - .5) * 90); gy[j].push((j === 0 || j === 3) ? j * chh / 3 : j * chh / 3 + (R11() - .5) * 70); } }
const shards = [];
for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++) {
  const c = q('#s11card').cloneNode(true); c.removeAttribute('id'); c.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
  c.className = 'card'; c.style.cssText = 'position:absolute;left:50%;top:50%;margin:-186px 0 0 -380px;border-radius:0;box-shadow:none;opacity:0';
  const P = [[gx[j][i], gy[j][i]], [gx[j][i + 1], gy[j][i + 1]], [gx[j + 1][i + 1], gy[j + 1][i + 1]], [gx[j + 1][i], gy[j + 1][i]]];
  c.style.clipPath = 'polygon(' + P.map((p) => `${p[0].toFixed(1)}px ${p[1].toFixed(1)}px`).join(',') + ')';
  const mx = (P[0][0] + P[2][0]) / 2, my = (P[0][1] + P[2][1]) / 2; c.style.transformOrigin = `${mx}px ${my}px`;
  SH.appendChild(c); gsap.set(c, {y: 60}); shards.push({c, dx: (mx - cw / 2) * (1.6 + R11()), up: (my - chh / 2) * 1.2, r: (R11() - .5) * 260, rx: (R11() - .5) * 300, ry: (R11() - .5) * 300});
}
const TB = 12.03;
tl.set('#s11card', {opacity: 0}, TB); tl.set(shards.map((s) => s.c), {opacity: 1}, TB); tl.set('#s11cur', {opacity: 0}, TB + .03);
shards.forEach((s) => {
  tl.to(s.c, {x: s.dx, rotation: s.r, rotationX: s.rx, rotationY: s.ry, duration: .8, ease: 'power2.out'}, TB);
  tl.to(s.c, {y: 60 + s.up - 40, duration: .16, ease: 'power2.out'}, TB).to(s.c, {y: 900, duration: .6, ease: 'power2.in'}, TB + .16);
});
fire(burst('#s11burst', 40, 60, 420, '#F2A07E', 2.6, 23), TB, .2, 1, 1.7, .95);
gsap.set('#s11burst', {y: 60}); shake(TB, 16, .28); flash(TB, .55, .14);
tl.to(h1, {y: 120, rotation: () => (R11() - .5) * 60, opacity: 0, duration: .3, stagger: .012, ease: 'power2.in'}, TB + .06);
// camera viaja pelos programas de edicao, e cada um cai quando ela passa
const h2a = split('#s11h2a'), h2b = split('#s11h2b');
gsap.set([h2a, h2b], {opacity: 0, y: -90, scaleY: 1.5});
tl.to(h2a, {opacity: 1, y: 0, scaleY: 1, duration: .28, stagger: .024, ease: 'back.out(2.2)'}, T.ENEM - .02);
tl.to(h2b, {opacity: 1, y: 0, scaleY: 1, duration: .28, stagger: .02, ease: 'back.out(2.2)'}, T.NENHUM - .02);
const ICONS = [
  '<rect x="10" y="20" width="66" height="46" rx="8" fill="none" stroke="#fff" stroke-width="6"/><path d="M36 32 L54 43 L36 54 Z" fill="#D97757"/>',
  '<circle cx="24" cy="62" r="11" fill="none" stroke="#fff" stroke-width="6"/><circle cx="62" cy="62" r="11" fill="none" stroke="#fff" stroke-width="6"/><path d="M30 53 L62 12 M56 53 L24 12" stroke="#D97757" stroke-width="6" stroke-linecap="round"/>',
  '<path d="M43 12 L76 28 L43 44 L10 28 Z" fill="#D97757"/><path d="M10 43 L43 59 L76 43 M10 58 L43 74 L76 58" fill="none" stroke="#fff" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>',
  '<path d="M12 43 V43 M26 30 V56 M40 16 V70 M54 26 V60 M68 36 V50" stroke="#fff" stroke-width="7" stroke-linecap="round"/><path d="M12 38 V48" stroke="#D97757" stroke-width="7" stroke-linecap="round"/>',
  '<path d="M12 66 C 30 10, 56 10, 74 66" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/><circle cx="12" cy="66" r="7" fill="#D97757"/><circle cx="74" cy="66" r="7" fill="#D97757"/><path d="M26 22 H60" stroke="#D97757" stroke-width="5" stroke-linecap="round"/>',
];
const TW = q('#s11tiles'), tiles = [], HIT = [12.80, 13.08, 13.36, 13.70, 14.08];
ICONS.forEach((svg, i) => { const d = document.createElement('div'); d.className = 'tile glass';
  d.innerHTML = `<svg viewBox="0 0 86 86">${svg}</svg><div class="tx"></div>`; TW.appendChild(d); tiles.push(d);
  gsap.set(d, {x: -464 + i * 232, y: -92, rotationY: -60, scale: .7, opacity: 0}); gsap.set(d.lastChild, {scaleX: 0, rotation: -24});
  tl.to(d, {rotationY: 0, scale: 1, opacity: 1, duration: .45, ease: 'back.out(1.7)'}, 12.3 + i * .1);
  tl.to(d.lastChild, {scaleX: 1, duration: .06, ease: 'power3.in'}, HIT[i] - .06);
  tl.to(d, {keyframes: {x: ['+=0', '+=14', '-=8', '+=0']}, duration: .1, ease: 'none'}, HIT[i]);
  tl.to(d, {rotationX: -100, y: 70, opacity: 0, duration: .32, ease: 'power2.in'}, HIT[i] + .1);
});
gsap.set(TW, {x: 760}); tl.to(TW, {x: 40, duration: .5, ease: 'enterE'}, 12.26); tl.to(TW, {x: -40, duration: 1.4, ease: 'sine.inOut'}, 12.76);
tl.to('#s11cam', {rotationY: -6, duration: 1.4, ease: 'sine.inOut'}, 12.4);
const pg = split('#s11p'), ed = split('#s11e');
gsap.set(pg, {y: 150, opacity: 0, scaleY: 1.5}); tl.to(pg, {y: 0, opacity: 1, scaleY: 1, duration: .32, stagger: .02, ease: 'back.out(2)'}, T.PROG - .03);
gsap.set(ed, {y: 150, opacity: 0, scaleY: 1.5}); tl.to(ed, {y: 0, opacity: 1, scaleY: 1, duration: .32, stagger: .018, ease: 'back.out(2.2)'}, T.EDI - .08);
shake(T.EDI + .1, 8, .2);
tl.to([pg, ed], {keyframes: {y: [0, -18, 0]}, duration: .22, stagger: .012, ease: 'sine.inOut'}, 14.2);
['#s11h2', '#s11h3'].forEach((el) => { tl.to(el, {x: 30, duration: .07, ease: 'power2.out'}, 14.5); tl.to(el, {x: -1500, duration: .13, ease: 'expo.in'}, 14.57); blur(el, 70, 0, .13, 'expo.in', 14.57); });

/* ===== [0:16] E também não foi Higgsfield, nem Katana. ===== */
cut('#s11', '#s12', 14.70);
gsap.set('#s12dot', {scale: 0}); tl.to('#s12dot', {scale: 1.4, duration: .12, ease: 'back.out(3)'}, 14.70).to('#s12dot', {opacity: 0, duration: .15}, 14.84);
gsap.set('#s12line', {scaleX: 0}); tl.to('#s12line', {scaleX: 1, duration: .26}, 14.74);
gsap.set('#s12glow', {opacity: 0}); tl.to('#s12glow', {opacity: .75, duration: .4}, 14.74);
const tb = split('#s12tb'); gsap.set('#s12tb', {y: -205}); gsap.set(tb, {y: 40, opacity: 0});
tl.to(tb, {y: 0, opacity: 1, duration: .2, stagger: .018, ease: 'back.out(2.4)'}, T.ETB - .02);
gsap.set('#s12nf', {scaleY: 0, opacity: 0}); blurSet('#s12nf', 0, 30);
tl.to('#s12nf', {scaleY: 1, opacity: 1, duration: .3, ease: 'popE'}, T.NFOI - .03); blur('#s12nf', 0, 0, .26, 'expo.out', T.NFOI - .03);
[['#s12e1', -210, .5], ['#s12e2', -420, .22], ['#s12e3', 210, .5], ['#s12e4', 420, .22]].forEach(([el, y, o], i) => { gsap.set(el, {opacity: 0}); tl.to(el, {y, opacity: o, duration: .4}, T.NFOI + .08 + i * .025); });
tl.to('#s12tb', {y: -292, duration: .4}, T.NFOI + .08);
shake(T.NFOI, 9, .2);
gsap.set('#s12cam', {rotationY: 7, scale: .96}); tl.to('#s12cam', {rotationY: -5, scale: 1.06, duration: .7, ease: 'sine.inOut'}, 14.72);
const R12 = rng(5), bars12 = [];
for (let i = 0; i < 7; i++) { const d = document.createElement('div'); d.className = 'gb';
  Object.assign(d.style, {top: (R12() * 640) + 'px', height: (30 + R12() * 110) + 'px', background: i % 2 ? '#D97757' : '#ffffff'}); q('#s12bars').appendChild(d); bars12.push(d); }
gsap.set(bars12, {scaleX: 0}); tl.to(bars12, {scaleX: 1, duration: .05, stagger: .012, ease: 'none'}, 15.36);

cut('#s12', '#s13', T.HIG);
const hgA = split('#s13h'), hgB = split('#s13hB .t');
[hgA, hgB].forEach((arr) => { gsap.set(arr, {x: 520, opacity: 0, skewX: -24}); tl.to(arr, {x: 0, opacity: 1, skewX: 0, duration: .42, stagger: .017, ease: 'back.out(1.6)'}, T.HIG); });
blurSet('#s13hw', 40, 0); blur('#s13hw', 0, 0, .26, 'expo.out', T.HIG);
gsap.set('#s13ghost', {x: 320}); tl.to('#s13ghost', {x: -380, duration: 1.9, ease: 'sine.inOut'}, T.HIG);
gsap.set('#s13cam', {rotationY: -8, scale: .97}); tl.to('#s13cam', {rotationY: 6, scale: 1.04, duration: 1.6, ease: 'sine.inOut'}, T.HIG);
// risco no Higgsfield: barra branca bate, a palavra racha e fica pendurada
const S1 = 16.00;
gsap.set('#s13s1', {scaleX: 0});
tl.to('#s13hw', {x: -20, duration: .08, ease: 'power2.out'}, S1 - .1);
tl.to('#s13s1', {scaleX: 1, duration: .07, ease: 'power3.in'}, S1);
tl.to('#s13hA', {x: -26, y: -10, duration: .22, ease: 'back.out(3)'}, S1 + .07); tl.to('#s13hB', {x: 26, y: 10, duration: .22, ease: 'back.out(3)'}, S1 + .07);
tl.to('#s13hw', {x: 0, rotation: -3.5, y: -108, opacity: .5, duration: .5, ease: 'elastic.out(1,.45)'}, S1 + .07);
shake(S1 + .07, 18, .3); flash(S1 + .06, .35, .12);
const b13 = burst('#s13burst', 30, 80, 380, '#ffffff', 3, 31); gsap.set('#s13burst', {y: -125}); fire(b13, S1 + .07, .3, 1, 1.5, .9);
// Katana: entra, e um corte diagonal separa a palavra em duas
const ktA = split('#s13k'), ktB = split('#s13kB .t');
gsap.set(['#s13kA', '#s13kB'], {clipPath: (i) => i === 0 ? 'polygon(0 0,100% 0,0 100%)' : 'polygon(100% 0,100% 100%,0 100%)'});
[ktA, ktB].forEach((arr) => { gsap.set(arr, {y: 260, opacity: 0, scaleY: 1.6}); tl.to(arr, {y: 0, opacity: 1, scaleY: 1, duration: .34, stagger: .016, ease: 'back.out(1.8)'}, T.NEM2 - .03); });
const S2 = 17.00, kb = ctr('#s13k'), kang = -Math.atan2(kb.h, kb.w) * 180 / Math.PI;
gsap.set('#s13slash', {rotation: kang - 1, y: 135, scaleX: 0, x: -210, opacity: 0});
tl.to('#s13kw', {y: 147, duration: .1, ease: 'power2.out'}, S2 - .12);
tl.set('#s13slash', {opacity: 1}, S2); tl.to('#s13slash', {scaleX: 1, duration: .05, ease: 'power2.in'}, S2).to('#s13slash', {opacity: 0, duration: .16}, S2 + .08);
flash(S2 + .04, .85, .14); shake(S2 + .05, 20, .3);
tl.to('#s13kA', {x: -46, y: -22, duration: .2, ease: 'power3.out'}, S2 + .06); tl.to('#s13kB', {x: 46, y: 22, duration: .2, ease: 'power3.out'}, S2 + .06);
tl.to('#s13kA', {x: -420, y: -620, rotation: -14, duration: .32, ease: 'power2.in'}, S2 + .24); tl.to('#s13kB', {x: 380, y: 760, rotation: 12, duration: .32, ease: 'power2.in'}, S2 + .24);
tl.to('#s13hw', {y: 820, rotation: 16, duration: .34, ease: 'power2.in'}, S2 + .2);
tl.to('#s13blk', {opacity: 1, duration: .12, ease: 'none'}, S2 + .34);
tl.to('#s13ghost', {opacity: 0, duration: .1}, S2 + .34);
build2();
tl.to({}, {duration: .01}, DUR - .01);
}

/* ---------- falas (HUD) ---------- */
const beats = [
  [0, '0:00', 'Rapaaaaz.', 'O ponto acende, a marca do curso se desenha e estoura. A palavra entra em slam e vira borracha: estica no "Raaaa", segura no "p" e solta no "paaaz" com os A extras nascendo. O ponto final cai quicando e cresce até virar o fundo laranja.'],
  [T.NEM, '0:02', 'Nem ferrando,', 'NEM em slam no laranja. A câmera antecipa e chicoteia para a direita até FERRANDO, cujas letras chegam inclinadas e assentam com mola.'],
  [T.CARA, '0:03', 'cara. Ha ha.', 'Um laser corta a tela, o laranja abre em duas metades e revela CARA. no papel. A frase se recompõe em volta e os HA estouram. A folha tomba para trás.'],
  [T.DA, '0:04', 'Dá pra acreditar', 'DÁ PRA sobe em dobradiça 3D sobre um piso em perspectiva. ACREDITAR nasce em contorno e é preenchida de laranja no tempo da fala. A câmera sobe de grua.'],
  [T.QUE, '0:05', 'que esse vídeo aqui', 'O player de vidro cai em 3D, a seta se desenha do AQUI até ele e o cursor clica. A câmera mergulha na barrinha do player.'],
  [T.INT, '0:06', 'foi feito inteirinho', 'A barrinha vira uma barra de progresso gigante. INTEIRINHO é preenchida de 0 a 100% e a barra colapsa num ponto de luz.'],
  [T.PELO, '0:07', 'pelo Claude?', 'PELO fecha o espaçamento, o ponto recua e explode: CLAUDE entra esticada do centro, com anéis, raios e tremor. O "?" entra girando.'],
  [8.24, '0:08', 'E antes que você pergunte:', 'O "?" abre a cena seguinte em círculo e vira o "?" gigante. VOCÊ cai e amassa no impacto, PERGUNTE: entra letra a letra e chove interrogação.'],
  [T.NAO, '0:10', 'não.', 'NÃO. em glitch de degraus com tremor, e tomba para trás no escuro.'],
  [T.EU, '0:10', 'Eu não abri', 'O ponto puxa a linha de luz. EU NÃO nasce acima dela e ABRI abaixo.'],
  [T.OO, '0:11', 'o After Effects', 'A janela sobe em 3D, o cursor vai até o botão de fechar, clica e ela se estilhaça em 12 cacos.'],
  [T.ENEM, '0:12', 'nem nenhum programa de edição.', 'A câmera passa por cinco programas genéricos. Cada um leva um risco e cai quando ela passa.'],
  [14.7, '0:14', 'E também não foi', 'NÃO FOI nasce da linha e abre em ecos. Barras de glitch cobrem a tela.'],
  [T.HIG, '0:15', 'Higgsfield,', 'Entra em stagger no laranja. A barra branca bate, a palavra racha em duas e fica pendurada.'],
  [T.NEM2, '0:16', 'nem Katana.', 'Um corte diagonal de luz separa a palavra em duas metades, que caem.'],
  ...BEATS2,
];

/* ---------- player: audio e mestre a 1x, timeline segue ---------- */
const scrub = q('#scrub'), tc = q('#tc'), playB = q('#play'), chips = q('#chips'); let curBeat = -1;
const aMix = q('#aMix'), aVoz = q('#aVoz'); let au = aMix, playing = false, rate = 1, tNow = 0, last = 0;
function hud() {
  const t = tl.time(); scrub.value = t; tc.textContent = t.toFixed(2) + 's · f' + Math.round(t * 30);
  let i = 0; for (let k = 0; k < beats.length; k++) if (t >= beats[k][0]) i = k;
  if (i !== curBeat) { curBeat = i; q('#ifala').innerHTML = `<small>[${beats[i][1]}]</small>${beats[i][2]}`; q('#idesc').textContent = beats[i][3];
    [...chips.children].forEach((c, k) => c.classList.toggle('on', k === i)); }
}
function render(t) { tNow = Math.max(0, Math.min(DUR, t)); tl.time(tNow, true); refresh(); }
function audioOn() { return rate >= .25; }
function setPlaying(p) {
  playing = p; playB.textContent = p ? '❚❚ pausar' : '▶ tocar';
  [aMix, aVoz].forEach((a) => a.pause());
  if (p && audioOn()) { au.playbackRate = rate; try { au.currentTime = Math.min(tNow, au.duration || DUR); } catch (e) {} const pr = au.play(); if (pr && pr.catch) pr.catch(() => {}); }
  last = performance.now();
}
function seek(t) { render(t); if (playing && audioOn()) { try { au.currentTime = tNow; } catch (e) {} } }
gsap.ticker.add(() => {
  if (!playing) return; const now = performance.now(), dt = (now - last) / 1000; last = now;
  let t = tNow + dt * rate;
  // o relogio anda liso e so corrige quando se afasta do audio
  if (audioOn() && !au.paused && au.readyState > 2) { const err = au.currentTime - t; t = Math.abs(err) > .25 ? au.currentTime : t + err * .2; }
  if (t >= DUR || (audioOn() && au.ended)) { if (q('#loop').checked) { render(0); setPlaying(true); return; } render(DUR); setPlaying(false); return; }
  render(t);
});
window.__seek = (t) => { setPlaying(false); render(t); };
window.__dur = DUR;

const vp = q('#viewport'); const fit = () => { q('#stage').style.transform = `scale(${vp.clientWidth / 1280})`; };
new ResizeObserver(fit).observe(vp);
const cv = q('#grain'), cx = cv.getContext('2d'); cv.width = 320; cv.height = 180;
const gR = rng(99), frames = [...Array(4)].map(() => { const im = cx.createImageData(320, 180); for (let i = 0; i < im.data.length; i += 4) { const v = gR() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; } return im; });
syncers.push(() => cx.putImageData(frames[Math.floor(tl.time() * 16) % 4], 0, 0));

Promise.all([document.fonts.load("400 40px 'Anton'"), document.fonts.load("900 40px 'Archivo'"), document.fonts.load("700 20px 'JetBrains Mono'")]).then(() => {
  q('#stage').style.transform = 'none';
  build(); fit();
  beats.forEach(([t, ts, f]) => { const b = document.createElement('button'); b.textContent = ts + ' · ' + f; b.onclick = () => { setPlaying(false); seek(t + .001); }; chips.appendChild(b); });
  scrub.max = DUR;
  scrub.addEventListener('input', () => { setPlaying(false); seek(+scrub.value); });
  playB.onclick = () => { if (tNow >= DUR - .02) render(0); setPlaying(!playing); };
  q('#tap').onclick = () => { q('#tap').style.display = 'none'; render(0); setPlaying(true); };
  const step = (d) => { setPlaying(false); seek(Math.round(tNow * 30) / 30 + d / 30); };
  q('#prev').onclick = () => step(-1); q('#next').onclick = () => step(1);
  qa('.spd').forEach((b) => b.onclick = () => { rate = +b.dataset.s; qa('.spd').forEach((x) => x.classList.toggle('on', x === b)); if (playing) setPlaying(true); });
  q('#snd').onclick = () => { au = au === aMix ? aVoz : aMix; q('#snd').textContent = au === aMix ? 'som: voz + efeitos' : 'som: só a voz'; if (playing) setPlaying(true); };
  addEventListener('keydown', (e) => { if (e.code === 'Space') { e.preventDefault(); q('#tap').style.display = 'none'; playB.click(); } else if (e.key === 'ArrowRight') step(1); else if (e.key === 'ArrowLeft') step(-1); });
  render(0); window.__ready = true;
});
