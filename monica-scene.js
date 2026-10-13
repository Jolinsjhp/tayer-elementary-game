const $=id=>document.getElementById(id),canvas=$('portrait'),ctx=canvas.getContext('2d');
ctx.imageSmoothingEnabled=false;
const sheet=new Image();sheet.src='monica-frames-v6-cool-rest.png';
let ready=false,running=false,paused=false,elapsed=0,last=performance.now(),frame=3;
const speech=text=>{$('speech').querySelector('p').textContent=text;};
function draw(index){if(!ready)return;const w=sheet.naturalWidth/2,h=sheet.naturalHeight/2;ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(sheet,(index%2)*w,Math.floor(index/2)*h,w,h,0,0,canvas.width,canvas.height);canvas.dataset.pose=['stir-out','stir-in','pour','rest'][index];}
sheet.onload=()=>{ready=true;draw(frame);};sheet.onerror=()=>{speech('The portrait could not load. Please reload.');$('make').disabled=true;};
function start(){if(!ready)return;running=true;paused=false;elapsed=0;frame=0;draw(frame);$('make').disabled=true;$('replay').disabled=true;$('pause').disabled=false;$('pause').textContent='Pause';$('glass').disabled=true;speech('Of course.');}
$('make').onclick=start;$('replay').onclick=start;$('glass').onclick=start;
$('pause').onclick=()=>{if(!running)return;paused=!paused;$('pause').textContent=paused?'Continue':'Pause';};
$('zoom').onclick=()=>{const on=$('zoom').getAttribute('aria-pressed')!=='true';$('zoom').setAttribute('aria-pressed',String(on));$('zoom').textContent=on?'Whole station':'Look closer';document.querySelector('.scene').classList.toggle('close',on);};
function tick(now){const dt=Math.min(.1,(now-last)/1000);last=now;if(running&&!paused){elapsed+=dt;const next=elapsed<4?Math.floor(elapsed/.6)%2:elapsed<6?2:3;if(next!==frame){frame=next;draw(frame);}if(elapsed<4){$('stageLabel').textContent='STIR · TAYĒR TINS';}else if(elapsed<6){$('stageLabel').textContent='STRAIN & POUR';speech('A little patience.');}else{$('stageLabel').textContent='BACK ON THE BAR';speech('Here you are. Enjoy your evening.');}if(elapsed>=7){running=false;$('make').disabled=false;$('replay').disabled=false;$('pause').disabled=true;$('glass').disabled=false;}}requestAnimationFrame(tick);}requestAnimationFrame(tick);

for(const link of document.querySelectorAll('header a')){link.textContent=link.textContent.includes('Back')?'Back to Tayēr ↗':link.textContent;link.onclick=event=>{if(window.parent!==window){event.preventDefault();window.parent.postMessage('monica:return',location.origin);}else if(document.referrer.startsWith(location.origin)){event.preventDefault();history.back();}};}
