# Técnico: projeto, verificação e render

## Pasta `template/`
```
build.mjs            junta tudo em dist/index.html (fontes, GSAP, áudio e código embutidos)
package.json         gsap, @fontsource/anton, @fontsource-variable/archivo, @fontsource/jetbrains-mono
src/template.html    CSS, marcação das cenas e do player
src/main.js          helpers, cenas da primeira parte, player
src/part2.js         BEATS2 (botões por fala) e build2() com as cenas seguintes
src/avatar.jpg       foto do perfil para o cartão do CTA
audio/mix.py         lista de efeitos e mixagem
shot.mjs, sheet.py   captura de quadros e folha de contato
sweep.mjs            varredura de erros e teste de reprodução
render2.mjs          render do vídeo inteiro (dividido por resto de divisão)
render3.mjs          render de um intervalo de quadros
```
Preparar: `npm i` na pasta, colocar `audio/mix.mp3` e `audio/voz.mp3`, `node build.mjs`.

Caminhos fixos nos scripts que podem mudar de ambiente: o `import` do Playwright (`/opt/npm-tools/node_modules/playwright/index.mjs`) e o Chrome (`/usr/bin/google-chrome`).

`part2.js` é concatenado antes de `main.js`. Por isso ele só pode ter `const BEATS2` e `function build2()` no nível de cima, sem usar `tl` ou helpers fora da função.

## Helpers de `main.js`
| Função | O que faz |
|---|---|
| `q`, `qa` | seletor único e lista |
| `rng(seed)` | aleatório com semente |
| `cut(de, para, t)` | troca a cena visível |
| `split(el)` | quebra o texto em letras `.ch` |
| `mb`, `blurSet`, `blur` | blur direcional por filtro SVG |
| `shake(t, a, d)` | tremor de câmera |
| `flash(t, o, d)` | clarão |
| `pop(el, t, x, y, rot)` | entrada com escala e `back.out` |
| `steps(el, prop, vals, t)` | valores em degraus (glitch) |
| `burst`, `fire` | raios em SVG que estouram |
| `bokeh(box, n, seed)` | pontos de luz de fundo |
| `ringFx(el, t, to, d)` | anel que expande |
| `ctr(el)` | centro do elemento em coordenadas do palco (para a mão clicar no lugar certo) |
| `syncers` | funções chamadas a cada quadro (granulado, contadores) |

Em `build2()` há ainda `lab`, `rise`, `slam`, `whipOut`, `whipIn`, `sway`, `show`, `hide`, `mk` e `buildTL` (timeline genérica).

## Classes de CSS
`.t` (Anton caixa alta), `.lab` (Archivo largo), `.mono`, cores `.w .k .o`, contorno `.out .outk`, `.glass` (cartão de vidro), `.L` (camada centralizada), `.p3` (perspectiva), `.glow`, `.paper`, `.chip`, `.ico`, `.vc` (cartão de vídeo), `.tlw .tlr .tlb .tld .tlp .tlt` (timeline), `.win` (janela), `.ctl` (botão genérico), `.pf` (cartão de perfil).

Elementos com `transform` inline (translateX/Y) viram posição inicial para o GSAP.

## Verificação
```bash
node shot.mjs 17.3 17.6 17.9 ...        # shots/tX.XX.png
python3 sheet.py NOME 17.3 17.6 17.9    # shots/NOME.jpg, 6 colunas
node sweep.mjs                           # erros de JS em todos os quadros + 3 s tocando de verdade
```
Ajustar o total de quadros em `sweep.mjs` para a duração do vídeo. Olhar pelo menos um quadro cheio de cada cena com texto largo: miniatura esconde corte de 20 px.

## Render
Tempo por quadro medido em 2 núcleos, 1920 x 1080:
| Método | ms por quadro |
|---|---|
| `element.screenshot()` do Playwright | 1300 |
| CDP `Page.captureScreenshot` com `optimizeForSpeed` | 1100 |
| CDP + `display: none` nas cenas ocultas | 500 a 850 |
| Idem, 2 processos em paralelo | cerca de 450 efetivos |

Opções de GPU do Chrome não mudaram nada. Remover o granulado também não.

```bash
# vídeo inteiro: dois processos, cada um com dois restos da divisão por 4
node render2.mjs 0,1 4 60 frames &  node render2.mjs 2,3 4 60 frames &  wait
# só um trecho (quadros 3822 a 4295), pares e ímpares
node render3.mjs 3822 4296 0 frames_cta &  node render3.mjs 3822 4296 1 frames_cta &  wait
ffmpeg -framerate 60 -start_number 3822 -i frames_cta/f_%05d.png -an -c:v libx264 -preset medium -crf 16 -pix_fmt yuv420p trecho.mp4
```
- Rodar o render longo em segundo plano e acompanhar a contagem de arquivos. Os scripts pulam quadro que já existe, então dá para retomar.
- Não usar `-stats` no ffmpeg: enche a saída.
- O granulado deixa o arquivo pesado (cerca de 15 Mbps, 138 MB para 71 s). Oferecer versão mais leve se ele precisar subir em anúncio.
- Depois: `ffprobe` (resolução, fps, duração), medir o áudio com `ebur128`, extrair de 25 a 30 quadros e comparar com o preview.

## Trecho alterado depois do render
- Começar o trecho em um corte seco entre cenas e informar o tempo e o quadro (`tempo x 60`).
- Comparar quadro a quadro com o render anterior antes do ponto alterado. Diferença zero perto da alteração confirma a emenda.
- Diferenças mínimas de suavização em texto centralizado podem aparecer se o conteúdo da cena mudou de tamanho. Por isso o trecho entregue cobre a cena inteira.

## Publicação do preview
Publicar `dist/index.html` como artifact. Para atualizar, republicar no mesmo artifact com a versão anterior como base. O card já mostra o link, então a resposta só resume o que mudou.

## After Effects
Sem After Effects no ambiente, não há como gravar `.aep` nem testar script. O que dá para entregar é um `.jsx` que cria a composição principal, uma composição por cena com o vídeo renderizado, a narração, cada efeito em sua camada e marcadores por fala. Dizer antes o que não fica editável: texto, keyframes, câmera, blur, vidro e granulado.
