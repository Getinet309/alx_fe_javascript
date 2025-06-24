// Array of quote objects, each with 'text' and 'category' properties.
// This array serves as the data source for our quote generator.
const quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
  { text: "Innovation distinguishes between a leader and a follower.", category: "Business" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Motivation" },
  { text: "Strive not to be a success, but rather to be of value.", category: "Life" },
  { text: "The mind is everything. What you think you become.", category: "Mindfulness" }
];

// Get references to the DOM elements where quotes will be displayed and interacted with.
const quoteTextElement = document.getElementById('quoteText');
const quoteCategoryElement = document.getElementById('quoteCategory');
const newQuoteButton = document.getElementById('newQuote');
const newQuoteTextInput = document.getElementById('newQuoteText');
const newQuoteCategoryInput = document.getElementById('newQuoteCategory');

/**
 * Displays a random quote from the 'quotes' array on the web page.
 * It selects a quote randomly and updates the text and category elements in the DOM.
 */
function displayRandomQuote() {
  // Check if the quotes array is empty to prevent errors.
  if (quotes.length === 0) {
    quoteTextElement.innerText = "No quotes available. Add some!";
    quoteCategoryElement.innerText = "";
    return;
  }

  // Generate a random index to select a quote.
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const selectedQuote = quotes[randomIndex];

  // Update the DOM elements with the text and category of the selected quote.
  quoteTextElement.innerText = `"${selectedQuote.text}"`;
  quoteCategoryElement.innerText = `- ${selectedQuote.category}`;
}

/**
 * Adds a new quote to the 'quotes' array based on user input from the form.
 * It retrieves values from input fields, creates a new quote object,
 * adds it to the array, clears the inputs, and then displays a random quote.
 */
function addQuote() {
  // Get the values from the input fields.
  const newQuoteText = newQuoteTextInput.value.trim();
  const newQuoteCategory = newQuoteCategoryInput.value.trim();

  // Validate that both fields are not empty.
  if (newQuoteText && newQuoteCategory) {
    // Create a new quote object.
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    // Add the new quote to the 'quotes' array.
    quotes.push(newQuote);

    // Clear the input fields after adding the quote.
    newQuoteTextInput.value = '';
    newQuoteCategoryInput.value = '';

    // Display a random quote, which might be the newly added one.
    displayRandomQuote();

    // Optional: Provide visual feedback that the quote was added.
    console.log("New quote added:", newQuote);
    // In a real application, you might show a temporary success message to the user.
  } else {
    // Alert the user if fields are empty. Using console.warn for better UX than alert().
    console.warn("Please enter both quote text and category to add a new quote.");
    // In a real application, you might update a small message box on the page.
  }
}

// Event Listener for the "Show New Quote" button.
// When the button is clicked, the displayRandomQuote function is called.
newQuoteButton.addEventListener('click', displayRandomQuote);

// Initial call to display a random quote when the page loads.
// This ensures that content is visible immediately.
window.onload = displayRandomQuote;
