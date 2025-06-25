const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');






router.get('/', async (req, res) => {
    try {
        
        const filter = {};

if (req.query.category) {
    if (req.query.category.includes(',')) {
        filter.category = { $in: req.query.category.split(',').map(v => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()) };
    } else {
        filter.category = req.query.category.charAt(0).toUpperCase() + req.query.category.slice(1).toLowerCase();
    }
}
if (req.query.condition) {
    if (req.query.condition.includes(',')) {
        filter.condition = { $in: req.query.condition.split(',').map(v => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()) };
    } else {
        filter.condition = req.query.condition.charAt(0).toUpperCase() + req.query.condition.slice(1).toLowerCase();
    }
}

if (req.query.location) filter.location = req.query.location;

if (req.query.minYear || req.query.maxYear) {
  filter.year = {};
  if (req.query.minYear) filter.year.$gte = parseInt(req.query.minYear);
  if (req.query.maxYear) filter.year.$lte = parseInt(req.query.maxYear);
}

if (req.query.minPrice || req.query.maxPrice) {
  filter.price = {};
  if (req.query.minPrice) filter.price.$gte = parseInt(req.query.minPrice);
  if (req.query.maxPrice) filter.price.$lte = parseInt(req.query.maxPrice);
}

        const products = await Product.find(filter).sort({ date: -1 });
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});





router.get('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ msg: 'Invalid product ID format' });
}

        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        
        res.json(product);
    } catch (err) {
        console.error(err.message);
        
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Product not found' });
        }
        
        res.status(500).json({ message: 'Server error' });

    }
});




router.post('/', auth, async (req, res) => {
    try {
        const { title, description, price, category, condition, year, location, images, currency, contact } = req.body;
        
        const newProduct = new Product({
            title,
            description,
            price,
            category,
            condition,
            year,
            location,
            images,
            currency: currency || 'USD',
            contact,
            user: req.user.id
        });
        
        const product = await newProduct.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});




router.put('/:id', auth, async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        
        
        if (product.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        
        res.json(updatedProduct);
    } catch (err) {
        console.error(err.message);
        
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Product not found' });
        }
        
        res.status(500).json({ message: 'Server error' });
    }
});




router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        
        
        if (product.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        
        await product.remove();
        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error(err.message);
        
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Product not found' });
        }
        
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/', async (req, res) => {
    try {
        
        const limit = parseInt(req.query.limit) || 5;
        const products = await Product.find(filter).sort({ date: -1 }).limit(limit);
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/my-products', auth, async (req, res) => {
    const products = await Product.find({ user: req.user.id });
    res.json(products); 
});

module.exports = router;
