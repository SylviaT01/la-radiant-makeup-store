document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const feedbackTextArea = document.getElementById("feedbackText");
    const submitFeedbackBtn = document.getElementById("submitFeedback");

    searchInput.addEventListener("input", searchProducts);
    submitFeedbackBtn.addEventListener("click", submitFeedback);

    // Fetch products and display initially
    fetchProducts();

    function fetchProducts() {
        fetch("https://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline")
            .then(response => response.json())
            .then(data => {
                displayProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }

    function searchProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        fetch("https://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline")
            .then(response => response.json())
            .then(data => {
                const filteredProducts = data.filter(product => product.name.toLowerCase().includes(searchTerm));
                displayProducts(filteredProducts);
            })
            .catch(error => console.error('Error fetching products:', error));
    }

    function displayProducts(products) {
        const productList = document.getElementById("product-list");
        productList.innerHTML = ''; // Clear existing products
        products.forEach(product => {
            const productItem = document.createElement("div");
            productItem.innerHTML = `
                <h3>${product.name}</h3>
                <img src="${product.image_link}" alt="${product.name}">
                <p>Brand: ${product.brand}</p>
                <p>Price: ${product.price} USD</p>
                <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
            `;
            productList.appendChild(productItem);
        });
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', addToCart);
        });
    }

    let cartItems = [];

    // Function to add a product to the cart
    function addToCart(event) {
        // Get the product ID from the button's data attribute
        const productId = event.target.dataset.productId;
        // Add the product ID to the cart
        cartItems.push(productId);
        updateCart();
        alert(`Product with ID ${productId} added to cart.`);
    }


    function updateCart() {
        const cartBadge = document.getElementById('cart-badge');
        if (cartBadge) {
            cartBadge.textContent = cartItems.length;
        }
    }

    // Function to handle click event on the cart button
    document.getElementById('cartBtn').addEventListener('click', showCart);

    // Function to display the products in the cart
    function showCart() {
        // Check if there are any products in the cart
        if (cartItems.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        // Fetch the products from the Makeup API based on the product IDs in the cartItems array
        const productIds = cartItems.join(',');
        const apiUrl = `https://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline&product_id=${productIds}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // Filter the products to include only those in the cart
                const cartProducts = data.filter(product => cartItems.includes(product.id.toString()));

                // Display the products in the cart
                if (cartProducts.length === 0) {
                    alert("No products found in your cart.");
                } else {
                    // Clear previous content
                    document.getElementById('product-info').innerHTML = '';

                    // Populate modal with product information
                    cartProducts.forEach(product => {
                        const productContainer = document.createElement('div');
                        productContainer.innerHTML = `
                        <div class="product-item">
                        <img src="${product.image_link}" alt="${product.name}" style="max-width: 100px; max-height: 100px;">
                        <p>Name: ${product.name}</p>
                        <p>Brand: ${product.brand}</p>
                        <p>Price: ${product.price}USD</p>
                        <button class="remove-btn">Remove</button>
                        </div>
                    `;
                        document.getElementById('product-info').appendChild(productContainer);
                    });

                    document.getElementById('product-info').addEventListener('click', function (event) {
                        if (event.target && event.target.classList.contains('remove-btn')) {
                            // Find the index of the product container
                            const productItem = event.target.closest('.product-item');
                            const index = Array.from(productItem.parentNode.children).indexOf(productItem);
                            removeProductFromCart(index);
                        }
                    });
                    // Display modal
                    const modal = document.getElementById("myModal");
                    modal.style.display = "block";

                    // Close modal when the close button is clicked
                    const closeButton = document.getElementsByClassName("close")[0];
                    closeButton.onclick = function () {
                        modal.style.display = "none";
                    }

                    // Close modal when clicked outside of the modal
                    window.onclick = function (event) {
                        if (event.target == modal) {
                            modal.style.display = "none";
                        }
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                alert("Error fetching products. Please try again later.");
            });
    }

    // Function to remove a product from the cart
    function removeProductFromCart(index) {
        cartItems.splice(index, 1);
        updateCart();
        showCart(); // Re-render the cart modal
    }

    function submitFeedback() {
        const feedbackText = feedbackTextArea.value.trim();
        if (feedbackText !== '') {
            alert("Feedback submitted successfully");
            feedbackTextArea.value = ''; // Clear textarea after submission
        } else {
            alert('Please enter your feedback.');
        }
    }
})