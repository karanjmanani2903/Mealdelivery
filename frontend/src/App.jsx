import { useEffect, useState } from "react";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --lime: #b5e048;
    --lime-dark: #96c52e;
    --lime-glow: rgba(181,224,72,0.18);
    --lime-soft: #f2fad8;
    --ink: #1a1f0e;
    --ink-2: #252b14;
    --ink-3: #323820;
    --muted: #636b52;
    --muted-2: #96a07e;
    --surface: #f7f8f3;
    --card: #ffffff;
    --border: rgba(0,0,0,0.07);
    --border-hover: rgba(0,0,0,0.16);
    --veg: #2db87a;
    --nonveg: #e85c42;
    --font: 'Nunito', sans-serif;
    --radius: 20px;
    --radius-sm: 14px;
    --radius-xs: 10px;
    --transition: 0.24s cubic-bezier(0.34,1.56,0.64,1);
  }

  body { font-family: var(--font); background: var(--surface); color: var(--ink); -webkit-font-smoothing: antialiased; }
  .mp-app { min-height: 100vh; }

  /* NAV */
  .nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(26,31,14,0.93); backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.05);
    padding: 0 32px; display: flex; align-items: center; justify-content: space-between; height: 68px;
  }
  .nav-logo { font-family: var(--font); font-size: 24px; font-weight: 900; letter-spacing: -0.3px; color: white; cursor: pointer; text-decoration: none; line-height: 1; }
  .nav-logo em { font-style: normal; color: var(--lime); }
  .nav-links { display: flex; align-items: center; gap: 2px; }
  .nav-link { font-size: 15px; font-weight: 700; padding: 8px 16px; border-radius: 12px; color: rgba(255,255,255,0.55); cursor: pointer; border: none; background: none; transition: color 0.15s, background 0.15s; font-family: var(--font); }
  .nav-link:hover { color: white; background: rgba(255,255,255,0.07); }
  .nav-link.active { color: var(--lime); background: rgba(181,224,72,0.1); }
  .nav-right { display: flex; align-items: center; gap: 12px; }
  .nav-cart { display: flex; align-items: center; gap: 8px; background: var(--lime); color: var(--ink); font-weight: 800; font-size: 14px; padding: 9px 18px; border-radius: 12px; cursor: pointer; border: none; transition: transform 0.18s, background 0.15s; font-family: var(--font); }
  .nav-cart:hover { background: var(--lime-dark); transform: scale(1.04); }
  .cart-dot { width: 22px; height: 22px; border-radius: 50%; background: var(--ink); color: var(--lime); font-size: 12px; font-weight: 900; display: flex; align-items: center; justify-content: center; }

  /* HERO */
  .hero { min-height: 90vh; background: var(--ink); display: grid; grid-template-columns: 1fr 1fr; align-items: center; padding: 80px 64px; gap: 64px; position: relative; overflow: hidden; }
  .hero::before { content: ''; position: absolute; top: -180px; right: -80px; width: 680px; height: 680px; border-radius: 50%; background: radial-gradient(circle, rgba(181,224,72,0.11) 0%, transparent 68%); pointer-events: none; }
  .hero::after { content: ''; position: absolute; bottom: -120px; left: -60px; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(181,224,72,0.06) 0%, transparent 70%); pointer-events: none; }
  .hero-tag { display: inline-flex; align-items: center; gap: 8px; background: rgba(181,224,72,0.1); border: 1px solid rgba(181,224,72,0.28); color: var(--lime); font-size: 12px; font-weight: 800; padding: 6px 14px; border-radius: 100px; letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 28px; }
  .hero-tag-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--lime); animation: blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.8)} }
  .hero-h1 { font-family: var(--font); font-size: clamp(46px, 5.5vw, 74px); font-weight: 900; line-height: 1.02; letter-spacing: -1.5px; color: white; margin-bottom: 22px; }
  .hero-h1 em { font-style: normal; color: var(--lime); }
  .hero-body { font-size: 17px; color: rgba(255,255,255,0.5); line-height: 1.7; margin-bottom: 40px; max-width: 460px; font-weight: 500; }
  .hero-ctas { display: flex; gap: 14px; flex-wrap: wrap; }
  .btn-primary { background: var(--lime); color: var(--ink); font-weight: 800; font-size: 15px; padding: 14px 28px; border-radius: var(--radius-sm); border: none; cursor: pointer; transition: var(--transition); font-family: var(--font); display: inline-flex; align-items: center; gap: 8px; }
  .btn-primary:hover { transform: translateY(-3px) scale(1.02); background: var(--lime-dark); }
  .btn-ghost { background: transparent; color: rgba(255,255,255,0.65); font-weight: 700; font-size: 15px; padding: 14px 28px; border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.14); cursor: pointer; transition: 0.18s; font-family: var(--font); display: inline-flex; align-items: center; gap: 8px; }
  .btn-ghost:hover { border-color: rgba(255,255,255,0.38); color: white; background: rgba(255,255,255,0.05); }
  .hero-img-wrap { position: relative; display: flex; align-items: center; justify-content: center; }
  .hero-img { width: 100%; max-width: 520px; height: 460px; object-fit: cover; border-radius: 28px; display: block; border: 1px solid rgba(255,255,255,0.06); }
  .hero-float { position: absolute; background: rgba(22,27,12,0.9); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.09); border-radius: var(--radius); padding: 16px 22px; color: white; min-width: 155px; }
  .hero-float.f1 { bottom: 32px; left: -16px; }
  .hero-float.f2 { top: 32px; right: -16px; }
  .hf-label { font-size: 11px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; font-weight: 700; }
  .hf-value { font-size: 26px; font-weight: 900; color: var(--lime); line-height: 1; }
  .hf-sub { font-size: 12px; color: rgba(255,255,255,0.45); margin-top: 3px; font-weight: 600; }

  /* HOW */
  .how { padding: 100px 64px; background: white; }
  .section-tag { font-size: 12px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted-2); margin-bottom: 10px; }
  .section-title { font-family: var(--font); font-size: clamp(32px, 4vw, 50px); font-weight: 900; letter-spacing: -1.5px; line-height: 1.08; color: var(--ink); margin-bottom: 56px; }
  .section-title em { font-style: normal; color: var(--lime-dark); }
  .steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
  .step { padding: 32px 26px; background: var(--surface); border-radius: var(--radius); border: 2px solid transparent; transition: border-color 0.22s, transform 0.22s, background 0.22s; }
  .step:hover { border-color: var(--lime); transform: translateY(-5px); background: var(--lime-soft); }
  .step-num { font-size: 52px; font-weight: 900; color: rgba(0,0,0,0.05); line-height: 1; margin-bottom: 18px; }
  .step-icon { font-size: 30px; margin-bottom: 14px; }
  .step-title { font-size: 18px; font-weight: 800; margin-bottom: 8px; color: var(--ink); }
  .step-text { font-size: 14px; color: var(--muted); line-height: 1.65; font-weight: 500; }

  /* PAGE */
  .page { padding: 48px 64px; max-width: 1320px; margin: 0 auto; }
  .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 36px; flex-wrap: wrap; gap: 16px; }
  .page-title { font-size: 38px; font-weight: 900; letter-spacing: -1px; }

  /* VEG TOGGLE */
  .veg-toggle-wrap { display: flex; align-items: center; gap: 12px; }
  .veg-toggle-label { font-size: 14px; font-weight: 700; color: var(--muted); transition: color 0.2s; user-select: none; }
  .veg-toggle-label.on { color: var(--veg); }
  .toggle-track { width: 54px; height: 30px; border-radius: 100px; background: #dde3d0; cursor: pointer; position: relative; transition: background 0.25s; border: none; padding: 0; outline: none; flex-shrink: 0; }
  .toggle-track.on { background: var(--veg); }
  .toggle-thumb { position: absolute; top: 4px; left: 4px; width: 22px; height: 22px; border-radius: 50%; background: white; transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1); box-shadow: 0 2px 6px rgba(0,0,0,0.18); }
  .toggle-track.on .toggle-thumb { transform: translateX(24px); }

  /* MEAL GRID */
  .meals-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 24px; }
  .meal-card { background: white; border-radius: var(--radius); border: 2px solid var(--border); overflow: hidden; cursor: pointer; transition: transform 0.24s, box-shadow 0.24s, border-color 0.24s; }
  .meal-card:hover { transform: translateY(-7px); box-shadow: 0 22px 44px rgba(0,0,0,0.09); border-color: rgba(0,0,0,0.13); }
  .meal-card.selected { border-color: var(--lime-dark); box-shadow: 0 0 0 4px var(--lime-glow); }
  .meal-img-wrap { overflow: hidden; height: 190px; }
  .meal-img { width: 100%; height: 190px; object-fit: cover; display: block; transition: transform 0.38s; }
  .meal-card:hover .meal-img { transform: scale(1.05); }
  .meal-img-placeholder { width: 100%; height: 190px; display: flex; align-items: center; justify-content: center; font-size: 52px; }
  .meal-body { padding: 20px 22px; }
  .meal-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 9px; }
  .meal-type { display: flex; align-items: center; font-size: 12px; font-weight: 800; gap: 5px; }
  .meal-type.veg { color: var(--veg); }
  .meal-type.nonveg { color: var(--nonveg); }
  .meal-type.healthy { color: #2b9de8; }
  .type-dot { width: 8px; height: 8px; border-radius: 50%; }
  .meal-cat { font-size: 11px; color: var(--muted-2); background: var(--surface); padding: 3px 10px; border-radius: 100px; font-weight: 700; }
  .meal-name { font-size: 19px; font-weight: 800; margin-bottom: 6px; line-height: 1.25; color: var(--ink); }
  .meal-desc { font-size: 13px; color: var(--muted); line-height: 1.55; margin-bottom: 18px; font-weight: 500; }
  .meal-footer { display: flex; align-items: center; justify-content: space-between; }
  .meal-price { font-size: 22px; font-weight: 900; color: var(--ink); }
  .meal-price span { font-size: 13px; font-weight: 600; color: var(--muted); }
  .add-btn { padding: 9px 18px; border-radius: var(--radius-xs); border: none; font-size: 13px; font-weight: 800; cursor: pointer; transition: var(--transition); font-family: var(--font); }
  .add-btn.add { background: var(--ink); color: var(--lime); }
  .add-btn.add:hover { transform: scale(1.08); background: var(--ink-2); }
  .add-btn.remove { background: rgba(232,92,66,0.1); color: var(--nonveg); }
  .add-btn.remove:hover { background: rgba(232,92,66,0.18); transform: scale(1.05); }

  /* STICKY BAR */
  .sticky-bar { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 200; display: flex; gap: 14px; align-items: center; background: rgba(26,31,14,0.96); padding: 14px 24px; border-radius: 18px; border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(20px); box-shadow: 0 12px 40px rgba(0,0,0,0.3); animation: slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1); }
  @keyframes slideUp { from{transform:translateX(-50%) translateY(40px);opacity:0} to{transform:translateX(-50%) translateY(0);opacity:1} }
  .sticky-text { color: rgba(255,255,255,0.6); font-size: 14px; font-weight: 700; }
  .sticky-count { color: white; font-weight: 900; }

  /* PLANS */
  .plans-hero { background: var(--ink); padding: 68px 64px 0; color: white; }
  .plans-hero h1 { font-size: 56px; font-weight: 900; letter-spacing: -2px; margin-bottom: 12px; line-height: 1.0; }
  .plans-hero h1 em { font-style: normal; color: var(--lime); }
  .plans-hero p { font-size: 18px; color: rgba(255,255,255,0.45); margin-bottom: 44px; font-weight: 500; }
  .plan-tabs { display: flex; gap: 4px; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .plan-tab { padding: 13px 26px; font-size: 15px; font-weight: 800; cursor: pointer; border: none; background: none; color: rgba(255,255,255,0.38); border-bottom: 2px solid transparent; transition: 0.15s; font-family: var(--font); margin-bottom: -1px; }
  .plan-tab.active { color: var(--lime); border-bottom-color: var(--lime); }
  .plans-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 28px; margin-top: 48px; }
  .plan-card { background: white; border-radius: 22px; border: 2px solid var(--border); overflow: hidden; transition: transform 0.24s, box-shadow 0.24s; }
  .plan-card:hover { transform: translateY(-7px); box-shadow: 0 28px 56px rgba(0,0,0,0.1); }
  .plan-card-top { padding: 30px; background: var(--ink); color: white; position: relative; overflow: hidden; }
  .plan-card-top::after { content: attr(data-emoji); position: absolute; right: 18px; bottom: 8px; font-size: 66px; opacity: 0.15; line-height: 1; }
  .plan-badge { display: inline-block; font-size: 11px; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; padding: 5px 13px; border-radius: 100px; background: rgba(181,224,72,0.14); color: var(--lime); border: 1px solid rgba(181,224,72,0.28); margin-bottom: 16px; }
  .plan-title { font-size: 26px; font-weight: 900; margin-bottom: 6px; letter-spacing: -0.5px; }
  .plan-subtitle { font-size: 14px; color: rgba(255,255,255,0.45); font-weight: 600; }
  .plan-days { padding: 24px 28px; }
  .day-row { display: flex; align-items: center; padding: 11px 0; border-bottom: 1px solid var(--border); gap: 14px; }
  .day-row:last-child { border-bottom: none; }
  .day-label { font-size: 12px; font-weight: 800; color: var(--muted-2); width: 36px; text-transform: uppercase; flex-shrink: 0; letter-spacing: 0.04em; }
  .day-meal { font-size: 14px; font-weight: 700; color: var(--ink); flex: 1; }
  .day-type { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .plan-footer { padding: 22px 28px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .plan-price { font-size: 26px; font-weight: 900; color: var(--ink); }
  .plan-price-label { font-size: 12px; color: var(--muted); font-weight: 600; }
  .get-plan-btn { background: var(--ink); color: var(--lime); font-weight: 800; font-size: 14px; padding: 12px 24px; border-radius: var(--radius-xs); border: none; cursor: pointer; transition: var(--transition); font-family: var(--font); }
  .get-plan-btn:hover { background: var(--lime); color: var(--ink); transform: scale(1.05); }

  /* DETAIL */
  .detail { padding: 52px 64px; max-width: 960px; margin: 0 auto; }
  .back-btn { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; color: var(--muted); cursor: pointer; background: none; border: none; padding: 0 0 30px; transition: color 0.15s; font-family: var(--font); }
  .back-btn:hover { color: var(--ink); }
  .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 52px; align-items: start; }
  .detail-img-wrap { overflow: hidden; border-radius: var(--radius); height: 340px; }
  .detail-img { width: 100%; height: 340px; object-fit: cover; display: block; }
  .detail-img-placeholder { width: 100%; height: 340px; border-radius: var(--radius); display: flex; align-items: center; justify-content: center; font-size: 88px; }
  .detail-name { font-size: 38px; font-weight: 900; letter-spacing: -1px; margin-bottom: 12px; line-height: 1.1; }
  .detail-desc { font-size: 16px; color: var(--muted); line-height: 1.65; margin-bottom: 28px; font-weight: 500; }
  .detail-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 28px; }
  .dtag { padding: 6px 16px; border-radius: 100px; font-size: 13px; font-weight: 700; background: var(--surface); color: var(--muted); }
  .ingredients-title { font-size: 19px; font-weight: 800; margin-bottom: 14px; color: var(--ink); }
  .ingredients-list { list-style: none; display: flex; flex-direction: column; gap: 8px; margin-bottom: 28px; }
  .ing-item { display: flex; align-items: center; justify-content: space-between; padding: 11px 15px; background: var(--surface); border-radius: var(--radius-xs); font-size: 14px; }
  .ing-name { font-weight: 700; }
  .ing-qty { color: var(--muted); font-weight: 600; }

  /* PLAN PAGE */
  .plan-page { padding: 52px 64px; max-width: 1100px; margin: 0 auto; }
  .plan-page h2 { font-size: 42px; font-weight: 900; letter-spacing: -1.5px; margin-bottom: 8px; }
  .plan-page p.sub { color: var(--muted); margin-bottom: 36px; font-size: 16px; font-weight: 500; }
  .selected-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-bottom: 40px; }
  .sel-card { background: white; border-radius: var(--radius-sm); padding: 18px; border: 2px solid var(--border); display: flex; flex-direction: column; gap: 7px; transition: border-color 0.18s; }
  .sel-card:hover { border-color: var(--lime-dark); }
  .sel-name { font-weight: 800; font-size: 15px; }
  .sel-price { font-size: 14px; color: var(--muted); font-weight: 600; }
  .total-bar { background: var(--ink); color: white; padding: 26px 32px; border-radius: var(--radius); display: flex; align-items: center; justify-content: space-between; margin-bottom: 36px; }
  .total-label { font-size: 14px; color: rgba(255,255,255,0.45); font-weight: 600; }
  .total-num { font-size: 40px; font-weight: 900; color: var(--lime); }
  .groceries-section { margin-bottom: 40px; }
  .groceries-title { font-size: 22px; font-weight: 900; margin-bottom: 18px; }
  .grocery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }
  .grocery-item { background: white; border-radius: var(--radius-xs); padding: 15px 17px; border: 2px solid var(--border); }
  .grocery-name { font-weight: 800; font-size: 14px; margin-bottom: 4px; text-transform: capitalize; }
  .grocery-qty { font-size: 13px; color: var(--muted); font-weight: 600; }
  .action-row { display: flex; gap: 14px; flex-wrap: wrap; }
  .btn-dark { background: var(--ink); color: var(--lime); font-weight: 800; font-size: 15px; padding: 14px 30px; border-radius: var(--radius-sm); border: none; cursor: pointer; transition: var(--transition); font-family: var(--font); }
  .btn-dark:hover { transform: scale(1.04); background: var(--ink-2); }
  .btn-outline { background: white; color: var(--ink); border: 2px solid var(--border); font-weight: 700; font-size: 15px; padding: 14px 30px; border-radius: var(--radius-sm); cursor: pointer; transition: 0.15s; font-family: var(--font); }
  .btn-outline:hover { border-color: var(--ink); }

  /* ORDER */
  .order-page { padding: 100px 64px; text-align: center; max-width: 580px; margin: 0 auto; }
  .order-icon { font-size: 80px; margin-bottom: 24px; }
  .order-page h2 { font-size: 52px; font-weight: 900; letter-spacing: -2px; margin-bottom: 12px; }
  .order-page p { font-size: 17px; color: var(--muted); margin-bottom: 36px; line-height: 1.65; font-weight: 500; }

  /* FOOTER */
  .footer { background: var(--ink); padding: 64px; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 52px; margin-top: 88px; }
  .footer-logo { font-size: 26px; font-weight: 900; color: white; margin-bottom: 12px; }
  .footer-logo em { font-style: normal; color: var(--lime); }
  .footer-desc { font-size: 14px; color: rgba(255,255,255,0.38); line-height: 1.75; font-weight: 500; }
  .footer-col-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.28); margin-bottom: 18px; }
  .footer-link { display: block; font-size: 14px; color: rgba(255,255,255,0.5); margin-bottom: 11px; cursor: pointer; transition: color 0.15s; text-decoration: none; font-weight: 600; }
  .footer-link:hover { color: white; }
  .footer-bottom { background: rgba(0,0,0,0.28); padding: 20px 64px; display: flex; justify-content: space-between; align-items: center; }
  .footer-bottom p { font-size: 13px; color: rgba(255,255,255,0.28); font-weight: 600; }

  @media (max-width: 960px) {
    .hero { grid-template-columns: 1fr; padding: 60px 28px; min-height: auto; }
    .hero-img-wrap { display: none; }
    .page, .plan-page, .detail, .how { padding: 36px 24px; }
    .steps { grid-template-columns: 1fr 1fr; }
    .detail-grid { grid-template-columns: 1fr; }
    .footer { grid-template-columns: 1fr 1fr; padding: 44px 24px; }
    .footer-bottom { flex-direction: column; gap: 8px; padding: 20px 24px; }
    .plans-hero { padding: 52px 24px 0; }
    .plans-hero h1 { font-size: 38px; }
  }
`;

// Real Unsplash images mapped by lowercase meal name
const MEAL_IMAGES = {
  "paneer butter masala": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80",
  "chicken stir fry":     "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80",
  "dal tadka":            "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=600&q=80",
  "egg bhurji":           "https://images.unsplash.com/photo-1645696301019-35adcc18cabb?w=600&q=80",
  "aloo gobi":            "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80",
  "pasta arrabbiata":     "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80",
  "keema matar":          "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&q=80",
  "rajma chawal":         "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80",
};
const getMealImage = (name) => MEAL_IMAGES[name?.toLowerCase()] || null;

// Fallback data — category matches real schema: "veg" | "non-veg" | "healthy"
const MEALS_FALLBACK = [
  { _id: "m1", name: "Paneer Butter Masala", category: "veg",     prepTime: 25, difficulty: "easy",   basePrice: 249, description: "Creamy tomato-based gravy with soft paneer cubes.", ingredients: [{ name: "Paneer", quantity: "200g" }, { name: "Tomatoes", quantity: "3 medium" }, { name: "Onion", quantity: "1 large" }, { name: "Butter", quantity: "2 tbsp" }, { name: "Cream", quantity: "50ml" }] },
  { _id: "m2", name: "Chicken Stir Fry",     category: "non-veg", prepTime: 20, difficulty: "easy",   basePrice: 299, description: "Tender chicken with crunchy veggies in a savory sauce.", ingredients: [{ name: "Chicken breast", quantity: "300g" }, { name: "Bell peppers", quantity: "2" }, { name: "Broccoli", quantity: "150g" }, { name: "Soy sauce", quantity: "3 tbsp" }] },
  { _id: "m3", name: "Dal Tadka",            category: "veg",     prepTime: 30, difficulty: "easy",   basePrice: 179, description: "Smoky lentils tempered with cumin, garlic, and dried chillies.", ingredients: [{ name: "Yellow dal", quantity: "150g" }, { name: "Onion", quantity: "1" }, { name: "Tomato", quantity: "2" }, { name: "Cumin seeds", quantity: "1 tsp" }] },
  { _id: "m4", name: "Egg Bhurji",           category: "non-veg", prepTime: 10, difficulty: "easy",   basePrice: 149, description: "Scrambled eggs with onion, tomato, and spices. Indian-style.", ingredients: [{ name: "Eggs", quantity: "3" }, { name: "Onion", quantity: "1" }, { name: "Tomato", quantity: "1" }, { name: "Green chilli", quantity: "2" }] },
  { _id: "m5", name: "Aloo Gobi",            category: "veg",     prepTime: 25, difficulty: "easy",   basePrice: 189, description: "Classic dry sabzi with potatoes and cauliflower in warming spices.", ingredients: [{ name: "Potato", quantity: "2 medium" }, { name: "Cauliflower", quantity: "300g" }, { name: "Turmeric", quantity: "1 tsp" }, { name: "Garam masala", quantity: "1 tsp" }] },
  { _id: "m6", name: "Pasta Arrabbiata",     category: "veg",     prepTime: 20, difficulty: "easy",   basePrice: 229, description: "Spicy tomato-garlic sauce on perfectly cooked penne pasta.", ingredients: [{ name: "Penne pasta", quantity: "200g" }, { name: "Tomatoes", quantity: "4" }, { name: "Garlic", quantity: "5 cloves" }, { name: "Chilli flakes", quantity: "1 tsp" }] },
  { _id: "m7", name: "Keema Matar",          category: "non-veg", prepTime: 35, difficulty: "medium", basePrice: 279, description: "Minced meat cooked with green peas and aromatic spices.", ingredients: [{ name: "Minced mutton", quantity: "250g" }, { name: "Green peas", quantity: "100g" }, { name: "Onion", quantity: "2" }, { name: "Ginger-garlic paste", quantity: "2 tbsp" }] },
  { _id: "m8", name: "Rajma Chawal",         category: "veg",     prepTime: 40, difficulty: "medium", basePrice: 199, description: "Kidney beans in a robust tomato-onion gravy. Pure comfort food.", ingredients: [{ name: "Rajma", quantity: "150g" }, { name: "Tomatoes", quantity: "3" }, { name: "Onion", quantity: "2" }, { name: "Ginger-garlic", quantity: "1 tbsp" }] },
];

// Curated plans — ONLY meals that exist in your actual DB
const CURATED_PLANS = {
  veg: [
    {
      id: "vhealthy", badge: "Most Popular", title: "Healthy Veggie Week",
      subtitle: "High protein, balanced every day", emoji: "🥗", price: 1199,
      days: [
        { day: "Mon", meal: "Dal Tadka + Jeera Rice",           isVeg: true },
        { day: "Tue", meal: "Chicken Curry + Paratha",         isVeg: true },
        { day: "Wed", meal: "Rajma Chawal",                isVeg: true },
        { day: "Thu", meal: "Healthy Quinoa Bowl",            isVeg: true },
        { day: "Fri", meal: "Paneer Butter Masala + Jeera Rice", isVeg: true },
        { day: "Sat", meal: "Rajma Chawal",                isVeg: true },
        { day: "Sun", meal: "Dal Tadka + Jeera Rice",            isVeg: true },
      ],
    },
    {
      id: "vquick", badge: "Quick Prep", title: "Under 30 Minutes",
      subtitle: "For the ultra-busy weekday", emoji: "⚡", price: 999,
      days: [
        { day: "Mon", meal: "Masala Dosa",         isVeg: true },
        { day: "Tue", meal: "Kanda Poha",            isVeg: true },
        { day: "Wed", meal: "Dal Tadka + Jeera Rice",            isVeg: true },
        { day: "Thu", meal: "Paneer Butter Masala",        isVeg: true },
        { day: "Fri", meal: "Rajma Chawal",                isVeg: true },
        { day: "Sat", meal: "Salad",            isVeg: true },
        { day: "Sun", meal: "Egg bhurji",            isVeg: true },
      ],
    },
  ],
  nonveg: [
    {
      id: "nhigh", badge: "High Protein", title: "Meat Lover's Week",
      subtitle: "Build muscle, save time", emoji: "💪", price: 1599,
      days: [
        { day: "Mon", meal: "Egg Bhurji + Toast",          isVeg: false },
        { day: "Tue", meal: "Chicken Stir Fry + Rice",     isVeg: false },
        { day: "Wed", meal: "Keema Matar + Roti",          isVeg: false },
        { day: "Thu", meal: "Egg Bhurji + Paratha",        isVeg: false },
        { day: "Fri", meal: "Chicken Stir Fry + Noodles",  isVeg: false },
        { day: "Sat", meal: "Keema Matar + Rice",          isVeg: false },
        { day: "Sun", meal: "Egg Bhurji + Rice",           isVeg: false },
      ],
    },
    {
      id: "nmixed", badge: "Best Value", title: "Mix & Match Plan",
      subtitle: "Variety every single day", emoji: "🥘", price: 1399,
      days: [
        { day: "Mon", meal: "Dal Tadka + Rice",            isVeg: true  },
        { day: "Tue", meal: "Chicken Stir Fry",            isVeg: false },
        { day: "Wed", meal: "Rajma Chawal",                isVeg: true  },
        { day: "Thu", meal: "Egg Bhurji + Paratha",        isVeg: false },
        { day: "Fri", meal: "Paneer Butter Masala",        isVeg: true  },
        { day: "Sat", meal: "Keema Matar + Roti",          isVeg: false },
        { day: "Sun", meal: "Pasta Arrabbiata",            isVeg: true  },
      ],
    },
  ],
};

const TYPE_COLORS = { veg: "#2db87a", "non-veg": "#e85c42", healthy: "#2b9de8" };
const TYPE_LABELS = { veg: "Veg", "non-veg": "Non-Veg", healthy: "Healthy" };
const isEssential = (n) => ["salt", "oil", "water", "flour", "sugar"].includes(n.toLowerCase());

export default function App() {
  const [meals, setMeals] = useState(MEALS_FALLBACK);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [plan, setPlan] = useState(null);
  const [page, setPage] = useState("home");
  const [vegOnly, setVegOnly] = useState(false);
  const [planTab, setPlanTab] = useState("veg");

  useEffect(() => {
    fetch("https://mealpreppy-backend.onrender.com/api/meals")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length) setMeals(data); })
      .catch(() => {});
  }, []);

  const toggleMeal = (id, e) => {
    e?.stopPropagation();
    setSelectedMeals((prev) => prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]);
  };

  const openMeal = (meal) => { setSelectedMeal(meal); setPage("detail"); };

  const createPlan = async () => {
    if (selectedMeals.length === 0) { alert("Select at least one meal first!"); return; }
    try {
      const res = await fetch("https://mealpreppy-backend.onrender.com/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: "user", meals: selectedMeals, weekStartDate: new Date() }),
      });
      const data = await res.json();
      setPlan(data);
    } catch {
      const selected = meals.filter((m) => selectedMeals.includes(m._id));
      const total = selected.reduce((s, m) => s + m.basePrice, 0);
      const ingredients = {};
      selected.forEach((m) => {
        (m.ingredients || []).forEach((ing) => {
          if (!isEssential(ing.name)) ingredients[ing.name] = { total: ing.quantity, unit: "" };
        });
      });
      setPlan({ plan: { totalPrice: total }, ingredients });
    }
    setPage("plan");
  };

  const createOrder = async () => {
    const planId = plan?.plan?._id || plan?._id;
    try {
      await fetch("https://mealpreppy-backend.onrender.com/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: "user", planId }),
      });
    } catch {}
    setPage("order");
  };

  // vegOnly: show only veg + healthy; off: show everything
  const filteredMeals = meals.filter((m) => {
    if (!vegOnly) return true;
    return m.category === "veg" || m.category === "healthy";
  });

  const navTo = (p) => { setPage(p); window.scrollTo(0, 0); };
  const totalPrice = meals.filter((m) => selectedMeals.includes(m._id)).reduce((s, m) => s + m.basePrice, 0);

  return (
    <>
      <style>{STYLE}</style>
      <div className="mp-app">

        {/* NAVBAR */}
        <nav className="nav">
          <span className="nav-logo" onClick={() => navTo("home")}>meal<em>preppy</em></span>
          <div className="nav-links">
            <button className={`nav-link ${page === "home" ? "active" : ""}`} onClick={() => navTo("home")}>Home</button>
            <button className={`nav-link ${page === "meals" ? "active" : ""}`} onClick={() => navTo("meals")}>Meals</button>
            <button className={`nav-link ${page === "curated" ? "active" : ""}`} onClick={() => navTo("curated")}>Weekly Plans</button>
            <button className="nav-link" onClick={() => alert("Settings coming soon!")}>Settings</button>
          </div>
          <div className="nav-right">
            <button className="nav-cart" onClick={() => { if (selectedMeals.length) createPlan(); else navTo("meals"); }}>
              My Plan <span className="cart-dot">{selectedMeals.length}</span>
            </button>
          </div>
        </nav>

        {/* HOME */}
        {page === "home" && (
          <>
            <section className="hero">
              <div>
                <div className="hero-tag"><span className="hero-tag-dot" />Mumbai · Delivering Fresh Kits</div>
                <h1 className="hero-h1">Cook smarter.<br /><em>Not harder.</em></h1>
                <p className="hero-body">Pick your meals. We chop, clean, measure, and pack everything. Your kit arrives ready to cook — in under 30 minutes, no waste, no guessing.</p>
                <div className="hero-ctas">
                  <button className="btn-primary" onClick={() => navTo("meals")}>Browse Meals →</button>
                  <button className="btn-ghost" onClick={() => navTo("curated")}>See Weekly Plans</button>
                </div>
              </div>
              <div className="hero-img-wrap">
                <img className="hero-img" src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=900&q=80" alt="Meal prep" />
                <div className="hero-float f1"><div className="hf-label">This week</div><div className="hf-value">₹999</div><div className="hf-sub">Full 7-day kit</div></div>
                <div className="hero-float f2"><div className="hf-label">Prep time</div><div className="hf-value">30 min</div><div className="hf-sub">Per meal avg</div></div>
              </div>
            </section>

            <section className="how">
              <p className="section-tag">How it works</p>
              <h2 className="section-title">Four steps to a <em>better week</em></h2>
              <div className="steps">
                {[
                  { n: "01", icon: "🍽️", t: "Pick Meals",    d: "Browse our curated menu and choose what you want to eat this week." },
                  { n: "02", icon: "🛒", t: "We Shop & Prep", d: "We source fresh ingredients, wash, chop, and portion everything." },
                  { n: "03", icon: "📦", t: "Kit Delivered",  d: "Your meal kit arrives at your door, fresh and ready to go." },
                  { n: "04", icon: "👨‍🍳", t: "Just Cook",     d: "Follow simple steps and have a fresh home-cooked meal in 30 min." },
                ].map((s) => (
                  <div className="step" key={s.n}>
                    <div className="step-num">{s.n}</div>
                    <div className="step-icon">{s.icon}</div>
                    <div className="step-title">{s.t}</div>
                    <div className="step-text">{s.d}</div>
                  </div>
                ))}
              </div>
            </section>

            <footer className="footer">
              <div>
                <div className="footer-logo">meal<em>preppy</em></div>
                <div className="footer-desc">Fresh, portioned meal kits delivered to your door. No waste, no stress. Just cook and eat well.</div>
              </div>
              <div>
                <div className="footer-col-title">Product</div>
                <a className="footer-link" onClick={() => navTo("meals")}>Browse Meals</a>
                <a className="footer-link" onClick={() => navTo("curated")}>Weekly Plans</a>
                <a className="footer-link">How it Works</a>
              </div>
              <div>
                <div className="footer-col-title">Company</div>
                <a className="footer-link">About</a><a className="footer-link">Blog</a><a className="footer-link">Careers</a>
              </div>
              <div>
                <div className="footer-col-title">Support</div>
                <a className="footer-link">FAQ</a><a className="footer-link">Contact</a><a className="footer-link">Privacy</a>
              </div>
            </footer>
            <div className="footer-bottom">
              <p>© 2025 mealpreppy. All rights reserved.</p>
              <p>Made with care in Mumbai 🇮🇳</p>
            </div>
          </>
        )}

        {/* MEALS */}
        {page === "meals" && (
          <div className="page">
            <div className="page-header">
              <h1 className="page-title">Explore Meals</h1>
              <div className="veg-toggle-wrap">
                <span className={`veg-toggle-label ${vegOnly ? "on" : ""}`}>
                  {vegOnly ? "🌿 Veg Only" : "All Meals"}
                </span>
                <button className={`toggle-track ${vegOnly ? "on" : ""}`} onClick={() => setVegOnly((v) => !v)} aria-label="Toggle veg filter">
                  <span className="toggle-thumb" />
                </button>
              </div>
            </div>
            <div className="meals-grid">
              {filteredMeals.map((meal) => {
                const sel = selectedMeals.includes(meal._id);
                const img = getMealImage(meal.name);
                const dotColor = TYPE_COLORS[meal.category] || "#2db87a";
                const typeLabel = TYPE_LABELS[meal.category] || "Veg";
                const typeClass = meal.category === "non-veg" ? "nonveg" : meal.category === "healthy" ? "healthy" : "veg";
                return (
                  <div key={meal._id} className={`meal-card ${sel ? "selected" : ""}`} onClick={() => openMeal(meal)}>
                    <div className="meal-img-wrap">
                      {img
                        ? <img className="meal-img" src={img} alt={meal.name} />
                        : <div className="meal-img-placeholder" style={{ background: `linear-gradient(135deg, ${dotColor}22, ${dotColor}44)` }}>🍛</div>
                      }
                    </div>
                    <div className="meal-body">
                      <div className="meal-meta">
                        <div className={`meal-type ${typeClass}`}>
                          <span className="type-dot" style={{ background: dotColor }} />{typeLabel}
                        </div>
                        {meal.prepTime && <span className="meal-cat">{meal.prepTime} min</span>}
                      </div>
                      <div className="meal-name">{meal.name}</div>
                      <div className="meal-desc">{meal.description}</div>
                      <div className="meal-footer">
                        <div className="meal-price">₹{meal.basePrice} <span>/ kit</span></div>
                        <button className={`add-btn ${sel ? "remove" : "add"}`} onClick={(e) => toggleMeal(meal._id, e)}>
                          {sel ? "✕ Remove" : "+ Add"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {selectedMeals.length > 0 && (
              <div className="sticky-bar">
                <span className="sticky-text"><span className="sticky-count">{selectedMeals.length}</span> meal{selectedMeals.length > 1 ? "s" : ""} · ₹{totalPrice}</span>
                <button className="btn-primary" onClick={createPlan}>Generate Plan →</button>
              </div>
            )}
          </div>
        )}

        {/* CURATED PLANS */}
        {page === "curated" && (
          <>
            <div className="plans-hero">
              <h1>Pre-made <em>Weekly Plans</em></h1>
              <p>Hand-curated by our team. Pick one, we handle the rest.</p>
              <div className="plan-tabs">
                <button className={`plan-tab ${planTab === "veg" ? "active" : ""}`} onClick={() => setPlanTab("veg")}>🌿 Vegetarian</button>
                <button className={`plan-tab ${planTab === "nonveg" ? "active" : ""}`} onClick={() => setPlanTab("nonveg")}>🍗 Non-Vegetarian</button>
              </div>
            </div>
            <div className="page" style={{ paddingTop: 0 }}>
              <div className="plans-grid">
                {CURATED_PLANS[planTab].map((cp) => (
                  <div className="plan-card" key={cp.id}>
                    <div className="plan-card-top" data-emoji={cp.emoji}>
                      <div className="plan-badge">{cp.badge}</div>
                      <div className="plan-title">{cp.title}</div>
                      <div className="plan-subtitle">{cp.subtitle}</div>
                    </div>
                    <div className="plan-days">
                      {cp.days.map((d) => (
                        <div className="day-row" key={d.day}>
                          <div className="day-label">{d.day}</div>
                          <div className="day-type" style={{ background: d.isVeg ? "#2db87a" : "#e85c42" }} />
                          <div className="day-meal">{d.meal}</div>
                        </div>
                      ))}
                    </div>
                    <div className="plan-footer">
                      <div>
                        <div className="plan-price-label">7-day kit</div>
                        <div className="plan-price">₹{cp.price}</div>
                      </div>
                      <button className="get-plan-btn" onClick={() => alert(`"${cp.title}" selected! Ordering coming soon.`)}>Get This Plan</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* DETAIL */}
        {page === "detail" && selectedMeal && (() => {
          const img = getMealImage(selectedMeal.name);
          const dotColor = TYPE_COLORS[selectedMeal.category] || "#2db87a";
          const typeLabel = TYPE_LABELS[selectedMeal.category] || "Veg";
          return (
            <div className="detail">
              <button className="back-btn" onClick={() => setPage("meals")}>← Back to Meals</button>
              <div className="detail-grid">
                <div>
                  {img
                    ? <div className="detail-img-wrap"><img className="detail-img" src={img} alt={selectedMeal.name} /></div>
                    : <div className="detail-img-placeholder" style={{ background: `linear-gradient(135deg, ${dotColor}22, ${dotColor}44)` }}>🍛</div>
                  }
                </div>
                <div>
                  <div className="detail-tags">
                    <span className="dtag" style={{ background: `${dotColor}18`, color: dotColor }}>{typeLabel}</span>
                    {selectedMeal.prepTime && <span className="dtag">{selectedMeal.prepTime} min prep</span>}
                    {selectedMeal.difficulty && <span className="dtag">{selectedMeal.difficulty}</span>}
                  </div>
                  <div className="detail-name">{selectedMeal.name}</div>
                  <div className="detail-desc">{selectedMeal.description}</div>
                  <div className="ingredients-title">What's in the kit</div>
                  <ul className="ingredients-list">
                    {(selectedMeal.ingredients || []).map((ing, i) => (
                      <li className="ing-item" key={i}>
                        <span className="ing-name">{ing.name}</span>
                        <span className="ing-qty">{ing.quantity}</span>
                      </li>
                    ))}
                  </ul>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                    <div style={{ fontSize: 34, fontWeight: 900 }}>₹{selectedMeal.basePrice}</div>
                    <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>per kit · 1 serving</span>
                  </div>
                  <button
                    className={`add-btn ${selectedMeals.includes(selectedMeal._id) ? "remove" : "add"}`}
                    style={{ width: "100%", padding: "14px", fontSize: 15 }}
                    onClick={() => toggleMeal(selectedMeal._id)}
                  >
                    {selectedMeals.includes(selectedMeal._id) ? "✕ Remove from Plan" : "+ Add to Plan"}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* PLAN */}
        {page === "plan" && plan && (
          <div className="plan-page">
            <h2>Your Weekly Plan</h2>
            <p className="sub">Here's what we'll prep and deliver for you this week.</p>
            <div className="selected-grid">
              {meals.filter((m) => selectedMeals.includes(m._id)).map((meal) => {
                const img = getMealImage(meal.name);
                return (
                  <div className="sel-card" key={meal._id}>
                    {img
                      ? <img src={img} alt={meal.name} style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 10 }} />
                      : <div style={{ fontSize: 32, height: 48, display: "flex", alignItems: "center" }}>🍛</div>
                    }
                    <div className="sel-name">{meal.name}</div>
                    <div className="sel-price">₹{meal.basePrice}</div>
                  </div>
                );
              })}
            </div>
            <div className="total-bar">
              <div>
                <div className="total-label">Total for the week</div>
                <div className="total-num">₹{plan.plan?.totalPrice || plan.totalPrice || totalPrice}</div>
              </div>
              <div style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, fontWeight: 600 }}>Groceries + prep included</div>
            </div>
            {plan.ingredients && Object.keys(plan.ingredients).length > 0 && (
              <div className="groceries-section">
                <div className="groceries-title">Groceries in your kit 🛒</div>
                <div className="grocery-grid">
                  {Object.entries(plan.ingredients).map(([name, val]) => (
                    <div className="grocery-item" key={name}>
                      <div className="grocery-name">{name}</div>
                      <div className="grocery-qty">{val.total} {val.unit}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="action-row">
              <button className="btn-dark" onClick={createOrder}>Place Order →</button>
              <button className="btn-outline" onClick={() => navTo("meals")}>Edit Meals</button>
            </div>
          </div>
        )}

        {/* ORDER */}
        {page === "order" && (
          <div className="order-page">
            <div className="order-icon">🎉</div>
            <h2>You're all set!</h2>
            <p>Your meal kit is being prepped fresh. Expect delivery within 24 hours. We'll keep you posted on WhatsApp.</p>
            <button className="btn-dark" onClick={() => { setSelectedMeals([]); setPlan(null); navTo("home"); }}>Back to Home</button>
          </div>
        )}

      </div>
    </>
  );
}