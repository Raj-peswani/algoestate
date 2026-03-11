import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useProperties } from "./algo-ui/src/hooks/useProperties.js";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Libre+Baskerville:wght@400;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600;8..60,700&display=swap');`;

const G = `
*{margin:0;padding:0;box-sizing:border-box;}
:root{
  --bg:#fff1e5;
  --surface:#fff7ef;
  --surface2:#f8e6d8;
  --border:#d9c4b4;
  --border2:#b79f8e;
  --ink:#1f1a17;
  --ink2:#2d2521;
  --muted:#6f6258;
  --muted2:#9c8d82;
  --accent:#8d2b1f;
  --accent2:#0f5499;
  --green:#1f6b4a;
  --green-bg:#e9f6ef;
  --green-border:#b9dcc9;
  --amber:#8a5a1b;
  --amber-bg:#fff2db;
  --amber-border:#e9c993;
  --red:#8b1e14;
  --red-bg:#fde9e5;
  --red-border:#e8b7b0;
  --sidebar:232px;
  --topbar:52px;
}
html,body{height:100%;overflow:hidden;}
body{font-family:'Source Serif 4',Georgia,serif;background:var(--bg);color:var(--ink);-webkit-font-smoothing:antialiased;}
.mono{font-family:'DM Mono',monospace;}
.syne{font-family:'Libre Baskerville','Times New Roman',serif;}
.inst{font-family:'Source Serif 4',Georgia,serif;}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-track{background:var(--bg);}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px;}

/* layout */
.shell{display:flex;height:100vh;overflow:hidden;}
.sidebar{
  width:var(--sidebar);flex-shrink:0;
  background:var(--surface);border-right:1px solid var(--border);
  display:flex;flex-direction:column;
}
.main{flex:1;display:flex;flex-direction:column;overflow:hidden;}

/* logo */
.logo-wrap{padding:18px 18px 14px;border-bottom:1px solid var(--border);}
.logo-mark{font-family:'Syne',sans-serif;font-weight:800;font-size:18px;letter-spacing:-0.5px;color:var(--ink);}
.logo-mark span{color:var(--accent);}
.logo-sub{font-family:'DM Mono',monospace;font-size:8px;color:var(--muted);letter-spacing:2px;text-transform:uppercase;margin-top:3px;}

/* ticker */
.ticker-strip{border-bottom:1px solid var(--border);overflow:hidden;height:28px;display:flex;align-items:center;background:var(--surface2);}
.ticker-inner{display:flex;gap:0;animation:scroll 22s linear infinite;width:max-content;}
@keyframes scroll{from{transform:translateX(0);}to{transform:translateX(-50%)}}
.tick-seg{display:flex;align-items:center;padding:0 16px;gap:6px;border-right:1px solid var(--border);height:28px;white-space:nowrap;}
.tick-nm{font-family:'DM Mono',monospace;font-size:9px;color:var(--muted);}
.tick-val{font-family:'DM Mono',monospace;font-size:9px;font-weight:500;color:var(--ink);}
.tick-up{font-family:'DM Mono',monospace;font-size:8px;color:var(--green);}
.tick-dn{font-family:'DM Mono',monospace;font-size:8px;color:var(--red);}

/* nav */
.nav-wrap{flex:1;overflow-y:auto;padding:10px 8px;}
.nav-sec-lbl{font-family:'DM Mono',monospace;font-size:8px;color:var(--muted2);letter-spacing:2px;text-transform:uppercase;padding:0 10px;margin:14px 0 5px;}
.nav-item{
  display:flex;align-items:center;gap:10px;
  width:100%;padding:8px 10px;border-radius:5px;
  background:none;border:none;cursor:pointer;
  font-family:'Source Serif 4',Georgia,serif;font-size:12.5px;font-weight:500;
  color:var(--muted);text-align:left;transition:all .14s;
}
.nav-item:hover{background:var(--bg);color:var(--ink);}
.nav-item.active{background:var(--accent);color:#fff;}
.nav-badge{margin-left:auto;background:var(--red-bg);color:var(--red);font-family:'DM Mono',monospace;font-size:8px;padding:2px 6px;border-radius:3px;border:1px solid var(--red-border);}

/* user bar */
.user-bar{padding:10px 12px;border-top:1px solid var(--border);display:flex;align-items:center;gap:9px;}
.av{width:28px;height:28px;border-radius:4px;background:var(--accent);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;color:#fff;flex-shrink:0;}
.u-name{font-weight:600;font-size:12px;}
.u-role{font-family:'DM Mono',monospace;font-size:8px;color:var(--muted);}
.status-dot{width:7px;height:7px;border-radius:50%;background:#22c55e;margin-left:auto;box-shadow:0 0 0 2px #dcfce7;}

/* topbar */
.topbar{
  display:flex;align-items:center;gap:12px;
  padding:0 22px;height:var(--topbar);flex-shrink:0;
  background:var(--surface);border-bottom:1px solid var(--border);
  position:sticky;top:0;z-index:20;
}
.tb-title{font-family:'Syne',sans-serif;font-weight:700;font-size:17px;letter-spacing:-.3px;}
.tb-crumb{font-family:'DM Mono',monospace;font-size:8px;color:var(--muted);margin-top:2px;}
.tb-spacer{flex:1;}
.tb-clock{font-family:'DM Mono',monospace;font-size:11px;color:var(--accent);font-weight:500;}

/* content */
.content{flex:1;overflow-y:auto;padding:20px 22px;}

/* buttons */
.btn{display:inline-flex;align-items:center;gap:5px;padding:7px 14px;border-radius:5px;font-size:11.5px;font-weight:600;font-family:'Source Serif 4',Georgia,serif;cursor:pointer;border:none;transition:all .14s;letter-spacing:.1px;white-space:nowrap;}
.btn-accent{background:var(--accent);color:#fff;}
.btn-accent:hover{background:#a33508;}
.btn-ghost{background:none;border:1px solid var(--border);color:var(--ink);}
.btn-ghost:hover{border-color:var(--border2);background:var(--bg);}
.btn-green{background:var(--green);color:#fff;}
.btn-sm{padding:5px 11px;font-size:10.5px;}
.btn-xs{padding:3px 8px;font-size:10px;}
.btn-blue{background:var(--accent2);color:#fff;}

/* KPI */
.kpi-row{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px;}
.kpi{
  background:var(--surface);border:1px solid var(--border);border-radius:8px;
  padding:14px 16px;cursor:pointer;transition:all .14s;position:relative;overflow:hidden;
}
.kpi:hover{border-color:var(--border2);box-shadow:0 2px 12px rgba(0,0,0,.05);transform:translateY(-1px);}
.kpi::after{content:'';position:absolute;left:0;bottom:0;right:0;height:2px;background:var(--accent);transform:scaleX(0);transform-origin:left;transition:transform .25s;}
.kpi:hover::after{transform:scaleX(1);}
.kpi-val{font-family:'Syne',sans-serif;font-weight:800;font-size:26px;letter-spacing:-1px;line-height:1.1;}
.kpi-lbl{font-family:'DM Mono',monospace;font-size:8.5px;color:var(--muted);text-transform:uppercase;letter-spacing:1.5px;margin-top:5px;}
.kpi-delta{font-family:'DM Mono',monospace;font-size:9px;margin-top:4px;}
.delta-up{color:var(--green);}
.delta-dn{color:var(--red);}
.kpi-spark{position:absolute;bottom:10px;right:12px;opacity:.5;}

/* sparkline */
.sparkline{display:flex;align-items:flex-end;gap:2px;height:28px;}
.spark-b{width:4px;border-radius:1px;background:var(--accent);opacity:.5;transition:opacity .1s;}
.sparkline:hover .spark-b{opacity:.2;}
.sparkline:hover .spark-b:hover{opacity:1;}

/* search bar */
.search-row{display:flex;gap:8px;margin-bottom:14px;align-items:center;flex-wrap:wrap;}
.search-inp{
  flex:1;min-width:200px;background:var(--surface);border:1px solid var(--border);
  border-radius:6px;padding:8px 13px;font-size:12.5px;font-family:'Source Serif 4',Georgia,serif;
  color:var(--ink);outline:none;transition:border-color .14s;
}
.search-inp::placeholder{color:var(--muted2);}
.search-inp:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(200,65,10,.08);}
.pill{padding:5px 12px;border-radius:20px;font-size:10.5px;font-weight:600;font-family:'Source Serif 4',Georgia,serif;cursor:pointer;border:1px solid var(--border);background:var(--surface);color:var(--muted);transition:all .14s;letter-spacing:.1px;}
.pill:hover{border-color:var(--border2);color:var(--ink);}
.pill.on{background:var(--ink);color:#fff;border-color:var(--ink);}

/* table */
.tbl-wrap{background:var(--surface);border:1px solid var(--border);border-radius:8px;overflow:hidden;}
.tbl-bar{display:flex;align-items:center;gap:8px;padding:11px 16px;border-bottom:1px solid var(--border);}
.tbl-title{font-family:'Syne',sans-serif;font-weight:700;font-size:13px;}
table{width:100%;border-collapse:collapse;}
thead th{
  font-family:'DM Mono',monospace;font-size:8.5px;text-transform:uppercase;
  letter-spacing:1.5px;color:var(--muted);padding:8px 14px;text-align:left;
  border-bottom:1px solid var(--border);background:var(--surface2);
  cursor:pointer;user-select:none;transition:color .14s;white-space:nowrap;
}
thead th:hover{color:var(--accent);}
tbody tr{cursor:pointer;transition:background .1s;border-bottom:1px solid var(--border);}
tbody tr:last-child{border-bottom:none;}
tbody tr:hover{background:var(--surface2);}
tbody tr.sel{background:#fff8f6;border-left:3px solid var(--accent);}
td{padding:10px 14px;font-size:12.5px;vertical-align:middle;}
.td-name{font-weight:600;font-size:13px;}
.td-sub{font-family:'DM Mono',monospace;font-size:9px;color:var(--muted);margin-top:2px;}

/* badges */
.badge{display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:3px;font-family:'DM Mono',monospace;font-size:8.5px;font-weight:500;letter-spacing:.3px;}
.b-office{background:#dbeafe;color:#1d4ed8;border:1px solid #bfdbfe;}
.b-ind{background:#fef3c7;color:#92400e;border:1px solid #fde68a;}
.b-land{background:#dcfce7;color:#166534;border:1px solid #bbf7d0;}
.b-dist{background:#fff1f2;color:#991b1b;border:1px solid #fecdd3;}
.b-dc{background:#f0f4ff;color:#3730a3;border:1px solid #c7d2fe;}
.b-ok{background:var(--green-bg);color:var(--green);border:1px solid var(--green-border);}
.b-warn{background:var(--amber-bg);color:var(--amber);border:1px solid var(--amber-border);}
.b-draft{background:var(--surface2);color:var(--muted);border:1px solid var(--border);}

/* conf bar */
.conf-bar{height:3px;background:var(--bg);border-radius:2px;margin-top:4px;overflow:hidden;}
.conf-fill{height:100%;border-radius:2px;transition:width .4s;}

/* live dot */
.live-dot{width:6px;height:6px;border-radius:50%;background:#22c55e;animation:pulse 1.6s infinite;flex-shrink:0;}
@keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(34,197,94,.4);}50%{opacity:.7;box-shadow:0 0 0 5px rgba(34,197,94,0);}}

/* panel */
.panel{background:var(--surface);border:1px solid var(--border);border-radius:8px;overflow:hidden;margin-bottom:12px;}
.panel-hdr{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-bottom:1px solid var(--border);background:var(--surface2);}
.panel-hdr-title{font-family:'DM Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:var(--muted);}
.panel-body{padding:14px 16px;}

/* building hero */
.b-hero{
  background:var(--ink2);color:#fff;border-radius:8px;
  padding:24px;margin-bottom:14px;position:relative;overflow:hidden;
}
.b-hero::before{content:'';position:absolute;top:-40px;right:-40px;width:160px;height:160px;border-radius:50%;background:rgba(200,65,10,.15);}
.b-grade{font-family:'DM Mono',monospace;font-size:8.5px;letter-spacing:3px;color:rgba(255,255,255,.4);margin-bottom:6px;}
.b-name{font-family:'Syne',sans-serif;font-weight:800;font-size:22px;letter-spacing:-.5px;}
.b-addr{font-size:12px;color:rgba(255,255,255,.55);margin-top:5px;}
.b-stats{display:flex;gap:24px;margin-top:18px;}
.b-stat-v{font-family:'Syne',sans-serif;font-weight:700;font-size:18px;color:var(--accent);color:#f87171;}
.b-stat-k{font-family:'DM Mono',monospace;font-size:8px;color:rgba(255,255,255,.35);letter-spacing:1px;margin-top:2px;}

/* two col */
.two-col{display:grid;grid-template-columns:1fr 310px;gap:14px;}
.three-col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;}

/* tabs */
.tabs{display:flex;gap:0;border-bottom:1px solid var(--border);margin-bottom:14px;}
.tab{padding:9px 16px;font-family:'Source Serif 4',Georgia,serif;font-size:12px;font-weight:600;cursor:pointer;border-bottom:2px solid transparent;color:var(--muted);transition:all .14s;text-transform:capitalize;}
.tab:hover{color:var(--ink);}
.tab.on{border-bottom-color:var(--accent);color:var(--accent);}

/* detail rows */
.d-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);font-size:12.5px;}
.d-row:last-child{border-bottom:none;}
.d-k{font-family:'DM Mono',monospace;font-size:9px;color:var(--muted);}
.d-v{font-weight:600;}

/* stacking plan */
.stack-wrap{background:var(--surface);border:1px solid var(--border);border-radius:8px;overflow:hidden;}
.stack-hdr{display:flex;align-items:center;justify-content:space-between;padding:11px 16px;border-bottom:1px solid var(--border);background:var(--surface2);}
.stack-leg{display:flex;gap:14px;}
.leg-item{display:flex;align-items:center;gap:5px;font-family:'DM Mono',monospace;font-size:8.5px;color:var(--muted);}
.leg-sq{width:10px;height:10px;border-radius:2px;}
.stack-body{padding:14px 16px;display:flex;gap:8px;}
.floor-lbls{display:flex;flex-direction:column;gap:3px;padding-top:2px;}
.floor-lbl{height:30px;display:flex;align-items:center;font-family:'DM Mono',monospace;font-size:8.5px;color:var(--muted);padding-right:8px;white-space:nowrap;}
.stack-rows{flex:1;display:flex;flex-direction:column;gap:3px;}
.s-row{display:flex;gap:3px;height:30px;}
.s-unit{
  flex:1;border-radius:3px;display:flex;align-items:center;justify-content:center;
  font-family:'DM Mono',monospace;font-size:8px;font-weight:500;
  cursor:pointer;transition:all .12s;border:1px solid transparent;
}
.s-unit:hover{transform:scaleY(1.07);z-index:5;filter:brightness(.93);}
.u-occ{background:#dbeafe;color:#1d4ed8;border-color:#bfdbfe;}
.u-avail{background:#dcfce7;color:#166534;border-color:#bbf7d0;}
.u-exp{background:#fef3c7;color:#92400e;border-color:#fde68a;}
.u-vac{background:#fff1f2;color:#991b1b;border-color:#fecdd3;}
.stack-hover-bar{padding:9px 16px;border-top:1px solid var(--border);background:var(--surface2);display:flex;gap:18px;font-size:12px;min-height:38px;align-items:center;}

/* distressed */
.d-card{
  background:var(--surface);border:1px solid var(--border);border-radius:8px;
  padding:16px;margin-bottom:10px;cursor:pointer;transition:all .14s;
  position:relative;border-left:3px solid var(--red-border);
}
.d-card:hover{border-color:var(--border2);border-left-color:#f87171;box-shadow:0 2px 10px rgba(0,0,0,.05);}
.d-card.exp{border-left-color:var(--red);}
.d-title{font-family:'Syne',sans-serif;font-weight:700;font-size:14px;}
.d-auth{font-family:'DM Mono',monospace;font-size:9px;color:var(--muted);margin-top:3px;}
.d-meta-row{display:flex;gap:18px;flex-wrap:wrap;margin-top:12px;}
.d-meta-item{display:flex;flex-direction:column;gap:2px;}
.d-mk{font-family:'DM Mono',monospace;font-size:8px;text-transform:uppercase;letter-spacing:1px;color:var(--muted2);}
.d-mv{font-family:'DM Mono',monospace;font-size:11.5px;font-weight:500;color:var(--ink);}
.d-timeline{margin-top:12px;padding-top:10px;border-top:1px solid var(--border);}
.d-t-item{display:flex;gap:8px;margin-bottom:7px;}
.d-t-dot{width:5px;height:5px;border-radius:50%;background:var(--accent);flex-shrink:0;margin-top:5px;}
.d-t-date{font-family:'DM Mono',monospace;font-size:8.5px;color:var(--muted);min-width:44px;}
.d-t-txt{font-size:12px;color:var(--muted);}
.d-disc{background:var(--red-bg);border:1px solid var(--red-border);border-radius:4px;padding:10px 13px;font-family:'DM Mono',monospace;font-size:8.5px;color:var(--red);margin-top:10px;line-height:1.8;}

/* wizard */
.wiz-steps{display:flex;margin-bottom:26px;position:relative;}
.wiz-steps::before{content:'';position:absolute;top:12px;left:12px;right:12px;height:1px;background:var(--border);z-index:0;}
.wiz-step{display:flex;flex-direction:column;align-items:center;flex:1;position:relative;z-index:1;cursor:pointer;}
.wiz-num{width:24px;height:24px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-family:'DM Mono',monospace;font-size:9px;font-weight:700;transition:all .18s;}
.ws-active .wiz-num{background:var(--accent);color:#fff;}
.ws-done .wiz-num{background:var(--green);color:#fff;}
.ws-future .wiz-num{background:var(--surface);border:1px solid var(--border);color:var(--muted);}
.wiz-lbl{font-family:'DM Mono',monospace;font-size:8px;color:var(--muted);margin-top:6px;text-transform:uppercase;letter-spacing:1px;text-align:center;}
.ws-active .wiz-lbl{color:var(--accent);}
.ws-done .wiz-lbl{color:var(--green);}
.wiz-card{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:26px;}
.f-grid{display:grid;grid-template-columns:1fr 1fr;gap:13px;}
.f-grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:13px;}
.f-blk{display:flex;flex-direction:column;gap:5px;}
.f-full{grid-column:1/-1;}
.f-lbl{font-family:'DM Mono',monospace;font-size:8.5px;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);}
.f-req{color:var(--accent);}
.f-in{background:var(--bg);border:1px solid var(--border);border-radius:5px;padding:8px 11px;font-size:12.5px;font-family:'Source Serif 4',Georgia,serif;color:var(--ink);outline:none;transition:border-color .14s;width:100%;}
.f-in:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(200,65,10,.08);}
.f-in::placeholder{color:var(--muted2);}
.f-sel{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%237a7d85'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;padding-right:28px;}
.f-help{font-family:'DM Mono',monospace;font-size:8px;color:var(--muted2);}
.type-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
.type-card{border:2px solid var(--border);border-radius:8px;padding:20px;text-align:center;cursor:pointer;transition:all .14s;}
.type-card:hover{border-color:var(--border2);background:var(--bg);}
.type-card.sel{border-color:var(--accent);background:#fff8f6;}
.type-ico{font-size:26px;margin-bottom:8px;}
.type-nm{font-family:'Syne',sans-serif;font-weight:700;font-size:14px;}
.type-desc{font-size:11px;color:var(--muted);margin-top:3px;}
.upload-zone{border:2px dashed var(--border);border-radius:7px;padding:26px;text-align:center;cursor:pointer;transition:all .14s;}
.upload-zone:hover{border-color:var(--accent);background:#fff8f6;}
.upload-txt{font-family:'DM Mono',monospace;font-size:9px;color:var(--muted);margin-top:6px;line-height:1.8;}
.task-list{display:flex;flex-direction:column;gap:6px;}
.task{display:flex;align-items:center;gap:10px;padding:9px 12px;border:1px solid var(--border);border-radius:6px;font-size:12.5px;transition:all .12s;cursor:pointer;}
.task:hover{border-color:var(--border2);background:var(--surface2);}
.t-check{width:18px;height:18px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0;}
.t-done .t-check{background:var(--green);color:#fff;}
.t-pend .t-check{background:var(--surface);border:1.5px solid var(--border);}
.t-done .t-name{text-decoration:line-through;color:var(--muted);}
.t-name{flex:1;font-weight:500;}
.wiz-nav{display:flex;justify-content:space-between;align-items:center;margin-top:22px;padding-top:18px;border-top:1px solid var(--border);}

/* map */
.map-container{background:var(--surface);border:1px solid var(--border);border-radius:8px;overflow:hidden;margin-bottom:12px;position:relative;}
.map-svg{width:100%;display:block;}
.map-path{fill:#e8e4dc;stroke:#c8c4bc;stroke-width:.5px;transition:fill .15s;cursor:pointer;}
.map-path:hover{fill:#d4cfc6;}
.map-path.highlight{fill:#fde8e0;}
.city-pin{cursor:pointer;transition:transform .15s;}
.city-pin:hover .pin-circle{r:7;}
.city-pin:hover .pin-ring{opacity:.6;}
.pin-ring{fill:none;stroke:var(--accent);stroke-width:1.5;opacity:.3;animation:pinPulse 2s infinite;}
@keyframes pinPulse{0%,100%{r:10;opacity:.3;}50%{r:14;opacity:.1;}}
.pin-circle{fill:var(--accent);transition:r .15s;}
.pin-label{font-family:'DM Mono',monospace;font-size:7px;fill:var(--ink);font-weight:500;}
.map-tooltip{position:absolute;background:var(--surface);border:1px solid var(--border);border-radius:6px;padding:8px 12px;pointer-events:none;z-index:10;box-shadow:0 4px 16px rgba(0,0,0,.1);min-width:140px;}
.map-city-hdr{font-family:'Syne',sans-serif;font-weight:700;font-size:12px;margin-bottom:4px;}
.map-city-row{font-family:'DM Mono',monospace;font-size:9px;color:var(--muted);display:flex;justify-content:space-between;gap:12px;}
.map-city-val{color:var(--ink);font-weight:500;}

/* admin */
.q-item{display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid var(--border);cursor:pointer;transition:background .1s;}
.q-item:hover{background:var(--surface2);}
.q-flag{width:3px;height:36px;border-radius:2px;flex-shrink:0;}

/* conf range */
input[type=range]{-webkit-appearance:none;height:3px;background:var(--border);border-radius:2px;outline:none;cursor:pointer;}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:13px;height:13px;background:var(--accent);border-radius:3px;cursor:pointer;}

/* toast */
.toast{position:fixed;bottom:20px;right:20px;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:12px 16px;font-size:12px;z-index:9000;box-shadow:0 8px 30px rgba(0,0,0,.12);animation:toastIn .25s ease both;display:flex;align-items:center;gap:10px;max-width:320px;}
@keyframes toastIn{from{opacity:0;transform:translateX(16px);}to{opacity:1;transform:translateX(0);}}
.toast-dot{width:7px;height:7px;border-radius:50%;background:var(--accent);flex-shrink:0;}
.toast-msg{flex:1;font-family:'DM Mono',monospace;font-size:9px;color:var(--ink);line-height:1.6;}
.toast-x{cursor:pointer;color:var(--muted);font-size:14px;padding:0 2px;line-height:1;}

/* unit cards grid */
.unit-cards{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.unit-card{border:1px solid var(--border);border-radius:7px;padding:14px;cursor:pointer;transition:all .14s;}
.unit-card:hover{border-color:var(--accent);box-shadow:0 2px 10px rgba(200,65,10,.08);}
.uc-floor{font-family:'DM Mono',monospace;font-size:9px;color:var(--muted);}
.uc-area{font-family:'Syne',sans-serif;font-weight:800;font-size:18px;letter-spacing:-.5px;margin:4px 0;}
.uc-rent{font-family:'DM Mono',monospace;font-size:11px;}

/* fade anim */
@keyframes fadeUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
.fade{animation:fadeUp .22s ease both;}

/* search engine moat */
.engine-shell{display:flex;flex-direction:column;gap:16px;min-height:calc(100vh - 170px);}
.engine-home{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;gap:14px;}
.engine-logo{font-family:'Libre Baskerville','Times New Roman',serif;font-size:50px;font-weight:700;letter-spacing:-1px;color:var(--ink);}
.engine-tag{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:2px;color:var(--muted);text-transform:uppercase;}
.engine-search{width:min(760px,92%);display:flex;gap:8px;align-items:center;}
.engine-input{flex:1;background:var(--surface);border:1px solid var(--border);border-radius:999px;padding:13px 18px;font-size:16px;font-family:'Source Serif 4',Georgia,serif;color:var(--ink);outline:none;}
.engine-input:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(141,43,31,.12);}
.engine-btns{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;}
.engine-qa{max-width:980px;margin:0 auto;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:18px;}
.engine-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.engine-result{border:1px solid var(--border);background:var(--surface2);border-radius:8px;padding:14px;margin-top:12px;}
`;

/* ─── DATA ─────────────────────── */
const TICKS = [
  ["BKC Mumbai","145","+ 1.2%",true],["Bhiwandi WH","29","- 0.5%",false],
  ["ORR Bengaluru","107","+ 0.8%",true],["Whitefield","95","+ 2.1%",true],
  ["Navi Mumbai Ind","32","- 1.1%",false],["Gurgaon Cyber","142","+ 0.3%",true],
  ["HITEC Hyderabad","88","+ 1.5%",true],["Chennai OMR","68","- 0.2%",false],
  ["Pune MIDC","55","+ 0.7%",true],["Andheri E","128","+ 0.4%",true],
];

const PROPERTIES = [
  {
    ae_property_id:"ae_prop_mum_bkc_0001",
    parcel_id:"MH-MUM-BKC-0001",
    address:{line1:"One BKC, Bandra Kurla Complex",micro_market:"BKC",city:"Mumbai",state:"Maharashtra",pincode:"400051",lat:19.0607,lng:72.8656},
    zoning:"Commercial",
    land_area_sqft:68000,
    fsi:4.0,
    title_status:"Clear",
    buildings:["ae_bldg_onebkc_towa"],
    owners:["ae_own_blackstone_india"],
    loans:["ae_loan_hdfc_bkc_01"],
    distress_events:[],
    public_record_events:["ae_pre_mum_1001"],
    confidence_score:{overall:93,components:{freshness:{score:24,max:25,note:"Updated 5 days ago"},source_count:{score:18,max:20,note:"3 independent sources"},source_tier:{score:22,max:25,note:"2 Tier-1 sources"},verification_method:{score:18,max:20,note:"Doc + site verification"}}},
    created_at:"2024-01-15T09:00:00Z",
    updated_at:"2026-03-02T11:10:00Z"
  },
  {
    ae_property_id:"ae_prop_pun_midc_0004",
    parcel_id:"MH-PUN-CHAKAN-004B",
    address:{line1:"MIDC Plot 4B, Chakan Industrial Area",micro_market:"Chakan",city:"Pune",state:"Maharashtra",pincode:"410501",lat:18.7601,lng:73.8646},
    zoning:"Industrial",
    land_area_sqft:139392,
    fsi:1.5,
    title_status:"Clear",
    buildings:[],
    owners:["ae_own_plot4b_holdco"],
    loans:[],
    distress_events:[],
    public_record_events:["ae_pre_pun_2410"],
    confidence_score:{overall:88,components:{freshness:{score:23,max:25,note:"Updated 9 days ago"},source_count:{score:16,max:20,note:"2 independent sources"},source_tier:{score:20,max:25,note:"Tier-1 + Tier-2"},verification_method:{score:17,max:20,note:"Document match"}}},
    created_at:"2024-03-04T08:00:00Z",
    updated_at:"2026-03-01T14:45:00Z"
  },
  {
    ae_property_id:"ae_prop_tha_bhi_0007",
    parcel_id:"MH-THA-BHI-0007",
    address:{line1:"Bhiwandi Logistics Hub, Thane",micro_market:"Bhiwandi",city:"Thane",state:"Maharashtra",pincode:"421302",lat:19.3002,lng:73.0588},
    zoning:"Industrial",
    land_area_sqft:420000,
    fsi:1.0,
    title_status:"Clear",
    buildings:["ae_bldg_bhi_megad"],
    owners:["ae_own_logipark_reit"],
    loans:["ae_loan_nbfc_bhi_02"],
    distress_events:[],
    public_record_events:["ae_pre_tha_7788"],
    confidence_score:{overall:76,components:{freshness:{score:18,max:25,note:"Updated 26 days ago"},source_count:{score:14,max:20,note:"2 sources"},source_tier:{score:17,max:25,note:"Tier-2 heavy"},verification_method:{score:15,max:20,note:"Cross-source"}}},
    created_at:"2024-06-10T09:15:00Z",
    updated_at:"2026-02-12T08:30:00Z"
  },
  {
    ae_property_id:"ae_prop_blr_orr_0012",
    parcel_id:"KA-BLR-ORR-0012",
    address:{line1:"Prestige Tech Park, Outer Ring Road",micro_market:"ORR",city:"Bengaluru",state:"Karnataka",pincode:"560103",lat:12.9326,lng:77.6937},
    zoning:"Commercial",
    land_area_sqft:120000,
    fsi:3.5,
    title_status:"Clear",
    buildings:["ae_bldg_prestige_t5"],
    owners:["ae_own_prestige_group"],
    loans:["ae_loan_hdfc_blr_05"],
    distress_events:[],
    public_record_events:["ae_pre_blr_3005"],
    confidence_score:{overall:97,components:{freshness:{score:25,max:25,note:"Updated yesterday"},source_count:{score:19,max:20,note:"4 sources"},source_tier:{score:24,max:25,note:"Tier-1 dominant"},verification_method:{score:19,max:20,note:"Site + document match"}}},
    created_at:"2024-01-22T10:00:00Z",
    updated_at:"2026-03-09T10:05:00Z"
  },
  {
    ae_property_id:"ae_prop_son_rai_0017",
    parcel_id:"HR-SON-RAI-0017",
    address:{line1:"Rai Industrial Area, Sonipat",micro_market:"Rai",city:"Sonipat",state:"Haryana",pincode:"131029",lat:28.9088,lng:77.0627},
    zoning:"Industrial",
    land_area_sqft:90000,
    fsi:1.2,
    title_status:"Encumbered",
    buildings:["ae_bldg_rai_cold7"],
    owners:["ae_own_rai_coldchain"],
    loans:["ae_loan_psb_rai_11"],
    distress_events:["ae_dst_son_001"],
    public_record_events:["ae_pre_son_1101"],
    confidence_score:{overall:52,components:{freshness:{score:12,max:25,note:"Updated 47 days ago"},source_count:{score:10,max:20,note:"Single broker source"},source_tier:{score:14,max:25,note:"Tier-2 source"},verification_method:{score:16,max:20,note:"Pending field verification"}}},
    created_at:"2025-08-14T09:40:00Z",
    updated_at:"2026-01-21T12:15:00Z"
  },
  {
    ae_property_id:"ae_prop_mum_gor_0019",
    parcel_id:"MH-MUM-GOR-0019",
    address:{line1:"Nesco IT Park, Goregaon East",micro_market:"Goregaon East",city:"Mumbai",state:"Maharashtra",pincode:"400063",lat:19.1578,lng:72.8562},
    zoning:"Commercial",
    land_area_sqft:56000,
    fsi:3.0,
    title_status:"Clear",
    buildings:["ae_bldg_nesco_6"],
    owners:["ae_own_nesco_ltd"],
    loans:["ae_loan_psu_mum_09"],
    distress_events:[],
    public_record_events:["ae_pre_mum_9022"],
    confidence_score:{overall:85,components:{freshness:{score:21,max:25,note:"Updated 12 days ago"},source_count:{score:17,max:20,note:"3 sources"},source_tier:{score:20,max:25,note:"Mixed Tier-1/2"},verification_method:{score:17,max:20,note:"Document match"}}},
    created_at:"2024-04-28T11:00:00Z",
    updated_at:"2026-02-25T16:05:00Z"
  }
];

const BUILDINGS = [
  {ae_building_id:"ae_bldg_onebkc_towa",ae_property_id:"ae_prop_mum_bkc_0001",name:"One BKC — Tower A",asset_type:"office",grade:"A+",gla_sqft:820000,occupancy_pct:92.1,year_built:2019,asking_rent_range_inr:{min:140,max:150}},
  {ae_building_id:"ae_bldg_bhi_megad",ae_property_id:"ae_prop_tha_bhi_0007",name:"Bhiwandi Mega Warehouse D",asset_type:"industrial",grade:"B+",gla_sqft:620000,occupancy_pct:78.3,year_built:2017,asking_rent_range_inr:{min:27,max:30}},
  {ae_building_id:"ae_bldg_prestige_t5",ae_property_id:"ae_prop_blr_orr_0012",name:"Prestige Tech Park — T5",asset_type:"office",grade:"A+",gla_sqft:138000,occupancy_pct:62.0,year_built:2019,asking_rent_range_inr:{min:102,max:110}},
  {ae_building_id:"ae_bldg_rai_cold7",ae_property_id:"ae_prop_son_rai_0017",name:"Cold Store Unit 7 — Rai",asset_type:"industrial",grade:"Cold Chain",gla_sqft:12000,occupancy_pct:0,year_built:2021,asking_rent_range_inr:{min:52,max:58}},
  {ae_building_id:"ae_bldg_nesco_6",ae_property_id:"ae_prop_mum_gor_0019",name:"Nesco IT Park — Bldg 6",asset_type:"office",grade:"A",gla_sqft:265000,occupancy_pct:88.4,year_built:2016,asking_rent_range_inr:{min:124,max:132}}
];

const UNITS = [
  {ae_unit_id:"ae_unit_bkc_12f",ae_building_id:"ae_bldg_onebkc_towa",floor_number:12,suite_number:"12F",area_rentable_sqft:18400,condition:"Warm Shell",available_from:"2025-03-01"},
  {ae_unit_id:"ae_unit_bhi_d",ae_building_id:"ae_bldg_bhi_megad",floor_number:1,suite_number:"D",area_rentable_sqft:62000,condition:"Bare Shell",available_from:"2025-05-01"},
  {ae_unit_id:"ae_unit_ptp_t5",ae_building_id:"ae_bldg_prestige_t5",floor_number:11,suite_number:"Full Plate",area_rentable_sqft:9200,condition:"Bare Shell",available_from:"2025-03-10"},
  {ae_unit_id:"ae_unit_rai_07",ae_building_id:"ae_bldg_rai_cold7",floor_number:0,suite_number:"Unit 7",area_rentable_sqft:12000,condition:"Fitted",available_from:"2025-07-01"},
  {ae_unit_id:"ae_unit_nesco_6",ae_building_id:"ae_bldg_nesco_6",floor_number:6,suite_number:"6A",area_rentable_sqft:11500,condition:"Warm Shell",available_from:"2025-06-01"}
];

const EVIDENCE_ITEMS = [
  {ae_evi_id:"ae_evi_l001_01",entity_type:"Listing",entity_id:"ae_lst_mum_bkc_001",field_name:"ask_rent_inr_sqft_mo",value:"145",source_type:"Broker Direct",source_ref:"Email dated 2026-02-20",captured_at:"2026-02-20T09:15:00Z",verified_by:"ae_user_admin001",verification_method:"Document Match",verified_at:"2026-02-22T11:40:00Z"},
  {ae_evi_id:"ae_evi_l003_01",entity_type:"Listing",entity_id:"ae_lst_tha_bhi_003",field_name:"ask_rent_inr_sqft_mo",value:"28",source_type:"Internal Survey",source_ref:"Field visit log #SUR-223",captured_at:"2026-01-18T13:00:00Z",verified_by:null,verification_method:"Cross-Source",verified_at:null},
  {ae_evi_id:"ae_evi_l004_01",entity_type:"Listing",entity_id:"ae_lst_blr_orr_004",field_name:"available_from",value:"2025-03-10",source_type:"Public Record",source_ref:"Signed LOI ref LOI-PTP-2025-08",captured_at:"2026-03-08T10:05:00Z",verified_by:"ae_user_admin002",verification_method:"Document Match",verified_at:"2026-03-08T16:30:00Z"},
  {ae_evi_id:"ae_evi_l006_01",entity_type:"Listing",entity_id:"ae_lst_mum_gor_006",field_name:"cam_inr_sqft_mo",value:"30",source_type:"Broker Direct",source_ref:"Call memo CM-112",captured_at:"2026-02-25T12:25:00Z",verified_by:"ae_user_admin001",verification_method:"Cross-Source",verified_at:"2026-02-27T09:00:00Z"}
];

const CANONICAL_LISTINGS = [
  {
    ae_listing_id:"ae_lst_mum_bkc_001",
    ae_property_id:"ae_prop_mum_bkc_0001",
    ae_building_id:"ae_bldg_onebkc_towa",
    ae_unit_id:"ae_unit_bkc_12f",
    asset_type:"office",
    transaction_type:"Lease",
    ask_rent_inr_sqft_mo:145,
    cam_inr_sqft_mo:32,
    area_sqft:18400,
    available_from:"2025-03-01",
    status:"Active",
    verified:true,
    last_verified_at:"2026-03-08T09:00:00Z",
    verification_method:"Document Match",
    confidence_score:{overall:92,components:{freshness:{score:24,max:25,note:"Updated 6 days ago"},source_count:{score:17,max:20,note:"3 sources"},source_tier:{score:22,max:25,note:"Tier-1 heavy"},verification_method:{score:18,max:20,note:"Document verified"}}},
    evidence_items:["ae_evi_l001_01"],
    published_at:"2026-02-15T00:00:00Z",
    change_log:[{timestamp:"2026-03-08T09:00:00Z",field_changed:"ask_rent_inr_sqft_mo",old_value:142,new_value:145,source:"Broker Direct",changed_by:"ae_user_admin001"}],
    trend:[20,35,28,40,38,45,42,50,48,55]
  },
  {
    ae_listing_id:"ae_lst_pun_cha_002",
    ae_property_id:"ae_prop_pun_midc_0004",
    ae_building_id:null,
    ae_unit_id:null,
    asset_type:"land",
    transaction_type:"Sale",
    ask_sale_price_inr:21000000,
    area_acres:3.2,
    available_from:"2025-02-01",
    status:"Active",
    verified:true,
    last_verified_at:"2026-03-03T09:00:00Z",
    verification_method:"Document Match",
    confidence_score:{overall:88,components:{freshness:{score:22,max:25,note:"Updated 10 days ago"},source_count:{score:16,max:20,note:"2 sources"},source_tier:{score:21,max:25,note:"Tier-1 registry + broker"},verification_method:{score:18,max:20,note:"Title docs checked"}}},
    evidence_items:[],
    published_at:"2026-02-12T00:00:00Z",
    change_log:[{timestamp:"2026-03-01T14:00:00Z",field_changed:"ask_sale_price_inr",old_value:22000000,new_value:21000000,source:"Owner Direct",changed_by:"ae_user_brk004"}],
    trend:[30,28,32,29,35,34,38,36,40,42]
  },
  {
    ae_listing_id:"ae_lst_tha_bhi_003",
    ae_property_id:"ae_prop_tha_bhi_0007",
    ae_building_id:"ae_bldg_bhi_megad",
    ae_unit_id:"ae_unit_bhi_d",
    asset_type:"industrial",
    transaction_type:"Lease",
    ask_rent_inr_sqft_mo:28,
    cam_inr_sqft_mo:5,
    area_sqft:62000,
    available_from:"2025-05-01",
    status:"Active",
    verified:false,
    last_verified_at:null,
    verification_method:"Cross-Source",
    confidence_score:{overall:65,components:{freshness:{score:16,max:25,note:"Updated 31 days ago"},source_count:{score:13,max:20,note:"2 sources"},source_tier:{score:17,max:25,note:"Tier-2 source bias"},verification_method:{score:19,max:20,note:"Field survey present"}}},
    evidence_items:["ae_evi_l003_01"],
    published_at:"2026-01-20T00:00:00Z",
    change_log:[{timestamp:"2026-02-10T11:20:00Z",field_changed:"available_from",old_value:"2025-04-01",new_value:"2025-05-01",source:"Owner Update",changed_by:"ae_user_brk010"}],
    trend:[45,40,38,42,35,38,36,40,38,35]
  },
  {
    ae_listing_id:"ae_lst_blr_orr_004",
    ae_property_id:"ae_prop_blr_orr_0012",
    ae_building_id:"ae_bldg_prestige_t5",
    ae_unit_id:"ae_unit_ptp_t5",
    asset_type:"office",
    transaction_type:"Lease",
    ask_rent_inr_sqft_mo:105,
    cam_inr_sqft_mo:30,
    area_sqft:9200,
    available_from:"2025-03-10",
    status:"Active",
    verified:true,
    last_verified_at:"2026-03-09T10:05:00Z",
    verification_method:"Site Visit + Document Match",
    confidence_score:{overall:97,components:{freshness:{score:25,max:25,note:"Updated yesterday"},source_count:{score:19,max:20,note:"4 independent sources"},source_tier:{score:24,max:25,note:"Tier-1 majority"},verification_method:{score:19,max:20,note:"Site + doc verified"}}},
    evidence_items:["ae_evi_l004_01"],
    published_at:"2026-02-28T00:00:00Z",
    change_log:[{timestamp:"2026-03-09T10:05:00Z",field_changed:"confidence_score.overall",old_value:95,new_value:97,source:"Admin Verification",changed_by:"ae_user_admin002"}],
    trend:[60,65,62,70,68,72,75,73,78,80]
  },
  {
    ae_listing_id:"ae_lst_son_rai_005",
    ae_property_id:"ae_prop_son_rai_0017",
    ae_building_id:"ae_bldg_rai_cold7",
    ae_unit_id:"ae_unit_rai_07",
    asset_type:"industrial",
    transaction_type:"Lease",
    ask_rent_inr_sqft_mo:55,
    cam_inr_sqft_mo:9,
    area_sqft:12000,
    available_from:"2025-07-01",
    status:"Withdrawn",
    verified:false,
    last_verified_at:null,
    verification_method:"Pending",
    confidence_score:{overall:40,components:{freshness:{score:10,max:25,note:"Updated 55 days ago"},source_count:{score:8,max:20,note:"Single source"},source_tier:{score:10,max:25,note:"Unclassified source"},verification_method:{score:12,max:20,note:"No completed verification"}}},
    evidence_items:[],
    published_at:"2025-12-01T00:00:00Z",
    change_log:[{timestamp:"2026-01-15T16:12:00Z",field_changed:"status",old_value:"Active",new_value:"Withdrawn",source:"Owner Request",changed_by:"ae_user_brk021"}],
    trend:[20,18,22,19,21,20,23,21,19,22]
  },
  {
    ae_listing_id:"ae_lst_mum_gor_006",
    ae_property_id:"ae_prop_mum_gor_0019",
    ae_building_id:"ae_bldg_nesco_6",
    ae_unit_id:"ae_unit_nesco_6",
    asset_type:"office",
    transaction_type:"Lease",
    ask_rent_inr_sqft_mo:128,
    cam_inr_sqft_mo:30,
    area_sqft:11500,
    available_from:"2025-06-01",
    status:"Active",
    verified:true,
    last_verified_at:"2026-03-05T09:00:00Z",
    verification_method:"Cross-Source",
    confidence_score:{overall:85,components:{freshness:{score:21,max:25,note:"Updated 12 days ago"},source_count:{score:16,max:20,note:"3 sources"},source_tier:{score:20,max:25,note:"Tier-1 and Tier-2 mix"},verification_method:{score:17,max:20,note:"Cross-source verified"}}},
    evidence_items:["ae_evi_l006_01"],
    published_at:"2026-02-20T00:00:00Z",
    change_log:[{timestamp:"2026-02-27T09:00:00Z",field_changed:"cam_inr_sqft_mo",old_value:28,new_value:30,source:"Broker Direct",changed_by:"ae_user_admin001"}],
    trend:[38,42,40,45,43,47,46,50,48,52]
  }
];

const CANONICAL_DISTRESS_EVENTS = [
  {
    ae_distress_id:"ae_dst_mum_001",
    ae_property_id:"ae_prop_mum_bkc_0001",
    route:"SARFAESI",
    status:"Auction Scheduled",
    reserve_price_inr:48500000,
    emd_inr:4850000,
    auction_date:"2025-04-18",
    auction_time:"11:00",
    inspection_window:"2025-04-10 to 2025-04-11",
    asset_type:"office",
    area_sqft:6400,
    lender_name:"Bank of Maharashtra",
    borrower_name:"Confidential SPV",
    documents:["ae_doc_dst_001"],
    watchlist_count:12,
    evidence_items:["ae_evi_dst_001"],
    change_log:[{date:"22 Mar",txt:"Corrigendum: EMD increased from 45L to 48.5L"},{date:"15 Mar",txt:"Original notice published on Baanknet portal"}]
  },
  {
    ae_distress_id:"ae_dst_pun_002",
    ae_property_id:"ae_prop_pun_midc_0004",
    route:"IBC_Liquidation",
    status:"Auction Scheduled",
    reserve_price_inr:19200000,
    emd_inr:1920000,
    auction_date:"2025-04-25",
    auction_time:"10:00",
    inspection_window:"2025-04-14 to 2025-04-15",
    asset_type:"industrial",
    area_sqft:22000,
    lender_name:"IBBI / Resolution Professional",
    borrower_name:"In Liquidation Entity",
    documents:["ae_doc_dst_002"],
    watchlist_count:7,
    evidence_items:["ae_evi_dst_002"],
    change_log:[{date:"20 Mar",txt:"Notice published on eBKray portal"}]
  },
  {
    ae_distress_id:"ae_dst_mum_003",
    ae_property_id:"ae_prop_mum_gor_0019",
    route:"DRT",
    status:"Auction Scheduled",
    reserve_price_inr:114000000,
    emd_inr:11400000,
    auction_date:"2025-05-02",
    auction_time:"14:00",
    inspection_window:"2025-04-22 to 2025-04-23",
    asset_type:"office",
    area_sqft:4200,
    lender_name:"Debt Recovery Tribunal — Mumbai",
    borrower_name:"Defaulting Borrower",
    documents:["ae_doc_dst_003"],
    watchlist_count:9,
    evidence_items:["ae_evi_dst_003"],
    change_log:[{date:"18 Mar",txt:"Addendum: Inspection date revised"},{date:"10 Mar",txt:"Notice published on SEBI portal"}]
  }
];

const formatRelativeDate = (isoDate) => {
  if(!isoDate) return "—";
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffDays = Math.floor(diffMs/(1000*60*60*24));
  if(diffDays <= 0) return "Today";
  if(diffDays === 1) return "Yesterday";
  if(diffDays < 7) return `${diffDays}d ago`;
  if(diffDays < 30) return `${Math.floor(diffDays/7)}w ago`;
  return `${Math.floor(diffDays/30)}mo ago`;
};

const mapListingStatusToUi = (listingStatus, verified) => {
  if(verified) return "verified";
  if(listingStatus === "Withdrawn") return "draft";
  return "pending";
};

const LISTINGS = CANONICAL_LISTINGS.map((l) => {
  const b = BUILDINGS.find((x) => x.ae_building_id === l.ae_building_id);
  const p = PROPERTIES.find((x) => x.ae_property_id === l.ae_property_id);
  const u = UNITS.find((x) => x.ae_unit_id === l.ae_unit_id);

  return {
    id:l.ae_listing_id,
    name:b ? (u ? `${b.name}, ${u.suite_number}` : b.name) : p?.address?.line1 || l.ae_listing_id,
    type:l.asset_type,
    addr:p ? `${p.address.micro_market}, ${p.address.city}` : "Unknown location",
    area:String(l.area_sqft || l.area_acres || 0),
    aU:l.area_acres ? "acres" : "sq ft",
    rent:l.ask_rent_inr_sqft_mo ? String(l.ask_rent_inr_sqft_mo) : "2.1 Cr",
    rU:l.ask_rent_inr_sqft_mo ? "/sqft/mo" : "",
    avail:l.available_from ? new Date(l.available_from).toLocaleDateString("en-IN",{month:"short",year:"numeric"}) : "Immediate",
    status:mapListingStatusToUi(l.status, l.verified),
    conf:l.confidence_score.overall,
    grade:b?.grade || "—",
    lastV:formatRelativeDate(l.last_verified_at),
    spark:l.trend
  };
});

const DISTRESSED = CANONICAL_DISTRESS_EVENTS.map((d) => ({
  id:d.ae_distress_id,
  title:`${d.route.replace("_"," / ")} Auction — ${PROPERTIES.find((p)=>p.ae_property_id===d.ae_property_id)?.address?.line1 || "Linked Asset"}`,
  auth:d.lender_name,
  route:d.route.replace("_"," "),
  aDate:`${new Date(`${d.auction_date}T00:00:00Z`).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})} · ${d.auction_time}`,
  reserve:(d.reserve_price_inr/10000000).toFixed(2)+" Cr",
  emd:(d.emd_inr/100000).toFixed(1)+"L",
  inspect:d.inspection_window.replace(" to ","–"),
  type:d.asset_type,
  area:`${d.area_sqft.toLocaleString("en-IN")} sq ft`,
  updates:d.change_log
}));

const STACK = {
  name:"Prestige Tech Park — Tower 5",
  floors:[
    {f:"15F",units:[{id:"15A",t:"Infosys BPM",s:"occ",a:"4,600 sqft"},{id:"15B",t:"Available",s:"avail",a:"4,600 sqft"}]},
    {f:"14F",units:[{id:"14A",t:"Accenture",s:"occ",a:"4,600 sqft"},{id:"14B",t:"Expiring Q3",s:"exp",a:"2,300 sqft"},{id:"14C",t:"Available",s:"avail",a:"2,300 sqft"}]},
    {f:"13F",units:[{id:"13A",t:"Freshworks",s:"occ",a:"9,200 sqft"}]},
    {f:"12F",units:[{id:"12A",t:"Vacant",s:"vac",a:"4,600 sqft"},{id:"12B",t:"Wipro",s:"occ",a:"4,600 sqft"}]},
    {f:"11F",units:[{id:"11A",t:"Available",s:"avail",a:"9,200 sqft"}]},
    {f:"10F",units:[{id:"10A",t:"Cognizant",s:"occ",a:"4,600 sqft"},{id:"10B",t:"Exp. Q2 2025",s:"exp",a:"4,600 sqft"}]},
  ]
};

const CITIES = [
  {id:"mumbai",name:"Mumbai",lat:19.076, lng:72.8777,listings:312,avgRent:"142",trend:"+1.8%",up:true,labelDx:8,labelDy:3},
  {id:"delhi",name:"Delhi NCR",lat:28.6139, lng:77.209,listings:287,avgRent:"138",trend:"+0.9%",up:true,labelDx:8,labelDy:3},
  {id:"bengaluru",name:"Bengaluru",lat:12.9716, lng:77.5946,listings:256,avgRent:"105",trend:"+2.3%",up:true,labelDx:8,labelDy:3},
  {id:"hyderabad",name:"Hyderabad",lat:17.385, lng:78.4867,listings:198,avgRent:"88",trend:"+1.5%",up:true,labelDx:8,labelDy:3},
  {id:"pune",name:"Pune",lat:18.5204, lng:73.8567,listings:145,avgRent:"92",trend:"+0.7%",up:true,labelDx:8,labelDy:-8},
  {id:"chennai",name:"Chennai",lat:13.0827, lng:80.2707,listings:132,avgRent:"68",trend:"-0.2%",up:false,labelDx:8,labelDy:3},
  {id:"ahmedabad",name:"Ahmedabad",lat:23.0225, lng:72.5714,listings:87,avgRent:"55",trend:"+1.1%",up:true,labelDx:8,labelDy:3},
  {id:"kolkata",name:"Kolkata",lat:22.5726, lng:88.3639,listings:74,avgRent:"62",trend:"-0.4%",up:false,labelDx:8,labelDy:3},
  {id:"gurugram",name:"Gurugram",lat:28.4595, lng:77.0266,listings:168,avgRent:"132",trend:"+1.0%",up:true,labelDx:8,labelDy:-8},
  {id:"noida",name:"Noida",lat:28.5355, lng:77.391,listings:149,avgRent:"104",trend:"+0.6%",up:true,labelDx:8,labelDy:10},
  {id:"jaipur",name:"Jaipur",lat:26.9124, lng:75.7873,listings:58,avgRent:"48",trend:"+0.4%",up:true,labelDx:8,labelDy:3},
  {id:"lucknow",name:"Lucknow",lat:26.8467, lng:80.9462,listings:44,avgRent:"46",trend:"+0.5%",up:true,labelDx:8,labelDy:3},
  {id:"chandigarh",name:"Chandigarh",lat:30.7333, lng:76.7794,listings:41,avgRent:"52",trend:"+0.3%",up:true,labelDx:8,labelDy:-8},
  {id:"surat",name:"Surat",lat:21.1702, lng:72.8311,listings:67,avgRent:"50",trend:"+0.8%",up:true,labelDx:8,labelDy:3},
  {id:"indore",name:"Indore",lat:22.7196, lng:75.8577,listings:52,avgRent:"47",trend:"+0.2%",up:true,labelDx:8,labelDy:3},
  {id:"nagpur",name:"Nagpur",lat:21.1458, lng:79.0882,listings:39,avgRent:"43",trend:"-0.1%",up:false,labelDx:8,labelDy:3},
  {id:"bhubaneswar",name:"Bhubaneswar",lat:20.2961, lng:85.8245,listings:36,avgRent:"45",trend:"+0.7%",up:true,labelDx:8,labelDy:3},
  {id:"vizag",name:"Vizag",lat:17.6868, lng:83.2185,listings:35,avgRent:"49",trend:"+0.4%",up:true,labelDx:8,labelDy:3},
  {id:"kochi",name:"Kochi",lat:9.9312, lng:76.2673,listings:29,avgRent:"56",trend:"+0.6%",up:true,labelDx:8,labelDy:3},
  {id:"coimbatore",name:"Coimbatore",lat:11.0168, lng:76.9558,listings:33,avgRent:"52",trend:"+0.5%",up:true,labelDx:8,labelDy:3},
];

const INDIA_GEO_BOUNDS = { minLat: 6.0, maxLat: 37.5, minLng: 68.0, maxLng: 97.5 };
const INDIA_PLOT_FRAME = { x: 116, y: 56, w: 173, h: 340 };

const WIZ_STEPS=["Asset Type","Location","Tech Specs","Comm. Terms","Evidence","Review"];

/* ─── HELPERS ─────────────────── */
const Sparkline = ({data=[]}) => {
  const mx=Math.max(...data);
  return <div className="sparkline">{data.map((v,i)=><div key={i} className="spark-b" style={{height:`${(v/mx)*100}%`}}/>)}</div>;
};
const Badge=({type})=>{
  const m={office:"b-office",industrial:"b-ind",land:"b-land",distressed:"b-dist",datacenter:"b-dc"};
  const l={office:"Office",industrial:"Industrial",land:"Land",distressed:"Distressed",datacenter:"Data Center"};
  return <span className={`badge ${m[type]||"b-draft"}`}>{l[type]||type}</span>;
};
const ConfBar=({v})=>{
  const c=v>=85?"#166534":v>=60?"#92400e":"#991b1b";
  return <div className="conf-bar"><div className="conf-fill" style={{width:`${v}%`,background:c}}/></div>;
};
const Clock=()=>{
  const [t,setT]=useState(new Date());
  useEffect(()=>{const i=setInterval(()=>setT(new Date()),1000);return()=>clearInterval(i);},[]);
  return <span className="mono tb-clock">{t.toLocaleTimeString("en-IN",{hour12:false})} IST</span>;
};
const Toast=({msg,onClose})=>(
  <div className="toast">
    <div className="toast-dot"/>
    <span className="toast-msg">{msg}</span>
    <span className="toast-x" onClick={onClose}>x</span>
  </div>
);

/* ─── INDIA MAP ─────────────────── */

function IndiaMap({showToast,onCityClick}) {
  const [hovered,setHovered]=useState(null);
  const [activeCity,setActiveCity]=useState(null);
  const [tooltipPos,setTooltipPos]=useState({x:0,y:0});
  const svgRef=useRef(null);

  const getCityPoint = (city) => {
    if(typeof city.lat !== "number" || typeof city.lng !== "number") {
      return { x: city.x ?? 160, y: city.y ?? 210 };
    }
    const x =
      INDIA_PLOT_FRAME.x +
      ((city.lng - INDIA_GEO_BOUNDS.minLng) / (INDIA_GEO_BOUNDS.maxLng - INDIA_GEO_BOUNDS.minLng)) *
        INDIA_PLOT_FRAME.w;
    const y =
      INDIA_PLOT_FRAME.y +
      ((INDIA_GEO_BOUNDS.maxLat - city.lat) / (INDIA_GEO_BOUNDS.maxLat - INDIA_GEO_BOUNDS.minLat)) *
        INDIA_PLOT_FRAME.h;
    return { x, y };
  };

  const handleCityHover=(city,e)=>{
    if(!svgRef.current) return;
    const rect=svgRef.current.getBoundingClientRect();
    const svgW=rect.width;
    const svgH=rect.height;
    const scaleX=svgW/390;
    const scaleY=svgH/420;
    const point=getCityPoint(city);
    setHovered(city);
    setTooltipPos({
      x:point.x*scaleX+rect.left,
      y:point.y*scaleY+rect.top-10
    });
  };

  const handleCityClick=(city)=>{
    setActiveCity(city.id===activeCity?null:city.id);
    showToast(`Viewing ${city.listings} listings in ${city.name} — avg. INR ${city.avgRent}/sqft`);
    onCityClick&&onCityClick(city);
  };

  return (
    <div className="map-container" style={{height:440}}>
      <div className="panel-hdr" style={{borderRadius:0}}>
        <span className="panel-hdr-title">Market Map — India</span>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <div className="live-dot"/>
          <span className="mono" style={{fontSize:8,color:"var(--muted)"}}>
            {CITIES.reduce((s,c)=>s+c.listings,0).toLocaleString()} LISTINGS LIVE
          </span>
        </div>
      </div>
      <div style={{position:"relative",flex:1,background:"#e7eef6",height:395}}>
        <svg ref={svgRef} viewBox="100 30 200 350" className="map-svg" style={{height:"100%",position:"absolute",inset:0}}>
          {/* Ocean background */}
          <rect x="0" y="0" width="400" height="420" fill="#dce8f5"/>
          {/* Accurate India outline from SVG asset */}
          <image href="/india-outline.svg" x="100" y="34" width="200" height="340" preserveAspectRatio="xMidYMid meet"/>
          {/* Cities */}
          {CITIES.map(city=>{
            const point = getCityPoint(city);
            return (
            <g key={city.id} className="city-pin"
              onMouseEnter={e=>handleCityHover(city,e)}
              onMouseLeave={()=>setHovered(null)}
              onClick={()=>handleCityClick(city)}
            >
              <circle cx={point.x} cy={point.y} r={city.id===activeCity?12:10} fill="none" stroke="#c8410a" strokeWidth="1" opacity={city.id===activeCity?.5:.2} className="pin-ring">
                <animate attributeName="r" from="8" to="15" dur="2s" repeatCount="indefinite"/>
                <animate attributeName="opacity" from=".4" to="0" dur="2s" repeatCount="indefinite"/>
              </circle>
              <circle cx={point.x} cy={point.y} r={city.id===activeCity?6:5} fill={city.id===activeCity?"#c8410a":"#c8410a"} opacity={city.id===activeCity?1:.75} className="pin-circle"/>
              <text x={point.x+(city.labelDx??8)} y={point.y+(city.labelDy??3)} className="pin-label" opacity={hovered?.id===city.id||city.id===activeCity?1:.65}>{city.name}</text>
              {city.id===activeCity&&(
                <text x={point.x+(city.labelDx??8)} y={point.y+(city.labelDy??3)+9} fontFamily="DM Mono" fontSize="6" fill="#8d2b1f">INR {city.avgRent}/sqft · {city.listings} listings</text>
              )}
            </g>
          )})}
          {/* Compass */}
          <text x="248" y="50" fontFamily="DM Mono" fontSize="7" fill="#9ca3af">N</text>
          <line x1="250" y1="53" x2="250" y2="62" stroke="#9ca3af" strokeWidth=".8"/>
          {/* Scale */}
          <line x1="108" y1="378" x2="148" y2="378" stroke="#9ca3af" strokeWidth=".8"/>
          <text x="108" y="375" fontFamily="DM Mono" fontSize="6" fill="#9ca3af">~500km</text>
        </svg>
        {/* Tooltip */}
        {hovered&&(
          <div className="map-tooltip" style={{
            left:Math.min(tooltipPos.x-300,window.innerWidth-200),
            top:Math.max(tooltipPos.y-120,60),
            position:"fixed"
          }}>
            <div className="map-city-hdr">{hovered.name}</div>
            {[["Listings",hovered.listings],["Avg Rent",`INR ${hovered.avgRent}/sqft/mo`],["Trend",hovered.trend]].map(([k,v])=>(
              <div key={k} className="map-city-row">
                <span>{k}</span>
                <span className="map-city-val" style={{color:k==="Trend"?(hovered.up?"var(--green)":"var(--red)"):undefined}}>{v}</span>
              </div>
            ))}
          </div>
        )}
        {/* Legend */}
        <div style={{position:"absolute",bottom:10,right:10,background:"rgba(255,255,255,.9)",border:"1px solid var(--border)",borderRadius:5,padding:"6px 10px"}}>
          <div className="mono" style={{fontSize:7,color:"var(--muted)",marginBottom:4}}>MARKET DENSITY</div>
          {[["300+ listings","#c8410a"],["100-300","#e87a5a"],["Under 100","#f5c4b5"]].map(([l,c])=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:c}}/>
              <span className="mono" style={{fontSize:7,color:"var(--muted)"}}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── VIEWS ─────────────────────── */
function SearchView({showToast}) {
  const [q,setQ]=useState("");
  const [filter,setFilter]=useState("all");
  const [sort,setSort]=useState(null);
  const [sel,setSel]=useState(null);
  const [confMin,setConfMin]=useState(0);
  const [showMap,setShowMap]=useState(false);
  const { data: supabaseProperties, loading: loadingProperties, error: propertiesError } = useProperties({
    page: 1,
    pageSize: 500,
    sortBy: "created_at",
    sortOrder: "desc",
  });

  const liveListings = useMemo(
    () =>
      (supabaseProperties || []).map((p) => {
        const confidence =
          p.confidence_overall === null || p.confidence_overall === undefined
            ? 0
            : p.confidence_overall <= 1
              ? Math.round(p.confidence_overall * 100)
              : Math.round(p.confidence_overall);
        return {
          id: p.ae_property_id || `prop_${p.id}`,
          name: p.title || "Untitled Property",
          type: String(p.asset_type || "office").toLowerCase(),
          addr:
            [p.micro_market, p.city].filter(Boolean).join(", ") ||
            p.city ||
            "India",
          area:
            p.area_sqft === null || p.area_sqft === undefined
              ? "—"
              : Number(p.area_sqft).toLocaleString("en-IN"),
          aU: "sq ft",
          rent: "—",
          rU: "",
          avail: "—",
          status: p.verified ? "verified" : "pending",
          conf: confidence,
          grade: p.locality || "—",
          lastV: p.verified ? "Verified" : "Unverified",
          spark: [35, 38, 36, 40, 41, 42, 44, 46, 45, 47],
        };
      }),
    [supabaseProperties]
  );

  const listingSource = liveListings.length > 0 ? liveListings : LISTINGS;

  const filtered=listingSource
    .filter(l=>filter==="all"||l.type===filter)
    .filter(l=>l.conf>=confMin)
    .filter(l=>l.name.toLowerCase().includes(q.toLowerCase())||l.addr.toLowerCase().includes(q.toLowerCase()));

  const statCls={verified:"b-ok",pending:"b-warn",draft:"b-draft"};
  const statLbl={verified:"Verified",pending:"Pending",draft:"Draft"};

  return (
    <div className="fade">
      <div className="kpi-row">
        {[
          {v:"2,841",l:"Active Listings",d:"+ 12% MoM",up:true,spark:[20,25,22,28,26,30,32,35,38,40]},
          {v:"INR 118",l:"Avg BKC Rent / sqft",d:"+ 3.2% QoQ",up:true,spark:[40,42,41,44,43,46,45,47,48,50]},
          {v:"4.2M",l:"Industrial sqft",d:"Pan-India",up:true,spark:[30,28,32,35,33,37,36,40,38,42]},
          {v:"38",l:"Distressed Open",d:"Updated today",up:false,spark:[12,14,11,16,13,18,15,14,17,16]},
        ].map((k,i)=>(
          <div key={i} className="kpi" onClick={()=>showToast(`Drilling into ${k.l}...`)}>
            <div className="kpi-val syne">{k.v}</div>
            <div className="kpi-lbl">{k.l}</div>
            <div className={`kpi-delta mono ${k.up?"delta-up":"delta-dn"}`}>{k.up?"+ ":"- "}{k.d.replace(/[+-] /,"")}</div>
            <div className="kpi-spark"><Sparkline data={k.spark}/></div>
          </div>
        ))}
      </div>

      <div className="search-row">
        <input className="search-inp" placeholder="Search buildings, micro-markets, addresses…" value={q} onChange={e=>setQ(e.target.value)}/>
        {["all","office","industrial","land"].map(t=>(
          <div key={t} className={`pill ${filter===t?"on":""}`} onClick={()=>setFilter(t)}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </div>
        ))}
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span className="mono" style={{fontSize:8,color:"var(--muted)",whiteSpace:"nowrap"}}>Min conf: {confMin}%</span>
          <input type="range" min="0" max="90" step="5" value={confMin} onChange={e=>setConfMin(+e.target.value)} style={{width:70}}/>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={()=>setShowMap(v=>!v)}>{showMap?"Hide Map":"Show Map"}</button>
        <button className="btn btn-ghost btn-sm" onClick={()=>showToast("Exporting CSV…")}>Export</button>
        <button className="btn btn-accent btn-sm" onClick={()=>showToast("Compare drawer opened")}>Compare {sel?"(1)":""}</button>
      </div>
      {(loadingProperties || propertiesError) && (
        <div className="mono" style={{fontSize:9,color:propertiesError?"var(--red)":"var(--muted)",marginBottom:10}}>
          {loadingProperties
            ? "Loading live properties from Supabase..."
            : `Live data unavailable (${propertiesError}). Showing local snapshot.`}
        </div>
      )}

      {showMap&&<IndiaMap showToast={showToast} onCityClick={c=>setFilter("all")}/>}

      <div className="tbl-wrap">
        <div className="tbl-bar">
          <span className="tbl-title">Inventory</span>
          <div style={{display:"flex",alignItems:"center",gap:6,marginLeft:"auto"}}>
            <div className="live-dot"/>
            <span className="mono" style={{fontSize:8,color:"var(--muted)"}}>{filtered.length} results</span>
          </div>
        </div>
        <table>
          <thead><tr>
            <th>Asset</th><th>Type</th><th>Area</th><th>Asking</th><th>Available</th><th>Trend</th><th>Confidence</th><th>Verified</th><th></th>
          </tr></thead>
          <tbody>
            {filtered.map(l=>(
              <tr key={l.id} className={sel===l.id?"sel":""} onClick={()=>setSel(sel===l.id?null:l.id)}>
                <td>
                  <div className="td-name">{l.name}</div>
                  <div className="td-sub">{l.addr} · {l.grade}</div>
                </td>
                <td><Badge type={l.type}/></td>
                <td><span className="mono" style={{fontSize:11}}>{l.area} <span style={{color:"var(--muted)"}}>{l.aU}</span></span></td>
                <td><span className="mono" style={{fontSize:12,color:"var(--accent)",fontWeight:700}}>INR {l.rent}</span><span className="mono" style={{fontSize:9,color:"var(--muted)"}}>{l.rU}</span></td>
                <td><span className="mono" style={{fontSize:10,color:"var(--green)"}}>{l.avail}</span></td>
                <td><Sparkline data={l.spark}/></td>
                <td>
                  <div className="mono" style={{fontSize:10}}>{l.conf}%</div>
                  <ConfBar v={l.conf}/>
                </td>
                <td>
                  <span className={`badge ${statCls[l.status]||"b-draft"}`}>{statLbl[l.status]||l.status}</span>
                  <div className="mono" style={{fontSize:8,color:"var(--muted2)",marginTop:3}}>{l.lastV}</div>
                </td>
                <td><button className="btn btn-ghost btn-xs" onClick={e=>{e.stopPropagation();showToast(`Opening ${l.id}…`);}}>Open</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0&&<div style={{padding:"40px",textAlign:"center",fontFamily:"DM Mono",fontSize:10,color:"var(--muted)"}}>No results matching criteria</div>}
      </div>
    </div>
  );
}

function SearchEngineView({showToast}) {
  const [mode,setMode]=useState("home");
  const [intent,setIntent]=useState("");
  const [answers,setAnswers]=useState({
    city:"Mumbai",
    microMarket:"",
    assetType:"office",
    minArea:5000,
    maxRent:150,
    availableBy:"2025-12-31",
    confidenceMin:70,
    verifiedOnly:true
  });

  const updateAnswer=(k,v)=>setAnswers(prev=>({...prev,[k]:v}));

  const scoredResults = LISTINGS.map((l)=>{
    let score=0;
    const isTypeMatch = answers.assetType==="all" || l.type===answers.assetType;
    if(isTypeMatch) score += 30;
    if(l.addr.toLowerCase().includes(String(answers.city).toLowerCase())) score += 25;
    if(answers.microMarket && l.addr.toLowerCase().includes(answers.microMarket.toLowerCase())) score += 12;
    const areaNum = parseFloat(String(l.area).replace(/,/g,"")) || 0;
    if(areaNum >= Number(answers.minArea||0)) score += 12;
    const rentNum = parseFloat(String(l.rent).replace(/,/g,"")) || 0;
    if(rentNum > 0 && rentNum <= Number(answers.maxRent||9999)) score += 10;
    if(l.conf >= Number(answers.confidenceMin||0)) score += 8;
    if(!answers.verifiedOnly || l.status==="verified") score += 6;
    return { ...l, score };
  })
    .filter((l)=>answers.assetType==="all" ? true : l.type===answers.assetType)
    .filter((l)=>l.addr.toLowerCase().includes(String(answers.city).toLowerCase()))
    .filter((l)=>(parseFloat(String(l.area).replace(/,/g,"")) || 0) >= Number(answers.minArea||0))
    .filter((l)=>l.conf >= Number(answers.confidenceMin||0))
    .filter((l)=>answers.verifiedOnly ? l.status==="verified" : true)
    .sort((a,b)=>b.score-a.score);

  const top = scoredResults[0] || null;

  return (
    <div className="fade engine-shell">
      {mode==="home"&&(
        <div className="engine-home">
          <div className="engine-logo">AlgoEstate Search</div>
          <div className="engine-tag">Search Engine · Moat Workflow</div>
          <div className="engine-search">
            <input
              className="engine-input"
              value={intent}
              onChange={(e)=>setIntent(e.target.value)}
              placeholder="Describe the exact property you want (e.g. 10000 sqft Grade A office in BKC under INR 150)"
            />
            <button className="btn btn-accent" onClick={()=>setMode("qa")}>Narrow Down</button>
          </div>
          <div className="engine-btns">
            <button className="btn btn-ghost btn-sm" onClick={()=>{setIntent("Grade A office in Mumbai with high confidence");setMode("qa");}}>Office Intent</button>
            <button className="btn btn-ghost btn-sm" onClick={()=>{setIntent("Industrial warehouse in Pune with immediate availability");setMode("qa");}}>Industrial Intent</button>
            <button className="btn btn-ghost btn-sm" onClick={()=>{setIntent("Verified land parcel for acquisition");setMode("qa");}}>Land Intent</button>
          </div>
        </div>
      )}

      {mode==="qa"&&(
        <div className="engine-qa">
          <div className="syne" style={{fontWeight:700,fontSize:22,marginBottom:4}}>Search Engine Questionnaire</div>
          <div className="mono" style={{fontSize:9,color:"var(--muted)",marginBottom:14}}>Same core questions as listing flow, inverted to find one exact-fit property.</div>
          <div className="engine-grid">
            <div className="f-blk">
              <div className="f-lbl">City</div>
              <select className="f-in f-sel" value={answers.city} onChange={(e)=>updateAnswer("city",e.target.value)}>
                <option>Mumbai</option><option>Bengaluru</option><option>Pune</option><option>Hyderabad</option><option>Delhi NCR</option><option>Chennai</option>
              </select>
            </div>
            <div className="f-blk">
              <div className="f-lbl">Micro-market</div>
              <input className="f-in" placeholder="BKC, ORR, Whitefield..." value={answers.microMarket} onChange={(e)=>updateAnswer("microMarket",e.target.value)}/>
            </div>
            <div className="f-blk">
              <div className="f-lbl">Asset Type</div>
              <select className="f-in f-sel" value={answers.assetType} onChange={(e)=>updateAnswer("assetType",e.target.value)}>
                <option value="office">Office</option><option value="industrial">Industrial</option><option value="land">Land</option><option value="all">Any</option>
              </select>
            </div>
            <div className="f-blk">
              <div className="f-lbl">Minimum Area (sqft)</div>
              <input className="f-in" type="number" value={answers.minArea} onChange={(e)=>updateAnswer("minArea",Number(e.target.value||0))}/>
            </div>
            <div className="f-blk">
              <div className="f-lbl">Max Asking Rent (INR/sqft/mo)</div>
              <input className="f-in" type="number" value={answers.maxRent} onChange={(e)=>updateAnswer("maxRent",Number(e.target.value||0))}/>
            </div>
            <div className="f-blk">
              <div className="f-lbl">Available By</div>
              <input className="f-in" type="date" value={answers.availableBy} onChange={(e)=>updateAnswer("availableBy",e.target.value)}/>
            </div>
            <div className="f-blk">
              <div className="f-lbl">Confidence Minimum</div>
              <input className="f-in" type="number" min="50" max="100" value={answers.confidenceMin} onChange={(e)=>updateAnswer("confidenceMin",Number(e.target.value||0))}/>
            </div>
            <div className="f-blk">
              <div className="f-lbl">Verified Only</div>
              <select className="f-in f-sel" value={String(answers.verifiedOnly)} onChange={(e)=>updateAnswer("verifiedOnly",e.target.value==="true")}>
                <option value="true">Yes</option><option value="false">No</option>
              </select>
            </div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:14}}>
            <button className="btn btn-accent" onClick={()=>showToast("Top match recomputed")}>Find Best Match</button>
            <button className="btn btn-ghost" onClick={()=>setMode("home")}>Back</button>
          </div>

          <div className="engine-result">
            <div className="mono" style={{fontSize:9,color:"var(--muted)",marginBottom:8}}>Best-fit property (single recommendation)</div>
            {top?(
              <div>
                <div className="syne" style={{fontSize:24,fontWeight:700}}>{top.name}</div>
                <div className="mono" style={{fontSize:10,color:"var(--muted)",marginTop:4}}>{top.addr} · {top.grade}</div>
                <div style={{display:"flex",gap:18,marginTop:10,flexWrap:"wrap"}}>
                  <span className="mono" style={{fontSize:10}}>Area: <strong>{top.area} {top.aU}</strong></span>
                  <span className="mono" style={{fontSize:10}}>Ask: <strong>INR {top.rent}{top.rU}</strong></span>
                  <span className="mono" style={{fontSize:10}}>Confidence: <strong>{top.conf}%</strong></span>
                  <span className={`badge ${top.status==="verified"?"b-ok":"b-warn"}`}>{top.status==="verified"?"Verified":"Pending"}</span>
                </div>
                <div style={{marginTop:12,display:"flex",gap:8}}>
                  <button className="btn btn-accent btn-sm" onClick={()=>showToast(`Opening ${top.id}...`)}>Open Property</button>
                  <button className="btn btn-ghost btn-sm" onClick={()=>showToast("Exporting recommendation brief...")}>Export Brief</button>
                </div>
              </div>
            ):(
              <div className="mono" style={{fontSize:10,color:"var(--red)"}}>No exact match. Relax one constraint and recompute.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function BuildingView({showToast}) {
  const [tab,setTab]=useState("availability");
  const [hovUnit,setHovUnit]=useState(null);
  const uCls={occ:"u-occ",avail:"u-avail",exp:"u-exp",vac:"u-vac"};

  return (
    <div className="fade">
      <div className="b-hero">
        <div className="b-grade">GRADE A+ OFFICE · BENGALURU ORR</div>
        <div className="b-name syne">{STACK.name}</div>
        <div className="b-addr">Outer Ring Road, Devarabeesanahalli, Bengaluru 560103</div>
        <div className="b-stats">
          {[["15","Total Floors"],["1,38,000 sqft","GLA"],["62%","Occupancy"],["4","Available Units"],["INR 102–110","Asking /sqft/mo"]].map(([v,k])=>(
            <div key={k}><div className="b-stat-v">{v}</div><div className="b-stat-k mono">{k}</div></div>
          ))}
        </div>
        <div style={{position:"absolute",top:18,right:18,display:"flex",gap:8}}>
          <button className="btn btn-ghost btn-sm" style={{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",color:"rgba(255,255,255,.8)"}} onClick={()=>showToast("Added to watchlist")}>Watch</button>
          <button className="btn btn-accent btn-sm" onClick={()=>showToast("Downloading evidence pack…")}>Evidence Pack</button>
        </div>
      </div>

      <div className="two-col">
        <div>
          <div className="tabs">
            {["availability","stacking","specs","comps","docs"].map(t=>(
              <div key={t} className={`tab ${tab===t?"on":""}`} onClick={()=>setTab(t)}>{t}</div>
            ))}
          </div>

          {tab==="availability"&&(
            <div className="unit-cards">
              {[{f:"15F Wing B",a:"4,600 sqft",r:"INR 108/sqft/mo",av:"Immediate",fit:"Warm Shell",c:95},{f:"12F Wing A",a:"4,600 sqft",r:"INR 105/sqft/mo",av:"Immediate",fit:"Bare Shell",c:88},{f:"11F Full Plate",a:"9,200 sqft",r:"INR 102/sqft/mo",av:"Jun 2025",fit:"Bare Shell",c:82},{f:"14F Wing C",a:"2,300 sqft",r:"INR 110/sqft/mo",av:"Sep 2025",fit:"Furnished",c:91}].map((u,i)=>(
                <div key={i} className="unit-card" onClick={()=>showToast(`Viewing ${u.f} — ${u.a}`)}>
                  <div className="uc-floor mono">{u.f}</div>
                  <div className="uc-area syne">{u.a}</div>
                  <div className="uc-rent mono">{u.r}</div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
                    <span className="badge b-draft">{u.fit}</span>
                    <span className="mono" style={{fontSize:9,color:"var(--green)"}}>{u.av}</span>
                  </div>
                  <ConfBar v={u.c}/>
                  <div className="mono" style={{fontSize:8,color:"var(--muted)",marginTop:3}}>{u.c}% confidence</div>
                </div>
              ))}
            </div>
          )}

          {tab==="stacking"&&(
            <div className="stack-wrap">
              <div className="stack-hdr">
                <span className="panel-hdr-title">Stacking Plan — {STACK.name}</span>
                <div className="stack-leg">
                  {[["Occupied","#dbeafe"],["Available","#dcfce7"],["Expiring","#fef3c7"],["Vacant","#fff1f2"]].map(([l,c])=>(
                    <div key={l} className="leg-item"><div className="leg-sq" style={{background:c,border:"1px solid rgba(0,0,0,.1)"}}/>{l}</div>
                  ))}
                </div>
              </div>
              <div className="stack-body">
                <div className="floor-lbls">{STACK.floors.map(f=><div key={f.f} className="floor-lbl">{f.f}</div>)}</div>
                <div className="stack-rows">
                  {STACK.floors.map(f=>(
                    <div key={f.f} className="s-row">
                      {f.units.map(u=>(
                        <div key={u.id} className={`s-unit ${uCls[u.s]}`}
                          onMouseEnter={()=>setHovUnit(u)}
                          onMouseLeave={()=>setHovUnit(null)}
                          onClick={()=>showToast(`${u.id}: ${u.t} · ${u.a}`)}
                        >{u.id}</div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="stack-hover-bar">
                {hovUnit?(
                  <>
                    <span><span className="mono" style={{fontSize:9,color:"var(--muted)"}}>Unit: </span><strong>{hovUnit.id}</strong></span>
                    <span><span className="mono" style={{fontSize:9,color:"var(--muted)"}}>Tenant: </span><strong>{hovUnit.t}</strong></span>
                    <span><span className="mono" style={{fontSize:9,color:"var(--muted)"}}>Area: </span><strong>{hovUnit.a}</strong></span>
                    <span><span className="mono" style={{fontSize:9,color:"var(--muted)"}}>Status: </span><strong style={{textTransform:"capitalize"}}>{hovUnit.s==="occ"?"Occupied":hovUnit.s==="avail"?"Available":hovUnit.s==="exp"?"Expiring":"Vacant"}</strong></span>
                  </>
                ):<span className="mono" style={{fontSize:9,color:"var(--muted)"}}>Hover a unit to see details</span>}
              </div>
            </div>
          )}

          {tab==="specs"&&(
            <div className="panel">
              <div className="panel-hdr"><span className="panel-hdr-title">Building Specifications</span></div>
              <div className="panel-body" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0}}>
                {[["Total Floors","15"],["Floor Plate","9,200 sq ft"],["Building Class","Grade A+"],["Year Built","2019"],["HVAC","Centralized VRF"],["Lifts","4 passenger + 1 service"],["Power Backup","100% DG"],["Parking Ratio","1:1,000 sq ft"],["Certification","LEED Gold"],["Clear Height","14 ft (slab to slab)"],["Floor Load","300 kg/sq m"],["BMS","Honeywell BMS v2"],["Security","24x7 CCTV, RFID"],["Telecom","Jio + Airtel Fiber"]].map(([k,v])=>(
                  <div key={k} className="d-row"><span className="d-k">{k}</span><span className="d-v">{v}</span></div>
                ))}
              </div>
            </div>
          )}

          {tab==="comps"&&(
            <div className="panel">
              <div className="panel-hdr"><span className="panel-hdr-title">Market Comparables — ORR Bengaluru Grade A+</span></div>
              <div className="panel-body">
                {[["Embassy TechVillage","INR 115/sqft","Grade A+","93% occ."],["RMZ Ecospace","INR 110/sqft","Grade A+","88% occ."],["Manyata Tech Park","INR 98/sqft","Grade A","91% occ."],["Prestige Shantiniketan","INR 102/sqft","Grade A+","85% occ."]].map(([n,r,g,occ])=>(
                  <div key={n} className="d-row" style={{cursor:"pointer"}} onClick={()=>showToast(`Opening ${n}…`)}>
                    <div><div style={{fontWeight:600,fontSize:12}}>{n}</div><div className="mono" style={{fontSize:9,color:"var(--muted)"}}>{g} · {occ}</div></div>
                    <span className="mono" style={{color:"var(--accent)",fontWeight:700,fontSize:13}}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab==="docs"&&(
            <div className="panel">
              <div className="panel-hdr"><span className="panel-hdr-title">Evidence Pack</span></div>
              <div className="panel-body">
                {[["OC Certificate","12 Jan 2025","verified"],["Fire NOC","10 Jan 2025","verified"],["Floor Plans (All)","8 Jan 2025","verified"],["Photos (24 images)","2 days ago","verified"],["Lease Agreement Template","15 Jan 2025","pending"]].map(([name,date,s])=>(
                  <div key={name} className="d-row" style={{cursor:"pointer"}} onClick={()=>showToast(`Downloading ${name}…`)}>
                    <div><div style={{fontWeight:600,fontSize:12}}>{name}</div><div className="mono" style={{fontSize:9,color:"var(--muted)"}}>{date}</div></div>
                    <span className={`badge ${s==="verified"?"b-ok":"b-warn"}`}>{s==="verified"?"Verified":"Pending"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <IndiaMap showToast={showToast}/>
          <div className="panel">
            <div className="panel-hdr">
              <span className="panel-hdr-title">Verification</span>
              <div style={{display:"flex",alignItems:"center",gap:5}}><div className="live-dot"/><span className="mono" style={{fontSize:8,color:"var(--muted)"}}>Live</span></div>
            </div>
            <div className="panel-body">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:12,fontWeight:600}}>Confidence Score</span>
                <span className="mono" style={{fontSize:20,color:"var(--green)",fontWeight:700}}>97%</span>
              </div>
              <ConfBar v={97}/>
              <div style={{marginTop:10}}>
                {[["Last Site Visit","3 Jan 2025"],["Verified By","Research Team — MUM"],["Method","Site visit + Doc review"],["OC Checked","Confirmed"],["Title Clear","Confirmed"]].map(([k,v])=>(
                  <div key={k} className="d-row"><span className="d-k">{k}</span><span className="d-v" style={{fontSize:11}}>{v}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MapView({showToast}) {
  const [activeCity,setActiveCity]=useState(null);
  return (
    <div className="fade">
      <div className="kpi-row">
        {CITIES.slice(0,4).map((c,i)=>(
          <div key={i} className="kpi" onClick={()=>{setActiveCity(c);showToast(`${c.listings} listings in ${c.name}`);}}>
            <div className="kpi-val syne">{c.listings}</div>
            <div className="kpi-lbl">{c.name}</div>
            <div className={`kpi-delta mono ${c.up?"delta-up":"delta-dn"}`}>INR {c.avgRent}/sqft · {c.trend}</div>
          </div>
        ))}
      </div>
      <div className="two-col">
        <IndiaMap showToast={showToast} onCityClick={setActiveCity}/>
        <div>
          <div className="panel">
            <div className="panel-hdr"><span className="panel-hdr-title">{activeCity?activeCity.name+" — Market Data":"Select a City"}</span></div>
            <div className="panel-body">
              {activeCity?<>
                {[["Total Listings",activeCity.listings],["Avg Office Rent",`INR ${activeCity.avgRent}/sqft/mo`],["Market Trend",activeCity.trend],["Micro-markets","Multiple"],["Last Updated","Today"]].map(([k,v])=>(
                  <div key={k} className="d-row"><span className="d-k">{k}</span><span className="d-v" style={{color:k==="Market Trend"?(activeCity.up?"var(--green)":"var(--red)"):undefined}}>{v}</span></div>
                ))}
                <button className="btn btn-accent btn-sm" style={{marginTop:14,width:"100%"}} onClick={()=>showToast(`Browsing ${activeCity.name} listings…`)}>Browse {activeCity.name} Listings</button>
              </>:<div className="mono" style={{fontSize:9,color:"var(--muted)"}}>Click a city pin on the map to view market data.</div>}
            </div>
          </div>
          <div className="panel">
            <div className="panel-hdr"><span className="panel-hdr-title">All Markets</span></div>
            <div className="panel-body" style={{padding:0}}>
              {CITIES.map(c=>(
                <div key={c.id} className="d-row" style={{padding:"9px 16px",cursor:"pointer"}} onClick={()=>{setActiveCity(c);showToast(`${c.listings} listings in ${c.name}`);}}>
                  <div><div style={{fontWeight:600,fontSize:12}}>{c.name}</div><div className="mono" style={{fontSize:9,color:"var(--muted)"}}>{c.listings} listings</div></div>
                  <div style={{textAlign:"right"}}>
                    <div className="mono" style={{fontSize:11,fontWeight:600}}>INR {c.avgRent}</div>
                    <div className="mono" style={{fontSize:9,color:c.up?"var(--green)":"var(--red)"}}>{c.trend}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DistressedView({showToast}) {
  const [exp,setExp]=useState(null);
  const [tracked,setTracked]=useState([]);
  return (
    <div className="fade">
      <div style={{background:"var(--red-bg)",border:"1px solid var(--red-border)",borderRadius:8,padding:"12px 16px",marginBottom:18,display:"flex",gap:12}}>
        <div style={{width:3,background:"var(--red)",borderRadius:2,flexShrink:0}}/>
        <div className="mono" style={{fontSize:8.5,color:"var(--red)",lineHeight:2}}>
          ALL RECORDS SOURCED FROM OFFICIAL GOV AND REGULATORY CHANNELS — SARFAESI · IBC / eBKray · DRT · SEBI RECOVERY PROCEEDINGS. TERMS GOVERNED BY ORIGINAL NOTICE. EXTRACTED FIELDS ARE INFORMATIONAL ONLY. VERIFY INDEPENDENTLY BEFORE BIDDING.
        </div>
      </div>
      <div className="search-row">
        <input className="search-inp" placeholder="Search authority, route, type, location…"/>
        {["All Routes","SARFAESI","IBC / Liquidation","DRT","SEBI"].map(t=>(
          <div key={t} className="pill">{t}</div>
        ))}
      </div>
      {DISTRESSED.map(d=>(
        <div key={d.id} className={`d-card ${exp===d.id?"exp":""}`} onClick={()=>setExp(exp===d.id?null:d.id)}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div className="d-title">{d.title}</div>
              <div className="d-auth">{d.auth} · <span style={{color:"var(--accent)",fontWeight:600}}>{d.route}</span></div>
            </div>
            <div style={{display:"flex",gap:6,flexShrink:0}}>
              <Badge type={d.type}/>
              <span className="mono" style={{fontSize:9,color:"var(--muted)"}}>{exp===d.id?"v":">"}</span>
            </div>
          </div>
          <div className="d-meta-row">
            {[["Reserve Price","INR "+d.reserve],["EMD Required","INR "+d.emd],["Auction Date",d.aDate],["Inspection",d.inspect],["Area",d.area]].map(([k,v])=>(
              <div key={k} className="d-meta-item"><div className="d-mk">{k}</div><div className="d-mv">{v}</div></div>
            ))}
          </div>
          {exp===d.id&&(
            <div>
              <div className="d-timeline">
                <div className="mono" style={{fontSize:8,color:"var(--muted2)",letterSpacing:2,marginBottom:8}}>CHANGE LOG</div>
                {d.updates.map((u,i)=>(
                  <div key={i} className="d-t-item">
                    <div className="d-t-dot"/>
                    <div className="d-t-date">{u.date}</div>
                    <div className="d-t-txt">{u.txt}</div>
                  </div>
                ))}
              </div>
              <div className="d-disc">
                Terms and conditions are governed by the original notice published by {d.auth}. This platform's extracted data is informational only. Always verify the official notice before bidding. EMD and other terms may have changed via corrigendum.
              </div>
              <div style={{marginTop:12,display:"flex",gap:8}}>
                <button className="btn btn-ghost btn-sm" onClick={e=>{e.stopPropagation();showToast("Opening original notice…");}}>View Original Notice</button>
                <button className="btn btn-accent btn-sm" onClick={e=>{e.stopPropagation();setTracked(t=>t.includes(d.id)?t:[...t,d.id]);showToast(`Tracking ${d.id}`);}}>
                  {tracked.includes(d.id)?"Tracking":"Track Asset"}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={e=>{e.stopPropagation();showToast("Downloading PDF notice…");}}>Download Notice</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function WizardView({showToast}) {
  const [step,setStep]=useState(0);
  const [propType,setPropType]=useState(null);
  const [saved,setSaved]=useState(false);
  const autoSave=()=>{setSaved(true);setTimeout(()=>setSaved(false),2000);};

  const stepContent=[
    <div>
      <div style={{marginBottom:18}}>
        <div className="syne" style={{fontWeight:700,fontSize:18,marginBottom:4}}>Select Asset Type</div>
        <div className="mono" style={{fontSize:9,color:"var(--muted)"}}>Your selection determines which technical checklist fields are shown.</div>
      </div>
      <div className="type-cards" style={{gridTemplateColumns:"repeat(4,1fr)"}}>
        {[{id:"office",nm:"Office",desc:"Single unit or multi-unit commercial building"},{id:"industrial",nm:"Industrial / Warehouse",desc:"Warehouses, distribution centers, cold storage"},{id:"land",nm:"Plot / Land",desc:"Industrial land, commercial plots, dev parcels"},{id:"datacenter",nm:"Data Center",desc:"Colocation, hyperscale, edge DC facilities"}].map(t=>(
          <div key={t.id} className={`type-card ${propType===t.id?"sel":""}`} onClick={()=>{setPropType(t.id);autoSave();}}>
            <div className="type-nm syne">{t.nm}</div>
            <div className="type-desc">{t.desc}</div>
            {propType===t.id&&<div className="mono" style={{fontSize:8,color:"var(--accent)",marginTop:8}}>Selected</div>}
          </div>
        ))}
      </div>
    </div>,
    <div>
      <div style={{marginBottom:18}}><div className="syne" style={{fontWeight:700,fontSize:18,marginBottom:4}}>Location & Identity</div><div className="mono" style={{fontSize:9,color:"var(--muted)"}}>We check for existing building records and flag duplicates.</div></div>
      <div className="f-grid">
        <div className="f-blk f-full"><div className="f-lbl">Full Address <span className="f-req">*</span></div><input className="f-in" placeholder="Building name, street, locality" onChange={autoSave}/></div>
        <div className="f-blk"><div className="f-lbl">City <span className="f-req">*</span></div><select className="f-in f-sel" onChange={autoSave}><option>Mumbai</option><option>Bengaluru</option><option>Pune</option><option>NCR / Delhi</option><option>Hyderabad</option><option>Chennai</option></select></div>
        <div className="f-blk"><div className="f-lbl">Micro-market</div><input className="f-in" placeholder="e.g. BKC, Whitefield, MIDC" onChange={autoSave}/></div>
        <div className="f-blk"><div className="f-lbl">Pincode <span className="f-req">*</span></div><input className="f-in" placeholder="400051" type="number" onChange={autoSave}/></div>
        <div className="f-blk"><div className="f-lbl">State</div><select className="f-in f-sel" onChange={autoSave}><option>Maharashtra</option><option>Karnataka</option><option>Telangana</option><option>Tamil Nadu</option><option>Delhi</option></select></div>
      </div>
      <div style={{marginTop:12,background:"var(--green-bg)",border:"1px solid var(--green-border)",borderRadius:5,padding:"9px 13px",fontFamily:"DM Mono",fontSize:9,color:"var(--green)"}}>
        No duplicate detected — a new building record will be created.
      </div>
    </div>,
    <div>
      <div style={{marginBottom:18}}><div className="syne" style={{fontWeight:700,fontSize:18,marginBottom:4}}>Technical Specifications — {propType||(propType==="office"?"Office":propType==="industrial"?"Industrial":"Land")}</div><div className="mono" style={{fontSize:9,color:"var(--muted)"}}>Required fields marked <span style={{color:"var(--accent)"}}>*</span>. Definitions shown inline.</div></div>
      {propType==="industrial"?<div className="f-grid">
        {[["Clear Height (ft)","e.g. 32","Floor to lowest obstruction — most critical industrial metric"],["Dock Doors","Count",""],["Grade-Level Doors","Count",""],["Truck Court Depth (ft)","e.g. 130",""],["Floor Load (kg / sq m)","e.g. 5000",""],["Power (kVA)","e.g. 1000","Total sanctioned capacity"]].map(([l,ph,h],i)=>(
          <div key={i} className="f-blk"><div className="f-lbl">{l} <span className="f-req">*</span></div><input className="f-in" placeholder={ph} onChange={autoSave}/>{h&&<div className="f-help">{h}</div>}</div>
        ))}
        <div className="f-blk"><div className="f-lbl">Sprinkler System</div><select className="f-in f-sel" onChange={autoSave}><option>ESFR</option><option>Wet Pipe</option><option>Dry Pipe</option><option>None</option></select></div>
        <div className="f-blk"><div className="f-lbl">24x7 Operations</div><select className="f-in f-sel" onChange={autoSave}><option>Permitted</option><option>Not Permitted</option><option>With Permission</option></select></div>
      </div>:propType==="land"?<div className="f-grid">
        {[["Land Area (acres)","e.g. 3.5"],["Frontage (ft)","Road frontage"],["Road Width (ft)","Approach road"],["FAR / FSI","e.g. 1.5"]].map(([l,ph])=>(
          <div key={l} className="f-blk"><div className="f-lbl">{l} <span className="f-req">*</span></div><input className="f-in" placeholder={ph} onChange={autoSave}/></div>
        ))}
        <div className="f-blk"><div className="f-lbl">Zoning <span className="f-req">*</span></div><select className="f-in f-sel" onChange={autoSave}><option>Industrial</option><option>Commercial</option><option>Mixed Use</option></select></div>
        <div className="f-blk"><div className="f-lbl">Title Status <span className="f-req">*</span></div><select className="f-in f-sel" onChange={autoSave}><option>Clear Title</option><option>Encumbered</option><option>Disputed</option></select></div>
      </div>:propType==="datacenter"?<div>
        <div style={{marginBottom:12,background:"var(--amber-bg)",border:"1px solid var(--amber-border)",borderRadius:5,padding:"8px 12px",fontFamily:"DM Mono",fontSize:8.5,color:"var(--amber)"}}>
          DATA CENTER — Technical specifications require MeitY / DoT compliance confirmation. All power values in kW unless noted.
        </div>
        <div className="f-grid">
          {[
            ["IT Load Capacity (kW)","e.g. 2000","Total available IT power capacity"],
            ["Power Density (kW/rack)","e.g. 10","Average rack density supported"],
            ["Total Racks","e.g. 500","Total rack count in facility"],
            ["PUE Rating","e.g. 1.4","Power Usage Effectiveness — lower is better"],
            ["Cooling Capacity (kW)","e.g. 2500","Total cooling plant capacity"],
            ["Generator Backup (MW)","e.g. 4","Total installed generator capacity"],
          ].map(([l,ph,h])=>(
            <div key={l} className="f-blk"><div className="f-lbl">{l} <span className="f-req">*</span></div><input className="f-in" placeholder={ph} onChange={autoSave}/>{h&&<div className="f-help">{h}</div>}</div>
          ))}
          <div className="f-blk"><div className="f-lbl">Tier Classification <span className="f-req">*</span></div><select className="f-in f-sel" onChange={autoSave}><option>Tier I</option><option>Tier II</option><option>Tier III</option><option>Tier IV</option><option>Not Rated</option></select></div>
          <div className="f-blk"><div className="f-lbl">Uptime SLA</div><select className="f-in f-sel" onChange={autoSave}><option>99.671% (Tier II)</option><option>99.982% (Tier III)</option><option>99.995% (Tier IV)</option><option>Custom SLA</option></select></div>
          <div className="f-blk"><div className="f-lbl">Above Ground / Below Ground <span className="f-req">*</span></div><select className="f-in f-sel" onChange={autoSave}><option>Above Ground (Ground Floor)</option><option>Above Ground (Upper Floor)</option><option>Below Ground (Basement)</option><option>Mixed</option></select></div>
          <div className="f-blk"><div className="f-lbl">Floor-to-Ceiling Height (ft) <span className="f-req">*</span></div><input className="f-in" placeholder="e.g. 18" onChange={autoSave}/><div className="f-help">Clear height to underside of structure — critical for hot aisle containment</div></div>
          <div className="f-blk"><div className="f-lbl">Raised Floor Height (mm)</div><input className="f-in" placeholder="e.g. 600" onChange={autoSave}/><div className="f-help">Plenum depth — affects cooling airflow design</div></div>
          <div className="f-blk"><div className="f-lbl">Floor Load Bearing (kg/m²) <span className="f-req">*</span></div><input className="f-in" placeholder="e.g. 1200" onChange={autoSave}/><div className="f-help">Structural load capacity — verify with structural engineer report</div></div>
          <div className="f-blk"><div className="f-lbl">Connectivity (Carriers)</div><input className="f-in" placeholder="e.g. Tata, Airtel, BSNL" onChange={autoSave}/></div>
          <div className="f-blk"><div className="f-lbl">Redundancy Level <span className="f-req">*</span></div><select className="f-in f-sel" onChange={autoSave}><option>N (None)</option><option>N+1</option><option>2N</option><option>2N+1</option></select></div>
          <div className="f-blk"><div className="f-lbl">Cooling Type</div><select className="f-in f-sel" onChange={autoSave}><option>CRAC / CRAH</option><option>In-Row Cooling</option><option>Rear-Door HX</option><option>Liquid Cooling</option><option>Free Cooling</option></select></div>
          <div className="f-blk"><div className="f-lbl">MeitY Empaneled</div><select className="f-in f-sel" onChange={autoSave}><option>Yes</option><option>No</option><option>Application Pending</option></select></div>
          <div className="f-blk"><div className="f-lbl">Certifications</div><select className="f-in f-sel" onChange={autoSave}><option>ISO 27001 + Uptime Cert.</option><option>ISO 27001 Only</option><option>Uptime Cert. Only</option><option>None</option></select></div>
        </div>
      </div>:<div className="f-grid">
        {[["Carpet Area (sq ft)","RERA-defined net usable","Excludes walls, shafts, balconies per RERA"],["Rentable Area (sq ft)","As per lease",""],["Floor Number","e.g. 12",""],["Floor-to-Ceiling Height (ft)","e.g. 9.5","Clear height floor to underside of slab or ceiling — critical for occupier fit-out planning"]].map(([l,ph,h])=>(
          <div key={l} className="f-blk"><div className="f-lbl">{l} <span className="f-req">*</span></div><input className="f-in" placeholder={ph} onChange={autoSave}/>{h&&<div className="f-help">{h}</div>}</div>
        ))}
        <div className="f-blk"><div className="f-lbl">Building Grade</div><select className="f-in f-sel" onChange={autoSave}><option>Grade A+</option><option>Grade A</option><option>Grade B+</option></select></div>
        <div className="f-blk"><div className="f-lbl">Fit-Out Condition</div><select className="f-in f-sel" onChange={autoSave}><option>Bare Shell</option><option>Warm Shell</option><option>Furnished</option></select></div>
        <div className="f-blk"><div className="f-lbl">HVAC</div><select className="f-in f-sel" onChange={autoSave}><option>Centralized</option><option>VRF / VRV</option><option>Split ACs</option></select></div>
        <div className="f-blk"><div className="f-lbl">Power Backup</div><select className="f-in f-sel" onChange={autoSave}><option>100% DG</option><option>Partial DG</option><option>UPS Only</option></select></div>
      </div>}
    </div>,
    <div>
      <div style={{marginBottom:18}}><div className="syne" style={{fontWeight:700,fontSize:18,marginBottom:4}}>Commercial Terms</div></div>
      <div className="f-grid3">
        <div className="f-blk"><div className="f-lbl">Transaction Type <span className="f-req">*</span></div><select className="f-in f-sel" onChange={autoSave}><option>Lease</option><option>Sale</option><option>Lease + Sale</option></select></div>
        <div className="f-blk"><div className="f-lbl">Asking Rent / Price <span className="f-req">*</span></div><input className="f-in" placeholder="e.g. INR 145 / sqft / mo" onChange={autoSave}/></div>
        <div className="f-blk"><div className="f-lbl">Rent Basis</div><select className="f-in f-sel" onChange={autoSave}><option>Per sqft / month</option><option>Monthly lump sum</option><option>Annual</option></select></div>
        <div className="f-blk"><div className="f-lbl">Escalation</div><input className="f-in" placeholder="e.g. 5% per annum" onChange={autoSave}/></div>
        <div className="f-blk"><div className="f-lbl">Security Deposit</div><input className="f-in" placeholder="e.g. 6 months rent" onChange={autoSave}/></div>
        <div className="f-blk"><div className="f-lbl">Lock-in Period</div><input className="f-in" placeholder="e.g. 3 years" onChange={autoSave}/></div>
        <div className="f-blk"><div className="f-lbl">CAM / Maintenance</div><input className="f-in" placeholder="INR 30 / sqft / mo" onChange={autoSave}/></div>
        <div className="f-blk"><div className="f-lbl">Available From <span className="f-req">*</span></div><input className="f-in" type="date" onChange={autoSave}/></div>
        <div className="f-blk"><div className="f-lbl">Fit-out Period</div><input className="f-in" placeholder="e.g. 3 months rent-free" onChange={autoSave}/></div>
      </div>
    </div>,
    <div>
      <div style={{marginBottom:18}}><div className="syne" style={{fontWeight:700,fontSize:18,marginBottom:4}}>Evidence Pack</div><div className="mono" style={{fontSize:9,color:"var(--muted)"}}>More complete evidence = higher confidence score and faster verification.</div></div>
      <div className="task-list" style={{marginBottom:16}}>
        {[["Photos (min 5 images)","done"],["Floor Plan / Layout","done"],["OC / Completion Certificate","done"],["Ownership / Title Document","pend"],["Fire NOC","pend"],["RERA Registration (if applicable)","pend"]].map(([n,s])=>(
          <div key={n} className={`task t-${s}`} onClick={()=>showToast(`${s==="done"?"Viewing":"Uploading"}: ${n}`)}>
            <div className="t-check">{s==="done"?"✓":""}</div>
            <div className="t-name">{n}</div>
            <span className={`badge ${s==="done"?"b-ok":"b-warn"}`}>{s==="done"?"Uploaded":"Required"}</span>
          </div>
        ))}
      </div>
      <div className="upload-zone" onClick={()=>showToast("File picker opened…")}>
        <div className="upload-txt">Drag and drop files here, or click to browse<br/>PDF · JPG · PNG — max 50MB per file</div>
      </div>
    </div>,
    <div>
      <div style={{marginBottom:18}}><div className="syne" style={{fontWeight:700,fontSize:18,marginBottom:4}}>Review and Publish</div><div className="mono" style={{fontSize:9,color:"var(--muted)"}}>Confirm critical facts before submitting for verification.</div></div>
      <div style={{background:"var(--green-bg)",border:"1px solid var(--green-border)",borderRadius:7,padding:"14px 16px",marginBottom:14}}>
        <div className="mono" style={{fontSize:9,color:"var(--green)",marginBottom:10}}>Listing Summary</div>
        {[["Type",propType?propType.charAt(0).toUpperCase()+propType.slice(1):"Not selected"],["Address","Prestige Tech Park T5, ORR Bengaluru"],["Carpet Area","9,200 sq ft"],["Asking","INR 102 / sqft / mo + INR 30 CAM"],["Available From","Jun 2025"],["Evidence","4 of 6 documents uploaded"]].map(([k,v])=>(
          <div key={k} className="d-row"><span className="d-k">{k}</span><span className="d-v" style={{fontSize:11}}>{v}</span></div>
        ))}
      </div>
      <div style={{background:"var(--amber-bg)",border:"1px solid var(--amber-border)",borderRadius:5,padding:"10px 14px",fontFamily:"DM Mono",fontSize:8.5,color:"var(--amber)",marginBottom:14,lineHeight:1.9}}>
        By publishing, you confirm all details are accurate. Misrepresentation may result in listing suspension and potential legal liability.
      </div>
      <div style={{display:"flex",gap:8}}>
        <button className="btn btn-green" onClick={()=>showToast("Submitted for verification! ID: L00" + Math.floor(Math.random()*9+7))}>Submit for Verification</button>
        <button className="btn btn-ghost" onClick={()=>showToast("Saved as draft.")}>Save Draft</button>
      </div>
    </div>
  ];

  return (
    <div className="fade" style={{maxWidth:720,margin:"0 auto"}}>
      <div className="wiz-steps">
        {WIZ_STEPS.map((s,i)=>(
          <div key={i} className={`wiz-step ${i===step?"ws-active":i<step?"ws-done":"ws-future"}`} onClick={()=>i<=step&&setStep(i)}>
            <div className="wiz-num">{i<step?"v":i+1}</div>
            <div className="wiz-lbl">{s}</div>
          </div>
        ))}
      </div>
      <div className="wiz-card">
        {stepContent[step]}
        <div className="wiz-nav">
          <button className="btn btn-ghost" onClick={()=>setStep(Math.max(0,step-1))} style={{visibility:step===0?"hidden":"visible"}}>Back</button>
          <span className="mono" style={{fontSize:8,color:saved?"var(--green)":"var(--muted)"}}>{saved?"Saved":"Step "+( step+1)+" of "+WIZ_STEPS.length}</span>
          {step<WIZ_STEPS.length-1&&<button className="btn btn-accent" onClick={()=>{setStep(Math.min(WIZ_STEPS.length-1,step+1));autoSave();}}>Continue</button>}
        </div>
      </div>
    </div>
  );
}

function AdminView({showToast}) {
  return (
    <div className="fade">
      <div className="kpi-row">
        {[["14","Pending Review","b-warn"],["3","Duplicate Flags","b-dist"],["28","Verif. Tasks","b-draft"],["2","Flagged Items","b-dist"]].map(([v,l,b],i)=>(
          <div key={i} className="kpi" onClick={()=>showToast(`Opening ${l} queue…`)}>
            <div className="kpi-val syne" style={{color:b==="b-dist"?"var(--red)":b==="b-warn"?"var(--amber)":undefined}}>{v}</div>
            <div className="kpi-lbl">{l}</div>
          </div>
        ))}
      </div>
      <div className="two-col">
        <div>
          <div className="tbl-wrap">
            <div className="tbl-bar"><span className="tbl-title">Moderation Queue</span><button className="btn btn-accent btn-sm" style={{marginLeft:"auto"}} onClick={()=>showToast("Batch assigned to Research Team")}>Assign Batch</button></div>
            {[["L007","Warehouse Unit 9, Bhiwandi","Broker: R. Sharma","industrial","New"],["L008","Plot 7C MIDC Ranjangaon","Owner Direct","land","New"],["L009","Office 14F Nariman Pt","Research Team","office","Edit"],["L010","Cold Store, Panvel","Unknown Source","industrial","Flagged"]].map(([id,n,by,t,s],i)=>(
              <div key={i} className="q-item" onClick={()=>showToast(`Reviewing ${id}…`)}>
                <div className="q-flag" style={{background:s==="New"?"var(--accent2)":s==="Edit"?"var(--amber)":"var(--red)"}}/>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:12}}>{n}</div>
                  <div className="mono" style={{fontSize:8,color:"var(--muted)",marginTop:2}}>{id} · {by}</div>
                </div>
                <Badge type={t}/>
                <span className={`badge ${s==="New"?"b-office":s==="Edit"?"b-warn":"b-dist"}`}>{s}</span>
                <button className="btn btn-ghost btn-xs" onClick={e=>{e.stopPropagation();showToast(`Reviewing ${id}…`);}}>Review</button>
                <button className="btn btn-accent btn-xs" onClick={e=>{e.stopPropagation();showToast(`${id} verified`);}}>Verify</button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="panel">
            <div className="panel-hdr"><span className="panel-hdr-title">Verification Queue</span><div className="live-dot"/></div>
            {[["L001","BKC Office 12F","Site visit","Priya T."],["L003","Bhiwandi WH","Doc review","Mohit S."],["L005","Cold Store Panvel","Unassigned","—"]].map(([id,n,m,who])=>(
              <div key={id} className="d-row" style={{padding:"10px 16px",cursor:"pointer"}} onClick={()=>showToast(`Assigning ${id} verification…`)}>
                <div><div style={{fontWeight:600,fontSize:12}}>{n}</div><div className="mono" style={{fontSize:8,color:"var(--muted)"}}>{id} · {who}</div></div>
                <span className="badge b-warn">{m}</span>
              </div>
            ))}
          </div>
          <div className="panel">
            <div className="panel-hdr"><span className="panel-hdr-title">Audit Log</span></div>
            {[["L004","Confidence updated 88 to 97","Priya T.","2h ago"],["D001","EMD corrigendum applied","System","4h ago"],["L002","Title document verified","Mohit S.","Yesterday"],["L001","Listing published","Owner","2d ago"]].map(([id,a,who,when])=>(
              <div key={id+when} style={{padding:"9px 16px",borderBottom:"1px solid var(--border)",fontSize:11.5}}>
                <span className="mono" style={{color:"var(--accent)",fontSize:9}}>{id}</span> — {a}
                <div className="mono" style={{fontSize:8.5,color:"var(--muted)",marginTop:2}}>{who} · {when}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── RESEARCH DATA ─────────────── */
const CITY_RESEARCH = [
  {
    id:"pune",name:"Pune",stock:"67.6 msf",vacancy:"14.8%",vacYoY:"-1.4pp",avgRent:"77.4",rentYoY:"+1.3%",
    q4Absorption:"2.0 msf",q4AbsYoY:"+100%",annualAbsorption:"5.5 msf",annualAbsYoY:"+9%",
    newSupply:"2.0 msf",supplyYoY:"0%",annualSupply:"4.3 msf",annualSupplyYoY:"-34%",
    upcomingSupply:"1.6 msf",upcomingLabel:"Q1 2024",
    orientation:"Balanced",demandIT:100,
    topDrivers:[["BFSI","27%"],["Flex Space","24%"],["Engg & Mftg","19%"]],
    insights:["BFSI sector emerged as top occupier of 2023 with notable large deals, followed by Flex space","CBD and Baner-Balewadi witnessed highest leasing, together accounting for ~50% of city demand","Occupancy levels improved on quarterly basis amidst robust demand"],
    vacancyOutlook:"stable",rentOutlook:"up",
    subMarkets:[["CBD","96.2","▲"],["Kharadi","91.9","▲"],["Baner-Balewadi","89.4","▲"],["Hadapsar","85.8","◆"],["Viman Nagar","80.5","◆"],["Avg Rent","77.4","◆"],["Hinjewadi","54.1","◆"],["PCMC","52.3","◆"]],
  },
  {
    id:"mumbai",name:"Mumbai",stock:"80.2 msf",vacancy:"13.2%",vacYoY:"-0.8pp",avgRent:"142.0",rentYoY:"+2.1%",
    q4Absorption:"2.8 msf",q4AbsYoY:"+85%",annualAbsorption:"9.1 msf",annualAbsYoY:"+14%",
    newSupply:"2.2 msf",supplyYoY:"+10%",annualSupply:"7.8 msf",annualSupplyYoY:"-12%",
    upcomingSupply:"2.1 msf",upcomingLabel:"Q1 2024",
    orientation:"Balanced",demandIT:65,
    topDrivers:[["BFSI","32%"],["IT / ITeS","28%"],["Flex Space","18%"]],
    insights:["BKC and Navi Mumbai drove majority of leasing activity in 2023","BFSI remained dominant occupier; large block deals characterized Q4","Grade A vacancy tightened sharply in core BKC micro-market"],
    vacancyOutlook:"down",rentOutlook:"up",
    subMarkets:[["BKC","145.0","▲"],["Nariman Pt","138.0","▲"],["Lower Parel","128.0","▲"],["Andheri E","118.0","◆"],["Navi Mumbai","82.0","◆"],["Avg Rent","142.0","◆"],["Thane","68.0","◆"],["Goregaon","95.0","◆"]],
  },
  {
    id:"bengaluru",name:"Bengaluru",stock:"196.5 msf",vacancy:"16.8%",vacYoY:"+0.6pp",avgRent:"105.0",rentYoY:"+2.8%",
    q4Absorption:"4.2 msf",q4AbsYoY:"+62%",annualAbsorption:"15.3 msf",annualAbsYoY:"+18%",
    newSupply:"5.1 msf",supplyYoY:"+22%",annualSupply:"18.2 msf",annualSupplyYoY:"+8%",
    upcomingSupply:"4.8 msf",upcomingLabel:"Q1 2024",
    orientation:"Tenant",demandIT:82,
    topDrivers:[["IT / ITeS","45%"],["GCC / MNC","28%"],["Flex Space","15%"]],
    insights:["Bengaluru retained its position as India's largest office market by volume","GCC expansion accelerated with multiple large format deals on ORR and Whitefield","Vacancy uptick driven by fresh completions outpacing near-term absorption"],
    vacancyOutlook:"up",rentOutlook:"up",
    subMarkets:[["Outer Ring Rd","107.0","▲"],["Whitefield","95.0","▲"],["CBD","122.0","▲"],["Koramangala","118.0","◆"],["Electronic City","72.0","◆"],["Avg Rent","105.0","◆"],["Sarjapur","88.0","◆"],["EPIP Zone","68.0","◆"]],
  },
  {
    id:"hyderabad",name:"Hyderabad",stock:"95.4 msf",vacancy:"17.2%",vacYoY:"+1.1pp",avgRent:"88.0",rentYoY:"+1.8%",
    q4Absorption:"2.1 msf",q4AbsYoY:"+45%",annualAbsorption:"7.8 msf",annualAbsYoY:"+6%",
    newSupply:"3.2 msf",supplyYoY:"+28%",annualSupply:"11.4 msf",annualSupplyYoY:"+15%",
    upcomingSupply:"3.5 msf",upcomingLabel:"Q1 2024",
    orientation:"Tenant",demandIT:78,
    topDrivers:[["IT / ITeS","42%"],["GCC","24%"],["BFSI","16%"]],
    insights:["HITEC City and Gachibowli continue to dominate leasing with large GCC deals","Supply outpaced absorption in 2023, contributing to vacancy rise","Market expected to stabilise as pipeline projects are delayed"],
    vacancyOutlook:"up",rentOutlook:"stable",
    subMarkets:[["HITEC City","95.0","▲"],["Gachibowli","88.0","▲"],["Financial Dist","92.0","▲"],["Madhapur","85.0","◆"],["Nanakramguda","78.0","◆"],["Avg Rent","88.0","◆"],["Manikonda","62.0","◆"],["Uppal","55.0","◆"]],
  },
  {
    id:"delhi",name:"Delhi NCR",stock:"115.8 msf",vacancy:"22.4%",vacYoY:"-0.5pp",avgRent:"138.0",rentYoY:"+0.9%",
    q4Absorption:"2.5 msf",q4AbsYoY:"+38%",annualAbsorption:"8.4 msf",annualAbsYoY:"+4%",
    newSupply:"2.8 msf",supplyYoY:"+5%",annualSupply:"9.2 msf",annualSupplyYoY:"+2%",
    upcomingSupply:"3.2 msf",upcomingLabel:"Q1 2024",
    orientation:"Tenant",demandIT:55,
    topDrivers:[["IT / ITeS","28%"],["BFSI","24%"],["Consulting","20%"]],
    insights:["Gurgaon Cyber City and DLF areas dominated occupier demand","Manufacturing and pharma sector demand emerged from Greater Noida cluster","High vacancy in peripheral markets creating tenant-favorable conditions"],
    vacancyOutlook:"stable",rentOutlook:"stable",
    subMarkets:[["Gurgaon Cyber","148.0","▲"],["Aerocity","138.0","▲"],["Connaught Pl","165.0","▲"],["Noida Exp Way","92.0","◆"],["Gurgaon Golf","128.0","◆"],["Avg Rent","138.0","◆"],["Dwarka Exp","88.0","◆"],["Gr Noida","62.0","◆"]],
  },
  {
    id:"chennai",name:"Chennai",stock:"68.2 msf",vacancy:"18.6%",vacYoY:"+0.3pp",avgRent:"68.0",rentYoY:"-0.4%",
    q4Absorption:"1.4 msf",q4AbsYoY:"+22%",annualAbsorption:"4.9 msf",annualAbsYoY:"-8%",
    newSupply:"1.8 msf",supplyYoY:"+12%",annualSupply:"6.2 msf",annualSupplyYoY:"+18%",
    upcomingSupply:"2.0 msf",upcomingLabel:"Q1 2024",
    orientation:"Tenant",demandIT:72,
    topDrivers:[["IT / ITeS","40%"],["Engg & Mftg","22%"],["BFSI","18%"]],
    insights:["OMR corridor remained the primary demand driver for tech occupiers","Vacancy edged up due to new completions with limited near-term absorption","Rental correction expected to attract fresh demand from cost-sensitive occupiers"],
    vacancyOutlook:"stable",rentOutlook:"down",
    subMarkets:[["CBD","95.0","◆"],["OMR Phase 1","72.0","◆"],["OMR Phase 2","62.0","◆"],["Perungudi","68.0","◆"],["Sholinganallur","65.0","◆"],["Avg Rent","68.0","◆"],["Ambattur","48.0","◆"],["Guindy","82.0","◆"]],
  },
  {
    id:"kolkata",name:"Kolkata",stock:"18.4 msf",vacancy:"28.2%",vacYoY:"+1.8pp",avgRent:"62.0",rentYoY:"-1.2%",
    q4Absorption:"0.4 msf",q4AbsYoY:"-15%",annualAbsorption:"1.2 msf",annualAbsYoY:"-18%",
    newSupply:"0.6 msf",supplyYoY:"+8%",annualSupply:"1.8 msf",annualSupplyYoY:"+22%",
    upcomingSupply:"0.8 msf",upcomingLabel:"Q1 2024",
    orientation:"Tenant",demandIT:48,
    topDrivers:[["IT / ITeS","35%"],["BFSI","25%"],["Engg & Mftg","20%"]],
    insights:["Salt Lake Sector V and Rajarhat remain the primary commercial zones","Vacancy remains elevated as new supply outstrips demand growth","BFSI and IT sectors provide stable base but market needs fresh catalysts"],
    vacancyOutlook:"up",rentOutlook:"down",
    subMarkets:[["Salt Lake V","72.0","◆"],["Rajarhat","58.0","◆"],["CBD","88.0","◆"],["New Town","55.0","◆"],["Avg Rent","62.0","◆"],["Sector 2","48.0","◆"],["Park St","95.0","◆"],["Kasba","52.0","◆"]],
  },
  {
    id:"ahmedabad",name:"Ahmedabad",stock:"14.2 msf",vacancy:"20.4%",vacYoY:"-0.6pp",avgRent:"55.0",rentYoY:"+1.8%",
    q4Absorption:"0.5 msf",q4AbsYoY:"+40%",annualAbsorption:"1.8 msf",annualAbsYoY:"+12%",
    newSupply:"0.7 msf",supplyYoY:"+15%",annualSupply:"2.1 msf",annualSupplyYoY:"+5%",
    upcomingSupply:"0.9 msf",upcomingLabel:"Q1 2024",
    orientation:"Balanced",demandIT:38,
    topDrivers:[["BFSI","30%"],["Engg & Mftg","28%"],["IT / ITeS","22%"]],
    insights:["SBD and GIFT City driving premium demand in Ahmedabad market","GIFT City IFSC attracting BFSI tenants at premium rentals","Manufacturing sector growth fueling industrial and commercial demand"],
    vacancyOutlook:"down",rentOutlook:"up",
    subMarkets:[["GIFT City","85.0","▲"],["SBD","62.0","▲"],["CBD","72.0","▲"],["CG Road","68.0","◆"],["Prahlad Nagar","58.0","◆"],["Avg Rent","55.0","◆"],["Satellite","52.0","◆"],["Maninagar","38.0","◆"]],
  },
];

/* ─── RESEARCH VIEW ─────────────── */
function ResearchView({showToast}) {
  const [activeCity,setActiveCity]=useState("pune");
  const [tab,setTab]=useState("snapshot");
  const city=CITY_RESEARCH.find(c=>c.id===activeCity)||CITY_RESEARCH[0];

  const OutlookArrow=({dir})=>{
    if(dir==="up") return <span style={{color:"var(--green)",fontSize:11}}>▲</span>;
    if(dir==="down") return <span style={{color:"var(--red)",fontSize:11}}>▼</span>;
    return <span style={{color:"var(--amber)",fontSize:11}}>◆</span>;
  };

  return (
    <div className="fade">
      {/* city selector */}
      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {CITY_RESEARCH.map(c=>(
          <div key={c.id} className={`pill ${activeCity===c.id?"on":""}`} onClick={()=>setActiveCity(c.id)} style={{fontSize:11}}>
            {c.name}
          </div>
        ))}
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6}}>
          <div className="live-dot"/>
          <span className="mono" style={{fontSize:8,color:"var(--muted)"}}>Q4 2023 DATA</span>
        </div>
      </div>

      {/* tabs */}
      <div className="tabs">
        {["snapshot","sub-markets","insights"].map(t=>(
          <div key={t} className={`tab ${tab===t?"on":""}`} onClick={()=>setTab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</div>
        ))}
      </div>

      {tab==="snapshot"&&(
        <div>
          {/* KPI top row — mirrors Pune dashboard */}
          <div className="kpi-row">
            <div className="kpi" onClick={()=>showToast(`${city.name} Q4 absorption: ${city.q4Absorption}`)}>
              <div className="kpi-val syne">{city.q4Absorption}</div>
              <div className="kpi-lbl">Q4 2023 Absorption</div>
              <div className={`kpi-delta mono ${city.q4AbsYoY.startsWith("+")?"delta-up":"delta-dn"}`}>{city.q4AbsYoY} YoY</div>
            </div>
            <div className="kpi" onClick={()=>showToast(`${city.name} 2023 annual absorption: ${city.annualAbsorption}`)}>
              <div className="kpi-val syne">{city.annualAbsorption}</div>
              <div className="kpi-lbl">2023 Gross Absorption</div>
              <div className={`kpi-delta mono ${city.annualAbsYoY.startsWith("+")?"delta-up":"delta-dn"}`}>{city.annualAbsYoY} YoY</div>
            </div>
            <div className="kpi" onClick={()=>showToast(`${city.name} new supply: ${city.newSupply}`)}>
              <div className="kpi-val syne">{city.newSupply}</div>
              <div className="kpi-lbl">Q4 New Supply</div>
              <div className={`kpi-delta mono ${city.supplyYoY.startsWith("+")?"delta-up":"delta-dn"}`}>{city.supplyYoY} YoY</div>
            </div>
            <div className="kpi" onClick={()=>showToast(`${city.name} annual supply: ${city.annualSupply}`)}>
              <div className="kpi-val syne">{city.annualSupply}</div>
              <div className="kpi-lbl">2023 New Supply</div>
              <div className={`kpi-delta mono ${city.annualSupplyYoY.startsWith("+")?"delta-up":"delta-dn"}`}>{city.annualSupplyYoY} YoY</div>
            </div>
          </div>

          <div className="two-col">
            <div>
              {/* vacancy + rent panel */}
              <div className="panel" style={{marginBottom:12}}>
                <div className="panel-hdr" style={{justifyContent:"space-between"}}>
                  <span className="panel-hdr-title">Vacancy &amp; Rents</span>
                  <span className="badge b-draft">{city.stock} stock</span>
                </div>
                <div className="panel-body">
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                    <div>
                      <div className="mono" style={{fontSize:8,color:"var(--muted)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>Vacancy Q4 2023</div>
                      <div className="syne" style={{fontWeight:800,fontSize:32,letterSpacing:-1,lineHeight:1}}>{city.vacancy}</div>
                      <div className="mono" style={{fontSize:9,marginTop:4,color:city.vacYoY.startsWith("-")?"var(--green)":"var(--red)"}}>{city.vacYoY} YoY</div>
                      <div style={{display:"flex",alignItems:"center",gap:5,marginTop:8}}>
                        <span className="mono" style={{fontSize:8,color:"var(--muted)"}}>Outlook</span>
                        <OutlookArrow dir={city.vacancyOutlook}/>
                      </div>
                    </div>
                    <div>
                      <div className="mono" style={{fontSize:8,color:"var(--muted)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>Avg Rent Q4 2023</div>
                      <div className="syne" style={{fontWeight:800,fontSize:32,letterSpacing:-1,lineHeight:1}}>₹{city.avgRent}</div>
                      <div className="mono" style={{fontSize:9,marginTop:4}}><span style={{color:"var(--muted)"}}>/ sf / month</span></div>
                      <div className="mono" style={{fontSize:9,marginTop:4,color:city.rentYoY.startsWith("+")?"var(--green)":"var(--red)"}}>{city.rentYoY} YoY</div>
                      <div style={{display:"flex",alignItems:"center",gap:5,marginTop:4}}>
                        <span className="mono" style={{fontSize:8,color:"var(--muted)"}}>Outlook</span>
                        <OutlookArrow dir={city.rentOutlook}/>
                      </div>
                    </div>
                  </div>
                  <div style={{marginTop:16,paddingTop:14,borderTop:"1px solid var(--border)"}}>
                    <div className="mono" style={{fontSize:8,color:"var(--muted)",marginBottom:8,letterSpacing:1}}>MARKET ORIENTATION</div>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span className="mono" style={{fontSize:8,color:"var(--muted)"}}>Tenant</span>
                      <span className="mono" style={{fontSize:9,fontWeight:600,color:"var(--accent)"}}>{city.orientation}</span>
                      <span className="mono" style={{fontSize:8,color:"var(--muted)"}}>Landlord</span>
                    </div>
                    <div style={{height:6,background:"var(--bg)",borderRadius:3,position:"relative"}}>
                      <div style={{
                        position:"absolute",left:city.orientation==="Tenant"?"15%":city.orientation==="Landlord"?"75%":"42%",
                        top:"50%",transform:"translate(-50%,-50%)",
                        width:12,height:12,borderRadius:3,background:"var(--accent)",
                      }}/>
                      <div style={{height:"100%",borderRadius:3,background:`linear-gradient(90deg, var(--green-bg) 0%, var(--amber-bg) 50%, var(--red-bg) 100%)`,border:"1px solid var(--border)"}}/>
                    </div>
                  </div>
                </div>
              </div>

              {/* upcoming supply */}
              <div className="panel">
                <div className="panel-hdr"><span className="panel-hdr-title">Upcoming Supply — {city.upcomingLabel}</span></div>
                <div className="panel-body">
                  <div style={{display:"flex",alignItems:"center",gap:18}}>
                    <div className="syne" style={{fontWeight:800,fontSize:38,letterSpacing:-2,color:"var(--accent)"}}>{city.upcomingSupply}</div>
                    <div>
                      <div className="mono" style={{fontSize:8,color:"var(--muted)"}}>PIPELINE — {city.upcomingLabel}</div>
                      <div style={{marginTop:6}}>
                        <div className="mono" style={{fontSize:8,color:"var(--muted)",marginBottom:2}}>IT DEMAND SHARE</div>
                        <div style={{height:5,background:"var(--bg)",borderRadius:3,overflow:"hidden",width:120}}>
                          <div style={{width:`${city.demandIT}%`,height:"100%",background:"var(--accent2)",borderRadius:3}}/>
                        </div>
                        <div className="mono" style={{fontSize:8,color:"var(--accent2)",marginTop:2}}>{city.demandIT}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              {/* demand drivers */}
              <div className="panel" style={{marginBottom:12}}>
                <div className="panel-hdr"><span className="panel-hdr-title">Key Demand Drivers — 2023</span></div>
                <div className="panel-body">
                  {city.topDrivers.map(([nm,pct],i)=>(
                    <div key={nm} style={{marginBottom:i<city.topDrivers.length-1?12:0}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                        <span style={{fontWeight:600,fontSize:12}}>{nm}</span>
                        <span className="syne" style={{fontWeight:800,fontSize:16,color:"var(--accent)"}}>{pct}</span>
                      </div>
                      <div style={{height:4,background:"var(--bg)",borderRadius:2,overflow:"hidden"}}>
                        <div style={{width:pct,height:"100%",background:i===0?"var(--accent)":i===1?"var(--accent2)":"var(--green)",borderRadius:2}}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* insights */}
              <div className="panel">
                <div className="panel-hdr"><span className="panel-hdr-title">Market Insights</span></div>
                <div className="panel-body" style={{padding:0}}>
                  {city.insights.map((ins,i)=>(
                    <div key={i} style={{display:"flex",gap:10,padding:"10px 16px",borderBottom:i<city.insights.length-1?"1px solid var(--border)":"none"}}>
                      <div style={{width:5,height:5,borderRadius:"50%",background:"var(--accent)",flexShrink:0,marginTop:5}}/>
                      <div style={{fontSize:12,lineHeight:1.6,color:"var(--ink)"}}>{ins}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab==="sub-markets"&&(
        <div>
          <div className="tbl-wrap">
            <div className="tbl-bar">
              <span className="tbl-title">Rental Trends — {city.name} Sub-Markets (INR/sf/month)</span>
              <button className="btn btn-ghost btn-sm" style={{marginLeft:"auto"}} onClick={()=>showToast("Exporting sub-market data…")}>Export</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Sub-Market</th>
                  <th>Q4 2023 Rent</th>
                  <th>Q1 2024 Forecast</th>
                  <th>Trend</th>
                  <th>vs. City Avg</th>
                </tr>
              </thead>
              <tbody>
                {city.subMarkets.map(([nm,rent,trend])=>{
                  const avg=parseFloat(city.avgRent);
                  const r=parseFloat(rent);
                  const diff=((r-avg)/avg*100).toFixed(1);
                  const above=r>=avg;
                  return (
                    <tr key={nm} onClick={()=>showToast(`${nm}: INR ${rent}/sf/mo — ${above?"above":"below"} city avg`)}>
                      <td><div className="td-name">{nm}</div></td>
                      <td><span className="syne" style={{fontWeight:700,fontSize:15}}>₹{rent}</span></td>
                      <td><span className="mono" style={{fontSize:11,color:"var(--muted)"}}>₹{rent} est.</span></td>
                      <td><span style={{fontSize:14,color:trend==="▲"?"var(--green)":trend==="▼"?"var(--red)":"var(--amber)"}}>{trend}</span></td>
                      <td>
                        <span className="badge" style={{background:above?"var(--green-bg)":"var(--red-bg)",color:above?"var(--green)":"var(--red)",border:`1px solid ${above?"var(--green-border)":"var(--red-border)"}`}}>
                          {above?"+":""}{diff}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{marginTop:12,background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:6,padding:"9px 14px",fontFamily:"DM Mono",fontSize:8.5,color:"var(--muted)",lineHeight:1.8}}>
            Weighted Average Quoted (WAQ) Rents in INR per sq ft per month for warm shell offices. Excludes CAM and taxes. Data pertains to Grade A office buildings. Gross absorption excludes lease renewals, pre-commitments, and LOI-only deals.
          </div>
        </div>
      )}

      {tab==="insights"&&(
        <div className="three-col">
          {CITY_RESEARCH.map(c=>(
            <div key={c.id} className="panel" style={{cursor:"pointer",marginBottom:0}} onClick={()=>{setActiveCity(c.id);setTab("snapshot");showToast(`Loading ${c.name} market snapshot…`);}}>
              <div className="panel-hdr" style={{background:activeCity===c.id?"var(--accent)":"var(--surface2)"}}>
                <span className="panel-hdr-title" style={{color:activeCity===c.id?"#fff":"var(--muted)"}}>{c.name.toUpperCase()}</span>
                <span className="badge" style={{background:activeCity===c.id?"rgba(255,255,255,.2)":"var(--surface)",color:activeCity===c.id?"#fff":"var(--muted)",border:"none",fontSize:8}}>{c.stock}</span>
              </div>
              <div className="panel-body">
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                  <div>
                    <div className="mono" style={{fontSize:7,color:"var(--muted)"}}>VACANCY</div>
                    <div className="syne" style={{fontWeight:800,fontSize:18,letterSpacing:-.5}}>{c.vacancy}</div>
                    <div className="mono" style={{fontSize:8,color:c.vacYoY.startsWith("-")?"var(--green)":"var(--red)"}}>{c.vacYoY}</div>
                  </div>
                  <div>
                    <div className="mono" style={{fontSize:7,color:"var(--muted)"}}>AVG RENT</div>
                    <div className="syne" style={{fontWeight:800,fontSize:18,letterSpacing:-.5}}>₹{c.avgRent}</div>
                    <div className="mono" style={{fontSize:8,color:c.rentYoY.startsWith("+")?"var(--green)":"var(--red)"}}>{c.rentYoY}</div>
                  </div>
                </div>
                <div style={{marginBottom:8}}>
                  <div className="mono" style={{fontSize:7,color:"var(--muted)",marginBottom:4}}>TOP DRIVER</div>
                  <span className="badge b-office">{c.topDrivers[0][0]}</span>
                  <span className="syne" style={{fontWeight:700,fontSize:13,marginLeft:8,color:"var(--accent)"}}>{c.topDrivers[0][1]}</span>
                </div>
                <div className="mono" style={{fontSize:7.5,color:"var(--muted)",lineHeight:1.7}}>{c.insights[0].substring(0,90)}…</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── NAV ──────────────────────── */
const NAV=[
  {id:"search",lbl:"Market Search",section:"Discovery"},
  {id:"engine",lbl:"Search Engine",section:"Discovery"},
  {id:"map",lbl:"Market Map",section:"Discovery"},
  {id:"research",lbl:"India Research",section:"Discovery"},
  {id:"building",lbl:"Building Profile",section:"Discovery"},
  {id:"distressed",lbl:"Distressed Hub",section:"Discovery"},
  {id:"wizard",lbl:"List Property",section:"Operations"},
  {id:"admin",lbl:"Admin Console",section:"Operations",badge:14},
];

const VIEWS={search:SearchView,engine:SearchEngineView,map:MapView,research:ResearchView,building:BuildingView,distressed:DistressedView,wizard:WizardView,admin:AdminView};

/* ─── TICKER ───────────────────── */
const TickerStrip=()=>(
  <div className="ticker-strip">
    <div className="ticker-inner">
      {[...TICKS,...TICKS].map(([nm,val,chg,up],i)=>(
        <div key={i} className="tick-seg">
          <span className="tick-nm">{nm}</span>
          <span className="tick-val">INR {val}</span>
          <span className={up?"tick-up":"tick-dn"}>{chg}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ─── APP ──────────────────────── */
export default function App() {
  const [view,setView]=useState("search");
  const [toast,setToast]=useState(null);
  const timerRef=useRef(null);

  const showToast=useCallback((msg)=>{
    if(timerRef.current) clearTimeout(timerRef.current);
    setToast(msg);
    timerRef.current=setTimeout(()=>setToast(null),3000);
  },[]);

  const sections=[...new Set(NAV.map(n=>n.section))];
  const ViewComp=VIEWS[view]||SearchView;
  const curr=NAV.find(n=>n.id===view);

  return (
    <>
      <style>{FONTS+G}</style>
      <div className="shell">
        <div className="sidebar">
          <div className="logo-wrap">
            <div className="logo-mark syne">ALGO<span>ESTATE</span></div>
            <div className="logo-sub">Commercial Intelligence Platform</div>
          </div>
          <TickerStrip/>
          <div className="nav-wrap">
            {sections.map(sec=>(
              <div key={sec}>
                <div className="nav-sec-lbl">{sec}</div>
                {NAV.filter(n=>n.section===sec).map(n=>(
                  <button key={n.id} className={`nav-item ${view===n.id?"active":""}`} onClick={()=>setView(n.id)}>
                    {n.lbl}
                    {n.badge&&<span className="nav-badge">{n.badge}</span>}
                  </button>
                ))}
              </div>
            ))}
            <div className="nav-sec-lbl">Tools</div>
            {[["Market Monitor"],["My Listings"],["Alerts (3)"]].map(([lbl])=>(
              <button key={lbl} className="nav-item" onClick={()=>showToast(`Opening ${lbl}…`)}>
                {lbl}
              </button>
            ))}
          </div>
          <div className="user-bar">
            <div className="av">RJ</div>
            <div><div className="u-name">Raj</div><div className="u-role">Investor · Verified</div></div>
            <div className="status-dot"/>
          </div>
        </div>

        <div className="main">
          <div className="topbar">
            <div>
              <div className="tb-title syne">{curr?.lbl}</div>
              <div className="tb-crumb mono">ALGO ESTATE · Commercial Intelligence · India</div>
            </div>
            <div className="tb-spacer"/>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <div className="live-dot"/>
              <span className="mono" style={{fontSize:8,color:"var(--muted)"}}>Live</span>
            </div>
            <Clock/>
            <button className="btn btn-ghost btn-sm" onClick={()=>setView("map")}>Map View</button>
            <button className="btn btn-accent" onClick={()=>setView("wizard")}>+ List Property</button>
          </div>
          <div className="content">
            <ViewComp key={view} showToast={showToast}/>
          </div>
        </div>
      </div>
      {toast&&<Toast msg={toast} onClose={()=>setToast(null)}/>}
    </>
  );
}
