import sys
from PIL import Image, ImageDraw
name=sys.argv[1]; ts=[float(x) for x in sys.argv[2:]]
cols=6; rows=(len(ts)+cols-1)//cols; W,H=400,225
S=Image.new('RGB',(W*cols,H*rows))
for i,t in enumerate(ts):
    im=Image.open(f'shots/t{t:.2f}.png').convert('RGB').resize((W,H))
    d=ImageDraw.Draw(im); d.rectangle([0,0,44,13],fill=(0,0,0)); d.text((2,1),f'{t:.2f}',fill=(255,255,0))
    S.paste(im,((i%cols)*W,(i//cols)*H))
S.save(f'shots/{name}.jpg',quality=85)
