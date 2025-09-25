// ====== CONFIGURATION SECTION ======
const WEBSITE_PASSWORD = "vse2k25@svv";  // ← change this to your desired password

// List of stocks: real symbol + your custom display name
const STOCKS = [
  { symbol: "NTPC Ltd", displayName: "ORGANISING DEPARTMENT" },
  { symbol: "Oil&Natural Gas Corpn Ltd", displayName: "MODELS DEPARTMENT" },
  { symbol: "Bharat Electronics Ltd", displayName: "GAMES DEPARTMENT" },
  { symbol: "Power Grid Corporation of India Ltd", displayName: "FOODSTALL DEPARTMENT" },
  { symbol: "Eternal Ltd", displayName: "PHOTOGRAPHY DEPARTMENT" },
  { symbol: "Wipro Ltd", displayName: "TECH DEPARTMENT" },
  { symbol: "Coal India", displayName: "STALLS DEPARTMENT" },
  { symbol: "Ashoka Buildcon Ltd", displayName: "FINANCE DEPARTMENT" }
];

const FINNHUB_API_KEY = "d37sejpr01qskrehm6lgd37sejpr01qskrehm6m0";  // ← replace with your Finnhub API key
// =====================================

// On page load, wire up password submit button
document.getElementById("pw-submit").addEventListener("click", handlePwSubmit);

function handlePwSubmit() {
  const input = document.getElementById("pw-input").value;
  const errElem = document.getElementById("pw-error");
  if (input === WEBSITE_PASSWORD) {
    // correct password
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    loadStocks();
  } else {
    errElem.textContent = "Wrong password. Try again.";
  }
}

// Fetch stock data and render
async function loadStocks() {
  const container = document.getElementById("stocks-container");
  container.innerHTML = "";  // clear

  for (const stk of STOCKS) {
    const url = `https://finnhub.io/api/v1/quote?symbol=${stk.symbol}&token=${FINNHUB_API_KEY}`;
    try {
      const resp = await fetch(url);
      const data = await resp.json();
      // data has fields: c (current), h (high), l (low), o (open), pc (prev close), etc.

      const card = document.createElement("div");
      card.className = "stock-card";

      if (data && data.c !== undefined) {
        card.innerHTML = `
          <h2>${stk.displayName}</h2>
          <p><strong>Price:</strong> ${data.c.toFixed(2)}</p>
          <p><strong>High:</strong> ${data.h.toFixed(2)}</p>
          <p><strong>Low:</strong> ${data.l.toFixed(2)}</p>
          <p><strong>Change:</strong> ${(data.d).toFixed(2)}</p>
          <p><strong>Prev Close:</strong> ${data.pc.toFixed(2)}</p>
        `;
      } else {
        card.innerHTML = `
          <h2>${stk.displayName}</h2>
          <p>Data unavailable</p>
        `;
      }

      container.appendChild(card);
    } catch (err) {
      console.error("Error fetching for", stk.symbol, err);
      const card = document.createElement("div");
      card.className = "stock-card";
      card.innerHTML = `<h2>${stk.displayName}</h2><p>Error loading data</p>`;
      container.appendChild(card);
    }
  }
}
