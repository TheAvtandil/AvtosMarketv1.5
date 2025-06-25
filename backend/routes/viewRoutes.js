
const express = require('express');
const path = require('path');
const router = express.Router();


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'index.html'));
});


router.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'products.html'));
});

router.get('/product/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'product-detail.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'login.html'));
});

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'register.html'));
});

router.get('/add-product', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'add-product.html'));
});

router.get('/forgot-password', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'forgot-password.html'));
});

router.get('/logout', (req, res) => {
    res.redirect('/');
});

router.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'profile.html'));
});

router.get('/edit-product/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'edit-product.html'));
});


router.get('/my-products', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'my-products.html'));
});


router.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'cart.html'));
});


router.get('/messages', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'views', 'messages.html'));
});

router.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'settings.html'));
});

module.exports = router;
