import React, { useState, useMemo } from "react";
import {Slack,KeyRound,ShieldCheck,Database,ChevronDown,ChevronRight,
  Zap,Shield,ShieldAlert,X,FileLock2,UserCheck,Info,ArrowRightLeft,Bot,Wrench,BookOpen,
  Package,Table2,Eye,EyeOff,Lock,Check,PencilLine,UploadCloud,Cloud,Server,Boxes,Plug} from "lucide-react";

/* icon NAME (from the graph) -> lucide component. The only place component identity lives in the HTML. */
import graphData from "./graph.json";
import slackLogo from "./icons/slack-new-logo.svg";
import claudeLogo from "./icons/claude.webp";
import mcpLogo from "./icons/mcp.svg";
import openaiLogo from "./icons/openai.svg";
import "./auth-flow.css";

const ICONS={Slack,KeyRound,ShieldCheck,Database,Bot,Wrench,BookOpen,Package,Table2,Eye,EyeOff,Lock,Check,PencilLine,UploadCloud,ArrowRightLeft,Info,UserCheck,FileLock2,Cloud,Server,Boxes,Plug,Shield,ShieldAlert};
const Icon=({name,...p})=>{const C=ICONS[name]||Info;return <C {...p}/>;};
const show=(depth,min)=> (min==null?true:depth>=min);

/* official platform logo files (in ./icons), rendered as <img>. Keyed by the graph's logo id. */
const LOGO_SRC={slack:slackLogo.src??slackLogo, claude:claudeLogo.src??claudeLogo, mcp:mcpLogo.src??mcpLogo, openai:openaiLogo.src??openaiLogo};
const LOGO_LABEL={slack:"Slack", claude:"Claude", mcp:"MCP", openai:"OpenAI"};
const LOGOS=Object.fromEntries(Object.keys(LOGO_SRC).map(id=>[id,(s=>(<img src={LOGO_SRC[id]} width={s} height={s} alt={LOGO_LABEL[id]} aria-label={LOGO_LABEL[id]} className="object-contain" style={{width:s,height:s}}/>))]));
function PlatformLogos({ids,size=18}){
  return (<div className="flex items-center gap-2">{ids.map(id=>(<span key={id} className="grid place-items-center">{(LOGOS[id]||(()=> <Icon name="Boxes" size={size} className="text-gray-700"/>))(size)}</span>))}</div>);
}

/* ============ resolution rules (what each persona can see) ============ */
function resolve(s,tiers){
  // Note: M2M does NOT force Server Admin — it carries an assigned role (told via signin facets, not by overriding role here).
  const role = s.role;
  const isAdmin = role==="Server Admin";
  const {shared}=s;
  const wantCatalog = true;
  const wantWh = true;

  // entry facts now depend on builder-vs-consumer
  const builder=tiers.builders.includes(role)||isAdmin;
  const agents= builder
    ? {icon:Bot, name:"Agents",state:"full",v:"Can use published agents AND create / publish their own.",note:"builder tier — Creator license"}
    : {icon:Bot, name:"Agents",state:"scoped",v:"Can only USE agents others published — cannot create or publish.",note:"Viewer/Explorer = consume only"};
  const tools= builder
    ? {icon:Wrench, name:"Tools",state:"full",v:"Can run the agent’s tools and (as author) choose which tools it carries.",note:"configuring tools is builder-only"}
    : {icon:Wrench, name:"Tools",state:"scoped",v:"Can run whatever tools the author configured — cannot change them.",note:"tools are fixed per agent"};

  // BRANCH 1 — tool reads data IN ALATION (catalog/metadata)
  const catalog={icon:BookOpen, name:"Catalog data (metadata, lineage, samples)",
    state: isAdmin||role==="Catalog Admin" ? "full":"scoped",
    v: isAdmin||role==="Catalog Admin" ? "Broad — descriptions, lineage, glossary, samples across the catalog."
        : role+"-scoped catalog data via permission grants.",
    note:"governed by your ROLE + catalog grants · never leaves Alation"};

  // BRANCH 2 — tool queries a DATA PRODUCT → warehouse
  let dp;
  if(isAdmin) dp={icon:Package,name:"Reach the data product",state:"full",v:"All of them — admin override, no grant needed.",note:"only Server Admin bypasses grants"};
  else dp={icon:Package,name:"Reach the data product",state:"scoped",v:"Allowed where you hold a grant (per person/group or shared-with-everyone).",note:"governed by per-object sharing, not role"};

  let wh;
  if(shared) wh={icon:Table2,name:"Actual rows & columns",state:"shared",v:"Everyone hits the warehouse as ONE shared login — your individual row/column access and the audit trail are lost.",note:"shared service account is ON"};
  else wh={icon:Table2,name:"Actual rows & columns",state:"user",v:"You reach the warehouse with your OWN database credential, so its native row/column security applies.",note:"default — each person uses their own credential"};

  return {role,isAdmin,wantCatalog,wantWh,
    entry:[agents,tools],
    catalogBranch:[catalog],
    warehouseBranch:[dp,wh]};
}

/* ============ atoms ============ */
function Dropdown({label,value,options,onChange,warn,triggerW="min-w-[140px]"}){
  const [open,setOpen]=useState(false);
  return (
    <div className={"relative "+(open?"z-[60]":"")}>
      <div className="text-[11px] font-medium text-gray-400 mb-1">{label}</div>
      <button onClick={()=>setOpen(o=>!o)}
        className={"flex items-center justify-between gap-2 h-9 pl-3 pr-2 rounded-xl bg-white border shadow-sm text-[13px] font-semibold transition "+triggerW+" "+
          (warn?"border-amber-300 text-amber-700":"border-gray-200 text-gray-800 hover:border-violet-300")}>
        <span className="truncate">{value}</span><ChevronDown size={15} className="text-gray-400 shrink-0"/></button>
      {open &&
        <div className="pop-in absolute z-[60] mt-1 w-[230px] rounded-xl bg-white border border-gray-100 shadow-[0_16px_40px_-12px_rgba(17,24,39,.3)] p-1.5">
          {options.map(o=>{const val=typeof o==="string"?o:o.v;const note=typeof o==="string"?null:o.note;
            return (
            <button key={val} onClick={()=>{onChange(val);setOpen(false);}}
              className={"w-full text-left px-2.5 py-2 rounded-lg hover:bg-gray-50 transition "+(val===value?"bg-violet-50":"")}>
              <div className={"text-[13px] font-medium "+(val===value?"text-violet-700":"text-gray-800")}>{val}</div>
              {note&&<div className="text-[11px] text-gray-400 mt-0.5">{note}</div>}
            </button>);})}
        </div>}
    </div>);
}

function Node({n,selected,onClick}){
  return (
    <button onClick={onClick}
      className={"w-[340px] text-left rounded-2xl px-4 py-3.5 bg-white border flex items-center gap-3.5 transition "+
        (selected?"border-violet-400 shadow-[0_8px_24px_-10px_rgba(17,24,39,.35)]":"border-gray-200/90 shadow-[0_4px_14px_-8px_rgba(17,24,39,.22)] hover:border-gray-300")}>
      {n.logos
        ? <div className="h-11 shrink-0 grid place-items-center rounded-xl bg-white border border-gray-200 px-2.5"><PlatformLogos ids={n.logos}/></div>
        : <div className={"h-11 w-11 shrink-0 grid place-items-center rounded-xl "+n.wrap}><Icon name={n.icon} size={20} className={n.color}/></div>}
      <div className="min-w-0"><div className="text-[15px] font-semibold text-gray-800 leading-tight">{n.title}</div>
        <div className="text-[12px] text-gray-400 mt-0.5">{n.sub}</div></div>
    </button>);
}

/* capability chips under a node — lit if the current role is allowed, greyed otherwise */
function CapList({caps,role,depth,width="w-[340px]"}){
  const vis=caps.filter(c=>show(depth,c.min_level));
  if(!vis.length) return null;
  return (
    <div className={width+" mt-1.5 flex flex-col gap-1"}>
      {vis.map(c=>{const ok=c.roles.includes(role);
        return (
        <div key={c.id} title={c.why}
          className={"group flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-[11.5px] transition cursor-default "+
            (ok?"bg-white border-green-200 text-gray-700":"bg-gray-50 border-gray-100 text-gray-300")}>
          <span className={"h-4 w-4 grid place-items-center rounded-full shrink-0 "+(ok?"bg-green-100 text-green-600":"bg-gray-100 text-gray-300")}>
            {ok?<Check size={11}/>:<X size={10}/>}</span>
          <Icon name={c.icon} size={12} className={ok?"text-gray-400 shrink-0":"text-gray-300 shrink-0"}/>
          <span className={"font-medium truncate "+(ok?"":"line-through decoration-gray-200")}>{c.label}</span>
        </div>);})}
    </div>);
}

/* smaller node used inside the two branches */
function MiniNode({n,active,danger,selected,onClick}){
  return (
    <button onClick={onClick}
      className={"w-[230px] text-left rounded-xl px-3 py-2.5 bg-white border flex items-center gap-2.5 transition "+
        (!active?"opacity-45 grayscale border-gray-200":
         danger?"border-amber-300 shadow-[0_5px_16px_-8px_rgba(245,158,11,.5)]":
         selected?"border-violet-400 shadow-[0_6px_18px_-10px_rgba(17,24,39,.4)]":"border-gray-200/90 shadow-[0_3px_10px_-7px_rgba(17,24,39,.3)] hover:border-gray-300")}>
      <div className={"h-9 w-9 shrink-0 grid place-items-center rounded-lg "+(danger?"bg-amber-100":n.wrap)}>
        {danger?<ArrowRightLeft size={16} className="text-amber-600"/>:<Icon name={n.icon} size={16} className={n.color}/>}</div>
      <div className="min-w-0"><div className="text-[13px] font-semibold text-gray-800 leading-tight truncate">{n.title}</div>
        <div className="text-[10.5px] text-gray-400 mt-0.5 truncate">{n.sub}</div></div>
    </button>);
}

/* SVG fork: one inlet at top splits into two columns */
function Fork({leftActive,rightActive}){
  return (
    <svg width="496" height="46" className="block">
      <path d="M248,0 L248,16 Q248,23 232,23 L132,23 Q116,23 116,30 L116,46" fill="none"
            stroke={leftActive?"#3b82f6":"#cbd5e1"} strokeWidth="2" strokeDasharray="5 4"/>
      <path d="M248,0 L248,16 Q248,23 264,23 L364,23 Q380,23 380,30 L380,46" fill="none"
            stroke={rightActive?"#16a34a":"#cbd5e1"} strokeWidth="2" strokeDasharray="5 4"/>
    </svg>);
}
/* trust boundary pill the flow crosses */
function Boundary({b,selected,onClick}){
  const ok=b.tone==="ok";const Icon=ok?Shield:ShieldAlert;
  return (
    <div className="relative h-[64px] w-full flex justify-center">
      <div className={"absolute inset-y-1 w-0 border-l-2 border-dashed "+(ok?"border-violet-200":"border-amber-300")}/>
      <div className="absolute top-1/2 -translate-y-1/2">
        <button onClick={onClick}
          className={"flex items-center gap-1.5 pl-2 pr-2.5 h-7 rounded-full border shadow-sm transition text-[11.5px] font-medium "+
            (ok?(selected?"bg-violet-600 border-violet-600 text-white":"bg-white border-violet-200 text-violet-700 hover:border-violet-400")
               :(selected?"bg-amber-500 border-amber-500 text-white":"bg-amber-50 border-amber-300 text-amber-700 hover:border-amber-400 pulse"))}>
          <Icon size={13}/><span>{b.label}</span></button>
      </div>
    </div>);
}

/* ============ live outcome rail (the part that makes it not-a-slide) ============ */
function StateDot({state}){
  const m={full:"bg-green-500",scoped:"bg-violet-500",user:"bg-green-500",shared:"bg-amber-500",hidden:"bg-red-500"};
  return <span className={"h-2.5 w-2.5 rounded-full shrink-0 mt-1.5 "+(m[state]||"bg-gray-300")}/>;
}
function LayerRow({l}){
  return (
    <div className="flex gap-2.5 py-2.5 border-b border-gray-50 last:border-0">
      <StateDot state={l.state}/>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-gray-800"><l.icon size={13} className="text-gray-400"/>{l.name}
          {l.state==="hidden"&&<span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">HIDDEN</span>}
          {l.state==="shared"&&<span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">SHARED</span>}
        </div>
        <div className="text-[11.5px] text-gray-500 mt-0.5 leading-snug">{l.v}</div>
        <div className="text-[10.5px] text-gray-400 mt-1 italic">{l.note}</div>
      </div>
    </div>);
}
function OutcomeRail({R}){
  const dim="opacity-40 grayscale";
  return (
    <div className="w-[336px] shrink-0">
      <div className="sticky top-6">
        <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">What a <span className="text-violet-600">{R.role}</span> can see</div>

        {/* entry */}
        <div className="rounded-2xl bg-white border border-gray-200/90 shadow-[0_4px_14px_-8px_rgba(17,24,39,.2)] overflow-hidden mb-3">
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
            <Bot size={14} className="text-violet-500"/><span className="text-[12px] font-bold text-gray-700">Entry · agent &amp; tools</span></div>
          <div className="px-4">{R.entry.map((l,i)=><LayerRow key={i} l={l}/>)}</div>
        </div>

        {/* branch 1: data IN alation */}
        <div className={"rounded-2xl bg-white border shadow-[0_4px_14px_-8px_rgba(17,24,39,.2)] overflow-hidden mb-3 transition "+(R.wantCatalog?"border-blue-200":"border-gray-200/90 "+dim)}>
          <div className="px-4 py-2.5 bg-blue-50/70 border-b border-blue-100 flex items-center gap-2">
            <BookOpen size={14} className="text-blue-600"/><span className="text-[12px] font-bold text-blue-800">Path A · data in Alation</span>
            <span className="text-[10.5px] text-blue-400 ml-auto">metadata · stays in Alation</span></div>
          <div className="px-4">{R.catalogBranch.map((l,i)=><LayerRow key={i} l={l}/>)}</div>
        </div>

        {/* branch 2: data product → warehouse */}
        <div className={"rounded-2xl bg-white border shadow-[0_4px_14px_-8px_rgba(17,24,39,.2)] overflow-hidden transition "+(R.wantWh?"border-green-200":"border-gray-200/90 "+dim)}>
          <div className="px-4 py-2.5 bg-green-50/70 border-b border-green-100 flex items-center gap-2">
            <Database size={14} className="text-green-600"/><span className="text-[12px] font-bold text-green-800">Path B · data product → warehouse</span>
            <span className="text-[10.5px] text-green-500/80 ml-auto">real rows &amp; columns</span></div>
          <div className="px-4">{R.warehouseBranch.map((l,i)=><LayerRow key={i} l={l}/>)}</div>
        </div>

        <div className="mt-3 flex gap-2 rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5">
          <Info size={14} className="text-violet-500 shrink-0 mt-0.5"/>
          <p className="text-[11.5px] text-gray-500 leading-relaxed">
            One agent, two data paths. <b className="text-blue-700">Path A</b> reads data that lives in Alation (metadata), guarded by your role &amp; grants. <b className="text-green-700">Path B</b> goes through a data product to the real warehouse, and only that path crosses the ⚠ identity boundary.</p>
        </div>
      </div>
    </div>);
}

/* ============ detail popover (progressive disclosure) ============ */
function Detail({sel,s,setShared,onClose,depth}){
  if(!sel) return null; const d=sel.data; const isNode=sel.type==="node";
  const facets=(d.facets||[]).filter(f=>depth>=f.min_level);
  return (
    <div className="pop-in fixed top-1/2 -translate-y-1/2 right-6 w-[360px] max-h-[88vh] overflow-y-auto bg-white border border-gray-100 rounded-2xl shadow-[0_24px_60px_-15px_rgba(17,24,39,.35)] z-50">
      <div className="flex items-center justify-between px-5 h-13 py-3.5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
        <span className={"text-[11px] font-bold uppercase tracking-wider "+(isNode?"text-gray-400":d.tone==="warn"?"text-amber-600":"text-violet-500")}>{isNode?"Step":"Trust boundary"}</span>
        <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-gray-100 text-gray-400"><X size={17}/></button>
      </div>
      <div className="px-5 py-4">
        <h2 className="text-[18px] font-bold text-gray-900 leading-snug">{d.title}</h2>
        <p className="text-[13px] text-gray-600 mt-2 leading-relaxed">{d.plain}</p>
        {isNode&&d.know&&depth>=1&&<div className="mt-3 flex gap-2.5 rounded-xl bg-gray-50 border border-gray-100 px-3.5 py-3"><UserCheck size={16} className="text-violet-500 shrink-0 mt-0.5"/><p className="text-[12.5px] text-gray-600 leading-relaxed">{d.know}</p></div>}
        {d.matters&&<div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-3"><div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-amber-700 mb-1"><Info size={13}/>Why this matters</div><p className="text-[12.5px] text-amber-800 leading-relaxed">{d.matters}</p></div>}
        {d.hasToggle&&
          <div className="mt-3 rounded-xl border border-gray-200 px-3.5 py-3">
            <div className="flex items-center justify-between"><span className="text-[12.5px] font-medium text-gray-700">Use a shared service account</span>
              <button onClick={()=>setShared(v=>!v)} className={"relative h-6 w-11 rounded-full transition "+(s.shared?"bg-amber-500":"bg-gray-300")}><span className={"absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all "+(s.shared?"left-[22px]":"left-0.5")}/></button></div>
            <p className="text-[12px] text-gray-500 mt-2 leading-relaxed">{s.shared?"On: everyone reaches the warehouse as one shared login — per-person rows & audit lost.":"Off (default): each person uses their own credential, so their individual access is enforced."}</p>
          </div>}
        {facets.length>0&&
          <div className="mt-4 space-y-3">
            {facets.map((f,i)=>(
              <div key={i} className="rounded-xl border border-violet-100 bg-violet-50/50 px-3.5 py-3">
                <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-gray-800">{f.label}{f.gap&&<span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">{f.gap}</span>}</div>
                <div className="text-[12px] text-gray-600 mt-1 leading-relaxed">{f.body}</div>
                {f.code&&<code className="block mt-2 text-[11px] text-violet-700 bg-violet-50 border border-violet-100 rounded-md px-2 py-1">{f.code}</code>}
              </div>))}
          </div>}
        {depth>=3&&d.tech&&d.tech.length>0&&
          <div className="mt-4 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Technical detail</div>
            {d.tech.map((t,i)=>(
              <div key={i} className="rounded-xl border border-gray-100 bg-gray-50/70 px-3.5 py-3">
                <div className="text-[12.5px] font-semibold text-gray-800">{t.k}</div>
                <div className="text-[12px] text-gray-600 mt-1 leading-relaxed">{t.g}</div>
                <div className="text-[11.5px] text-gray-500 mt-2"><span className="font-medium text-gray-600">Mechanism:</span> {t.j}</div>
                {t.code&&<code className="block mt-2 text-[11px] text-violet-700 bg-violet-50 border border-violet-100 rounded-md px-2 py-1">{t.code}</code>}
              </div>))}
          </div>}
      </div>
    </div>);
}

/* ============ app ============ */
function DepthControl({personas,depth,setDepth}){
  return (
    <div>
      <div className="text-[11px] font-medium text-gray-400 mb-1">Audience · depth</div>
      <div className="flex rounded-xl bg-gray-100 p-0.5">
        {personas.map(p=>(
          <button key={p.id} onClick={()=>setDepth(p.depth)} title={p.blurb}
            className={"px-3 h-8 rounded-lg text-[12px] font-medium transition "+
              (depth===p.depth?"bg-white shadow-sm text-violet-700":"text-gray-500 hover:text-gray-700")}>
            {p.label}</button>))}
      </div>
    </div>);
}
function InfraRail({infra,depth,onPick,sel}){
  const vis=infra.filter(i=>show(depth,i.min_level));
  if(!vis.length) return null;
  return (
    <div className="mt-2 w-[300px]">
      <div className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 pl-1">infrastructure &amp; credential plane</div>
      <div className="flex flex-col gap-1">
        {vis.map(i=>{const k="infra_"+i.id; const dim=i.verified===false;
          return (
          <button key={i.id} onClick={()=>onPick(k,i)}
            className={"flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-left transition "+
              (sel&&sel.key===k?"border-violet-400 bg-violet-50":dim?"border-dashed border-gray-200 bg-gray-50/50":"border-gray-200/90 bg-white hover:border-gray-300")}>
            <span className={"h-6 w-6 grid place-items-center rounded-md shrink-0 "+(dim?"bg-gray-100":"bg-gray-900")}><Icon name={i.icon} size={13} className={dim?"text-gray-400":"text-white"}/></span>
            <span className="min-w-0"><span className="block text-[11.5px] font-semibold text-gray-800 leading-tight truncate">{i.label}{i.gap&&<span className="ml-1 text-[9px] font-bold text-amber-600">{i.gap}</span>}{dim&&<span className="ml-1 text-[9px] text-gray-400">model</span>}</span><span className="block text-[10px] text-gray-400 truncate">{i.sub}</span></span>
          </button>);})}
      </div>
    </div>);
}
/* first flow node = platform picker. Click a logo to select; shows that platform's blurb
   + which entry points it can reach. Drives the downstream flow via `platform`. */
function PlatformPicker({platforms,platform,setPlatform,selected,onInfo}){
  const cur=platforms.find(pf=>pf.id===platform)||platforms[0];
  const TARGETS=[["agent","published agent"],["tool","tools"],["api","APIs"]];
  return (
    <div className={"w-[340px] rounded-2xl px-4 py-3.5 bg-white border transition "+
      (selected?"border-violet-400 shadow-[0_8px_24px_-10px_rgba(17,24,39,.35)]":"border-gray-200/90 shadow-[0_4px_14px_-8px_rgba(17,24,39,.22)]")}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Incoming request from</span>
        <button onClick={onInfo} title="About the entry point" className="h-5 w-5 grid place-items-center rounded text-gray-300 hover:text-violet-500"><Info size={14}/></button>
      </div>
      <div className="flex items-center gap-2 mt-2">
        {platforms.map(pf=>{const on=pf.id===platform;
          return (
          <button key={pf.id} onClick={()=>setPlatform(pf.id)} title={pf.label}
            className={"flex items-center gap-1.5 h-9 px-2.5 rounded-xl border transition "+
              (on?"border-violet-400 bg-violet-50 shadow-sm":"border-gray-200 bg-white hover:border-gray-300 opacity-60 hover:opacity-100")}>
            <span className="grid place-items-center text-gray-700">{(LOGOS[pf.logo]||(()=> <Icon name="Boxes" size={18}/>))(18)}</span>
            <span className={"text-[12px] font-medium "+(on?"text-violet-700":"text-gray-500")}>{pf.label}</span>
          </button>);})}
      </div>
      <div className="text-[12px] text-gray-600 mt-2.5 leading-relaxed">{cur.blurb}</div>
      <div className="flex items-center gap-1.5 mt-2">
        <span className="text-[10px] font-medium text-gray-400">can enter at</span>
        {TARGETS.map(([k,lbl])=>{const on=cur.reaches.includes(k);
          return <span key={k} className={"text-[10px] font-medium px-1.5 py-0.5 rounded-full border "+(on?"bg-green-50 text-green-700 border-green-200":"bg-gray-50 text-gray-300 border-gray-100 line-through")}>{lbl}</span>;})}
      </div>
    </div>);
}

/* FDE-facing interactive data-product support flow:
   pick a source -> its auth methods; walk the credential decision -> outcome. */
function DPSupportFlow({dp}){
  const [src,setSrc]=useState(dp.sources[0].id);
  const [answers,setAnswers]=useState({}); // step id -> "yes"|"no"
  const cur=dp.sources.find(s=>s.id===src)||dp.sources[0];
  // walk the decision: follow yes/no until we hit an outcome_* target
  const walk=()=>{
    let stepId=dp.decision.steps[0].id, path=[];
    while(true){
      const step=dp.decision.steps.find(s=>s.id===stepId); if(!step) break;
      const ans=answers[step.id]; path.push({step,ans});
      if(!ans) return {path,outcome:null};
      const next=ans==="yes"?step.yes:step.no;
      if(next.startsWith("outcome_")) return {path,outcome:dp.decision.outcomes[next]};
      stepId=next;
    }
    return {path,outcome:null};
  };
  const {path,outcome}=walk();
  const setAns=(id,v)=>setAnswers(a=>{const n={...a};n[id]=v;
    // clear downstream answers so changing an earlier answer re-walks cleanly
    const order=dp.decision.steps.map(s=>s.id), i=order.indexOf(id);
    order.slice(i+1).forEach(k=>delete n[k]); return n;});
  const tone={good:"bg-green-50 border-green-200 text-green-800",warn:"bg-amber-50 border-amber-200 text-amber-800",stop:"bg-red-50 border-red-200 text-red-800"};
  return (
    <div className="mt-12 rounded-2xl border border-gray-200/80 bg-white/70 backdrop-blur-sm shadow-sm p-5 max-w-[1180px]">
      <div className="flex items-center gap-2 mb-1"><Package size={16} className="text-purple-600"/><h2 className="text-[15px] font-bold text-gray-800">Data product support &amp; credentials</h2></div>
      <p className="text-[12px] text-gray-500 mb-4">{dp.lead?dp.lead+" ":""}{dp.rule} <a href={dp.doc_ref} target="_blank" rel="noopener" className="text-violet-600 hover:underline">Docs ↗</a></p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* left: source -> auth methods */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Pick the data source</div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {dp.sources.map(s=>(
              <button key={s.id} onClick={()=>setSrc(s.id)}
                className={"px-2.5 h-7 rounded-lg border text-[12px] font-medium transition "+(src===s.id?"bg-violet-50 border-violet-300 text-violet-700":"bg-white border-gray-200 text-gray-600 hover:border-gray-300")}>{s.label}</button>))}
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-3.5">
            <div className="text-[12px] font-semibold text-gray-800 mb-1.5">{cur.label} — supported auth for Chat</div>
            <div className="flex flex-col gap-1.5">
              {cur.methods.map(m=>(<div key={m} className="flex items-center gap-2 text-[12px] text-gray-700"><Check size={13} className="text-green-600 shrink-0"/>{m}</div>))}
            </div>
            <div className="text-[10.5px] text-gray-400 mt-2.5">Each user authenticates with their own account on {cur.label}.</div>
          </div>
        </div>
        {/* right: credential decision walk */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">{dp.decision.title}</div>
          <div className="text-[10.5px] text-gray-400 mb-3">{dp.decision.intro}</div>
          <div className="flex flex-col gap-2">
            {path.map(({step,ans})=>(
              <div key={step.id} className="rounded-xl border border-gray-200 bg-white p-3">
                <div className="text-[12.5px] font-medium text-gray-800">{step.q}</div>
                <div className="text-[10.5px] text-gray-400 mt-0.5">{step.note}</div>
                <div className="flex gap-2 mt-2">
                  {["yes","no"].map(v=>(
                    <button key={v} onClick={()=>setAns(step.id,v)}
                      className={"px-3 h-7 rounded-lg border text-[12px] font-medium capitalize transition "+(ans===v?"bg-violet-600 border-violet-600 text-white":"bg-white border-gray-200 text-gray-600 hover:border-violet-300")}>{v}</button>))}
                </div>
              </div>))}
            {outcome &&
              <div className={"rounded-xl border p-3.5 "+tone[outcome.kind]}>
                <div className="text-[12.5px] font-bold">{outcome.label}</div>
                <div className="text-[12px] mt-1 leading-relaxed">{outcome.body}</div>
              </div>}
            {!outcome && <div className="text-[11px] text-gray-400 italic px-1">Answer the question(s) above to see which identity runs the query.</div>}
          </div>
        </div>
      </div>
    </div>);
}


/* Pan/zoom viewport for the flow graph. Drag empty space to pan, pinch or
   ctrl/cmd+scroll to zoom toward the cursor; plain scroll pans. The detail
   drawer and persona controls live outside the transform. */
function ZoomCanvas({children}){
  const vpRef=React.useRef(null);
  const contentRef=React.useRef(null);
  const [t,setT]=useState({x:24,y:24,k:1});
  const tRef=React.useRef(t); tRef.current=t;
  const drag=React.useRef(null);
  const clampK=k=>Math.min(2.5,Math.max(0.35,k));

  const fit=React.useCallback(()=>{
    const vp=vpRef.current,c=contentRef.current;
    if(!vp||!c)return;
    const k=clampK(Math.min((vp.clientWidth-48)/c.offsetWidth,(vp.clientHeight-48)/c.offsetHeight,1));
    setT({x:(vp.clientWidth-c.offsetWidth*k)/2,y:24,k});
  },[]);

  React.useLayoutEffect(()=>{fit();},[fit]);

  React.useEffect(()=>{
    const vp=vpRef.current;
    const onWheel=e=>{
      e.preventDefault();
      const {x,y,k}=tRef.current;
      const rect=vp.getBoundingClientRect();
      const px=e.clientX-rect.left,py=e.clientY-rect.top;
      // pinch gestures arrive as ctrl+wheel with finer deltas
      const speed=e.ctrlKey||e.metaKey?0.01:0.002;
      const nk=clampK(k*Math.exp(-e.deltaY*speed));
      setT({k:nk,x:px-(px-x)*(nk/k),y:py-(py-y)*(nk/k)});
    };
    vp.addEventListener("wheel",onWheel,{passive:false});
    return ()=>vp.removeEventListener("wheel",onWheel);
  },[]);

  const onPointerDown=e=>{
    if(e.button!==0)return;
    if(e.target.closest("button, a, input, [role=button]"))return;
    e.preventDefault();
    drag.current={sx:e.clientX,sy:e.clientY,ox:tRef.current.x,oy:tRef.current.y};
    vpRef.current.setPointerCapture(e.pointerId);
  };
  const onPointerMove=e=>{
    if(!drag.current)return;
    const d=drag.current;
    setT(t=>({...t,x:d.ox+e.clientX-d.sx,y:d.oy+e.clientY-d.sy}));
  };
  const endDrag=()=>{drag.current=null;};

  const zoomBy=f=>{
    const vp=vpRef.current;const {x,y,k}=tRef.current;
    const px=vp.clientWidth/2,py=vp.clientHeight/2;
    const nk=clampK(k*f);
    setT({k:nk,x:px-(px-x)*(nk/k),y:py-(py-y)*(nk/k)});
  };

  return (
    <div ref={vpRef} className="afx-viewport" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerLeave={endDrag}>
      <div className="afx-zoom-controls">
        <button aria-label="Zoom out" onClick={()=>zoomBy(1/1.25)}>−</button>
        <span>{Math.round(t.k*100)}%</span>
        <button aria-label="Zoom in" onClick={()=>zoomBy(1.25)}>+</button>
        <button aria-label="Fit to view" onClick={fit}>Fit</button>
      </div>
      <div ref={contentRef} className="afx-zoom-content" style={{transform:`translate(${t.x}px, ${t.y}px) scale(${t.k})`}}>
        {children}
      </div>
    </div>
  );
}

function App(){
  const graph=graphData;
  const [s,setS]=useState({role:"Viewer",signin:"U2M — SSO / interactive",shared:false});
  const set=(k,v)=>setS(o=>({...o,[k]:v}));
  const setShared=fn=>setS(o=>({...o,shared:typeof fn==="function"?fn(o.shared):fn}));
  const [sel,setSel]=useState(null);
  const [depth,setDepth]=useState(0);
  const [platform,setPlatform]=useState("slack");
  const R=useMemo(()=>resolve(s,{builders:graph?graph.presentation.role_tiers.builders:[]}),[s,graph]);
  const pick=(type,key,data)=>setSel(c=>c&&c.key===key?null:{type,key,data});
  const pickInfra=(k,i)=>setSel(c=>c&&c.key===k?null:({type:"node",key:k,data:{title:i.label,plain:i.plain,facets:i.code?[{min_level:0,label:i.verified===false?"Model-level (unverified in code)":"Code reference",body:i.verified===false?"This edge comes from the atlas topology model, not code in these repos.":"Traced to source.",code:i.code,gap:i.gap}]:[]}}));


  const P=graph.presentation, N=P.nodes, B=P.bounds, C=P.caps;
  const curPlatform=(P.platforms||[]).find(pf=>pf.id===platform)||(P.platforms||[])[0]||{reaches:["agent"]};
  const reaches=curPlatform.reaches||["agent"];          // which entry targets this platform can hit
  const reachAgent=reaches.includes("agent");            // does it go through the agent wrapper?
  const bound=id=>B.find(b=>b.id===id)||{id,min_level:0,tone:"ok",label:id,title:id};

  return (
    <div className="afx-root grid-bg relative w-full overflow-x-hidden rounded-2xl">

      <div className="relative z-10 mx-auto px-4 pt-8 pb-10">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="h-7 w-7 grid place-items-center rounded-lg bg-violet-600 text-white shadow-sm"><Zap size={15}/></span>
          <h1 className="text-[18px] font-bold text-gray-800 tracking-tight">Authorization Flow</h1></div>
        <p className="text-[12.5px] text-gray-400 mb-5">From an integration request to data in the warehouse. Pick who’s asking and watch what they can see.</p>

        {/* persona controls */}
        <div className="relative z-30 flex flex-wrap items-end gap-3 mb-9 p-4 rounded-2xl bg-white/70 border border-gray-200/70 shadow-sm backdrop-blur-sm w-fit">
          <DepthControl personas={graph.presentation.personas} depth={depth} setDepth={setDepth}/>
          <div className="h-9 w-px bg-gray-200 mx-1"/>
          <Dropdown label="Acting as (role)" value={s.role} options={P.roles} onChange={v=>set("role",v)} triggerW="w-[150px]"/>
          <Dropdown label="Signed in via" value={s.signin} options={P.signin} onChange={v=>set("signin",v)} warn={s.signin==="M2M — service account"} triggerW="w-[210px]"/>
        </div>

        <ZoomCanvas>
        <div className="flex gap-10 items-start">
          {/* flow */}
          <div className="flex flex-col items-center">
            <PlatformPicker platforms={P.platforms} platform={platform} setPlatform={setPlatform}
              selected={sel&&sel.key==="frontdoor"} onInfo={()=>pick("node","frontdoor",N.frontdoor)}/>
            <div className="h-6 w-0 border-l-2 border-dashed border-violet-200 mt-1.5"/>
            <Node n={N.signin} selected={sel&&sel.key==="signin"} onClick={()=>pick("node","signin",N.signin)}/>
            {show(depth,bound("b1").min_level) && (<Boundary b={bound("b1")} selected={sel&&sel.key==="b1"} onClick={()=>pick("bound","b1",bound("b1"))}/>)}

            {/* three parallel entry paths; the picked platform lights up the ones it can take */}
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">{curPlatform.label} can enter any of these</div>
            <div className="flex gap-3 items-stretch w-[470px]">
              {[{k:"agent",title:"Published agent",sub:"the agent picks the tools",node:N.agent},
                {k:"tool", title:"Tool directly",   sub:"skips the agent wrapper",node:N.tools},
                {k:"api",  title:"REST API",         sub:"skips the agent wrapper",node:N.tools}].map(p=>{const on=reaches.includes(p.k);
                return (
                <button key={p.k} disabled={!on} onClick={()=>on&&pick("node",p.k==="agent"?"agent":"tools",p.node)}
                  className={"flex-1 rounded-xl px-2.5 py-2.5 border text-left transition "+
                    (on?(p.k==="agent"?"bg-violet-50 border-violet-300":"bg-amber-50 border-amber-300")+" hover:shadow-sm":"opacity-40 grayscale border-dashed border-gray-200 bg-white")}>
                  <div className="flex items-center gap-1.5">
                    {p.k==="agent"?<Bot size={14} className="text-violet-600"/>:p.k==="tool"?<Wrench size={14} className="text-amber-600"/>:<ArrowRightLeft size={14} className="text-amber-600"/>}
                    <span className="text-[11.5px] font-semibold text-gray-800">{p.title}</span></div>
                  <div className="text-[9.5px] text-gray-400 mt-0.5">{on?p.sub:"not used by "+curPlatform.label}</div>
                </button>);})}
            </div>
            {reachAgent && <div className="w-[470px] mt-1"><CapList caps={C.agent} role={R.role} depth={depth} width="w-full"/></div>}
            <InfraRail infra={P.infra} depth={depth} sel={sel} onPick={pickInfra}/>
            <div className="mt-1.5 text-[9.5px] text-gray-400">all paths converge on the agent’s tools</div>
            <div className="h-5 w-0 border-l-2 border-dashed border-violet-200 mt-0.5"/>
            <Node n={N.tools} selected={sel&&sel.key==="tools"} onClick={()=>pick("node","tools",N.tools)}/>
            <CapList caps={C.tools} role={R.role} depth={depth}/>

            {/* fork into two data paths */}
            <div className="mt-1.5"><Fork leftActive={R.wantCatalog} rightActive={R.wantWh}/></div>

            <div className="flex gap-9 items-start">
              {/* PATH A — data in Alation */}
              <div className="flex flex-col items-center w-[230px]">
                <div className="text-[10px] font-bold uppercase tracking-wider text-blue-500 mb-2">Path A · in Alation</div>
                <MiniNode n={N.tool_cat} active={R.wantCatalog} selected={sel&&sel.key==="tool_cat"} onClick={()=>pick("node","tool_cat",N.tool_cat)}/>
                <div className={"h-6 w-0 border-l-2 border-dashed "+(R.wantCatalog?"border-blue-300":"border-gray-200")}/>
                <div className={"w-[230px] rounded-xl px-3 py-2.5 border text-center transition "+(R.wantCatalog?"bg-blue-50/70 border-blue-200":"opacity-45 grayscale border-gray-200 bg-white")}>
                  <div className="text-[11.5px] font-semibold text-blue-800">Catalog data returned</div>
                  <div className="text-[10px] text-blue-500 mt-0.5">metadata, lineage, samples · never leaves Alation</div></div>
              </div>

              {/* PATH B — data product → warehouse */}
              <div className="flex flex-col items-center w-[230px]">
                <div className="text-[10px] font-bold uppercase tracking-wider text-green-600 mb-2">Path B · to the warehouse</div>
                <MiniNode n={N.tool_dp} active={R.wantWh} selected={sel&&sel.key==="tool_dp"} onClick={()=>pick("node","tool_dp",N.tool_dp)}/>
                {R.wantWh && <div className="mt-1"><div className="text-[9px] font-bold uppercase tracking-wider text-purple-400 mb-1 pl-1">data-product role</div><CapList caps={C.dp} role={R.role} depth={depth} width="w-[230px]"/></div>}
                {/* ⚠ identity boundary lives ONLY on this branch */}
                <div className="relative h-[52px] w-full flex justify-center">
                  <div className={"absolute inset-y-1 w-0 border-l-2 border-dashed "+(R.wantWh?"border-amber-300":"border-gray-200")}/>
                  <div className="absolute top-1/2 -translate-y-1/2">
                    <button disabled={!R.wantWh} onClick={()=>pick("bound","b2",bound("b2"))}
                      className={"flex items-center gap-1 pl-1.5 pr-2 h-6 rounded-full border shadow-sm text-[10.5px] font-medium transition "+
                        (!R.wantWh?"opacity-40 bg-gray-50 border-gray-200 text-gray-400":
                         sel&&sel.key==="b2"?"bg-amber-500 border-amber-500 text-white":"bg-amber-50 border-amber-300 text-amber-700 hover:border-amber-400 pulse")}>
                      <ShieldAlert size={12}/>identity changes hands</button>
                  </div>
                </div>
                <MiniNode n={{icon:"Database",wrap:"bg-green-100",color:"text-green-600",title:"Warehouse query",sub:s.shared?"as a shared account":"as you"}}
                  active={R.wantWh} danger={R.wantWh&&s.shared}
                  selected={sel&&sel.key==="warehouse"} onClick={()=>pick("node","warehouse",N.warehouse)}/>
              </div>
            </div>
          </div>

          {/* live outcome */}
          <OutcomeRail R={R}/>
        </div>
        </ZoomCanvas>
        {P.dp_support && <DPSupportFlow dp={P.dp_support}/>}
      </div>
      <Detail sel={sel} s={s} setShared={setShared} onClose={()=>setSel(null)} depth={depth}/>
    </div>);
}
export default App;
