// Quiet original instrumental fallback when the Spotify embed cannot play.
export function createBackgroundMusic(){
  let context,master,enabled=false,external=false,timer,cursor=0,beat=0;
  const notes=[60,64,67,71,69,67,64,62,57,60,64,67,65,64,60,59];
  function tone(midi,time,length,volume,type='sine'){
    const oscillator=context.createOscillator(),gain=context.createGain();
    oscillator.type=type;oscillator.frequency.value=440*2**((midi-69)/12);
    gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(volume,time+.08);
    gain.gain.exponentialRampToValueAtTime(.0001,time+length);
    oscillator.connect(gain);gain.connect(master);oscillator.start(time);oscillator.stop(time+length+.1);
    oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
  }
  function schedule(){
    if(!enabled||external||!context)return;
    if(cursor<context.currentTime)cursor=context.currentTime+.05;
    while(cursor<context.currentTime+1.5){
      tone(notes[beat%notes.length],cursor,1.5,.05,'triangle');
      if(beat%4===0){const root=beat%16<8?48:45;for(const interval of[0,7,12])tone(root+interval,cursor,3,.025);}
      cursor+=.75;beat++;
    }
  }
  function update(){
    if(!context)return;
    master.gain.setTargetAtTime(enabled&&!external?.3:0,context.currentTime,.15);
    if(enabled&&!external){context.resume().catch(()=>{});schedule();}
  }
  return {
    setEnabled(value){
      enabled=value;
      if(value&&!context){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;context=new Audio();master=context.createGain();master.gain.value=0;master.connect(context.destination);timer=setInterval(schedule,500);}
      update();
    },
    setExternalPlaying(value){external=value;update();},
    stop(){enabled=false;update();clearInterval(timer);}
  };
}
