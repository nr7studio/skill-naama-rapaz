# Voz, efeitos sonoros e mixagem

## 1. Transcrever com tempo por palavra
```bash
pip install sherpa-onnx soundfile numpy pyloudnorm scipy
# modelo (GitHub costuma estar liberado mesmo quando outros sites não estão)
curl -L -o pk.tar.bz2 https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8.tar.bz2
tar xf pk.tar.bz2
python scripts/asr_palavras.py locucao.mp3 palavras.json
```
O script separa os trechos de fala por energia (acima de -42 dB, pausa mínima de 0,45 s) e transcreve cada trecho. A transcrição erra palavras ("Claude" vira "Cláudio"), mas os tempos servem. Conferir o texto contra o roteiro.

## 2. Escolher as tomadas e cortar
- Tomada certa = a última de cada frase.
- Montar `cortes.json`: `{"dur": 71.6, "seg": [[entrada_bruto, saida_bruto, inicio_editado], ...]}`.
- Respiro entre frases: 0,25 a 0,45 s. A frase seguinte entra um pouco antes do que entraria naturalmente.
- Achar o ponto de corte olhando a energia em passos de 20 ms. Cortar onde está abaixo de -50 dB. Se o corte cair perto de uma palavra repetida, recuar 50 ms.
- `python scripts/editar_voz.py bruto48.wav cortes.json voz.wav` aplica fade de 30 ms na entrada e 60 ms na saída e normaliza em -16 LUFS.
- Tempo de cada palavra no editado = tempo no bruto - entrada_bruto + inicio_editado. Guardar essa tabela no código do vídeo.

## 3. Trocar uma frase depois (regravação)
- Cortar a fala antiga no silêncio antes da frase.
- Igualar o volume da gravação nova ao trecho vizinho pela média RMS dos quadros com voz.
- Encaixar mantendo o mesmo respiro e refazer só os tempos daquela cena.
- Avisar que timbre e ambiente podem mudar entre gravações e que isso só ele ouve.

## 4. Biblioteca de efeitos (Earshot, roda sem internet)
```bash
pip install git+https://github.com/Leonxlnx/earshot
bash scripts/gerar_sfx.sh   # gera 88 arquivos .wav na pasta atual
```
Famílias usadas: `whoosh_*`, `swish_fast`, `dash_air`, `swing_blade`, `sword_swing`, `whip_swish` (movimento); `slam_title`, `boom_deep`, `boom_heavy`, `land_heavy`, `land_soft`, `door_slam`, `thump_appear` (impacto); `pop_soft`, `pop_mouth`, `like_pop`, `bubble_pop` (entradas leves); `tick_wood`, `tick_metal`, `type_light`, `type_mech`, `click_mouse`, `rocker` (interface); `suck_in`, `rise_reverse`, `cymbal_rev` (antes do impacto); `glass_break`, `bulb_burst`, `success_done`, `stopwatch` (pontuais).

Fontes de efeitos, sempre as 3, nesta ordem: Openverse (https://openverse.org, só licença `cc0`, via Claude in Chrome no navegador dele), Real SFX (https://github.com/Clipwing/skills/tree/main/skills/real-sfx, por `git clone`) e Earshot (https://github.com/Leonxlnx/earshot, roda local). O Earshot cobre o que o Openverse não tiver. Nunca sintetizar som no código. Se uma fonte não abrir, dizer qual e seguir com as outras.

## 5. Lista de efeitos
Cada item: `(tempo, arquivo, ganho em dB, alinhamento)`.
- `'s'`: o som começa no tempo. Impactos, cliques, pops.
- `'p'`: o pico do som cai no tempo. Whooshes.
- `'e'`: o som termina no tempo. Sucção e subida reversa antes do impacto.

Receita por tipo de movimento:
- Palavra de impacto: `slam_title` (-1 a -4 dB), às vezes com `boom_deep` (-6 a -8).
- Linha que sobe: `thump_appear` (-5 a -8).
- Whip pan: `whoosh_fast` no pico (-4 a -6).
- Letras em sequência: `pop_mouth` e `like_pop` alternados, 0,07 a 0,1 s entre eles (-6 a -8).
- Digitação: `type_light` a cada 0,13 s (-15).
- Objeto que cai: `whoosh_heavy` no pico e `land_heavy` no impacto (-1 a -3).
- Clique da mão: `click_mouse` (-1 a -3), com `success_done` logo depois (-9).
- Antes de um corte forte: `suck_in` ou `cymbal_rev` terminando no corte (-7 a -9).

Densidade de referência: 306 efeitos em 71,6 s. Não empilhar mais de três no mesmo instante.

## 6. Mixagem (`template/audio/mix.py`)
- Efeitos normalizados por pico e somados com o ganho da lista.
- Trilha de efeitos 6 LU abaixo da voz (variável `LU`).
- Ducking de 4 dB sob a fala, com ataque de 15 ms e soltura de 250 ms (variável `DUCK`).
- Soma normalizada em -14 LUFS com limitador (teto 0,89).
- Saídas: `audio/mix.wav` (voz + efeitos), `audio/voz.wav`, e os separados `out/stem_voz.wav` e `out/stem_sfx.wav`. Os dois separados somados em 0 dB dão a mixagem exata.
- Variáveis de ambiente: `SFX_LIB` (pasta dos efeitos, com barra no fim) e `VOZ` (voz editada).

## 7. O que dizer na entrega
- Tomadas usadas e cortes delicados (com o segundo).
- Momentos para ouvir com fone: emendas, impacto mais forte, cliques.
- Que o áudio foi medido, não ouvido.
