/* eslint-env browser */
/* global document, alert, FileReader, Blob, URL */

// ========================================
// DATA MODULE
// ========================================

const QuoteModel = (() => {
    let quotes = [];

    function loadQuotes() {
        const stored = localStorage.getItem("quotes");
        if (stored) quotes = JSON.parse(stored);
        else {
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

    function getRandomQuote() {
        if (quotes.length === 0) return null;
        const index = Math.floor(Math.random() * quotes.length);
        sessionStorage.setItem("lastQuote", JSON.stringify(quotes[index]));
        return quotes[index];
    }

    function addQuote(text, category) {
        quotes.push({ text, category });
        saveQuotes();
    }

    function importQuotes(arr) {
        quotes.push(...arr);
        saveQuotes();
    }

    function getQuotes() {
        return quotes;
    }

    return { loadQuotes, saveQuotes, getRandomQuote, addQuote, importQuotes, getQuotes };
})();


// ========================================
// UI MODULE
// ========================================

const QuoteUI = (() => {
    const quoteDisplay = document.getElementById("quoteDisplay");

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

    return { showQuote, getInputs, clearInputs };
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

    function displayRandomQuote() {
        const q = QuoteModel.getRandomQuote();
        QuoteUI.showQuote(q);
    }

    function addQuote() {
        const { text, category } = QuoteUI.getInputs();
        if (text === "" || category === "") {
            alert("Please fill in both fields.");
            return;
        }

        QuoteModel.addQuote(text, category);
        QuoteUI.clearInputs();
        displayRandomQuote();
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
            alert("Quotes imported successfully!");
            displayRandomQuote();
        };
        fileReader.readAsText(event.target.files[0]);
    }

    function loadLastViewedQuote() {
        const stored = sessionStorage.getItem("lastQuote");
        if (!stored) {
            alert("No last quote saved yet.");
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
    }

    function init() {
        QuoteModel.loadQuotes();
        setupListeners();
        displayRandomQuote();
    }

    return { init };
})();

QuoteController.init();
