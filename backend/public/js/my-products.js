

document.addEventListener('DOMContentLoaded', function() {
  
  if (!document.getElementById('my-products-list')) return;

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const productsList = document.getElementById('my-products-list');
  const messageDiv = document.getElementById('my-products-message');
  const loadingDiv = document.getElementById('my-products-loading');

  if (!token || !user || !user.name) {
    productsList.innerHTML = '';
    messageDiv.style.display = 'block';
    messageDiv.textContent = 'Please log in to view your products.';
    return;
  }

  
  loadingDiv.style.display = 'flex';
  messageDiv.style.display = 'none';

  
fetch('/api/products/my-products', {
  headers: {
    'x-auth-token': token
  }
})
  .then(res => res.json())
  .then(products => {
    loadingDiv.style.display = 'none';
    productsList.innerHTML = '';

    if (!Array.isArray(products) || products.length === 0) {
      messageDiv.style.display = 'block';
      messageDiv.textContent = 'You have not listed any products yet.';
      return;
    }

    products.forEach(product => {
      productsList.appendChild(createMyProductCard(product));
    });
  })
  .catch(err => {
    loadingDiv.style.display = 'none';
    messageDiv.style.display = 'block';
    messageDiv.textContent = 'Failed to load your products. Please try again later.';
    console.error(err);
  });

  
  function createMyProductCard(product) {
    const card = document.createElement('div');
    card.className = 'my-product-card';

    const imageUrl = product.images && product.images.length > 0
      ? product.images[0]
      : '/images/placeholder.jpg';

    const currencySymbol = product.currency === 'GEL' ? '₾' : '$';
    const listingDate = typeof formatRelativeTime === 'function'
      ? formatRelativeTime(product.createdAt)
      : new Date(product.createdAt).toLocaleDateString();

    card.innerHTML = `
      <img src="${imageUrl}" alt="${product.title}" class="my-product-image">
      <div class="my-product-title">${product.title}</div>
      <div class="my-product-meta">
        <span><i class="fas fa-tag"></i> ${currencySymbol}${product.price.toLocaleString()}</span><br>
        <span><i class="fas fa-map-marker-alt"></i> ${product.location}</span><br>
        <span><i class="far fa-clock"></i> ${listingDate}</span>
      </div>
      <div class="my-product-actions">
        <button class="edit-btn" data-id="${product._id}"><i class="fas fa-edit"></i> Edit</button>
        <button class="delete-btn" data-id="${product._id}"><i class="fas fa-trash"></i> Delete</button>
      </div>
    `;

    
    card.querySelector('.edit-btn').addEventListener('click', function(e) {
      e.stopPropagation();
      window.location.href = `/edit-product/${product._id}`;
    });

    
    card.querySelector('.delete-btn').addEventListener('click', function(e) {
      e.stopPropagation();
      if (confirm('Are you sure you want to delete this product?')) {
        deleteProduct(product._id, card);
      }
    });

    
    card.addEventListener('click', function() {
      window.location.href = `/product/${product._id}`;
    });

    return card;
  }

  
  function deleteProduct(productId, cardElement) {
    fetch(`/api/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'x-auth-token': token
      }
    })
    .then(res => res.json())
    .then(result => {
      if (result.msg === 'Product removed') {
        showMessage('Product deleted successfully!', 'success');
        cardElement.remove();
        
        if (productsList.children.length === 0) {
          messageDiv.style.display = 'block';
          messageDiv.textContent = 'You have not listed any products yet.';
        }
      } else {
        throw new Error(result.message || 'Failed to delete product');
      }
    })
    .catch(err => {
      showMessage('Failed to delete product. Please try again.', 'error');
      console.error(err);
    });
  }

  
  function showMessage(message, type = 'info') {
    if (typeof window.showMessage === 'function') {
      window.showMessage(message, type);
      return;
    }
    
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;
    msgDiv.textContent = message;
    document.body.appendChild(msgDiv);
    setTimeout(() => {
      if (document.body.contains(msgDiv)) document.body.removeChild(msgDiv);
    }, 3000);
  }
});
