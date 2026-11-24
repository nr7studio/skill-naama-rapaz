import fs from 'fs';
const b64=(p)=>fs.readFileSync(p).toString('base64');
const fonts=`
@font-face{font-family:'Anton';font-weight:400;src:url(data:font/woff2;base64,${b64('node_modules/@fontsource/anton/files/anton-latin-400-normal.woff2')}) format('woff2');}
@font-face{font-family:'Archivo';font-weight:100 900;font-stretch:62% 125%;src:url(data:font/woff2;base64,${b64('node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2')}) format('woff2-variations');}
@font-face{font-family:'JetBrains Mono';font-weight:500;src:url(data:font/woff2;base64,${b64('node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2')}) format('woff2');}
@font-face{font-family:'JetBrains Mono';font-weight:700;src:url(data:font/woff2;base64,${b64('node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff2')}) format('woff2');}`;
const esc=(s)=>s.replace(/<\/script/gi,'<\\/script');
const gs=fs.readFileSync('node_modules/gsap/dist/gsap.min.js','utf8')+'\n'+fs.readFileSync('node_modules/gsap/dist/CustomEase.min.js','utf8');
const mix=fs.existsSync('audio/mix.mp3')?'data:audio/mpeg;base64,'+b64('audio/mix.mp3'):'';
const voz=fs.existsSync('audio/voz.mp3')?'data:audio/mpeg;base64,'+b64('audio/voz.mp3'):'';
let h=fs.readFileSync('src/template.html','utf8');
h=h.replace('/*AVATAR*/',()=>'data:image/jpeg;base64,'+b64('src/avatar.jpg')).replace('/*FONTS*/',()=>fonts).replace('/*AUDIO_MIX*/',()=>mix||voz).replace('/*AUDIO_VOZ*/',()=>voz).replace('/*GSAP*/',()=>esc(gs)).replace('/*MAIN*/',()=>esc(fs.readFileSync('src/part2.js','utf8')+'\n'+fs.readFileSync('src/main.js','utf8')));
fs.mkdirSync('dist',{recursive:true});fs.writeFileSync('dist/index.html',h);console.log('ok',(h.length/1024).toFixed(0)+' KB');
