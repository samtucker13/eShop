# eShop

eShop is a model digital marketplace where users can make an account, manage their digital wallet, post items they want to sell, and shop.

## Live Demo
http://64.227.5.127:3000

## Tech Stack
- **Frontend:** HTML / CSS / JavaScript
- **Backend:** Node.js, Express (REST API)
- **Database:** MongoDB (Mongoose)
- **Deployment:** DigitalOcean Droplet

## Usage
When opening the website, you will automatically be brought to the homepage, index.html. Use the "Enter Account Name" input in index.html to create, switch, and log into accounts. To give it the username you type hit enter. If the username you gave it is in the database, you will be signed into it. Otherwise it will create the account, then sign you in. Navigate to any other page by clicking its button in index.html You can always return to index.html by clicking the text "eShop" at the top of the page.

Navigate to addMoney.html via the button in index.html labeled "Add Money" to deposit money into your account. Enter the number of dollars you would like to add to your account in the text area and hit enter to submit.

Navigate to shop.html via the button in index.html labeled "Shop" to browse the marketplace. Click the add to cart button to add the item to your cart. Having an item in your cart reserves it and prevents other users from putting it in their cart.

Navigate to cart.html via the button in index.html labeled "Cart" to view and purchase the items in your cart. Click the Remove From Cart button to remove an item from your cart and send it back into the marketplace. To purchase the items in your cart, hit the Buy All button at the bottom of the page. You may need to scroll.

Navigate to post.html via the button in index.html labeled "Post" to post an item you would like to sell. Fill each text area based on what the label next to it says. Click the Post button to post the item after all item details have been given. 
