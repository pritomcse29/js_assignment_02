// // let getAllProducts = () =>{
// // fetch("https://fakestoreapi.com/products")
// // .then((res) => res.json())
// // .then((data)=>{
    
// //     displayProducts(data);
// //     // console.log(data);
// // });
// // }


// // document.getElementById('search-btn').addEventListener('click',(event)=>{
// //     const inputText = document.getElementById('input-text').value ;
// //     console.log(inputText)
// //     const displayProducts =(userData)=>{
// //         const comment = document.getElementById('comment-box');
// //         userData.forEach (user =>{
// //             const div = document.createElement('div');
// //             div.classList.add('card')
// //             div.innerHTML=`
// //                <p>${user.title.slice(0,20)}</p>
// //                <h3>${user.price}</h3>
// //                <button>Details</button>
// //                <button onclick="handleCart('${user.title?.slice(0,15)}','${user?.price}')">Add To Cart</button>
// //             `;
// //             comment.appendChild(div);
// //         });
        
// //     }

// //     document.getElementById('inputText').value='';
// // })

// // // const displayProducts =(userData)=>{
// // //     const comment = document.getElementById('comment-box');
// // //     userData.forEach (user =>{
// // //         const div = document.createElement('div');
// // //         div.classList.add('card')
// // //         div.innerHTML=`
// // //            <p>${user.title.slice(0,20)}</p>
// // //            <h3>${user.price}</h3>
// // //            <button>Details</button>
// // //            <button onclick="handleCart('${user.title?.slice(0,15)}','${user?.price}')">Add To Cart</button>
// // //         `;
// // //         comment.appendChild(div);
// // //     });
    
// // // }

// // const handleCart=(name,price)=>{
// //     const container = document.getElementById('cart-main-container');
// //     console.log(name,price);
// //     const div = document.createElement('div');
// //     div.innerHTML=`
// //       <p>Name:${name}</p>
// //       <h3>Price:${price}</h3>
// //       <hr>
// //     `;
// //     container.appendChild(div);
// // }

// // // document.getElementById('search-btn').addEventListener('click',(event)=>{
// // //     const inputText = document.getElementById('input-text').value ;
// // //     console.log(inputText)
// // //     // const container = document.getElementById('comment-space');
// // //     // const p = document.createElement('p');
// // //     // p.innerText = inputText;
// // //     // // console.log(p);
// // //     // container.appendChild(p);

// // //     document.getElementById('inputText').value='';
// // // })
// // getAllProducts();

let allProducts = []; 
let getAllProducts = () => {
    fetch("https://fakestoreapi.com/products")
        .then((res) => res.json())
        .then((data) => {
            allProducts = data; 
            displayProducts(data);
        })
        .catch((error) => console.error("Error fetching products:", error));
};

const displayProducts = (userData) => {
    const comment = document.getElementById("comment-box");
    comment.innerHTML = ""; 
    userData.forEach((user) => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `
           <img class="card-img" src="${user.image}">
           <p>${user.title.slice(0, 20)}</p>
           <h3>${user.price}</h3>
           <button onclick="singleProduct('${user.id}')">Details</button>
           <button onclick="handleCart('${user.title?.slice(0, 15)}', '${user?.price}')">Add To Cart</button>
        `;
        comment.appendChild(div);
    });
};

document.getElementById("search-btn").addEventListener("click", () => {
    const inputText = document.getElementById("input-text").value.trim().toLowerCase();
    if (!inputText) { 
        alert("Please enter a search term.");
        return;
    }
    const filteredProducts = allProducts.filter((product) =>
        product.title.toLowerCase().includes(inputText)
    );
    if (filteredProducts.length > 0) 
        {
        displayProducts(filteredProducts);
    } 
    else 
    {
        document.getElementById("comment-box").innerHTML = `<p>No products found.</p>`;
    }
    document.getElementById("input-text").value = "";
});

const handleCart = (name, price) => {
    const cartCount = document.getElementById('count').innerText;
    let convertedCount = parseFloat(cartCount);
    convertedCount = convertedCount + 1;
        
    if(convertedCount>7){
        alert("You can not add cart more than 7 more products");
        return;
    }
    document.getElementById("count").innerText = convertedCount;
    console.log(convertedCount);
        const container = document.getElementById("cart-main-container");
        const div = document.createElement("div");
        div.innerHTML = `
          <p>Name: ${name}</p>
          <h3 class="card-price">${price}</h3>
          <hr>
        `;
        container.appendChild(div);
        updatePrice();

};

const updatePrice = ()=>{
    const allPrice = document.getElementsByClassName('card-price');
    console.log(allPrice);
    let count = 0;
    for(const element of allPrice){
      count = count + parseFloat(element.innerText);
    }
    console.log(count);
    document.getElementById("updateTotal").innerText = count.toFixed(2);
};

// const singleProduct=(id)=>{
//     // console.log(id)
//     fetch(`https://fakestoreapi.com/products/${id}`)
//     .then(res=>res.json())
//     .then(json=>console.log(json));

// }

const singleProduct = (id) => {
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => res.json())
      .then((product) => {
        console.log("Product details fetched: ", product);
  
        // Get modal elements
        const modalTitle = document.getElementById("productModalLabel");
        const modalImage = document.getElementById("modal-product-image");
        const modalDescription = document.getElementById("modal-product-description");
        const modalPrice = document.getElementById("modal-product-price");
  
        // Update modal content
        modalTitle.innerText = product.title;
        modalImage.src = product.image;
        modalImage.alt = product.title;
        modalDescription.innerText = product.description;
        modalPrice.innerText = `Price: ${product.price}`;
  
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById("productModal"));
        modal.show();
      })
      .catch((error) => console.error("Error fetching product details:", error));
  };
  



getAllProducts();


