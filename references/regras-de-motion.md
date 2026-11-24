# Regras de motion do estilo "Rapaz"

## Ritmo de referência
O vídeo de referência analisado tinha 46 cortes em 72 s, com plano mediano de 1 s. O vídeo aprovado segue isso: 28 cenas em 71,6 s, algumas com 2 ou 3 momentos internos.

## Curvas (CustomEase)
```js
CustomEase.create('exitE',  'M0,0 C0.5,0 0.72,0.04 0.84,0.16 0.93,0.26 0.98,0.55 1,1'); // segura e explode
CustomEase.create('enterE', 'M0,0 C0.02,0.38 0.12,0.78 0.3,0.92 0.5,1 0.7,1 1,1');      // chega rápido, cauda longa
CustomEase.create('popE',   'M0,0 C0.16,0.62 0.28,1.08 0.46,1.08 0.62,1.08 0.78,0.995 1,1'); // passa do ponto e volta
```
Padrão da timeline: `expo.out`. Deriva de câmera: `sine.inOut`. Linear só em deriva contínua (zoom lento) e em rotação constante.

## Entradas de texto
- **rise:** letras partem de `y: 170, scaleY: 1.6, opacity: 0` e chegam em 0,34 s com `back.out(2)`, atraso de 0,02 s por letra. Começar 0,04 s antes da palavra falada.
- **slam:** palavra parte de `scale: 2.2` com blur 26 e chega em 0,32 s com `enterE`. Tremor de câmera (`shake`) 0,02 s depois. Usar na palavra de impacto da frase.
- **lab:** rótulo em Archivo, letras sobem 34 px em 0,2 s com `back.out(2.4)`, atraso de 0,014 a 0,03 s.
- **digitação:** texto mono aparece letra a letra no tempo da fala (`tl.set` de opacidade por letra). Termos-chave viram chip laranja ao terminar.
- **truque por letra:** para "olha as letras", cada letra entra de um jeito (gira em X, cai, cresce do zero, gira 360, estica, inclina, vem de lado).

## Saídas e transições
- **whip pan:** antecipação de 2% no sentido contrário em 0,07 s, depois 1500 px (ou 780 px na vertical) em 0,13 s com `expo.in` e blur 70. A cena seguinte entra do lado oposto, de 900 px, em 0,36 s com `enterE` e blur 50 caindo a zero.
- **mergulho:** escala de 1 para 7 em 0,12 s com `expo.in`, origem no objeto, clarão curto, e a cena seguinte chega de escala 1,7.
- **abertura em círculo:** `clip-path: circle()` de 0 a 1600 px em 0,14 s.
- **queda do bloco:** gira -3 graus (antecipação) e cai 900 px em 0,2 s enquanto o fundo troca de cor.
- **sucção:** bloco encolhe para 0,08 em 0,12 s antes do corte.
- Não repetir a mesma transição em cortes seguidos.

## Câmera
- `sway(el, t, dur, ang, s0, s1)`: giro em Y de -ang a +0,8 ang com escala de s0 a s1 durante a cena inteira.
- `shake(t, amplitude, dur)`: tremor em `#cam` com amplitude decrescente. 7 a 10 para impacto normal, 14 a 20 para o impacto forte da cena.
- Painel longo: mundo mais largo que a tela e a câmera viaja de um ponto a outro com antecipação, `power3.inOut` e blur no meio.

## Objetos que ilustram a fala
- Cartão de vidro com linhas de texto se escrevendo e botão de enviar (pedir algo para a IA).
- Caixa de pedido com digitação e quatro ícones genéricos surgindo (letras, forma que muda, cubo 3D em CSS, câmera).
- Grade de dezenas de cartões de vídeo iguais revelada por recuo de câmera ("igual ao de todo mundo").
- Timeline genérica em perspectiva com camadas, losangos de keyframe e agulha andando (processo tradicional).
- Janela genérica que cai, amassa no impacto e treme a tela (programa pesado).
- Tela enchendo de mais de 100 botões genéricos (mil botões).
- Relógio com ponteiros disparando (horas).
- Barra de progresso parada em 2% com contagem regressiva (esperar).
- Linha do tempo com ponto da ideia e marcador final (da primeira ideia ao último segundo).
- Cartão de perfil do Instagram com mão tocando em Seguir (CTA).

## Erros já resolvidos (não repetir)
- Camada centralizada com `left` fixo colapsa a largura. Dar `right: auto; width: 1280px`.
- Ponto final fica alto quando as letras estão alinhadas pelo topo. No ponto: `vertical-align: bottom; margin-bottom: .135em`.
- Palavra esticada corta na borda quando a câmera está com escala alta. Reduzir a escala da câmera, não a palavra.
- Antecipação por escala encosta texto largo na borda. Trocar por um pequeno deslocamento em Y.
- Texto com acento encostando no rótulo de cima. Aumentar a margem.
- Linha larga: reduzir a fonte até sobrar 40 px de cada lado. Conferir em quadro cheio, não em miniatura.
- Cena com pouca coisa: aumentar os objetos e empilhar o título em duas linhas.
- Vídeo e áudio se afastam 50 ms com o tempo: usar a correção proporcional do relógio.
- Tween com valor relativo (`'-=14'`) funciona, mas conferir o quadro em busca fora de ordem.

## O que ele aprovou e pediu
- "Extremamente dinâmico", "câmera passeando pela tela", não só entradas e saídas de texto.
- Efeitos sonoros audíveis. "A ideia é gerar dopamina."
- Simulações para ilustrar: timeline, aplicativos, perfil do Instagram com mão clicando.
- No CTA com comentário, preferiu só o texto, sem simular campo de comentário.
