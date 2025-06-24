// Array to store quote objects
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
  { text: "Strive not to be a success, but rather to be of value.", category: "Motivation" },
  { text: "The mind is everything. What you think you become.", category: "Philosophy" },
  { text: "Innovation distinguishes between a leader and a follower.", category: "Business" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" }
];

// Get DOM elements that exist initially
const quoteTextElement = document.getElementById('quoteText');
const quoteCategoryElement = document.getElementById('quoteCategory');
const newQuoteButton = document.getElementById('newQuote');
const messageDisplay = document.getElementById('messageDisplay'); // An element to display user messages
const formContainer = document.getElementById('formContainer'); // A new container for our dynamically created form

// Variables for dynamically created elements (will be assigned in createAddQuoteForm)
let newQuoteText;
let newQuoteCategory;
let addQuoteButton;


// --- Helper Functions ---

/**
 * @function showRandomQuote
 * @description Displays a random quote from the 'quotes' array on the page.
 * If the quotes array is empty, it displays a message.
 * Uses innerHTML to apply basic styling to the quote and category.
 */
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteTextElement.textContent = "No quotes available. Add some!";
    quoteCategoryElement.textContent = "";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  quoteTextElement.innerHTML = `<strong>"${randomQuote.text}"</strong>`;
  quoteCategoryElement.innerHTML = `<em>- ${randomQuote.category}</em>`;
}

/**
 * @function displayMessage
 * @description Displays a temporary message to the user.
 * @param {string} message - The message to display.
 * @param {string} type - The type of message (e.g., 'success', 'error', 'warning').
 * Uses innerHTML if the message contains simple HTML, otherwise textContent.
 */
function displayMessage(message, type = 'info') {
  if (messageDisplay) {
    messageDisplay.innerHTML = message;
    messageDisplay.className = ''; // Clear any previous styling classes
    messageDisplay.classList.add(`message-${type}`);
    messageDisplay.classList.add('fade-in');

    setTimeout(() => {
      messageDisplay.classList.remove('fade-in');
      messageDisplay.classList.add('fade-out');
      setTimeout(() => {
        messageDisplay.innerHTML = '';
        messageDisplay.className = '';
      }, 500);
    }, 3000);
  }
}

/**
 * @function addQuote
 * @description Adds a new quote to the 'quotes' array based on user input from the form.
 * It also clears the input fields and displays a new random quote.
 */
function addQuote() {
  // Ensure the dynamically created elements are accessible
  if (!newQuoteText || !newQuoteCategory) {
    displayMessage("Form elements not found. Please reload or check setup.", "error");
    return;
  }

  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);

    newQuoteText.value = '';
    newQuoteCategory.value = '';

    displayMessage("Quote added successfully! 🎉", "success");
    showRandomQuote();
  } else {
    displayMessage("<strong>Error:</strong> Please enter both quote text and category.", "error");
  }
}

---

## Dynamically Creating the Add Quote Form

```javascript
/**
 * @function createAddQuoteForm
 * @description Dynamically creates the input fields and button for adding a new quote
 * and appends them to a designated container in the DOM.
 */
function createAddQuoteForm() {
  if (!formContainer) {
    console.error("Error: '#formContainer' element not found in the HTML. Cannot create form.");
    return;
  }

  // Create a container for the form elements for better organization
  const formDiv = document.createElement('div');
  formDiv.id = 'addQuoteForm';
  formDiv.className = 'quote-form'; // Add a class for potential styling

  // Create Quote Text Input
  newQuoteText = document.createElement('input'); // Assign to the global variable
  newQuoteText.type = 'text';
  newQuoteText.id = 'newQuoteText';
  newQuoteText.placeholder = 'Enter new quote text';
  newQuoteText.className = 'form-input'; // Add a class for styling

  // Create Quote Category Input
  newQuoteCategory = document.createElement('input'); // Assign to the global variable
  newQuoteCategory.type = 'text';
  newQuoteCategory.id = 'newQuoteCategory';
  newQuoteCategory.placeholder = 'Enter quote category';
  newQuoteCategory.className = 'form-input'; // Add a class for styling

  // Create Add Quote Button
  addQuoteButton = document.createElement('button'); // Assign to the global variable
  addQuoteButton.id = 'addQuoteButton';
  addQuoteButton.textContent = 'Add New Quote';
  addQuoteButton.className = 'button primary-button'; // Add classes for styling

  // Append elements to the form container div
  formDiv.appendChild(newQuoteText);
  formDiv.appendChild(newQuoteCategory);
  formDiv.appendChild(addQuoteButton);

  // Append the form container div to the main form container in HTML
  formContainer.appendChild(formDiv);

  // Attach event listener to the dynamically created button
  addQuoteButton.addEventListener('click', addQuote);

  console.log("Add Quote Form created and appended.");
}
