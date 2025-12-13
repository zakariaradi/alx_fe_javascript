// Initial Quotes Data

let quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Learning never exhausts the mind.", category: "Education" },
  { text: "Life is really simple, but we insist on making it complicated.", category: "Life" }
];


// DOM ELEMENT REFERENCES

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");


// FUNCTION: Show Random Quote

function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available. Add a quote!";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quoteObj = quotes[randomIndex];

  // Update DOM
  quoteDisplay.textContent = `"${quoteObj.text}" — (${quoteObj.category})`;
}


// FUNCTION: Add New Quote

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  // Validate inputs
  if (text === "" || category === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  // Cr// ========================================
// DATA MODULE (Responsible for data only)
// ========================================

const QuoteModel = (() => {
    let quotes = [
        { text: "The best way to predict the future is to create it.", category: "Motivation" },
        { text: "Learning never exhausts the mind.", category: "Education" },
        { text: "Life is really simple, but we insist on making it complicated.", category: "Life" }
    ];

    function getAllQuotes() {
        return quotes;
    }

    function addQuote(text, category) {
        quotes.push({ text, category });
    }

    function getRandomQuote() {
        if (quotes.length === 0) {
            return null;
        }
        const index = Math.floor(Math.random() * quotes.length);
        return quotes[index];
    }

    return { getAllQuotes, addQuote, getRandomQuote };
})();
 

// ========================================
// UI MODULE (Handles only DOM interaction)
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
// CONTROLLER MODULE (Connects UI + Data)
// ========================================

const QuoteController = (() => {
    const newQuoteBtn = document.getElementById("newQuote");
    const addQuoteBtn = document.getElementById("addQuoteBtn");

    // Handle showing a random quote
    function displayRandomQuote() {
        const quote = QuoteModel.getRandomQuote();
        QuoteUI.showQuote(quote);
    }

    // Handle adding quotes
    function handleAddQuote() {
        const inputs = QuoteUI.getInputs();
        if (inputs.text === "" || inputs.category === "") {
            alert("Please fill in both fields.");
            return;
        }

        QuoteModel.addQuote(inputs.text, inputs.category);
        QuoteUI.clearInputs();
        displayRandomQuote(); // Show the newly added quote
    }

    // Add all event listeners here
    function setupListeners() {
        newQuoteBtn.addEventListener("click", displayRandomQuote);
        addQuoteBtn.addEventListener("click", handleAddQuote);
    }

    // Initialization
    function init() {
        setupListeners();
        displayRandomQuote();
    }

    return { init };
})();


// Run app
QuoteController.init();
eate new quote object
  const newQuote = {
    text: text,
    category: category
  };

  // Add to array
  quotes.push(newQuote);

  // Clear inputs
  textInput.value = "";
  categoryInput.value = "";

  alert("Quote added successfully!");
}


// EVENT LISTENERS

newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);


// Show a quote on page load

showRandomQuote();
