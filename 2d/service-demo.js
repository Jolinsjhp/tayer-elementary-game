/* Pixel motion study based on user-provided service references; original media stays private. */
window.showPourDemo=function(name='Laura'){
 const frances=name==='Frances';let panel=document.getElementById('pourDemo');if(!panel){panel=document.createElement('aside');panel.id='pourDemo';panel.innerHTML='<button aria-label="Close pouring close-up">×</button><canvas width="320" height="220" role="img"></canvas><p></p>';document.querySelector('.stage').append(panel);panel.querySelector('button').onclick=()=>{panel.hidden=true;};}
 panel.hidden=false;panel.setAttribute('aria-label',name+' pouring close-up');panel.querySelector('p').textContent=name.toUpperCase()+' · '+(frances?'Your Martini. Enjoy.':'One Sip Martini. Blue cheese olive.');const canvas=panel.querySelector('canvas');canvas.setAttribute('aria-label','Pixel animation of '+name+' pouring');const g=canvas.getContext('2d'),portrait=makeStaffPortrait(name),start=performance.now(),token=panel.dataset.play=String(performance.now());g.imageSmoothingEnabled=false;
 const r=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h)};
 const ease=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
 function frame(now){if(panel.hidden||panel.dataset.play!==token)return;const t=(now-start)/1000,tilt=t<1?0:t<2?ease(t-1):t<4?1:t<5?1-ease(t-4):0,fill=ease((t-2)/2),angle=tilt*1.3;
 g.clearRect(0,0,320,220);r(0,0,320,220,'#243e38');for(let y=12;y<180;y+=20)r(0,y,320,1,'#456058');g.drawImage(portrait,99,0,122,142);r(0,155,320,65,'#304a45');r(0,155,320,4,'#b2bdb3');
 // One hand supports a level tray; the pouring hand turns at the wrist.
 const present=t>5?ease(t-5)*7:0,base=169-present;r(159,base,88,4,'#af9670');
 if(frances){r(183,base-39,30,2,'#d4e2da');r(186,base-37,24,9,'#bed2ca');r(191,base-28,14,4,'#bed2ca');r(197,base-24,2,23,'#bed2ca');r(187,base-2,24,2,'#d4e2da');if(fill)r(188,base-30-Math.round(fill*5),20,Math.round(fill*5),'#d9dec1');}
 else{r(182,base-20,27,20,'#c5d5cb');r(184,base-4,23,4,'#e0e4d4');if(fill)r(185,base-6-Math.round(fill*9),21,Math.round(fill*9),'#d6d6ac');r(192,base-17,9,7,'#8c9652');r(194,base-16,5,4,'#e8e0be');r(197,base-14,2,2,'#708c86');}
 const px=151,py=114;g.strokeStyle='#d4ae89';g.lineWidth=7;g.beginPath();g.moveTo(127,109);g.lineTo(125,134);g.lineTo(px,py);g.stroke();g.beginPath();g.moveTo(211,114);g.lineTo(233,139);g.lineTo(224,base);g.stroke();r(217,base-2,14,5,'#d4ae89');
 g.save();g.translate(px,py);g.rotate(angle);if(frances){r(-8,-26,16,32,'#91ada6');r(-4,-43,8,17,'#b6cbc4');r(-5,-44,10,3,'#e6eadc');r(-6,-17,12,11,'#e1d6b0');}else{r(-9,-32,18,36,'#497161');r(-9,-32,18,3,'#d3c185');r(-9,1,18,3,'#d3c185');r(-6,-22,12,14,'#acbf94');}g.restore();
 if(t>=2&&t<4){const neck=frances?43:30,lipX=px+Math.sin(angle)*neck,lipY=py-Math.cos(angle)*neck;g.strokeStyle=frances?'#e1e6c9':'#e5cb87';g.lineWidth=2;g.beginPath();g.moveTo(lipX,lipY);g.lineTo(198,frances?base-32:base-11);g.stroke();}
 if(t<7)requestAnimationFrame(frame);else panel.hidden=true;
 }
 requestAnimationFrame(frame);
};
