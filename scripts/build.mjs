import {mkdir,readFile,writeFile} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
const html=await readFile('index.html','utf8');
if(!html.includes('const BACKEND_ENABLED=false;'))throw Error('Backend marker missing');
await writeFile('dist/index.html',html.replace('const BACKEND_ENABLED=false;','const BACKEND_ENABLED=true;'));
await writeFile('dist/_routes.json',JSON.stringify({version:1,include:['/api/*'],exclude:[]}));
await writeFile('dist/_headers','/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: DENY\n');
await writeFile('dist/404.html','<!doctype html><html lang="en"><meta charset="utf-8"><title>Not found | GrowthKavach</title><h1>Page not found</h1><a href="/">Return to GrowthKavach</a></html>');
console.log('GrowthKavach Cloudflare build prepared.');
