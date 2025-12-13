// ========================================
// DATA MODULE (Handles data only)
// ========================================

const QuoteModel = (() => {

    let quotes = [
        { text: "The best way to predict the future is to create it.", category: "Motivation" },
        { text: "Learning never exhausts the mind.", category: "Education" },
        { text: "Life is really simple, but we insist on making it complicated.", category: "Life" }
    ];

    function getRandomQuote() {
        if (quotes.length === 0) return null;

        const index = Math.floor(Math.random() * quotes.length);
        return quotes[index];
    }

    function addQuote(text, category) {
        quotes.push({ text, category });
    }

    return {
        getRandomQuote,
        addQuote
    };
})();


// ========================================
// UI MODULE (Handles DOM updates only)
// ========================================

const QuoteUI = (() => {

    const quoteDisplay = document.getElementById("quoteDisplay");

    function showQuote(quoteObj) {
        if (!quoteObj) {
            quoteDisplay.textContent = "No quotes available.";
        } else {
            // ✅ This is the correct placement
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

    return {
        showQuote,
        getInputs,
        clearInputs
    };

})();


// ========================================
// CONTROLLER MODULE (Connects UI & Data)
// ========================================

const QuoteController = (() => {

    const newQuoteBtn = document.getElementById("newQuote");
    const addQuoteBtn = document.getElementById("addQuoteBtn");

    function displayRandomQuote() {
        const quote = QuoteModel.getRandomQuote();
        QuoteUI.showQuote(quote);
    }

    function addQuote() {
        const { text, category } = QuoteUI.getInputs();

        if (text === "" || category === "") {
            alert("Please fill in both fields.");
            return;
        }

        QuoteModel.addQuote(text, category);
        QuoteUI.clearInputs();

        // Update displayed quote after adding
        displayRandomQuote();
    }

    function setupListeners() {
        newQuoteBtn.addEventListener("click", displayRandomQuote);
        addQuoteBtn.addEventListener("click", addQuote);
    }

    function init() {
        setupListeners();
        displayRandomQuote();
    }

    return { init };

})();


// Initialize application
QuoteController.init();
