const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['tenant', 'landlord', 'admin', 'technician'],
        default: 'tenant'
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },

    //linking details
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        default: null
    },
    unitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unit',
        default: null
    },
    meterId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meter',
        default: null
    },

    //system management
    isActive: {
        type: Boolean,
        default: true
    },
}, { timestamps: true});

const User = mongoose.model('User', UserSchema);

module.exports =  { User }