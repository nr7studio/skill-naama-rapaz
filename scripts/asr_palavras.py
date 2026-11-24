"""Transcreve uma locucao e devolve o tempo de cada palavra.
uso: python asr_palavras.py locucao.mp3 [saida.json]
Precisa de: pip install sherpa-onnx soundfile numpy ; ffmpeg ; e o modelo parakeet-tdt-0.6b-v3 int8
(baixar de https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8.tar.bz2
 e apontar a variavel ASR_DIR para a pasta extraida).
Corta o audio em trechos de fala (energia acima de -42 dB) e transcreve trecho a trecho,
porque os tempos ficam mais precisos do que transcrevendo o arquivo inteiro de uma vez."""
import sys, os, json, subprocess, tempfile
import numpy as np, soundfile as sf, sherpa_onnx
src = sys.argv[1]; out = sys.argv[2] if len(sys.argv) > 2 else 'palavras.json'
d = os.environ.get('ASR_DIR', 'sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8')
tmp = tempfile.mkdtemp()
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-ac', '1', '-ar', '48000', tmp + '/a48.wav'], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-ac', '1', '-ar', '16000', tmp + '/a16.wav'], check=True)
rec = sherpa_onnx.OfflineRecognizer.from_transducer(encoder=f'{d}/encoder.int8.onnx', decoder=f'{d}/decoder.int8.onnx',
    joiner=f'{d}/joiner.int8.onnx', tokens=f'{d}/tokens.txt', num_threads=2, model_type='nemo_transducer')
w48, sr48 = sf.read(tmp + '/a48.wav', dtype='float32'); wav, sr = sf.read(tmp + '/a16.wav', dtype='float32')
hop = 480; e = np.array([np.sqrt((w48[i:i + 960] ** 2).mean()) for i in range(0, len(w48) - 960, hop)]); db = 20 * np.log10(e + 1e-9)
segs = []; s = None; last = None
for i, v in enumerate(db > -42):
    t = i * hop / sr48
    if v:
        if s is None: s = t
        last = t
    elif s is not None and t - last > 0.45:
        segs.append([s, last + 0.02]); s = None
if s is not None: segs.append([s, last])
res = []
for a, b in segs:
    if b - a < 0.15: continue
    a0 = max(0, a - 0.1)
    seg = np.concatenate([np.zeros(4800, dtype='float32'), wav[int(a0 * sr):int((b + 0.15) * sr)], np.zeros(4800, dtype='float32')])
    st = rec.create_stream(); st.accept_waveform(sr, seg); rec.decode_stream(st); r = st.result
    words = []; cur = None
    for tk, t in zip(r.tokens, r.timestamps):
        tt = round(a0 - 0.3 + t, 2)
        if tk.startswith(' ') or cur is None:
            if cur: words.append(cur)
            cur = [tk.strip(), tt]
        else: cur[0] += tk
    if cur: words.append(cur)
    res.append({'inicio': round(a, 2), 'fim': round(b, 2), 'palavras': words})
    print(f'[{a:7.2f}-{b:7.2f}] ' + ' '.join(f'{w}@{t}' for w, t in words))
json.dump(res, open(out, 'w'), ensure_ascii=False, indent=1)
