import * as T from './three.module.js';
import {box,cylinder,bottle,label,material} from './models.js?v=20261013-18';

// The retained 2D art supplies the palette and fittings, not a flat backdrop.
// Dressings stay on walls and worktops; existing walkable floor is unchanged.
export function dressRooms(front,back){
  for(const [root,rear] of [[front,false],[back,true]]){
    for(let x=-5.7;x<5.8;x+=.6)for(let z=-4.6;z<4.8;z+=.6){
      box(root,x,.009,z,.56,.006,.56,rear?'#687969':'#8b8e80');
    }
    // Exposed steel duct and concrete lintel of the original pixel interior.
    box(root,0,3.12,-4.5,11.5,.2,.48,'#939c90',.25);
    const duct=cylinder(root,0,2.94,-4.2,.15,10.7,'#9aa69b',12,.65);
    duct.rotation.z=Math.PI/2;
    for(const x of [-4.7,-2.4,0,2.4,4.7]){
      box(root,x,2.94,-4.2,.035,.34,.34,'#607169',.6);
    }
    const sx=rear?-.95:-3.45,ex=rear?5.2:3.5;
    for(let x=sx;x<ex;x+=.34)for(let y=1.48;y<2.4;y+=.24){
      box(root,x,y,-4.715,.32,.22,.018,(Math.round(x*10+y*10)%2)?'#51725a':'#42664b');
    }
    box(root,(sx+ex)/2,1.39,-4.51,ex-sx+.2,.06,.48,'#c2c9bc',.6);
    // Warm, restrained practical lights, rather than a bright showroom.
    for(const x of [-3.8,3.8]){
      box(root,x,2.48,-4.65,.2,.15,.08,'#c3dce7');
      const light=new T.PointLight('#c3e2f0',3.5,5,2);light.position.set(x,2.35,-4.05);root.add(light);
    }
  }
  // Familiar slush machine: two illuminated bowls behind Laura's station.
  box(front,2.65,1.39,-3.8,.67,.5,.47,'#b6c2b5',.3);
  for(const [dx,c] of [[-.17,'#d3c477'],[.17,'#b3c59a']]){
    box(front,2.65+dx,1.47,-3.53,.25,.27,.035,c);
    box(front,2.65+dx,1.23,-3.5,.05,.1,.06,'#d0d6cb',.6);
  }
  label(front,'SLUSH',2.65,1.82,-3.54,.62,.13,'#e5debd');
  // Stacked menus, cloths and plated bites imply a working evening.
  for(let i=0;i<3;i++)box(front,3.12,1.15+i*.008,-1.25,.28,.006,.34,'#e5e2d5');
  box(front,-2.6,1.15,-1.31,.22,.025,.16,'#cfccad');
  for(const x of [-4.8,-3.65]){
    cylinder(back,x,1.15,.3,.17,.025,'#e3e1d2',12);
    for(const dx of [-.06,.05])box(back,x+dx,1.19,.3,.08,.045,.06,'#b68c4c');
  }
  for(let i=0;i<8;i++)bottle(back,-.6+i*.7,1.47,-4.48,['#536365','#91774f','#40545a'][i%3]);
  // Workstation remains cool stainless steel; room retains its green palette.
  box(back,2,.48,-.279,2.68,.62,.035,'#607f82',.65);
  box(back,2,.83,-.257,2.7,.035,.045,'#c4d2d0',.7);
}
