let dati = [];

const giocatori = [
  "Michele B","Carmine","Michele L","Michele C","Lello","Ciro",
  "Alfredo","Marco","Mario","Vincenzo","Tore","Emanuele",
  "Claudio","Peppe","Diana","Menzo","Mister"
];

// =========================
// CARICA DATI
// =========================
async function caricaDati() {
  const res = await fetch("dati.json");
  dati = await res.json();
  render();
}

// =========================
// CLASSIFICA
// =========================
function calcolaClassifica() {
  let c = {};

  giocatori.forEach(g => {
    c[g] = { nome: g, punti: 0 };
  });

  dati.forEach(p => {
    const finito = p.esito && p.esito !== "?";
    if (!finito) return;

    giocatori.forEach(g => {
      if (p.pronostici[g] === p.esito) {
        c[g].punti++;
      }
    });
  });

  return Object.values(c).sort((a,b) => b.punti - a.punti);
}

// =========================
// RENDER CLASSIFICA
// =========================
function renderClassifica() {
  const box = document.getElementById("classifica");
  const c = calcolaClassifica();

  box.innerHTML = "";

  c.forEach((g,i) => {
    let medal = i===0?"🥇":i===1?"🥈":i===2?"🥉":"";

    box.innerHTML += `
      <div class="rank-card">
        <div>${medal} ${g.nome}</div>
        <div><b>${g.punti}</b> pts</div>
      </div>
    `;
  });
}

// =========================
// RENDER EVENTI
// =========================
function renderEventi() {
  const box = document.getElementById("eventi");

  box.innerHTML = "";

  dati.forEach(p => {

    let blocco = `
      <div class="event-card">
        <b>⚽ ${p.evento}</b>
        <div>Esito: <b>${p.esito}</b></div>
        <hr>
    `;

    giocatori.forEach(g => {

      const scelta = p.pronostici[g];

      let cls = "";

      if (p.esito && p.esito !== "?") {
        cls = scelta === p.esito ? "ok" : "no";
      }

      blocco += `
        <div class="pick ${cls}">
          <span>${g}</span>
          <span>${scelta || "-"}</span>
        </div>
      `;
    });

    blocco += `</div>`;

    box.innerHTML += blocco;
  });
}

// =========================
// STATS
// =========================
function renderStats() {
  const tot = dati.length;
  const finiti = dati.filter(d => d.esito && d.esito !== "?").length;

  document.getElementById("totGiocatori").innerText = giocatori.length;
  document.getElementById("totEventi").innerText = tot;
  document.getElementById("conclusi").innerText = finiti;
  document.getElementById("attesa").innerText = tot - finiti;
}

// =========================
// RENDER
// =========================
function render() {
  renderClassifica();
  renderEventi();
  renderStats();
}

caricaDati();