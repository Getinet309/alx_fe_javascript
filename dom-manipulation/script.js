// Array to store quote objects (master list)
let quotes = [];
// Variable to store the currently active filter category
let currentFilterCategory = 'all';

// Simple ID counter for new quotes added locally
let localQuoteIdCounter = 0;


// Get DOM elements that exist initially
const quoteDisplay = document.getElementById('quoteDisplay');
const quoteTextElement = document.getElementById('quoteText');
const quoteCategoryElement = document.getElementById('quoteCategory');
const newQuoteButton = document.getElementById('newQuote');
const exportQuotesButton = document.getElementById('exportQuotesButton');
const messageDisplay = document.getElementById('messageDisplay');
const formContainer = document.getElementById('formContainer');
const categoryFilter = document.getElementById('categoryFilter');
const syncButton = document.getElementById('syncButton'); // Get the sync button
const importFileInput = document.getElementById('importFile'); // Assuming an input type="file" with id="importFile"


// Variables for dynamically created elements (will be assigned in createAddQuoteForm)
let newQuoteText;
let newQuoteCategory;
let addQuoteButton;


// --- Helper Functions ---

/**
 * @function generateLocalUniqueId
 * @description Generates a simple unique ID for locally created quotes.
 * Ensures IDs don't clash with potential server IDs (e.g., from JSONPlaceholder).
 * @returns {string} A unique ID prefixed for local origin.
 */
function generateLocalUniqueId() {
    return `local_${Date.now()}_${localQuoteIdCounter++}`;
}

/**
 * @function saveQuotes
 * @description Saves the current 'quotes' array to local storage.
 */
function saveQuotes() {
    try {
        localStorage.setItem('quotes', JSON.stringify(quotes));
        console.log('Quotes saved to local storage.');
    } catch (e) {
        console.error('Error saving quotes to local storage:', e);
        displayMessage('Error saving quotes to local storage.', 'error');
    }
}

/**
 * @function loadQuotes
 * @description Loads quotes from local storage when the application initializes.
 * Assigns local IDs to existing quotes if they don't have one, ensuring they're distinguishable.
 */
function loadQuotes() {
    try {
        const storedQuotes = localStorage.getItem('quotes');
        if (storedQuotes) {
            quotes = JSON.parse(storedQuotes);
            // Ensure all loaded quotes have an 'id' for syncing, or assign a local one
            quotes.forEach(quote => {
                if (!quote.id) {
                    quote.id = generateLocalUniqueId();
                }
            });
            console.log('Quotes loaded from local storage.');
        } else {
            console.log('No quotes found in local storage. Using default.');
            // If no quotes in local storage, use a default set and assign local IDs
            quotes = [
                { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
                { text: "Strive not to be a success, but rather to be of value.", category: "Motivation" },
                { text: "The mind is everything. What you think you become.", category: "Philosophy" },
                { text: "Innovation distinguishes between a leader and a follower.", category: "Business" },
                { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" }
            ].map(q => ({...q, id: generateLocalUniqueId()})); // Add local IDs to defaults
            saveQuotes(); // Save these default quotes
        }
    } catch (e) {
        console.error('Error loading quotes from local storage:', e);
        displayMessage('Error loading quotes from local storage. Data might be corrupted.', 'error');
        quotes = []; // Reset quotes to prevent errors
    }
}

/**
 * @function getFilteredQuotes
 * @description Returns an array of quotes filtered by the currentFilterCategory.
 * @returns {Array<Object>} - An array of filtered quote objects.
 */
function getFilteredQuotes() {
    if (currentFilterCategory === 'all') {
        return quotes;
    }
    return quotes.filter(quote => quote.category === currentFilterCategory);
}

/**
 * @function showRandomQuote
 * @description Displays a random quote from the *filtered* quotes array on the page.
 * If the filtered quotes array is empty, it displays a message.
 * Uses innerHTML to apply basic styling to the quote and category.
 * Also saves the last viewed quote to session storage.
 */
function showRandomQuote() {
    const filteredQuotes = getFilteredQuotes();

    if (filteredQuotes.length === 0) {
        quoteTextElement.textContent = `No quotes found for category "${currentFilterCategory}". Add some or change filter!`;
        quoteCategoryElement.textContent = "";
        sessionStorage.removeItem('lastViewedQuote'); // Clear session storage if no quotes
        return;
    }
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];

    quoteTextElement.innerHTML = `<strong>"${randomQuote.text}"</strong>`;
    quoteCategoryElement.innerHTML = `<em>- ${randomQuote.category}</em>`;

    // Save last viewed quote to session storage
    try {
        sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
        console.log('Last viewed quote saved to session storage.');
    } catch (e) {
        console.error('Error saving last viewed quote to session storage:', e);
    }
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
    if (!newQuoteText || !newQuoteCategory) {
        displayMessage("Form elements not found. Please reload or check setup.", "error");
        return;
    }

    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    if (text && category) {
        const newQuote = { id: generateLocalUniqueId(), text, category }; // Assign local ID to new quote
        quotes.push(newQuote);
        saveQuotes(); // Save to local storage after adding
        populateCategories(); // Update categories dropdown if new category
        newQuoteText.value = '';
        newQuoteCategory.value = '';

        displayMessage("Quote added successfully! 🎉", "success");
        // After adding, re-apply the filter and show a new random quote
        filterQuotes(false); // Pass false to avoid saving filter again, just re-apply
    } else {
        displayMessage("<strong>Error:</strong> Please enter both quote text and category.", "error");
    }
}

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

    const formDiv = document.createElement('div');
    formDiv.id = 'addQuoteForm';
    formDiv.className = 'quote-form flex flex-col gap-4 p-6 bg-white rounded-xl shadow-md max-w-2xl w-full';

    // Create Quote Text Input
    newQuoteText = document.createElement('input');
    newQuoteText.type = 'text';
    newQuoteText.id = 'newQuoteText';
    newQuoteText.placeholder = 'Enter new quote text';
    newQuoteText.className = 'form-input p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500';

    // Create Quote Category Input
    newQuoteCategory = document.createElement('input');
    newQuoteCategory.type = 'text';
    newQuoteCategory.id = 'newQuoteCategory';
    newQuoteCategory.placeholder = 'Enter quote category';
    newQuoteCategory.className = 'form-input p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500';

    // Create Add Quote Button
    addQuoteButton = document.createElement('button');
    addQuoteButton.id = 'addQuoteButton';
    addQuoteButton.textContent = 'Add New Quote';
    addQuoteButton.className = 'button primary-button mt-4 w-full'; // Full width button

    formDiv.appendChild(newQuoteText);
    formDiv.appendChild(newQuoteCategory);
    formDiv.appendChild(addQuoteButton);

    formContainer.appendChild(formDiv);

    // Attach event listener to the dynamically created button
    addQuoteButton.addEventListener('click', addQuote);

    console.log("Add Quote Form created and appended.");
}

/**
 * @function exportQuotes
 * @description Exports the current 'quotes' array as a JSON file.
 */
function exportQuotes() {
    if (quotes.length === 0) {
        displayMessage("No quotes to export!", "info");
        return;
    }
    try {
        const dataStr = JSON.stringify(quotes, null, 2); // null, 2 for pretty printing
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotes.json'; // Suggested file name
        document.body.appendChild(a); // Append to body to make it clickable
        a.click(); // Programmatically click the link
        document.body.removeChild(a); // Clean up
        URL.revokeObjectURL(url); // Release the object URL

        displayMessage("Quotes exported successfully!", "success");
        console.log("Quotes exported to quotes.json");
    } catch (e) {
        console.error('Error exporting quotes:', e);
        displayMessage('Error exporting quotes.', 'error');
    }
}

/**
 * @function importFromJsonFile
 * @description Reads a JSON file uploaded by the user and imports quotes.
 * @param {Event} event - The file input change event.
 */
function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) {
        displayMessage("No file selected for import.", "info");
        return;
    }
    if (file.type !== 'application/json') {
        displayMessage("Please select a valid JSON file.", "error");
        return;
    }

    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        try {
            let importedQuotes = JSON.parse(e.target.result);

            // Basic validation for imported data structure
            if (!Array.isArray(importedQuotes) || !importedQuotes.every(q => q.text && q.category)) {
                displayMessage("Invalid JSON file format. Expected an array of quote objects with 'text' and 'category'.", "error");
                return;
            }

            // Assign local IDs to imported quotes if they don't have one, to distinguish from server IDs
            importedQuotes.forEach(q => {
                if (!q.id) {
                    q.id = generateLocalUniqueId();
                }
            });

            // Merge imported quotes with existing local quotes
            const merged = new Map();
            quotes.forEach(q => merged.set(q.id, q)); // Add existing local quotes
            importedQuotes.forEach(q => merged.set(q.id, q)); // Overwrite with imported if IDs match, add new

            quotes = Array.from(merged.values()); // Convert map back to array

            saveQuotes(); // Save to local storage after importing
            populateCategories(); // Update categories dropdown
            displayMessage('Quotes imported successfully! 🎉', 'success');
            filterQuotes(); // Re-apply current filter and show a new quote
            event.target.value = ''; // Clear the file input
        } catch (error) {
            console.error('Error parsing JSON file:', error);
            displayMessage('Error importing quotes. Invalid JSON file.', 'error');
            event.target.value = ''; // Clear the file input
        }
    };
    fileReader.onerror = function() {
        console.error('Error reading file:', fileReader.error);
        displayMessage('Error reading file.', 'error');
    };
    fileReader.readAsText(file);
}

/**
 * @function populateCategories
 * @description Extracts unique categories from the 'quotes' array and populates the categoryFilter dropdown.
 */
function populateCategories() {
    // Get unique categories
    const categories = ['all', ...new Set(quotes.map(quote => quote.category))];

    // Clear existing options
    categoryFilter.innerHTML = '';

    // Add options to the dropdown
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category === 'all' ? 'All Categories' : category;
        categoryFilter.appendChild(option);
    });

    // Set the dropdown to the currently active filter, if it exists
    categoryFilter.value = currentFilterCategory;
    // If the currentFilterCategory is no longer available (e.g., all quotes from that category were removed),
    // reset to 'all'.
    if (!categories.includes(currentFilterCategory)) {
        currentFilterCategory = 'all';
        categoryFilter.value = 'all';
        saveFilterPreference(); // Save the reset filter
    }
}

/**
 * @function filterQuotes
 * @description Filters the displayed quotes based on the selected category from the dropdown.
 * @param {boolean} [save=true] - Whether to save the filter preference to local storage.
 * Used to prevent double-saving when called from addQuote.
 */
function filterQuotes(save = true) {
    const selectedCategory = categoryFilter.value;
    currentFilterCategory = selectedCategory;
    if (save) {
        saveFilterPreference();
    }
    showRandomQuote(); // Show a new random quote from the filtered list
}

/**
 * @function saveFilterPreference
 * @description Saves the current filter category to local storage.
 */
function saveFilterPreference() {
    try {
        localStorage.setItem('lastSelectedCategory', currentFilterCategory);
        console.log('Filter preference saved:', currentFilterCategory);
    } catch (e) {
        console.error('Error saving filter preference:', e);
    }
}

/**
 * @function loadFilterPreference
 * @description Loads the last selected filter category from local storage.
 */
function loadFilterPreference() {
    try {
        const storedFilter = localStorage.getItem('lastSelectedCategory');
        // Ensure the stored filter category is still valid (exists in current quotes)
        if (storedFilter && ['all', ...new Set(quotes.map(q => q.category))].includes(storedFilter)) {
            currentFilterCategory = storedFilter;
        } else {
            currentFilterCategory = 'all'; // Default if none or invalid
        }
    } catch (e) {
        console.error('Error loading filter preference:', e);
        currentFilterCategory = 'all';
    }
}

// --- Server Interaction Functions ---

/**
 * @function fetchQuotesFromServer
 * @description Fetches quote-like data from JSONPlaceholder API.
 * Maps JSONPlaceholder 'posts' to local quote format.
 * @returns {Promise<Array<Object>>} A promise that resolves with the fetched and mapped quotes.
 */
async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            headers: {
                'Accept': 'application/json', // Inform the server we prefer JSON
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Map JSONPlaceholder posts (id, title, body) to our quote format (id, text, category)
        // Add a 'server_' prefix to IDs to distinguish them from local ones for merging
        const serverQuotesData = data.map(post => ({
            id: `server_${post.id}`, // Prefix server IDs
            text: post.title,
            category: post.body.substring(0, 20) + '...' // Use part of body as category, or 'Server'
        }));
        console.log('Data fetched from JSONPlaceholder:', serverQuotesData);
        return serverQuotesData;
    } catch (error) {
        console.error('Failed to fetch quotes from JSONPlaceholder:', error);
        displayMessage('Failed to fetch data from server. Check console for details.', 'error');
        return []; // Return empty array on error
    }
}

/**
 * @function pushNewLocalQuotesToServer
 * @description Simulates pushing newly created local quotes to a server.
 * For JSONPlaceholder, this means creating a new 'post' for each.
 * @param {Array<Object>} newLocalQuotes - Quotes generated locally that need to be sent to the server.
 * @returns {Promise<void>} A promise that resolves when all pushes are simulated.
 */
async function pushNewLocalQuotesToServer(newLocalQuotes) {
    const pushPromises = newLocalQuotes.map(async (quote) => {
        try {
            // JSONPlaceholder's /posts endpoint creates new resources.
            // A real backend would handle updates/sync for existing IDs.
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                body: JSON.stringify({
                    title: quote.text,
                    body: quote.category,
                    userId: 1, // Dummy userId for JSONPlaceholder
                }),
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8', // Crucial: Inform server we're sending JSON
                    'Accept': 'application/json', // Inform the server we prefer JSON in return
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log(`Successfully "pushed" local quote to server (new ID: ${result.id}):`, quote);
            // In a real app, you would update the local quote's ID with the server-assigned ID here
            // For this simulation, we're just acknowledging the push.
        } catch (error) {
            console.error(`Failed to push local quote to server:`, quote, error);
            // Don't display individual push errors to avoid spamming messages, console log instead.
        }
    });
    await Promise.allSettled(pushPromises); // Wait for all push operations to complete
}

/**
 * @function syncWithServer
 * @description Syncs local quotes with server data, resolving conflicts with server precedence.
 */
async function syncWithServer() {
    displayMessage("Syncing with server...", "info");
    try {
        const serverData = await fetchQuotesFromServer();
        console.log('Server data fetched:', serverData);

        let mergedQuotesMap = new Map();
        let initialLocalQuotesIds = new Set(quotes.map(q => q.id)); // IDs of quotes before sync

        // Pass 1: Add server data to map. Server wins existing IDs.
        serverData.forEach(sQuote => {
            mergedQuotesMap.set(sQuote.id, {...sQuote}); // Deep copy to ensure server version is pristine
        });

        let newLocalQuotesToPush = [];
        // Pass 2: Merge local data.
        quotes.forEach(lQuote => {
            // If a local quote's ID does NOT exist on the server (i.e., it's a 'local_' ID), it's a local-only quote.
            // If a local quote's ID starts with 'server_', it means it was originally from the server
            // or was a local quote that was successfully pushed and received a server ID.
            // If we find a local quote with a 'local_' ID, it needs to be pushed.
            // If a local quote's ID starts with 'server_' and it's also in the serverData,
            // the server's version would have been added in Pass 1, overwriting any local changes.
            // This implicitly implements the "server wins" for existing IDs.
            if (lQuote.id.startsWith('local_') || !mergedQuotesMap.has(lQuote.id)) {
                // If it's a truly new local quote or a local quote with a local_ ID that hasn't been pushed
                mergedQuotesMap.set(lQuote.id, {...lQuote}); // Add local-only quote to merged data
                if (lQuote.id.startsWith('local_')) { // Only push local_ IDs
                    newLocalQuotesToPush.push(lQuote);
                }
            }
        });

        // Convert map back to array for our main 'quotes' variable
        const newQuotesArray = Array.from(mergedQuotesMap.values());

        // Calculate changes for message display
        let quotesAddedFromServer = 0;
        let quotesUpdatedFromServer = 0;
        const currentLocalQuotesMap = new Map(quotes.map(q => [q.id, q]));

        serverData.forEach(sQuote => {
            const localQuote = currentLocalQuotesMap.get(sQuote.id);
            if (!localQuote) {
                // This is a new quote from the server that wasn't locally present before sync
                quotesAddedFromServer++;
            } else if (localQuote.text !== sQuote.text || localQuote.category !== sQuote.category) {
                // This quote exists locally and on server, and server version is different
                quotesUpdatedFromServer++;
            }
        });

        quotes = newQuotesArray; // Update local quotes with merged data
        saveQuotes(); // Save the new merged data to local storage

        // Simulate pushing new local items to server
        await pushNewLocalQuotesToServer(newLocalQuotesToPush);

        populateCategories(); // Refresh categories based on new quotes
        filterQuotes(); // Re-apply filter and show new random quote

        let message = `Sync complete! `;
        if (quotesAddedFromServer > 0) message += `${quotesAddedFromServer} new quotes added from server. `;
        if (quotesUpdatedFromServer > 0) message += `${quotesUpdatedFromServer} quotes updated from server (server wins). `;
        if (newLocalQuotesToPush.length > 0) message += `${newLocalQuotesToPush.length} local quotes uploaded to server. `;
        if (quotesAddedFromServer === 0 && quotesUpdatedFromServer === 0 && newLocalQuotesToPush.length === 0) {
            message += `No changes detected.`;
        }
        displayMessage(message, "success");
        console.log('Local quotes after sync:', quotes);

    } catch (error) {
        console.error('Sync failed:', error);
        displayMessage('Sync failed. Please try again.', 'error');
    }
}


// --- Event Listeners and Initial Load ---

// Event listener for the "Show New Quote" button
newQuoteButton.addEventListener('click', showRandomQuote);

// Event listener for the "Export Quotes" button
exportQuotesButton.addEventListener('click', exportQuotes);

// Event listener for the "Sync with Server" button
syncButton.addEventListener('click', syncWithServer);

// Event listener for category filter change
categoryFilter.addEventListener('change', () => filterQuotes(true)); // Ensure save is true for filter changes

// Event listener for importing quotes (assuming you have an input type="file" with id="importFile")
if (importFileInput) {
    importFileInput.addEventListener('change', importFromJsonFile);
}

// Initial setup when the page loads
window.onload = () => {
    loadQuotes();       // 1. Load quotes from local storage
    loadFilterPreference(); // 2. Load last selected filter
    populateCategories(); // 3. Populate category dropdown based on loaded quotes
    createAddQuoteForm(); // 4. Dynamically create the add quote form

    // 5. Check session storage for last viewed quote or show a filtered random one
    try {
        const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
        const filteredQuotesCount = getFilteredQuotes().length;

        if (lastViewedQuote && filteredQuotesCount > 0) {
            const quoteObj = JSON.parse(lastViewedQuote);
            // Only display session quote if its category matches the current filter
            if (currentFilterCategory === 'all' || quoteObj.category === currentFilterCategory) {
                // Verify the quote still exists in the current 'quotes' array
                const existsInCurrentQuotes = quotes.some(q => q.id === quoteObj.id && q.text === quoteObj.text && q.category === quoteObj.category);
                if (existsInCurrentQuotes) {
                    quoteTextElement.innerHTML = `<strong>"${quoteObj.text}"</strong>`;
                    quoteCategoryElement.innerHTML = `<em>- ${quoteObj.category} (Last viewed in this session)</em>`;
                    displayMessage("Resuming last viewed quote from session.", "info");
                } else {
                    showRandomQuote(); // If session quote is no longer valid, show a new random one
                }
            } else {
                showRandomQuote(); // If session quote doesn't match filter, show a random filtered one
            }
        } else {
            showRandomQuote(); // If no last viewed, or no quotes in filter, show a random filtered one
        }
    } catch (e) {
        console.error('Error retrieving last viewed quote from session storage:', e);
        sessionStorage.removeItem('lastViewedQuote'); // Clear potentially bad data
        showRandomQuote(); // Show a random one if session data is bad
    }
    // Optional: Start periodic sync after initial load (e.g., every 30 seconds)
    // Uncomment the line below to enable automatic syncing
    // setInterval(syncWithServer, 30000);
};
