// API 配置
const CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycbxGQAIw9BQahJ4ZlgQPhT9PzpdM7pyMClr6id63V9svVY44oEq38guW4tploXmDrAn_/exec',
  APP_NAME: '馬星福德宮',
  VERSION: '1.0.0',
  PRICES: { DECEASED: 500, KARMIC: 300, SPIRIT_BABY: 400, BOX: 200, CHILD_BOX: 150, BUCKET: 100 }
};

let GLOBAL_PRICES = { ...CONFIG.PRICES };
let pricesLoaded = false;
let pricesLoading = false;

async function loadGlobalPrices() {
  if (pricesLoaded) return GLOBAL_PRICES;
  if (pricesLoading) {
    return new Promise(resolve => {
      const check = setInterval(() => { if (pricesLoaded) { clearInterval(check); resolve(GLOBAL_PRICES); } }, 100);
    });
  }
  pricesLoading = true;
  try {
    const r = await fetch(CONFIG.API_URL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'action=getSettings' });
    const d = await r.json();
    if (d.success && d.settings && d.settings.prices) {
      const p = typeof d.settings.prices === 'string' ? JSON.parse(d.settings.prices) : d.settings.prices;
      GLOBAL_PRICES = { DECEASED: p.deceased || 500, KARMIC: p.karmic || 300, SPIRIT_BABY: p.spiritBaby || 400, BOX: p.box || 200, CHILD_BOX: p.childBox || 150, BUCKET: p.bucket || 100 };
      pricesLoaded = true;
    }
  } catch(e) { GLOBAL_PRICES = { ...CONFIG.PRICES }; pricesLoaded = true; }
  pricesLoading = false;
  return GLOBAL_PRICES;
}

function getPrice(key) { return GLOBAL_PRICES[key] || CONFIG.PRICES[key] || 0; }

function generateOrderNumber() {
  const n = new Date();
  return 'PD' + n.getFullYear().toString().slice(2) + (n.getMonth()+1).toString().padStart(2,'0') + n.getDate().toString().padStart(2,'0') + Math.random().toString(36).substring(2,6).toUpperCase();
}

function formatDate(d) { if(!d) return '—'; return new Date(d).toLocaleDateString('zh-TW',{year:'numeric',month:'2-digit',day:'2-digit'}); }
function formatDateTime(d) { if(!d) return '—'; return new Date(d).toLocaleString('zh-TW',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}); }
function escapeHtml(t) { const d=document.createElement('div'); d.textContent=t||''; return d.innerHTML; }