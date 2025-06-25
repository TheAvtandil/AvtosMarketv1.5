document.addEventListener('DOMContentLoaded', function() {
    
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    
    const featuredProducts = document.getElementById('featured-products');
    if (featuredProducts) {
        loadFeaturedProducts();
    }
    
    
    document.addEventListener('click', function(e) {
        const productCard = e.target.closest('.product-card');
        if (productCard) {
            const productId = productCard.getAttribute('data-id');
            window.location.href = `/product/${productId}`;
        }
    });
    
    
    initializeCategories();
    initializeConditionFilter();
});

async function loadFeaturedProducts() {
    try {
        const response = await fetch('/api/products?limit=5');
        const products = await response.json();
        
        const featuredProducts = document.getElementById('featured-products');
        featuredProducts.innerHTML = '';
        
        products.forEach(product => {
            const card = createProductCard(product);
            featuredProducts.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading featured products:', error);
    }
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-id', product._id);
    
    const imageUrl = product.images && product.images.length > 0 
        ? product.images[0] 
        : '/images/placeholder.jpg';
    
    
    const currencySymbol = product.currency === 'GEL' ? '₾' : '$';
    
    
    const listingDate = formatRelativeTime(product.createdAt);
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${imageUrl}" alt="${product.title}">
        </div>
        <div class="product-details">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-price">
            ${product.price !== undefined && product.price !== null ? currencySymbol + product.price.toLocaleString() : 'Price not available'}
            </p>
            <p class="product-location"><i class="fas fa-map-marker-alt"></i> ${product.location}</p>
            <p class="product-date"><i class="far fa-clock"></i> ${listingDate}</p>
        </div>
    `;
    
    return card;
}



function initializeCategories() {
    const categories = [
        'Electronics', 
        'Vehicles', 
        'Furniture', 
        'Clothing', 
        'Real Estate', 
        'Sports & Leisure', 
        'Home & Garden', 
        'Other'
    ];
    
    const categoryContainer = document.getElementById('category-filters');
    if (!categoryContainer) return;
    
    
    categoryContainer.innerHTML = '';
    
    categories.forEach(category => {
        const label = document.createElement('label');
        label.className = 'checkbox-label';
        
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.value = category.toLowerCase();
        
        label.appendChild(input);
        label.appendChild(document.createTextNode(` ${category}`));
        categoryContainer.appendChild(label);
    });
}


function initializeConditionFilter() {
    const conditions = ['New', 'Used', 'Refurbished'];
    const conditionContainer = document.getElementById('condition-filters');
    if (!conditionContainer) return;
    
    conditions.forEach(condition => {
        const label = document.createElement('label');
        label.className = 'checkbox-label';
        
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.value = condition.toLowerCase();
        
        label.appendChild(input);
        label.appendChild(document.createTextNode(` ${condition}`));
        conditionContainer.appendChild(label);
    });
}


function checkAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
       
    console.log("Auth check - Token:", token ? "exists" : "missing");
    console.log("Auth check - User:", user);
       
    if (token && user.name) {
        
        updateNavForLoggedInUser(user);
    }
}
   

function updateNavForLoggedInUser(user) {
    const navLinks = document.querySelector('.auth-navbar__links');
    if (!navLinks) return;
    
    
    const loginLink = navLinks.querySelector('a[href="/login"]');
    const registerLink = navLinks.querySelector('a[href="/register"]');
    
    if (loginLink) navLinks.removeChild(loginLink);
    if (registerLink) navLinks.removeChild(registerLink);
    
   
    
    
    if (!document.querySelector('.user-dropdown')) {
        const userDropdown = document.createElement('div');
        userDropdown.className = 'user-dropdown';
        
        
        const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
        
        userDropdown.innerHTML = `
            <div class="user-menu">
                <div class="user-avatar">
                    <span class="initials">${initial}</span>
                </div>
                <span class="user-name">${user.name || 'User'}</span>
                <i class="fas fa-chevron-down dropdown-icon"></i>
            </div>
            <div class="dropdown-content">
                <a href="/profile" class="dropdown-item">
                    <i class="fas fa-user"></i> My Profile
                </a>
                <a href="/add-product" class="dropdown-item">
                    <i class="fas fa-plus-circle"></i> Add Product
                </a>
                <a href="/my-products" class="dropdown-item">
                    <i class="fas fa-shopping-basket"></i> My Products
                </a>
                <a href="/cart" class="dropdown-item">
            <i class="fas fa-shopping-cart"></i> Cart
                </a>
                <a href="/messages" class="dropdown-item">
                    <i class="fas fa-envelope"></i> Messages
                </a>
                <div class="dropdown-divider"></div>
                <a href="/settings" class="dropdown-item">
                    <i class="fas fa-cog"></i> Settings
                </a>
                <a href="#" class="dropdown-item logout-item" id="logout-btn">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            </div>
        `;
        
        navLinks.appendChild(userDropdown);
        
        
        const userMenu = userDropdown.querySelector('.user-menu');
        const dropdownContent = userDropdown.querySelector('.dropdown-content');
        const dropdownIcon = userDropdown.querySelector('.dropdown-icon');
        
        userMenu.addEventListener('click', function(e) {
            e.preventDefault();
            dropdownContent.classList.toggle('show');
            dropdownIcon.style.transform = dropdownContent.classList.contains('show') 
                ? 'rotate(180deg)' 
                : 'rotate(0)';
        });
        
        
        document.addEventListener('click', function(e) {
            if (userDropdown.contains(e.target)) return;
            dropdownContent.classList.remove('show');
            dropdownIcon.style.transform = 'rotate(0)';
        });
        
        
        const logoutBtn = userDropdown.querySelector('#logout-btn');
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}


function logout() {
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'logout-message';
    messageDiv.textContent = 'Successfully logged out!';
    document.body.appendChild(messageDiv);
    
    
    setTimeout(() => {
        document.body.removeChild(messageDiv);
        window.location.href = '/';
    }, 2000);
}

   



document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    
});


document.addEventListener('DOMContentLoaded', function() {
    
    const productsGrid = document.getElementById('products-grid');
    const filterPanel = document.querySelector('.filter-panel');
    
    if (productsGrid && filterPanel) {
        
        initializeFilters();
        loadAllProducts();
        
        
        const filterBtn = document.querySelector('.filter-btn');
        if (filterBtn) {
            filterBtn.addEventListener('click', function() {
                filterPanel.classList.toggle('show-filters');
            });
        }
        
        
        const applyFiltersBtn = document.querySelector('.apply-filters');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', applyFilters);
        }
    }
});


function initializeFilters() {
    initializeCategories();
    initializeConditionFilter();
    initializePriceRangeFilter();
    initializeLocationFilter();
}


function initializePriceRangeFilter() {
    const priceRange = document.querySelector('.price-range');
    const minPriceDisplay = document.getElementById('min-price');
    const maxPriceDisplay = document.getElementById('max-price');
    
    if (priceRange && minPriceDisplay && maxPriceDisplay) {
        
        priceRange.value = priceRange.max / 2;
        
        
        priceRange.addEventListener('input', function() {
            const maxPrice = parseInt(this.value);
            maxPriceDisplay.textContent = `$${maxPrice.toLocaleString()}`;
        });
        
        
        maxPriceDisplay.textContent = `$${(parseInt(priceRange.value)).toLocaleString()}`;
    }
}


function initializeLocationFilter() {
    const locationFilter = document.getElementById('location-filter');
    
    if (locationFilter) {
        
        locationFilter.innerHTML = '<option value="">All Locations</option>';
        
        
        const locations = ['Tbilisi', 'Batumi', 'Kutaisi', 'Rustavi', 'Zugdidi'];
        
        locations.forEach(location => {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            locationFilter.appendChild(option);
        });
    }
}


function applyFilters() {
    
    const categoryFilters = document.querySelectorAll('#category-filters input:checked');
    const categories = Array.from(categoryFilters).map(input => input.value);
    
    
    const conditionFilters = document.querySelectorAll('#condition-filters input:checked');
    const conditions = Array.from(conditionFilters).map(input => input.value);
    
    
    const priceRange = document.querySelector('.price-range');
    const maxPrice = priceRange ? parseInt(priceRange.value) : 100000;
    
    
    const locationFilter = document.getElementById('location-filter');
    const location = locationFilter ? locationFilter.value : '';
    
    
    const params = new URLSearchParams();
    
if (categories.length > 0) {
    params.append('category', categories.join(','));
}
if (conditions.length > 0) {
    params.append('condition', conditions.join(','));
}

    
    if (maxPrice) {
        params.append('maxPrice', maxPrice);
    }
    
    if (location) {
        params.append('location', location);
    }
    
    
    loadFilteredProducts(params);
}


async function loadFilteredProducts(params) {
    try {
        const url = `/api/products?${params.toString()}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading filtered products:', error);
        
        const productsGrid = document.getElementById('products-grid');
        if (productsGrid) {
            productsGrid.innerHTML = `
                <div class="error-message">
                    <p>Failed to load products. Please try again later.</p>
                </div>
            `;
        }
    }
}


async function loadAllProducts() {
    try {
        const response = await fetch('/api/products');
        
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        
        const productsGrid = document.getElementById('products-grid');
        if (productsGrid) {
            productsGrid.innerHTML = `
                <div class="error-message">
                    <p>Failed to load products. Please try again later.</p>
                </div>
            `;
        }
    }
}


function displayProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    
    if (productsGrid) {
        productsGrid.innerHTML = '';
        
        if (products.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-products">
                    <p>No products found matching your criteria.</p>
                </div>
            `;
            return;
        }
        
        products.forEach(product => {
            const card = createProductCard(product);
            productsGrid.appendChild(card);
        });
    }
}


document.addEventListener('DOMContentLoaded', function() {
    
    const filterPanel = document.querySelector('.filter-panel');
    const closeFilters = document.querySelector('.close-filters');
    
    if (filterPanel && closeFilters) {
        closeFilters.addEventListener('click', function() {
            filterPanel.classList.remove('show-filters');
        });
    }
    
    
    document.addEventListener('click', function(e) {
        if (filterPanel && filterPanel.classList.contains('show-filters')) {
            if (!filterPanel.contains(e.target) && !e.target.closest('.filter-btn')) {
                filterPanel.classList.remove('show-filters');
            }
        }
    });
        const clearFiltersBtn = document.querySelector('.clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            
            document.querySelectorAll('#category-filters input[type="checkbox"], #condition-filters input[type="checkbox"]').forEach(cb => cb.checked = false);
            
            const priceRange = document.querySelector('.price-range');
            if (priceRange) {
                priceRange.value = priceRange.max / 2;
                document.getElementById('max-price').textContent = `$${(parseInt(priceRange.value)).toLocaleString()}`;
            }
            
            const locationFilter = document.getElementById('location-filter');
            if (locationFilter) locationFilter.value = '';
            
            loadAllProducts();
        });
    }
});



function formatDate(dateString = null) {
    const date = dateString ? new Date(dateString) : new Date();
    return date.toLocaleDateString('en-US', { 
        month: 'long',
        year: 'numeric'
    });
}


function formatFullDate(dateString = null) {
    const date = dateString ? new Date(dateString) : new Date();
    return date.toLocaleDateString('en-US', { 
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
}


function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'just now';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
        return formatFullDate(date);
    }
}


document.addEventListener('DOMContentLoaded', function() {
    
    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        addProductForm.addEventListener('submit', handleProductSubmit);
    }
});

async function handleProductSubmit(e) {
    e.preventDefault();
    
    
    const token = localStorage.getItem('token');
    if (!token) {
        showMessage('Please log in to add a product', 'error');
        setTimeout(() => {
            window.location.href = '/login';
        }, 2000);
        return;
    }

    
    const formData = new FormData(e.target);
    const productData = {
        title: formData.get('title'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price')),
        category: formData.get('category'),
        condition: formData.get('condition'),
        location: formData.get('location'),
        currency: formData.get('currency') || 'USD',
        
    };

    try {
        
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify(productData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add product');
        }
try {
    
} catch (error) {
    console.error('Product creation error:', error);
    return res.status(500).json({ message: error.message || 'Server error' });
}
        const result = await response.json();
        
        
        showMessage('Product added successfully!', 'success');
        
        
        setTimeout(() => {
            window.location.href = `/product/${result._id}`;
        }, 2000);
    } catch (error) {
        console.error('Error adding product:', error);
        showMessage(error.message || 'An error occurred', 'error');
    }
}


function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    
    document.body.appendChild(messageDiv);
    
    
    setTimeout(() => {
        if (document.body.contains(messageDiv)) {
            document.body.removeChild(messageDiv);
        }
    }, 3000);
}


document.addEventListener('DOMContentLoaded', async function() {
  
  const productContainer = document.getElementById('product-detail');
  if (productContainer) {
    try {
      
      const productId = window.location.pathname.split('/').pop();
      
      
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error('Failed to load product');
      }
      
      const product = await response.json();
      
      
      const currencySymbol = product.currency === 'GEL' ? '₾' : '$';
      
      
      const listingDate = formatRelativeTime(product.createdAt);
      
      
      productContainer.innerHTML = `
        <div class="product-detail-container">
          <div class="product-images">
            ${product.images && product.images.length > 0 ? 
              `<div class="main-image">
                <img src="${product.images[0]}" alt="${product.title}">
              </div>
              ${product.images.length > 1 ? 
                `<div class="thumbnail-images">
                  ${product.images.map((img, index) => 
                    `<img src="${img}" alt="${product.title} image ${index+1}" class="thumbnail">`
                  ).join('')}
                </div>` : ''
              }` : 
              `<div class="main-image">
                <img src="/images/placeholder.jpg" alt="${product.title}">
              </div>`
            }
          </div>
          
          <div class="product-info">
            <h1 class="product-title">${product.title}</h1>
            <p class="product-price">${currencySymbol}${product.price.toLocaleString()}</p>
            <p class="product-location"><i class="fas fa-map-marker-alt"></i> ${product.location}</p>
            <p class="product-date"><i class="far fa-clock"></i> ${listingDate}</p>
            <div class="product-attributes">
              <p><strong>Category:</strong> ${product.category}</p>
              <p><strong>Condition:</strong> ${product.condition}</p>
              ${product.year ? `<p><strong>Year:</strong> ${product.year}</p>` : ''}
            </div>
            <div class="product-description">
              <h3>Description</h3>
              <p>${product.description}</p>
            </div>
            
            <div class="seller-info">
              <h3>Contact Seller</h3>
              <button id="contact-seller" class="btn primary-btn">
                <i class="fas fa-envelope"></i> Send Message
              </button>
              ${product.contact ? 
                `<button id="call-seller" class="btn secondary-btn">
                  <i class="fas fa-phone"></i> ${product.contact}
                </button>` : ''
              }
            </div>
          </div>
        </div>
      `;
      
      
      const thumbnails = document.querySelectorAll('.thumbnail');
      const mainImage = document.querySelector('.main-image img');
      
      if (thumbnails.length > 0 && mainImage) {
        thumbnails.forEach(thumb => {
          thumb.addEventListener('click', function() {
            mainImage.src = this.src;
          });
        });
      }
      
    } catch (error) {
      productContainer.innerHTML = `
        <div class="error-message">
          <h2>Oops! Something went wrong</h2>
          <p>We couldn't load this product: ${error.message}</p>
          <a href="/products" class="btn primary-btn">Back to Products</a>
        </div>
      `;
    }
  }
});


document.addEventListener('DOMContentLoaded', async function() {
  const productContainer = document.getElementById('product-detail');
  if (productContainer) {
    try {
      const productId = window.location.pathname.split('/').pop();
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) throw new Error('Failed to load product');
      const product = await response.json();
      const currencySymbol = product.currency === 'GEL' ? '₾' : '$';
      const listingDate = formatRelativeTime(product.createdAt);
      productContainer.innerHTML = `
        <div class="product-detail-container">
          <div class="product-images">
            ${product.images && product.images.length > 0 ? 
              `<div class="main-image">
                <img src="${product.images[0]}" alt="${product.title}">
              </div>
              ${product.images.length > 1 ? 
                `<div class="thumbnail-images">
                  ${product.images.map((img, index) => 
                    `<img src="${img}" alt="${product.title} image ${index+1}" class="thumbnail">`
                  ).join('')}
                </div>` : ''
              }` : 
              `<div class="main-image">
                <img src="/images/placeholder.jpg" alt="${product.title}">
              </div>`
            }
          </div>
          <div class="product-info">
            <h1 class="product-title">${product.title}</h1>
            <p class="product-price">${currencySymbol}${product.price !== undefined && product.price !== null ? product.price.toLocaleString() : 'Price not available'}</p>
            <p class="product-location"><i class="fas fa-map-marker-alt"></i> ${product.location}</p>
            <p class="product-date"><i class="far fa-clock"></i> ${listingDate}</p>
            <div class="product-attributes">
              <p><strong>Category:</strong> ${product.category}</p>
              <p><strong>Condition:</strong> ${product.condition}</p>
              ${product.year ? `<p><strong>Year:</strong> ${product.year}</p>` : ''}
            </div>
            <div class="product-description">
              <h3>Description</h3>
              <p>${product.description}</p>
            </div>
            <div class="seller-info">
              <h3>Contact Seller</h3>
              <button id="contact-seller" class="btn primary-btn">
                <i class="fas fa-envelope"></i> Send Message
              </button>
              ${product.contact ? 
                `<button id="call-seller" class="btn secondary-btn">
                  <i class="fas fa-phone"></i> ${product.contact}
                </button>` : ''
              }
            </div>
          </div>
        </div>
      `;
      
      const thumbnails = document.querySelectorAll('.thumbnail');
      const mainImage = document.querySelector('.main-image img');
      if (thumbnails.length > 0 && mainImage) {
        thumbnails.forEach(thumb => {
          thumb.addEventListener('click', function() {
            mainImage.src = this.src;
          });
        });
      }
    } catch (error) {
      productContainer.innerHTML = `
        <div class="error-message">
          <h2>Oops! Something went wrong</h2>
          <p>We couldn't load this product: ${error.message}</p>
          <a href="/products" class="btn primary-btn">Back to Products</a>
        </div>
      `;
    }
  }
});


function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById('cart-count');
    if (cartCount) cartCount.textContent = count;
}
document.addEventListener('DOMContentLoaded', updateCartCount);


document.addEventListener('DOMContentLoaded', function() {
    
    const searchInput = document.getElementById('search-input');
    const searchButton = document.querySelector('.search-btn');
    
    
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            
            loadAllProducts();
            return;
        }
        
        
        fetch('/api/products')
            .then(response => response.json())
            .then(products => {
                
                const filteredProducts = products.filter(product => 
                    product.title.toLowerCase().includes(searchTerm) ||
                    product.description.toLowerCase().includes(searchTerm) ||
                    product.category.toLowerCase().includes(searchTerm) ||
                    product.location.toLowerCase().includes(searchTerm)
                );
                
                
                displayProducts(filteredProducts);
            })
            .catch(error => {
                console.error('Error searching products:', error);
            });
    }
    
    
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }
    
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    
    function displayProducts(products) {
        const productsGrid = document.getElementById('products-grid');
        if (!productsGrid) return;
        
        
        productsGrid.innerHTML = '';
        
        if (products.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-products-message">
                    <p>No products match your search. Try different keywords.</p>
                </div>
            `;
            return;
        }
        
        
        products.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
        });
    }
    
    
    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-id', product._id);
        
        const imageUrl = (product.images && product.images.length > 0) 
            ? product.images[0] 
            : '/images/placeholder.jpg';
            
        const currencySymbol = product.currency === 'GEL' ? '₾' : '$';
        const listingDate = typeof formatRelativeTime === 'function'
            ? formatRelativeTime(product.createdAt)
            : new Date(product.createdAt).toLocaleDateString();
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${imageUrl}" alt="${product.title}">
            </div>
            <div class="product-details">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">
                ${product.price !== undefined && product.price !== null ? currencySymbol + product.price.toLocaleString() : 'Price not available'}
                </p>
                <p class="product-location"><i class="fas fa-map-marker-alt"></i> ${product.location}</p>
                <p class="product-date"><i class="far fa-clock"></i> ${listingDate}</p>
            </div>
        `;
        
        return card;
    }
});
