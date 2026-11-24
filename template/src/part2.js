/* ===== segunda parte: 0:17 ate o fim ===== */
const BEATS2 = [
  [17.45, '0:17', 'Eu disse pro Claude como eu queria o vídeo,', 'Texto à esquerda e um cartão de conversa em vidro à direita: as linhas do pedido se escrevem e o botão de enviar é apertado.'],
  [20.2, '0:20', 'e ele transformou isso nessa animação.', 'A câmera mergulha no cartão. ANIMAÇÃO. entra com cada letra fazendo um movimento diferente, com formas girando em volta.'],
  [22.43, '0:22', 'Só que não adianta chegar e escrever:', 'Papel claro. NÃO ADIANTA balança como quem nega e a linha de baixo é digitada.'],
  [24.72, '0:24', '"Crie uma animação de 15 segundos..."', 'O pedido genérico é digitado no tempo da fala. Cada item ganha um ícone: letras, forma mudando, cubo 3D e câmera.'],
  [32.78, '0:32', 'Se pedir assim, sai um vídeo igual ao de todo mundo.', 'A câmera recua e revela dezenas de vídeos idênticos.'],
  [36.52, '0:36', 'Agora olha as letras desse aqui.', 'Corte para o laranja. Cada letra entra com um truque diferente.'],
  [38.42, '0:38', 'E espera a transição...', 'Um anel de carregamento se fecha em volta da palavra e os três pontos entram um a um.'],
  [39.86, '0:39', 'Tá de brincadeira comigo?!', 'A cena abre em círculo, uma estrela laranja estoura e o texto bate em três tempos.'],
  [41.72, '0:41', 'Pensa em fazer isso do jeito tradicional.', 'Uma timeline genérica em perspectiva, com camadas, keyframes e agulha andando, passa atrás do texto.'],
  [44.9, '0:44', 'Programa pesado. Mil botões. Horas pra cada segundo.', 'Uma janela pesada cai e amassa no impacto. Depois a tela enche de botões. Depois o relógio dispara.'],
  [49.36, '0:49', 'E depois... esperar ficar pronto.', 'Barra parada em 2% e contagem regressiva de horas.'],
  [52.15, '0:52', 'Aqui? Eu só precisei saber como pedir.', 'AQUI? gigante no laranja, e a resposta entra no escuro.'],
  [55.25, '0:55', 'E esse vídeo, da primeira ideia ao último segundo,', 'A câmera viaja por uma linha, do ponto da ideia até o marcador do último segundo.'],
  [58.66, '0:58', 'foi feito só com o Claude. Só o Claude.', 'CLAUDE. bate no laranja. Tudo cai e sobra SÓ O CLAUDE. sublinhado no escuro.'],
  [62.58, '1:02', 'Puuuuuts.', 'A palavra estica como borracha, igual ao Rapaaaaz do começo.'],
  [63.7, '1:03', 'Se você quiser saber o passo a passo para criar esses vídeos,', 'PASSO A PASSO entra letra a letra.'],
  [67.36, '1:07', 'segue meu perfil e comenta \u201cCLAUDE\u201d que te mando.', 'O cartão do perfil sobe em 3D. A mão toca em Seguir e o botão vira Seguindo. Depois entra a frase do comentário.'],
];

function build2() {
  const lab = (el, at, st = .018) => { const c = split(el); gsap.set(c, {y: 34, opacity: 0}); tl.to(c, {y: 0, opacity: 1, duration: .2, stagger: st, ease: 'back.out(2.4)'}, at); return c; };
  const rise = (el, at, st = .022, y = 170) => { const c = split(el); gsap.set(c, {y, opacity: 0, scaleY: 1.6}); tl.to(c, {y: 0, opacity: 1, scaleY: 1, duration: .34, stagger: st, ease: 'back.out(2)'}, at); return c; };
  const slam = (el, at, s = 2.2) => { gsap.set(el, {scale: s, opacity: 0}); blurSet(el, 26, 26); tl.to(el, {scale: 1, opacity: 1, duration: .32, ease: 'enterE'}, at); blur(el, 0, 0, .26, 'expo.out', at); };
  const whipOut = (el, at, x = -1500, y = 0) => { tl.to(el, {x: -x * .02, y: -y * .03, duration: .07, ease: 'power2.out'}, at - .07); tl.to(el, {x, y, duration: .13, ease: 'expo.in'}, at); blur(el, x ? 70 : 0, y ? 70 : 0, .13, 'expo.in', at); };
  const whipIn = (el, at, x = 900, y = 0) => { gsap.set(el, {x, y}); blurSet(el, x ? 50 : 0, y ? 50 : 0); tl.to(el, {x: 0, y: 0, duration: .36, ease: 'enterE'}, at); blur(el, 0, 0, .22, 'expo.out', at); };
  const sway = (el, at, d, a = 8, s0 = .96, s1 = 1.06) => { gsap.set(el, {rotationY: -a, scale: s0}); tl.to(el, {rotationY: a * .8, scale: s1, duration: d, ease: 'sine.inOut'}, at); };
  const show = (el, at) => { gsap.set(el, {autoAlpha: 0}); tl.set(el, {autoAlpha: 1}, at); };
  const hide = (el, at) => tl.set(el, {autoAlpha: 0}, at);
  const mk = (cls, css, parent, html = '') => { const d = document.createElement('div'); d.className = cls; d.style.cssText = css; d.innerHTML = html; q(parent).appendChild(d); return d; };
  function buildTL(el, seed) { const R = rng(seed), box = q(el), bars = [], dia = [];
    for (let k = 0; k < 10; k++) mk('tlt', `left:${60 + k * 180}px`, box, String(k * 2).padStart(2, '0') + 's');
    for (let i = 0; i < 10; i++) { const r = mk('tlr', `top:${54 + i * 62}px`, box), l = 40 + R() * 380, w = 600 + R() * 900;
      bars.push(mk('tlb', `left:${l}px;width:${w}px;background:${i % 2 ? '#6f6a78' : '#b08a5c'}`, r));
      for (let k = 0; k < 4; k++) dia.push(mk('tld', `left:${l + w * (.1 + .27 * k + R() * .08)}px`, r)); }
    return {bars, dia, ph: mk('tlp', 'left:0', box)}; }
  const pF = ctr('#sOfw'), pL = ctr('#sOlk');

  /* ===== A. Eu disse pro Claude como eu queria o video, e ele transformou isso nessa animacao. ===== */
  cut('#s13', '#sA', 17.45);
  rise('#sA1', 17.48); rise('#sA2', 18.44); lab('#sA3', 19.02, .014);
  gsap.set('#sAcard', {x: 340, y: 380, rotationX: 62, rotationY: -24, opacity: 0});
  tl.to('#sAcard', {y: 0, rotationX: 0, rotationY: -9, opacity: 1, duration: .5, ease: 'back.out(1.4)'}, 17.56);
  const sk = qa('#sAcard .sk'); gsap.set(sk, {scaleX: 0}); tl.to(sk, {scaleX: 1, duration: .24, stagger: .22, ease: 'power2.out'}, 19.05);
  gsap.set('#sAsend', {scale: 0}); tl.to('#sAsend', {scale: 1, duration: .3, ease: 'back.out(3)'}, 18.5);
  tl.to('#sAsend', {keyframes: {scale: [1, .78, 1.3, 1]}, duration: .24, ease: 'power2.out'}, 19.93);
  gsap.set('#sAglow', {opacity: 0}); tl.to('#sAglow', {opacity: .8, duration: .4}, 17.6);
  sway('#sAcam', 17.45, 2.6, 7, .97, 1.05);
  gsap.set('#sA', {transformOrigin: '990px 360px'});
  tl.to('#sA', {scale: .96, duration: .08, ease: 'power2.out'}, 20.04);
  tl.to('#sA', {scale: 7, duration: .12, ease: 'expo.in'}, 20.12); blur('#sA', 30, 8, .12, 'expo.in', 20.12);
  hide('#sAcam', 20.24); show('#sAcam2', 20.24); flash(20.22, .5, .12); tl.set('#sA', {scale: 1}, 20.24); blur('#sA', 0, 0, .01, 'none', 20.24);
  gsap.set('#sAcam2', {scale: 1.7}); tl.to('#sAcam2', {scale: 1, duration: .4, ease: 'enterE'}, 20.24); tl.to('#sAcam2', {scale: 1.06, rotationY: 6, duration: 1.6, ease: 'sine.inOut'}, 20.64);
  lab('#sA4', 20.26, .014); rise('#sA5', 21.16);
  const an = split('#sA6'), RA = rng(41);
  an.forEach((c, i) => { gsap.set(c, {opacity: 0, y: (RA() - .5) * 500, x: (RA() - .5) * 300, rotation: (RA() - .5) * 240, scale: .3});
    tl.to(c, {opacity: 1, y: 0, x: 0, rotation: 0, scale: 1, duration: .42, ease: 'back.out(1.8)'}, 21.54 + i * .028);
    tl.to(c, {keyframes: {y: [0, -30 - RA() * 20, 0], scaleY: [1, 1.16, 1], rotation: [0, (RA() - .5) * 14, 0]}, duration: .34, ease: 'sine.inOut'}, 21.98 + i * .03); });
  [['50%', '#D97757', -470, -210], ['8px', 'transparent', 480, -190], ['50%', 'transparent', -500, 200], ['8px', '#D97757', 500, 210]].forEach(([br, bgc, x, y], i) => {
    const d = mk('', `position:absolute;width:74px;height:74px;border-radius:${br};background:${bgc};border:5px solid ${bgc === 'transparent' ? '#fff' : '#D97757'}`, '#sAshapes');
    gsap.set(d, {x: 0, y: 0, scale: 0}); tl.to(d, {x, y, scale: 1, rotation: 200 + i * 60, duration: .6, ease: 'back.out(1.4)'}, 20.3 + i * .06);
    tl.to(d, {rotation: '+=260', x: x * .9, y: y * 1.08, borderRadius: i % 2 ? '50%' : '8px', duration: 1.3, ease: 'sine.inOut'}, 20.95); });
  whipOut('#sAcam2', 22.3, 0, -780);

  /* ===== B. So que nao adianta chegar e escrever: ===== */
  cut('#sA', '#sB', 22.43);
  whipIn('#sBcam', 22.43, 0, 520);
  lab('#sB1', 22.5); slam('#sB2', 22.72, 1.8); shake(22.74, 10, .2);
  tl.to('#sB2', {keyframes: {x: [0, -30, 26, -18, 10, 0]}, duration: .42, ease: 'sine.inOut'}, 22.98);
  const b3 = split('#sB3'); gsap.set(b3, {opacity: 0, y: 30}); tl.to(b3, {opacity: 1, y: 0, duration: .14, stagger: .05, ease: 'back.out(3)'}, 23.44);
  tl.to('#sBcam', {scale: 1.05, rotationY: 5, duration: 2, ease: 'sine.inOut'}, 22.6);
  whipOut('#sBcam', 24.6, 0, 780);

  /* ===== C. o pedido generico, digitado no tempo da fala ===== */
  cut('#sB', '#sC', 24.72);
  whipIn('#sCcam', 24.72, 0, -520);
  gsap.set('#sCglow', {opacity: 0}); tl.to('#sCglow', {opacity: .7, duration: .5}, 24.8);
  const TX = [['Crie uma animação de ', 24.76, 25.9, 0], ['15 segundos', 25.95, 26.8, 1], ['\ncom ', 27.2, 27.28, 0], ['letras em movimento', 27.3, 28.4, 1], [', ', 28.42, 28.5, 0], ['formas que mudam', 28.66, 29.6, 1], [',\n', 29.62, 29.7, 0],
    ['objetos em 3D', 30.06, 31.1, 1], [' e a ', 31.34, 31.54, 0], ['câmera passeando', 31.58, 32.4, 1], ['.', 32.42, 32.46, 0]];
  TX.forEach(([txt, t0, t1, chip]) => { const w = document.createElement('span'); if (chip) { w.className = 'chip'; gsap.set(w, {backgroundColor: 'rgba(217,119,87,0)'}); tl.to(w, {backgroundColor: 'rgba(217,119,87,.92)', color: '#0B0A0A', duration: .15}, t1); }
    [...txt].forEach((ch, i) => { const s = document.createElement('span'); s.textContent = ch; s.style.opacity = 0; w.appendChild(s); tl.set(s, {opacity: 1}, t0 + (t1 - t0) * i / txt.length); }); q('#sCtxt').appendChild(w); });
  const IC = [27.3, 28.66, 30.06, 31.58].map((at, i) => { const d = mk('ico glass', '', '#sCicons'); gsap.set(d, {x: -405 + i * 270, y: -226, scale: 0, rotation: -30}); tl.to(d, {scale: 1, rotation: 0, duration: .4, ease: 'back.out(2.4)'}, at); return d; });
  IC[0].innerHTML = '<div class="t w" style="font-size:84px"><span class="ch">A</span><span class="ch o">a</span></div>';
  tl.to(IC[0].querySelectorAll('.ch'), {keyframes: {y: [0, -22, 0], scaleY: [1, 1.2, 1]}, duration: .4, stagger: .12, repeat: 11, ease: 'sine.inOut'}, 27.5);
  const mo = mk('', 'width:74px;height:74px;border-radius:50%;background:#D97757', IC[1]); tl.to(mo, {borderRadius: '10%', rotation: 135, duration: .5, ease: 'power2.inOut', repeat: 7, yoyo: true}, 28.8);
  IC[2].style.perspective = '500px';
  const cube = mk('', 'width:70px;height:70px;position:relative;transform-style:preserve-3d', IC[2]);
  [['rotateY(0deg)', '#D97757'], ['rotateY(90deg)', '#F2A07E'], ['rotateY(180deg)', '#B4573A'], ['rotateY(-90deg)', '#C8623F'], ['rotateX(90deg)', '#F7C3AE'], ['rotateX(-90deg)', '#8f4630']].forEach(([r, c]) => mk('', `position:absolute;inset:0;background:${c};transform:${r} translateZ(35px)`, cube));
  gsap.set(cube, {rotationX: -24, rotationY: 30}); tl.to(cube, {rotationY: 750, rotationX: 336, duration: 2.7, ease: 'none'}, 30.06);
  IC[3].innerHTML = '<svg width="92" height="92" viewBox="0 0 92 92"><rect x="10" y="28" width="52" height="38" rx="8" fill="none" stroke="#fff" stroke-width="6"/><path d="M62 42 L82 32 V62 L62 52 Z" fill="#D97757"/><circle cx="36" cy="47" r="9" fill="#D97757"/></svg>';
  tl.to(IC[3].firstChild, {keyframes: {x: [0, 16, -16, 0], rotation: [0, 8, -8, 0]}, duration: .9, ease: 'sine.inOut'}, 31.7);
  sway('#sCcam', 25.1, 7.4, 6, 1, 1.05);
  tl.to('#sCbox', {keyframes: {scaleY: [1, .9, 1.04, 1], scaleX: [1, 1.03, .99, 1]}, duration: .2, ease: 'sine.inOut'}, 32.6);

  /* ===== D. Se pedir assim, sai um video igual ao de todo mundo. ===== */
  cut('#sC', '#sD', 32.78);
  gsap.set('#sDback', {opacity: 0});
  slam('#sDa1', 32.84); shake(32.86, 10, .2); rise('#sDa2', 33.98);
  whipOut('#sDa', 34.42, 0, -780);
  const RD = rng(52), cards = [];
  for (let j = -3; j <= 3; j++) for (let i = -4; i <= 4; i++) { const d = mk('vc', `left:${540 + i * 218}px;top:${304 + j * 130}px`, '#sDgrid'); cards.push([d, Math.hypot(i, j * 1.4)]); gsap.set(d, {scale: 0}); }
  cards.forEach(([d, r]) => tl.to(d, {scale: 1, duration: .3, ease: 'back.out(2)'}, 34.42 + r * .1 + RD() * .04));
  gsap.set('#sDgrid', {scale: 3.4, rotation: -6, transformOrigin: '640px 360px'}); tl.to('#sDgrid', {scale: 1.02, rotation: 0, duration: 1.1, ease: 'expo.out'}, 34.42); tl.to('#sDgrid', {scale: .9, duration: 1, ease: 'sine.inOut'}, 35.5);
  tl.to('#sDback', {opacity: 1, duration: .3}, 34.5);
  lab('#sD1', 34.5); rise('#sD2', 35.2); rise('#sD3', 35.62); shake(35.9, 8, .2);
  tl.to(cards.map((c) => c[0]), {keyframes: {scale: [1, 1.1, 1]}, duration: .18, ease: 'sine.inOut'}, 36.12);

  /* ===== E. Agora olha as letras desse aqui. ===== */
  cut('#sD', '#sE', 36.52);
  flash(36.5, .4, .1); lab('#sE1', 36.58); lab('#sE3', 37.54);
  const le = split('#sE2'), TR = [{rotationX: -90}, {y: -420}, {scale: 0}, {rotation: 360, scale: .2}, {scaleY: 3.4}, {skewX: -60, x: 260}, {x: -500}, {rotationY: 90}, {y: 420, rotation: 40}];
  le.forEach((c, i) => { gsap.set(c, {opacity: 0, ...TR[i % 9]});
    tl.to(c, {opacity: 1, rotationX: 0, rotationY: 0, x: 0, y: 0, scale: 1, scaleY: 1, rotation: 0, skewX: 0, duration: .42, ease: 'back.out(2)'}, 37.12 + i * .04);
    tl.to(c, {keyframes: {y: [0, -34, 0], scaleY: [1, 1.2, .9, 1]}, duration: .3, ease: 'sine.inOut'}, 37.72 + i * .035); });
  shake(37.2, 9, .2); sway('#sEcam', 36.52, 1.8, 8, .95, 1.07);
  whipOut('#sEcam', 38.3, -1500, 0);

  /* ===== F. E espera a transicao... ===== */
  cut('#sE', '#sF', 38.42);
  whipIn('#sFcam', 38.42, 900, 0);
  gsap.set('#sFglow', {opacity: 0, scale: .6}); tl.to('#sFglow', {opacity: .9, scale: 1.1, duration: 1.3, ease: 'power1.in'}, 38.5);
  lab('#sF1', 38.48);
  const f2 = split('#sF2'), fd = split('#sFd'); gsap.set(f2.slice(0, 9), {scaleY: 2.8, opacity: 0}); tl.to(f2.slice(0, 9), {scaleY: 1, opacity: 1, duration: .32, stagger: {each: .018, from: 'center'}, ease: 'enterE'}, 39.1);
  gsap.set(fd, {scale: 0}); [39.3, 39.45, 39.6].forEach((at, i) => tl.to(fd[i], {scale: 1, duration: .2, ease: 'back.out(4)'}, at));
  gsap.set('#sFring', {strokeDasharray: 2000, strokeDashoffset: 2000}); tl.to('#sFring', {strokeDashoffset: 0, duration: 1.32, ease: 'power1.in'}, 38.5);
  tl.to('#sFcam', {scale: 1.06, duration: 1.2, ease: 'none'}, 38.5); tl.to('#sFcam', {scale: .88, duration: .1, ease: 'power2.out'}, 39.74);

  /* ===== G. Ta de brincadeira comigo?! ===== */
  const st = []; for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2, r = i % 2 ? 50 : 34; st.push(`${(50 + Math.cos(a) * r).toFixed(1)}% ${(50 + Math.sin(a) * r).toFixed(1)}%`); }
  q('#sGstar').style.clipPath = `polygon(${st.join(',')})`;
  gsap.set('#sG', {clipPath: 'circle(0px at 640px 360px)'}); tl.set('#sG', {visibility: 'visible'}, 39.84);
  tl.to('#sG', {clipPath: 'circle(1600px at 640px 360px)', duration: .14, ease: 'power3.in'}, 39.84); tl.set('#sF', {visibility: 'hidden'}, 40.0);
  gsap.set('#sGstar', {scale: 0, rotation: -70}); tl.to('#sGstar', {scale: 1, rotation: 0, duration: .5, ease: 'back.out(1.7)'}, 39.9); tl.to('#sGstar', {rotation: 24, duration: 1.3, ease: 'none'}, 40.4);
  flash(39.9, .7, .14); shake(39.94, 18, .3);
  slam('#sG1', 39.96, 2); const g2 = rise('#sG2', 40.26, .016); slam('#sG3', 41.0, 1.8); shake(41.02, 14, .26);
  tl.to(g2, {keyframes: {y: [0, -22, 0]}, duration: .2, stagger: .02, ease: 'sine.inOut'}, 40.7);
  gsap.set('#sGcam', {rotationY: 7}); tl.to('#sGcam', {rotationY: -6, scale: 1.05, duration: 1.6, ease: 'sine.inOut'}, 39.9);
  tl.to('#sGstar', {scale: 4.2, duration: .13, ease: 'expo.in'}, 41.58);

  /* ===== H. Pensa em fazer isso do jeito tradicional. ===== */
  cut('#sG', '#sH', 41.72);
  const hT = buildTL('#sHtl', 61);
  gsap.set(hT.bars, {scaleX: 0}); tl.to(hT.bars, {scaleX: 1, duration: .5, stagger: .05, ease: 'expo.out'}, 41.74);
  gsap.set(hT.dia, {scale: 0, rotation: 45}); tl.to(hT.dia, {scale: 1, duration: .2, stagger: .02, ease: 'back.out(3)'}, 42.0);
  gsap.set(hT.ph, {x: 240}); tl.to(hT.ph, {x: 1250, duration: 3, ease: 'none'}, 41.74);
  gsap.set('#sHtl', {x: 160, y: 40}); tl.to('#sHtl', {x: -160, y: -20, duration: 3.1, ease: 'sine.inOut'}, 41.72);
  lab('#sH1', 41.82, .022); rise('#sH2', 43.36); rise('#sH3', 43.92, .02);
  sway('#sHcam', 41.72, 3, 6, .97, 1.05);
  whipOut('#sHcam', 44.74, -1500, 0);

  /* ===== I. Programa pesado. Mil botoes. Horas pra cada segundo. ===== */
  cut('#sH', '#sI', 44.9);
  rise('#sIa', 45.1);
  slam('#sIb', 45.68, 1.9);
  gsap.set('#sIwin', {x: 340, y: -760, rotation: -9, transformOrigin: '50% 100%'});
  tl.to('#sIwin', {y: 30, rotation: 0, duration: .32, ease: 'power3.in'}, 45.38);
  tl.to('#sIwin', {keyframes: {scaleY: [1, .74, 1.1, 1], scaleX: [1, 1.16, .96, 1]}, duration: .34, ease: 'sine.inOut'}, 45.70);
  shake(45.70, 20, .32); flash(45.70, .2, .1);
  tl.to(['#sIa', '#sIb'], {keyframes: {y: [0, 16, -6, 0]}, duration: .26, ease: 'sine.inOut'}, 45.72);
  whipOut('#sI1', 46.27, -1500, 0); hide('#sI1', 46.42);
  show('#sI2', 46.3); whipIn('#sI2', 46.3, 900, 0);
  const RB = rng(77);
  for (let j = 0; j < 9; j++) for (let i = 0; i < 16; i++) { const k = Math.floor(RB() * 3), w = k === 0 ? 62 : k === 1 ? 34 : 86, h = k === 2 ? 12 : 30;
    const d = mk('ctl', `left:${18 + i * 78 + RB() * 12}px;top:${22 + j * 76 + RB() * 14}px;width:${w}px;height:${h}px;${k === 1 ? 'border-radius:50%;' : ''}${RB() < .14 ? 'background:#D97757;' : ''}`, '#sIbtns');
    gsap.set(d, {scale: 0}); tl.to(d, {scale: 1, duration: .16, ease: 'back.out(3)'}, 46.32 + RB() * .85); }
  slam('#sIc', 46.34, 1.9); shake(46.36, 9, .2); tl.to('#sI2', {scale: 1.06, duration: 1.1, ease: 'none'}, 46.4);
  whipOut('#sI2', 47.42, 0, -780); hide('#sI2', 47.56);
  show('#sI3', 47.48); whipIn('#sI3', 47.48, 0, 560);
  tl.to('#sIm', {rotation: 2880, duration: 1.8, ease: 'power1.in'}, 47.5); tl.to('#sIh', {rotation: 240, duration: 1.8, ease: 'power1.in'}, 47.5);
  slam('#sId', 47.56, 1.9); shake(47.58, 9, .2); rise('#sIe', 48.2, .018);
  tl.to('#sI3', {scale: 1.05, duration: 1.5, ease: 'none'}, 47.8);
  whipOut('#sI3', 49.26, -1500, 0);

  /* ===== J. E depois... esperar ficar pronto. ===== */
  cut('#sI', '#sJ', 49.36);
  const jT = buildTL('#sJtl', 62); gsap.set(jT.ph, {x: 300}); tl.to(jT.ph, {x: 312, duration: 2.6, ease: 'none'}, 49.4);
  whipIn('#sJcam', 49.36, 900, 0);
  lab('#sJ1', 49.44, .03); slam('#sJ2', 50.46, 1.7); rise('#sJ3', 51.24, .02);
  gsap.set('#sJfill', {scaleX: 0}); tl.to('#sJfill', {scaleX: .022, duration: 1.5, ease: 'power1.out'}, 50.3);
  const et = {v: 0}, etEl = q('#sJeta'); tl.to(et, {v: 2.6, duration: 2.6, ease: 'none'}, 49.5);
  syncers.push(() => { etEl.textContent = '2% · faltam 03:59:' + String(59 - Math.floor(et.v)).padStart(2, '0'); });
  tl.to('#sJcam', {scale: 1.04, duration: 2.6, ease: 'none'}, 49.5);

  /* ===== K. Aqui? Eu so precisei saber como pedir. ===== */
  cut('#sJ', '#sK', 52.15);
  gsap.set('#sKglow', {opacity: 0});
  slam('#sK1', 52.2, 2.4); shake(52.22, 18, .3); flash(52.16, .5, .12);
  tl.to('#sKcam', {scale: 1.06, duration: .7, ease: 'none'}, 52.2);
  tl.to('#sK1', {y: 30, duration: .07, ease: 'power2.out'}, 52.86); tl.to('#sK1', {y: -820, duration: .13, ease: 'expo.in'}, 52.93); blur('#sK1', 0, 60, .13, 'expo.in', 52.93);
  tl.to('#sKblk', {opacity: 1, duration: .1, ease: 'none'}, 52.96); tl.to('#sKglow', {opacity: .85, duration: .5}, 53.0);
  lab('#sK2', 53.06); slam('#sK3', 53.94, 1.9); shake(53.96, 9, .2); rise('#sK4', 54.24, .028);
  tl.to('#sKcam', {rotationY: -6, duration: 1.8, ease: 'sine.inOut'}, 53.1);
  whipOut('#sKcam', 55.12, -1500, 0);

  /* ===== L. E esse video, da primeira ideia ao ultimo segundo, ===== */
  cut('#sK', '#sL', 55.25);
  gsap.set('#sLglow', {opacity: 0}); tl.to('#sLglow', {opacity: .6, duration: .5}, 55.3);
  whipIn('#sLworld', 55.25, 900, 0);
  lab('#sL0', 55.33, .022);
  gsap.set('#sLbulb', {scale: 0}); tl.to('#sLbulb', {scale: 1, duration: .4, ease: 'back.out(3)'}, 56.08);
  rise('#sL1', 56.1, .02); rise('#sL2', 56.73, .03); shake(56.8, 7, .18);
  gsap.set('#sLline', {scaleX: 0}); tl.to('#sLline', {scaleX: 1, duration: 1.05, ease: 'power2.inOut'}, 56.9);
  for (let i = 1; i < 9; i++) { const d = mk('', `position:absolute;left:${330 + i * 229 - 11}px;top:540px;width:22px;height:22px;border-radius:50%;background:#fff`, '#sLdots'); gsap.set(d, {scale: 0}); tl.to(d, {scale: 1, duration: .2, ease: 'back.out(4)'}, 56.95 + i * .11); }
  tl.to('#sLworld', {x: 40, duration: .1, ease: 'power2.out'}, 56.96); tl.to('#sLworld', {x: -1380, duration: .92, ease: 'power3.inOut'}, 57.06);
  blur('#sLworld', 26, 0, .4, 'power2.in', 57.1); blur('#sLworld', 0, 0, .4, 'power2.out', 57.52);
  tl.to('#sL0', {x: -700, opacity: 0, duration: .3, ease: 'power2.in'}, 57.06);
  rise('#sL3', 57.5, .02); rise('#sL4', 57.93, .024);
  gsap.set('#sLend', {scale: 0}); tl.to('#sLend', {scale: 1, duration: .4, ease: 'back.out(3)'}, 57.98); shake(58.0, 7, .18);
  whipOut('#sLworld', 58.54, -2900, 0);

  /* ===== M. foi feito so com o Claude. So o Claude. ===== */
  cut('#sL', '#sM', 58.66);
  gsap.set('#sMglow', {opacity: 0}); flash(58.64, .35, .1);
  lab('#sM1', 58.72); rise('#sM2', 59.34); slam('#sM3', 59.98, 2.1); shake(60.0, 18, .3);
  gsap.set('#sMcam', {rotationY: 7, scale: .97}); tl.to('#sMcam', {rotationY: -5, scale: 1.05, duration: 2.1, ease: 'sine.inOut'}, 58.7);
  tl.to('#sMst', {rotation: -3, duration: .07, ease: 'power2.out'}, 60.8); tl.to('#sMst', {y: 900, rotation: 10, duration: .2, ease: 'power2.in'}, 60.87);
  tl.to('#sMblk', {opacity: 1, duration: .1, ease: 'none'}, 60.9); tl.to('#sMglow', {opacity: 1, duration: .5}, 60.95);
  rise('#sM4', 60.96, .03); slam('#sM5', 61.84, 2); shake(61.86, 14, .26); flash(61.84, .3, .12);
  gsap.set('#sMline', {scaleX: 0, y: 150}); tl.to('#sMline', {scaleX: 1, duration: .3}, 61.9);
  tl.to(['#sM4', '#sM5', '#sMline'], {scale: .08, opacity: 0, duration: .12, ease: 'expo.in'}, 62.44);

  /* ===== N. Puuuuuts. ===== */
  cut('#sM', '#sN', 62.58);
  const pz = split('#sN1'); pz.forEach((c) => c.style.verticalAlign = 'top'); pz[8].style.verticalAlign = 'bottom'; pz[8].style.marginBottom = '.135em';
  const pb = [pz[0], pz[1], pz[6], pz[7]], px = [pz[2], pz[3], pz[4], pz[5]];
  px.forEach((c) => { c._w = c.offsetWidth; c.style.overflow = 'hidden'; c.style.width = '0px'; });
  gsap.set(pb, {opacity: 0, scale: 2.2}); tl.to(pb, {opacity: 1, scale: 1, duration: .28, stagger: .02, ease: 'enterE'}, 62.58);
  px.forEach((c, i) => { gsap.set(c, {scaleX: 2.6, scaleY: .7}); tl.to(c, {width: c._w, scaleX: 1, scaleY: 1, duration: .28, ease: 'back.out(2.4)'}, 62.66 + i * .07); });
  tl.to('#sN1', {scaleX: 1.2, scaleY: .86, duration: .2, ease: 'power2.out'}, 62.66); tl.to('#sN1', {scaleX: 1, scaleY: 1, duration: .5, ease: 'elastic.out(1.1,.3)'}, 62.94);
  gsap.set('#sNpd', {scale: 0, y: -300}); tl.to('#sNpd', {scale: 1, y: 0, duration: .3, ease: 'bounce.out'}, 63.0);
  gsap.set('#sNglow', {opacity: .7}); gsap.set('#sNcam', {scale: 1.25}); tl.to('#sNcam', {scale: 1, duration: .5, ease: 'power3.out'}, 62.6);
  whipOut('#sNcam', 63.5, 0, -780);

  /* ===== O. passo a passo + perfil ===== */
  cut('#sN', '#sO', 63.7);
  gsap.set('#sOglow', {opacity: 0}); tl.to('#sOglow', {opacity: .7, duration: .5}, 63.8);
  whipIn('#sOa', 63.7, 0, 560);
  lab('#sO1', 63.78, .022); const ps = rise('#sO2', 65.02, .03); lab('#sO3', 65.68, .022);
  tl.to(ps, {keyframes: {y: [0, -26, 0]}, duration: .22, stagger: .02, ease: 'sine.inOut'}, 66.4);
  tl.to('#sOa', {scale: 1.05, rotationY: 5, duration: 3.2, ease: 'sine.inOut'}, 64.1);
  whipOut('#sOa', 67.3, -1500, 0); hide('#sOa', 67.45);
  tl.to('#sOglow', {left: '74%', duration: .4}, 67.36);
  gsap.set('#sOcard', {x: 290, y: 560, rotationX: 52, rotationY: -22, opacity: 0});
  tl.to('#sOcard', {y: 0, rotationX: 0, rotationY: -7, opacity: 1, duration: .55, ease: 'back.out(1.4)'}, 67.36);
  tl.to('#sOcard', {rotationY: 5, duration: 3.6, ease: 'sine.inOut'}, 67.95);
  slam('#sO4', 67.54, 1.9); rise('#sO5', 67.86, .02);
  const hx = (p) => ({x: p.x - 640 + 4, y: p.y - 360 + 56});
  gsap.set('#sOhand', {x: 620, y: 470, rotation: -14, opacity: 0}); gsap.set('#sOrip', {scale: 0, opacity: 0}); gsap.set('#sOf2', {y: 60, opacity: 0});
  tl.to('#sOhand', {...hx(pF), opacity: 1, rotation: -6, duration: .42, ease: 'power3.out'}, 67.78);
  const tap = (p, at) => { tl.to('#sOhand', {scale: .82, duration: .07, yoyo: true, repeat: 1, ease: 'power1.inOut'}, at - .05);
    tl.set('#sOrip', {x: p.x - 640, y: p.y - 360, scale: .2, opacity: .9}, at); tl.to('#sOrip', {scale: 2.6, opacity: 0, duration: .5, ease: 'power2.out'}, at); };
  tap(pF, 68.24);
  tl.to('#sOf1', {y: -60, opacity: 0, duration: .2, ease: 'power2.in'}, 68.26); tl.to('#sOf2', {y: 0, opacity: 1, duration: .3, ease: 'back.out(2.4)'}, 68.32);
  tl.to('#sOfw', {backgroundColor: '#2a2623', boxShadow: '0 0 0 2px rgba(255,255,255,.4) inset', duration: .2}, 68.28);
  tl.to('#sOfw', {keyframes: {scale: [1, 1.08, 1]}, duration: .24, ease: 'sine.inOut'}, 68.26);
  tl.to('#sOt1', {y: 14, duration: .06, ease: 'power2.out'}, 68.3); tl.to('#sOt1', {y: -620, duration: .14, ease: 'expo.in'}, 68.36);
  lab('#sO6', 68.5, .02); rise('#sO7', 68.98); rise('#sO8', 69.46, .018);
  tl.to('#sOhand', {x: '-=14', y: '-=10', duration: .1, ease: 'power2.out'}, 68.56);
  tl.to('#sOhand', {x: 640, y: 520, opacity: 0, duration: .4, ease: 'power3.in'}, 68.66);
  tl.to('#sOb', {scale: 1.04, duration: 3.6, ease: 'none'}, 68.0);
  tl.to('#sOglow', {keyframes: {opacity: [.7, 1, .8]}, duration: 1.2, ease: 'sine.inOut'}, 70.3);
}
