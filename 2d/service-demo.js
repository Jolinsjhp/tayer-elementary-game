/* A local pixel animation study; no private source video is published. */
window.showPourDemo=function(){
 let panel=document.getElementById('pourDemo');if(!panel){panel=document.createElement('aside');panel.id='pourDemo';panel.setAttribute('aria-label','Laura pouring close-up');panel.innerHTML='<button aria-label="Close pouring close-up">×</button><canvas width="320" height="220" aria-label="Pixel animation of Laura pouring" role="img"></canvas><p><b>LAURA</b> One Sip Martini. Blue cheese olive.</p>';document.querySelector('.stage').append(panel);panel.querySelector('button').onclick=()=>{panel.hidden=true;};}
 panel.hidden=false;const canvas=panel.querySelector('canvas'),g=canvas.getContext('2d'),portrait=makeStaffPortrait('Laura'),start=performance.now();g.imageSmoothingEnabled=false;const r=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h)};
 function frame(now){if(panel.hidden)return;const t=(now-start)/1000,tilt=t<1?0:t<2?(t-1):t<4?1:t<5?5-t:0,fill=Math.max(0,Math.min(1,(t-2)/2));g.clearRect(0,0,320,220);r(0,0,320,220,'#243e38');for(let y=12;y<180;y+=20)r(0,y,320,1,'#456058');g.drawImage(portrait,99,0,122,142);r(0,155,320,65,'#304a45');r(0,155,320,4,'#b2bdb3');
 // Stable tray and glass: hand reaches the vessel, never through the counter.
 const trayY=169;r(104,trayY,128,5,'#b89869');r(182,149,27,20,'#c5d5cb');r(184,165,23,4,'#e0e4d4');if(fill)r(185,163-Math.round(fill*9),21,Math.round(fill*9),'#d6d6ac');r(192,152,9,7,'#8c9652');r(194,153,5,4,'#e8e0be');r(197,155,2,2,'#708c86');
 g.strokeStyle='#d4ae89';g.lineWidth=8;g.beginPath();g.moveTo(130,120);g.lineTo(118,140);g.lineTo(142,116);g.stroke();g.beginPath();g.moveTo(211,123);g.lineTo(229,146);g.lineTo(221,168);g.stroke();
 g.save();g.translate(146,112);g.rotate(tilt*.95);r(-9,-32,18,36,'#497161');r(-9,-32,18,3,'#d3c185');r(-9,1,18,3,'#d3c185');r(-6,-22,12,14,'#acbf94');g.restore();if(t>=2&&t<4){g.strokeStyle='#e5cb87';g.lineWidth=2;g.beginPath();g.moveTo(168,114);g.lineTo(195,154);g.stroke();}if(t>5){r(211,165,15,5,'#d4ae89');}if(t<7)requestAnimationFrame(frame);else panel.hidden=true;}
 requestAnimationFrame(frame);
};
