let dati = [];

// 👥 GIOCATORI
const giocatori = [
  "Michele B","Carmine","Michele L","Michele C","Lello","Ciro",
  "Alfredo","Marco","Mario","Vincenzo","Tore","Emanuele",
  "Claudio","Peppe","Diana","Menzo","Mister"
];


// 🧠 FASI VISIBILI
const FASI_VISIBILI = [
  "Sedicesimi",
  "Ottavi",
  "Quarti",
  "Semifinali",
  "Finale"
];


// =========================
// CARICA DATI
// =========================
async function caricaDati() {

  try {

    const res = await fetch("dati.json");

    dati = await res.json();

    render();

  } catch (err) {

    console.error(
      "Errore caricamento dati:",
      err
    );

  }

}



// =========================
// CLASSIFICA
// =========================
function calcolaClassifica() {

  let c = {};


  giocatori.forEach(g => {

    c[g] = {
      nome:g,
      punti:0
    };

  });



  dati.forEach(p => {


    // PASSA TURNO
    if (
      p.esito &&
      p.esito !== "?"
    ) {

      giocatori.forEach(g => {

        if (
          p.pronostici?.[g] === p.esito
        ) {

          c[g].punti += 1;

        }

      });

    }




    // G/N
    if (
      p.esitoExtra &&
      p.esitoExtra !== "?"
    ) {

      giocatori.forEach(g => {

        if (
          p.pronosticiExtra?.[g] === p.esitoExtra
        ) {

          c[g].punti += 1;

        }

      });

    }




    // UNDER / OVER
    if (
      p.esitoUnderOver &&
      p.esitoUnderOver !== "?"
    ) {

      giocatori.forEach(g => {

        if (
          p.pronosticiUnderOver?.[g]
          === p.esitoUnderOver
        ) {

          c[g].punti += 1;

        }

      });

    }


  });



  return Object.values(c)
    .sort(
      (a,b)=>b.punti-a.punti
    );

}




// =========================
// RENDER CLASSIFICA
// =========================
function renderClassifica() {

  const box =
  document.getElementById("classifica");


  if(!box) return;


  const c =
  calcolaClassifica();


  box.innerHTML = "";



  c.forEach((g,i)=>{


    let medal="";


    if(i===0)
      medal="🥇";

    else if(i===1)
      medal="🥈";

    else if(i===2)
      medal="🥉";



    box.innerHTML += `

    <div class="rank-simple">

      <div class="rank-left">

        <span>
          ${medal}
        </span>

        <span class="name">
          ${g.nome}
        </span>

      </div>


      <div>
        <b>${g.punti}</b>
      </div>


    </div>

    `;


  });


}




// =========================
// EVENTI
// =========================
function renderEventi() {


  const box =
  document.getElementById("eventi");


  if(!box) return;


  box.innerHTML="";



  const filtrati =
  dati.filter(p =>
    FASI_VISIBILI.includes(p.fase)
  );



  const gruppi={};



  filtrati.forEach(p=>{

    if(!gruppi[p.fase])
      gruppi[p.fase]=[];

    gruppi[p.fase].push(p);

  });





  Object.keys(gruppi)
  .forEach(fase=>{


    const wrapper =
    document.createElement("div");


    wrapper.className =
    "collapsible";



    let html="";



    gruppi[fase]
    .forEach(p=>{


      let evento =
      p.evento;



      if(
        p.esito &&
        p.esito !== "?"
      ){

        const [a,b] =
        p.evento.split(" - ");


        evento =
        (a===p.esito)
        ?
        `<b>${a}</b> - ${b}`
        :
        `${a} - <b>${b}</b>`;

      }




      // HEADER
      html += `

      <div class="pick header">

        <div class="pick-name">
          Giocatore
        </div>

        <div class="pick-main">
          Passa
        </div>

        <div class="pick-extra">
          G/N
        </div>

        <div class="pick-under">
          U/O
        </div>

      </div>

      `;




      giocatori.forEach(g=>{


        const main =
        p.pronostici?.[g] || "-";


        const extra =
        p.pronosticiExtra?.[g] || "";


        const under =
        p.pronosticiUnderOver?.[g] || "";



        let clsMain =
        "neutral";


        let clsExtra =
        "neutral";


        let clsUnder =
        "neutral";




        // PASSA
        if(
          p.esito &&
          p.esito !== "?"
        ){

          clsMain =
          main===p.esito
          ?
          "ok"
          :
          "no";

        }





        // G/N
        if(
          p.esitoExtra &&
          p.esitoExtra !== "?"
        ){

          clsExtra =
          extra===p.esitoExtra
          ?
          "ok"
          :
          (extra ? "no" : "neutral");

        }





        // UNDER OVER
        if(
          p.esitoUnderOver &&
          p.esitoUnderOver !== "?"
        ){

          clsUnder =
          under===p.esitoUnderOver
          ?
          "ok"
          :
          (under ? "no" : "neutral");

        }





        html += `

        <div class="pick">


          <div class="pick-name">
            ${g}
          </div>


          <div class="pick-main ${clsMain}">
            ${main}
          </div>


          <div class="pick-extra ${clsExtra}">
            ${extra}
          </div>


          <div class="pick-under ${clsUnder}">
            ${under}
          </div>


        </div>

        `;


      });



      html += `

      <div style="margin:10px 0;">
        ⚽ ${evento}
      </div>

      `;


    });





    wrapper.innerHTML = `

    <div class="collapsible-header">

      <div>
        🏆 ${fase}
      </div>

      <div>
        ▶
      </div>

    </div>


    <div class="collapsible-content">

      ${html}

    </div>

    `;




    wrapper
    .querySelector(".collapsible-header")
    .addEventListener(
      "click",
      ()=>wrapper.classList.toggle("open")
    );



    box.appendChild(wrapper);



  });



}




// =========================
// STATS
// =========================
function renderStats() {


  const tot =
  dati.length;


  const finiti =
  dati.filter(
    p=>p.esito && p.esito!=="?"
  ).length;



  document.getElementById("totGiocatori")
  .textContent =
  giocatori.length;



  document.getElementById("totEventi")
  .textContent =
  tot;



  document.getElementById("conclusi")
  .textContent =
  finiti;



  document.getElementById("attesa")
  .textContent =
  tot-finiti;



  document.getElementById("faseAttuale")
  .textContent =
  FASI_VISIBILI.join(" • ");

}



// =========================
// RENDER MASTER
// =========================
function render(){

  renderClassifica();

  renderEventi();

  renderStats();

}



// START
caricaDati();