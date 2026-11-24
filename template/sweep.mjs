import {chromium} from '/opt/npm-tools/node_modules/playwright/index.mjs';
import path from 'path';
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const p=await b.newPage({viewport:{width:1312,height:900}});let errs=0;
p.on('pageerror',(e)=>{errs++;console.log('PAGEERR',e.message)});p.on('console',(m)=>{if(m.type()==='error'){errs++;console.log('CONSOLE',m.text())}});
await p.goto('file://'+path.resolve('dist/index.html'));await p.waitForFunction(()=>window.__ready);
for(let f=0;f<2148;f+=2){await p.evaluate((t)=>window.__seek(t),f/30)}
// toca de verdade por 3 s e mede o relogio
await p.click('#tap');await p.waitForTimeout(3000);
const r=await p.evaluate(()=>({t:document.querySelector('#tc').textContent,a:document.querySelector('#aMix').currentTime,d:document.querySelector('#aMix').duration,paused:document.querySelector('#aMix').paused}));
console.log('erros',errs,JSON.stringify(r));await b.close();
