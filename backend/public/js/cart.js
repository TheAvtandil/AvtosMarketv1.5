

function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    const cart = getCart();
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
        document.getElementById('cart-total').textContent = '';
        return;
    }
    let total = 0;
    cartItemsDiv.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="cart-item">
                <span>${item.title}</span>
                <span>Qty: ${item.quantity}</span>
                <span>Price: $${item.price}</span>
                <button onclick="removeFromCart('${item._id}')">Remove</button>
            </div>
        `;
    }).join('');
    document.getElementById('cart-total').textContent = `Total: $${total.toFixed(2)}`;
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item._id !== productId);
    setCart(cart);
    renderCart();
}

document.addEventListener('DOMContentLoaded', renderCart);



document.addEventListener('DOMContentLoaded', function() {
  const cartItemsDiv = document.getElementById('cart-items');
  const cartTotalAmount = document.getElementById('cart-total-amount');
  const cartEmptyDiv = document.getElementById('cart-empty');

  let cart = JSON.parse(localStorage.getItem('cart') || '[]');

  function renderCart() {
    cartItemsDiv.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
      cartEmptyDiv.style.display = 'block';
      cartTotalAmount.textContent = '₾0';
      return;
    } else {
      cartEmptyDiv.style.display = 'none';
    }

    cart.forEach(item => {
      const currency = item.currency === 'GEL' ? '₾' : '$';
      total += item.price * item.quantity;

      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <img src="${item.images && item.images[0] ? item.images[0] : '/images/placeholder.jpg'}" class="cart-item-image" alt="${item.title}">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-meta">${item.location || ''}</div>
          <div class="cart-item-quantity">
            <button class="decrease-qty">-</button>
            <span>${item.quantity}</span>
            <button class="increase-qty">+</button>
          </div>
          <div class="cart-item-price">${currency}${(item.price * item.quantity).toLocaleString()}</div>
        </div>
        <button class="cart-item-remove"><i class="fas fa-trash"></i></button>
      `;

      
      div.querySelector('.decrease-qty').onclick = () => updateQuantity(item._id, -1);
      div.querySelector('.increase-qty').onclick = () => updateQuantity(item._id, 1);
      div.querySelector('.cart-item-remove').onclick = () => removeItem(item._id);

      cartItemsDiv.appendChild(div);
    });

    cartTotalAmount.textContent = `₾${total.toLocaleString()}`;
  }

  function updateQuantity(id, delta) {
    const idx = cart.findIndex(i => i._id === id);
    if (idx !== -1) {
      cart[idx].quantity += delta;
      if (cart[idx].quantity < 1) cart[idx].quantity = 1;
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
    }
  }

  function removeItem(id) {
    cart = cart.filter(i => i._id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
  }

  renderCart();
});

document.addEventListener('DOMContentLoaded', function() {
    
    const cartList = document.getElementById('cart-items-list');
    if (!cartList) return;

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cartList.innerHTML = '';

    if (cart.length === 0) {
        cartList.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty.</p>
            </div>
        `;
        document.getElementById('cart-summary').innerHTML = '';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        const currency = item.currency === 'GEL' ? '₾' : '$';
        total += (item.price || 0) * (item.quantity || 1);

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.images && item.images[0] ? item.images[0] : '/images/placeholder.jpg'}" class="cart-item-image" alt="${item.title}">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-meta">${currency}${item.price} x ${item.quantity}</div>
            </div>
            <button class="cart-item-remove" data-id="${item._id}"><i class="fas fa-trash"></i></button>
        `;
        cartList.appendChild(div);
    });

    
    document.getElementById('cart-summary').innerHTML = `
        <div><strong>Total:</strong> $${total.toLocaleString()}</div>
        <button class="checkout-btn">Checkout</button>
    `;

    
    cartList.addEventListener('click', function(e) {
        if (e.target.closest('.cart-item-remove')) {
            const id = e.target.closest('.cart-item-remove').getAttribute('data-id');
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            cart = cart.filter(item => item._id !== id);
            localStorage.setItem('cart', JSON.stringify(cart));
            location.reload();
        }
    });
});



document.addEventListener('DOMContentLoaded', function() {
    const cartList = document.getElementById('cart-items-list');
    const cartSummary = document.getElementById('cart-summary');
    if (!cartList) return;

    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cartList.innerHTML = '';

    if (cart.length === 0) {
        cartList.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty.</p>
            </div>
        `;
        cartSummary.innerHTML = '';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        const currency = item.currency === 'GEL' ? '₾' : '$';
        total += (item.price || 0) * (item.quantity || 1);

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.images && item.images[0] ? item.images[0] : '/images/placeholder.jpg'}" class="cart-item-image" alt="${item.title}">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-meta">${currency}${item.price} x ${item.quantity}</div>
            </div>
            <button class="cart-item-remove" data-id="${item._id}" title="Remove from cart">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartList.appendChild(div);
    });

    
    cartSummary.innerHTML = `
        <div><strong>Total:</strong> $${total.toLocaleString()}</div>
        <button class="checkout-btn">Checkout</button>
    `;

    
    cartList.addEventListener('click', function(e) {
        if (e.target.closest('.cart-item-remove')) {
            const id = e.target.closest('.cart-item-remove').getAttribute('data-id');
            cart = cart.filter(item => item._id !== id);
            localStorage.setItem('cart', JSON.stringify(cart));
            
            if (typeof updateCartCount === 'function') updateCartCount();
            
            renderCart();
        }
    });

    
    cartSummary.addEventListener('click', function(e) {
        if (e.target.classList.contains('checkout-btn')) {
            showNotification('Checkout is in development mode. No real transaction will occur.');
        }
    });

    
    function renderCart() {
        
        location.reload();
    }

    
    function showNotification(message) {
        let notif = document.createElement('div');
        notif.className = 'cart-notification';
        notif.textContent = message;
        document.body.appendChild(notif);
        setTimeout(() => {
            notif.classList.add('show');
        }, 10);
        setTimeout(() => {
            notif.classList.remove('show');
            setTimeout(() => notif.remove(), 300);
        }, 2000);
    }
});


document.addEventListener('DOMContentLoaded', function() {
    
    const cartItemsList = document.getElementById('cart-items-list');
    const cartSummary = document.getElementById('cart-summary');
    if (!cartItemsList) return;

    
    renderCart();

    
    cartItemsList.addEventListener('click', (e) => {
        if (e.target.closest('.cart-item-remove')) {
            const id = e.target.closest('.cart-item').dataset.id;
            removeItemFromCart(id);
        }
    });

    
    function removeItemFromCart(productId) {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart = cart.filter(item => item._id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        
        
        if (typeof updateCartCount === 'function') {
            updateCartCount();
        }
        
        
        renderCart();
    }

    
    function renderCart() {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cartItemsList.innerHTML = '';

        if (cart.length === 0) {
            cartItemsList.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty.</p>
                </div>
            `;
            cartSummary.innerHTML = '';
            return;
        }

        let total = 0;
        cart.forEach(item => {
            const currency = item.currency === 'GEL' ? '₾' : '$';
            total += (item.price || 0) * (item.quantity || 1);

            const div = document.createElement('div');
            div.className = 'cart-item';
            div.dataset.id = item._id;
            div.innerHTML = `
                <img src="${item.images && item.images[0] ? item.images[0] : '/images/placeholder.jpg'}" class="cart-item-image" alt="${item.title}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-meta">${currency}${item.price} × ${item.quantity}</div>
                </div>
                <button class="cart-item-remove" title="Remove from cart">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItemsList.appendChild(div);
        });

        
        cartSummary.innerHTML = `
            <div class="cart-total"><strong>Total:</strong> $${total.toLocaleString()}</div>
            <button class="checkout-btn">Checkout</button>
        `;
    }
});
