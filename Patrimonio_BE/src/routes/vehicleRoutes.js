const express = require('express');
const {
    createVehicle,
    getAllVehicles,
    getVehiclesByBrand,
    getVehicleByLicensePlate,
    updateVehicle,
    deleteVehicle,
} = require('../controllers/vehicleController');
const { verifyToken, isActiveEmployee } = require('../middleware');
const router = express.Router();

router.use(verifyToken, isActiveEmployee);

router.post('/', createVehicle);                    
router.get('/', getAllVehicles);                   
router.get('/brand/:brand', getVehiclesByBrand);   
router.get('/:licensePlate', getVehicleByLicensePlate); 
router.put('/:licensePlate', updateVehicle);        
router.delete('/:licensePlate', deleteVehicle);     

module.exports = router;
