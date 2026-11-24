import {chromium} from '/opt/npm-tools/node_modules/playwright/index.mjs';
import path from 'path';import fs from 'fs';
const times=process.argv.slice(2).map(Number);
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1312,height:900}});
p.on('pageerror',(e)=>console.log('PAGEERR',e.message));p.on('console',(m)=>{if(m.type()==='error')console.log('CONSOLE',m.text())});
await p.goto('file://'+path.resolve('dist/index.html'));
await p.waitForFunction(()=>window.__ready,null,{timeout:20000});
await p.evaluate(()=>{document.querySelector('#tap').style.display='none'});
fs.mkdirSync('shots',{recursive:true});
const vp=await p.$('#viewport');
for(const t of times){await p.evaluate((t)=>window.__seek(t),t);await p.waitForTimeout(60);await vp.screenshot({path:`shots/t${t.toFixed(2)}.png`});}
await b.close();
