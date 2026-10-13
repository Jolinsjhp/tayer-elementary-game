window.BAR_CONTENT={front:[{id:'one-sip',name:'ONE SIP MARTINI · mini tini',price:'4.5',ingredients:'Tayēr Vodka, Martini Ambrato, Una Palma Fino + Blue Cheese Olive',note:'ONE LITTLE SIP · A FAMILIAR LITTLE SIP',method:'pour',color:0xd9d8b0},{id:'yuzu',name:'FROZEN YUZU MARGARITA · margarella',price:'15',ingredients:'Tapatio Blanco Tequila, Umenoyado Yuzu Sake, Lime + Yuzu',note:'CITRUS / FROZEN · BRIGHT YUZU',method:'slush',color:0xe4ce71}],back:[{id:'cedarwood',name:'PEAR',price:'19',ingredients:'Marquis De Montesquiou VSOP Armagnac, González Byass Oloroso Sherry + Walnut',note:'WOODY · SAMPLE SERVE',method:'stir',color:0xbb713f},{id:'vetiver',name:'LYCHEE + SAKURA',price:'19',ingredients:'Svitlo Vodka, González Byass La Copa Vermouth + Greek Yoghurt',note:'BITTER / EARTHY · SAMPLE SERVE',method:'stir',color:0xb56738}]};

window.WORKSTATION_MODULES={ice_well:{x:110,y:170},bottle_rail:{x:410,y:133},tool_caddy:{x:298,y:185},mixing:{x:320,y:180},strainer:{x:444,y:210},garnish:{x:455,y:238},serve:{x:460,y:244}};
const steps=(...items)=>items.map(([label,module,duration])=>({label,module,duration}));
BAR_CONTENT.front[0].actions=steps(['Glass','tool_caddy',1],['Pour · RTD','bottle_rail',1.4],['Olive / check','garnish',1],['Serve','serve',2.4]);
BAR_CONTENT.front[1].actions=steps(['Glass','tool_caddy',1],['Slush machine','bottle_rail',2],['Garnish / check','garnish',1],['Serve','serve',2.4]);
BAR_CONTENT.back.forEach(d=>d.actions=steps(['Bottle','bottle_rail',1.2],['Measure','tool_caddy',1.1],['Ice','ice_well',1.1],['Stir · STIR','mixing',2.2],['Strain','strainer',1.2],['Garnish','garnish',.8],['Serve','serve',2.4]));
// Fictional visual sequences, not verified recipes or real preparation timings.

// Service intensity order is descriptive, not a measured ABV ranking.
BAR_CONTENT.back.reverse();BAR_CONTENT.back[0].note="FLORAL / CREAMY · LIGHT & DELICATE";BAR_CONTENT.back[1].note="ORCHARD FRUIT / NUTTY · RICH & SPIRIT-FORWARD";

BAR_CONTENT.front[0].vessel="mini-martini";BAR_CONTENT.front[1].vessel="coupe";BAR_CONTENT.back[0].vessel="coupe";BAR_CONTENT.back[1].vessel="rocks";

BAR_CONTENT.back[0].method="shake";BAR_CONTENT.back[0].actions=BAR_CONTENT.back[0].actions.map(a=>({...a,label:a.module==="mixing"?"Shake":a.label}));
