// Fetch and display all products
let getAllProducts = (query = "margarita") => {
    if (!query) {
        return;
    }
    console.log(query);

    const apiUrl = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`;
    fetch(apiUrl)
        .then((r) => r.json())
        .then((data) => {
            const container = document.getElementById("card-container");
            container.innerHTML = ""; // Clear container
            if (data.drinks) {
                showData(data.drinks);
            } else {
                container.innerHTML = `<p>No products found for "${query}".</p>`;
            }
        })
        .catch((error) => console.error("Error fetching products:", error));
};

// Event listener for search button
document.getElementById("search-btn").addEventListener("click", () => {
    const inputText = document.getElementById("input-text").value.trim();
    if (inputText) {
        getAllProducts(inputText);
        document.getElementById("input-text").value = ""; // Clear input field
    } else {
        alert("Please enter some text.");
    }
});

// Function to display data
const showData = (data) => {
    console.log(data);
    const container = document.getElementById("card-container");
    container.innerHTML = ""; // Clear container
    data.forEach((drink) => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `
            <img class="card-img" src="${drink.strDrinkThumb || 'fallback-image.jpg'}" onclick="singleProduct('${drink.idDrink}')">
            <h5>${drink.strDrink}</h5>
            <button onclick="singleProduct('${drink.idDrink}')">Details</button>
            <button onclick="handleCart('${drink.strDrink}', '${drink.strDrinkThumb}', 10)">Add To Cart</button>
        `;
        container.appendChild(div);
    });
};

let serial = 1; // Global serial number tracker

const handleCart = (name, image, price) => {
    if (!name || !price) {
        console.error("Invalid product details");
        return;
    }
    const cartCount = document.getElementById('count').innerText;
    let convertedCount = parseFloat(cartCount);
    convertedCount += 1;

    const CART_LIMIT = 7;
    if (convertedCount > CART_LIMIT) {
        alert(`You can only add up to ${CART_LIMIT} products to the cart.`);
        return;
    }
    document.getElementById("count").innerText = convertedCount;
    const cartContainer = document.getElementById("cart-main-container");
    const cartRow = document.createElement("div");

    cartRow.style.display = "flex";
    cartRow.style.alignItems = "center";
    cartRow.style.justifyContent = "space-between";
    cartRow.style.padding = "5px 0";
    cartRow.style.borderBottom = "1px solid #ddd";

    cartRow.innerHTML = `
        <p style="width: 10%; text-align: center;">${serial}</p>
        <img src="${image}" alt="${name}" style="width: 50px; height: 50px; object-fit: cover;">
        <p style="width: 40%; margin-left: 10px;">${name}</p>
        <p style="width: 20%; text-align: right;" class="card-price">${price}</p>
    `;

    cartContainer.appendChild(cartRow);

    serial++; // Increment serial number
    updatePrice();
};

// const handleCart = (name, image, price) => {
//     if (!name || !price) {
//         console.error("Invalid product details");
//         return;
//     }
//     const cartCount = document.getElementById('count').innerText;
//     let convertedCount = parseFloat(cartCount);
//     convertedCount += 1;

//     const CART_LIMIT = 7;
//     if (convertedCount > CART_LIMIT) {
//         alert(`You can only add up to ${CART_LIMIT} products to the cart.`);
//         return;
//     }

//     document.getElementById("count").innerText = convertedCount;
//     const container = document.getElementById("cart-main-container");
//     const div = document.createElement("div");
//     div.innerHTML = `
//         <p class="name">${convertedCount} | ${name}</p>
//         <img class="card-img" src="${image}" alt="${name}">
//         <hr>
//     `;
//     container.appendChild(div);
//     updatePrice();
// };

// Function to update total price
const updatePrice = () => {
    const allPrice = document.getElementsByClassName('card-price');
    let total = 0;
    for (const element of allPrice) {
        const price = parseFloat(element.innerText);
        if (!isNaN(price)) {
            total += price;
        }
    }
    document.getElementById("updateTotal").innerText = total.toFixed(2);
};

// Display single product details in a modal
const singleProduct = (id) => {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then((res) => res.json())
        .then((data) => {
            const product = data.drinks[0]; // Get the first item
            console.log("Product details fetched: ", product);

            // Update modal elements
            document.getElementById("productModalLabel").innerText = product.strDrink;
            document.getElementById("modal-product-image").src = product.strDrinkThumb;
            document.getElementById("modal-product-image").alt = product.strCategory;
            document.getElementById("modal-product-description").innerText = product.strAlcoholic;
            document.getElementById("modal-product-price").innerText = `Price: $10.00`;

            // Show modal using Bootstrap's API
            const modal = new bootstrap.Modal(document.getElementById("productModal"));
            modal.show();
        })
        .catch((error) => console.error("Error fetching product details:", error));
};

// Fetch default data when the page loads
getAllProducts();
