// --------------------
// INITIAL DATA LOAD
// --------------------
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { id: 1, text: "The best way to predict the future is to create it.", category: "Motivation" },
  { id: 2, text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const exportBtn = document.getElementById("exportQuotes");
const categoryFilter = document.getElementById("categoryFilter");
const syncStatus = document.getElementById("syncStatus");

// --------------------
// STORAGE HELPERS
// --------------------
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// --------------------
// DISPLAY FUNCTIONS
// --------------------
function displayQuotes(list) {
  quoteDisplay.innerHTML = "";

  if (list.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  list.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `"${q.text}" (${q.category})`;
    quoteDisplay.appendChild(p);
  });
}

function showRandomQuote() {
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  quoteDisplay.textContent = `"${q.text}" (${q.category})`;
  sessionStorage.setItem("lastQuote", JSON.stringify(q));
}

// --------------------
// CATEGORY FILTERING
// --------------------
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });

  const saved = localStorage.getItem("selectedCategory");
  if (saved) categoryFilter.value = saved;
}

function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);

  const filtered =
    selected === "all"
      ? quotes
      : quotes.filter(q => q.category === selected);

  displayQuotes(filtered);
}

// --------------------
// ADD QUOTES
// --------------------
function createAddQuoteForm() {
  const div = document.createElement("div");

  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const btn = document.createElement("button");
  btn.textContent = "Add Quote";
  btn.addEventListener("click", addQuote);

  div.append(textInput, categoryInput, btn);
  document.body.appendChild(div);
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please fill in both fields");
    return;
  }

  quotes.push({
    id: Date.now(),
    text,
    category
  });

  saveQuotes();
  populateCategories();
  filterQuotes();
}

// --------------------
// SERVER SYNC (SIMULATION)
// --------------------
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// Fetch from server (simulation)
async function fetchQuotesFromServer() {
  const response = await fetch(SERVER_URL);
  const data = await response.json();

  // Simulate server quotes
  return data.slice(0, 5).map(item => ({
    id: item.id,
    text: item.title,
    category: "Server"
  }));
}

// Sync logic (server wins)
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();

  // Conflict resolution: server takes precedence
  quotes = serverQuotes;
  saveQuotes();

  populateCategories();
  filterQuotes();

  syncStatus.textContent = "Quotes synced with server!";
}

// Periodic sync every 30 seconds
setInterval(syncQuotes, 30000);

// --------------------
// JSON IMPORT / EXPORT
// --------------------
function exportQuotesToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const reader = new FileReader();

  reader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    filterQuotes();
    alert("Quotes imported successfully!");
  };

  reader.readAsText(event.target.files[0]);
}

// --------------------
// EVENTS & INIT
// --------------------
newQuoteBtn.addEventListener("click", showRandomQuote);
exportBtn.addEventListener("click", exportQuotesToJson);

createAddQuoteForm();
populateCategories();
filterQuotes();



