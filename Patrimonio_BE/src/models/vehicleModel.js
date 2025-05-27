const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VehicleSchema = new Schema({
   
    licensePlate: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value) => /^[A-Z]{2}-\d{2}-\d{2}$|^\d{2}-[A-Z]{2}-\d{2}$|^\d{2}-\d{2}-[A-Z]{2}$|^[A-Z]{2}-\d{2}-[A-Z]{2}$/.test(value),
            message: 'Invalid license plate format',
        },
    },    
    
    brand: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    store: { 
        type: Schema.Types.ObjectId,
        ref: 'Store',
        required: true,
    },
}, {
    timestamps: true,    
});

const Vehicle = mongoose.model('Vehicle', VehicleSchema);
module.exports = Vehicle;
