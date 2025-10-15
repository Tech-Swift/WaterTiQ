const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    //basic details 
    name : {
        type : String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },
    role:{
        type: String,
        enum:['tenant', 'landlord', 'admin', 'technician'],
        default: 'tenant'
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    //location /property linkage
    address:{
        type: String,
        required: true
    },
    propertyId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    },
    meterNumber:{
        type: String,
        required: function(){
            return this.role === 'customer';
        }
    },

    //billing details
    outstandingAmount: {
        type: Number,
        default: 0.0 //for first time users
    },
    lastInvoiceDate:{
        type: Date
    },
    lastPaymentDate:{
        type: Date
    },
    billingCycle: {
        type: String,
        enum: ['weekly', 'monthly', 'quartely'],
        default: 'monthly'
    },

    //system controls
    isActive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema)

module.exports = { User}