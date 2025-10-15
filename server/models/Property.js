const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    
    name: {
        type : String,
        required: true,
        trim: true
    },
    address: {
        type : String,
        required : true,
        trim: true
    },
    landlordId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function(){
            return this.userRole === 'landlord';
        }
    },
    units: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Unit',
        },
    ],
    status:{
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
}, {timestamps: { createdAt: true, updatedAt: true }});

const Property = mongoose.model('Property', propertySchema)

module.exports = { Property }