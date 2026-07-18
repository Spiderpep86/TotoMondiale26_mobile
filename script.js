let dati = [];


// 👥 GIOCATORI
const giocatori = [
  "Michele B","Carmine","Michele L","Michele C","Lello","Ciro",
  "Alfredo","Marco","Mario","Vincenzo","Tore","Emanuele",
  "Claudio","Peppe","Diana","Menzo","Mister"
];



// 🏆 FASI VISIBILI

const FASI_VISIBILI = [
  "Sedicesimi",
  "Ottavi",
  "Quarti",
  "Semifinali",
  "Finale",
  "Finale 3/4 Posto"
];




// =========================
// CARICAMENTO DATI
// =========================

async function caricaDati(){

  try{

    const res = await fetch("dati.json");

    dati = await res.json();

    render();

  }
  catch(err){

    console.error(
      "Errore caricamento dati:",
      err
    );

  }

}





// =========================
// CLASSIFICA
// =========================

function calcolaClassifica(){


let c = {};



giocatori.forEach(g=>{


  c[g]={

    nome:g,

    punti:0

  };


});






dati.forEach(p=>{





// =================================
// EVENTI STANDARD
// =================================


if(
  p.esito &&
  p.esito !== "?"
){


 giocatori.forEach(g=>{


  if(
    p.pronostici?.[g]
    ===
    p.esito
  ){

    c[g].punti +=1;

  }


 });


}







if(
  p.esitoExtra &&
  p.esitoExtra !== "?"
){


 giocatori.forEach(g=>{


  if(
    p.pronosticiExtra?.[g]
    ===
    p.esitoExtra
  ){

    c[g].punti +=1;

  }


 });


}







if(
  p.esitoUnderOver &&
  p.esitoUnderOver !== "?"
){


 giocatori.forEach(g=>{


  if(
    p.pronosticiUnderOver?.[g]
    ===
    p.esitoUnderOver
  ){

    c[g].punti +=1;

  }


 });


}








// =================================
// SEMIFINALI
// =================================


if(
  p.fase==="Semifinali" &&
  p.risultatoEsatto &&
  p.risultatoEsatto !== "?"
){


 giocatori.forEach(g=>{


  if(
    p.pronosticiRisultato?.[g]
    ===
    p.risultatoEsatto
  ){

    c[g].punti +=2;

  }






  // PERFECT MATCH SEMIFINALE

  if(

    p.pronostici?.[g]
    ===p.esito &&

    p.pronosticiExtra?.[g]
    ===p.esitoExtra &&

    p.pronosticiUnderOver?.[g]
    ===p.esitoUnderOver &&

    p.pronosticiRisultato?.[g]
    ===p.risultatoEsatto

  ){

    c[g].punti +=1;

  }



 });


}









// =================================
// FINALE 3/4 POSTO
// =================================


if(
  p.fase==="Finale 3/4 Posto"
){



const concluso =

 p.esito &&
 p.esito !== "?" &&

 p.esitoExtra &&
 p.esitoExtra !== "?" &&

 p.esitoUnderOver &&
 p.esitoUnderOver !== "?" &&

 p.risultatoEsatto &&
 p.risultatoEsatto !== "?" &&

 p.parzialePrimoTempo &&
 p.parzialePrimoTempo !== "?";





// se non concluso non calcola niente

if(concluso){



 giocatori.forEach(g=>{


 let risultatoOk=false;

 let parzialeOk=false;






 // RISULTATO ESATTO

 if(

  p.pronosticiRisultato?.[g]
  ===
  p.risultatoEsatto

 ){

   risultatoOk=true;

 }







 // PARZIALE

 if(

  p.pronosticiParziale?.[g]
  ===
  p.parzialePrimoTempo

 ){

   parzialeOk=true;

 }







 // JOLLY RISULTATO

 if(
  p.jolly?.[g]
  ===
  "Risultato"
 ){


   if(risultatoOk){

     // da +2 diventa +4

     c[g].punti +=4;

   }
   else{

     c[g].punti -=2;

   }


 }
 else {


   if(risultatoOk){

     c[g].punti +=2;

   }


 }








 // JOLLY PARZIALE

 if(
  p.jolly?.[g]
  ===
  "Parziale"
 ){


   if(parzialeOk){

     c[g].punti +=4;

   }
   else{

     c[g].punti -=2;

   }


 }
 else {


   if(parzialeOk){

     c[g].punti +=2;

   }


 }








 // SUPERBONUS

 if(

   p.pronostici?.[g]
   ===p.esito &&

   p.pronosticiExtra?.[g]
   ===p.esitoExtra &&

   p.pronosticiUnderOver?.[g]
   ===p.esitoUnderOver &&

   risultatoOk &&

   parzialeOk

 ){

   c[g].punti +=3;

 }





 });


}



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

function renderClassifica(){

const box =
document.getElementById("classifica");


if(!box) return;



const classifica =
calcolaClassifica();



box.innerHTML="";



classifica.forEach((g,i)=>{


let medal="";


if(i===0)
 medal="🥇";

else if(i===1)
 medal="🥈";

else if(i===2)
 medal="🥉";



box.innerHTML +=`

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

<b>
${g.punti}
</b>

</div>


</div>

`;


});


}







// =========================
// RENDER EVENTI
// =========================

function renderEventi(){



const box =
document.getElementById("eventi");


if(!box) return;



box.innerHTML="";




const filtrati =
dati.filter(
p=>FASI_VISIBILI.includes(p.fase)
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



wrapper.className="collapsible";



let html="";





gruppi[fase]
.forEach(p=>{





const finale34 =
p.fase==="Finale 3/4 Posto";



const semifinale =
p.fase==="Semifinali";






// HEADER TABELLA


html +=`


<div class="pick header ${finale34 ? "finale34" : ""}">


<div class="pick-name">
Giocatore
</div>


<div>
Passa
</div>


<div>
G/N
</div>


<div>
U/O
</div>


${
(semifinale || finale34)

?

`

<div>
Risultato
</div>

`

:""

}



${
finale34

?

`

<div>
1° Tempo
</div>

<div>
Jolly
</div>

`

:""

}



</div>



`;








giocatori.forEach(g=>{



const main =
p.pronostici?.[g] || "-";


const extra =
p.pronosticiExtra?.[g] || "";


const under =
p.pronosticiUnderOver?.[g] || "";


const risultato =
p.pronosticiRisultato?.[g] || "";


const parziale =
p.pronosticiParziale?.[g] || "";


const jolly =
p.jolly?.[g] || "";






let clsMain="neutral";

let clsExtra="neutral";

let clsUnder="neutral";

let clsResult="neutral";

let clsParziale="neutral";







if(
p.esito &&
p.esito!=="?"
){


clsMain =
main===p.esito
?
"ok"
:
"no";


}






if(
p.esitoExtra &&
p.esitoExtra!=="?"
){


clsExtra =
extra===p.esitoExtra
?
"ok"
:
(extra?"no":"neutral");


}






if(
p.esitoUnderOver &&
p.esitoUnderOver!=="?"
){


clsUnder =
under===p.esitoUnderOver
?
"ok"
:
(under?"no":"neutral");


}







if(
p.risultatoEsatto &&
p.risultatoEsatto!=="?"
){


clsResult =
risultato===p.risultatoEsatto
?
"ok"
:
(risultato?"no":"neutral");


}







if(
p.parzialePrimoTempo &&
p.parzialePrimoTempo!=="?"
){


clsParziale =
parziale===p.parzialePrimoTempo
?
"ok"
:
(parziale?"no":"neutral");


}







html +=`

<div class="pick ${finale34 ? "finale34" : ""}">



<div class="pick-name">
${g}
</div>




<div class="${clsMain}">
${main}
</div>




<div class="${clsExtra}">
${extra}
</div>




<div class="${clsUnder}">
${under}
</div>






${
(semifinale || finale34)

?

`

<div class="${clsResult}">
${risultato}
</div>

`

:""

}







${
finale34

?

`

<div class="${clsParziale}">
${parziale}
</div>


<div>
${jolly}
</div>

`

:""

}




</div>


`;





});







html +=`

<div class="evento">

⚽ ${p.evento}

</div>

`;




});







wrapper.innerHTML=`


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
// STATISTICHE
// =========================

function renderStats(){



const totale =
dati.length;



const conclusi =
dati.filter(
p=>
p.esito &&
p.esito!=="?"
).length;





const attesa =
totale-conclusi;





const totGiocatori =
document.getElementById("totGiocatori");


if(totGiocatori)

totGiocatori.textContent =
giocatori.length;





const totEventi =
document.getElementById("totEventi");


if(totEventi)

totEventi.textContent =
totale;





const conclusiBox =
document.getElementById("conclusi");


if(conclusiBox)

conclusiBox.textContent =
conclusi;





const attesaBox =
document.getElementById("attesa");


if(attesaBox)

attesaBox.textContent =
attesa;





const fase =
document.getElementById("faseAttuale");


if(fase)

fase.textContent =
FASI_VISIBILI.join(" • ");



}









// =========================
// RENDER GENERALE
// =========================

function render(){


renderClassifica();


renderEventi();


renderStats();


}







// =========================
// AVVIO
// =========================

caricaDati();