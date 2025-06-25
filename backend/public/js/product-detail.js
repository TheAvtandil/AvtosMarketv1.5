
document.addEventListener('DOMContentLoaded', async () => {
  const productDetailEl = document.getElementById('product-detail');
  const similarProductsEl = document.getElementById('similar-products');
  const productId = window.location.pathname.split('/').pop();

  
  let product;
  try {
    const res = await fetch(`/api/products/${productId}`);
    product = await res.json();

    
    const imageUrl = (product.images && product.images.length > 0) ? product.images[0] : '/images/placeholder.jpg';
    
    const currency = product.currency === 'GEL' ? '₾' : '$';

    productDetailEl.innerHTML = `
      <div class="product-detail-card">
        <div class="product-image">
          <img src="${imageUrl}" alt="${product.title}">
        </div>
        <div class="product-info">
          <h1>${product.title}</h1>
          <p class="product-price"><i class="fas fa-tag"></i> ${currency}${product.price !== undefined && product.price !== null ? product.price.toLocaleString() : 'Price not available'}</p>
          <p class="product-description">${product.description}</p>
          <p class="product-meta">
            <span><i class="fas fa-layer-group"></i> ${product.category}</span>
            <span><i class="fas fa-calendar-alt"></i> ${new Date(product.createdAt).toLocaleDateString()}</span>
            <span><i class="fas fa-map-marker-alt"></i> ${product.location || 'N/A'}</span>
          </p>
          <div class="contact-info">
            <h3>Contact Seller</h3>
            <p><i class="fas fa-phone"></i> ${product.contact || 'N/A'}</p>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    productDetailEl.innerHTML = `<div class="error-message">Failed to load product details.</div>`;
    return;
  }

  
  try {
    if (!product || !product.category) throw new Error('No category');
    const res = await fetch(`/api/products?category=${encodeURIComponent(product.category)}`);
    let products = await res.json();

    
    products = products.filter(prod => prod._id !== productId);

    if (products.length === 0) {
      similarProductsEl.innerHTML = `<p>No similar products found.</p>`;
    } else {
      similarProductsEl.innerHTML = products.map(prod => {
        const simImage = (prod.images && prod.images.length > 0) ? prod.images[0] : '/images/placeholder.jpg';
        const simCurrency = prod.currency === 'GEL' ? '₾' : '$';
        return `
          <div class="product-card">
            <a href="/product/${prod._id}">
              <img src="${simImage}" alt="${prod.title}">
              <div class="product-card-info">
                <h4>${prod.title}</h4>
                <p class="product-price">${simCurrency}${prod.price}</p>
              </div>
            </a>
          </div>
        `;
      }).join('');
    }
  } catch (err) {
    similarProductsEl.innerHTML = `<div class="error-message">Failed to load similar products.</div>`;
  }


  const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', async () => {
            
            const productId = window.location.pathname.split('/').pop();
            const res = await fetch(`/api/products/${productId}`);
            const product = await res.json();

            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existing = cart.find(item => item._id === product._id);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            alert('Added to cart!');
            
            updateCartCount();
        });
    }

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCount = document.getElementById('cart-count');
        if (cartCount) cartCount.textContent = count;
    }
    updateCartCount();

});

