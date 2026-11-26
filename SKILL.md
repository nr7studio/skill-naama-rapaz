---
name: skill-naama-rapaz
description: Cria anúncio em tipografia cinética guiado pela locução, no estilo do vídeo "Rapaz, nem ferrando" do Naamã, só com HTML + GSAP (edição da voz, efeitos sonoros, preview tocável, render MP4 60 fps e áudios separados). Use sempre que ele pedir vídeo estilo Rapaz, kinetic typography, motion de texto com locução, anúncio de curso em motion, ou "igual ao vídeo do Motion com Claude", mesmo sem citar o nome da skill.
---

# Motion estilo "Rapaz" (método Naamã / NR7 Studio)

Anúncio 16:9 em tipografia cinética, guiado pela locução do Naamã. Cada palavra entra na tela no instante em que é falada, a tela muda a cada 1 a 3 segundos, a câmera nunca para e os efeitos sonoros marcam cada movimento. A ideia é gerar dopamina em quem assiste e escuta.

O vídeo é uma página HTML com GSAP. O preview é a própria página, com player. O MP4 sai dessa mesma página, quadro a quadro. Nada de After Effects, Remotion ou gerador de vídeo.

O vídeo que deu origem ao método (1 min 11 s, anúncio do curso Motion com Claude) está em `template/`, se a pasta veio junto com a skill. Partir dele é muito mais rápido do que começar do zero. Se a pasta não existir, este arquivo basta para reconstruir a estrutura.

Leia antes de construir, quando existirem:
- `references/regras-de-motion.md`: linguagem visual aprovada, curvas, transições e o que deu errado.
- `references/audio-e-sfx.md`: edição da voz, tempos por palavra, efeitos e mixagem.
- `references/tecnico-e-render.md`: arquitetura, helpers, verificação e render rápido.

## Regras de conduta do Naamã

- Ele manda o material em várias mensagens. Se disser "não gere nada ainda", responda só "ok" até liberar.
- Lacuna criativa vira pergunta antes de construir, nunca uma escolha assumida. Uma pergunta curta, com opções.
- O roteiro escrito manda. O texto da tela é o do roteiro, mesmo quando a fala gravada tem palavras a mais.
- Nunca esticar duração nem incluir cena que ele não pediu.
- Preview antes de qualquer MP4. Render só quando ele pedir ("renderiza").
- Respostas curtas, em português do Brasil, com títulos e bullets, sem elogio e sem travessão.
- Nunca usar a construção "não é X, é Y".
- Sempre conferir os quadros antes de entregar e dizer o que foi conferido.
- O áudio não pode ser ouvido por quem monta. Dizer isso e listar os pontos para ele conferir com fone.

## Fluxo

### 1. Material
Pedir o que faltar: roteiro escrito, locução (MP3 bruto serve), identidade visual (cores em hex, logo, fonte), foto e dados do perfil se houver CTA de Instagram, referências.

### 2. Voz
A locução vem bruta. Regras dele:
- A tomada certa é sempre a última. Se repetiu a frase, vale a última.
- Remover silêncios para o áudio ficar dinâmico.
- A frase seguinte entra um pouco adiantada (respiro curto, de 0,25 a 0,45 s entre frases).

Passos: transcrever com tempo por palavra (`scripts/asr_palavras.py`), montar a tabela de cortes (entrada no bruto, saída no bruto, início no editado), cortar sempre em silêncio, gerar a voz editada (`scripts/editar_voz.py`) e anotar o tempo de cada palavra no áudio editado. Essa tabela de tempos é a espinha do vídeo.

### 3. Roteiro de cenas
Uma cena por frase ou meia frase. Para cada cena, definir: tempo de entrada e saída, as linhas de texto, qual palavra leva o impacto, qual objeto ilustra a fala, como a câmera se move e como a cena passa para a próxima. A primeira troca acontece perto de 1 s.

### 4. Construir
Página única, palco de 1280 x 720, uma `section.scene` por cena, uma timeline GSAP pausada onde tudo é função do tempo. O código de cada cena fica em um bloco só, com os tempos da locução no topo. Ver "Arquitetura" abaixo.

### 5. Verificar
- Folha de contato com um quadro a cada 0,3 s do trecho novo (`shot.mjs` + `sheet.py`).
- Varredura do vídeo inteiro atrás de erro de JavaScript (`sweep.mjs`).
- Procurar: texto cortado ou encostado na borda (margem mínima de 40 px), linha larga demais, quadro vazio no meio de transição, elemento visível antes de entrar ou depois de sair.

### 6. Preview
Publicar a página como artifact. O player tem play, pausa, barra de tempo, velocidades (1, 0,5, 0,25 e 0,1), passo de quadro, botões por fala e chave de som (voz + efeitos ou só voz). Pedir ajustes por segundo.

### 7. Efeitos sonoros e mixagem
Depois de a imagem estar de pé. Um efeito para cada movimento visível, alinhado no quadro do movimento. Efeitos sempre abaixo da voz, mas audíveis. Ver `references/audio-e-sfx.md`.

### 8. Render (só quando ele pedir)
1920 x 1080, 60 fps, H.264 CRF 16 + AAC 320k. Depois do render, extrair quadros do MP4 e conferir contra o preview. Ver "Render" abaixo.

### 9. Alteração pontual depois do render
Não refazer o vídeo inteiro. Entregar:
- só a cena alterada, sem áudio, começando em um corte seco, com o tempo e o número do quadro de encaixe;
- o áudio dos efeitos do vídeo inteiro;
- o áudio da fala do vídeo inteiro.

Os dois áudios começam em 0:00 e, somados em 0 dB, dão exatamente a mixagem do preview. Conferir que os quadros antes da alteração são idênticos aos do render anterior.

## Linguagem visual aprovada

- **Identidade padrão (curso Motion com Claude):** preto `#0B0A0A`, laranja `#D97757` (claro `#F2A07E`, escuro `#B4573A`), papel `#F4EFE9`, branco. Para outra marca, perguntar as cores.
- **Fontes:** Anton em caixa alta para títulos, Archivo largo (wdth 125) para rótulos, JetBrains Mono para interface.
- **Fundos:** alternar preto com brilho laranja, laranja chapado e papel claro. A troca de fundo já é um corte.
- **Texto:** frase em 2 ou 3 linhas com hierarquia. Rótulo pequeno em Archivo, palavra de impacto enorme em Anton, palavra-chave em laranja.
- **Densidade:** nunca só texto. Cada cena tem um objeto que ilustra a fala (cartão de vidro, janela, grade de vídeos, relógio, timeline, cartão de perfil), brilho de fundo, granulado e formas.
- **Câmera:** toda cena deriva devagar (giro em Y de 5 a 8 graus e escala de 0,97 a 1,06). Nada fica parado esperando a próxima cena.
- **Entradas:** três tipos, alternados. `rise` (letras sobem com atraso de 0,02 s cada), `slam` (palavra de impacto chega de escala 2 com blur e tremor de câmera) e `lab` (rótulo letra a letra).
- **Saídas:** antecipação curta no sentido contrário (0,07 s) e disparo de 0,13 s com blur direcional.
- **Transições:** uma diferente por corte. Whip pan com a cena seguinte entrando no mesmo sentido, mergulho de câmera para dentro de um objeto, abertura em círculo, estouro de forma, queda do bloco inteiro, troca de cor de fundo.
- **Abertura e fecho:** a primeira palavra estica como borracha ("RAPAAAAZ") e a última interjeição repete o gesto.
- **CTA:** cartão do perfil do Instagram em vidro (foto, usuário com selo, números, bio) e uma mão que toca em Seguir. O botão vira "Seguindo". Se o CTA pedir comentário, a frase entra só em tipografia.

## Arquitetura

- **Palco:** `#viewport > #stage (1280 x 720) > #cam > section.scene`. O `#stage` escala para caber na tela.
- **Timeline:** `const tl = gsap.timeline({paused: true})`. Um relógio próprio anda com `requestAnimationFrame` e corrige suave contra o `<audio>` (`t += erro * 0.2`, ressincroniza se passar de 0,25 s).
- **Cortes:** `cut(de, para, t)` liga e desliga `visibility` das cenas.
- **Texto:** `split(el)` quebra em letras (`span.ch`).
- **Blur de movimento:** filtro SVG `feGaussianBlur` com `stdDeviation "x y"` por elemento, animado na timeline (`blur(el, x, y, dur, ease, t)`).
- **Curvas:** `exitE` (segura e explode), `enterE` (chega rápido e freia com cauda longa), `popE` (passa do ponto e volta). Nunca linear em movimento de entrada ou saída.
- **Determinismo:** aleatório só com semente (`rng(seed)`). Qualquer quadro tem de sair igual em qualquer ordem de busca.
- **Ganchos:** `window.__seek(t)`, `window.__ready` e `window.__dur` para captura.
- **Build:** um script junta fontes, GSAP, áudio em base64 e o código em um único `dist/index.html`.

## Render

Captura quadro a quadro com Chrome sem interface. O que deixa rápido o bastante:
- `Page.captureScreenshot` via CDP, com `clip` no palco e `scale: 1.5` (1280 x 720 vira 1920 x 1080), PNG com `optimizeForSpeed`.
- Antes de cada quadro, aplicar `display: none` nas cenas com `visibility: hidden`. Resultado idêntico e quase metade do tempo.
- Dois processos em paralelo, dividindo os quadros, com retomada (pula quadro que já existe).
- Referência: 4.296 quadros (71,6 s) em cerca de 35 minutos com 2 núcleos. Avisar o tempo estimado antes de começar.

```bash
ffmpeg -framerate 60 -i frames/f_%05d.png -i audio/mix.wav -c:v libx264 -preset medium -crf 16 \
  -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 320k -shortest saida.mp4
```

## Limites que valem avisar cedo

- **Logos de terceiros:** não entram no vídeo, nem a partir de arquivo enviado. Nome da marca em tipografia e ícone genérico. Se ele quiser a logo, encaixa no editor dele. Oferecer os tempos de cada marca.
- **Interface de programa:** timeline e janelas são genéricas, em shapes nas cores da marca.
- **After Effects:** não dá para gerar `.aep`. O possível é um script `.jsx` que monta composições com as cenas renderizadas, áudio em camadas e marcadores. Texto e keyframes não ficam editáveis.
- **Fontes de efeitos (sempre as 3, nesta ordem):** Openverse (https://openverse.org, só licença `cc0`) só abre pelo navegador dele, via Claude in Chrome. Real SFX (https://github.com/Clipwing/skills/tree/main/skills/real-sfx) entra por `git clone`. Earshot (https://github.com/Leonxlnx/earshot) roda local e cobre o que o Openverse não tiver. Nunca sintetizar som no código. Se uma fonte não abrir, dizer qual e seguir com as outras.

## Checklist antes de entregar

- [ ] Texto da tela igual ao roteiro escrito.
- [ ] Cada linha entra na palavra falada (tolerância de 0,04 s).
- [ ] Nenhum texto cortado ou a menos de 40 px da borda.
- [ ] Nenhum quadro vazio fora das transições.
- [ ] Antecipação em toda saída, nada linear.
- [ ] Varredura sem erro de JavaScript.
- [ ] Efeitos abaixo da voz, mixagem em -14 LUFS.
- [ ] Resposta final curta: o que entrou, o que ficou de fora, pontos para ouvir com fone.
