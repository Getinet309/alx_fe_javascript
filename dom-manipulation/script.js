// Array to store quote objects. Each object has 'text' and 'category' properties.
// Initial quotes are provided for demonstration.
let quotes = [
    { text: "The best way to predict the future is to create it.", category: "Inspiration" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
    { text: "The only limit to our realization of tomorrow will be our doubts of today.", category: "Motivation" },
    { text: "Do not wait for leaders; do it alone, person to person.", category: "Action" },
    { text: "It is during our darkest moments that we must focus to see the light.", category: "Hope" }
];

// --- DOM Element References ---
// Get the div where the random quote will be displayed
const quoteDisplay = document.getElementById('quoteDisplay');
// Get the input field for entering new quotes
const quoteInput = document.getElementById('quoteInput');
// Get the button for showing a new random quote
const showNewQuoteBtn = document.getElementById('newQuote');
// A variable to hold the dynamically created 'Add Quote' button
let addQuoteBtn; // Declared here, will be assigned in createAddQuoteForm

// --- Function to Display a Random Quote ---
/**
 * Selects a random quote from the 'quotes' array and displays it in the quoteDisplay div.
 * If the quotes array is empty, it displays a message indicating no quotes are available.
 */
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.textContent = "No quotes available. Add some using the form below!";
        quoteDisplay.classList.add('text-red-500', 'font-semibold', 'text-center'); // Add some styling for empty state
        return;
    }

    // Remove empty state styling if quotes are present
    quoteDisplay.classList.remove('text-red-500', 'font-semibold', 'text-center');

    // Generate a random index based on the current length of the quotes array
    const randomIndex = Math.floor(Math.random() * quotes.length);
    // Get the random quote object
    const randomQuote = quotes[randomIndex];

    // Update the text content of the quoteDisplay div
    // Including both text and category for better information
    quoteDisplay.innerHTML = `
        <p class="text-xl italic mb-2">"${randomQuote.text}"</p>
        <p class="text-md font-medium text-gray-600 text-right">- ${randomQuote.category}</p>
    `;
}

// --- Function to Create and Set up the Add Quote Form/Mechanism ---
/**
 * Dynamically creates an "Add Quote" button and appends it to the DOM.
 * This button, when clicked, will take the value from quoteInput and add it
 * as a new quote to the 'quotes' array.
 */
function createAddQuoteForm() {
    // Check if the add button already exists to prevent duplication
    if (!addQuoteBtn) {
        addQuoteBtn = document.createElement('button');
        addQuoteBtn.textContent = 'Add This Quote';
        // Add some basic styling using Tailwind CSS classes for better appearance
        addQuoteBtn.classList.add('ml-2', 'px-4', 'py-2', 'bg-green-500', 'text-white', 'rounded-md', 'hover:bg-green-600', 'transition', 'duration-200');

        // Insert the new button right after the quote input field
        quoteInput.parentNode.insertBefore(addQuoteBtn, showNewQuoteBtn.nextSibling);

        // Add event listener to the dynamically created 'Add This Quote' button
        addQuoteBtn.addEventListener('click', () => {
            const newQuoteText = quoteInput.value.trim(); // Get input value and remove leading/trailing whitespace

            if (newQuoteText) { // Check if the input is not empty
                // For simplicity, we'll assign a default category for dynamically added quotes.
                // In a more complex app, you might add another input for category.
                quotes.push({ text: newQuoteText, category: "User Added" });
                quoteInput.value = ''; // Clear the input field after adding

                // Optional: Show a new random quote immediately after adding one
                showRandomQuote();
                alert('Quote added successfully!'); // Simple confirmation
            } else {
                alert('Please enter a quote to add.'); // Alert if input is empty
            }
        });
    }
}

// --- Event Listeners and Initial Setup ---
// Wait for the entire DOM content to be loaded before running JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Apply some basic Tailwind styling to the existing HTML elements for a better look
    document.body.classList.add('flex', 'flex-col', 'items-center', 'justify-center', 'min-h-screen', 'bg-gray-100', 'font-sans', 'p-4');
    document.querySelector('h1').classList.add('text-4xl', 'font-bold', 'text-gray-800', 'mb-8');
    quoteDisplay.classList.add('bg-white', 'p-6', 'rounded-lg', 'shadow-md', 'mb-6', 'w-full', 'max-w-md', 'text-center');
    quoteInput.classList.add('p-3', 'border', 'border-gray-300', 'rounded-md', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500', 'flex-grow');
    showNewQuoteBtn.classList.add('px-6', 'py-3', 'bg-blue-600', 'text-white', 'rounded-md', 'hover:bg-blue-700', 'transition', 'duration-200', 'shadow-md', 'ml-4');
    document.querySelector('div').classList.add('flex', 'items-center', 'justify-center', 'w-full', 'max-w-md', 'mb-8');


    // Call the function to set up the form/add mechanism
    createAddQuoteForm();

    // Display an initial random quote when the page first loads
    showRandomQuote();

    // Add event listener to the "Show New Quote" button
    showNewQuoteBtn.addEventListener('click', showRandomQuote);
});
