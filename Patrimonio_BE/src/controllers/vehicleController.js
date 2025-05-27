const Vehicle = require('../models/VehicleModel');

exports.createVehicle = async (req, res) => {
    try {
        const { licensePlate, brand, model, store } = req.body;

        if (!licensePlate) {
            return res.status(400).json({ message: 'License plate is required' });
        }

        const newVehicle = new Vehicle({ licensePlate, brand, model, store });
        await newVehicle.save();

        res.status(201).json({ message: 'Vehicle created successfully', vehicle: newVehicle });
    } catch (error) {
        console.error('Error creating vehicle:', error.message);
        res.status(500).json({ message: 'Error creating vehicle', error: error.message });
    }
};

exports.getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find()
            .populate('store')
            .sort({ licensePlate: 1 }); 

        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vehicles', error: error.message });
    }
};


exports.getVehicleByLicensePlate = async (req, res) => {
    try {
        const { licensePlate } = req.params;

        const vehicle = await Vehicle.findOne({ licensePlate }).populate('store');
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        res.status(200).json(vehicle);
    } catch (error) {
        console.error('Error fetching vehicle:', error.message);
        res.status(500).json({ message: 'Error fetching vehicle', error: error.message });
    }
};


exports.getVehiclesByBrand = async (req, res) => {
    try {
        const { brand } = req.params;

        const vehicles = await Vehicle.find({ brand: brand })
        .populate('store')
        .sort({ licensePlate: 1 });

        if (vehicles.length === 0) {
            return res.status(404).json({ message: `No vehicles found for brand: ${brand}` });
        }

        res.status(200).json(vehicles);
    } catch (error) {
        console.error('Error fetching vehicles by brand:', error.message);
        res.status(500).json({ message: 'Error fetching vehicles by brand', error: error.message });
    }
};

exports.updateVehicle = async (req, res) => {
    try {
        const { licensePlate, brand, model, store } = req.body;

        const vehicle = await Vehicle.findOne({ licensePlate: req.params.licensePlate });
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        vehicle.licensePlate = licensePlate || vehicle.licensePlate;
        vehicle.brand = brand || vehicle.brand;
        vehicle.model = model || vehicle.model;
        vehicle.store = store || vehicle.store;

        const updatedVehicle = await vehicle.save();
        const populatedVehicle = await Vehicle.findById(updatedVehicle._id).populate('store');

        res.json({ message: 'Vehicle updated successfully', vehicle: populatedVehicle });
    } catch (error) {
        console.error('Error updating vehicle:', error.message);
        res.status(500).json({ message: 'Error updating vehicle', error: error.message });
    }
};


exports.deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findOneAndDelete({licensePlate:req.params.licensePlate});
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json({ message: 'Vehicle was sold or destroyed', vehicle });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting vehicle', error: error.message });
    }
};