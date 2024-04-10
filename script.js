document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const feedbackTextArea = document.getElementById("feedbackText");
    const submitFeedbackBtn = document.getElementById("submitFeedback");

    searchInput.addEventListener("input", searchProducts);
    submitFeedbackBtn.addEventListener("click", submitFeedback);

    // Fetch products and display initially
    fetchProducts();

    function fetchProducts() {
        fetch("http://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline")
            .then(response => response.json())
            .then(data => {
                displayProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }

    function searchProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        fetch("http://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline")
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