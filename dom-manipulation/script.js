// Array to store quote objects
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Motivation" },
    { text: "The mind is everything. What you think you become.", category: "Philosophy" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Business" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" }
  ];

  // Get DOM elements
  const quoteDisplay = document.getElementById('quoteDisplay');
  const quoteTextElement = document.getElementById('quoteText');
  const quoteCategoryElement = document.getElementById('quoteCategory');
  const newQuoteButton = document.getElementById('newQuote');
  const newQuoteText = document.getElementById('newQuoteText');
  const newQuoteCategory = document.getElementById('newQuoteCategory');

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

      // Display a new random quote, potentially including the newly added one
      showRandomQuote();
    } else {
      // Provide user feedback if input is invalid (e.g., using a simple alert or a modal)
      // For this example, we'll use a basic console log. In a real app, use a user-friendly modal.
      console.warn("Please enter both quote text and category.");
      // Example of a simple temporary message in the UI:
      const tempMessage = document.createElement('p');
      tempMessage.textContent = 'Please fill in both fields!';
      tempMessage.className = 'text-red-500 text-sm mt-2';
      quoteDisplay.appendChild(tempMessage);
      setTimeout(() => tempMessage.remove(), 3000); // Remove message after 3 seconds
    }
  }

  // Event listener for the "Show New Quote" button
  newQuoteButton.addEventListener('click', showRandomQuote);

  // Initial call to display a quote when the page loads
  window.onload = showRandomQuote;
