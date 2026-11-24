import soundfile as sf, numpy as np, subprocess, os, pyloudnorm as pyln
from scipy import signal
from scipy.ndimage import minimum_filter1d
SR=48000; DUR=71.6; LIB=os.environ.get('SFX_LIB','/home/claude/sfx/')
C=[# (tempo, arquivo, ganho dB, alinhamento)
(0.03,'pop_soft_1',-8,'s'),(0.40,'rise_reverse_1',-6,'e'),(0.40,'slam_title_1',-2,'s'),(0.40,'boom_deep_1',-7,'s'),
(0.52,'whoosh_sweep_1',-12,'s'),(1.34,'whoosh_airy_1',-11,'p'),(1.35,'pop_mouth_1',-7,'s'),(1.46,'like_pop_1',-8,'s'),(1.57,'like_pop_2',-8,'s'),
(1.74,'thump_appear_1',-5,'s'),(1.86,'thump_appear_2',-11,'s'),(2.24,'suck_in_2',-7,'e'),(2.24,'slam_title_2',-1,'s'),(2.24,'boom_heavy_1',-8,'s'),
(2.80,'whoosh_fast_1',-4,'p'),(2.86,'tick_wood_1',-15,'s'),(2.92,'tick_wood_2',-15,'s'),(2.98,'tick_wood_3',-15,'s'),
(3.46,'swing_blade_1',-5,'p'),(3.51,'land_heavy_1',-3,'s'),(3.78,'whoosh_airy_2',-12,'p'),(3.79,'thump_appear_2',-7,'s'),
(3.86,'pop_mouth_2',-6,'s'),(3.99,'pop_mouth_3',-6,'s'),(4.10,'like_pop_3',-7,'s'),(4.33,'whoosh_deep_1',-9,'p'),(4.34,'land_soft_1',-5,'s'),
(5.53,'rise_reverse_2',-13,'e'),(5.53,'tick_metal_1',-13,'s'),(5.60,'whoosh_fast_2',-5,'p'),(5.86,'land_soft_2',-8,'s'),(5.85,'thump_appear_3',-9,'s'),
(6.05,'pop_soft_2',-11,'s'),(6.19,'click_mouse',-3,'s'),(6.33,'suck_in_1',-7,'e'),(6.33,'slam_title_1',-6,'s'),
(6.44,'tick_wood_1',-17,'s'),(6.56,'tick_wood_2',-16,'s'),(6.66,'tick_wood_3',-15,'s'),(6.75,'tick_wood_1',-14,'s'),(6.83,'tick_wood_2',-13,'s'),(6.90,'tick_wood_3',-12,'s'),
(6.96,'tick_wood_1',-12,'s'),(7.02,'tick_wood_2',-11,'s'),(7.07,'tick_wood_3',-11,'s'),(7.12,'tick_wood_1',-10,'s'),(7.18,'rise_reverse_1',-11,'e'),
(7.18,'success_done',-11,'s'),(7.36,'suck_in_2',-8,'e'),(7.63,'cymbal_rev_1',-12,'e'),(7.63,'boom_heavy_2',-3,'s'),(7.63,'slam_title_2',-3,'s'),(7.78,'swish_fast_2',-11,'p'),
(8.32,'whoosh_airy_3',-7,'p'),(8.55,'pop_soft_3',-11,'s'),(8.68,'tick_wood_2',-13,'s'),(9.05,'tick_wood_3',-13,'s'),(9.27,'land_heavy_2',-6,'s'),
(9.63,'type_mech_1',-12,'s'),(9.70,'type_mech_2',-12,'s'),(9.77,'type_mech_3',-12,'s'),(9.84,'type_mech_4',-12,'s'),(9.92,'pop_soft_1',-11,'s'),(10.03,'bubble_pop_1',-11,'s'),(10.12,'pop_soft_2',-12,'s'),
(10.27,'door_slam',-3,'s'),(10.27,'rocker_1',-7,'s'),(10.33,'rocker_2',-7,'s'),(10.60,'whoosh_heavy_1',-8,'p'),(10.67,'swish_fast_3',-7,'s'),(10.99,'thump_appear_1',-5,'s'),
(11.33,'whoosh_fast_3',-6,'p'),(11.41,'type_light_1',-13,'s'),(11.47,'type_light_2',-13,'s'),(11.53,'type_light_3',-13,'s'),(11.59,'type_light_4',-13,'s'),(11.65,'type_light_1',-13,'s'),(11.71,'type_light_2',-13,'s'),
(11.50,'whoosh_airy_1',-13,'p'),(11.97,'click_mouse',-2,'s'),(12.03,'glass_break_1',-1,'s'),(12.03,'boom_deep_2',-6,'s'),(12.05,'bulb_burst',-9,'s'),
(12.37,'thump_appear_2',-8,'s'),(12.80,'swing_blade_2',-7,'p'),(12.82,'tick_metal_1',-11,'s'),(13.08,'sword_swing',-8,'p'),(13.10,'tick_metal_2',-11,'s'),(13.15,'thump_appear_3',-8,'s'),
(13.36,'swing_blade_1',-7,'p'),(13.38,'tick_metal_1',-11,'s'),(13.47,'land_soft_1',-6,'s'),(13.70,'whip_swish',-8,'p'),(13.72,'tick_metal_2',-11,'s'),(13.92,'slam_title_1',-3,'s'),
(14.08,'swing_blade_2',-7,'p'),(14.10,'tick_metal_1',-11,'s'),(14.62,'whoosh_fast_1',-4,'p'),(14.70,'pop_soft_1',-8,'s'),(14.74,'swish_fast_1',-9,'s'),
(15.05,'boom_deep_1',-5,'s'),(15.36,'rocker_1',-8,'s'),(15.40,'rocker_2',-8,'s'),(15.44,'rocker_1',-8,'s'),(15.46,'slam_title_2',-3,'s'),
(15.52,'tick_wood_1',-14,'s'),(15.58,'tick_wood_2',-14,'s'),(15.64,'tick_wood_3',-14,'s'),(16.05,'swing_blade_1',-3,'p'),(16.07,'door_slam',-2,'s'),(16.07,'land_heavy_1',-6,'s'),
(16.34,'type_mech_1',-13,'s'),(16.42,'type_mech_2',-13,'s'),(16.50,'type_mech_3',-13,'s'),(16.74,'thump_appear_1',-7,'s'),(17.02,'sword_draw',-9,'e'),
(17.02,'swing_blade_2',-1,'p'),(17.06,'clash_sword',-4,'s'),(17.36,'whoosh_heavy_2',-8,'p'),
]

C+=[(17.5,'thump_appear_1',-7,'s'),(17.7,'whoosh_airy_1',-12,'p'),(18.46,'thump_appear_2',-7,'s'),(19.06,'type_light_1',-12,'s'),(19.28,'type_light_2',-12,'s'),(19.5,'type_light_3',-12,'s'),(19.95,'click_mouse',-3,'s'),
(20.24,'suck_in_1',-7,'e'),(20.24,'slam_title_1',-3,'s'),(21.16,'thump_appear_3',-8,'s'),(21.56,'pop_mouth_1',-7,'s'),(21.66,'like_pop_1',-8,'s'),(21.76,'pop_mouth_2',-8,'s'),(22.38,'whoosh_fast_2',-5,'p'),
(22.72,'slam_title_2',-3,'s'),(23.0,'tick_wood_1',-12,'s'),(23.12,'tick_wood_2',-12,'s'),(24.68,'whoosh_fast_3',-5,'p'),
(27.3,'pop_soft_1',-7,'s'),(28.66,'like_pop_2',-7,'s'),(30.06,'pop_soft_2',-7,'s'),(31.58,'like_pop_3',-7,'s'),(32.62,'click_mouse',-3,'s'),
(32.84,'slam_title_1',-2,'s'),(32.84,'boom_deep_1',-8,'s'),(33.98,'thump_appear_1',-6,'s'),(34.5,'whoosh_heavy_1',-6,'p'),(35.2,'thump_appear_2',-6,'s'),(35.62,'slam_title_2',-4,'s'),(36.12,'tick_metal_1',-11,'s'),
(36.52,'door_slam',-4,'s'),(37.14,'pop_mouth_3',-7,'s'),(37.22,'like_pop_1',-8,'s'),(37.3,'pop_soft_3',-8,'s'),(37.38,'like_pop_2',-8,'s'),(37.46,'pop_mouth_1',-8,'s'),(38.4,'whoosh_fast_1',-5,'p'),
(39.84,'cymbal_rev_2',-9,'e'),(39.3,'tick_metal_1',-10,'s'),(39.45,'tick_metal_2',-10,'s'),(39.6,'tick_metal_1',-9,'s'),(39.9,'boom_heavy_1',-2,'s'),(39.9,'slam_title_1',-2,'s'),(39.9,'glass_break_2',-9,'s'),
(40.28,'thump_appear_3',-6,'s'),(41.0,'door_slam',-3,'s'),(41.66,'whoosh_fast_2',-5,'p'),(41.76,'swish_fast_1',-10,'s'),(43.36,'thump_appear_1',-6,'s'),(43.94,'land_soft_1',-6,'s'),(44.8,'whoosh_fast_3',-5,'p'),
(45.1,'thump_appear_2',-7,'s'),(45.6,'whoosh_heavy_2',-7,'p'),(45.70,'land_heavy_1',-1,'s'),(45.70,'boom_deep_2',-3,'s'),(46.32,'whoosh_fast_1',-6,'p'),(46.36,'slam_title_2',-4,'s'),
(47.48,'whoosh_fast_2',-6,'p'),(47.56,'slam_title_1',-3,'s'),(47.7,'stopwatch',-8,'s'),(47.95,'stopwatch',-8,'s'),(48.2,'stopwatch',-8,'s'),(48.45,'stopwatch',-8,'s'),(48.7,'stopwatch',-8,'s'),(48.95,'stopwatch',-8,'s'),
(49.32,'whoosh_fast_3',-6,'p'),(50.46,'boom_deep_1',-5,'s'),(50.9,'tick_wood_1',-11,'s'),(51.24,'thump_appear_3',-7,'s'),(51.6,'tick_wood_2',-11,'s'),
(52.18,'slam_title_2',-1,'s'),(52.18,'boom_heavy_2',-4,'s'),(53.0,'whoosh_airy_2',-9,'p'),(53.94,'thump_appear_1',-5,'s'),(54.26,'land_soft_2',-6,'s'),(55.18,'whoosh_fast_1',-5,'p'),
(56.08,'pop_mouth_2',-6,'s'),(56.74,'thump_appear_2',-6,'s'),(57.5,'whoosh_deep_2',-6,'p'),(57.98,'success_done',-10,'s'),(57.98,'thump_appear_3',-6,'s'),(58.6,'whoosh_fast_2',-5,'p'),
(58.68,'slam_title_1',-4,'s'),(59.34,'thump_appear_1',-6,'s'),(59.98,'door_slam',-2,'s'),(59.98,'boom_heavy_1',-3,'s'),(60.92,'whoosh_heavy_1',-7,'p'),(61.84,'boom_deep_2',-2,'s'),(61.84,'slam_title_2',-2,'s'),(62.5,'suck_in_2',-8,'e'),
(62.58,'pop_mouth_3',-6,'s'),(62.66,'like_pop_1',-8,'s'),(62.73,'like_pop_2',-8,'s'),(62.80,'like_pop_3',-8,'s'),(62.87,'pop_soft_1',-8,'s'),(63.08,'thump_appear_2',-6,'s'),(63.56,'whoosh_fast_3',-5,'p'),
(65.04,'tick_metal_1',-9,'s'),(65.22,'tick_metal_2',-9,'s'),(65.38,'tick_metal_1',-8,'s'),(67.4,'whoosh_fast_1',-5,'p'),(67.54,'slam_title_1',-4,'s'),(67.86,'land_soft_1',-7,'s'),
(68.24,'click_mouse',-1,'s'),(68.3,'success_done',-9,'s'),(68.4,'whoosh_airy_3',-10,'p'),(68.98,'thump_appear_3',-6,'s'),(69.46,'thump_appear_1',-7,'s')]
import itertools
tk=itertools.cycle(['type_light_1','type_light_2','type_light_3','type_light_4','type_mech_1'])
for a,b in [(23.44,24.36),(24.78,25.9),(25.96,26.8),(27.3,28.4),(28.66,29.6),(30.06,31.1),(31.34,32.44)]:
    t=a
    while t<b: C.append((round(t,2),next(tk),-15,'s')); t+=0.13
for i in range(12): C.append((round(46.36+i*0.065,2),next(tk),-13,'s'))
for i in range(8): C.append((round(34.5+i*0.07,2),'tick_wood_%d'%(i%3+1),-14,'s'))
S=np.zeros((int(DUR*SR),2)); miss=set()
for t,name,g,al in C:
    p=LIB+name+'.wav'
    if not os.path.exists(p): miss.add(name); continue
    x,sr=sf.read(p,dtype='float32')
    if x.ndim==1: x=np.stack([x,x],1)
    if sr!=SR: x=signal.resample_poly(x,SR,sr,axis=0)
    pk=np.abs(x).max()
    if pk>0: x=x/pk
    env=np.abs(x).max(1)
    off=0 if al=='s' else (len(x) if al=='e' else int(np.argmax(signal.convolve(env,np.ones(480)/480,mode='same'))))
    i=int(t*SR)-off
    if i<0: x=x[-i:]; i=0
    x=x[:max(0,len(S)-i)]
    n=min(len(x),int(0.004*SR)); 
    if n>0: x[:n]*=np.linspace(0,1,n)[:,None]
    S[i:i+len(x)]+=x*10**(g/20)
print('faltando:',sorted(miss))
V,_=sf.read(os.environ.get('VOZ','/home/claude/vo/voz_full.wav')); V=np.stack([V,V],1)[:len(S)]
A=np.zeros_like(S); A[:len(V)]=V
m=pyln.Meter(SR); lv=m.integrated_loudness(A); ls=m.integrated_loudness(S)
LU=float(os.environ.get('LU','6')); DUCK=float(os.environ.get('DUCK','4'))
B=S*10**((lv-LU-ls)/20)
e=np.sqrt(signal.lfilter([1],[1,-0.999],np.mean(A**2,1))*0.001); on=np.clip(e/np.percentile(e[e>0],60),0,1)
at,rl=np.exp(-1/(0.015*SR)),np.exp(-1/(0.25*SR)); g=np.empty(len(on)); c=0.0
for i in range(len(on)):
    c=at*c+(1-at)*on[i] if on[i]>c else rl*c+(1-rl)*on[i]; g[i]=c
B*= (10**(-DUCK*g/20))[:,None]
X=A+B; k=10**((-14-m.integrated_loudness(X))/20); X*=k
lvl=np.max(np.abs(X),1); gg=minimum_filter1d(np.minimum(1,0.89/(lvl+1e-9)),int(0.005*SR)*2+1)
gs=np.empty_like(gg); c=1.0; r=np.exp(-1/(0.08*SR))
for i in range(len(gg)):
    c=gg[i] if gg[i]<c else r*c+(1-r)*gg[i]; gs[i]=c
X*=gs[:,None]
sf.write('audio/mix.wav',X,SR)
os.makedirs('out',exist_ok=True)
sf.write('out/stem_voz.wav',(A*k*gs[:,None])[:,0],SR,subtype='PCM_24'); sf.write('out/stem_sfx.wav',B*k*gs[:,None],SR,subtype='PCM_24')
print('soma dos stems difere da mix em', float(np.abs(A*k*gs[:,None]+B*k*gs[:,None]-X).max()))
Vn=A*10**((-14-lv)/20); pk=np.abs(Vn).max(); Vn*=min(1,0.89/pk); sf.write('audio/voz.wav',Vn,SR)
print('voz',round(lv,1),'sfx',round(ls,1),'final',round(m.integrated_loudness(X),1),'pico',round(float(np.abs(X).max()),3),'cues',len(C))
