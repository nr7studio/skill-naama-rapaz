// uso: node render2.mjs <residuos separados por virgula> [mod=4] [fps=60] [out=frames]
import {chromium} from '/opt/npm-tools/node_modules/playwright/index.mjs';
import path from 'path';import fs from 'fs';
const res=process.argv[2].split(',').map(Number),mod=+(process.argv[3]||4),fps=+(process.argv[4]||60),out=process.argv[5]||'frames';
const br=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--force-color-profile=srgb']});
const p=await br.newPage({viewport:{width:1312,height:900},deviceScaleFactor:1.5});
p.on('pageerror',(e)=>console.log('PAGEERR',e.message));
await p.goto('file://'+path.resolve('dist/index.html'));
await p.waitForFunction(()=>window.__ready,null,{timeout:30000});
const N=await p.evaluate(()=>{document.querySelector('#tap').style.display='none';const v=document.querySelector('#viewport');v.style.borderRadius='0';v.style.boxShadow='none';
  const sc=[...document.querySelectorAll('section.scene')];
  window.__rs=(t)=>{sc.forEach(s=>s.style.display='');window.__seek(t);sc.forEach(s=>{if(getComputedStyle(s).visibility==='hidden')s.style.display='none'});};return window.__dur;});
const total=Math.round(N*fps);fs.mkdirSync(out,{recursive:true});
const bb=await (await p.$('#viewport')).boundingBox();if(bb.width!==1280||bb.height!==720)throw new Error('viewport '+JSON.stringify(bb));
const cdp=await p.context().newCDPSession(p);const clip={x:bb.x,y:bb.y,width:1280,height:720,scale:1.5};
for(const r of res)for(let f=r;f<total;f+=mod){const file=`${out}/f_${String(f).padStart(5,'0')}.png`;if(fs.existsSync(file))continue;
  await p.evaluate((t)=>window.__rs(t),f/fps);
  const s=await cdp.send('Page.captureScreenshot',{format:'png',optimizeForSpeed:true,clip});
  fs.writeFileSync(file+'.tmp',Buffer.from(s.data,'base64'));fs.renameSync(file+'.tmp',file);}
console.log('fim',res.join(','));await br.close();
