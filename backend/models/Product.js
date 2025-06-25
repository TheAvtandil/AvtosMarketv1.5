
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        enum: ['USD', 'GEL'],
        default: 'USD'
    },
    category: {
        type: String,
        required: true,
        enum: [
            'Electronics', 'Vehicles', 'Furniture', 'Clothing', 'Real Estate',
            'Sports & Leisure', 'Home & Garden', 'Other'
        ],
        set: v => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()
    },
    condition: {
        type: String,
        required: true,
        enum: ['New', 'Used', 'Refurbished'],
        set: v => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()
    },
    location: {
        type: String,
        required: true
    },
    images: {
        type: [String], 
        default: []
    },
    contact: {
        type: String
    },
    year: {
        type: Number
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', ProductSchema);
