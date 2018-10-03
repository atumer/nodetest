import words from "./word-list.js";

// Gruplar: elakin, omutüy, örıdsb, zçgşcp, hvğfj
let sesliHarfler = ["a", "e", "i", "o",];
let sessizHarfler = ["l", "k", "n", "m",];

function findWords(criteria) {
  if (!criteria) criteria = {};
  if (!criteria.harfler) criteria.harfler = [];
  if (isNaN(criteria.asgari)) criteria.asgari = 1;
  if (isNaN(criteria.azami)) criteria.azami = 100;

  if (criteria.harfler.length === 0) {
    return [];
  }

  let olmayanHarfler = new RegExp(`[^${criteria.harfler.join("|")}]`);

  let bulunanSozcukler = [];
  for(let i=0; i<words.length; i++) {
    if (!olmayanHarfler.test(words[i])
      && words[i].length <= criteria.azami
      && words[i].length >= criteria.asgari) {
      bulunanSozcukler.push(words[i]);
    }
  }

  return bulunanSozcukler;
}

function heceUret(criteria) {
  if (!criteria) criteria = {};
  let sesliHarfler = criteria.sesliHarfler || [];
  let sessizHarfler = criteria.sessizHarfler || [];

  let tekli = criteria.tekli || true;
  let ikili = criteria.ikili || true;
  let uclu = criteria.uclu || false;
  let dortlu = criteria.dortlu || false;

  let heceler = [];

  // sesli harflerden oluşan sözcükler
  if (tekli) {
    for (let sesli of sesliHarfler)
      heceler.push(sesli);
  }

  // al ve la formatındaki sözcükler
  if (ikili) {
    for (let sesli of sesliHarfler)
      for (let sessiz of sessizHarfler) {
        heceler.push(sesli + sessiz);
        heceler.push(sessiz + sesli);
      }
  }

  // lan formatındaki sözcükler
  if (uclu) {
    for (let sesli of sesliHarfler)
      for (let sessiz1 of sessizHarfler)
        for (let sessiz2 of sessizHarfler) {
          heceler.push(sessiz1 + sesli + sessiz2);
        }
  }

  // ilk ve tart formatındaki sözcükler
  if (dortlu) {
    for (let word of findWords({ harfler: sesliHarfler.concat(sessizHarfler), asgari: 3, azami: 4 })) {
      if ( (word.length==3 &&
        sesliHarfler.indexOf(word[0])>-1 &&
        sessizHarfler.indexOf(word[1])>-1 &&
        sessizHarfler.indexOf(word[2])>-1 ) ||
        (word.length==4 &&
        sesliHarfler.indexOf(word[1])>-1 &&
        sessizHarfler.indexOf(word[2])>-1 &&
        sessizHarfler.indexOf(word[3])>-1) ) {
        heceler.push(word);
      }
    }
  }

  return (heceler);
}

function doldur(girdi) {
  let liste = document.getElementById("output");

  while (liste.firstChild) {
    liste.removeChild(liste.firstChild);
  }

  let colorIndex = 0;
  for (let word of girdi) {
    let newDiv = document.createElement("div");
    newDiv.classList.add("grid-item");
    newDiv.classList.add("grid-item-cl" + (colorIndex++)%6);
    newDiv.appendChild(document.createTextNode(word));
    liste.appendChild(newDiv);
  }
}

function heceAl() {
  let heceHavuzu = [];
  heceHavuzu = heceHavuzu
    .concat(heceUret({ sesliHarfler, sessizHarfler }))
    .concat(heceUret({ sesliHarfler, sessizHarfler }))
    .concat(heceUret({ sesliHarfler, sessizHarfler }))
    .concat(heceUret({ sesliHarfler, sessizHarfler, tekli:0, ikili:0, uclu:1 }));

  let heceler = [];
  const HECE_ADEDI = 10*16;

  for (let i=0; i<HECE_ADEDI; i++) {
    heceler.push(heceHavuzu[Math.floor(Math.random() * heceHavuzu.length)]);
  }

  doldur(heceler);
}

function sozcukAl() {
  let sozcukHavuzu = [];
  sozcukHavuzu = sozcukHavuzu
    .concat(findWords({ harfler: sesliHarfler.concat(sessizHarfler), asgari: 2, azami: 4 }))
    .concat(findWords({ harfler: sesliHarfler.concat(sessizHarfler), asgari: 2, azami: 4 }))
    .concat(findWords({ harfler: sesliHarfler.concat(sessizHarfler), asgari: 2, azami: 4 }))
    .concat(findWords({ harfler: sesliHarfler.concat(sessizHarfler), asgari: 5, azami: 5 }));

  let sozcukler = [];
  const SOZCUK_ADEDI = 10*16;

  for (let i=0; i<SOZCUK_ADEDI; i++) {
    sozcukler.push(sozcukHavuzu[Math.floor(Math.random() * sozcukHavuzu.length)]);
  }

  doldur(sozcukler);
}

document.getElementById("heceal").addEventListener("click", heceAl, false);

document.getElementById("sozcukal").addEventListener("click", sozcukAl, false);
