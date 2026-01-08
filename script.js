
/* ===== MODAL ===== */
function openSaveModal(){
  document.getElementById("saveModal").style.display="flex";
}

/* ===== SAVE ===== */
async function savePortfolio(){
  const email = document.getElementById("email").value.trim();
  if(!email){
    alert("Email is required");
    return;
  }

  // 🔑 clone portfolio data
  const portfolioSnapshot = data.map(item => ({
    name: item.n,
    sip: item.s,
    rate: item.r,
    current: item.c
  }));

  if(portfolioSnapshot.length === 0){
    alert("Please add at least one investment");
    return;
  }

  const payload = {
    email,
    whatsapp: document.getElementById("whatsapp").value.trim(),
    instagram: document.getElementById("instagram").value.trim(),
    years: +years.value,
    portfolio: portfolioSnapshot,
    totals: {
      invested: invested.innerText,
      profit: profit.innerText,
      total: total.innerText
    },
    savedAt: new Date().toISOString()
  };

  // 1️⃣ Save locally
  localStorage.setItem("savedSIP", JSON.stringify(payload));

  // 2️⃣ Send to Google Sheets (no headers – CORS safe)
  await fetch('https://script.google.com/macros/s/AKfycbzThKl-iST9KyiHRgMgpbmwbsFeTsYeq7mKfNGYzrh03N88JVbuFBWo5Sl_RIKfxpaZGw/exec', {
    method: "POST",
    body: JSON.stringify(payload)
  });

  alert("Portfolio saved successfully ✅");
  closeSaveModal();
}

/* ===== AUTO LOAD ===== */
window.addEventListener("load", () => {
  const saved = localStorage.getItem("savedSIP");
  if(!saved) return;

  const p = JSON.parse(saved);

  // restore portfolio
  data = p.portfolio.map(i => ({
    n: i.name,
    s: i.sip,
    r: i.rate,
    c: i.current
  }));

  years.value = p.years || 1;
  render();
});

function openSaveModal(){
  document.getElementById("saveModal").style.display = "flex";
}

function closeSaveModal(){
  document.getElementById("saveModal").style.display = "none";
}

function backdropClose(e){
  if(e.target.id === "saveModal"){
    closeSaveModal();
  }
}
