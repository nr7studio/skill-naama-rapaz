"""Monta a locucao editada a partir da gravacao bruta.
uso: python editar_voz.py bruto48.wav cortes.json voz_editada.wav
cortes.json = {"dur": 71.6, "seg": [[entrada_no_bruto, saida_no_bruto, inicio_no_editado], ...]}
Regras do Naama: a tomada certa e sempre a ultima; silencios saem; a frase seguinte entra um pouco adiantada.
Cada trecho recebe fade de entrada de 30 ms e de saida de 60 ms. O arquivo sai normalizado em -16 LUFS com pico ate 0,94.
Sempre cortar em silencio (ver a energia em passos de 20 ms em volta do ponto) para nao levar o comeco de uma palavra repetida."""
import sys, json, numpy as np, soundfile as sf, pyloudnorm as pyln
raw, cuts, dst = sys.argv[1:4]
wav, sr = sf.read(raw, dtype='float32')
if wav.ndim > 1: wav = wav.mean(1)
c = json.load(open(cuts)); out = np.zeros(int(c['dur'] * sr), dtype='float32'); fi = int(.03 * sr); fo = int(.06 * sr)
for a, b, t in c['seg']:
    x = wav[int(a * sr):int(b * sr)].copy(); x[:fi] *= np.linspace(0, 1, fi) ** 2; x[-fo:] *= np.linspace(1, 0, fo) ** 2
    i = int(t * sr); out[i:i + len(x)] += x[:max(0, len(out) - i)]
l = pyln.Meter(sr).integrated_loudness(out); out *= 10 ** ((-16 - l) / 20); pk = np.abs(out).max(); out *= min(1, .94 / pk)
sf.write(dst, out, sr); print('ok', dst, 'duracao', c['dur'])
