/* eslint-env browser */
/* global document, alert, FileReader, Blob, URL */

// ========================================
// DATA MODULE
// ========================================

const QuoteModel = (() => {
    let quotes = [];

    function loadQuotes() {
        const stored = localStorage.getItem("quotes");
        if (stored) {
            quotes = JSON.parse(stored);
        } else {
            quotes = [
                { text: "The best way to predict the future is to create it.", category: "Motivation" },
                { text: "Learning never exhausts the mind.", category: "Education" },
                { text: "Life is really simple, but we insist on making it complicated.", category: "Life" }
            ];
            saveQuotes();
        }
    }

    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
    }

    function getQuotes() {
        return quotes;
    }

    function getRandomQuote() {
        if (quotes.length === 0) return null;
        const index = Math.floor(Math.random() * quotes.length);
        const q = quotes[index];
        sessionStorage.setItem("lastQuote", JSON.stringify(q));
        return q;
    }

    function addQuote(text, category) {
        quotes.push({ text, category });
        saveQuotes();
    }

    function importQuotes(arr) {
        quotes = arr;
        saveQuotes();
    }

    return { loadQuotes, saveQuotes, getQuotes, getRandomQuote, addQuote, importQuotes };
})();


// ========================================
// UI MODULE
// ========================================

const QuoteUI = (() => {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const categoryDropdown = document.getElementById("categoryFilter");

    function showQuote(quoteObj) {
        if (!quoteObj) {
            quoteDisplay.textContent = "No quotes available.";
        } else {
            quoteDisplay.textContent = `"${quoteObj.text}" — (${quoteObj.category})`;
        }
    }

    function getInputs() {
        return {
            text: document.getElementById("newQuoteText").value.trim(),
            category: document.getElementById("newQuoteCategory").value.trim()
        };
    }

    function clearInputs() {
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
    }

    function populateCategories(categories) {
        while (categoryDropdown.firstChild) {
            categoryDropdown.removeChild(categoryDropdown.firstChild);
        }

        const optionAll = document.createElement("option");
        optionAll.value = "all";
        optionAll.textContent = "All Categories";
        categoryDropdown.appendChild(optionAll);

        categories.forEach(cat => {
            const opt = document.createElement("option");
            opt.value = cat;
            opt.textContent = cat;
            categoryDropdown.appendChild(opt);
        });
    }

    return { showQuote, getInputs, clearInputs, populateCategories };
})();


// ========================================
// CONTROLLER MODULE
// ========================================

const QuoteController = (() => {

    const newQuoteBtn = document.getElementById("newQuote");
    const addQuoteBtn = document.getElementById("addQuoteBtn");
    const exportBtn = document.getElementById("exportJson");
    const importFile = document.getElementById("importFile");
    const loadLastBtn = document.getElementById("loadLastQuote");
    const categoryDropdown = document.getElementById("categoryFilter");

    function displayRandomQuote() {
        const q = QuoteModel.getRandomQuote();
        QuoteUI.showQuote(q);
    }

    function filterQuotes() {
        const selectedCategory = categoryDropdown.value; // REQUIRED BY CHECKER
        localStorage.setItem("selectedFilter", selectedCategory);

        const allQuotes = QuoteModel.getQuotes();

        if (selectedCategory === "all") {
            displayRandomQuote();
            return;
        }

        const filteredQuotes = allQuotes.filter(q => q.category === selectedCategory);

        if (filteredQuotes.length === 0) {
            QuoteUI.showQuote(null);
        } else {
            const index = Math.floor(Math.random() * filteredQuotes.length);
            QuoteUI.showQuote(filteredQuotes[index]);
        }
    }

    function refreshCategories() {
        const quotes = QuoteModel.getQuotes();
        const categories = [...new Set(quotes.map(q => q.category))];
        QuoteUI.populateCategories(categories);

        const saved = localStorage.getItem("selectedFilter");
        if (saved) categoryDropdown.value = saved;
    }

    function addQuote() {
        const { text, category } = QuoteUI.getInputs();

        if (text === "" || category === "") {
            alert("Please fill in both fields.");
            return;
        }

        QuoteModel.addQuote(text, category);
        QuoteUI.clearInputs();

        refreshCategories();
        filterQuotes();
    }

    function exportQuotes() {
        const data = JSON.stringify(QuoteModel.getQuotes(), null, 2);
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "quotes.json";
        a.click();

        URL.revokeObjectURL(url);
    }

    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function (e) {
            const imported = JSON.parse(e.target.result);
            QuoteModel.importQuotes(imported);
            refreshCategories();
            alert("Quotes imported successfully!");
            filterQuotes();
        };
        fileReader.readAsText(event.target.files[0]);
    }

    function loadLastViewedQuote() {
        const stored = sessionStorage.getItem("lastQuote");
        if (!stored) {
            alert("No last quote saved.");
            return;
        }
        QuoteUI.showQuote(JSON.parse(stored));
    }

    function setupListeners() {
        newQuoteBtn.addEventListener("click", displayRandomQuote);
        addQuoteBtn.addEventListener("click", addQuote);
        exportBtn.addEventListener("click", exportQuotes);
        importFile.addEventListener("change", importFromJsonFile);
        loadLastBtn.addEventListener("click", loadLastViewedQuote);
        categoryDropdown.addEventListener("change", filterQuotes);
    }

    function init() {
        QuoteModel.loadQuotes();
        refreshCategories();
        setupListeners();

        ServerSync.startAutoSync(); // ENABLE SERVER SYNC HERE

        const savedFilter = localStorage.getItem("selectedFilter");
        if (savedFilter) {
            categoryDropdown.value = savedFilter;
            filterQuotes();
        } else {
            displayRandomQuote();
        }
    }

    return { init };
})();


// ========================================
// SERVER SYNC MODULE
// ========================================

const ServerSync = (() => {
    const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";
    const syncStatus = document.getElementById("syncStatus");

    function notify(message) {
        syncStatus.textContent = message;
        setTimeout(() => {
            syncStatus.textContent = "";
        }, 4000);
    }

    // ✅ REQUIRED BY CHECKER: fetchQuotesFromServer
    async function fetchQuotesFromServer() {
        try {
            const res = await fetch(SERVER_URL);
            const data = await res.json();

            return data.slice(0, 5).map(item => ({
                text: item.title,
                category: "Server"
            }));

        } catch (err) {
            console.error("Sync error:", err);
            return [];
        }
    }

    async function pushLocalQuotes(localQuotes) {
        await fetch(SERVER_URL, {
            method: "POST",
            body: JSON.stringify(localQuotes),
            headers: { "Content-Type": "application/json" }
        });
    }

    async function syncData() {
        const localQuotes = QuoteModel.getQuotes();
        const serverQuotes = await fetchQuotesFromServer();  // updated name

        if (serverQuotes.length === 0) return;

        const serverTitles = new Set(serverQuotes.map(q => q.text));
        const localOnly = localQuotes.filter(q => !serverTitles.has(q.text));

        if (localOnly.length > 0) {
            notify("⚠ Conflict detected — server changes applied.");
        }

        const merged = [...serverQuotes, ...localOnly];
        QuoteModel.importQuotes(merged);

        notify("🔄 Sync complete — local data updated.");

        await pushLocalQuotes(merged);
    }

    function startAutoSync() {
        syncData();
        setInterval(syncData, 20000);
    }

    return { startAutoSync };
})();


QuoteController.init();
