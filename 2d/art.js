// Pixel environments adapted from the preserved Canvas study. Phaser owns runtime objects.
window.makePixelArt=function(key){const c=document.createElement('canvas');c.width=640;c.height=400;const g=c.getContext('2d');g.imageSmoothingEnabled=false;let t=0,room=key,shakeTime=0,mixStep=0,kitchenPrep=false;
function rect(x,y,w,h,color){g.fillStyle=color;g.fillRect(Math.round(x),Math.round(y),w,h)}function text(s,x,y,size=8,color='#dddac3'){g.fillStyle=color;g.font=size+'px monospace';g.fillText(s,x,y)}
function person(x,y,color,name,staff=false){const bob=Math.sin(t*3+x)*.6;rect(x-6,y-26+bob,12,9,'#302a23');rect(x-5,y-23+bob,10,10,'#c49c75');rect(x-7,y-13,14,15,staff?'#20231e':color);rect(x-11,y-11,4,12,'#b68d6a');rect(x+7,y-11,4,12,'#b68d6a');rect(x-6,y+2,5,9,'#34382f');rect(x+1,y+2,5,9,'#34382f');rect(x-7,y+10,6,3,'#171e1a');rect(x+1,y+10,6,3,'#171e1a');if(staff){rect(x-4,y-5,8,6,'#df582b');rect(x-2,y-9,3,9,'#efae4e');rect(x+3,y-7,2,7,'#e76c2d');}if(name){const w=name.length*5+8;rect(x-w/2,y-41,w,11,'#20271fe8');text(name,x-w/2+4,y-33,8)}}
function glass(x,y,kind=0){rect(x,y,8,8,'#bad2c1');rect(x+1,y+2,6,4,kind?'#d49140':'#ddd9ab');rect(x+3,y+8,2,4,'#d2ddd0');rect(x+1,y+12,6,2,'#a9bdaa')}
function bottle(x,y,color){rect(x+2,y,3,4,'#d1c2a0');rect(x,y+4,7,15,color);rect(x+1,y+9,5,6,'#dfd5b1')}
function stool(x,y){rect(x-9,y,18,6,'#b39b76');rect(x-7,y+6,3,15,'#252926');rect(x+4,y+6,3,15,'#252926');rect(x-5,y+15,10,2,'#303632')}
function wood(x,y,w,h){rect(x,y,w,h,'#bc9c72');rect(x,y,w,3,'#d0b28b');for(let k=6;k<h;k+=7)rect(x+3,y+k,w-6,1,'#a88b66')}
function drinkGlass(x,y,d){if(d.name.includes('Martini')){rect(x,y,12,2,'#d9e1d5');rect(x+2,y+2,8,3,'#c8d2bb');rect(x+4,y+5,4,2,'#d6dec7');rect(x+5,y+7,2,6,'#d3dfd6');rect(x+2,y+13,8,2,'#bac8ba');rect(x+8,y+1,2,2,'#829748')}else{rect(x,y,11,12,'#d1ded1');rect(x+1,y+3,9,7,d.name.includes('Yuzu')?'#e6ce73':'#b56635');rect(x+2,y+2,3,3,'#e0e2cb');rect(x+8,y-2,3,4,'#e7b755')}}
function hex(x,y,r,fill,stroke){g.beginPath();for(let i=0;i<6;i++){const a=Math.PI/3*i;const px=Math.round(x+Math.cos(a)*r),py=Math.round(y+Math.sin(a)*r);i?g.lineTo(px,py):g.moveTo(px,py)}g.closePath();g.fillStyle=fill;g.fill();g.strokeStyle=stroke;g.lineWidth=1;g.stroke()}
function sink(x,y){rect(x,y,75,46,'#bbc6bd');rect(x+7,y+6,61,34,'#5e7168');rect(x+14,y+12,47,23,'#83988d');rect(x+50,y-20,5,33,'#bdc9c0');rect(x+32,y-22,23,5,'#d0d6ca');rect(x+31,y-22,4,14,'#b3c3ba');rect(x+22,y+21,8,4,'#4d6054')}
function renderWorkbench(){rect(0,0,640,400,'#24332c');rect(0,0,640,65,'#536a72');for(let x=0;x<640;x+=23)for(let y=0;y<65;y+=15)rect(x+1,y+1,21,13,'#70878d');wood(12,69,616,14);rect(34,98,572,184,'#9aadb4');rect(40,104,560,170,'#c0cbcf');rect(40,269,560,18,'#536b73');rect(40,269,560,2,'#e0e8de');for(let x=55;x<600;x+=40)rect(x,278,2,8,'#344d56');sink(478,148);for(let r=0;r<4;r++)for(let col=0;col<7;col++){let x=100+col*48+(r%2?24:0),y=134+r*34;hex(x,y,27,'#8b9fa6','#c4d0c4');hex(x,y,22,'#b1c1c7','#526b76');if(col<2){hex(x,y,18,'#738d84','#c3d6c9');for(let j=0;j<5;j++)rect(x-12+(j%3)*8,y-10+Math.floor(j/3)*9,6,6,'#c9e0d6')}else if(col>4){bottle(x-9,y-13,'#425539');bottle(x+3,y-8,'#ad8652')}else{rect(x-7,y-12,3,22,'#d4d8bd');rect(x-11,y+8,11,3,'#aab9a6')}}
const sx=320+((shakeTime>0)?Math.sin(t*35)*12:0),sy=185+((shakeTime>0)?Math.cos(t*35)*6:0);if(mixStep>=1){rect(sx-13,sy-28,26,54,'#d2d9ce');rect(sx-9,sy-35,18,8,'#aab9ac');rect(sx-10,sy+24,20,4,'#869d8d');rect(sx-10,sy-15,3,31,'#ecede0')}if(mixStep>=2)bottle(410,105,'#ae9860');if(mixStep>=4)drinkGlass(447,221,{name:'Practice Citrus Shake'});text('BEHIND BARS / TAYĒR HEXAGONAL SYSTEM',135,92,9,'#e1dbc1');text('ICE WELL',68,290,8);text('BOTTLES + GARNISH',347,290,8);text('SHARED SINK',481,213,8);text('VISUAL SEQUENCE / NOT A VERIFIED RECIPE',191,305,7,'#a6bba4');if(shakeTime>0)shakeTime=Math.max(0,shakeTime-.016)}
function renderKitchen(){rect(0,0,640,400,'#25352c');rect(0,0,640,143,'#a3aaa0');for(let x=0;x<640;x+=24)for(let y=0;y<143;y+=16)rect(x+1,y+1,22,14,'#c0c6b8');rect(23,49,594,10,'#768777');for(let i=0;i<13;i++){rect(34+i*42,25,25,22,'#6d7f63');rect(38+i*42,30,17,10,'#b8c7a9')}rect(26,152,585,81,'#8b9d90');rect(26,148,585,8,'#d1d7c7');sink(499,155);rect(115,156,142,42,'#bfab74');for(let i=0;i<8;i++){rect(127+i*15,165,10,10,kitchenPrep?'#d2b351':'#688b53');rect(130+i*15,167,3,3,'#f0d397')}rect(321,165,117,25,'#3d5042');rect(330,168,24,20,'#191f1b');rect(368,168,24,20,'#191f1b');text('KITCHEN / FRYING + PLATING',166,97,10,'#364b39');text('CITRUS BOARD',139,216,8);text('PASS',334,216,8)}

if(key==='workbench')renderWorkbench();else if(key==='kitchen')renderKitchen();else{rect(0,0,640,320,room==='front'?'#9a9b91':'#62665d');rect(0,0,640,152,room==='front'?'#aaa99c':'#777b6e');
for(let y=153;y<320;y+=18){rect(0,y,640,1,room==='front'?'#85877f':'#53594e');for(let x=(y%36?0:30);x<640;x+=60)rect(x,y,1,18,'#85887b')}
// Raw concrete ceiling and exposed industrial ducting.
rect(0,0,640,23,'#71766c');rect(0,11,640,11,'#9a9d94');for(let x=0;x<640;x+=35)rect(x,11,2,11,'#646d62');rect(457,22,9,99,'#92978b');
if(room==='front'){
// Street-facing glazing, window ledge and central communal oak table.
rect(16,28,197,142,'#343e38');for(let j=0;j<4;j++){rect(22+j*47,34,42,125,'#687a74');rect(22+j*47,84,42,3,'#34443b')}for(let k=0;k<22;k++)rect(26+(k*29)%174,36+(t*28+k*19)%119,1,5,'#9cae9c');text('OLD STREET',37,153,8,'#d7dac9');wood(15,161,199,8);stool(55,179);stool(120,179);stool(185,179);
// Steel RTD station, tap bank, oak cladding and tiled backsplash.
rect(242,43,204,56,'#426c52');for(let x=242;x<446;x+=15)for(let y=43;y<99;y+=14){rect(x+1,y+1,13,12,(x+y)%2?'#577b60':'#3d654b')}rect(246,59,193,5,'#c1c6b6');for(let x=265;x<393;x+=23){rect(x,64,4,21,'#d8d9c9');rect(x-2,63,8,4,'#222f28');rect(x+1,82,8,3,'#b3baad')}text('ON TAP',275,49,7,'#e0e3ce');wood(235,133,215,35);rect(235,128,215,8,'#c7cdc2');rect(235,132,215,2,'#e0ded0');for(let x=245;x<450;x+=25)rect(x,139,1,26,'#987f60');
rect(402,90,35,34,'#bfc5b7');rect(406,93,12,18,'#e0d176');rect(421,93,12,18,'#b4c388');rect(406,113,27,6,'#475448');rect(410,119,3,8,'#cdd4c8');text('SLUSH',404,86,7,'#364237');
rect(484,29,141,143,'#96998b');rect(500,44,94,120,'#333e32');rect(492,29,11,143,'#b0b0a1');rect(594,29,20,143,'#b0b0a1');for(let k=0;k<18;k++)rect(489+(k*11)%124,32+(k*23)%134,3,1,'#8d9387');text('TAYĒR',516,82,13);text('REGISTER WITH DAVID',507,102,6,'#b3c2a4');
for(const x of [270,390])stool(x,185);stool(450,275);for(const x of [106,160,214,312,376])stool(x,263);wood(78,214,345,29);rect(88,243,7,28,'#776a51');rect(406,243,7,28,'#776a51');rect(80,242,343,4,'#8e7759');
wood(526,213,27,6);rect(534,207,17,5,'#e1e0cf');rect(531,219,4,26,'#676b5d');text('ELEMENTARY',240,34,11,'#344233');
}else{
// Kitchen is the first space on entering from Elementary; main station deeper inside.
rect(0,0,640,320,'#58675b');rect(0,0,640,105,'#788777');for(let y=106;y<320;y+=16){rect(0,y,640,1,'#6c7c6c');for(let x=0;x<640;x+=48)rect(x,y,1,16,'#455949');}
rect(16,47,162,142,'#48585d');for(let x=20;x<174;x+=14)for(let y=50;y<118;y+=12)rect(x,y,12,10,'#aab4b4');rect(25,48,137,8,'#424b4f');rect(36,60,113,23,'#758288');rect(29,133,143,48,'#7d898b');rect(29,130,143,6,'#ced4d1');rect(40,134,58,26,'#34464d');rect(46,140,21,16,'#b68b46');rect(72,140,21,16,'#b68b46');rect(50,135,30,3,'#d4dbd6');rect(124,141,35,24,'#c6b287');rect(128,145,17,9,'#edf0df');rect(131,147,4,3,'#ad874e');rect(138,147,4,3,'#ad874e');text('FRY / PLATE',34,111,7,'#e4dfc7');
rect(23,194,152,13,'#c0c8c4');rect(23,207,152,6,'#536267');rect(35,213,4,35,'#34464a');rect(160,213,4,35,'#34464a');for(const x of [55,105,155])stool(x,234);for(const x of [42,83,125]){rect(x,195,15,3,'#e8e7d6');rect(x+5,193,5,2,'#bb9356');}text('KITCHEN COUNTER',31,183,6,'#e0d9be');
rect(183,31,51,148,'#8a9685');rect(186,34,45,141,'#71816a');rect(183,175,51,4,'#3b5141');rect(193,84,32,73,'#39494d');rect(196,88,26,65,'#788788');text('WC',201,106,7,'#e4ddbd');rect(217,122,2,2,'#d0b883');
rect(253,30,371,64,'#395b45');for(let x=255;x<624;x+=18)for(let y=32;y<94;y+=13)rect(x,y,16,11,'#51725a');rect(267,79,345,5,'#c6ceca');for(let i=0;i<12;i++)bottle(275+i*22,54,['#536365','#91774f','#40545a'][i%3]);text('TAYĒR',360,25,12,'#e7dfbd');
// Enlarged steel island, with the hexagonal Behind Bars system centered.
rect(288,95,274,61,'#526b56');rect(260,156,28,78,'#9a8e6e');rect(562,156,28,78,'#9a8e6e');rect(260,214,330,23,'#c1b28c');rect(260,234,330,5,'#4b5f66');rect(288,156,274,58,'#334b3d');// Raised station: steel top, vertical front face, recessed wells and contact shadow.
rect(349,163,150,46,'#243d34');rect(352,157,144,36,'#a6b9ba');rect(352,193,144,8,'#526a70');rect(352,193,144,2,'#d5ded9');rect(493,159,3,34,'#728e92');
for(let row=0;row<2;row++)for(let col=0;col<6;col++)hex(364+col*21+(row%2?5:0),166+row*16,10,'#b8c6c5','#66828a');
rect(357,159,25,23,'#c9d4d0');rect(360,163,19,16,'#4e6870');rect(363,165,6,5,'#d6e3df');rect(370,171,6,5,'#b8d1cc');rect(463,159,27,23,'#c9d4d0');rect(466,163,21,16,'#4a656d');rect(481,155,2,12,'#d3ded6');rect(476,155,6,2,'#d3ded6');
// Service counter reads as a thick object with cladding and a foot rail.
rect(260,214,330,16,'#b9b294');rect(260,214,330,2,'#e7e4cf');rect(260,230,330,9,'#776d54');for(let x=272;x<590;x+=20)rect(x,232,1,6,'#564f3d');rect(270,240,310,2,'#849596');

for(const x of [290,345,400,455,510])stool(x,270);stool(248,176);stool(612,176);stool(229,270);rect(239,243,22,4,'#b5b19a');rect(249,247,3,15,'#536267');text('BEHIND BARS / TAYĒR',341,226,7,'#34494f');text('← ELEMENTARY',18,294,6,'#d5d5be');



}

if(key==='front'){rect(452,302,55,18,'#26382d');rect(455,304,49,3,'#b6a786');rect(457,310,46,2,'#556652');text('ENTRANCE',457,319,6,'#d9d0aa');rect(8,204,48,77,'#293c32');rect(12,209,40,52,'#a9bdb3');rect(15,212,34,44,'#526e62');for(let i=0;i<4;i++){bottle(17+i*8,217,'#8d6140');bottle(17+i*8,242,'#526f48')}rect(12,262,40,4,'#c0c7b5');text('RTD / WINE',11,276,6,'#d5cdb3');}
}
// Deterministic surface wear, fasteners and warm industrial practical lights.
if(key==='front'||key==='back'||key==='kitchen'){
for(let i=0;i<800;i++){const x=(i*97+13)%640,y=(i*53+19)%320;g.globalAlpha=.09;rect(x,y,i%3+1,1,i%2?'#eee0c0':'#142521');}g.globalAlpha=1;
for(let x=45;x<640;x+=145){rect(x,23,2,23,'#252d28');rect(x-10,44,22,4,'#252d28');rect(x-7,48,16,3,'#f4c380');g.globalAlpha=.08;rect(x-26,51,54,75,'#f8c273');g.globalAlpha=1;}
for(let x=10;x<640;x+=55){rect(x,13,2,2,'#dde0cf');rect(x+1,15,2,1,'#424c44');}
}
if(key==='front'){
const date=new Date(),month=Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',month:'numeric'}).format(date)),season=month>=3&&month<=5?'spring':month>=6&&month<=8?'summer':month>=9&&month<=11?'autumn':'winter';
rect(22,34,183,122,season==='winter'?'#7d8b94':season==='summer'?'#849795':'#827b77');
for(let i=0;i<5;i++){const x=24+i*38;rect(x,62,32,69,['#66645e','#71655b','#586963'][i%3]);for(let j=0;j<3;j++)for(let k=0;k<4;k++){rect(x+4+j*9,68+k*13,5,8,'#343d3d');rect(x+4+j*9,69+k*13,2,5,'#b59b75');}}
rect(22,139,183,17,'#555f5e');rect(22,136,183,3,'#b3aaa0');rect(59,130,35,9,'#886449');rect(65,125,21,7,'#986e4e');rect(67,126,8,5,'#b2b8b3');rect(78,126,7,5,'#b2b8b3');rect(63,137,6,5,'#292e2d');rect(84,137,6,5,'#292e2d');
rect(174,86,4,56,'#4c5040');for(let i=0;i<50;i++){const x=151+(i*13)%48,y=55+(i*19)%49;rect(x,y,5,4,season==='autumn'?['#b87b3a','#d29d4c','#a56332'][i%3]:season==='winter'?'#afb7b0':['#71834d','#869756'][i%2]);}if(season==='autumn')for(let i=0;i<18;i++)rect(25+(i*31)%175,146+(i*7)%10,3,1,'#d6a052');
for(let j=0;j<4;j++){rect(19+j*47,30,4,132,'#303e38');rect(22+j*47,85,42,3,'#34443b');}text('OLD STREET',28,153,7,'#e7dcc5');
}
return c;};
// Higher-detail sprites keep the existing 32 x 52 world footprint.
window.makePersonArt=function(name){
const staff={Alex:['#302f2b','cap','#e2c6ac','tattoo'],David:['#544534','receding','#cfaa83','beard'],Laura:['#332c25','curls','#d5af90','glasses'],Giovanni:['#272a25','swept','#c99b78','beard'],Monica:['#39322b','bun','#dbb894'],Cheng:['#202a24','swept','#d2ac80'],Frances:['#d6b86f','braids','#debb98','glasses'],Steven:['#3b3029','beanie','#be8f6b','beard'],Wang:['#3a3b32','bald','#c5a17e']};
const looks=[
['#252126','bob','#79513c','leather','#22282c','#759ab0'],
['#ae8551','swept','#e1bd97','shirt','#e1d7bc','#51575b'],
['#28211f','curls','#a87957','dress','#8c4b62','#2c3438'],
['#39342c','bun','#d7b18d','blazer','#697951','#d0bea1'],
['#b9b1a6','crop','#6e4834','knit','#c77947','#373f47'],
['#26202b','long','#dcb995','dress','#3d747b','#233b3c'],
['#36342c','cap','#ab7954','bomber','#596c84','#d3c8a8'],
['#b98554','curls','#edc9a1','shirt','#9985a5','#3c4352'],
['#2b2620','braids','#76503b','blazer','#b69971','#463b38'],
['#aa8e68','bob','#d3a582','leather','#3e3835','#ad9b75'],
['#30312a','short','#b18d68','knit','#a9b19d','#4c606c'],
['#6f3c34','long','#e3bc9b','dress','#b46742','#354940']];
const guest=name.startsWith('guest'),i=Number(name.slice(5))||0,v=guest?[...looks[i%looks.length]]:staff[name]||staff.Wang;
if(guest&&i>=12){v[0]=looks[(i+3)%12][0];v[1]=looks[(i+5)%12][1];v[2]=looks[(i+7)%12][2];}const hair=v[0],style=v[1],skin=v[2],outfit=guest?v[3]:'tee',shirt=guest?v[4]:'#191e22',pants=guest?v[5]:'#363d40';
const c=document.createElement('canvas');c.width=64;c.height=104;const g=c.getContext('2d');g.imageSmoothingEnabled=false;
const r=(x,y,w,h,color)=>{g.fillStyle=color;g.fillRect(x*2,y*2,w*2,h*2)};
r(9,2,14,12,hair);r(10,7,12,12,skin);r(8,18,16,18,shirt);r(5,19,4,14,skin);r(23,19,4,14,skin);r(10,36,5,12,pants);r(17,36,5,12,pants);r(8,47,7,3,'#171e22');r(17,47,7,3,'#171e22');r(12,12,2,2,'#29262a');r(19,12,2,2,'#29262a');r(15,17,4,1,'#94694e');
if(style==='bob'||style==='long'||style==='braids'){r(7,4,4,style==='bob'?19:29,hair);r(21,4,4,style==='bob'?19:29,hair);r(9,3,13,4,hair);if(style==='braids')for(let k=8;k<32;k+=4){r(7,k,1,2,'#9b7951');r(24,k,1,2,'#9b7951');}}
if(style==='bun'){r(7,4,5,6,hair);r(20,1,7,8,hair);r(21,6,4,12,hair);r(10,3,12,5,hair);}
if(style==='curls'){for(let k=0;k<8;k++)r(7+k*2,2+k%3,4,5,hair);if(!guest){for(let k=0;k<5;k++){r(6,7+k*3,5,4,hair);r(22,7+k*3,5,4,hair);}}}
if(style==='receding'){r(11,2,10,8,skin);r(10,4,2,5,hair);r(21,4,2,5,hair);}
if(style==='bald'){r(9,2,14,12,skin);r(10,2,12,2,'#d8b997');r(7,19,18,18,shirt);r(4,20,4,13,skin);r(24,20,4,13,skin);}if(style==='swept'){r(10,0,12,6,hair);r(13,0,9,2,'#82715b');}
if(style==='cap'){r(9,1,15,8,'#475b4c');r(18,7,10,3,'#798672');r(14,3,4,3,'#bdb294');}
if(style==='beanie'){r(8,1,16,8,'#a09a85');r(8,8,16,3,'#77735e');}
if(name==='Alex'){for(let k=15;k<24;k+=2){r(7,k,1,1,'#d6b679');r(24,k,1,1,'#d6b679');}r(8,24,3,1,'#d6b679');r(21,24,3,1,'#d6b679');}if(v[3]==='beard'){r(10,15,12,5,hair);r(12,15,8,2,skin);r(14,17,4,1,'#d5ac85');}
if(name==='Alex'||v[3]==='glasses'||guest&&i%4===0){r(10,11,6,1,'#bea579');r(17,11,6,1,'#bea579');r(10,12,1,3,'#393d35');r(15,12,1,3,'#393d35');r(17,12,1,3,'#393d35');r(22,12,1,3,'#393d35');r(15,12,3,1,'#393d35');}
if(guest){
const month=Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',month:'numeric'}).format(new Date()));const cold=month>=9||month<=2;if(cold){r(5,19,4,13,shirt);r(23,19,4,13,shirt);r(9,19,14,3,'#c4b091');r(18,20,3,10,'#c4b091');}
if(outfit==='dress'){r(8,32,16,11,shirt);r(6,39,20,4,shirt);r(14,21,3,1,'#deb97f');}
if(outfit==='leather'||outfit==='blazer'||outfit==='bomber'){r(5,19,4,13,shirt);r(23,19,4,13,shirt);r(14,19,4,15,'#dfd4bf');r(12,19,2,6,'#b6b5a5');r(19,19,2,6,'#b6b5a5');r(11,28,2,1,'#d8c799');r(21,28,2,1,'#d8c799');}
if(outfit==='shirt'){r(5,19,4,7,shirt);r(23,19,4,7,shirt);r(15,19,1,15,'#aba58f');for(let k=22;k<33;k+=4)r(16,k,1,1,'#544e47');}
if(outfit==='knit')for(let k=21;k<35;k+=3)r(9,k,14,1,'#c8bda2');
r(10,35,12,1,'#24272a');if(i%3===0){r(22,27,2,10,'#dcb678');r(24,32,5,7,'#b27648');}if(i%3===1){r(7,14,1,3,'#e0bd6d');r(24,14,1,3,'#e0bd6d');}if(i%3===2){r(5,29,4,2,'#e0bb83');r(8,48,7,2,'#e1d5b4');r(17,48,7,2,'#e1d5b4');}
}else{
r(5,19,4,8,shirt);r(23,19,4,8,shirt);
// Hand-pixelled flame wordmark derived from the user's black tee photo.
const glyphs=['111,010,010,010,010','010,101,111,101,101','101,101,010,010,010','111,100,110,100,111','110,101,110,101,101'];
const bx=16,by=49;for(let k=0;k<5;k++){const rows=glyphs[k].split(',');rows.forEach((row,y)=>[...row].forEach((on,x)=>{if(on==='1'){g.fillStyle=y<2?'#ffe08b':y<4?'#f4b349':'#ee7841';g.fillRect(bx+k*7+x*2,by+y*2,2,2);}}));}
for(let k=0;k<18;k++){const x=bx+k*2,height=2+(k*7)%9;g.fillStyle=k%3?'#f6b447':'#e56b37';g.fillRect(x,by-height,2,height);g.fillStyle='#ffe098';g.fillRect(x,by-height,1,2);}
g.fillStyle='#efba55';g.fillRect(bx+22,by-3,5,1);g.fillStyle='#ac4c3d';g.fillRect(18,62,29,1);
if(v[3]==='tattoo'){r(5,28,3,2,'#5b6258');r(6,32,2,2,'#5b6258');r(24,28,2,5,'#5b6258');}
}if(name==='Alex'){r(8,35,8,14,'#343b39');r(17,35,8,14,'#343b39');r(8,41,3,3,'#56615b');r(22,41,3,3,'#56615b');r(7,49,11,2,'#c6cbc0');r(17,49,11,2,'#c6cbc0');r(4,27,5,10,skin);r(23,27,5,10,skin);for(let k=0;k<7;k++){r(4+(k%3),28+k,2,1,'#53544c');r(24+(k%2),28+k,2,1,'#4d514b');}r(23,12,2,4,skin);r(14,17,6,1,'#8f7564');r(10,16,2,3,'#c3a78c');r(21,16,2,3,'#c3a78c');}if(name==='Frances'){r(11,10,3,1,'#654b37');r(18,10,3,1,'#654b37');r(11,12,2,1,'#38515a');r(19,12,2,1,'#38515a');r(15,16,4,1,'#a86763');r(9,15,2,1,'#d8a28b');r(21,15,2,1,'#d8a28b');r(8,5,2,7,'#edce88');r(22,4,2,7,'#f2d79a');}return c;};
window.makeDogArt=function(){const c=document.createElement('canvas');c.width=52;c.height=40;const g=c.getContext('2d');const r=(x,y,w,h,color)=>{g.fillStyle=color;g.fillRect(x,y,w,h)};r(8,11,30,21,'#9e642d');r(10,8,29,24,'#bd813d');r(25,5,19,24,'#c99453');for(let i=0;i<28;i++){const x=6+(i*7)%37,y=8+(i*13)%25;r(x,y,4,3,['#d2a565','#b47a37','#d8b27a'][i%3]);}r(29,1,5,9,'#95602e');r(39,2,5,8,'#95602e');r(30,4,2,5,'#d3a062');r(40,5,2,4,'#d3a062');r(31,13,3,3,'#29261f');r(41,13,3,3,'#29261f');r(35,18,5,3,'#342719');r(36,23,3,3,'#d39086');r(1,5,11,13,'#cba061');r(2,2,9,7,'#d8b77e');r(0,9,4,5,'#e1be84');r(12,31,5,6,'#955e2a');r(30,31,5,6,'#955e2a');return c;};
// Pixel interpretation of Google Street View, 152 Old St, imagery dated September 2025.
window.makeStreetArt=function(){const c=document.createElement('canvas');c.width=640;c.height=320;const g=c.getContext('2d');const r=(x,y,w,h,color)=>{g.fillStyle=color;g.fillRect(x,y,w,h)};const month=Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',month:'numeric'}).format(new Date()));r(0,0,640,320,'#657678');r(0,0,640,13,'#a6c8ce');r(0,13,574,216,'#bbbeb5');r(0,12,574,30,'#d4d5c9');r(0,93,574,14,'#d4d5c9');for(let bay=0;bay<6;bay++){const x=7+bay*94;r(x,15,83,69,'#263a3d');r(x+3,18,77,63,'#758b90');r(x+39,18,3,63,'#334448');r(x+3,50,77,2,'#394c4d');r(x+5,72,73,8,'#273f3e');for(let j=0;j<17;j++)r(x+(j*19)%78,55+(j*11)%25,4,3,['#3c5544','#4c6250','#607363'][j%3]);r(x,111,83,67,'#273b3b');r(x+3,114,77,53,'#48665f');r(x+39,115,3,57,'#283e3c');r(x+7,165,69,6,'#394c48');r(x-4,178,91,12,'#3a4948');r(x-10,188,101,6,'#2c3c3c');r(x+4,194,76,34,'#28443d');r(x+40,195,3,31,'#283937');r(x+6,221,70,3,'#a58c62');r(x+81,108,8,122,'#d0d0c2');}
// Neighbouring pale stone facade, narrow ground-floor glazing.
r(574,0,66,230,'#c7c3ad');for(let x=581;x<637;x+=27){r(x,26,20,65,'#39494a');r(x,103,20,58,'#445452');r(x,176,20,52,'#384d47');}r(570,94,70,7,'#d6d0b8');r(570,165,70,8,'#d6d0b8');
r(0,230,640,41,'#b6b5a4');for(let x=0;x<640;x+=24)r(x,234,1,35,'#989f93');r(0,270,640,4,'#555f58');r(0,275,640,21,'#927b6c');r(0,296,640,24,'#6f7777');r(0,300,640,2,'#969c92');
// Open pavement: no temporary hoarding, fence or long planter barriers.
for(const x of [82,288]){r(x,246,15,17,'#6b745c');r(x+2,244,11,3,'#b2b69a');for(let i=0;i<10;i++)r(x-2+(i*7)%21,231+(i*11)%13,4,4,'#74875a');}
for(const x of [407,446,479]){g.strokeStyle='#bdc5b7';g.lineWidth=1;g.beginPath();g.arc(x,253,10,0,Math.PI*2);g.arc(x+24,253,10,0,Math.PI*2);g.stroke();g.beginPath();g.moveTo(x,253);g.lineTo(x+11,239);g.lineTo(x+24,253);g.lineTo(x,253);g.lineTo(x+17,251);g.lineTo(x+11,239);g.stroke();r(x+9,237,7,2,'#253834');r(x+21,233,2,14,'#596b65');}
r(458,18,3,252,'#384745');r(454,175,11,22,'#d2b64c');r(456,178,7,8,'#f0e6b9');g.fillStyle='#263c39';g.font='5px monospace';g.fillText('20',457,184);r(542,244,3,22,'#35433c');r(623,241,3,25,'#35433c');g.fillStyle='#e2d5b5';g.font='7px monospace';g.fillText('tayēr + elementary',319,220);g.fillStyle='#273e38';g.font='8px monospace';g.fillText('152 OLD STREET',17,257);return c;};
window.makeSeatedPersonArt=function(name){const source=makePersonArt(name),c=document.createElement('canvas');c.width=64;c.height=104;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(source,0,0,64,72,0,10,64,72);g.fillStyle='#42494b';g.fillRect(19,81,13,7);g.fillRect(34,81,13,7);g.fillRect(26,86,6,9);g.fillRect(41,86,6,9);g.fillStyle='#171e22';g.fillRect(26,94,12,5);g.fillRect(41,94,12,5);return c;};

window.makeMonicaSideArt=function(){const c=document.createElement('canvas');c.width=64;c.height=104;const g=c.getContext('2d');const r=(x,y,w,h,k)=>{g.fillStyle=k;g.fillRect(x,y,w,h)};r(11,75,24,5,'#8a8c76');r(13,80,4,19,'#343d37');r(29,80,4,19,'#343d37');r(17,8,19,25,'#dbb894');r(12,8,10,17,'#39322b');r(11,2,19,10,'#39322b');r(8,3,9,9,'#39322b');r(31,17,8,5,'#dbb894');r(31,15,3,2,'#29352e');r(31,26,4,1,'#a87f69');r(15,34,21,31,'#242b27');r(17,63,18,16,'#30382f');r(29,70,14,8,'#30382f');r(38,76,5,16,'#30382f');r(37,91,13,4,'#252e28');r(24,43,13,9,'#242b27');r(34,46,19,5,'#dbb894');r(33,56,20,5,'#dbb894');r(18,37,12,4,'#edb451');r(19,42,9,9,'#ef9b43');return c;};

// Hand-drawn portrait studies using the user's confirmed identifying features.
// Stylised interpretations; not a claim of a verified photographic likeness.
window.makeStaffPortrait=function(name){
const looks={Alex:['#ddbaa3','#302e30','cap'],David:['#dab599','#514d49','receding'],Laura:['#d5b096','#373138','curls'],Giovanni:['#cda489','#292b31','swept'],Frances:['#e2bfa7','#cfb879','braids'],Monica:['#ddba9f','#36313a','bun'],Cheng:['#d5ae94','#252c34','swept']};
const [skin,hair,style]=looks[name],c=document.createElement('canvas');c.width=96;c.height=112;const g=c.getContext('2d');g.imageSmoothingEnabled=false;
const r=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h)};
r(0,0,96,112,'#192930');for(let y=8;y<112;y+=12)r(3,y,90,1,'#253a42');r(7,7,82,98,'#293f47');r(10,10,76,70,'#354c54');r(19,85,59,27,'#131e27');r(13,94,70,18,'#19242c');r(38,62,20,24,skin);r(27,20,42,50,skin);r(24,35,5,21,skin);r(68,35,5,21,skin);r(29,62,8,7,'#c39983');r(59,62,7,7,'#c39983');r(33,40,10,3,hair);r(54,40,9,3,hair);r(36,46,4,4,'#25343d');r(56,46,4,4,'#25343d');r(47,46,4,12,'#bf947e');r(41,63,15,2,name==='Monica'?'#936d68':'#a9766b');r(32,27,3,9,'#ebcdb7');
if(style==='cap'){r(23,15,49,15,'#18252f');r(22,26,57,6,'#101c26');r(57,23,14,2,'#4c6068');r(36,66,24,4,'#a28b80');}
if(style==='receding'){r(25,21,7,16,hair);r(66,22,5,16,hair);r(38,17,24,3,'#bd9e8c');r(33,67,31,5,'#77706a');}
if(style==='swept'){r(24,15,47,14,hair);r(23,25,9,14,hair);r(62,26,8,10,hair);r(33,17,23,3,'#424753');if(name==='Giovanni')r(34,65,27,7,'#68564f');}
if(style==='bun'){r(24,16,47,15,hair);r(22,26,8,26,hair);r(65,25,7,27,hair);r(61,8,16,16,hair);r(27,20,6,7,'#54515c');}
if(style==='braids'){r(24,15,47,14,hair);r(22,26,7,49,hair);r(66,26,7,49,hair);for(let y=30;y<76;y+=7){r(21,y,9,3,'#a89365');r(66,y,8,3,'#a89365');}r(21,74,9,3,'#1b2e38');r(66,74,9,3,'#1b2e38');}
if(style==='curls'){for(let y=17;y<74;y+=9)for(const x of [19,24,67,72]){r(x,y,8,8,hair);r(x+2,y,3,2,'#57505a');}r(27,14,41,12,hair);}
if(['Alex','Laura','Frances'].includes(name)){for(const x of [31,52]){r(x,43,15,2,'#acbbc3');r(x,43,2,13,'#acbbc3');r(x+13,43,2,13,'#acbbc3');r(x,54,15,2,'#acbbc3');}r(46,46,6,2,'#acbbc3');if(name==='Alex'){r(24,49,2,24,'#a5a995');r(72,48,2,25,'#a5a995');}}
if(name==='Alex'){r(14,94,9,18,skin);r(75,94,9,18,skin);for(let y=96;y<110;y+=4){r(15,y,6,2,'#53565b');r(77,y,6,2,'#53565b');}}
// Flame tee is warm contrast against the cool room.
for(let x=31;x<66;x+=5)r(x,88-(x%7),3,12,'#e46c43');r(30,94,37,12,'#ecaf62');g.fillStyle='#263440';g.font='bold 9px monospace';g.fillText('TAYER',34,103);r(7,106,82,1,'#6b8790');return c;
};
