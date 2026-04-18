import { useState, useEffect } from "react";

// ── palette ───────────────────────────────────────────────────────────────────
const P = {
  bg:"#08090D", surface:"#0F1117", card:"#141720",
  border:"#1E2535", border2:"#252D3E",
  text:"#EAE6DC", sub:"#8A96A8", muted:"#4A5568",
  gold:"#C9A96E", goldDim:"#8B6A30",
  green:"#4ADE80", red:"#F87171", blue:"#60C8FF", yellow:"#FCD34D",
};

// ── constants ─────────────────────────────────────────────────────────────────
const DEVS = [
  { id:"mitsubishi",    short:"三菱", brand:"The ParkHouse",       color:"#C9A96E" },
  { id:"sumitomo",      short:"住友", brand:"シティハウス/タワー",  color:"#7AAFD4" },
  { id:"mitsui",        short:"三井", brand:"パークホームズ/タワー",color:"#7DC89A" },
  { id:"nomura",        short:"野村", brand:"プラウド",             color:"#C49EC4" },
  { id:"tokyotatemono", short:"東建", brand:"Brillia",              color:"#9E9ECC" },
  { id:"tokyu",         short:"東急", brand:"ブランズ",             color:"#C9A87A" },
];

const ST_COLOR = {
  "販売中":"#4ADE80","予告":"#FCD34D","計画中":"#94A3B8",
  "完売":"#F87171","中古売出中":"#60C8FF","成約済":"#F87171",
};
const STATUSES = ["販売中","予告","計画中","完売","中古売出中","成約済"];

// AI プロバイダー定義
const AI_PROVIDERS = [
  {
    id: "claude",
    name: "Claude",
    label: "Anthropic Claude",
    placeholder: "sk-ant-api03-...",
    hint: "https://console.anthropic.com でAPIキーを取得",
    models: ["claude-sonnet-4-20250514", "claude-3-5-haiku-20241022"],
    defaultModel: "claude-sonnet-4-20250514",
  },
  {
    id: "openai",
    name: "ChatGPT",
    label: "OpenAI ChatGPT",
    placeholder: "sk-proj-...",
    hint: "https://platform.openai.com でAPIキーを取得",
    models: ["gpt-4o", "gpt-4o-mini"],
    defaultModel: "gpt-4o-mini",
  },
  {
    id: "gemini",
    name: "Gemini",
    label: "Google Gemini",
    placeholder: "AIza...",
    hint: "https://aistudio.google.com でAPIキーを取得",
    models: ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-1.5-flash", "gemini-1.5-pro"],
    defaultModel: "gemini-2.0-flash",
  },
];

const INIT_PROPS = [
  { id:1,kind:"new",dev:"mitsubishi",name:"ザ・パークハウス 川越フロント",area:"埼玉県川越市",line:"東武東上線・JR川越線",station:"川越駅",walk:2,pMin:6000,pMax:9000,sqm:75,tsubo:325,delivery:"2026年春",status:"販売中",watch:true,notify:true,memo:"損益ゼロ坪416万円。残債13年後約4,950万円",tags:["ZEH","駅近","タワー近接"],lat:35.9253,lng:139.4853 },
  { id:2,kind:"new",dev:"sumitomo",name:"シティタワー大宮",area:"埼玉県さいたま市大宮区",line:"JR各線",station:"大宮駅",walk:5,pMin:8000,pMax:15000,sqm:70,tsubo:null,delivery:"2027年春",status:"予告",watch:false,notify:false,memo:"",tags:["タワー","大規模"],lat:35.9063,lng:139.6237 },
  { id:3,kind:"new",dev:"mitsui",name:"パークタワー浦和",area:"埼玉県さいたま市浦和区",line:"JR京浜東北線",station:"浦和駅",walk:3,pMin:9000,pMax:18000,sqm:80,tsubo:null,delivery:"2027年夏",status:"予告",watch:true,notify:true,memo:"浦和は過去10年+44.9%",tags:["タワー","駅近"],lat:35.8575,lng:139.6555 },
  { id:4,kind:"new",dev:"nomura",name:"プラウドタワー武蔵小杉",area:"神奈川県川崎市中原区",line:"東急東横線・JR南武線",station:"武蔵小杉駅",walk:4,pMin:8500,pMax:16000,sqm:68,tsubo:null,delivery:"2026年秋",status:"販売中",watch:false,notify:false,memo:"",tags:["タワー","神奈川"],lat:35.5759,lng:139.6577 },
  { id:5,kind:"new",dev:"tokyotatemono",name:"Brillia Tower 豊洲",area:"東京都江東区",line:"有楽町線",station:"豊洲駅",walk:6,pMin:10000,pMax:22000,sqm:72,tsubo:null,delivery:"2028年春",status:"計画中",watch:false,notify:false,memo:"",tags:["タワー","湾岸"],lat:35.6453,lng:139.7966 },
  { id:6,kind:"new",dev:"tokyu",name:"ブランズタワー渋谷",area:"東京都渋谷区",line:"JR山手線・各線",station:"渋谷駅",walk:8,pMin:15000,pMax:40000,sqm:65,tsubo:null,delivery:"2027年春",status:"予告",watch:false,notify:false,memo:"",tags:["タワー","都心"],lat:35.6580,lng:139.7016 },
  { id:7,kind:"used",dev:"mitsubishi",name:"ザ・パークハウス 川越タワー（中古）",area:"埼玉県川越市",line:"東武東上線・JR川越線",station:"川越駅",walk:1,pMin:8200,pMax:9800,sqm:73,tsubo:390,delivery:"即入居可",status:"中古売出中",watch:true,notify:true,memo:"坪370〜410万円が現在相場",tags:["中古","タワー","参考相場"],lat:35.9258,lng:139.4860 },
  { id:8,kind:"used",dev:"nomura",name:"プラウド浦和常盤（中古）",area:"埼玉県さいたま市浦和区",line:"JR京浜東北線",station:"浦和駅",walk:7,pMin:6800,pMax:7500,sqm:78,tsubo:290,delivery:"2026年6月",status:"中古売出中",watch:false,notify:false,memo:"",tags:["中古","浦和"],lat:35.8595,lng:139.6490 },
  { id:9,kind:"used",dev:"mitsui",name:"パークホームズ大宮宮町（中古）",area:"埼玉県さいたま市大宮区",line:"JR各線",station:"大宮駅",walk:9,pMin:5500,pMax:6200,sqm:70,tsubo:260,delivery:"2026年7月",status:"中古売出中",watch:false,notify:false,memo:"",tags:["中古","大宮"],lat:35.9080,lng:139.6290 },
];

// ── helpers ───────────────────────────────────────────────────────────────────
const yen = v => { if(!v&&v!==0) return "—"; const n=Math.round(v); return n>=10000?`${(n/10000).toFixed(1)}億`:`${n.toLocaleString()}万`; };
const tsuboCalc = sqm => +(sqm/3.30579).toFixed(1);
const MAP = { minLat:35.55,maxLat:36.02,minLng:139.38,maxLng:139.87 };
const ll2xy = (lat,lng,w,h) => ({
  x:((lng-MAP.minLng)/(MAP.maxLng-MAP.minLng))*w,
  y:h-((lat-MAP.minLat)/(MAP.maxLat-MAP.minLat))*h,
});

function calcSim({ price,down,rate,years,mgmt,hold,sellUnit,sqm:s }) {
  const loan=price-down; if(loan<=0) return null;
  const mr=rate/100/12, n=years*12, hm=hold*12;
  const denom=Math.pow(1+mr,n)-1;
  const mp=denom===0?loan/n:loan*mr*Math.pow(1+mr,n)/denom;
  let bal=loan;
  for(let i=0;i<hm;i++) bal-=(mp-bal*mr);
  const debt=Math.max(0,bal);
  const loanTot=mp*hm, mgmtTot=mgmt*hm, misc=price*0.054;
  const totalOut=down+loanTot+mgmtTot+misc;
  let ded=0,tb=loan;
  for(let y=0;y<Math.min(hold,13);y++){
    ded+=Math.min(tb,4500)*0.007;
    for(let m=0;m<12;m++) tb-=(mp-tb*mr);
  }
  const tb2=tsuboCalc(s), sell=sellUnit*tb2;
  const sellCost=(sell*0.03+6)*1.1;
  const hand=sell-debt-sellCost;
  const net=hand-totalOut+ded;
  return { mp:Math.round(mp),debt:Math.round(debt),loanTot:Math.round(loanTot),mgmtTot:Math.round(mgmtTot),misc:Math.round(misc),totalOut:Math.round(totalOut),ded:Math.round(ded),sell:Math.round(sell),sellCost:Math.round(sellCost),hand:Math.round(hand),net:Math.round(net),tb2 };
}

// ── AI呼び出し（プロバイダー切替対応）────────────────────────────────────────
async function callAI({ provider, apiKey, model, system, prompt }) {
  if (provider === "claude") {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST",
      headers:{ "Content-Type":"application/json", "x-api-key":apiKey, "anthropic-version":"2023-06-01", "anthropic-dangerous-direct-browser-access":"true" },
      body:JSON.stringify({ model, max_tokens:1500, system, messages:[{role:"user",content:prompt}] }),
    });
    const d = await res.json();
    if(d.error) throw new Error(d.error.message);
    return d.content?.find(b=>b.type==="text")?.text || "";
  }
  if (provider === "openai") {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method:"POST",
      headers:{ "Content-Type":"application/json", "Authorization":`Bearer ${apiKey}` },
      body:JSON.stringify({ model, max_tokens:1500, messages:[{role:"system",content:system},{role:"user",content:prompt}] }),
    });
    const d = await res.json();
    if(d.error) throw new Error(d.error.message);
    return d.choices?.[0]?.message?.content || "";
  }
  if (provider === "gemini") {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ contents:[{parts:[{text:`${system}\n\n${prompt}`}]}] }),
    });
    const d = await res.json();
    if(d.error) throw new Error(d.error.message);
    return d.candidates?.[0]?.content?.parts?.[0]?.text || "";
  }
  throw new Error("不明なプロバイダーです");
}

// ── localStorage helpers ──────────────────────────────────────────────────────
const LS_KEY = "metro_tracker_v2";
const saveLS = (data) => { try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch{} };
const loadLS = () => { try { const v=localStorage.getItem(LS_KEY); return v?JSON.parse(v):null; } catch{return null;} };

// ── tiny components ────────────────────────────────────────────────────────────
const Chip = ({label,active,color="#C9A96E",onClick}) => (
  <button onClick={onClick} style={{padding:"5px 12px",borderRadius:"20px",border:`1px solid ${active?color+"88":"#252D3E"}`,background:active?color+"18":"transparent",color:active?color:P.muted,fontSize:"12px",fontWeight:active?"600":"400",cursor:"pointer",whiteSpace:"nowrap",transition:"all .15s"}}>{label}</button>
);
const StatusPill = ({status}) => {
  const c=ST_COLOR[status]||P.muted;
  return <span style={{padding:"2px 8px",borderRadius:"4px",border:`1px solid ${c}44`,background:`${c}18`,color:c,fontSize:"11px",fontWeight:"600"}}>{status}</span>;
};
const Row = ({label,value,color}) => (
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${P.border}`}}>
    <span style={{fontSize:"12px",color:P.sub}}>{label}</span>
    <span style={{fontSize:"14px",fontWeight:"700",color:color||P.text}}>{value}</span>
  </div>
);
function IBtn({icon,active,ac,onClick,title}) {
  return <button onClick={onClick} title={title} style={{width:"34px",height:"34px",background:active?`${ac}22`:"#1A2130",border:`1px solid ${active?ac+"55":"#252D3E"}`,borderRadius:"8px",color:active?(ac||P.gold):P.muted,cursor:"pointer",fontSize:"14px",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"}}>{icon}</button>;
}

// ── SEARCH PRESETS ────────────────────────────────────────────────────────────
const SEARCH_PRESETS = [
  { label:"🔍 首都圏 新着物件",  prompt:"三菱地所レジデンス・住友不動産・三井不動産レジデンシャル・野村不動産・東京建物・東急不動産が2025〜2026年に首都圏で発売・予告している新築・中古分譲マンションの新着情報を、物件名・エリア・価格帯・坪単価・特徴を含めてリストアップしてください。" },
  { label:"📈 埼玉エリア動向",    prompt:"埼玉県（川越・大宮・浦和・さいたま市）の分譲マンション市場の最新動向を、価格推移・坪単価・大手デベロッパーの供給状況・リセールバリューの傾向を具体的な数字を交えて説明してください。" },
  { label:"🏙 東京・神奈川 動向", prompt:"東京都・神奈川県（渋谷・武蔵小杉・豊洲・湾岸エリア）の大手デベロッパー分譲マンションの最新市況を、坪単価・供給量・価格推移・注目物件を含めて説明してください。" },
  { label:"🏷 中古相場チェック",  prompt:"三菱地所・住友不動産・三井不動産・野村不動産・東京建物・東急不動産ブランドの首都圏中古マンション相場（2025〜2026年）をエリア別・ブランド別の坪単価と価格動向を含めて説明してください。" },
  { label:"🔄 買換え戦略",       prompt:"首都圏在住者が大手デベロッパー物件から買換えを検討する場合の2025〜2026年の市況について、売り時・買い時・注意点・リセールしやすいエリアやブランドの特徴を教えてください。" },
];

const SEARCH_SYSTEM = `あなたは首都圏の不動産市場の専門アナリストです。回答は必ず以下のJSON形式のみで返してください（マークダウン・前後の説明文不要）：
{"summary":"市況サマリー150文字以内","properties":[{"name":"物件名","dev":"mitsubishi/sumitomo/mitsui/nomura/tokyotatemono/tokyu のいずれか","kind":"new or used","area":"エリア","station":"最寄駅名","walk":徒歩分数数値,"pMin":最低価格万円数値,"pMax":最高価格万円数値,"sqm":専有面積数値,"tsubo":坪単価数値orNull,"delivery":"竣工時期","status":"販売中 or 予告 or 計画中 or 中古売出中","tags":["タグ"],"memo":"特徴50文字以内","lat":緯度数値,"lng":経度数値}],"market_comment":"市況コメント200文字以内"}`;

const CHAT_SYSTEM = "あなたは首都圏の不動産市場の専門アナリストです。三菱地所レジデンス・住友不動産・三井不動産レジデンシャル・野村不動産・東京建物・東急不動産の新築・中古分譲マンションについて専門的かつ具体的に日本語400文字以内で回答してください。";

const QUICK_QS = ["川越エリアの中古相場を教えて","浦和・大宮の将来性は？","ZEH物件のリセール影響は？","大手6社ブランドの資産性比較","免震と制震どちらが有利？","中古vs新築の収益性比較"];

// ── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  // ── state: データ ──
  const [properties, setProperties] = useState(INIT_PROPS);
  const [simP, setSimP] = useState({ down:768,rate:1.0,years:35,mgmt:3.1,hold:13,sellUnit:390 });
  const [loaded, setLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle");

  // ── state: AI設定 ──
  const [aiProvider, setAiProvider] = useState("claude");
  const [apiKeys, setApiKeys] = useState({ claude:"", openai:"", gemini:"" });
  const [aiModels, setAiModels] = useState({ claude:"claude-sonnet-4-20250514", openai:"gpt-4o-mini", gemini:"gemini-1.5-flash" });
  const [showSettings, setShowSettings] = useState(false);

  // ── state: UI ──
  const [tab, setTab] = useState("list");
  const [filterKind, setFilterKind] = useState("all");
  const [filterDev, setFilterDev] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [walkMax, setWalkMax] = useState(20);
  const [priceMax, setPriceMax] = useState(50000);
  const [showFilter, setShowFilter] = useState(false);
  const [selected, setSelected] = useState(null);
  const [editMemo, setEditMemo] = useState(null);
  const [memoText, setMemoText] = useState("");
  const [simId, setSimId] = useState(null);
  const [mapHover, setMapHover] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [notifs, setNotifs] = useState([]);

  // ── 起動時ロード ──
  useEffect(() => {
    const saved = loadLS();
    if (saved) {
      if (saved.properties?.length) setProperties(saved.properties);
      if (saved.simP) setSimP(saved.simP);
      if (saved.aiProvider) setAiProvider(saved.aiProvider);
      if (saved.apiKeys) setApiKeys(saved.apiKeys);
      if (saved.aiModels) setAiModels(saved.aiModels);
    }
    setLoaded(true);
  }, []);

  // ── 自動保存（debounce 800ms）──
  useEffect(() => {
    if (!loaded) return;
    setSaveStatus("saving");
    const t = setTimeout(() => {
      saveLS({ properties, simP, aiProvider, apiKeys, aiModels });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 800);
    return () => clearTimeout(t);
  }, [properties, simP, aiProvider, apiKeys, aiModels, loaded]);

  // ── helpers ──
  const watchCount = properties.filter(p=>p.watch).length;
  const currentProvider = AI_PROVIDERS.find(p=>p.id===aiProvider);
  const currentKey = apiKeys[aiProvider] || "";
  const currentModel = aiModels[aiProvider] || currentProvider?.defaultModel;
  const hasKey = currentKey.trim().length > 5;

  const pushNotif = (text) => {
    const id = Date.now();
    setNotifs(n=>[...n.slice(-2),{id,text}]);
    setTimeout(()=>setNotifs(n=>n.filter(x=>x.id!==id)),4000);
  };

  const filtered = properties.filter(p => {
    if(filterKind!=="all"&&p.kind!==filterKind) return false;
    if(filterDev!=="all"&&p.dev!==filterDev) return false;
    if(filterStatus!=="all"&&p.status!==filterStatus) return false;
    if(p.pMax>priceMax) return false;
    if(p.walk>walkMax) return false;
    if(query&&!p.name.includes(query)&&!p.station.includes(query)&&!p.area.includes(query)) return false;
    return true;
  });

  const toggleField = (id,field) => setProperties(prev=>prev.map(p=>p.id===id?{...p,[field]:!p[field]}:p));
  const changeStatus = (id,val) => setProperties(prev=>prev.map(p=>{
    if(p.id!==id) return p;
    if(p.notify&&p.status!==val) pushNotif(`「${p.name}」→ ${val}`);
    return {...p,status:val};
  }));
  const saveMemo = () => { setProperties(prev=>prev.map(p=>p.id===editMemo?{...p,memo:memoText}:p)); setEditMemo(null); };

  const sel = selected ? properties.find(p=>p.id===selected) : null;
  const selDev = sel ? DEVS.find(d=>d.id===sel.dev) : null;
  const simProp = simId ? properties.find(p=>p.id===simId) : null;
  const simRes = simProp ? calcSim({price:Math.round((simProp.pMin+simProp.pMax)/2),down:+simP.down,rate:+simP.rate,years:+simP.years,mgmt:+simP.mgmt,hold:+simP.hold,sellUnit:+simP.sellUnit,sqm:simProp.sqm}) : null;

  if (!loaded) return (
    <div style={{maxWidth:"500px",margin:"0 auto",minHeight:"100vh",background:P.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"16px"}}>
      <div style={{width:"5px",height:"36px",background:`linear-gradient(${P.gold},${P.goldDim})`,borderRadius:"2px",animation:"pulse 1.2s infinite"}}/>
      <div style={{fontSize:"13px",color:P.muted,letterSpacing:".1em"}}>読み込み中…</div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  );

  return (
    <div style={{maxWidth:"500px",margin:"0 auto",minHeight:"100vh",background:P.bg,color:P.text,fontFamily:"'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif",fontSize:"14px",position:"relative",paddingBottom:"72px"}}>

      {/* Toast */}
      <div style={{position:"fixed",top:"12px",left:"50%",transform:"translateX(-50%)",zIndex:999,display:"flex",flexDirection:"column",gap:"6px",width:"90%",maxWidth:"440px",pointerEvents:"none"}}>
        {notifs.map(n=>(
          <div key={n.id} style={{background:"#1A2235",border:`1px solid ${P.gold}55`,borderRadius:"10px",padding:"10px 14px",fontSize:"13px",boxShadow:"0 4px 24px rgba(0,0,0,.7)",animation:"fadeDown .3s ease"}}>
            <span style={{color:P.gold,marginRight:"6px"}}>🔔</span>{n.text}
          </div>
        ))}
      </div>

      {/* Header */}
      <div style={{position:"sticky",top:0,zIndex:100,background:"rgba(8,9,13,.96)",backdropFilter:"blur(14px)",borderBottom:`1px solid ${P.border}`,padding:"14px 16px 12px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <div style={{width:"4px",height:"24px",background:`linear-gradient(${P.gold},${P.goldDim})`,borderRadius:"2px"}}/>
            <div>
              <div style={{fontSize:"14px",fontWeight:"700",letterSpacing:".08em"}}>METRO TRACKER</div>
              <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                <div style={{fontSize:"10px",color:P.muted}}>首都圏 主要デベロッパー</div>
                {saveStatus==="saving"&&<span style={{fontSize:"9px",color:P.muted,animation:"pulse 1s infinite"}}>● 保存中</span>}
                {saveStatus==="saved"&&<span style={{fontSize:"9px",color:P.green}}>✓ 保存済</span>}
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:"16px",fontWeight:"700",color:P.gold,lineHeight:1}}>{watchCount}</div>
              <div style={{fontSize:"9px",color:P.muted,marginTop:"2px"}}>ウォッチ</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:"16px",fontWeight:"700",color:"#7AAFD4",lineHeight:1}}>{properties.length}</div>
              <div style={{fontSize:"9px",color:P.muted,marginTop:"2px"}}>総物件</div>
            </div>
            <button onClick={()=>setShowSettings(true)} style={{background:hasKey?`${P.gold}18`:P.surface,border:`1px solid ${hasKey?P.gold+"55":P.border2}`,borderRadius:"8px",padding:"7px 10px",color:hasKey?P.gold:P.muted,cursor:"pointer",fontSize:"13px"}} title="AI設定">⚙</button>
            <button onClick={()=>setShowAdd(true)} style={{background:`linear-gradient(135deg,${P.gold},${P.goldDim})`,border:"none",borderRadius:"8px",padding:"8px 12px",color:"#07080C",fontSize:"12px",fontWeight:"700",cursor:"pointer"}}>＋ 追加</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",borderBottom:`1px solid ${P.border}`,overflowX:"auto",scrollbarWidth:"none"}}>
        {[{id:"list",icon:"🏢",l:"一覧"},{id:"watch",icon:"★",l:`ウォッチ(${watchCount})`},{id:"map",icon:"🗺",l:"マップ"},{id:"sim",icon:"📊",l:"収支"},{id:"ai",icon:"💬",l:"AI"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"11px 4px 9px",background:"none",border:"none",borderBottom:tab===t.id?`2px solid ${P.gold}`:"2px solid transparent",color:tab===t.id?P.gold:P.muted,cursor:"pointer",fontSize:"11px",fontWeight:tab===t.id?"700":"400",whiteSpace:"nowrap",minWidth:"60px"}}>
            <div style={{fontSize:"16px",marginBottom:"2px"}}>{t.icon}</div>{t.l}
          </button>
        ))}
      </div>

      <div style={{padding:"0 0 8px"}}>

        {/* ══ LIST / WATCH ══ */}
        {(tab==="list"||tab==="watch")&&(
          <div>
            <div style={{padding:"12px 16px 8px",display:"flex",gap:"8px"}}>
              <div style={{flex:1,position:"relative"}}>
                <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="物件名・駅名・エリアで検索…"
                  style={{width:"100%",background:P.surface,border:`1px solid ${P.border2}`,borderRadius:"10px",padding:"9px 12px 9px 34px",color:P.text,fontSize:"13px",outline:"none",boxSizing:"border-box"}}/>
                <span style={{position:"absolute",left:"10px",top:"50%",transform:"translateY(-50%)",color:P.muted}}>🔍</span>
              </div>
              <button onClick={()=>setShowFilter(f=>!f)} style={{background:showFilter?P.gold+"22":P.surface,border:`1px solid ${showFilter?P.gold+"66":P.border2}`,borderRadius:"10px",padding:"9px 13px",color:showFilter?P.gold:P.sub,cursor:"pointer"}}>
                {showFilter?"▲":"⚙"}
              </button>
            </div>
            <div style={{overflowX:"auto",padding:"0 16px 8px",display:"flex",gap:"6px",scrollbarWidth:"none"}}>
              {[["all","すべて"],["new","新築"],["used","中古"]].map(([k,l])=><Chip key={k} label={l} active={filterKind===k} color={k==="used"?P.blue:P.gold} onClick={()=>setFilterKind(k)}/>)}
              <span style={{color:P.border2,alignSelf:"center",padding:"0 2px"}}>|</span>
              <Chip label="全社" active={filterDev==="all"} onClick={()=>setFilterDev("all")}/>
              {DEVS.map(d=><Chip key={d.id} label={d.short} active={filterDev===d.id} color={d.color} onClick={()=>setFilterDev(d.id)}/>)}
            </div>
            {showFilter&&(
              <div style={{margin:"0 16px 10px",background:P.surface,border:`1px solid ${P.border}`,borderRadius:"12px",padding:"14px 16px"}}>
                <div style={{marginBottom:"12px"}}>
                  <div style={{fontSize:"11px",color:P.muted,marginBottom:"6px"}}>ステータス</div>
                  <div style={{display:"flex",gap:"5px",flexWrap:"wrap"}}>
                    {["all","販売中","中古売出中","予告","計画中"].map(s=><Chip key={s} label={s==="all"?"全て":s} active={filterStatus===s} color={ST_COLOR[s]} onClick={()=>setFilterStatus(s)}/>)}
                  </div>
                </div>
                <div style={{marginBottom:"12px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}>
                    <span style={{fontSize:"11px",color:P.muted}}>最高価格</span>
                    <span style={{fontSize:"11px",color:P.gold}}>{yen(priceMax)}円以下</span>
                  </div>
                  <input type="range" min={2000} max={50000} step={1000} value={priceMax} onChange={e=>setPriceMax(+e.target.value)} style={{width:"100%",accentColor:P.gold}}/>
                </div>
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}>
                    <span style={{fontSize:"11px",color:P.muted}}>徒歩</span>
                    <span style={{fontSize:"11px",color:P.gold}}>{walkMax}分以内</span>
                  </div>
                  <input type="range" min={1} max={20} value={walkMax} onChange={e=>setWalkMax(+e.target.value)} style={{width:"100%",accentColor:P.gold}}/>
                </div>
              </div>
            )}
            <div style={{padding:"0 16px 6px",fontSize:"11px",color:P.muted}}>
              {filtered.filter(p=>tab==="watch"?p.watch:true).length} 件
            </div>
            <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:"10px"}}>
              {filtered.filter(p=>tab==="watch"?p.watch:true).map(p=>{
                const dev=DEVS.find(d=>d.id===p.dev);
                return (
                  <div key={p.id} onClick={()=>setSelected(p.id)} style={{background:P.card,border:`1px solid ${p.watch?P.gold+"44":P.border}`,borderRadius:"14px",padding:"14px",cursor:"pointer",transition:"border-color .2s"}}>
                    <div style={{display:"flex",alignItems:"flex-start",gap:"10px",marginBottom:"10px"}}>
                      <div style={{width:"40px",height:"40px",minWidth:"40px",background:`${dev.color}20`,border:`1px solid ${dev.color}44`,borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:"700",color:dev.color}}>{dev.short}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",gap:"5px",flexWrap:"wrap",marginBottom:"4px",alignItems:"center"}}>
                          <StatusPill status={p.status}/>
                          {p.kind==="used"&&<span style={{fontSize:"10px",color:P.blue,border:`1px solid ${P.blue}44`,borderRadius:"4px",padding:"1px 5px"}}>中古</span>}
                          {p.watch&&<span style={{fontSize:"10px",color:P.gold}}>★</span>}
                          {p.notify&&<span style={{fontSize:"10px",color:"#60C8FF"}}>🔔</span>}
                        </div>
                        <div style={{fontSize:"13px",fontWeight:"600",lineHeight:"1.4",color:"#EEE"}}>{p.name}</div>
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px",marginBottom:"8px"}}>
                      {[{icon:"📍",val:`${p.station} 徒歩${p.walk}分`},{icon:"📐",val:`${p.sqm}㎡（${tsuboCalc(p.sqm)}坪）`},{icon:"🗓",val:p.delivery},{icon:"💴",val:p.tsubo?`坪${p.tsubo.toLocaleString()}万`:"—"}].map((m,i)=>(
                        <div key={i} style={{display:"flex",gap:"4px",alignItems:"center",fontSize:"11px",color:P.sub}}><span>{m.icon}</span><span>{m.val}</span></div>
                      ))}
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{fontSize:"16px",fontWeight:"700"}}>{yen(p.pMin)}<span style={{color:P.muted,fontSize:"12px"}}>〜</span>{yen(p.pMax)}<span style={{fontSize:"11px",color:P.muted,fontWeight:"400"}}>万円</span></div>
                      <div style={{display:"flex",gap:"6px"}}>
                        <IBtn icon={p.watch?"★":"☆"} active={p.watch} ac={P.gold} onClick={e=>{e.stopPropagation();toggleField(p.id,"watch");}}/>
                        <IBtn icon="📊" onClick={e=>{e.stopPropagation();setSimId(p.id);setTab("sim");}}/>
                      </div>
                    </div>
                    {p.memo&&<div style={{marginTop:"8px",padding:"7px 10px",background:"#C9A96E0E",borderLeft:`2px solid ${P.gold}44`,borderRadius:"0 5px 5px 0",fontSize:"11px",color:"#A89060"}}>📝 {p.memo}</div>}
                  </div>
                );
              })}
              {filtered.filter(p=>tab==="watch"?p.watch:true).length===0&&(
                <div style={{textAlign:"center",padding:"48px 0",color:P.muted}}>条件に一致する物件がありません</div>
              )}
            </div>
          </div>
        )}

        {/* ══ MAP ══ */}
        {tab==="map"&&(
          <div style={{padding:"12px 16px"}}>
            <div style={{overflowX:"auto",display:"flex",gap:"6px",marginBottom:"10px",scrollbarWidth:"none"}}>
              {[["all","全種別"],["new","新築"],["used","中古"]].map(([k,l])=><Chip key={k} label={l} active={filterKind===k} color={k==="used"?P.blue:P.gold} onClick={()=>setFilterKind(k)}/>)}
              {DEVS.map(d=><Chip key={d.id} label={d.short} active={filterDev==="all"||filterDev===d.id} color={d.color} onClick={()=>setFilterDev(prev=>prev===d.id?"all":d.id)}/>)}
            </div>
            <div style={{background:P.surface,borderRadius:"16px",overflow:"hidden",border:`1px solid ${P.border}`}}>
              <svg viewBox="0 0 360 300" style={{width:"100%",display:"block"}}>
                <rect width="360" height="300" fill="#0F1117"/>
                {[...Array(6)].map((_,i)=><line key={`v${i}`} x1={60*i} y1="0" x2={60*i} y2="300" stroke="#161D2A" strokeWidth=".5"/>)}
                {[...Array(5)].map((_,i)=><line key={`h${i}`} x1="0" y1={60*i} x2="360" y2={60*i} stroke="#161D2A" strokeWidth=".5"/>)}
                {[{l:"川越",lat:35.925,lng:139.485},{l:"大宮",lat:35.906,lng:139.624},{l:"浦和",lat:35.857,lng:139.656},{l:"武蔵小杉",lat:35.576,lng:139.658},{l:"渋谷",lat:35.658,lng:139.702},{l:"豊洲",lat:35.645,lng:139.797},{l:"東京",lat:35.681,lng:139.767}].map(c=>{
                  const {x,y}=ll2xy(c.lat,c.lng,360,300);
                  return <g key={c.l}><circle cx={x} cy={y} r="2" fill="#1E2A3A"/><text x={x+3} y={y+3} fill="#2A3848" fontSize="8">{c.l}</text></g>;
                })}
                {properties.filter(p=>(filterKind==="all"||p.kind===filterKind)&&(filterDev==="all"||p.dev===filterDev)).map(p=>{
                  const dev=DEVS.find(d=>d.id===p.dev);
                  const {x,y}=ll2xy(p.lat,p.lng,360,300);
                  const hov=mapHover===p.id;
                  return (
                    <g key={p.id} style={{cursor:"pointer"}} onMouseEnter={()=>setMapHover(p.id)} onMouseLeave={()=>setMapHover(null)} onClick={()=>{setSimId(p.id);setTab("sim");}}>
                      <circle cx={x} cy={y} r={hov?14:9} fill={dev.color} opacity={hov?.22:.1}/>
                      {p.kind==="used"?<polygon points={`${x},${y-6} ${x+6},${y+4} ${x-6},${y+4}`} fill={dev.color} opacity=".9"/>:<circle cx={x} cy={y} r={hov?6:4} fill={dev.color} opacity=".9"/>}
                      {p.watch&&<circle cx={x} cy={y} r={hov?16:11} fill="none" stroke={P.gold} strokeWidth="1.2" strokeDasharray="2 2"/>}
                      {hov&&<>
                        <rect x={x<270?x+8:x-135} y={y-32} width="128" height="38" rx="4" fill="#141720" stroke={dev.color} strokeWidth=".7"/>
                        <text x={x<270?x+13:x-130} y={y-16} fill="#EEE" fontSize="9" fontWeight="bold">{p.name.length>14?p.name.slice(0,14)+"…":p.name}</text>
                        <text x={x<270?x+13:x-130} y={y-4} fill={P.sub} fontSize="8">{p.station} 徒歩{p.walk}分</text>
                        <text x={x<270?x+13:x-130} y={y+7} fill={ST_COLOR[p.status]||P.sub} fontSize="8">{p.status}</text>
                      </>}
                    </g>
                  );
                })}
              </svg>
            </div>
            <div style={{marginTop:"8px",fontSize:"11px",color:P.muted,textAlign:"center"}}>タップでシミュレーションへ ／ 位置は概略 ／ ●新築 ▲中古</div>
          </div>
        )}

        {/* ══ SIM ══ */}
        {tab==="sim"&&(
          <div style={{padding:"12px 16px"}}>
            <div style={{marginBottom:"12px"}}>
              <div style={{fontSize:"11px",color:P.muted,marginBottom:"6px"}}>対象物件</div>
              <div style={{overflowX:"auto",display:"flex",gap:"7px",scrollbarWidth:"none",paddingBottom:"4px"}}>
                {properties.map(p=>{
                  const dev=DEVS.find(d=>d.id===p.dev);
                  const sel=simId===p.id;
                  return <button key={p.id} onClick={()=>setSimId(p.id)} style={{minWidth:"120px",background:sel?`${dev.color}20`:P.surface,border:`1px solid ${sel?dev.color+"66":P.border}`,borderRadius:"10px",padding:"8px 10px",textAlign:"left",cursor:"pointer",transition:"all .15s"}}>
                    <div style={{fontSize:"10px",color:sel?dev.color:P.muted,fontWeight:"600",marginBottom:"3px"}}>{dev.short} {p.kind==="used"?"中古":""}</div>
                    <div style={{fontSize:"11px",color:sel?P.text:P.sub,lineHeight:"1.3"}}>{p.name.length>16?p.name.slice(0,16)+"…":p.name}</div>
                    <div style={{fontSize:"10px",color:P.muted,marginTop:"2px"}}>{yen(p.pMin)}〜{yen(p.pMax)}</div>
                  </button>;
                })}
              </div>
            </div>
            <div style={{background:P.surface,border:`1px solid ${P.border}`,borderRadius:"12px",padding:"14px",marginBottom:"12px"}}>
              <div style={{fontSize:"11px",color:P.gold,fontWeight:"600",marginBottom:"10px"}}>パラメータ</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}}>
                {[{l:"頭金（万円）",k:"down"},{l:"金利（%）",k:"rate"},{l:"返済年数",k:"years"},{l:"管理費 月額（万）",k:"mgmt"},{l:"保有年数",k:"hold"},{l:"売却坪単価（万）",k:"sellUnit"}].map(f=>(
                  <div key={f.k}>
                    <div style={{fontSize:"10px",color:P.muted,marginBottom:"3px"}}>{f.l}</div>
                    <input type="number" step="any" value={simP[f.k]} onChange={e=>setSimP(prev=>({...prev,[f.k]:e.target.value}))}
                      style={{width:"100%",background:"#0F1117",border:`1px solid ${P.border2}`,borderRadius:"7px",padding:"7px 9px",color:P.text,fontSize:"13px",outline:"none",boxSizing:"border-box"}}/>
                  </div>
                ))}
              </div>
            </div>
            {!simId&&<div style={{textAlign:"center",padding:"32px",color:P.muted}}>上の物件を選択してください</div>}
            {simRes&&simProp&&(()=>{
              const dev=DEVS.find(d=>d.id===simProp.dev);
              return (
                <div>
                  <div style={{background:P.surface,border:`1px solid ${dev.color}33`,borderRadius:"12px",padding:"14px",marginBottom:"10px"}}>
                    <div style={{fontSize:"13px",fontWeight:"600",marginBottom:"4px"}}>{simProp.name}</div>
                    <div style={{fontSize:"11px",color:P.sub}}>{simProp.sqm}㎡（{simRes.tb2}坪） / {simProp.kind==="used"?"中古":"新築"}</div>
                  </div>
                  <div style={{background:simRes.net>=0?"#4ADE8010":"#F8717110",border:`1px solid ${simRes.net>=0?"#4ADE8030":"#F8717130"}`,borderRadius:"12px",padding:"16px",textAlign:"center",marginBottom:"10px"}}>
                    <div style={{fontSize:"11px",color:P.muted,marginBottom:"4px"}}>最終損益（{simP.hold}年後）</div>
                    <div style={{fontSize:"32px",fontWeight:"800",color:simRes.net>=0?P.green:P.red}}>{simRes.net>=0?"+":""}{yen(simRes.net)}万円</div>
                  </div>
                  <div style={{background:P.surface,border:`1px solid ${P.border}`,borderRadius:"12px",padding:"4px 14px",marginBottom:"10px"}}>
                    <Row label="月返済額" value={`${simRes.mp.toLocaleString()}万円`}/>
                    <Row label={`残債（${simP.hold}年後）`} value={`${yen(simRes.debt)}万円`}/>
                    <Row label="支出合計" value={`${yen(simRes.totalOut)}万円`} color={P.red}/>
                    <Row label="住宅ローン控除" value={`+${yen(simRes.ded)}万円`} color={P.green}/>
                    <Row label="売却価格" value={`${yen(simRes.sell)}万円`}/>
                    <Row label="売却諸経費" value={`▲${yen(simRes.sellCost)}万円`}/>
                    <Row label="売却手残り" value={`${yen(simRes.hand)}万円`}/>
                  </div>
                  <div style={{background:P.surface,border:`1px solid ${P.border}`,borderRadius:"12px",padding:"14px"}}>
                    <div style={{fontSize:"11px",color:P.gold,fontWeight:"600",marginBottom:"10px"}}>坪単価シナリオ</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"6px"}}>
                      {[{l:"悲観",m:.85},{l:"中央",m:1},{l:"楽観",m:1.15},{l:"超楽観",m:1.35}].map(sc=>{
                        const u=Math.round(+simP.sellUnit*sc.m);
                        const r2=calcSim({price:Math.round((simProp.pMin+simProp.pMax)/2),down:+simP.down,rate:+simP.rate,years:+simP.years,mgmt:+simP.mgmt,hold:+simP.hold,sellUnit:u,sqm:simProp.sqm});
                        if(!r2) return null;
                        return <div key={sc.l} style={{background:"#0F1117",border:`1px solid ${r2.net>=0?"#4ADE8022":"#F8717122"}`,borderRadius:"8px",padding:"9px 6px",textAlign:"center"}}>
                          <div style={{fontSize:"10px",color:P.muted}}>{sc.l}</div>
                          <div style={{fontSize:"10px",color:P.sub,margin:"2px 0"}}>坪{u}万</div>
                          <div style={{fontSize:"13px",fontWeight:"700",color:r2.net>=0?P.green:P.red}}>{r2.net>=0?"+":""}{yen(r2.net)}</div>
                        </div>;
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ══ AI ══ */}
        {tab==="ai"&&(
          <AiTab
            properties={properties}
            setProperties={setProperties}
            pushNotif={pushNotif}
            hasKey={hasKey}
            onOpenSettings={()=>setShowSettings(true)}
            aiProvider={aiProvider}
            apiKey={currentKey}
            model={currentModel}
            providerName={currentProvider?.name}
          />
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:"500px",background:"rgba(8,9,13,.97)",backdropFilter:"blur(14px)",borderTop:`1px solid ${P.border}`,display:"flex",zIndex:100,paddingBottom:"env(safe-area-inset-bottom,0)"}}>
        {[{id:"list",icon:"🏢",l:"一覧"},{id:"watch",icon:"★",l:`ウォッチ`},{id:"map",icon:"🗺",l:"マップ"},{id:"sim",icon:"📊",l:"収支"},{id:"ai",icon:"💬",l:"AI"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,background:"none",border:"none",padding:"10px 4px 8px",cursor:"pointer",color:tab===t.id?P.gold:P.muted,transition:"color .15s"}}>
            <div style={{fontSize:"18px",marginBottom:"2px"}}>{t.icon}</div>
            <div style={{fontSize:"10px",fontWeight:tab===t.id?"700":"400"}}>{t.l}</div>
          </button>
        ))}
      </div>

      {/* ── Detail Sheet ── */}
      {sel&&(
        <Sheet onClose={()=>setSelected(null)}>
          <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"14px"}}>
            <div style={{width:"44px",height:"44px",background:`${selDev.color}20`,border:`1px solid ${selDev.color}44`,borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px",fontWeight:"700",color:selDev.color}}>{selDev.short}</div>
            <div>
              <div style={{fontSize:"15px",fontWeight:"700"}}>{sel.name}</div>
              <div style={{fontSize:"11px",color:P.sub,marginTop:"2px"}}>{sel.line}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"14px"}}>
            <StatusPill status={sel.status}/>
            {sel.kind==="used"&&<span style={{fontSize:"11px",color:P.blue,border:`1px solid ${P.blue}44`,borderRadius:"4px",padding:"2px 7px"}}>中古</span>}
            {sel.tags.map(t=><span key={t} style={{padding:"2px 8px",borderRadius:"4px",background:"#1A2130",color:"#5A6A80",fontSize:"11px"}}>{t}</span>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"14px"}}>
            {[{l:"最寄駅",v:`${sel.station} 徒歩${sel.walk}分`},{l:"価格",v:`${yen(sel.pMin)}〜${yen(sel.pMax)}万`},{l:"専有面積",v:`${sel.sqm}㎡（${tsuboCalc(sel.sqm)}坪）`},{l:"坪単価",v:sel.tsubo?`${sel.tsubo.toLocaleString()}万円`:"—"},{l:"引渡",v:sel.delivery},{l:"エリア",v:sel.area}].map(s=>(
              <div key={s.l} style={{background:P.card,borderRadius:"8px",padding:"10px 11px"}}>
                <div style={{fontSize:"10px",color:P.muted,marginBottom:"3px"}}>{s.l}</div>
                <div style={{fontSize:"12px",fontWeight:"600"}}>{s.v}</div>
              </div>
            ))}
          </div>
          <div style={{marginBottom:"12px"}}>
            <div style={{fontSize:"11px",color:P.muted,marginBottom:"5px"}}>ステータス変更</div>
            <select value={sel.status} onChange={e=>changeStatus(sel.id,e.target.value)} style={{width:"100%",background:P.card,border:`1px solid ${P.border2}`,borderRadius:"8px",padding:"9px 12px",color:P.text,fontSize:"13px",outline:"none"}}>
              {STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {editMemo===sel.id
            ?<div style={{marginBottom:"12px"}}>
              <textarea value={memoText} onChange={e=>setMemoText(e.target.value)} rows={3} style={{width:"100%",background:P.card,border:`1px solid ${P.gold}55`,borderRadius:"8px",padding:"9px 12px",color:P.text,fontSize:"13px",outline:"none",resize:"none",boxSizing:"border-box"}}/>
              <div style={{display:"flex",gap:"7px",marginTop:"7px"}}>
                <button onClick={()=>setEditMemo(null)} style={{flex:1,background:P.card,border:`1px solid ${P.border2}`,borderRadius:"8px",padding:"9px",color:P.sub,cursor:"pointer",fontSize:"13px"}}>キャンセル</button>
                <button onClick={saveMemo} style={{flex:1,background:`linear-gradient(135deg,${P.gold},${P.goldDim})`,border:"none",borderRadius:"8px",padding:"9px",color:"#07080C",cursor:"pointer",fontSize:"13px",fontWeight:"700"}}>保存</button>
              </div>
            </div>
            :<div style={{marginBottom:"12px"}}>
              {sel.memo&&<div style={{padding:"9px 11px",background:"#C9A96E0E",borderLeft:`2px solid ${P.gold}44`,borderRadius:"0 6px 6px 0",fontSize:"12px",color:"#A89060",marginBottom:"7px"}}>📝 {sel.memo}</div>}
              <button onClick={()=>{setEditMemo(sel.id);setMemoText(sel.memo);}} style={{width:"100%",background:P.card,border:`1px solid ${P.border2}`,borderRadius:"8px",padding:"9px",color:P.sub,cursor:"pointer",fontSize:"12px"}}>📝 メモを{sel.memo?"編集":"追加"}</button>
            </div>
          }
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"8px"}}>
            <button onClick={()=>toggleField(sel.id,"watch")} style={{background:sel.watch?`${P.gold}22`:P.card,border:`1px solid ${sel.watch?P.gold+"55":P.border2}`,borderRadius:"9px",padding:"10px 6px",color:sel.watch?P.gold:P.sub,cursor:"pointer",fontSize:"11px",fontWeight:"600"}}>{sel.watch?"★ ウォッチ中":"☆ ウォッチ"}</button>
            <button onClick={()=>toggleField(sel.id,"notify")} style={{background:sel.notify?`${P.blue}18`:P.card,border:`1px solid ${sel.notify?P.blue+"55":P.border2}`,borderRadius:"9px",padding:"10px 6px",color:sel.notify?P.blue:P.sub,cursor:"pointer",fontSize:"11px",fontWeight:"600"}}>🔔 通知{sel.notify?"ON":"OFF"}</button>
            <button onClick={()=>{setSimId(sel.id);setSelected(null);setTab("sim");}} style={{background:P.card,border:`1px solid ${P.border2}`,borderRadius:"9px",padding:"10px 6px",color:P.sub,cursor:"pointer",fontSize:"11px",fontWeight:"600"}}>📊 収支計算</button>
          </div>
        </Sheet>
      )}

      {/* ── Add Sheet ── */}
      {showAdd&&(
        <AddSheet
          onClose={()=>setShowAdd(false)}
          onAdd={(prop)=>{ setProperties(prev=>[...prev,prop]); setShowAdd(false); pushNotif(`「${prop.name}」を追加しました`); }}
          onAddMany={(props)=>{ setProperties(prev=>[...prev,...props]); setShowAdd(false); pushNotif(`${props.length}件を一括追加しました`); }}
          hasKey={hasKey}
          onOpenSettings={()=>{ setShowAdd(false); setShowSettings(true); }}
          aiProvider={aiProvider}
          apiKey={currentKey}
          model={currentModel}
          existingNames={properties.map(p=>p.name)}
        />
      )}

      {/* ── AI Settings Sheet ── */}
      {showSettings&&(
        <Sheet onClose={()=>setShowSettings(false)} title="AI 接続設定">
          {/* Provider select */}
          <div style={{marginBottom:"16px"}}>
            <div style={{fontSize:"11px",color:P.muted,marginBottom:"8px"}}>使用するAI</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"7px"}}>
              {AI_PROVIDERS.map(pv=>(
                <button key={pv.id} onClick={()=>setAiProvider(pv.id)} style={{background:aiProvider===pv.id?`${P.gold}20`:P.card,border:`1px solid ${aiProvider===pv.id?P.gold+"66":P.border2}`,borderRadius:"10px",padding:"10px 6px",color:aiProvider===pv.id?P.gold:P.sub,cursor:"pointer",fontSize:"12px",fontWeight:aiProvider===pv.id?"700":"400",textAlign:"center"}}>
                  {pv.name}
                </button>
              ))}
            </div>
          </div>

          {/* Key + Model for each provider */}
          {AI_PROVIDERS.map(pv=>(
            <div key={pv.id} style={{marginBottom:"16px",opacity:aiProvider===pv.id?1:.45,transition:"opacity .2s"}}>
              <div style={{fontSize:"12px",color:aiProvider===pv.id?P.gold:P.muted,fontWeight:"600",marginBottom:"8px"}}>{pv.label}</div>
              <div style={{fontSize:"11px",color:P.muted,marginBottom:"4px"}}>APIキー</div>
              <input
                type="password"
                value={apiKeys[pv.id]||""}
                onChange={e=>setApiKeys(prev=>({...prev,[pv.id]:e.target.value}))}
                placeholder={pv.placeholder}
                style={{width:"100%",background:"#0F1117",border:`1px solid ${apiKeys[pv.id]?P.gold+"44":P.border2}`,borderRadius:"8px",padding:"9px 11px",color:P.text,fontSize:"13px",outline:"none",boxSizing:"border-box",marginBottom:"6px"}}
              />
              <div style={{fontSize:"10px",color:P.muted,marginBottom:"8px"}}>🔗 {pv.hint}</div>
              <div style={{fontSize:"11px",color:P.muted,marginBottom:"4px"}}>モデル</div>
              <select value={aiModels[pv.id]||pv.defaultModel} onChange={e=>setAiModels(prev=>({...prev,[pv.id]:e.target.value}))} style={{width:"100%",background:"#0F1117",border:`1px solid ${P.border2}`,borderRadius:"8px",padding:"9px 11px",color:P.text,fontSize:"13px",outline:"none"}}>
                {pv.models.map(m=><option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          ))}

          <div style={{background:"#1A2235",borderRadius:"10px",padding:"12px 14px",marginBottom:"14px"}}>
            <div style={{fontSize:"11px",color:P.muted,lineHeight:"1.7"}}>
              ⚠️ APIキーはこのデバイスのみに保存されます。他のユーザーには共有されません。<br/>
              使いすぎるとAPIの利用料金が発生します。各サービスの料金をご確認ください。
            </div>
          </div>
          <button onClick={()=>setShowSettings(false)} style={{width:"100%",background:`linear-gradient(135deg,${P.gold},${P.goldDim})`,border:"none",borderRadius:"10px",padding:"12px",color:"#07080C",cursor:"pointer",fontSize:"13px",fontWeight:"700"}}>設定を保存して閉じる</button>
        </Sheet>
      )}

      <style>{`
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
        input::placeholder,textarea::placeholder{color:#2A3848;}
        select option{background:#0F1117;}
        ::-webkit-scrollbar{display:none;}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes fadeDown{from{transform:translateY(-8px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes slideUp{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}
        input[type=range]{height:4px;}
      `}</style>
    </div>
  );
}

// ── Sheet ─────────────────────────────────────────────────────────────────────
function Sheet({ children, onClose, title }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",zIndex:200,display:"flex",alignItems:"flex-end"}} onClick={onClose}>
      <div style={{width:"100%",maxWidth:"500px",margin:"0 auto",background:P.surface,borderRadius:"20px 20px 0 0",padding:"20px 16px 48px",maxHeight:"90vh",overflowY:"auto",animation:"slideUp .3s ease"}} onClick={e=>e.stopPropagation()}>
        <div style={{width:"36px",height:"4px",background:P.border2,borderRadius:"2px",margin:"0 auto 16px"}}/>
        {title&&<div style={{fontSize:"14px",fontWeight:"700",color:P.gold,marginBottom:"14px"}}>{title}</div>}
        {children}
      </div>
    </div>
  );
}

// ── AI Tab ────────────────────────────────────────────────────────────────────
function AiTab({ properties, setProperties, pushNotif, hasKey, onOpenSettings, aiProvider, apiKey, model, providerName }) {
  const [mode, setMode] = useState("search");
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [activePreset, setActivePreset] = useState(null);
  const [chatQ, setChatQ] = useState("");
  const [chatAns, setChatAns] = useState("");
  const [chatLoad, setChatLoad] = useState(false);
  const [candidates, setCandidates] = useState([]);

  const runSearch = async (preset) => {
    setSearching(true); setSearchResult(null); setCandidates([]); setActivePreset(preset.label);
    try {
      const raw = await callAI({ provider:aiProvider, apiKey, model, system:SEARCH_SYSTEM, prompt:preset.prompt });
      const jsonStr = raw.replace(/```json\s*/g,"").replace(/```\s*/g,"").trim();
      setSearchResult(JSON.parse(jsonStr));
    } catch(e) {
      setSearchResult({ summary:`エラー: ${e.message}`, properties:[], market_comment:"" });
    }
    setSearching(false);
  };

  const runChat = async () => {
    if(!chatQ.trim()) return;
    setChatLoad(true); setChatAns("");
    try {
      const ans = await callAI({ provider:aiProvider, apiKey, model, system:CHAT_SYSTEM, prompt:chatQ });
      setChatAns(ans);
    } catch(e) { setChatAns(`エラー: ${e.message}`); }
    setChatLoad(false);
  };

  const toggleCand = (i) => setCandidates(prev=>prev.includes(i)?prev.filter(x=>x!==i):[...prev,i]);
  const addSelected = () => {
    if(!searchResult?.properties) return;
    const items = searchResult.properties.filter((_,i)=>candidates.includes(i)).map(p=>({
      ...p, id:Date.now()+Math.random(), walk:+p.walk||5, pMin:+p.pMin||0, pMax:+p.pMax||0,
      sqm:+p.sqm||70, tsubo:p.tsubo?+p.tsubo:null, lat:+p.lat||35.7, lng:+p.lng||139.7,
      tags:Array.isArray(p.tags)?p.tags:[], watch:false, notify:false, line:p.line||"",
    }));
    setProperties(prev=>[...prev,...items]);
    pushNotif(`${items.length}件を一覧に追加しました`);
    setCandidates([]);
  };

  if (!hasKey) return (
    <div style={{padding:"32px 16px",textAlign:"center"}}>
      <div style={{fontSize:"32px",marginBottom:"12px"}}>🔑</div>
      <div style={{fontSize:"14px",fontWeight:"600",marginBottom:"8px"}}>APIキーが設定されていません</div>
      <div style={{fontSize:"12px",color:P.muted,lineHeight:"1.7",marginBottom:"20px"}}>
        AI機能を使うには、右上の⚙ボタンからAPIキーを設定してください。<br/>
        Claude・ChatGPT・Geminiのいずれかが使えます。
      </div>
      <button onClick={onOpenSettings} style={{background:`linear-gradient(135deg,${P.gold},${P.goldDim})`,border:"none",borderRadius:"10px",padding:"12px 24px",color:"#07080C",cursor:"pointer",fontSize:"13px",fontWeight:"700"}}>⚙ AI設定を開く</button>
    </div>
  );

  return (
    <div style={{padding:"12px 16px"}}>
      {/* Mode switch */}
      <div style={{display:"flex",background:P.surface,borderRadius:"10px",padding:"3px",marginBottom:"14px",border:`1px solid ${P.border}`}}>
        {[["search","🔍 物件を自動検索"],["chat","💬 AI に相談"]].map(([m,l])=>(
          <button key={m} onClick={()=>setMode(m)} style={{flex:1,padding:"9px",borderRadius:"8px",border:"none",background:mode===m?`linear-gradient(135deg,${P.gold},${P.goldDim})`:"transparent",color:mode===m?"#07080C":P.muted,cursor:"pointer",fontSize:"12px",fontWeight:mode===m?"700":"400",transition:"all .2s"}}>{l}</button>
        ))}
      </div>
      <div style={{fontSize:"10px",color:P.muted,marginBottom:"10px",textAlign:"right"}}>使用中: {providerName} / {model}</div>

      {/* SEARCH */}
      {mode==="search"&&(
        <div>
          <div style={{fontSize:"11px",color:P.muted,marginBottom:"10px",lineHeight:"1.6"}}>ボタンを押すとAIが最新物件情報を要約します。気になる物件はそのまま一覧に追加できます。</div>
          <div style={{display:"flex",flexDirection:"column",gap:"8px",marginBottom:"14px"}}>
            {SEARCH_PRESETS.map(p=>(
              <button key={p.label} onClick={()=>runSearch(p)} disabled={searching} style={{background:activePreset===p.label?`${P.gold}18`:P.surface,border:`1px solid ${activePreset===p.label?P.gold+"55":P.border}`,borderRadius:"10px",padding:"12px 14px",color:activePreset===p.label?P.gold:P.sub,cursor:searching?"not-allowed":"pointer",fontSize:"13px",textAlign:"left",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"all .2s"}}>
                <span>{p.label}</span>
                {searching&&activePreset===p.label?<span style={{fontSize:"11px",color:P.muted,animation:"pulse 1s infinite"}}>検索中…</span>:<span style={{fontSize:"11px",color:P.muted}}>→</span>}
              </button>
            ))}
          </div>
          {searchResult&&(
            <div>
              <div style={{background:`${P.gold}10`,border:`1px solid ${P.gold}33`,borderRadius:"10px",padding:"12px 14px",marginBottom:"12px"}}>
                <div style={{fontSize:"10px",color:P.gold,letterSpacing:".1em",marginBottom:"5px"}}>市況サマリー</div>
                <div style={{fontSize:"13px",color:P.text,lineHeight:"1.7"}}>{searchResult.summary}</div>
              </div>
              {searchResult.properties?.length>0&&(
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
                    <div style={{fontSize:"11px",color:P.muted}}>{searchResult.properties.length}件の物件情報</div>
                    {candidates.length>0&&<button onClick={addSelected} style={{background:`linear-gradient(135deg,${P.gold},${P.goldDim})`,border:"none",borderRadius:"8px",padding:"6px 12px",color:"#07080C",fontSize:"12px",fontWeight:"700",cursor:"pointer"}}>{candidates.length}件を追加 →</button>}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:"8px",marginBottom:"12px"}}>
                    {searchResult.properties.map((p,i)=>{
                      const dev=DEVS.find(d=>d.id===p.dev)||DEVS[0];
                      const isSel=candidates.includes(i);
                      const exists=properties.some(ex=>ex.name===p.name);
                      return (
                        <div key={i} onClick={()=>!exists&&toggleCand(i)} style={{background:isSel?`${dev.color}18`:P.card,border:`1px solid ${isSel?dev.color+"66":P.border2}`,borderRadius:"10px",padding:"12px",cursor:exists?"default":"pointer",opacity:exists?.55:1,position:"relative",transition:"all .15s"}}>
                          {exists&&<div style={{position:"absolute",top:"8px",right:"10px",fontSize:"10px",color:P.muted,background:P.surface,padding:"1px 6px",borderRadius:"4px"}}>登録済</div>}
                          {isSel&&<div style={{position:"absolute",top:"8px",right:"10px",fontSize:"12px",color:dev.color}}>✓ 追加予定</div>}
                          <div style={{display:"flex",gap:"8px",alignItems:"flex-start"}}>
                            <div style={{width:"34px",height:"34px",minWidth:"34px",background:`${dev.color}20`,border:`1px solid ${dev.color}44`,borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",fontWeight:"700",color:dev.color}}>{dev.short}</div>
                            <div style={{flex:1}}>
                              <div style={{display:"flex",gap:"5px",marginBottom:"3px",flexWrap:"wrap"}}>
                                <span style={{fontSize:"10px",color:ST_COLOR[p.status]||P.muted,border:`1px solid ${ST_COLOR[p.status]||P.muted}44`,borderRadius:"3px",padding:"1px 5px",fontWeight:"600"}}>{p.status}</span>
                                {p.kind==="used"&&<span style={{fontSize:"10px",color:P.blue,border:`1px solid ${P.blue}44`,borderRadius:"3px",padding:"1px 5px"}}>中古</span>}
                              </div>
                              <div style={{fontSize:"13px",fontWeight:"600",color:P.text,marginBottom:"3px"}}>{p.name}</div>
                              <div style={{fontSize:"11px",color:P.sub,marginBottom:"4px"}}>{p.station} 徒歩{p.walk}分 ／ {p.delivery}</div>
                              <div style={{fontSize:"13px",fontWeight:"700"}}>{p.pMin>=10000?`${(p.pMin/10000).toFixed(1)}億`:p.pMin?.toLocaleString()+"万"}〜{p.pMax>=10000?`${(p.pMax/10000).toFixed(1)}億`:p.pMax?.toLocaleString()+"万"}<span style={{fontSize:"10px",color:P.muted,fontWeight:"400"}}>円</span></div>
                              {p.memo&&<div style={{marginTop:"5px",fontSize:"11px",color:"#A89060",padding:"4px 8px",background:"#C9A96E0C",borderLeft:`2px solid ${P.gold}44`,borderRadius:"0 4px 4px 0"}}>{p.memo}</div>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {searchResult.market_comment&&<div style={{background:P.surface,border:`1px solid ${P.border}`,borderRadius:"10px",padding:"12px 14px"}}><div style={{fontSize:"10px",color:P.muted,letterSpacing:".1em",marginBottom:"5px"}}>市場コメント</div><div style={{fontSize:"12px",color:P.sub,lineHeight:"1.8"}}>{searchResult.market_comment}</div></div>}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* CHAT */}
      {mode==="chat"&&(
        <div>
          <div style={{background:P.surface,border:`1px solid ${P.border}`,borderRadius:"12px",padding:"14px",marginBottom:"12px"}}>
            <textarea value={chatQ} onChange={e=>setChatQ(e.target.value)} rows={3} placeholder="例：川越タワー中古が坪390万の場合、フロント13年後の損益はどう変わる？" style={{width:"100%",background:"#0F1117",border:`1px solid ${P.border2}`,borderRadius:"8px",padding:"10px 12px",color:P.text,fontSize:"13px",outline:"none",resize:"none",boxSizing:"border-box"}}/>
            <button onClick={runChat} disabled={chatLoad} style={{width:"100%",marginTop:"8px",background:chatLoad?P.border2:`linear-gradient(135deg,${P.gold},${P.goldDim})`,border:"none",borderRadius:"9px",padding:"12px",color:chatLoad?P.muted:"#07080C",cursor:chatLoad?"not-allowed":"pointer",fontSize:"13px",fontWeight:"700",transition:"all .2s"}}>{chatLoad?"分析中…":"AI に聞く →"}</button>
          </div>
          <div style={{marginBottom:"12px"}}>
            <div style={{fontSize:"10px",color:"#2A3848",letterSpacing:".1em",marginBottom:"7px"}}>クイック質問</div>
            <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
              {QUICK_QS.map(q=><button key={q} onClick={()=>setChatQ(q)} style={{background:P.surface,border:`1px solid ${P.border2}`,borderRadius:"14px",padding:"5px 11px",color:P.muted,cursor:"pointer",fontSize:"11px"}}>{q}</button>)}
            </div>
          </div>
          {(chatLoad||chatAns)&&(
            <div style={{background:P.surface,border:`1px solid ${P.gold}33`,borderRadius:"12px",padding:"14px"}}>
              <div style={{fontSize:"10px",color:P.gold,letterSpacing:".1em",marginBottom:"8px"}}>AI ANALYSIS</div>
              {chatLoad?<div style={{color:P.muted,fontSize:"13px"}}><span style={{animation:"pulse 1.5s infinite"}}>●</span> 分析中…</div>:<div style={{color:"#C8D4DC",fontSize:"13px",lineHeight:"1.9",whiteSpace:"pre-wrap"}}>{chatAns}</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── AddSheet（URL自動取得 + 手動入力）────────────────────────────────────────
const EMPTY_PROP = { kind:"new",dev:"mitsubishi",name:"",area:"",line:"",station:"",walk:5,pMin:0,pMax:0,sqm:70,tsubo:"",delivery:"",status:"予告",tags:"",memo:"",lat:"",lng:"" };

const URL_EXTRACT_SYSTEM = `あなたは不動産物件情報の抽出専門AIです。与えられたURLと物件名・テキストから物件情報を抽出し、必ず以下のJSON形式のみで返してください（マークダウン・説明文不要）：
{"name":"物件名","dev":"mitsubishi/sumitomo/mitsui/nomura/tokyotatemono/tokyu のいずれか（不明はmitsubishi）","kind":"new または used","area":"都道府県市区町村","line":"沿線名","station":"最寄駅名（駅を除く）","walk":徒歩分数数値,"pMin":最低価格万円数値,"pMax":最高価格万円数値,"sqm":専有面積数値,"tsubo":坪単価万円数値orNull,"delivery":"竣工・引渡時期","status":"販売中 or 予告 or 計画中 or 中古売出中","tags":["タグ"],"memo":"特徴や注目点50文字以内","lat":緯度概算数値,"lng":経度概算数値}
不明な項目は空文字や0にしてください。`;

// CSVテキストをパースして物件配列に変換
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) throw new Error("データが1件もありません");

  // BOM除去
  const rawHeader = lines[0].replace(/^\uFEFF/, "");
  const headers = rawHeader.split(",").map(h => h.trim().replace(/^"|"$/g, ""));

  // ヘッダーマッピング（テンプレートの列名 → 内部キー）
  const MAP = {
    "物件名": "name", "種別": "kind", "デベロッパーID": "dev",
    "エリア": "area", "路線": "line", "最寄駅": "station",
    "徒歩分数": "walk", "最低価格_万円": "pMin", "最高価格_万円": "pMax",
    "専有面積_㎡": "sqm", "坪単価_万円": "tsubo", "竣工引渡時期": "delivery",
    "ステータス": "status", "タグ": "tags", "メモ": "memo",
    "緯度": "lat", "経度": "lng", "ウォッチ": "watch",
  };

  const results = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // CSVのセル分割（ダブルクォート対応）
    const cells = [];
    let cur = "", inQ = false;
    for (let c = 0; c < line.length; c++) {
      if (line[c] === '"') { inQ = !inQ; continue; }
      if (line[c] === "," && !inQ) { cells.push(cur.trim()); cur = ""; continue; }
      cur += line[c];
    }
    cells.push(cur.trim());

    const row = {};
    headers.forEach((h, idx) => {
      const key = MAP[h];
      if (key) row[key] = cells[idx] || "";
    });

    if (!row.name) continue; // 物件名が空ならスキップ

    results.push({
      id: Date.now() + Math.random(),
      kind: row.kind === "used" ? "used" : "new",
      dev: DEVS.find(d => d.id === row.dev) ? row.dev : "mitsubishi",
      name: row.name,
      area: row.area || "",
      line: row.line || "",
      station: row.station || "",
      walk: +row.walk || 5,
      pMin: +row.pMin || 0,
      pMax: +row.pMax || 0,
      sqm: +row.sqm || 70,
      tsubo: row.tsubo ? +row.tsubo : null,
      delivery: row.delivery || "",
      status: STATUSES.includes(row.status) ? row.status : "予告",
      tags: row.tags ? row.tags.split(/[,、]/).map(t => t.trim()).filter(Boolean) : [],
      memo: row.memo || "",
      lat: +row.lat || 35.7,
      lng: +row.lng || 139.7,
      watch: row.watch === "true",
      notify: false,
    });
  }
  if (results.length === 0) throw new Error("有効なデータが見つかりませんでした");
  return results;
}

function AddSheet({ onClose, onAdd, onAddMany, hasKey, onOpenSettings, aiProvider, apiKey, model, existingNames }) {
  const [mode, setMode] = useState("url"); // url | manual | csv
  const [urlInput, setUrlInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState("");
  const [form, setForm] = useState(EMPTY_PROP);
  const [showForm, setShowForm] = useState(false);
  // CSV用
  const [csvRows, setCsvRows] = useState([]);
  const [csvError, setCsvError] = useState("");
  const [csvChecked, setCsvChecked] = useState([]);
  const [csvFileName, setCsvFileName] = useState("");
  const fileRef = useState(null);

  const setF = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const switchMode = (m) => {
    setMode(m);
    setShowForm(m === "manual");
    if (m === "manual") setForm(EMPTY_PROP);
    setCsvRows([]); setCsvError(""); setCsvChecked([]); setCsvFileName("");
    setExtractError(""); setUrlInput(""); setNameInput("");
  };

  const extractFromUrl = async () => {
    if (!urlInput.trim() && !nameInput.trim()) { setExtractError("URLまたは物件名を入力してください"); return; }
    if (!hasKey) { onOpenSettings(); return; }
    setExtracting(true); setExtractError("");
    try {
      const prompt = `以下の情報から不動産物件の詳細を抽出してください。\nURL: ${urlInput}\n物件名・キーワード: ${nameInput}\n\nURLにアクセスできない場合は、物件名やURLから読み取れる情報だけで可能な範囲で抽出してください。`;
      const raw = await callAI({ provider: aiProvider, apiKey, model, system: URL_EXTRACT_SYSTEM, prompt });
      const parsed = JSON.parse(raw.replace(/```json\s*/g,"").replace(/```\s*/g,"").trim());
      setForm({
        kind: parsed.kind || "new", dev: parsed.dev || "mitsubishi",
        name: parsed.name || nameInput || "", area: parsed.area || "",
        line: parsed.line || "", station: parsed.station || "",
        walk: parsed.walk || 5, pMin: parsed.pMin || 0, pMax: parsed.pMax || 0,
        sqm: parsed.sqm || 70, tsubo: parsed.tsubo || "", delivery: parsed.delivery || "",
        status: parsed.status || "予告",
        tags: Array.isArray(parsed.tags) ? parsed.tags.join("、") : (parsed.tags || ""),
        memo: parsed.memo || "", lat: parsed.lat || "", lng: parsed.lng || "",
      });
      setShowForm(true);
    } catch (e) {
      setExtractError(`取得に失敗しました。手動入力に切り替えてください。（${e.message}）`);
      setShowForm(true);
    }
    setExtracting(false);
  };

  const handleAdd = () => {
    onAdd({
      ...form, id: Date.now(),
      walk: +form.walk||5, pMin: +form.pMin||0, pMax: +form.pMax||0,
      sqm: +form.sqm||70, tsubo: form.tsubo?+form.tsubo:null,
      lat: +form.lat||35.7, lng: +form.lng||139.7,
      tags: typeof form.tags==="string"?form.tags.split(/[,、]/).map(t=>t.trim()).filter(Boolean):form.tags,
      watch: false, notify: false,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCsvFileName(file.name);
    setCsvError(""); setCsvRows([]); setCsvChecked([]);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const rows = parseCSV(ev.target.result);
        setCsvRows(rows);
        // 登録済みでないものをデフォルトでチェック
        setCsvChecked(rows.map((r, i) => !existingNames.includes(r.name) ? i : null).filter(i => i !== null));
      } catch (err) {
        setCsvError(err.message);
      }
    };
    reader.readAsText(file, "UTF-8");
  };

  const toggleCheck = (i) => setCsvChecked(prev => prev.includes(i) ? prev.filter(x=>x!==i) : [...prev, i]);
  const checkAll = () => setCsvChecked(csvRows.map((_,i)=>i));
  const uncheckAll = () => setCsvChecked([]);

  const handleCsvImport = () => {
    const toAdd = csvRows.filter((_, i) => csvChecked.includes(i));
    onAddMany(toAdd);
  };

  const FIELDS = [
    {l:"種別",k:"kind",t:"sel",opts:[{v:"new",l:"新築"},{v:"used",l:"中古"}]},
    {l:"デベロッパー",k:"dev",t:"sel",opts:DEVS.map(d=>({v:d.id,l:d.short+" "+d.brand}))},
    {l:"物件名",k:"name",t:"text"},{l:"エリア",k:"area",t:"text"},
    {l:"路線",k:"line",t:"text"},{l:"駅名",k:"station",t:"text"},
    {l:"徒歩（分）",k:"walk",t:"number"},{l:"最低価格（万円）",k:"pMin",t:"number"},
    {l:"最高価格（万円）",k:"pMax",t:"number"},{l:"専有面積（㎡）",k:"sqm",t:"number"},
    {l:"坪単価（万円・任意）",k:"tsubo",t:"number"},{l:"竣工・引渡",k:"delivery",t:"text"},
    {l:"ステータス",k:"status",t:"sel",opts:STATUSES.map(s=>({v:s,l:s}))},
    {l:"タグ（カンマ区切り）",k:"tags",t:"text"},{l:"メモ（任意）",k:"memo",t:"text"},
  ];

  return (
    <Sheet onClose={onClose} title="物件を追加">
      {/* Mode Switch */}
      <div style={{display:"flex",background:P.card,borderRadius:"10px",padding:"3px",marginBottom:"16px",border:`1px solid ${P.border}`}}>
        {[["url","🔗 URL取得"],["csv","📂 CSV一括"],["manual","✏️ 手動"]].map(([m,l])=>(
          <button key={m} onClick={()=>switchMode(m)}
            style={{flex:1,padding:"9px",borderRadius:"8px",border:"none",background:mode===m?`linear-gradient(135deg,${P.gold},${P.goldDim})`:"transparent",color:mode===m?"#07080C":P.muted,cursor:"pointer",fontSize:"12px",fontWeight:mode===m?"700":"400",transition:"all .2s"}}>
            {l}
          </button>
        ))}
      </div>

      {/* URL MODE */}
      {mode==="url"&&(
        <div style={{marginBottom:"16px"}}>
          <div style={{fontSize:"11px",color:P.muted,marginBottom:"10px",lineHeight:"1.7"}}>
            SUUMOやデベロッパー公式サイトのURLを貼るか、物件名を入力するとAIが情報を自動入力します。
          </div>
          <div style={{marginBottom:"8px"}}>
            <div style={{fontSize:"11px",color:P.muted,marginBottom:"4px"}}>物件ページのURL（任意）</div>
            <input value={urlInput} onChange={e=>setUrlInput(e.target.value)} placeholder="https://suumo.jp/..."
              style={{width:"100%",background:"#0F1117",border:`1px solid ${P.border2}`,borderRadius:"8px",padding:"9px 11px",color:P.text,fontSize:"13px",outline:"none",boxSizing:"border-box"}}/>
          </div>
          <div style={{marginBottom:"12px"}}>
            <div style={{fontSize:"11px",color:P.muted,marginBottom:"4px"}}>物件名・キーワード（任意）</div>
            <input value={nameInput} onChange={e=>setNameInput(e.target.value)} placeholder="例：パークタワー浦和、プラウド川越"
              style={{width:"100%",background:"#0F1117",border:`1px solid ${P.border2}`,borderRadius:"8px",padding:"9px 11px",color:P.text,fontSize:"13px",outline:"none",boxSizing:"border-box"}}/>
          </div>
          {!hasKey&&<div style={{background:"#1A2235",borderRadius:"8px",padding:"10px 12px",marginBottom:"10px",fontSize:"12px",color:P.muted}}>⚠️ AI自動取得にはAPIキーが必要です。<button onClick={onOpenSettings} style={{background:"none",border:"none",color:P.gold,cursor:"pointer",fontSize:"12px",textDecoration:"underline"}}>⚙ 設定を開く</button></div>}
          {extractError&&<div style={{background:"#F8717118",border:"1px solid #F8717144",borderRadius:"8px",padding:"9px 12px",marginBottom:"10px",fontSize:"12px",color:P.red}}>{extractError}</div>}
          <button onClick={extractFromUrl} disabled={extracting||(!urlInput.trim()&&!nameInput.trim())}
            style={{width:"100%",background:extracting||(!urlInput.trim()&&!nameInput.trim())?P.border2:`linear-gradient(135deg,${P.gold},${P.goldDim})`,border:"none",borderRadius:"9px",padding:"12px",color:extracting||(!urlInput.trim()&&!nameInput.trim())?P.muted:"#07080C",cursor:extracting?"not-allowed":"pointer",fontSize:"13px",fontWeight:"700",transition:"all .2s"}}>
            {extracting?"AIが情報を読み取り中…":"🔍 AIで自動入力する"}
          </button>
          <div style={{marginTop:"10px",fontSize:"10px",color:P.muted,lineHeight:"1.6",textAlign:"center"}}>
            ※ サイトによってはURLのみでは取得できない場合があります。物件名も合わせて入力してください。
          </div>
        </div>
      )}

      {/* CSV MODE */}
      {mode==="csv"&&(
        <div>
          <div style={{fontSize:"11px",color:P.muted,marginBottom:"12px",lineHeight:"1.7"}}>
            Excelテンプレートで作成したCSVファイルを選択すると、複数の物件を一括で追加できます。
          </div>

          {/* ファイル選択 */}
          <label style={{display:"block",cursor:"pointer",marginBottom:"12px"}}>
            <div style={{background:P.card,border:`2px dashed ${P.border2}`,borderRadius:"10px",padding:"20px",textAlign:"center",transition:"border-color .2s"}}>
              <div style={{fontSize:"24px",marginBottom:"6px"}}>📂</div>
              <div style={{fontSize:"13px",color:csvFileName?P.gold:P.sub,fontWeight:csvFileName?"600":"400"}}>
                {csvFileName || "CSVファイルを選択またはドロップ"}
              </div>
              <div style={{fontSize:"10px",color:P.muted,marginTop:"4px"}}>テンプレートをExcelでCSV形式で保存したものを使用</div>
            </div>
            <input type="file" accept=".csv" onChange={handleFileChange} style={{display:"none"}} ref={r=>fileRef[0]=r}/>
          </label>

          {csvError&&<div style={{background:"#F8717118",border:"1px solid #F8717144",borderRadius:"8px",padding:"9px 12px",marginBottom:"10px",fontSize:"12px",color:P.red}}>⚠️ {csvError}</div>}

          {/* プレビュー */}
          {csvRows.length>0&&(
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
                <div style={{fontSize:"11px",color:P.muted}}>{csvRows.length}件読み込み済み / {csvChecked.length}件選択中</div>
                <div style={{display:"flex",gap:"6px"}}>
                  <button onClick={checkAll} style={{background:"none",border:`1px solid ${P.border2}`,borderRadius:"6px",padding:"4px 9px",color:P.sub,cursor:"pointer",fontSize:"11px"}}>全選択</button>
                  <button onClick={uncheckAll} style={{background:"none",border:`1px solid ${P.border2}`,borderRadius:"6px",padding:"4px 9px",color:P.sub,cursor:"pointer",fontSize:"11px"}}>全解除</button>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:"6px",maxHeight:"320px",overflowY:"auto",marginBottom:"14px"}}>
                {csvRows.map((row, i)=>{
                  const dev = DEVS.find(d=>d.id===row.dev)||DEVS[0];
                  const checked = csvChecked.includes(i);
                  const exists = existingNames.includes(row.name);
                  return (
                    <div key={i} onClick={()=>!exists&&toggleCheck(i)} style={{background:checked?`${dev.color}18`:P.card,border:`1px solid ${checked?dev.color+"55":P.border2}`,borderRadius:"8px",padding:"10px 12px",cursor:exists?"default":"pointer",opacity:exists?.5:1,transition:"all .15s",position:"relative"}}>
                      {exists&&<span style={{position:"absolute",top:"8px",right:"8px",fontSize:"9px",color:P.muted,background:P.surface,padding:"1px 5px",borderRadius:"3px"}}>登録済</span>}
                      <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                        <div style={{width:"8px",height:"8px",borderRadius:"50%",background:checked?dev.color:P.border2,flexShrink:0,transition:"background .15s"}}/>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:"12px",fontWeight:"600",color:P.text,marginBottom:"2px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{row.name}</div>
                          <div style={{fontSize:"10px",color:P.sub}}>{row.station}駅 徒歩{row.walk}分 ／ {row.kind==="used"?"中古":"新築"} ／ {row.pMin?row.pMin.toLocaleString()+"万〜":"価格未定"}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button onClick={handleCsvImport} disabled={csvChecked.length===0}
                style={{width:"100%",background:csvChecked.length>0?`linear-gradient(135deg,${P.gold},${P.goldDim})`:P.border2,border:"none",borderRadius:"10px",padding:"12px",color:csvChecked.length>0?"#07080C":P.muted,cursor:csvChecked.length>0?"pointer":"not-allowed",fontSize:"13px",fontWeight:"700"}}>
                {csvChecked.length}件を一括追加する
              </button>
            </div>
          )}

          {/* CSVの作り方ヒント */}
          {csvRows.length===0&&!csvError&&(
            <div style={{background:"#1A2235",borderRadius:"8px",padding:"12px 14px",fontSize:"11px",color:P.muted,lineHeight:"1.8"}}>
              <div style={{fontWeight:"600",color:P.sub,marginBottom:"6px"}}>📋 CSVの作り方</div>
              1. テンプレートのExcelをダウンロード（このチャットから入手可）<br/>
              2. Excelでデータを入力<br/>
              3. 「名前をつけて保存」→「CSV（コンマ区切り）」を選択<br/>
              4. 保存したCSVファイルをここで選択
            </div>
          )}
        </div>
      )}

      {/* FORM（自動入力後 or 手動） */}
      {showForm&&(
        <div>
          {mode==="url"&&(
            <div style={{background:`${P.gold}10`,border:`1px solid ${P.gold}33`,borderRadius:"8px",padding:"9px 12px",marginBottom:"12px",fontSize:"12px",color:P.gold}}>
              ✓ 情報を取得しました。内容を確認・修正してから追加してください。
            </div>
          )}
          <div style={{display:"grid",gap:"10px",marginBottom:"16px"}}>
            {FIELDS.map(f=>(
              <div key={f.k}>
                <div style={{fontSize:"11px",color:P.muted,marginBottom:"4px"}}>{f.l}</div>
                {f.t==="sel"
                  ?<select value={form[f.k]} onChange={e=>setF(f.k,e.target.value)} style={{width:"100%",background:P.card,border:`1px solid ${P.border2}`,borderRadius:"8px",padding:"9px 11px",color:P.text,fontSize:"13px",outline:"none"}}>
                    {f.opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                  :<input type={f.t} value={form[f.k]} onChange={e=>setF(f.k,e.target.value)}
                    style={{width:"100%",background:P.card,border:`1px solid ${form[f.k]?P.gold+"33":P.border2}`,borderRadius:"8px",padding:"9px 11px",color:P.text,fontSize:"13px",outline:"none",boxSizing:"border-box"}}/>
                }
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}}>
            <button onClick={onClose} style={{background:P.card,border:`1px solid ${P.border2}`,borderRadius:"10px",padding:"12px",color:P.sub,cursor:"pointer",fontSize:"13px"}}>キャンセル</button>
            <button onClick={handleAdd} disabled={!form.name} style={{background:form.name?`linear-gradient(135deg,${P.gold},${P.goldDim})`:"#1E2535",border:"none",borderRadius:"10px",padding:"12px",color:form.name?"#07080C":P.muted,cursor:form.name?"pointer":"not-allowed",fontSize:"13px",fontWeight:"700"}}>追加する</button>
          </div>
        </div>
      )}
    </Sheet>
  );
}
  const [mode, setMode] = useState("url"); // url | manual
  const [urlInput, setUrlInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState("");
  const [form, setForm] = useState(EMPTY_PROP);
  const [showForm, setShowForm] = useState(false);

  const setF = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const extractFromUrl = async () => {
    if (!urlInput.trim() && !nameInput.trim()) {
      setExtractError("URLまたは物件名を入力してください");
      return;
    }
    if (!hasKey) { onOpenSettings(); return; }
    setExtracting(true);
    setExtractError("");
    try {
      const prompt = `以下の情報から不動産物件の詳細を抽出してください。\nURL: ${urlInput}\n物件名・キーワード: ${nameInput}\n\nURLにアクセスできない場合は、物件名やURLから読み取れる情報（デベロッパー名・エリア・駅名など）だけで可能な範囲で抽出してください。`;
      const raw = await callAI({ provider: aiProvider, apiKey, model, system: URL_EXTRACT_SYSTEM, prompt });
      const jsonStr = raw.replace(/```json\s*/g,"").replace(/```\s*/g,"").trim();
      const parsed = JSON.parse(jsonStr);
      setForm({
        kind: parsed.kind || "new",
        dev: parsed.dev || "mitsubishi",
        name: parsed.name || nameInput || "",
        area: parsed.area || "",
        line: parsed.line || "",
        station: parsed.station || "",
        walk: parsed.walk || 5,
        pMin: parsed.pMin || 0,
        pMax: parsed.pMax || 0,
        sqm: parsed.sqm || 70,
        tsubo: parsed.tsubo || "",
        delivery: parsed.delivery || "",
        status: parsed.status || "予告",
        tags: Array.isArray(parsed.tags) ? parsed.tags.join("、") : (parsed.tags || ""),
        memo: parsed.memo || "",
        lat: parsed.lat || "",
        lng: parsed.lng || "",
      });
      setShowForm(true);
    } catch (e) {
      setExtractError(`取得に失敗しました。手動入力に切り替えてください。（${e.message}）`);
      setShowForm(true);
    }
    setExtracting(false);
  };

  const handleAdd = () => {
    const prop = {
      ...form,
      id: Date.now(),
      walk: +form.walk || 5,
      pMin: +form.pMin || 0,
      pMax: +form.pMax || 0,
      sqm: +form.sqm || 70,
      tsubo: form.tsubo ? +form.tsubo : null,
      lat: +form.lat || 35.7,
      lng: +form.lng || 139.7,
      tags: typeof form.tags === "string" ? form.tags.split(/[,、]/).map(t=>t.trim()).filter(Boolean) : form.tags,
      watch: false,
      notify: false,
    };
    onAdd(prop);
  };

  return (
    <Sheet onClose={onClose} title="物件を追加">
      <div style={{display:"flex",background:P.card,borderRadius:"10px",padding:"3px",marginBottom:"16px",border:`1px solid ${P.border}`}}>
        {[["url","🔗 URL取得"],["csv","📂 CSV一括"],["manual","✏️ 手動"]].map(([m,l])=>(
          <button key={m} onClick={()=>switchMode(m)} style={{flex:1,padding:"9px",borderRadius:"8px",border:"none",background:mode===m?`linear-gradient(135deg,${P.gold},${P.goldDim})`:"transparent",color:mode===m?"#07080C":P.muted,cursor:"pointer",fontSize:"12px",fontWeight:mode===m?"700":"400",transition:"all .2s"}}>{l}</button>
        ))}
      </div>

      {mode==="url"&&(
        <div style={{marginBottom:"16px"}}>
          <div style={{fontSize:"11px",color:P.muted,marginBottom:"10px",lineHeight:"1.7"}}>SUUMOやデベロッパー公式サイトのURLを貼るか、物件名を入力するとAIが情報を自動入力します。</div>
          <div style={{marginBottom:"8px"}}>
            <div style={{fontSize:"11px",color:P.muted,marginBottom:"4px"}}>物件ページのURL（任意）</div>
            <input value={urlInput} onChange={e=>setUrlInput(e.target.value)} placeholder="https://suumo.jp/..." style={{width:"100%",background:"#0F1117",border:`1px solid ${P.border2}`,borderRadius:"8px",padding:"9px 11px",color:P.text,fontSize:"13px",outline:"none",boxSizing:"border-box"}}/>
          </div>
          <div style={{marginBottom:"12px"}}>
            <div style={{fontSize:"11px",color:P.muted,marginBottom:"4px"}}>物件名・キーワード（任意）</div>
            <input value={nameInput} onChange={e=>setNameInput(e.target.value)} placeholder="例：パークタワー浦和、プラウド川越" style={{width:"100%",background:"#0F1117",border:`1px solid ${P.border2}`,borderRadius:"8px",padding:"9px 11px",color:P.text,fontSize:"13px",outline:"none",boxSizing:"border-box"}}/>
          </div>
          {!hasKey&&<div style={{background:"#1A2235",borderRadius:"8px",padding:"10px 12px",marginBottom:"10px",fontSize:"12px",color:P.muted}}>⚠️ AI自動取得にはAPIキーが必要です。<button onClick={onOpenSettings} style={{background:"none",border:"none",color:P.gold,cursor:"pointer",fontSize:"12px",textDecoration:"underline"}}>⚙ 設定を開く</button></div>}
          {extractError&&<div style={{background:"#F8717118",border:"1px solid #F8717144",borderRadius:"8px",padding:"9px 12px",marginBottom:"10px",fontSize:"12px",color:P.red}}>{extractError}</div>}
          <button onClick={extractFromUrl} disabled={extracting||(!urlInput.trim()&&!nameInput.trim())} style={{width:"100%",background:extracting||(!urlInput.trim()&&!nameInput.trim())?P.border2:`linear-gradient(135deg,${P.gold},${P.goldDim})`,border:"none",borderRadius:"9px",padding:"12px",color:extracting||(!urlInput.trim()&&!nameInput.trim())?P.muted:"#07080C",cursor:extracting?"not-allowed":"pointer",fontSize:"13px",fontWeight:"700",transition:"all .2s"}}>
            {extracting?"AIが情報を読み取り中…":"🔍 AIで自動入力する"}
          </button>
          <div style={{marginTop:"10px",fontSize:"10px",color:P.muted,lineHeight:"1.6",textAlign:"center"}}>※ サイトによってはURLのみでは取得できない場合があります。物件名も合わせて入力してください。</div>
        </div>
      )}

      {mode==="csv"&&(
        <div>
          <div style={{fontSize:"11px",color:P.muted,marginBottom:"12px",lineHeight:"1.7"}}>Excelテンプレートで作成したCSVファイルを選択すると、複数の物件を一括で追加できます。</div>
          <label style={{display:"block",cursor:"pointer",marginBottom:"12px"}}>
            <div style={{background:P.card,border:`2px dashed ${P.border2}`,borderRadius:"10px",padding:"20px",textAlign:"center"}}>
              <div style={{fontSize:"24px",marginBottom:"6px"}}>📂</div>
              <div style={{fontSize:"13px",color:csvFileName?P.gold:P.sub,fontWeight:csvFileName?"600":"400"}}>{csvFileName||"CSVファイルを選択"}</div>
              <div style={{fontSize:"10px",color:P.muted,marginTop:"4px"}}>テンプレートをCSV形式で保存したものを使用</div>
            </div>
            <input type="file" accept=".csv" onChange={handleFileChange} style={{display:"none"}}/>
          </label>
          {csvError&&<div style={{background:"#F8717118",border:"1px solid #F8717144",borderRadius:"8px",padding:"9px 12px",marginBottom:"10px",fontSize:"12px",color:P.red}}>⚠️ {csvError}</div>}
          {csvRows.length>0&&(
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
                <div style={{fontSize:"11px",color:P.muted}}>{csvRows.length}件読み込み / {csvChecked.length}件選択中</div>
                <div style={{display:"flex",gap:"6px"}}>
                  <button onClick={checkAll} style={{background:"none",border:`1px solid ${P.border2}`,borderRadius:"6px",padding:"4px 9px",color:P.sub,cursor:"pointer",fontSize:"11px"}}>全選択</button>
                  <button onClick={uncheckAll} style={{background:"none",border:`1px solid ${P.border2}`,borderRadius:"6px",padding:"4px 9px",color:P.sub,cursor:"pointer",fontSize:"11px"}}>全解除</button>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:"6px",maxHeight:"300px",overflowY:"auto",marginBottom:"14px"}}>
                {csvRows.map((row,i)=>{
                  const dev=DEVS.find(d=>d.id===row.dev)||DEVS[0];
                  const checked=csvChecked.includes(i);
                  const exists=existingNames.includes(row.name);
                  return (
                    <div key={i} onClick={()=>!exists&&toggleCheck(i)} style={{background:checked?`${dev.color}18`:P.card,border:`1px solid ${checked?dev.color+"55":P.border2}`,borderRadius:"8px",padding:"10px 12px",cursor:exists?"default":"pointer",opacity:exists?.5:1,position:"relative",transition:"all .15s"}}>
                      {exists&&<span style={{position:"absolute",top:"8px",right:"8px",fontSize:"9px",color:P.muted,background:P.surface,padding:"1px 5px",borderRadius:"3px"}}>登録済</span>}
                      <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                        <div style={{width:"8px",height:"8px",borderRadius:"50%",background:checked?dev.color:P.border2,flexShrink:0}}/>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:"12px",fontWeight:"600",color:P.text,marginBottom:"2px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{row.name}</div>
                          <div style={{fontSize:"10px",color:P.sub}}>{row.station}駅 徒歩{row.walk}分 / {row.kind==="used"?"中古":"新築"} / {row.pMin?row.pMin.toLocaleString()+"万〜":"価格未定"}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button onClick={handleCsvImport} disabled={csvChecked.length===0} style={{width:"100%",background:csvChecked.length>0?`linear-gradient(135deg,${P.gold},${P.goldDim})`:P.border2,border:"none",borderRadius:"10px",padding:"12px",color:csvChecked.length>0?"#07080C":P.muted,cursor:csvChecked.length>0?"pointer":"not-allowed",fontSize:"13px",fontWeight:"700"}}>
                {csvChecked.length}件を一括追加する
              </button>
            </div>
          )}
          {csvRows.length===0&&!csvError&&(
            <div style={{background:"#1A2235",borderRadius:"8px",padding:"12px 14px",fontSize:"11px",color:P.muted,lineHeight:"1.8"}}>
              <div style={{fontWeight:"600",color:P.sub,marginBottom:"6px"}}>📋 CSVの作り方</div>
              1. テンプレートのExcelをダウンロード<br/>
              2. Excelでデータを入力<br/>
              3. 「名前をつけて保存」→「CSV（コンマ区切り）」を選択<br/>
              4. 保存したCSVファイルをここで選択
            </div>
          )}
        </div>
      )}

      {showForm&&(
        <div>
          {mode==="url"&&<div style={{background:`${P.gold}10`,border:`1px solid ${P.gold}33`,borderRadius:"8px",padding:"9px 12px",marginBottom:"12px",fontSize:"12px",color:P.gold}}>✓ 情報を取得しました。内容を確認・修正してから追加してください。</div>}
          <div style={{display:"grid",gap:"10px",marginBottom:"16px"}}>
            {[
              {l:"種別",k:"kind",t:"sel",opts:[{v:"new",l:"新築"},{v:"used",l:"中古"}]},
              {l:"デベロッパー",k:"dev",t:"sel",opts:DEVS.map(d=>({v:d.id,l:d.short+" "+d.brand}))},
              {l:"物件名",k:"name",t:"text"},{l:"エリア",k:"area",t:"text"},
              {l:"路線",k:"line",t:"text"},{l:"駅名",k:"station",t:"text"},
              {l:"徒歩（分）",k:"walk",t:"number"},{l:"最低価格（万円）",k:"pMin",t:"number"},
              {l:"最高価格（万円）",k:"pMax",t:"number"},{l:"専有面積（㎡）",k:"sqm",t:"number"},
              {l:"坪単価（万円・任意）",k:"tsubo",t:"number"},{l:"竣工・引渡",k:"delivery",t:"text"},
              {l:"ステータス",k:"status",t:"sel",opts:STATUSES.map(s=>({v:s,l:s}))},
              {l:"タグ（カンマ区切り）",k:"tags",t:"text"},{l:"メモ（任意）",k:"memo",t:"text"},
            ].map(f=>(
              <div key={f.k}>
                <div style={{fontSize:"11px",color:P.muted,marginBottom:"4px"}}>{f.l}</div>
                {f.t==="sel"
                  ?<select value={form[f.k]} onChange={e=>setF(f.k,e.target.value)} style={{width:"100%",background:P.card,border:`1px solid ${P.border2}`,borderRadius:"8px",padding:"9px 11px",color:P.text,fontSize:"13px",outline:"none"}}>{f.opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select>
                  :<input type={f.t} value={form[f.k]} onChange={e=>setF(f.k,e.target.value)} style={{width:"100%",background:P.card,border:`1px solid ${form[f.k]?P.gold+"33":P.border2}`,borderRadius:"8px",padding:"9px 11px",color:P.text,fontSize:"13px",outline:"none",boxSizing:"border-box"}}/>
                }
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}}>
            <button onClick={onClose} style={{background:P.card,border:`1px solid ${P.border2}`,borderRadius:"10px",padding:"12px",color:P.sub,cursor:"pointer",fontSize:"13px"}}>キャンセル</button>
            <button onClick={handleAdd} disabled={!form.name} style={{background:form.name?`linear-gradient(135deg,${P.gold},${P.goldDim})`:"#1E2535",border:"none",borderRadius:"10px",padding:"12px",color:form.name?"#07080C":P.muted,cursor:form.name?"pointer":"not-allowed",fontSize:"13px",fontWeight:"700"}}>追加する</button>
          </div>
        </div>
      )}
    </Sheet>
  );
}
