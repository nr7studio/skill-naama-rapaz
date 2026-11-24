// uso: node render3.mjs <inicio> <fim> <resto 0|1> <out>
import {chromium} from '/opt/npm-tools/node_modules/playwright/index.mjs';
import path from 'path';import fs from 'fs';
const [a,b,par,out]=process.argv.slice(2);const fps=60;
const br=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--force-color-profile=srgb']});
const p=await br.newPage({viewport:{width:1312,height:900},deviceScaleFactor:1.5});
p.on('pageerror',(e)=>console.log('PAGEERR',e.message));
await p.goto('file://'+path.resolve('dist/index.html'));
await p.waitForFunction(()=>window.__ready,null,{timeout:30000});
await p.evaluate(()=>{document.querySelector('#tap').style.display='none';const v=document.querySelector('#viewport');v.style.borderRadius='0';v.style.boxShadow='none';
  const sc=[...document.querySelectorAll('section.scene')];
  window.__rs=(t)=>{sc.forEach(s=>s.style.display='');window.__seek(t);sc.forEach(s=>{if(getComputedStyle(s).visibility==='hidden')s.style.display='none'});};});
fs.mkdirSync(out,{recursive:true});
const bb=await (await p.$('#viewport')).boundingBox();if(bb.width!==1280||bb.height!==720)throw new Error('viewport');
const cdp=await p.context().newCDPSession(p);const clip={x:bb.x,y:bb.y,width:1280,height:720,scale:1.5};
for(let f=+a;f<+b;f++){if(f%2!==+par)continue;const file=`${out}/f_${String(f).padStart(5,'0')}.png`;if(fs.existsSync(file))continue;
  await p.evaluate((t)=>window.__rs(t),f/fps);const s=await cdp.send('Page.captureScreenshot',{format:'png',optimizeForSpeed:true,clip});
  fs.writeFileSync(file+'.tmp',Buffer.from(s.data,'base64'));fs.renameSync(file+'.tmp',file);}
console.log('fim',par);await br.close();
