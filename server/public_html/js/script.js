// Author: Sam Tucker
// Purpose: This file contains all client side javascript

// Base URL for API requests
const apiBaseUrl = '/api/accounts';
let accountName;
console.log("Starting script.js");

// Function to fetch the account balance and update the display
async function updateBalanceDisplay() {
    try {
        const response = await fetch(`/api/accounts/${accountName}`);
        if (response.ok) {
            const accountData = await response.json();
            const balanceDisplay = document.getElementById('balanceDisplay');
            balanceDisplay.textContent = `Your Balance: $${accountData.availableMoney}`;
        } else {
            console.error('Error fetching account balance');
        }
    } catch (error) {
        console.error('Error fetching balance:', error);
    }
}

// Function to handle login or account creation
async function handleAccountInput(event) {
    if (event.key === 'Enter') {
        event.preventDefault();

        accountName = document.getElementById('accountInput').value.trim();
        document.getElementById('accountInput').value = accountName;

        if (!accountName) {
            alert('Please enter an account name.');
            return;
        }

        try {
            // Check if the account exists
            let response = await fetch(apiBaseUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uniqueName: accountName })
            });

            if (response.status === 200) { // account already exists
                alert(`Welcome back, ${accountName}!`);
            } else if (response.status === 201) { // account does not exist yet
                alert(`Account created! Welcome, ${accountName}!`);
            } else {
                throw new Error('Unexpected error during login.');
            }

            const links = document.querySelectorAll('.button');
            links.forEach(link => {
                const url = new URL(link.href);
                url.searchParams.set('acc', accountName);
                link.href = url.toString();
            });

        } catch (error) {
            console.error('Error handling account input:', error);
            alert('An error occurred. Please try again.');
        }

        document.getElementById('accountInput').value = '';
    }
}

// adds the amount of money input from the user into their account
async function handleAddMoneyInput(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        let deposit = parseInt(document.getElementById('addMoneyInput').value);

        try {
            const response = await fetch(`/api/accounts/${accountName}/money`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ deposit }),
            });
        } catch (error) {
            console.error('Error adding money:', error);
            alert('An error occurred. Please try again.');
        }

        document.getElementById('addMoneyInput').value = '';
        updateBalanceDisplay();
    } else if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete') {
        event.preventDefault();
    }
}

// Prevents the user from leaving the home page without logging in
function preventLinkDefault(event) {
    if (!accountName) {
        event.preventDefault();
        alert('Log in or sign up to continue');
    }
}

async function preventCartLink(event) {
    try {
        // Fetch cart from the API
        const response = await fetch(`/api/carts/${accountName}`);
        if (!response.ok) {
            throw new Error('Failed to fetch cart');
        }
        const userCart = await response.json();
        alert(userCart.items.length);

        const cartButton = document.getElementById('cartButton');

        // Disable the cart button if the cart is empty
        if (userCart.items.length === 0) {
            cartButton.disabled = true;
            alert('Must have items in your cart to open the cart page. Add items to your cart on the shop page.');
        } else {
            cartButton.disabled = false;
        }
    } catch (error) {
        console.error('Error processing cart link:', error);
    }
}


async function handlePost(event) {
    // Select the form
    const form = document.getElementById('itemForm');

    // Create a FormData object from the form
    const formData = new FormData(form);

    // Convert FormData to JSON manually
    const jsonData = {
        nameInput: formData.get('nameInput'),
        priceInput: formData.get('priceInput'),
        descInput: formData.get('descInput'),
        seller: accountName // Add the seller field dynamically from accountName
    };

    // Send JSON data to the server using fetch
    try {
        const response = await fetch('/api/items/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData), // JSON-encoded form data
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result);
            alert('Item created successfully! Returning Home.');
            window.location.href = `index.html?acc=${accountName}`;
        } else {
            const error = await response.json();
            alert('Failed to create item: ' + error.message);
        }
    } catch (err) {
        console.error('Error submitting form:', err);
        alert('An unexpected error occurred.');
    }
}

async function loadShopItems() {
    console.log("Starting to load shop items");
    try {
        // Fetch items from the API
        const response = await fetch('/api/items');
        if (!response.ok) {
            throw new Error('Failed to fetch items');
        }
        const items = await response.json();

        // Selects the content section of shop.html
        const shopContent = document.getElementById('shopContent');
        if (!shopContent) {
            console.error('Shop content section not found!');
            return;
        }

        // Clear the content before appending new items
        shopContent.innerHTML = '';

        // Populate the content section with items
        items.forEach(item => {
            // Skip items where the seller matches the accountName
            if (item.seller === accountName) {
                console.log(`Skipping item '${item.name}' because the seller is the current user.`);
                return;
            }

            // Skip reserved items
            if (item.inCart) {
                console.log(`Skipping item '${item.name}' because the item is reserved in a cart`);
                return;
            }

            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';

            // Add item details
            itemDiv.innerHTML = `
                <div class="row" id="name">Item: ${item.name}</div>
                <div class="row" id="price">Price: $${item.price}</div>
                <div class="row" id="seller">Seller: ${item.seller}</div>
                <div class="row" id="description">Description: ${item.description}</div>
                <button class="row" id="addToCart">Add to Cart</button>
            `;

            // Add "Add to Cart" button functionality
            const addToCartButton = itemDiv.querySelector('#addToCart');
            addToCartButton.addEventListener('click', () => addToCart(item));

            // Append the item to the shop content section
            shopContent.appendChild(itemDiv);
        });
    } catch (error) {
        console.error('Error loading shop items:', error);
    }
    console.log("loadShopItems() Complete");
}

async function loadCartItems() {
    console.log("Starting to load cart items");
    try {
        // Fetch cart from the API
        const response = await fetch(`/api/carts/${accountName}`);
        if (!response.ok) {
            throw new Error('Failed to fetch cart');
        }
        const userCart = await response.json();

        // Selects the content section of cart.html
        const cartContent = document.getElementById('cartContent');
        if (!cartContent) {
            console.error('Cart content section not found!');
            return;
        }

        // Clear the content before appending new items
        cartContent.innerHTML = '';

        let cartStocked = false;
        // Populate the content section with items
        for (const itemId of userCart.items) {
            cartStocked = true;
            // Fetch the item with the ID from the API
            const itemResponse = await fetch(`/api/items/${itemId}`);
            if (!itemResponse.ok) {
                console.error(`Failed to fetch item with ID: ${itemId}`);
                continue; // Skip to the next item if fetch fails
            }
            const item = await itemResponse.json();

            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';

            // Add item details
            itemDiv.innerHTML = `
                <div class="row" id="name">Item: ${item.name}</div>
                <div class="row" id="price">Price: $${item.price}</div>
                <div class="row" id="seller">Seller: ${item.seller}</div>
                <div class="row" id="description">Description: ${item.description}</div>
                <button class="row" id="removeFromCart">Remove From Cart</button>
            `;

            // Add "Remove From Cart" button functionality
            const removeFromCartButton = itemDiv.querySelector('#removeFromCart');
            removeFromCartButton.addEventListener('click', () => removeFromCart(item));

            // Append the item to the cart content section
            cartContent.appendChild(itemDiv);
        }

        if (cartStocked) {
            // Create the "Buy All" button
            const buyButton = document.createElement('button');
            buyButton.id = 'buy';
            buyButton.textContent = 'Buy All';
            buyButton.addEventListener('click', () => buyItems(userCart));
            cartContent.appendChild(buyButton);
        }

    } catch (error) {
        console.error('Error loading cart items:', error);
    }
    console.log("loadCartItems() Complete");
}

async function buyItems(userCart) {
    console.log(`Starting to purchase items from ${accountName}'s cart`);

    try {
        // Find the total price of all items in the cart
        let totalPrice = 0;
        for (const itemId of userCart.items) {
            // Fetch the item with the ID from the API
            const itemResponse = await fetch(`/api/items/${itemId}`);
            if (!itemResponse.ok) {
                console.error(`Failed to fetch item with ID: ${itemId}`);
                continue; // Skip to the next item if fetch fails
            }
            const item = await itemResponse.json();
            totalPrice += item.price;
        }

        // Find user balance
        const response = await fetch(`/api/accounts/${accountName}`);
        if (!response.ok) {
            throw new Error('Failed to fetch account balance');
        }
        const accountData = await response.json();

        // Process purchase
        if (totalPrice <= accountData.availableMoney) {
            for (const itemId of userCart.items) {
                // Fetch the item details again
                const itemResponse = await fetch(`/api/items/${itemId}`);
                if (!itemResponse.ok) {
                    console.error(`Failed to fetch item with ID: ${itemId} for transaction`);
                    continue; // Skip to the next item if fetch fails
                }
                const item = await itemResponse.json();

                // Add price of item to seller's account
                await fetch(`/api/accounts/${item.seller}/money`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ deposit: item.price }),
                });

                // Subtract the price of the item from the user's available money
                await fetch(`/api/accounts/${accountName}/money`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ deposit: -item.price }),
                });

                // Send the PUT request to remove the single item from the cart
                const response = await fetch(`/api/carts/${accountName}/remove`, {
                    method: 'PUT', // HTTP method
                    headers: {
                        'Content-Type': 'application/json', // We're sending JSON data
                    },
                    body: JSON.stringify({ itemId: itemId }), // Single itemId to remove
                });

                // Delete the item from the database
                await fetch(`/api/items/${itemId}`, {
                    method: 'DELETE',
                });

                console.log(`Transaction for item ${itemId} completed successfully`);
            }

            // Redirect to index page
            alert('Transaction Successful. Returning Home.');
            window.location.href = `index.html?acc=${accountName}`;
        } else {
            alert('You cannot afford all the items in your cart. Remove items or deposit more money into your account on the Add Money page.');
        }
    } catch (error) {
        console.error('An error occurred during the purchase process:', error);
        alert('An error occurred while processing your purchase. Please try again.');
    }
}


async function removeFromCart(item) {
    console.log(`Removing ${item.name} from the cart.`);
    try {
        // Send the PUT request to remove the single item from the cart
        const response = await fetch(`/api/carts/${accountName}/remove`, {
            method: 'PUT', // HTTP method
            headers: {
                'Content-Type': 'application/json', // We're sending JSON data
            },
            body: JSON.stringify({ itemId: item.id }), // Single itemId to remove
        });

        // Check if the response is successful
        if (response.ok) {
            const updateItemResponse = await fetch(`/api/items/${item.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inCart: false }), // Set the item's inCart status to true
            });

            if (!updateItemResponse.ok) {
                throw new Error('Error updating item status');
            }

            const updatedCart = await response.json(); // Get the updated cart data
            console.log('Item removed successfully:', updatedCart);
            // Update the UI to reflect the cart changes
            loadCartItems();
        } else {
            console.error('Failed to remove item from cart:', response.statusText);
        }
    } catch (error) {
        console.error('Error during PUT request:', error);
    }
    console.log('removeFromCart(item) complete')
}

async function addToCart(item) {
    console.log(`Adding ${item.name} to the cart.`);
    try {
        const curItemResponse = await fetch(`/api/items/${item.id}`);
        if (!curItemResponse.ok) {
            throw new Error(`Failed to fetch item with ID: ${item.id}`);
        }
        const curItem = await curItemResponse.json();

        if (curItem.inCart) {
            alert('This item has already been added to a cart')
            throw new Error('Item already in another cart');
        }

        // Fetch the current user's cart
        const cartResponse = await fetch(`/api/carts/${accountName}`);
        if (!cartResponse.ok) {
            throw new Error(`Unable to fetch cart for account: ${accountName}`);
        }

        const cartData = await cartResponse.json();

        // Add the item to the cart
        const addResponse = await fetch(`/api/carts/${accountName}/add`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: [item.id] }), // Add the item ID to the cart
        });

        if (!addResponse.ok) {
            throw new Error('Error adding item to cart');
        }

        // Mark the item as reserved in the inventory
        const updateItemResponse = await fetch(`/api/items/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ inCart: true }), // Set the item's inCart status to true
        });

        if (!updateItemResponse.ok) {
            throw new Error('Error updating item status');
        }

        // Refresh the shop items to reflect the updated state
        loadShopItems();
        alert(`${item.name} has been added to your cart.`);
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add the item to the cart. Please try again.');
    }
}

// Attach event listener when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded");

    // Set accountName from url
    const urlParams = new URLSearchParams(window.location.search);
    accountName = urlParams.get('acc');

    // Set buttons' acc value to cur acc value
    const links = document.querySelectorAll('.button');
    links.forEach(link => {
        const url = new URL(link.href);
        url.searchParams.set('acc', accountName);
        link.href = url.toString();
    });

    const homeLinks = document.querySelectorAll('.homeLink');
    homeLinks.forEach(link => {
        const url = new URL(link.href);
        url.searchParams.set('acc', accountName);
        link.href = url.toString();
    });

    // Start updating balance immediately and periodically
    updateBalanceDisplay();  // Initial load
    setInterval(updateBalanceDisplay, 5000);  // Update every 5 seconds

    let accInput = document.getElementById('accountInput');
    if (accInput) {
        accInput.addEventListener('keydown', handleAccountInput);
    }

    let addMoneyInput = document.getElementById('addMoneyInput');
    if (addMoneyInput) {
        addMoneyInput.addEventListener('keydown', handleAddMoneyInput);
    }

    // Add event listeners to all buttons
    const buttons = document.querySelectorAll('.button');
    buttons.forEach(link => {
        link.addEventListener('click', preventLinkDefault);
    });
    try {
        const cartButton = document.getElementById('cartButton');
        cartButton.addEventListener('click', preventCartLink)
        console.log("cartButton event listener set")
    } catch (error) {
        console.error('Error fetching cartButton:', error);
    }

    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        submitButton.addEventListener('click', handlePost);
    }

    loadShopItems();
    loadCartItems();
    setInterval(loadShopItems, 5000);
});
