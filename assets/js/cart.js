document.addEventListener('DOMContentLoaded', function() {
  loadCartItems();
  initCartFunctionality();
});

function loadCartItems() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItemsContainer = document.getElementById('cartItems');
  const emptyCart = document.getElementById('emptyCart');
  const checkoutBtn = document.getElementById('checkoutBtn');
  
  if (cart.length === 0) {
    if (emptyCart) emptyCart.style.display = 'block';
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }
  
  if (emptyCart) emptyCart.style.display = 'none';
  if (checkoutBtn) checkoutBtn.disabled = false;
  
  if (cartItemsContainer) {
    cartItemsContainer.innerHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      
      const itemElement = document.createElement('div');
      itemElement.className = 'cart-item';
      itemElement.innerHTML = `
        <div class="cart-item-img">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p>₹${item.price.toLocaleString()}</p>
          <div class="quantity-control">
            <button class="minus" data-id="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button class="plus" data-id="${item.id}">+</button>
          </div>
        </div>
        <div class="cart-item-total">
          <p>₹${itemTotal.toLocaleString()}</p>
          <button class="remove-btn" data-id="${item.id}">Remove</button>
        </div>
      `;
      
      cartItemsContainer.appendChild(itemElement);
    });
    
    updateCartSummary(subtotal);
  }
}

function initCartFunctionality() {
  document.addEventListener('click', function(e) {
    if (e.target.closest('.minus')) {
      const button = e.target.closest('.minus');
      const productId = button.getAttribute('data-id');
      updateCartItemQuantity(productId, false);
    }
    
    if (e.target.closest('.plus')) {
      const button = e.target.closest('.plus');
      const productId = button.getAttribute('data-id');
      updateCartItemQuantity(productId, true);
    }
    
    if (e.target.closest('.remove-btn')) {
      const button = e.target.closest('.remove-btn');
      const productId = button.getAttribute('data-id');
      removeCartItem(productId);
    }
    
    if (e.target.closest('.add-to-cart')) {
      const button = e.target.closest('.add-to-cart');
      const productId = button.getAttribute('data-id');
      addToCart(productId);
    }
    
    if (e.target.closest('#checkoutBtn')) {
      e.preventDefault();
      alert('Proceeding to checkout. In a real app, this would redirect to the checkout page.');
    }
  });
}

function updateCartItemQuantity(productId, isPlus) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const itemIndex = cart.findIndex(item => item.id == productId);
  
  if (itemIndex !== -1) {
    if (isPlus) {
      cart[itemIndex].quantity += 1;
    } else {
      if (cart[itemIndex].quantity > 1) {
        cart[itemIndex].quantity -= 1;
      } else {
        cart.splice(itemIndex, 1);
      }
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
    updateCartCount();
  }
}

function removeCartItem(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(item => item.id != productId);
  
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCartItems();
  updateCartCount();
}

function updateCartSummary(subtotal) {
  const subtotalElement = document.getElementById('subtotal');
  const totalElement = document.getElementById('total');
  
  if (subtotalElement) {
    subtotalElement.textContent = `₹${subtotal.toLocaleString()}`;
  }
  
  if (totalElement) {
    totalElement.textContent = `₹${subtotal.toLocaleString()}`;
  }
}

function addToCart(productId) {
  const product = {
    id: productId,
    name: `Product ${productId}`,
    price: Math.floor(Math.random() * 1000) + 500,
    quantity: 1,
    image: `assets/images/products/product${Math.floor(Math.random() * 6) + 1}.jpg`
  };
  
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push(product);
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  
  const cartCount = document.querySelector('.cart-count');
  if (cartCount) {
    cartCount.classList.add('update');
    setTimeout(() => {
      cartCount.classList.remove('update');
    }, 300);
  }
  
  if (document.getElementById('cartItems')) {
    loadCartItems();
  }
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  document.querySelectorAll('.cart-count').forEach(element => {
    element.textContent = totalItems;
  });
}