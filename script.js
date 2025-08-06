document.addEventListener("DOMContentLoaded", () => {
  const productData = [
    { id: 1, name: "Tie-Dye Lounge Set", price: 150.0, image: "../marmetotask/assets/product1.jpg" },
    { id: 2, name: "Sunburst Tracksuit", price: 150.0, image: "../marmetotask/assets/product2.jpg" },
    { id: 3, name: "Retro Red Streetwear", price: 150.0, image: "../marmetotask/assets/product3.jpg" },
    { id: 4, name: "Urban Sportwear Combo", price: 150.0, image: "../marmetotask/assets/product4.jpg" },
    { id: 5, name: "Oversized Knit & Coat", price: 150.0, image: "../marmetotask/assets/product5.jpg" },
    { id: 6, name: "Chic Monochrome Blazer", price: 150.0, image: "../marmetotask/assets/product6.jpg" },
  ];
  const productGrid=document.querySelector(".product-grid");
  const bundleItemsContainer=document.querySelector(".bundle-items");
  const discountAmount=document.getElementById("discount-amount");
  const subtotalAmount=document.getElementById("subtotal-amount");
  const addToCartButton=document.getElementById("add-to-cart-button");
  const noItemsMessage=document.querySelector(".no-items-message");

  const bundle={};
  const DISCOUNT_PERCENTAGE=0.3;
  const MIN_ITEMS_FOR_DISCOUNT=1;

  function getIconSVG(name){
    switch (name) {
      case "plus":
        return `<svg xmlns="../marmetotask/assets/Icons/Plus.svg" class="icon icon-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
      case "check":
        return `<svg xmlns="../marmetotask/assets/Icons/CaretRight.svg" class="icon icon-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      case "minus":
        return `<svg xmlns="../marmetotask/assets/Icons/Check.svg" class="icon icon-minus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
      default:
        return "";
    }
  }

  function renderProductCards(){
    productGrid.innerHTML="";
    productData.forEach((product)=>{
      const productCard=document.createElement("div");
      productCard.classList.add("product-card");
      productCard.setAttribute("data-product-id",product.id);

      const isAdd=bundle[product.id]>0;
      const buttonClass=isAdd?"added":"";
      const buttonText=isAdd?"Added to Bundle":"Add to Bundle";
      const buttonIcon=isAdd?getIconSVG("check"):getIconSVG("plus");

      productCard.innerHTML=`
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
      <h3>${product.name}</h3>
      <p>$${product.price.toFixed(2)}</p>
      <button class="add-to-bundle-button ${buttonClass}" data-product-id="${product.id}">
      
      <span class="button-text">${buttonText}</span>
      <span class="button-icon">${buttonIcon}
      <span></button>
      </div>

      `;
      productGrid.appendChild(productCard);
    })
      document.querySelectorAll(".add-to-bundle-button").forEach((button)=>{
        button.addEventListener("click",(event)=>{
          const productId=event.currentTarget.dataset.productId;
          toggleBundleItem(productId);
        });
      });
    }
    function toggleBundleItem(productId){
      if(bundle[productId]){
        delete bundle[productId];
      }
      else{
        bundle[productId]=1;
      }
      updateUI();
    }
    
    function updateUIBundleItemQuantity(productId,change){
      if(bundle[productId]){
        bundle[productId]+=change;
        if(bundle[productId]<=0){
          delete bundle[productId];
        }
      }
      updateUI();
    }

    function updateBundleSummary() {
  let totalItems = 0;
  let subtotal = 0;
  const DISCOUNT_THRESHOLD = 3;

  bundleItemsContainer.innerHTML = "";
  const currentBundleProductIds = Object.keys(bundle);

  if (currentBundleProductIds.length === 0) {
    noItemsMessage.style.display = "block";
  } else {
    noItemsMessage.style.display = "none";
    currentBundleProductIds.forEach((productId) => {
      const product = productData.find((p) => p.id == productId);
      if (product) {
        const quantity = bundle[productId];
        totalItems += quantity;
        subtotal += product.price * quantity;

        const bundleItemDiv = document.createElement("div");
        bundleItemDiv.classList.add("bundle-item");
        bundleItemDiv.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <div class="bundle-item-details">
            <h4>${product.name}</h4>
            <p>$${product.price.toFixed(2)}</p>
          </div>
          <div class="bundle-item-quantity">
            <button class="quantity-button minus-button" data-product-id="${product.id}">${getIconSVG("minus")}</button>
            <span class="quantity-display">${quantity}</span>
            <button class="quantity-button plus-button" data-product-id="${product.id}">${getIconSVG("plus")}</button>
          </div>
        `;
        bundleItemsContainer.appendChild(bundleItemDiv);
      }
    });
  }

 
  let discount = totalItems >= DISCOUNT_THRESHOLD ? subtotal * DISCOUNT_PERCENTAGE : 0;
  let finalSubtotal = subtotal - discount;

  discountAmount.textContent = `-$${discount.toFixed(2)}`;
  subtotalAmount.textContent = `$${finalSubtotal.toFixed(2)}`;

 
  if (totalItems >= DISCOUNT_THRESHOLD) {
    addToCartButton.disabled = false;
    addToCartButton.textContent = `Add 3 Items to Cart`;
    addToCartButton.classList.remove("disabled");
  } else {
    addToCartButton.disabled = true;
    addToCartButton.textContent = `Add 3 Items to Proceed`;
    addToCartButton.classList.add("disabled");
  }

  // Quantity buttons
  document.querySelectorAll(".quantity-button.minus-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = event.currentTarget.dataset.productId;
      updateUIBundleItemQuantity(productId, -1); // should be -1
    });
  });

  document.querySelectorAll(".quantity-button.plus-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = event.currentTarget.dataset.productId;
      updateUIBundleItemQuantity(productId, 1);
    });
  });
}

  function updateUI(){
    renderProductCards();
    updateBundleSummary();
  }
  updateUI();
  addToCartButton.addEventListener("click", () => {
  const totalItems = Object.values(bundle).reduce((sum, qty) => sum + qty, 0);

  if (totalItems >= MIN_ITEMS_FOR_DISCOUNT) {
    addToCartButton.textContent = "✔ Added to Cart";
    addToCartButton.disabled = true;
    addToCartButton.classList.add("disabled");

  
  }
});

});
  