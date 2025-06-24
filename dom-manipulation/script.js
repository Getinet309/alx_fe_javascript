// Array to store quote objects
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
  { text: "Strive not to be a success, but rather to be of value.", category: "Motivation" },
  { text: "The mind is everything. What you think you become.", category: "Philosophy" },
  { text: "Innovation distinguishes between a leader and a follower.", category: "Business" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" }
];

// Get DOM elements
const quoteTextElement = document.getElementById('quoteText');
const quoteCategoryElement = document.getElementById('quoteCategory');
const newQuoteButton = document.getElementById('newQuote');
const addQuoteButton = document.getElementById('addQuoteButton'); // Assuming a button to trigger addQuote
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const messageDisplay = document.getElementById('messageDisplay'); // An element to display user messages

/**
 * @function showRandomQuote
 * @description Displays a random quote from the 'quotes' array on the page.
 * If the quotes array is empty, it displays a message.
 */
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteTextElement.textContent = "No quotes available. Add some!";
    quoteCategoryElement.textContent = "";
    return;
  }
  // Generate a random index
  const randomIndex = Math.floor(Math.random() * quotes.length);
  // Get the random quote object
  const randomQuote = quotes[randomIndex];

  // Update the DOM elements with the quote text and category
  quoteTextElement.textContent = `"${randomQuote.text}"`;
  quoteCategoryElement.textContent = `- ${randomQuote.category}`;
}

/**
 * @function displayMessage
 * @description Displays a temporary message to the user.
 * @param {string} message - The message to display.
 * @param {string} type - The type of message (e.g., 'success', 'error', 'warning').
 */
function displayMessage(message, type = 'info') {
  if (messageDisplay) {
    messageDisplay.textContent = message;
    // Clear any previous styling classes
    messageDisplay.className = '';
    // Add new styling based on message type (you'd define these in CSS)
    messageDisplay.classList.add(`message-${type}`);
    messageDisplay.classList.add('fade-in'); // Example for a fade-in animation

    setTimeout(() => {
      messageDisplay.classList.remove('fade-in');
      messageDisplay.classList.add('fade-out'); // Example for a fade-out animation
      setTimeout(() => {
        messageDisplay.textContent = '';
        messageDisplay.className = ''; // Reset all classes
      }, 500); // Allow fade-out animation to complete
    }, 3000); // Message visible for 3 seconds
  }
}

/**
 * @function addQuote
 * @description Adds a new quote to the 'quotes' array based on user input from the form.
 * It also clears the input fields and displays a new random quote.
 */
function addQuote() {
  // Get values from input fields, trim whitespace
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  // Validate input: ensure both fields are not empty
  if (text && category) {
    // Create a new quote object
    const newQuote = { text, category };
    // Add the new quote to the quotes array
    quotes.push(newQuote);

    // Clear the input fields
    newQuoteText.value = '';
    newQuoteCategory.value = '';

    // Display success message
    displayMessage("Quote added successfully!", "success");

    // Display a new random quote, potentially including the newly added one
    showRandomQuote();
  } else {
    // Provide user feedback if input is invalid
    displayMessage("Please enter both quote text and category.", "error");
  }
}

// Event listener for the "Show New Quote" button
newQuoteButton.addEventListener('click', showRandomQuote);

// Event listener for the "Add Quote" button (assuming you have one)
// If you don't have a separate button for adding, this would be triggered by a form submit.
// For now, let's assume an 'addQuoteButton' exists.
if (addQuoteButton) {
  addQuoteButton.addEventListener('click', addQuote);
}


// Initial call to display a quote when the page loads
window.onload = showRandomQuote;
