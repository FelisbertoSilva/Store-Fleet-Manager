const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoreSchema = new Schema({
    nome: {
        type: String,
        required: true,
        unique: true,
    },
    distrito: {
        type: String,
        required: true,
    },
    concelho: {
        type: String,
        required: false,
    },
    freguesia: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,    
}); 

const Store = mongoose.model('Store', StoreSchema);
module.exports = Store;
