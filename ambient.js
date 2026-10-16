// Ambient remarks count uninterrupted idle time, independently of player dialogue.
export function createIdleRemark({lines,minWait=18,maxWait=36,firstWait=12,duration=3.5,random=Math.random}){
 let idle=0,wait=firstWait,remaining=0,last=-1,text=null;
 return {update(dt,eligible){
  if(!eligible){idle=0;remaining=0;text=null;return null;}
  if(remaining>0){remaining-=dt;if(remaining>0)return text;text=null;idle=0;wait=minWait+random()*(maxWait-minWait);return null;}
  idle+=Math.max(0,dt);if(idle<wait||!lines.length)return null;
  let index=Math.min(lines.length-1,Math.floor(random()*lines.length));
  if(index===last&&lines.length>1)index=(index+1+Math.floor(random()*(lines.length-1)))%lines.length;
  last=index;text=lines[index];remaining=duration;idle=0;return text;
 }};
}
