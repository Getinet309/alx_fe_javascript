let quotes = [];
        // Variable to store the currently active filter category
        let currentFilterCategory = 'all';

        // Get DOM elements that exist initially
        const quoteDisplay = document.getElementById('quoteDisplay'); // Added: Reference to the quote-display div
        const quoteTextElement = document.getElementById('quoteText');
        const quoteCategoryElement = document.getElementById('quoteCategory');
        const newQuoteButton = document.getElementById('newQuote');
        const exportQuotesButton = document.getElementById('exportQuotesButton');
        const messageDisplay = document.getElementById('messageDisplay');
        const formContainer = document.getElementById('formContainer');
        const categoryFilter = document.getElementById('categoryFilter'); // New: Category Filter dropdown

        // Variables for dynamically created elements (will be assigned in createAddQuoteForm)
        let newQuoteText;
        let newQuoteCategory;
        let addQuoteButton;


        // --- Helper Functions ---

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
         */
        function loadQuotes() {
            try {
                const storedQuotes = localStorage.getItem('quotes');
                if (storedQuotes) {
                    quotes = JSON.parse(storedQuotes);
                    console.log('Quotes loaded from local storage.');
                } else {
                    console.log('No quotes found in local storage. Using default.');
                    // If no quotes in local storage, use a default set
                    quotes = [
                        { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
                        { text: "Strive not to be a success, but rather to be of value.", category: "Motivation" },
                        { text: "The mind is everything. What you think you become.", category: "Philosophy" },
                        { text: "Innovation distinguishes between a leader and a follower.", category: "Business" },
                        { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" }
                    ];
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
                const newQuote = { text, category };
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
                    const importedQuotes = JSON.parse(e.target.result);

                    // Basic validation for imported data structure
                    if (!Array.isArray(importedQuotes) || !importedQuotes.every(q => q.text && q.category)) {
                        displayMessage("Invalid JSON file format. Expected an array of quote objects with 'text' and 'category'.", "error");
                        return;
                    }

                    quotes.push(...importedQuotes);
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
            const selectedCategory = categoryFilter.value; // Added: local variable to get the current selected category
            currentFilterCategory = selectedCategory; // Update the global active filter based on the selection
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

        // --- Event Listeners and Initial Load ---

        // Event listener for the "Show New Quote" button
        newQuoteButton.addEventListener('click', showRandomQuote);

        // Event listener for the "Export Quotes" button
        exportQuotesButton.addEventListener('click', exportQuotes);

        // Initial setup when the page loads
        window.onload = () => {
            loadQuotes();         // 1. Load quotes from local storage
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
                        quoteTextElement.innerHTML = `<strong>"${quoteObj.text}"</strong>`;
                        quoteCategoryElement.innerHTML = `<em>- ${quoteObj.category} (Last viewed in this session)</em>`;
                        displayMessage("Resuming last viewed quote from session.", "info");
                    } else {
                        // If session quote doesn't match filter, show a random filtered one
                        showRandomQuote();
                    }
                } else {
                    showRandomQuote(); // If no last viewed, or no quotes in filter, show a random filtered one
                }
            } catch (e) {
                console.error('Error retrieving last viewed quote from session storage:', e);
                sessionStorage.removeItem('lastViewedQuote'); // Clear potentially bad data
                showRandomQuote(); // Show a random one if session data is bad
                }
            };
