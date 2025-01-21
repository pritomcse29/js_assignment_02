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
            container.innerHTML = "";
            if (data.drinks) {
                showData(data.drinks);
            } else {
                container.innerHTML = `<p>No products found for "${query}".</p>`;
            }
        })
        .catch((error) => console.error("Error fetching products:", error));
};

document.getElementById("search-btn").addEventListener("click", () => {
    const inputText = document.getElementById("input-text").value.trim();
    if (inputText) {
        getAllProducts(inputText);
        document.getElementById("input-text").value = ""; 
    } else {
        alert("Please enter some text.");
    }
});
const showData = (data) => {
    console.log(data);
    const container = document.getElementById("card-container");
    container.innerHTML = ""; 
    data.forEach((drink) => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `
            <img class="card-img" src="${drink.strDrinkThumb || 'fallback-image.jpg'}" onclick="singleProduct('${drink.idDrink}')">
            <h5>${drink.strDrink}</h5>
            <p>${drink.strInstructions?.slice(0, 30)}......</p>
            <button onclick="singleProduct('${drink.idDrink}')">Details</button>
            <button onclick="handleCart('${drink.strDrink}', '${drink.strDrinkThumb}', 10)">Add To Cart</button>
        `;
        container.appendChild(div);
    });
};

let serial = 1; 

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

    serial++; 
    updatePrice();
};

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

const singleProduct = (id) => {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then((res) => res.json())
        .then((data) => {
            const product = data.drinks[0]; 
            console.log("Product details fetched: ", product);

            document.getElementById("productModalLabel").innerText = product.strDrink;
            document.getElementById("modal-product-image").src = product.strDrinkThumb;
            document.getElementById("modal-product-image").alt = product.strCategory;
            document.getElementById("modal-product-description").innerText = product.strAlcoholic;
            document.getElementById("modal-product-price").innerText = `Price: $10.00`;
            document.getElementById("modal-description").innerText = product.strInstructions; 
            // ${drink.strInstructions?.slice(0, 30)}
            const modal = new bootstrap.Modal(document.getElementById("productModal"));
            modal.show();
        })
        .catch((error) => console.error("Error fetching product details:", error));
};

getAllProducts();
