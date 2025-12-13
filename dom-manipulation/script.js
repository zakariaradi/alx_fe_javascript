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

  // Create new quote object
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
