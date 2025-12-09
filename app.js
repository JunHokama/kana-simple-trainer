// Tabela tradicional de hiragana
const VOGAIS = ["A","I","U","E","O"];
const HIRAGANA_TABLE = {
  "":  { "A":"あ","I":"い","U":"う","E":"え","O":"お" },
  "K": { "A":"か","I":"き","U":"く","E":"け","O":"こ" },
  "S": { "A":"さ","I":"し","U":"す","E":"せ","O":"そ" },
  "T": { "A":"た","I":"ち","U":"つ","E":"て","O":"と" },
  "N": { "A":"な","I":"に","U":"ぬ","E":"ね","O":"の" },
  "H": { "A":"は","I":"ひ","U":"ふ","E":"へ","O":"ほ" },
  "M": { "A":"ま","I":"み","U":"む","E":"め","O":"も" },
  "Y": { "A":"や",       "U":"ゆ",       "O":"よ" },
  "R": { "A":"ら","I":"り","U":"る","E":"れ","O":"ろ" },
  "W": { "A":"わ",                     "O":"を" }
};

// Mapa Hiragana -> romaji
const ROMAJI_MAP = {};
for (const cons in HIRAGANA_TABLE) {
  for (const vow in HIRAGANA_TABLE[cons]) {
    ROMAJI_MAP[HIRAGANA_TABLE[cons][vow]] = (cons + vow).toLowerCase();
    // casos especiais
    if (HIRAGANA_TABLE[cons][vow] === "し") ROMAJI_MAP["し"] = "shi";
    if (HIRAGANA_TABLE[cons][vow] === "ち") ROMAJI_MAP["ち"] = "chi";
    if (HIRAGANA_TABLE[cons][vow] === "つ") ROMAJI_MAP["つ"] = "tsu";
    if (HIRAGANA_TABLE[cons][vow] === "ふ") ROMAJI_MAP["ふ"] = "fu";
    if (HIRAGANA_TABLE[cons][vow] === "を") ROMAJI_MAP["を"] = "wo";
  }
}

// Função para embaralhar array
function shuffle(array) {
  for (let i = array.length -1; i>0; i--){
    const j = Math.floor(Math.random()*(i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Cria a tabela HTML
const container = document.getElementById("table-container");
const table = document.createElement("table");

// Cabeçalho (vogais)
let thead = document.createElement("tr");
thead.appendChild(document.createElement("th")); // canto vazio
VOGAIS.forEach(v => {
  const th = document.createElement("th");
  th.textContent = v;
  thead.appendChild(th);
});
table.appendChild(thead);

// Linhas por consoante
for (const cons in HIRAGANA_TABLE) {
  const tr = document.createElement("tr");

  const th = document.createElement("th");
  th.textContent = cons;
  tr.appendChild(th);

  VOGAIS.forEach(vow => {
    const td = document.createElement("td");
    if (HIRAGANA_TABLE[cons][vow]) {
      td.innerHTML = `<label><input type="checkbox" value="${HIRAGANA_TABLE[cons][vow]}"> ${HIRAGANA_TABLE[cons][vow]}</label>`;
    }
    tr.appendChild(td);
  });

  table.appendChild(tr);
}

container.appendChild(table);

// Lógica do treino
const startBtn = document.getElementById("start");
const app = document.getElementById("app");
const kanaEl = document.getElementById("kana");
const answer = document.getElementById("answer");
const feedback = document.getElementById("feedback");

let selected = [];
let index = 0;

startBtn.onclick = () => {
  selected = [...document.querySelectorAll("input:checked")].map(el => el.value);
  if (selected.length === 0) {
    alert("Selecione pelo menos 1 hiragana!");
    return;
  }

  // embaralhar antes de iniciar
  selected = shuffle(selected);

  index = 0;
  app.style.display = "block";
  showKana();
};

function showKana() {
  feedback.textContent = "";
  answer.value = "";
  kanaEl.textContent = selected[index];
  answer.focus();
}

answer.addEventListener("keyup", (e) => {
  if (e.key !== "Enter") return;

  const current = selected[index];
  const correct = ROMAJI_MAP[current];

  if (answer.value.trim().toLowerCase() === correct) {
    feedback.textContent = "✔️ Correto!";
    index++;
    if (index >= selected.length) {
      feedback.textContent = "🎉 Fim do treino!";
      kanaEl.textContent = "";
      return;
    }
    setTimeout(showKana, 600);
  } else {
    feedback.textContent = "❌ Errado! Tente novamente.";
  }
});
