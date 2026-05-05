const VOGAIS = ["A", "I", "U", "E", "O"];

const HIRAGANA_TABLE = {
  "":  { "A":"あ","I":"い","U":"う","E":"え","O":"お" },
  "K": { "A":"か","I":"き","U":"く","E":"け","O":"こ" },
  "S": { "A":"さ","I":"し","U":"す","E":"せ","O":"そ" },
  "T": { "A":"た","I":"ち","U":"つ","E":"て","O":"と" },
  "N": { "A":"な","I":"に","U":"ぬ","E":"ね","O":"の" },
  "H": { "A":"は","I":"ひ","U":"ふ","E":"へ","O":"ほ" },
  "M": { "A":"ま","I":"み","U":"む","E":"め","O":"も" },
  "Y": { "A":"や",         "U":"ゆ",         "O":"よ" },
  "R": { "A":"ら","I":"り","U":"る","E":"れ","O":"ろ" },
  "W": { "A":"わ",                           "O":"を" },
  "N (Final)": { "A":"ん" }
};

const KATAKANA_TABLE = {
  "":  { "A":"ア","I":"イ","U":"ウ","E":"エ","O":"オ" },
  "K": { "A":"カ","I":"キ","U":"ク","E":"ケ","O":"コ" },
  "S": { "A":"サ","I":"シ","U":"ス","E":"セ","O":"ソ" },
  "T": { "A":"タ","I":"チ","U":"ツ","E":"テ","O":"ト" },
  "N": { "A":"ナ","I":"ニ","U":"ヌ","E":"ネ","O":"ノ" },
  "H": { "A":"ハ","I":"ヒ","U":"フ","E":"ヘ","O":"ホ" },
  "M": { "A":"マ","I":"ミ","U":"ム","E":"メ","O":"モ" },
  "Y": { "A":"ヤ",         "U":"ユ",         "O":"ヨ" },
  "R": { "A":"ラ","I":"リ","U":"ル","E":"レ","O":"ロ" },
  "W": { "A":"ワ",                           "O":"ヲ" },
  "N (Final)": { "A":"ン" }
};

const ROMAJI_MAP = {};

function buildRomaji(table) {
  for (const cons in table) {
    for (const vow in table[cons]) {
      const ch = table[cons][vow];
      ROMAJI_MAP[ch] = (cons + vow).toLowerCase().replace("(final)a", "");
    }
  }
}
buildRomaji(HIRAGANA_TABLE);
buildRomaji(KATAKANA_TABLE);

ROMAJI_MAP["ん"] = "n";  ROMAJI_MAP["ン"] = "n";
ROMAJI_MAP["し"] = "shi"; ROMAJI_MAP["シ"] = "shi";
ROMAJI_MAP["ち"] = "chi"; ROMAJI_MAP["チ"] = "chi";
ROMAJI_MAP["つ"] = "tsu"; ROMAJI_MAP["ツ"] = "tsu";
ROMAJI_MAP["ふ"] = "fu";  ROMAJI_MAP["フ"] = "fu";
ROMAJI_MAP["を"] = "wo";  ROMAJI_MAP["ヲ"] = "wo";

const ALL_KANA = Object.keys(ROMAJI_MAP);

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildSelectionTable(container, table) {
  const tbl = document.createElement("table");
  tbl.className = "kana-table";

  const head = document.createElement("tr");
  head.appendChild(document.createElement("th"));
  VOGAIS.forEach(v => {
    const th = document.createElement("th");
    th.textContent = v;
    head.appendChild(th);
  });
  tbl.appendChild(head);

  for (const cons in table) {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.textContent = cons.replace(" (Final)", "");
    tr.appendChild(th);

    VOGAIS.forEach(v => {
      const td = document.createElement("td");
      const ch = table[cons][v];
      if (ch) {
        td.innerHTML = `<label><input type="checkbox" value="${ch}" checked>${ch}</label>`;
      }
      tr.appendChild(td);
    });
    tbl.appendChild(tr);
  }

  container.innerHTML = "";
  container.appendChild(tbl);
}

function toggleAll(containerId, state) {
  document.querySelectorAll(`#${containerId} input[type="checkbox"]`)
    .forEach(cb => cb.checked = state);
}

function createTrainer({ source, displayEl, inputEl, feedbackEl, statsEl, countEl, listEl, startBtn, selectionContainer, controlsToHide }) {
  let list = [];
  let idx = 0;
  let errors = 0;
  const errList = [];

  function resetStats() {
    errors = 0;
    errList.length = 0;
    if (countEl) countEl.textContent = "0";
    if (listEl)  listEl.textContent  = "";
    if (statsEl) statsEl.classList.add("active");
  }

  function registerError(ch) {
    errors++;
    errList.push(ch);
    if (countEl) countEl.textContent = errors;
    if (listEl)  listEl.textContent  = errList.join(" ");
  }

  function show() {
    feedbackEl.textContent = "";
    feedbackEl.className = "feedback";
    inputEl.value = "";
    displayEl.textContent = list[idx];
    inputEl.focus();
  }

  function start() {
    const items = (typeof source === "function") ? source() : source;
    if (!items || items.length === 0) {
      alert("Selecione pelo menos 1 kana!");
      return;
    }
    list = shuffle(items);
    idx = 0;
    resetStats();
    if (controlsToHide) controlsToHide.forEach(el => el.style.display = "none");
    document.getElementById("trainer").classList.add("active");
    show();
  }

  inputEl.addEventListener("keyup", e => {
    if (e.key !== "Enter") return;
    const cur = list[idx];
    const ok  = ROMAJI_MAP[cur];
    if (e.target.value.trim().toLowerCase() === ok) {
      feedbackEl.textContent = "正解 — Correto";
      feedbackEl.className = "feedback ok";
      idx++;
      if (idx >= list.length) {
        feedbackEl.textContent = "完了 — Fim do treino";
        displayEl.textContent = "";
        return;
      }
      setTimeout(show, 500);
    } else {
      feedbackEl.textContent = "違う — Errado";
      feedbackEl.className = "feedback err";
      registerError(cur);
      e.target.value = "";
    }
  });

  startBtn.addEventListener("click", start);
}
