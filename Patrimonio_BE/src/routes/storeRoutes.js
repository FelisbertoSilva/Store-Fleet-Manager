const express = require('express');
const {
    createStore,
    getAllStores,
    getStoreByNome,
    getStoreWithVehicles,
    updateStore,
    getStoresByLocation,
    deleteStore,
    countStoresDistrict,
    countVehiclesByDistrict,
} = require('../controllers/storeController');
const { verifyToken, isActiveEmployee } = require('../middleware');
const router = express.Router();

router.use(verifyToken, isActiveEmployee);

router.post('/', createStore);                   
router.get('/', getAllStores);
router.get('/count', countStoresDistrict);                   
router.post('/search', getStoresByLocation);     
router.get('/:nome', getStoreByNome);            
router.get('/:nome/vehicles', getStoreWithVehicles); 
router.put('/:nome', updateStore);               
router.delete('/:nome', deleteStore);
router.get('/vehicles/district', countVehiclesByDistrict);        

module.exports = router;
