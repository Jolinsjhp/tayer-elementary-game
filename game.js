import * as T from './three.module.js';
import {createBackgroundMusic} from './audio.js?v=20261016-26';
const backgroundMusic=createBackgroundMusic();
import {box,cylinder,label,bottle,productBottle,glass,stool,person,pose,tool,dog,material,avatarPalettes} from './models.js?v=20261016-26';
import {dressRooms} from './interior.js?v=20261016-26';
import {createStreet} from './street.js?v=20261016-26';
import {layouts,pathfind} from './navigation.js?v=20261016-26';
const $=id=>document.getElementById(id),stage=$('stage'),scene=new T.Scene();scene.background=new T.Color('#283b33');
let renderer;try{renderer=new T.WebGLRenderer({canvas:$('world'),antialias:false,alpha:false});}catch{$('notice').textContent='This browser needs WebGL to run the 3D study.';$('notice').style.opacity=1;throw Error('WebGL unavailable');}
renderer.setPixelRatio(1);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
const camera=new T.OrthographicCamera(-8,8,5,-5,.1,100);camera.position.set(9,11,15);camera.lookAt(0,1,0);
const ambient=new T.HemisphereLight('#d1e5ee','#263b32',1.2);scene.add(ambient);const sun=new T.DirectionalLight('#bfd9ee',2);sun.position.set(-5,12,7);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-12,right:32,top:14,bottom:-14});sun.shadow.bias=-.0004;scene.add(sun);
const street=createStreet(scene);
const roots={},people={},guests=[],interactive=[],queue=[],animations=[];const S={room:'front',view:'room',started:false,name:'',regular:false,avatar:0,time:0,cup:null,water:{front:null,back:null},waterCups:{},ordered:0,paid:0,gift:false,fifthDue:false,walking:false,toilet:false,sound:true,roomSound:{front:true,back:true},frontOrdered:0,seatChoice:'bar'};let player,speaking=null,noticeTimer,controller,musicReady=false,spin=0,last=performance.now(),hostAsked=false;
function notice(text){$('notice').textContent=text;$('notice').style.opacity=1;clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>$('notice').style.opacity=0,3500);}
function worldPos(room,x,y,z){return new T.Vector3(x+(room==='back'?18:0),y,z);}
function counter(root,x,z,w,d,color='#ad9978'){box(root,x,.53,z,w,1.06,d,'#516450');box(root,x,1.095,z,w+.06,.09,d+.07,color,.15);box(root,x,.12,z+.01,w+.14,.1,d+.13,'#263a32');for(let k=-w/2+.15;k<w/2;k+=.35)box(root,x+k,.5,z+d/2+.006,.018,.8,.025,'#394b3e');}
function floorRoom(room){const r=new T.Group();scene.add(r);r.position.x=room==='back'?18:0;roots[room]=r;box(r,0,-.08,0,room==='back'?14:12,.16,10,room==='back'?'#617761':'#888d80');for(let x=-5.5;x<6;x+=.6)box(r,x,.004,0,.012,.008,9.8,room==='back'?'#4c6153':'#70776b');if(room==='back'){box(r,-4.125,1.65,-5,3.75,3.3,.18,'#55745b');box(r,2.225,1.65,-5,7.55,3.3,.18,'#55745b');box(r,-1.9,2.55,-5,.7,1.5,.18,'#55745b');box(r,-1.9,-.06,-5.6,.74,.12,1.2,'#556b5a');box(r,-2.28,.9,-5.6,.06,1.8,1.2,'#6f8070');box(r,-1.52,.9,-5.6,.06,1.8,1.2,'#6f8070');box(r,-1.9,.9,-6.18,.74,1.8,.06,'#6f8070');cylinder(r,-1.9,.27,-5.85,.19,.45,'#d5ddd0',10);}else{box(r,-5.775,1.65,-5,.45,3.3,.18,'#a6aa98');box(r,.675,1.65,-5,10.65,3.3,.18,'#a6aa98');box(r,-5.1,2.9,-5,.9,.8,.18,'#a6aa98');}if(room==='back')box(r,-5.95,.5,-.75,.12,1,8.5,'#6f8071');
for(const x of[-4,0,4]){cylinder(r,x,2.85,-1.9,.025,.65,'#344137',6,.3);const shade=new T.Mesh(new T.ConeGeometry(.33,.22,10,1,true),material('#39463a'));shade.position.set(x,2.55,-1.9);r.add(shade);const glow=new T.PointLight('#ffd79b',8,7,2);glow.position.set(x,2.35,-1.9);r.add(glow);}
return r;}
const front=floorRoom('front');counter(front,0,-1.3,7.2,1,'#c7cbbc');box(front,0,1.8,-4.84,7,.95,.07,'#4a7153');label(front,'ELEMENTARY',0,2.7,-4.85,3.5,.42,'#304b3b');label(front,'ON TAP',0,2.05,-4.76,1.1,.2);
for(let i=0;i<8;i++){const x=-2.8+i*.8;cylinder(front,x,1.7,-4.65,.027,.35,'#b7c8bf',8,.7);box(front,x,1.8,-4.56,.045,.065,.18,'#c2d0c7',.7);bottle(front,x,1.15,-3.8,i%2?'#9d8154':'#495a48');}
counter(front,-.9,2.15,5.6,1,'#b49367');counter(front,-5.35,1.4,.45,3.6,'#b4946d');const retailFridge=new T.Group();front.add(retailFridge);retailFridge.position.set(-5.2,0,-2.4);
box(retailFridge,-.36,1,0,.08,2,1.9,'#263c3c',.4);for(const z of[-.91,.91])box(retailFridge,0,1,z,.8,2,.08,'#263c3c',.4);for(const y of[.05,1.95])box(retailFridge,0,y,0,.8,.1,1.9,'#263c3c',.4);
const fridgeGlass=new T.MeshStandardMaterial({color:'#b4d7d8',transparent:true,opacity:.2,roughness:.12,depthWrite:false});
const fridgeDoor=new T.Mesh(new T.BoxGeometry(.025,1.68,1.65),fridgeGlass);fridgeDoor.position.set(.44,1.02,0);retailFridge.add(fridgeDoor);
for(const z of[-.87,.87])box(retailFridge,.44,1.02,z,.055,1.76,.065,'#91a5a2',.7);
for(const y of[.15,1.89])box(retailFridge,.44,y,0,.055,.065,1.76,'#91a5a2',.7);
box(retailFridge,.5,1.05,.67,.055,.61,.055,'#c6d4d0',.8);
for(const y of[.23,.7,1.17,1.64])box(retailFridge,.2,y,0,.43,.035,1.66,'#b5cecc',.7);
box(retailFridge,.39,1.05,-.78,.018,1.56,.022,'#d2eff0');
const coldLight=new T.PointLight('#bde8ff',.65,2);coldLight.position.set(.35,1.5,0);retailFridge.add(coldLight);
for(let row=0;row<3;row++)for(let col=0;col<4;col++){const bottleMesh=row<2?productBottle(retailFridge,.22,.25+row*.47,-.62+col*.39,'rtd',col%3):bottle(retailFridge,.22,.25+row*.47,-.62+col*.39,'#415b49');bottleMesh.rotation.y=Math.PI/2;}
label(front,'RTD / WINE',-4.72,2.05,-2.4,1.35,.2).rotation.y=Math.PI/2;
const fridgeActor={name:'RTD & wine fridge',room:'front',group:retailFridge,headHeight:1.9};addTarget(fridgeActor,'RTD & wine fridge · Shop',()=>window.open('https://tayer-elementary.com/collections/all','_blank','noopener,noreferrer'));

// Open street frontage: no panes, mullions or low wall obstruct the view.
box(front,-6.65,-.04,1.5,1.3,.08,9,'#a6aaa1');box(front,-8.2,-.08,1.5,1.8,.08,12,'#414b4b');
for(let k=0;k<6;k++)box(front,-8.2,-.03,-3+k*1.7,.04,.012,.65,'#e1d9bb');
const windowCar=new T.Group();front.add(windowCar);windowCar.position.set(-8.2,.1,0);
box(windowCar,0,.27,0,.75,.35,1.5,'#697f78',.4);box(windowCar,0,.57,-.05,.65,.3,.8,'#9dada9',.2);
for(const dx of[-.4,.4])for(const dz of[-.45,.45]){const wheel=cylinder(windowCar,dx,.12,dz,.14,.08,'#263130',8);wheel.rotation.z=Math.PI/2;}
const tayerCurtain=new T.Group();front.add(tayerCurtain);tayerCurtain.position.set(-5.1,0,-4.85);
box(tayerCurtain,0,2.48,0,1.05,.06,.07,'#9b987e',.6);
for(let i=0;i<8;i++)box(tayerCurtain,-.4+i*.115,1.25,(i%2)*.035,.12,2.38,.04,i%2?'#40564a':'#2c4338');
const curtainActor={name:'Tayēr entrance',room:'front',group:tayerCurtain,headHeight:2.1};addTarget(curtainActor,'Tayēr curtain entrance',requestTayer);
const door=box(front,-4.4,.07,4.6,1.3,.14,.25,'#293d30');label(front,'COME INSIDE',-4.4,.3,4.65,1.2,.16);const back=floorRoom('back');label(back,'TAYĒR',2,2.75,-4.85,2,.4);box(back,2,1.7,-4.8,6.4,1.4,.1,'#345c40');for(let i=0;i<15;i++)bottle(back,-.9+i*.42,1.35,-4.55,i%3?'#89724c':'#44564d');box(back,2,1.32,-4.6,6.5,.07,.4,'#b8c3b5',.4);label(back,'BEHIND BARS',2,.68,-.27,1.5,.18);
// Continuous oak guest counter and right return; preparation island stays independent.
counter(back,1.9,1.45,7.2,.7,'#c6b996');counter(back,5.45,-.55,.45,4.0,'#c6b996');counter(back,2,-1.05,2.7,1.5,'#a9bec0');for(let row=0;row<3;row++)for(let col=0;col<5;col++){const x=1.02+col*.48+(row%2?.1:0),z=-1.56+row*.48;const hex=cylinder(back,x,1.16,z,.255,.1,'#b6c7c8',6,.7);hex.rotation.y=Math.PI/6;}
// Recessed ice and tool modules are physically on the station, never under a person.
for(const [x,z]of[[1.2,-1.5],[2.8,-1.5]]){cylinder(back,x,1.225,z,.21,.018,'#47646c',6,.4);for(let i=0;i<5;i++)box(back,x-.1+(i%3)*.08,1.25,z-.1+Math.floor(i/3)*.1,.06,.055,.055,'#d3e5df');}bottle(back,2.35,1.25,-1.4,'#8b744f');bottle(back,2.58,1.25,-1.4,'#46594e');
counter(back,-4.2,-3.0,3,1.0,'#a8b9b6');counter(back,-4.2,.3,3,.5,'#c6c9ba');for(const x of[-4.9,-4]){box(back,x,1.14,-3.18,.7,.045,.65,'#354b51');box(back,x,1.16,-3.18,.42,.02,.45,'#bd934c');}box(back,-3.4,1.15,-3.18,.55,.025,.5,'#d8c7a1');label(back,'FRY / PLATE',-4.2,2.15,-4.78,2,.24);
// Countertop fryer stays entirely within the existing kitchen collision footprint.
const fryer=new T.Group();back.add(fryer);fryer.position.set(-4.9,1.145,-3.18);
box(fryer,0,.13,0,.72,.26,.65,'#aebbb8',.7);box(fryer,0,.27,0,.58,.035,.49,'#493b22');
for(const dx of[-.32,.32])box(fryer,dx,.29,0,.035,.06,.6,'#d1dad4',.8);
for(const dz of[-.28,.28])box(fryer,0,.29,dz,.65,.06,.035,'#d1dad4',.8);
for(let k=0;k<7;k++)box(fryer,-.23+k*.075,.32,0,.012,.015,.4,'#b8c4bc',.7);
for(let k=0;k<5;k++)box(fryer,0,.325,-.17+k*.085,.49,.014,.012,'#b8c4bc',.7);
box(fryer,0,.38,.36,.03,.035,.24,'#b8c4bc',.7);box(fryer,0,.38,.48,.16,.045,.045,'#25332d');box(fryer,0,.35,-.29,.68,.17,.08,'#7e9189',.5);
for(const x of[-.18,.18])cylinder(fryer,x,.36,-.24,.025,.015,'#293e32',8);
// Chilled Martini bottle is kept below the guest counter, not in the kitchen.
box(back,2,.57,1.812,.76,.78,.035,'#8b9f99',.65);box(back,2.28,.69,1.85,.035,.22,.05,'#d6dfd6',.7);
const chilledBottle=bottle(back,2,.55,1.44,'#afc6b7');
const martiniStream=cylinder(back,2.2,1.4,1.68,.009,.2,'#d8ddbd',6);martiniStream.visible=false;
let martiniCup=null;
const wcHinge=new T.Group();back.add(wcHinge);wcHinge.position.set(-2.25,0,-4.84);const wcDoor=box(wcHinge,.35,.9,0,.7,1.8,.07,'#465b51');box(back,-1.9,1.88,-4.78,1.7,.035,.07,'#96aaa4',.65);label(wcHinge,'WC',.35,1.2,.06,.35,.2);box(wcHinge,.6,.8,.08,.04,.04,.04,'#d2bd83');
dressRooms(front,back);
for(let i=0;i<3;i++){const anchor=new T.Group();front.add(anchor);anchor.position.set(-3.6+i*.43,1.7,-4.23);addTarget({group:anchor,room:'front',headHeight:0},'MUYU bottle '+(i+1),()=>window.open('https://muyu-liqueurs.com/','_blank','noopener,noreferrer'));interactive.at(-1).button.setAttribute('aria-label','Open MUYU website · bottle '+(i+1));}
back.traverse(object=>{if(object.isLight)object.color.set('#c3e2f0');});
// The corridor begins beyond Elementary's curtain, outside both furnished rooms.
const corridor=new T.Group();scene.add(corridor);corridor.visible=false;
box(corridor,3.2,-.07,-6.2,18.1,.14,1.5,'#65797a');box(corridor,-5.1,-.07,-5.3,1.5,.14,1.8,'#65797a');box(corridor,11.5,-.07,-1,1.5,.14,11.9,'#65797a');box(corridor,12.25,-.07,4.2,3,.14,1.5,'#65797a');
box(corridor,3.2,.7,-6.95,18.1,1.4,.08,'#31484c');
for(const x of[-4,2,8]){const l=new T.PointLight('#b7d7e7',1.8,6);l.position.set(x,2.3,-6.2);corridor.add(l);}
const positions={Alex:['front',-4.4,3.7],David:['front',4.1,1.1],Laura:['front',1.8,-2.6],Giovanni:['front',5.2,2.0],Monica:['back',.2,-1.0],Cheng:['back',3.7,-1.0],Frances:['back',2,-3.1],Steven:['back',-4.9,-3.8],Wang:['back',-3.5,-3.8]};
for(const [name,[room,x,z]]of Object.entries(positions)){const p=person(roots[room],name,x,z);p.room=room;people[name]=p;if(name==='Monica')p.group.rotation.y=Math.PI/2;if(name==='Cheng')p.group.rotation.y=-Math.PI/2;addTarget(p,name,()=>talk(name));}
function addTarget(actor,name,fn){const b=document.createElement('button');b.className='target';b.textContent=['Alex','David','Laura','Giovanni','Monica','Cheng','Frances','Steven','Wang'].includes(name)?name:'··';b.setAttribute('aria-label','Talk to '+name);b.onclick=fn;$('targets').append(b);interactive.push({actor,button:b});}
const seats={front:[[-2.8,.25],[-1.7,.25],[1.5,.25],[2.7,.25],[-4.9,.7],[-4.9,1.9],[-3.0,3.2],[-1.7,3.2],[-.35,3.2],[1.0,3.2]],back:[[-.35,2.5],[.8,2.5],[3.2,2.5],[4.4,2.5],[-4.9,1.1],[-3.7,1.1],[6.25,-2.0],[6.25,-.2],[-1.1,2.5],[5.15,2.5]]};
for(const room of['front','back'])for(let i=0;i<10;i++){const [x,z]=seats[room][i],p=person(roots[room],'Guest',x,z,{guest:true,variant:i,seated:true});p.room=room;p.seat=i;stool(roots[room],x,z);const cupPoint=room==='front'?(i<4?[x,1.15,-.85]:i<6?[-5.25,1.15,z]:[x,1.15,2.5]):i<4?[x,1.15,1.7]:i<6?[x,1.15,.35]:i<8?[5.54,1.15,z]:[x,1.15,1.7];p.group.rotation.y=Math.atan2(cupPoint[0]-x,cupPoint[2]-z);p.cup=glass(roots[room],...cupPoint,['rocks','coupe','highball'][i%3]);p.cupPoint=cupPoint;glass(roots[room],cupPoint[0]+.22,cupPoint[1],cupPoint[2],'rocks','#a8c6be').scale.setScalar(.55);p.nextRound=24+i*5;const chat=document.createElement('div');chat.className='guest-chat';chat.hidden=true;stage.append(chat);p.chat=chat;guests.push(p);}
const hallway=new T.Group();scene.add(hallway);box(hallway,9,-.08,4.2,6,.16,1.4,'#6b7864');box(hallway,9,.045,4.8,6,.07,.05,'#bfa984');
for(let i=0;i<3;i++){const anchor=new T.Group();front.add(anchor);anchor.position.set(-2.05+i*.36,1.56,-4.23);addTarget({group:anchor,room:'front',headHeight:0},'Tayēr RTD '+(i+1),()=>window.open('https://tayer-elementary.com/collections/rtd','_blank','noopener,noreferrer'));interactive.at(-1).button.setAttribute('aria-label','Open Tayēr RTD shop · bottle '+(i+1));}
const pablo=dog(front,4.85,3.6);const dogActor={name:'Pablo',group:pablo,room:'front',headHeight:.65};addTarget(dogActor,'Pablo',visitPablo);
function returnFromPablo(){player.group.position.y=0;pablo.position.y=0;S.pabloPlay=null;S.pabloVisit=false;S.walking=true;walk(player,layouts.front.seat,()=>{S.walking=false;setPlayerPose(true);});}
function pabloChoices(){return [['Pet Pablo',()=>playPablo('pet')],['Play together',()=>playPablo('play')],['Back to my seat',returnFromPablo]];}
function visitPablo(){if(!S.started||S.seatPending||S.transitionRoom||S.walking||player.room!=='front'){notice('Take your seat first.');return;}hideDialogue();S.pabloVisit=true;S.walking=true;S.pabloPlay=null;S.petUntil=S.time+30;
 if(!walk(player,[pablo.position.x-.65,Math.min(4.3,pablo.position.z+.35)],()=>{S.walking=false;say(dogActor,'Fancy saying hello?',pabloChoices());})) {S.walking=false;S.pabloVisit=false;}}
function playPablo(kind){
 if(Math.random()<.25){S.pabloPlay={kind:'ignore',start:S.time};say(dogActor,['Pablo has other plans.','A quick look… then back to sniffing.','Apparently, not now.'][Math.floor(Math.random()*3)],pabloChoices());return;}
 S.pabloPlay={kind,start:S.time};S.petUntil=S.time+7;say(dogActor,kind==='pet'?'Pablo leans into your hand. ♥':'Pablo bounces over. Your turn!',pabloChoices());}
function animatePabloPlay(){if(!S.pabloPlay||!S.pabloVisit||player.path.length)return;const age=S.time-S.pabloPlay.start;
 if(age>6){S.pabloPlay=null;player.group.position.y=0;pablo.position.y=0;return;}const kind=S.pabloPlay.kind;
 if(kind==='ignore'){pablo.rotation.y=-Math.PI/2;return;}
 player.group.rotation.y=Math.PI/2;player.group.position.y=kind==='pet'?-.16:0;
 pose(player,[worldPos('front',pablo.position.x-.1,.62+Math.sin(age*5)*.04,pablo.position.z+.1)]);pablo.rotation.y=Math.PI;
 pablo.position.y=kind==='play'?Math.max(0,Math.sin(age*7))*.10:0;
}
let nextPabloVisit=10,pabloVisitCount=0;
const dogTreat=box(people.Alex.arms[0].hand,0,-.05,.055,.045,.025,.045,'#be915d');dogTreat.visible=false;
function alexPabloMoment(){
 const alex=people.Alex;if(!S.started||speaking===alex||S.toast||S.isJolin&&!S.jolinShotDone)return;
 if(!S.pabloVisit&&!alex.job&&!alex.path.length&&S.time>nextPabloVisit&&!S.seatPending&&!S.transitionRoom&&S.room==='front'&&S.view==='room'&&$('bubble').hidden){
  nextPabloVisit=S.time+25;alex.job={phase:'pablo-out'};
  if(!walk(alex,[pablo.position.x-.65,pablo.position.z],()=>{pabloPath=[];alex.job={phase:'pablo',start:S.time,feed:++pabloVisitCount%2===0};}))alex.job=null;
 }
 const job=alex.job;dogTreat.visible=job?.phase==='pablo'&&job.feed;
 if(job?.phase!=='pablo')return;
 const age=S.time-job.start;alex.group.position.y=-.2;alex.group.rotation.y=Math.PI/2;
 const wrist=worldPos('front',pablo.position.x-.17,.63+Math.sin(age*5)*.025,pablo.position.z+.02);pose(alex,[wrist]);pablo.rotation.y=Math.PI+Math.sin(age*4)*.06;
 if(age>3.5){alex.group.position.y=0;dogTreat.visible=false;alex.job={phase:'pablo-return'};if(!walk(alex,alex.home,()=>{alex.job=null;alex.group.rotation.y=0;}))alex.job=null;}
}

const mixGlasses=[glass(back,.8,1.23,-.8,'highball','#bfa06b'),glass(back,.8,1.23,-1.25,'highball','#bfa06b')],monicaTools=people.Monica.arms.map(a=>tool(a.hand,'spoon')),shaker2=tool(people.Cheng.arms[1].hand,'shaker'),shaker=tool(people.Cheng.arms[0].hand,'shaker'),mFinished=glass(back,1.05,1.23,-.7,'spirits','#b6945a'),cFinished=glass(back,3.15,1.23,-.45,'coupe','#d2b479');
const streams=[cylinder(back,1.05,1.45,-.55,.012,.25,'#c7a35f',6),cylinder(back,3.05,1.46,-.55,.012,.3,'#d4b16e',6)];streams.forEach(p=>p.visible=false);mixGlasses[1].visible=false;monicaTools[1].visible=false;let monicaPouring=false;const yAxis=new T.Vector3(0,1,0);function pourStream(mesh,source,destination,root=back){const from=root.worldToLocal(source.clone()),to=root.worldToLocal(destination.clone()),direction=to.clone().sub(from);mesh.position.copy(from).add(to).multiplyScalar(.5);mesh.scale.y=direction.length()/mesh.geometry.parameters.height;mesh.quaternion.setFromUnitVectors(yAxis,direction.normalize());}
const lauraIdleCup=glass(front,1.8,1.15,-1.3,'rocks','#d8d3a2');lauraIdleCup.visible=false;
const lauraBottle=bottle(people.Laura.arms[0].hand,0,-.12,0,'#b1c0a4');lauraBottle.visible=false;
const lauraStream=cylinder(front,1.8,1.5,-1.3,.009,.2,'#d8d3a2',6);lauraStream.visible=false;let lauraCup=null;
const idleMenus=new T.Group();people.David.arms[0].hand.add(idleMenus);box(idleMenus,0,0,.02,.16,.23,.025,'#dddccc');box(idleMenus,0,0,.037,.12,.006,.005,'#415446');const idleWater=glass(people.David.arms[0].hand,0,0,0,'rocks','#b5d1c7');idleWater.scale.setScalar(.7);
const staffComments={};for(const name of['Alex','Monica']){const chat=document.createElement('div');chat.className='guest-chat';chat.hidden=true;stage.append(chat);staffComments[name]=chat;}
const trays={};for(const name of ['David','Giovanni','Frances','Laura']){const p=people[name],g=new T.Group();p.arms[0].hand.add(g);cylinder(g,0,0,0,.18,.025,'#9aaba4',10,.5);const cup=glass(g,0,.02,0,'rocks','#b7d0c5');g.visible=false;trays[name]={group:g,cup};}
const cameraTarget=new T.Vector3(0,1.1,0);roots.back.visible=false;camera.zoom=1.65;let zoomTarget=1.65,azimuth=.16,elevation=Math.atan2(10,12);
function focus(room,detail=false){if(S.left||S.transitionRoom)return;if(room==='back'&&S.room==='front'&&!S.toilet&&!S.escorted)return requestTayer();if(S.order&&S.order.room!==room&&!S.toilet)return notice('Your drink is being made. We will take you through when it is ready.');street.root.visible=false;scene.background.set(room==='back'?'#253b43':'#283b33');sun.color.set('#bfd9ee');ambient.color.set('#d1e5ee');ambient.groundColor.set(room==='back'?'#243d43':'#263b32');restoreCup();hideDialogue();S.room=room;S.sound=S.roomSound[room];music();S.view=detail?'station':'room';zoomTarget=detail?3.2:1.65;for(const [key,root]of Object.entries(roots))root.visible=key===room;cameraTarget.set(room==='back'?20:0,1.1,detail?-1:0);$('menu').hidden=true;$('bubble').hidden=true;notice(detail?'Turn view to see the real station depth.':room==='front'?'Elementary':'Tayēr');if(S.cup&&!S.toilet&&S.cup.room!==room){roots[room].attach(S.cup.mesh);S.cup.room=room;S.cup.home=playerGlass(room);S.cup.mesh.position.set(...S.cup.home);}if(S.started&&!detail){if(player.room===room&&!S.walking&&!S.toilet){restoreDialogue();}else moveRoom(room);}}
function requestTayer(){
 if(S.seatPending)return askAlexSeat();
 if(!S.started||S.toilet||S.transitionRoom||S.escortQueued)return;
 S.invitationOffered=false;S.invitationRequested=true;
 say(people.David,'Of course. Give me a moment — I’ll check whether there’s room inside.');
 S.invitationCheckAt=S.time+4;
}
function offerTayer(){
 if(S.seatPending||S.room!=='front'||S.view!=='room'||S.toilet||S.transitionRoom||S.order||S.escortQueued||S.invitationOffered)return;
 const eligible=S.invitationRequested||S.regular||S.cup?.room==='front'&&S.cup.remaining<.8||S.frontSipped;
 if(!eligible)return;
 if(guests.filter(p=>p.room==='back').length>=11){if(S.invitationRequested){say(people.David,'It’s full inside at the moment. Settle in here — I’ll come back when there’s room.');S.invitationCheckAt=S.time+12;}return;}
 S.invitationOffered=true;S.escortQueued=true;
 schedule('David',()=>{S.escortQueued=false;S.escortReady=true;say(people.David,S.invitationRequested?'There’s room now. Shall we go through to Tayēr?':'Would you like to join us in Tayēr?', [...(S.visitedTayer?[['Walk through',()=>enterTayer(false)],['Skip · straight to my seat',()=>enterTayer(true)]]:[['Let’s go',()=>enterTayer(false)]]),['Stay in Elementary',()=>{S.invitationRequested=false;S.escortReady=false;hideDialogue();}]]);});
}

function enterTayer(skip){
 S.invitationRequested=false;S.escortReady=false;S.skipNextWalk=skip&&!!S.visitedTayer;S.escorted=true;focus('back');S.escorted=false;
}

function guestActions(){if(S.seatPending)return askAlexSeat();if(!S.started||S.toilet||S.transitionRoom)return;const choices=[['Order',showMenu],['Water',()=>say(people[S.room==='front'?'David':'Frances'],'Still or sparkling?',waterChoices())],['WC',toilet],['Close tab',bill]];choices.splice(2,0,S.room==='front'?['Ask David · Tayēr',requestTayer]:['Back to Elementary',()=>focus('front')]);$('actions').setAttribute('aria-expanded','true');say(player,'Your evening.',choices);}
function bill(){say(player,S.ordered+' orders · £'+S.paid.toFixed(2)+'. Virtual tab only.',[['Good night',leave],['Stay',()=>{$('bubble').hidden=true;}]]);}
function occupied(room,ignore){return [...Object.values(people),...guests,player].filter(p=>p&&p.room===room&&p!==ignore).map(p=>[p.group.position.x,p.group.position.z,.6]);}
function restoreCup(){if(!S.cup?.onHand)return;roots[S.cup.room].attach(S.cup.mesh);S.cup.mesh.position.set(...S.cup.home);S.cup.mesh.rotation.set(0,0,0);S.cup.onHand=false;}
function setPlayerPose(seated){if(!player||player.seated===seated)return;restoreCup();const old=player.group,parent=old.parent,position=old.position.clone(),rotation=old.rotation.clone(),next=person(parent,'YOU',position.x,position.z,{guest:true,variant:S.avatar,seated});next.group.rotation.copy(rotation);if(seated)next.group.rotation.y=player.room==='front'&&S.seatChoice==='table'?0:Math.PI;parent.remove(old);old.traverse(m=>{if(m.isMesh)m.geometry.dispose();});player.group=next.group;player.arms=next.arms;player.headHeight=next.headHeight;player.seated=seated;}
const playerStools={};for(const room of ['front','back']){const g=new T.Group();roots[room].add(g);g.position.set(...[layouts[room].seat[0],0,layouts[room].seat[1]]);stool(g,0,0);playerStools[room]=g;}
function moveRoom(room){S.walking=true;const arrived=()=>{if(room==='back')S.visitedTayer=true;setPlayerPose(true);S.walking=false;hostAsked=false;if(S.pendingWC){S.pendingWC=false;wcApproach();return;}if(S.jolinStage!=='waiting'&&restoreDialogue()){if(room==='front')hostAsked=roomDialogues.get(room)?.actor===people.David;return;}if(room==='back'&&!S.water.back)say(people.Frances,'Welcome to Tayēr. Still or sparkling? The menu runs from light and delicate at the top to rich and spirit-forward at the bottom.',waterChoices());};if(S.skipNextWalk&&room==='back'){S.skipNextWalk=false;restoreCup();roots[room].attach(player.group);player.room=room;player.path=[];player.done=null;player.group.position.set(layouts[room].seat[0],0,layouts[room].seat[1]);arrived();return;}if(player.room!==room){const oldRoom=player.room;if(oldRoom==='corridor')return;S.transitionRoom=room;roots[oldRoom].visible=true;roots[room].visible=false;
 const through=()=>{roots[room].attach(player.group);player.room=room;player.path=[];player.group.position.set(...[layouts[room].entry[0],0,layouts[room].entry[1]]);S.transitionRoom=null;for(const [key,root]of Object.entries(roots))root.visible=key===room;cameraTarget.set(room==='back'?20:0,1.1,0);walk(player,layouts[room].seat,arrived);};
 if(!walk(player,oldRoom==='front'?layouts.front.tayerEntry:layouts[oldRoom].entry,through)){S.transitionRoom=null;S.walking=false;}
}else walk(player,layouts[room].seat,arrived);}

function walk(actor,target,done){const wasSeated=actor.seated;if(actor===player)setPlayerPose(false);const path=pathfind(actor.room,[actor.group.position.x,actor.group.position.z],target,occupied(actor.room,actor));if(!path){if(actor===player&&wasSeated)setPlayerPose(true);notice('One moment — this aisle is busy.');return false;}actor.path=path;actor.done=done;return true;}
const roomDialogues=new Map();
const DIALOGUE_IDLE_MS=8000;
let dialogueTimer;
function hideDialogue(){clearTimeout(dialogueTimer);speaking=null;$('bubble').hidden=true;$('actions').setAttribute('aria-expanded','false');}
function armDialogueTimer(){clearTimeout(dialogueTimer);if(!$('bubble').hidden)dialogueTimer=setTimeout(hideDialogue,DIALOGUE_IDLE_MS);}
function renderDialogue(dialogue){
  clearTimeout(dialogueTimer);
  if(S.view!=='room'||S.transitionRoom||S.toilet||dialogue.room!==S.room||dialogue.actor.room!==S.room)return;
  speaking=dialogue.actor;if(people[speaking.name]&&player&&speaking.room===player.room){speaking.group.rotation.y=Math.atan2(player.group.position.x-speaking.group.position.x,player.group.position.z-speaking.group.position.z);}$('bubble').hidden=false;
  $('dialoguePortrait').hidden=dialogue.actor.name!=='Alex';$('bubble').classList.toggle('with-portrait',dialogue.actor.name==='Alex');$('speaker').textContent=dialogue.actor.name?.toUpperCase()||'THE BAR';$('line').textContent=dialogue.text;$('choices').replaceChildren();
  for(const [text,fn]of dialogue.choices){const b=document.createElement('button');b.textContent=text;b.onclick=()=>{
    if(roomDialogues.get(dialogue.room)!==dialogue||S.room!==dialogue.room)return;
    roomDialogues.delete(dialogue.room);hideDialogue();fn();
  };$('choices').append(b);}
  positionSpeech();armDialogueTimer();
}
function restoreDialogue(){const dialogue=roomDialogues.get(S.room);if(!dialogue)return false;renderDialogue(dialogue);return !$('bubble').hidden;}
function say(actor,text,choices=[],arrived=false){
 if(people[actor.name]&&!arrived&&S.started&&!S.seatPending&&player&&actor.room===player.room){
  const distance=actor.group.position.distanceTo(player.group.position),working=actor.job&&!['hold','conversation'].includes(actor.job.phase);
  if(working||actor.path.length||distance>2.3){
   if(working)notice('Wait a sec — I’ll be right with you.');
   actor.pendingDialogueContent={text,choices};if(!actor.pendingSpeech){actor.pendingSpeech=true;schedule(actor.name,()=>{const pending=actor.pendingDialogueContent;actor.pendingSpeech=false;actor.pendingDialogueContent=null;say(actor,pending.text,pending.choices,true);});}
   return;
  }
 }

  const room=actor.room==='front'||actor.room==='back'?actor.room:S.room;
  const dialogue={actor,text,choices,room};roomDialogues.set(room,dialogue);
  if(room===S.room)renderDialogue(dialogue);
}
$('bubble').addEventListener('pointerdown',armDialogueTimer);
$('bubble').addEventListener('keydown',armDialogueTimer);

function waterChoices(){return[['Still',()=>chooseWater('still')],['Sparkling',()=>chooseWater('sparkling')]];}
function chooseWater(type){const room=S.room;S.water[room]=type;schedule(room==='front'?'David':'Frances',()=>{const point=playerGlass(room);if(!S.waterCups[room]){const mesh=glass(roots[room],point[0]-.27,point[1],point[2],'rocks','#b5d5cd');mesh.scale.setScalar(.6);S.waterCups[room]={mesh,fill:1,pending:false};}else S.waterCups[room].fill=1;if(S.isJolin&&room==='front'&&!S.jolinShotDone){S.jolinStage='osm';say(people.David,'Shall we have a One Sip Martini?',[['Yes — cheers!',()=>{S.jolinStage='pour';order(BAR_CONTENT.front[0],true);}],['Not this time',finishJolinWelcome]]);}else say(people[room==='front'?'David':'Frances'],'What would you like to drink?',[['Take the menu',showMenu]]);},true,null,'water');}
function talk(name){if(S.seatPending)return askAlexSeat();const p=people[name];if(name==='Giovanni'){say(p,p.job?'🙂 Just a moment — my colleague will help you.':'🙂 Just a moment — I’ll be right with you.');return;}if(roomDialogues.get(S.room)?.actor===p){if(name==='David'){if(!p.path.length&&p.group.position.distanceTo(player.group.position)<2.3){restoreDialogue();return;}schedule(name,restoreDialogue);return;}if(restoreDialogue())return;}if(p.job||S.order&&!S.order.delivery&&(name==="Laura"&&S.order.room==='front'||name==='Monica'&&S.order.drink.method==='stir'||name==='Cheng'&&S.order.drink.method==='shake')){say(p,'Give me a moment — I’m serving this round.');return;}if(name==='Alex')say(p,S.regular?'Good to see you again.':'Hey, how are you? Welcome in.',[['Thanks!',hideDialogue]]);else if(name==='David'){schedule(name,()=>say(p,S.water[S.room]?'What are you in the mood for?':'Still or sparkling?',S.water[S.room]?[['Take the menu',showMenu],['Go to Tayēr',requestTayer]]:waterChoices()));}else if(name==='Frances')schedule(name,()=>say(p,'The menu runs from light and delicate to rich and spirit-forward.',[['Take the menu',showMenu]]));else if(name==='Monica')say(p,'Ingredients first. Always.');else if(name==='Cheng')say(p,'Shake. Strain. Pour.');else if(name==='Laura')say(p,'Good to see you.',[['Take the menu',showMenu]]);else say(p,'Keeping the evening moving.');}
function serviceDestination(job){const p=job.p,room=p.room,[x,z]=job.target,candidates=p.name==='Laura'?[[x,z],[x+.55,z],[x-.55,z]]:[[x,z],[x-.6,z],[x+.6,z],[x,z+.65],[x-.6,z+.65],[x+.6,z+.65]];return candidates.find(t=>pathfind(room,[p.group.position.x,p.group.position.z],t,occupied(room,p)));}
function schedule(name,done,priority=true,targetOverride=null,kind='talking'){const p=people[name];if(p.job?.phase==='conversation'&&!targetOverride&&!p.path.length){done();return;}const target=name==='Laura'&&p.room==='front'?[.2,-2.15]:targetOverride||(p.room==='front'?[.75,S.seatChoice==='table'?1:.1]:[2,.65]);const job={p,target,done,kind};priority?queue.unshift(job):queue.push(job);}
function showMenu(arrived=false){if(S.seatPending)return askAlexSeat();if(!S.started||S.toilet||S.left)return;if(S.view==='street')focus(S.room);if(S.room==='front'&&!arrived){if(S.menuApproach)return;S.menuApproach=true;hideDialogue();schedule('David',()=>{S.menuApproach=false;showMenu(true);});return;}if(S.transitionRoom||player.path.length)return notice('Let us find your seat first.');if(S.cup){notice('Enjoy the drink on your table first.');return;}if(!S.water[S.room]){say(people[S.room==='front'?'David':'Frances'],'Still or sparkling?',waterChoices());return;}if(S.order){notice('Your drink is on its way.');return;}$('menu').dataset.room=S.room;$('menuTitle').textContent=S.room==='front'?'elementary':'tayēr';$('menuSubtitle').textContent=S.room==='front'?'#HUSTLEMAGIC':'SEASONAL';$('drinks').replaceChildren();for(const [i,d] of BAR_CONTENT[S.room].entries()){const b=document.createElement('button');b.className='drink';const title=document.createElement('b'),desc=document.createElement('p'),price=document.createElement('span');title.textContent=d.name.split(' · ')[0];desc.textContent=d.ingredients;price.textContent=d.price;if(S.room==='front'){const category=document.createElement('small');category.className='category';category.textContent=i===0?'CORE':'SEASONAL';b.append(category);}b.append(title,desc,price);b.onclick=()=>order(d);$('drinks').append(b);}$('menu').hidden=false;}
function order(drink,comp=false){if(S.order||S.cup)return;$('menu').hidden=true;if(!comp){S.ordered++;if(S.room==='front')S.frontOrdered++;S.paid+=Number(drink.price);if(S.ordered===5)S.fifthDue=true;}S.order={drink,room:S.room,phase:0,phaseTime:0,comp};if(S.room==='front'){lauraCup=glass(front,1.8,1.15,-1.3,drink.vessel,'#d8d3a2');fillLevel(lauraCup,0);}say(people[S.room==='front'?'Laura':drink.method==='chilled'?'Frances':drink.method==='shake'?'Cheng':'Monica'],comp?'One Sip Martini. On us.':'Coming right up.',S.room==='back'&&drink.method!=='chilled'?[['Watch my drink',()=>focus('back',true)]]:[]);}
function guestServicePoint(p){const [x,z]=p.home,worker=people[p.room==='front'?'Giovanni':'Frances'];let preferred=p.room==='back'&&p.seat<4?[x,.65]:p.room==='back'&&p.seat>=4&&p.seat<6?[x,-.55]:p.room==='front'&&p.seat>=4&&p.seat<6?[x+.7,z+.05]:p.room==='back'&&p.seat>=6&&p.seat<8?[4.55,z+.1]:[x+.6,z+.6];const candidates=[preferred,[x+.8,z],[x-.8,z],[x,z+.8],[x,z-.8],[x+.6,z+.6],[x-.6,z+.6]];return candidates.find(target=>pathfind(p.room,worker.home,target,occupied(p.room,worker)))||layouts[p.room].entry;}

function fillLevel(mesh,level){const liquid=mesh.userData.liquid;if(!liquid.userData.base){liquid.userData.base={y:liquid.position.y,h:liquid.geometry.parameters.height};}const {y,h}=liquid.userData.base;liquid.scale.y=Math.max(.02,level);liquid.position.y=y-h/2+h*Math.max(.02,level)/2;}
function playerGlass(room=S.room){return room==='front'?[.2,1.15,S.seatChoice==='table'?1.7:-.84]:[2.2,1.15,1.68];}
function serve(){const order=S.order;if(!order||order.delivery)return;order.delivery=true;if(order.drink.method==='chilled'){people.Frances.job=null;back.attach(chilledBottle);chilledBottle.position.set(2,.55,1.44);chilledBottle.rotation.set(0,0,0);martiniStream.visible=false;}schedule(order.room==='front'?'Laura':'Frances',()=>{S.cup={mesh:martiniCup&&order.drink.method==='chilled'?martiniCup:glass(roots[order.room],...playerGlass(order.room),order.drink.vessel,order.drink.method==='shake'?'#c8a75e':'#d2c098'),room:order.room,remaining:1,home:playerGlass(order.room),onHand:false};if(order.drink.method==='chilled'){fillLevel(S.cup.mesh,1);martiniCup=null;}if(lauraCup&&order.room==='front'){lauraCup.parent.remove(lauraCup);lauraCup=null;}S.order=null;if(S.isJolin&&S.jolinStage==='pour'&&order.room==='front'){S.jolinStage='cheers';say(people.Laura,'Hi Jolin! One Sip Martini. Cheers?',[['Cheers — all together!',startJolinToast]]);}else say(people[order.room==='front'?'Laura':'Frances'],'Here you are. Settle in — there’s no rush.');if(order.room==='back')showServeCloseup();if(S.goAfterServe){S.goAfterServe=false;requestTayer();}},true,null,'serving');}
function toilet(){if(S.order||S.toilet||S.transitionRoom)return;if(S.view!=='room')focus(S.room);hideDialogue();S.toiletReturn=S.room;S.toilet=true;if(player.room!=='back'){S.pendingWC=true;focus('back');}else wcApproach();}
function wcApproach(){if(!walk(player,[-1.9,-4.35],()=>{S.wcStart=S.time;S.wcPhase=true;notice('A moment inside.');})){S.toilet=false;S.pendingWC=false;}}

function placeTargets(){const pv=street.poster.getWorldPosition(new T.Vector3()).project(camera);posterButton.hidden=!S.started||S.view!=='street'||Math.abs(pv.x)>1||Math.abs(pv.y)>1;posterButton.style.left=(pv.x*.5+.5)*100+'%';posterButton.style.top=(-pv.y*.5+.5)*100+'%';for(const p of interactive){const v=p.actor.group.localToWorld(new T.Vector3(0,p.actor.headHeight,0)).project(camera),visible=S.started&&p.actor.room===S.room&&S.view==='room'&&Math.abs(v.x)<1&&Math.abs(v.y)<1;p.button.hidden=!visible;if(visible){p.button.style.left=(v.x*.5+.5)*100+'%';p.button.style.top=(-v.y*.5+.5)*100+'%';}}}
function updatePlayerHands(){if(!player)return;const cup=S.cup,phase=S.time%7,allowed=!S.toast&&cup&&cup.remaining>0&&player.seated&&!player.path.length&&!S.toilet&&S.view==='room'&&cup.room===player.room;if(!allowed||phase<1||phase>=3.6){restoreCup();pose(player);return;}player.group.updateWorldMatrix(true,false);const pick=worldPos(cup.room,cup.home[0],cup.home[1]+.09,cup.home[2]),face=player.group.localToWorld(new T.Vector3(.04,1.14,.30)),rest=player.group.localToWorld(player.arms[0].shoulder.clone().add(new T.Vector3(-.055,-.58,.04)));let wrist;if(phase<1.6)wrist=rest.lerp(pick,(phase-1)/.6);else if(phase<2.2)wrist=pick.clone().lerp(face,(phase-1.6)/.6);else if(phase<3)wrist=face;else wrist=face.clone().lerp(pick,(phase-3)/.6);pose(player,[wrist]);if(phase>=1.6&&!cup.onHand){player.arms[0].hand.attach(cup.mesh);cup.mesh.position.set(0,-.09,0);cup.mesh.rotation.set(0,0,0);cup.onHand=true;}if(cup.onHand)cup.mesh.rotation.x=phase<2.2?-.55*(phase-1.6)/.6:phase<3?-.55:-.55*(1-(phase-3)/.6);}
function positionSpeech(){
  if($('bubble').hidden||!speaking)return;
  const bounds=stage.getBoundingClientRect(),b=$('bubble');
  const v=speaking.group.localToWorld(new T.Vector3(0,speaking.headHeight+.025,0)).project(camera);
  const x=(v.x*.5+.5)*bounds.width,y=(-v.y*.5+.5)*bounds.height;
  const gap=9,pad=8,left=Math.max(pad,Math.min(bounds.width-b.offsetWidth-pad,x-b.offsetWidth/2));
  const above=y-b.offsetHeight-gap,below=above<pad&&y+gap+b.offsetHeight<=bounds.height-pad;
  const top=Math.max(pad,Math.min(bounds.height-b.offsetHeight-pad,below?y+gap:above));
  b.style.left=left+'px';b.style.top=top+'px';b.classList.toggle('below-speaker',below);
  b.style.setProperty('--tail',Math.max(12,Math.min(b.offsetWidth-12,x-left))+'px');
}

function advance(actor,dt){if(actor===speaking&&!$('bubble').hidden)return;if(!actor.path?.length)return;const [x,z]=actor.path[0],p=actor.group.position,dx=x-p.x,dz=z-p.z,d=Math.hypot(dx,dz),speed=actor===player&&(S.transitionRoom||S.walking&&S.room==='back')?4.2:1.6;if(d<speed*dt){p.x=x;p.z=z;actor.path.shift();if(!actor.path.length){const done=actor.done;actor.done=null;done?.();}}else{p.x+=dx/d*speed*dt;p.z+=dz/d*speed*dt;actor.group.rotation.y=Math.atan2(dx,dz);}if(actor.path.length)actor.group.position.y=Math.sin(S.time*12)*.018;else{if(actor===player&&['front','back'].includes(player.room)&&!S.toilet&&!S.transitionRoom&&Math.hypot(actor.group.position.x-layouts[player.room].seat[0],actor.group.position.z-layouts[player.room].seat[1])<.05)setPlayerPose(true);else actor.group.position.y=0;}}
function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(Math.round(Math.min(1440,w*Math.min(window.devicePixelRatio||1,2))),Math.round(Math.min(1440,w*Math.min(window.devicePixelRatio||1,2))*h/w),false);camera.left=-8*w/h;camera.right=8*w/h;camera.top=8;camera.bottom=-8;camera.updateProjectionMatrix();}window.addEventListener('resize',resize);resize();
function animate(now){requestAnimationFrame(animate);const dt=Math.min(.04,(now-last)/1000);last=now;corridor.visible=false;windowCar.position.z=((now/1000*.8)%12)-4.5;street.update(dt);if(S.view==='street'){const light=street.state.light;scene.background.set(new T.Color('#101d32').lerp(new T.Color('#a0b6bb'),light));}if(S.started){S.time+=dt;advance(player,dt);for(const p of Object.values(people)){advance(p,dt);if(p.job&&p.job.phase==='hold'){p.job.hold+=dt;if(p.job.hold>.35){const job=p.job;job.done();if(p.job===job)job.phase='conversation';}}}
for(const p of Object.values(people)){if(p.job?.phase==='conversation'&&speaking!==p&&$('menu').hidden){p.job.phase='return';if(!walk(p,p.home,()=>{p.job=null;}))p.job=null;}}
for(const room of['front','back']){if(!(room==='back'&&S.order?.drink.method==='chilled'&&!S.order.delivery)&&!guests.some(p=>p.room===room&&p.path.length)&&!(player.room===room&&player.path.length)){const index=queue.findIndex(j=>j.p.room===room&&!j.p.job&&speaking!==j.p);if(index>=0){const j=queue.splice(index,1)[0];const target=serviceDestination(j);if(target&&walk(j.p,target,()=>{j.p.job.phase='hold';j.p.job.hold=0;}))j.p.job={...j,phase:'out',hold:0};else queue.push(j);}}}
if(!S.seatPending&&!S.toast&&!S.pabloVisit&&!hostAsked&&S.room==='front'&&!player.path.length&&!S.water.front&&!S.order&&($('bubble').hidden||S.jolinStage==='waiting')){hostAsked=true;if(S.isJolin)S.jolinStage='greeting';schedule('David',()=>say(people.David,S.isJolin?'Ciao, Jolin! How are you?':'Ciao～ How are you tonight?', [['Good, thanks!',()=>say(people.David,'Still or sparkling?',waterChoices())],['A long day.',()=>say(people.David,'Make yourself comfortable. Still or sparkling?',waterChoices())],['I’d like to go to Tayēr',requestTayer]]));}for(const [room,w]of Object.entries(S.waterCups)){if(S.cup?.room===room&&!S.toilet)w.fill=Math.max(0,w.fill-dt/45);fillLevel(w.mesh,w.fill);if(w.fill<.3&&!w.pending){w.pending=true;schedule(room==='front'?'David':'Frances',()=>{w.fill=1;w.pending=false;},false,null,'water');}}
if(S.order?.drink.method==='chilled'&&!S.order.preparationReady&&!S.order.approaching&&!people.Frances.job){const order=S.order;order.approaching=true;people.Frances.job={phase:'martini'};if(!walk(people.Frances,[2,.65],()=>{order.preparationReady=true;martiniCup=glass(back,...playerGlass('back'),order.drink.vessel,'#d8ddbd');fillLevel(martiniCup,0);})) {people.Frances.job=null;order.approaching=false;}}
if(S.order&&!S.order.delivery&&(S.order.drink.method!=='chilled'||S.order.preparationReady)){S.order.phaseTime+=dt;const step=S.order.drink.actions[S.order.phase];if(S.order.phaseTime>=step.duration){S.order.phaseTime=0;S.order.phase++;if(S.order.phase>=S.order.drink.actions.length){S.order.phase=S.order.drink.actions.length-1;serve();}}}if(S.cup?.room==='front'&&S.cup.remaining<.8)S.frontSipped=true;
if(!S.pabloVisit&&(!S.isJolin||S.jolinShotDone)&&S.room==='front'&&!S.invitationOffered&&((S.invitationRequested&&S.time>=S.invitationCheckAt)||(!S.invitationRequested&&S.frontSipped)))offerTayer();
if(!S.toast&&S.jolinStage!=='cheers'&&S.cup&&S.view==='room'&&!S.toilet&&!S.escortQueued&&!S.escortReady&&!S.transitionRoom&&player.seated&&player.room===S.cup.room){S.cup.remaining=Math.max(0,S.cup.remaining-dt/16);fillLevel(S.cup.mesh,S.cup.remaining);if(S.cup.remaining===0&&!S.cup.clearing){S.cup.clearing=true;schedule(S.cup.room==='front'?'Giovanni':'Frances',()=>{restoreCup();S.cup.mesh.parent.remove(S.cup.mesh);S.cup=null;say(people[S.room==='front'?'David':'Frances'],'How was that?',[['Another round',showMenu],S.room==='front'?['Ask David · Tayēr',requestTayer]:['Back to Elementary',()=>focus('front')]]);if(S.fifthDue&&!S.gift){S.gift=true;S.fifthDue=false;order(BAR_CONTENT.front[0],true);}},true,null,'clearing');}}
if(S.wcPhase){const age=S.time-S.wcStart;const slide=age<.4?age/.4:age<.8?1:age<1.2?1-(age-.8)/.4:age<4.8?0:Math.min(1,(age-4.8)/.4);wcHinge.position.x=-2.25+slide*.82;if(age<.8){player.group.position.z=-4.35-age/.8;player.group.rotation.y=Math.PI;}else if(age<4.8)player.group.visible=false;else if(age<5.6){player.group.visible=true;player.group.rotation.y=0;player.group.position.z=-5.35+(age-4.8)/.8;}else{S.wcPhase=false;S.toilet=false;player.group.visible=true;player.group.position.z=-4.35;if(S.toiletReturn==='front')focus('front');else walk(player,layouts.back.seat,()=>{});}}
if(!S.wcPhase)wcHinge.position.x=T.MathUtils.lerp(wcHinge.position.x,-2.25,Math.min(1,dt*5));
for(const p of guests){advance(p,dt);if(S.time>p.nextRound&&!p.roundQueued){p.roundQueued=true;schedule(p.room==='front'?'Giovanni':'Frances',()=>{fillLevel(p.cup,1);p.nextRound=S.time+40+p.seat*3;p.roundQueued=false;},false,guestServicePoint(p),'serving');}else fillLevel(p.cup,Math.max(.08,1-(S.time-(p.nextRound-40))/40));}
if(!pabloPath.length&&!S.pabloVisit&&S.time>pabloNextWalk-12)pablo.rotation.y=Math.sin(S.time*.4)*.25;
}
for(const p of Object.values(people))if(!['Monica','Cheng'].includes(p.name)||p.job){const tray=trays[p.name];if(tray){tray.group.visible=!!p.job&&['serving','water','clearing'].includes(p.job.kind);if(tray.group.visible){tray.cup.visible=p.job.kind==='clearing'?p.job.phase==='return':p.job.phase!=='return';p.group.updateWorldMatrix(true,false);pose(p,[p.group.localToWorld(new T.Vector3(-.52,1.17,.18))]);fillLevel(tray.cup,p.job.kind==='clearing'?0:1);}else pose(p);}else pose(p);}if(!people.Monica.job&&speaking!==people.Monica){const recipe=S.order?.room==='back'&&S.order.drink.method==='stir'?S.order.drink.actions[S.order.phase]?.module:null,pouring=recipe?recipe==='strainer':S.time%12>8;const targets=[worldPos('back',.8,1.58+Math.sin(S.time*7)*.018,-.8),worldPos('back',.3,1.14,-1.15)];if(pouring)targets[0]=worldPos('back',.85,1.58,-.65);pose(people.Monica,targets);const hand=people.Monica.arms[0].hand;if(pouring&&!monicaPouring){hand.attach(mixGlasses[0]);mixGlasses[0].position.set(0,-.16,0);mixGlasses[0].rotation.set(.8,0,0);}if(!pouring&&monicaPouring){back.attach(mixGlasses[0]);mixGlasses[0].position.set(.8,1.23,-.8);mixGlasses[0].rotation.set(0,0,0);}monicaPouring=pouring;monicaTools[0].visible=!pouring;monicaTools[1].visible=false;streams[0].visible=pouring;if(pouring){mixGlasses[0].updateWorldMatrix(true,false);pourStream(streams[0],mixGlasses[0].localToWorld(new T.Vector3(.06,.3,0)),worldPos('back',1.05,1.77,-.7));}}
if(!people.Cheng.job&&speaking!==people.Cheng){const recipe=S.order?.room==='back'&&S.order.drink.method==='shake'?S.order.drink.actions[S.order.phase]?.module:null,pouring=recipe?recipe==='strainer':S.time%14>7&&S.time%14<11,target=worldPos('back',pouring?3.15:3.2,(pouring?1.54:1.56)+(pouring?0:Math.sin(S.time*17)*.075),pouring?-.55:-1.0);pose(people.Cheng,[target,worldPos('back',3.2,1.48,-1.15)]);shaker.rotation.z=pouring?-.8:Math.sin(S.time*17)*.16;shaker2.visible=!pouring&&Math.floor(S.time/14)%3===1;streams[1].visible=pouring;if(pouring){shaker.updateWorldMatrix(true,false);pourStream(streams[1],shaker.localToWorld(new T.Vector3(.065,.1,0)),worldPos('back',3.15,1.48,-.45));}}
if(S.order?.drink.method==='chilled'&&S.order.preparationReady&&!S.order.delivery){
 const phase=S.order.phase,t=S.order.phaseTime/S.order.drink.actions[phase].duration,p=people.Frances;
 const low=worldPos('back',2,.68,1.44),high=worldPos('back',2.05,1.7,1.5);
 const target=phase===0?low.clone().lerp(high,t):phase===1?high:high.clone().lerp(low,t);
 pose(p,[target]);p.group.updateWorldMatrix(true,false);
 if(chilledBottle.parent!==p.arms[0].hand){p.arms[0].hand.attach(chilledBottle);chilledBottle.position.set(0,-.12,0);}
 chilledBottle.rotation.z=phase===1?-.9:0;martiniStream.visible=phase===1;
 if(phase===1){chilledBottle.updateWorldMatrix(true,false);pourStream(martiniStream,chilledBottle.localToWorld(new T.Vector3(.05,.3,0)),worldPos('back',2.2,1.42,1.68));fillLevel(martiniCup,t);}
}
const frontRecipe=S.order?.room==='front'&&!S.order.delivery?S.order.drink.actions[S.order.phase]:null;
const laura=people.Laura,lauraIdle=!S.order&&!laura.job&&speaking!==laura&&S.started;
const slush=lauraIdle?S.time%16>=8:frontRecipe?.module==='slush';
const lauraWorking=(lauraIdle||frontRecipe&&['bottle_rail','slush'].includes(frontRecipe.module))&&!laura.job&&!laura.path.length&&speaking!==laura;
lauraIdleCup.visible=!!lauraWorking;lauraBottle.visible=!!lauraWorking&&!slush;lauraStream.visible=false;
if(lauraWorking){
 const destination=slush?new T.Vector3(2.48,0,-2.95):new T.Vector3(1.8,0,-2.15);
 laura.group.position.lerp(destination,1-Math.exp(-dt*3));laura.group.rotation.y=slush?Math.PI:0;
 const ready=laura.group.position.distanceTo(destination)<.09;
 if(slush){
  // The receiving glass is carried by the wrist, directly below the machine tap.
  if(lauraIdleCup.parent!==laura.arms[0].hand){laura.arms[0].hand.attach(lauraIdleCup);lauraIdleCup.position.set(0,-.1,0);}
  pose(laura,[worldPos('front',2.48,1.04,-3.47),worldPos('front',2.48,1.24,-3.5)]);
  lauraIdleCup.updateWorldMatrix(true,false);
  if(ready){lauraStream.visible=true;pourStream(lauraStream,worldPos('front',2.48,1.23,-3.5),lauraIdleCup.localToWorld(new T.Vector3(0,.2,0)),front);}
 }else{
  if(lauraIdleCup.parent!==front)front.attach(lauraIdleCup);
  lauraIdleCup.position.set(1.8,1.15,-1.65);lauraIdleCup.rotation.set(0,0,0);
  pose(laura,[worldPos('front',1.75,1.55+Math.sin(S.time*1.6)*.04,-1.65)]);
  lauraBottle.rotation.z=.9;lauraBottle.updateWorldMatrix(true,false);
  if(ready){lauraStream.visible=true;pourStream(lauraStream,lauraBottle.localToWorld(new T.Vector3(-.04,.3,0)),worldPos('front',1.8,1.36,-1.65),front);}
 }
 fillLevel(lauraIdleCup,ready?(lauraIdle?(S.time%8)/8:S.order.phaseTime/frontRecipe.duration):0);
 if(lauraCup&&frontRecipe)fillLevel(lauraCup,S.order.phaseTime/frontRecipe.duration);
}else if(lauraCup&&S.order?.room==='front'&&S.order.phase>1)fillLevel(lauraCup,1);
const davidIdle=!people.David.job&&speaking!==people.David,activity=Math.floor(S.time/8)%3;idleMenus.visible=davidIdle&&activity===0;idleWater.visible=davidIdle&&activity===1;if(davidIdle&&activity===1){people.David.group.updateWorldMatrix(true,false);pose(people.David,[people.David.group.localToWorld(new T.Vector3(-.45,1.03,.08))]);}else if(davidIdle&&activity===2)people.David.group.rotation.y=Math.sin(S.time*.35)*.5;
alexPabloMoment();updatePlayerHands();animatePabloPlay();updateVisitScenes(dt);for(const p of [people.Steven,people.Wang]){const x=p.home[0],z=p.home[1];pose(p,[worldPos('back',x,1.35,z+.65),worldPos('back',x+.15,1.2,z+.55)]);}if(S.serviceCloseup){people.Frances.group.getWorldPosition(cameraTarget);cameraTarget.y=1.15;}else if(S.transitionRoom&&player){player.group.getWorldPosition(cameraTarget);cameraTarget.y=1.1;}camera.zoom=T.MathUtils.lerp(camera.zoom,zoomTarget*(stage.clientHeight<600&&stage.clientWidth>stage.clientHeight?1.3:Math.min(1,Math.max(.72,stage.clientWidth/stage.clientHeight/1.45))),.08);azimuth+=spin*dt;const center=cameraTarget.clone();camera.position.set(center.x+Math.sin(azimuth)*12,center.y+Math.tan(elevation)*12,center.z+Math.cos(azimuth)*12);camera.lookAt(center);camera.updateProjectionMatrix();renderer.render(scene,camera);for(const [name,chat]of Object.entries(staffComments)){const actor=people[name],period=name==='Alex'?47:61,on=S.started&&actor.room===S.room&&S.view==='room'&&$('bubble').hidden&&!S.order&&S.time>12&&S.time%period<5;chat.hidden=!on;if(on){const lines=name==='Alex'?['On fire tonight.','A little smoky.','Still serving. Still hot.','Two rooms. Two different rhythms.']:['Ingredients first. Always.','The shirts have enough flames.','We opened these doors in 2019.','The hex station was made with Behind Bars.'];chat.textContent=name.toUpperCase()+': '+lines[Math.floor(S.time/period)%lines.length];const v=actor.group.localToWorld(new T.Vector3(0,actor.headHeight+.1,0)).project(camera);chat.style.left=(v.x*.5+.5)*100+'%';chat.style.top=(-v.y*.5+.5)*100+'%';}}for(const p of guests){const beat=Math.floor(S.time/4),turn=(beat+Math.floor(p.seat/2))%16,on=S.started&&p.room===S.room&&S.view==='room'&&!p.path.length&&(p.seat%2?turn===1:turn===0);p.chat.hidden=!on;if(on){const words=p.seat%2?['Better now. Yours?','Absolutely.','Cheers!']:['How was your day?','Shall we stay for one more?','I missed evenings like this.'];p.chat.textContent=words[(Math.floor(beat/16)+p.seat)%3];const v=p.group.localToWorld(new T.Vector3(0,p.headHeight+.1,0)).project(camera);p.chat.style.left=(v.x*.5+.5)*100+'%';p.chat.style.top=(-v.y*.5+.5)*100+'%';}}placeTargets();positionSpeech();$('status').textContent=S.started?(S.view==='street'?'OLD STREET · '+street.state.label:S.room==='front'?'ELEMENTARY':'TAYĒR')+' · '+S.ordered+' ORDERS · 3D STUDY':'Come inside';}
requestAnimationFrame(animate);
for(let i=0;i<6;i++){const b=document.createElement('button');const c=document.createElement('canvas');c.width=32;c.height=42;const ctx=c.getContext('2d'),palette=avatarPalettes[i];ctx.fillStyle=palette.hair;ctx.fillRect(9,2,14,13);ctx.fillStyle=palette.skin;ctx.fillRect(11,5,10,11);ctx.fillStyle='#25372d';ctx.fillRect(12,9,2,2);ctx.fillRect(18,9,2,2);ctx.fillStyle=palette.shirt;ctx.fillRect(7,17,18,16);ctx.fillStyle='#d1bfa1';ctx.fillRect(8,17,16,3);ctx.fillStyle='#344339';ctx.fillRect(10,33,5,8);ctx.fillRect(17,33,5,8);b.append(c);b.style.color=['#91a7a2','#dcc89b','#b991b2','#c99663','#97a4b7','#a5b68a'][i];b.setAttribute('aria-label','Choose character '+(i+1));b.setAttribute('aria-pressed',String(i===0));b.onclick=()=>{S.avatar=i;for(const p of $('avatars').children)p.setAttribute('aria-pressed',String(p===b));};$('avatars').append(b);}
function chooseFrontSeat(choice){
 S.seatChoice=choice;S.seatPending=false;layouts.front.seat=choice==='table'?[0,.95]:[0,-.16];playerStools.front.position.z=layouts.front.seat[1];moveRoom('front');
 
}
function askAlexSeat(){say(people.Alex,'Where would you like to sit?',[['At the bar',()=>chooseFrontSeat('bar')],['At the large table',()=>chooseFrontSeat('table')]]);}
$('enter').onclick=event=>{if(event?.isTrusted&&matchMedia('(pointer:coarse)').matches)screenButton.click();if(!$('adult').checked){notice('Please confirm that you are 18 or older.');return;}S.name=$('name').value.trim()||'friend';S.regular=['jolin','joline','jolyn','jolene','daisy','daisie','daisey','daisi'].includes(S.name.normalize('NFKC').toLowerCase().replace(/[^a-z]/g,''));S.seatPending=true;S.started=true;$('welcome').hidden=true;player=person(front,'YOU',...layouts.front.entry,{guest:true,variant:S.avatar});player.room='front';player.headHeight=1.8;addTarget(player,'Your character',guestActions);S.isJolin=['jolin','joline','jolyn','jolene','olin'].includes(S.name.toLowerCase());if(S.isJolin){S.jolinStage='room';say(people.Alex,'Jolin! How are you? Welcome back. Would you like to go to Tayēr or Elementary?',[['Tayēr',()=>jolinRoom('back')],['Elementary',()=>jolinRoom('front')]]);}else say(people.Alex,(S.regular?'Good to see you, ':'Hey, ')+S.name+'. Where would you like to sit?',[['At the bar',()=>chooseFrontSeat('bar')],['At the large table',()=>chooseFrontSeat('table')]]);music();saveVisit();};
$('street').onclick=()=>{if(!S.started||S.transitionRoom)return;hideDialogue();S.view='street';street.root.visible=true;for(const root of Object.values(roots))root.visible=false;cameraTarget.set(0,3,22);zoomTarget=.8;spin=0;$('orbit').textContent='Turn view';$('bubble').hidden=true;$('menu').hidden=true;notice('Old Street · '+street.state.label+' · simulated traffic');};
$('front').onclick=()=>S.started&&focus('front');$('back').onclick=()=>S.started&&focus('back');$('station').onclick=()=>{if(S.started&&S.room==='back')focus('back',true);else notice('Take a seat in Tayēr to inspect the station.');};$('orbit').onclick=()=>{spin=spin?0:.35;$('orbit').textContent=spin?'Stop turning':'Turn view';};$('actions').onclick=guestActions;$('dismiss').onclick=hideDialogue;$('closeMenu').onclick=()=>$('menu').hidden=true;
function leave(){try{localStorage.removeItem(VISIT_KEY);}catch{};if(S.order)return notice('Your round is coming first.');if(S.left)return;S.left=true;if(S.cup){S.cup.mesh.parent.remove(S.cup.mesh);S.cup=null;}const room=player.room;walk(player,layouts[room].entry,()=>{player.group.visible=false;say(people.Alex,'Thanks for coming. We will leave the light on.',[['One more evening',()=>location.reload()]]);});notice('The lights stay on here. See you again.');}
const audioBus=new BroadcastChannel('tayer-bar-radio');audioBus.onmessage=()=>{backgroundMusic.setEnabled(false);if(controller)controller.pause();};function music(){$('sound').textContent=(S.room==='front'?'Elementary':'Tayēr')+' · Sound '+(S.sound?'on':'off');backgroundMusic.setEnabled(S.started&&S.sound);if(!musicReady||!S.started)return;if(S.sound){audioBus.postMessage('playing');const attempt=controller.play();attempt?.catch?.(()=>backgroundMusic.setExternalPlaying(false));}else controller.pause();}$('sound').onclick=()=>{S.sound=!S.sound;S.roomSound[S.room]=S.sound;music();};window.onSpotifyIframeApiReady=api=>api.createController($('spotify'),{uri:'spotify:playlist:6UppMPIf8pKgyq8JjT1DAQ',width:280,height:152},c=>{controller=c;const f=$('music').querySelector('iframe');if(f)f.loading='eager';c.addListener('ready',()=>{musicReady=true;music();});c.addListener('playback_update',e=>{backgroundMusic.setExternalPlaying(!e.data.isPaused);$('sound').dataset.playing=String(!e.data.isPaused);$('sound').setAttribute('aria-label',S.sound?'Sound on'+(!e.data.isPaused?' · music playing':''):'Sound off');});});const sdk=document.createElement('script');sdk.src='https://open.spotify.com/embed/iframe-api/v1';sdk.async=true;document.head.append(sdk);
function tick(){const time=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',hour:'2-digit',minute:'2-digit'}).format(new Date());$('time').textContent='LONDON '+time;}tick();setInterval(tick,1000);

// Drag empty scene space to look around; dialogue and character buttons keep their clicks.
let cameraDrag=null;
$('world').addEventListener('pointerdown',event=>{
  if(!S.started||event.button!==0)return;
  spin=0;$('orbit').textContent='Turn view';
  cameraDrag={id:event.pointerId,x:event.clientX,y:event.clientY,startX:event.clientX,startY:event.clientY};
  $('world').setPointerCapture(event.pointerId);
});
$('world').addEventListener('pointermove',event=>{
  if(!cameraDrag||cameraDrag.id!==event.pointerId)return;
  azimuth-=(event.clientX-cameraDrag.x)*.008;
  elevation=T.MathUtils.clamp(elevation+(event.clientY-cameraDrag.y)*.006,.3,1.25);
  cameraDrag.x=event.clientX;cameraDrag.y=event.clientY;
});

const posterDialog=document.createElement('dialog');posterDialog.id='posterDialog';posterDialog.innerHTML='<button aria-label="Close poster">×</button><img src="double-chicken-poster.png" alt="Double Chicken Please × Tayēr poster">';document.body.append(posterDialog);
const posterButton=document.createElement('button');posterButton.className='poster-target';posterButton.setAttribute('aria-label','Enlarge Double Chicken poster');$('targets').append(posterButton);posterButton.onclick=()=>posterDialog.showModal();
posterDialog.querySelector('button').onclick=()=>posterDialog.close();posterDialog.addEventListener('click',e=>{if(e.target===posterDialog)posterDialog.close();});
$('world').addEventListener('pointerup',event=>{
 if(S.view!=='street'||!cameraDrag||Math.hypot(event.clientX-cameraDrag.startX,event.clientY-cameraDrag.startY)>8)return;
 const r=$('world').getBoundingClientRect(),ray=new T.Raycaster();ray.setFromCamera(new T.Vector2((event.clientX-r.left)/r.width*2-1,1-(event.clientY-r.top)/r.height*2),camera);
 if(ray.intersectObject(street.poster).length){posterDialog.showModal();posterDialog.querySelector('button').focus();}
});
for(const type of ['pointerup','pointercancel','lostpointercapture'])$('world').addEventListener(type,()=>{cameraDrag=null;});
$('world').addEventListener('wheel',event=>{
  if(!S.started)return;
  event.preventDefault();zoomTarget=T.MathUtils.clamp(zoomTarget*Math.exp(-event.deltaY*.001),.65,4);
},{passive:false});
$('zoomIn').onclick=()=>{zoomTarget=T.MathUtils.clamp(zoomTarget*1.25,.65,4);};$('zoomOut').onclick=()=>{zoomTarget=T.MathUtils.clamp(zoomTarget/1.25,.65,4);};
$('resetView').onclick=()=>{azimuth=.16;elevation=Math.atan2(10,12);zoomTarget=S.view==='street'?.8:S.view==='station'?3.2:1.65;spin=0;$('orbit').textContent='Turn view';};

const closeup=document.createElement('iframe');closeup.title='Monica close-up';closeup.hidden=true;closeup.style.cssText='position:fixed;inset:0;width:100%;height:100%;border:0;z-index:30;background:#172b1d';document.body.append(closeup);
const closeupLink=document.querySelector('a[href="monica.html"]');
closeupLink.onclick=event=>{event.preventDefault();if(!S.started)return notice('Come inside first.');if(S.room!=='back')return requestTayer();if(S.transitionRoom||S.walking||S.toilet)return notice('Let us find your seat first.');hideDialogue();closeup.src='monica.html?embedded=1';closeup.hidden=false;};
window.addEventListener('message',event=>{if(event.origin!==location.origin||event.source!==closeup.contentWindow||event.data!=='monica:return')return;closeup.hidden=true;closeup.src='about:blank';S.escorted=true;focus('back');S.escorted=false;});

// Visit milestones are stored as data; callbacks and Three.js objects are never serialized.
const VISIT_KEY='tayer-3d-visit-v2';
function jolinRoom(room){S.jolinDestination=room;S.jolinStage='waiting';S.seatPending=false;S.seatChoice='bar';layouts.front.seat=[0,-.16];say(people.Alex,'Give me a second — make yourself comfortable.',[],true);moveRoom('front');saveVisit();}
function finishJolinWelcome(){S.jolinShotDone=true;S.jolinStage='done';saveVisit();if(S.jolinDestination==='back')requestTayer();else say(people.David,'Welcome back, Jolin. Enjoy your evening.',[['Take the menu',showMenu]]);}
const toastGlasses=new Map();
const toastBanner=document.createElement('div');toastBanner.id='toastBanner';toastBanner.hidden=true;stage.append(toastBanner);
function startJolinToast(){hideDialogue();S.toast={phase:'gather'};S.jolinStage='toast';
 for(const [name,target]of [['Alex',[-.9,-.1]],['David',[.8,-.05]],['Giovanni',[3.8,.4]],['Laura',[.2,-2.15]]]){
  const p=people[name];p.path=[];p.job={phase:'toast'};walk(p,target,()=>{});
 }
 saveVisit();}
function updateToast(){if(!S.toast)return;const names=['Alex','David','Laura','Giovanni'];if(S.toast.phase==='gather'){if(names.some(n=>people[n].path.length))return;S.toast={phase:'raise',start:S.time};toastBanner.hidden=false;toastBanner.textContent='Jolin · David · Laura · Giovanni: Cheers!   Alex: Salute!';}
 const age=S.time-S.toast.start;
 for(const p of [...names.map(n=>people[n]),player]){
  if(!toastGlasses.has(p.name)){const cup=glass(p.arms[1].hand,0,-.08,0,'mini-martini','#e2d8b3');toastGlasses.set(p.name,cup);}
  p.group.updateWorldMatrix(true,false);const y=age<2?1.36:1.48;
  pose(p,[null,p.group.localToWorld(new T.Vector3(.19,y,.26))]);toastGlasses.get(p.name).rotation.x=age>2?-.65:0;
 }
 if(age>5){for(const cup of toastGlasses.values())cup.parent.remove(cup);toastGlasses.clear();toastBanner.hidden=true;S.toast=null;if(S.cup){S.cup.mesh.parent.remove(S.cup.mesh);S.cup=null;}for(const name of names){const p=people[name];p.job={phase:'return'};if(!walk(p,p.home,()=>{p.job=null;}))p.job=null;}finishJolinWelcome();}}
function showServeCloseup(){S.serviceCloseup={start:S.time,zoom:zoomTarget,azimuth,elevation};zoomTarget=6.5;azimuth=0;elevation=.32;if(player)player.group.visible=false;for(const g of guests)if(g.room==='back')g.group.visible=false;document.body.classList.add('service-closeup');}
function endServeCloseup(){if(!S.serviceCloseup)return;zoomTarget=S.serviceCloseup.zoom;azimuth=S.serviceCloseup.azimuth;elevation=S.serviceCloseup.elevation;S.serviceCloseup=null;if(player)player.group.visible=true;for(const g of guests)g.group.visible=true;document.body.classList.remove('service-closeup');cameraTarget.set(S.room==='back'?20:0,1.1,0);}
const serveBack=document.createElement('button');serveBack.id='serveBack';serveBack.textContent='Back to the bar';serveBack.onclick=endServeCloseup;stage.append(serveBack);
let pabloNextWalk=18,pabloPath=[];
function updatePabloWalk(dt){if(S.pabloVisit||S.petUntil>S.time||S.toast||people.Alex.job?.phase?.startsWith('pablo'))return;
 if(!pabloPath.length&&S.time>pabloNextWalk){const toAlex=pablo.position.x>0;pabloPath=pathfind('front',[pablo.position.x,pablo.position.z],toAlex?[-3.85,4.05]:[4.85,3.6],[],.22)||[];pabloNextWalk=S.time+28;}
 if(pabloPath.length){const [x,z]=pabloPath[0],dx=x-pablo.position.x,dz=z-pablo.position.z,d=Math.hypot(dx,dz);if(d<dt*.9)pabloPath.shift();else{pablo.position.x+=dx/d*dt*.9;pablo.position.z+=dz/d*dt*.9;pablo.rotation.y=Math.atan2(dx,dz)-Math.PI/2;}pablo.position.y=Math.abs(Math.sin(S.time*12))*.015;}}
let lastVisitSave=0;
function updateVisitScenes(dt){updateToast();updatePabloWalk(dt);if(S.serviceCloseup&&S.time-S.serviceCloseup.start>8)endServeCloseup();if(S.time-lastVisitSave>2){saveVisit();lastVisitSave=S.time;}}
function saveVisit(){if(!S.started||S.left||!player)return;try{const order=S.order?{room:S.order.room,index:BAR_CONTENT[S.order.room].indexOf(S.order.drink),phase:S.order.phase,phaseTime:S.order.phaseTime,comp:S.order.comp}:null;
 localStorage.setItem(VISIT_KEY,JSON.stringify({version:2,name:S.name,avatar:S.avatar,regular:S.regular,isJolin:S.isJolin,room:S.room,seatPending:S.seatPending,seatChoice:S.seatChoice,water:S.water,ordered:S.ordered,paid:S.paid,visitedTayer:S.visitedTayer,jolinStage:S.jolinStage,jolinDestination:S.jolinDestination,jolinShotDone:S.jolinShotDone,frontSipped:S.frontSipped,roomSound:S.roomSound,order,cup:S.cup?{room:S.cup.room,remaining:S.cup.remaining,type:S.cup.mesh.children.some(m=>m.geometry?.type==='LatheGeometry')?'spirits':'rocks'}:null,zoom:zoomTarget,azimuth,elevation}));}catch{}}
function restoreVisit(){let v;try{v=JSON.parse(localStorage.getItem(VISIT_KEY));}catch{return;}if(!v||v.version!==2||!['front','back'].includes(v.room)||typeof v.name!=='string')return;
 $('name').value=v.name;$('adult').checked=true;S.avatar=Number.isInteger(v.avatar)?Math.max(0,Math.min(5,v.avatar)):0;$('enter').click();hideDialogue();roomDialogues.clear();queue.length=0;
 for(const key of ['regular','isJolin','seatChoice','ordered','paid','visitedTayer','jolinStage','jolinDestination','jolinShotDone','frontSipped'])if(v[key]!==undefined)S[key]=v[key];
 S.room=v.room;S.seatPending=!!v.seatPending;S.water={front:v.water?.front||null,back:v.water?.back||null};S.roomSound=v.roomSound||{front:true,back:true};S.sound=S.roomSound[S.room];
 layouts.front.seat=S.seatChoice==='table'?[0,.95]:[0,-.16];playerStools.front.position.z=layouts.front.seat[1];roots[S.room].attach(player.group);player.room=S.room;player.path=[];player.group.position.set(layouts[S.room].seat[0],0,layouts[S.room].seat[1]);setPlayerPose(!S.seatPending);S.walking=false;hostAsked=!!S.water.front;for(const [room,root]of Object.entries(roots))root.visible=room===S.room;cameraTarget.set(S.room==='back'?20:0,1.1,0);zoomTarget=T.MathUtils.clamp(Number(v.zoom)||1.65,.55,6);azimuth=Number(v.azimuth)||.16;elevation=T.MathUtils.clamp(Number(v.elevation)||.7,.3,1.25);
 if(v.cup){const room=S.room,home=playerGlass(room),mesh=glass(roots[room],...home,v.cup.type||'rocks');S.cup={mesh,room,home,remaining:Math.max(.02,Math.min(1,Number(v.cup.remaining)||1)),onHand:false};fillLevel(mesh,S.cup.remaining);}
 if(v.order&&!S.cup){const drink=BAR_CONTENT[v.order.room]?.[v.order.index];if(drink){S.order={drink,room:v.order.room,phase:Math.min(v.order.phase||0,drink.actions.length-1),phaseTime:v.order.phaseTime||0,comp:!!v.order.comp};if(v.order.room==='front'){lauraCup=glass(front,1.8,1.15,-1.3,drink.vessel);fillLevel(lauraCup,0);}}}
 if(S.seatPending){if(S.isJolin)say(people.Alex,'Welcome back, Jolin. Tayēr or Elementary?',[['Tayēr',()=>jolinRoom('back')],['Elementary',()=>jolinRoom('front')]]);else askAlexSeat();}
 else if(S.isJolin&&!S.jolinShotDone){if(['toast','cheers'].includes(S.jolinStage)){S.jolinStage='cheers';say(people.Laura,'Ready, Jolin? Cheers!',[['Cheers — all together!',startJolinToast]]);}else if(S.jolinStage==='osm'||S.water.front&&['greeting','waiting'].includes(S.jolinStage))say(people.David,'Shall we have a One Sip Martini?',[['Yes — cheers!',()=>{S.jolinStage='pour';order(BAR_CONTENT.front[0],true);}],['Not this time',finishJolinWelcome]]);else if(!S.water.front){hostAsked=true;schedule('David',()=>say(people.David,'Ciao, Jolin! How are you?',[['Good, thanks!',()=>say(people.David,'Still or sparkling?',waterChoices())],['A long day.',()=>say(people.David,'Make yourself comfortable. Still or sparkling?',waterChoices())]]));}}
 music();notice('Welcome back — your evening is saved.');}
window.addEventListener('pagehide',saveVisit);document.addEventListener('visibilitychange',()=>{if(document.hidden)saveVisit();});
// Fullscreen/orientation are requested only from a user gesture; portrait remains available.
const screenButton=document.createElement('button');screenButton.textContent='Fill screen';screenButton.id='fillScreen';document.querySelector('nav').prepend(screenButton);screenButton.onclick=async()=>{try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();await screen.orientation?.lock?.('landscape');}catch{}resize();};
const portraitButton=document.createElement('button');portraitButton.textContent='Allow portrait';portraitButton.onclick=()=>{screen.orientation?.unlock?.();if(document.fullscreenElement)document.exitFullscreen()?.catch(()=>{});};document.querySelector('nav').append(portraitButton);
const touchPoints=new Map();let pinchDistance=0;
$('world').addEventListener('pointerdown',e=>{touchPoints.set(e.pointerId,[e.clientX,e.clientY]);if(touchPoints.size===2){cameraDrag=null;const [a,b]=[...touchPoints.values()];pinchDistance=Math.hypot(a[0]-b[0],a[1]-b[1]);}});
$('world').addEventListener('pointermove',e=>{if(!touchPoints.has(e.pointerId))return;touchPoints.set(e.pointerId,[e.clientX,e.clientY]);if(touchPoints.size===2){cameraDrag=null;const [a,b]=[...touchPoints.values()],distance=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pinchDistance>0)zoomTarget=T.MathUtils.clamp(zoomTarget*distance/pinchDistance,.55,6);pinchDistance=distance;}});
for(const type of ['pointerup','pointercancel','lostpointercapture'])$('world').addEventListener(type,e=>{touchPoints.delete(e.pointerId);pinchDistance=0;});
restoreVisit();
