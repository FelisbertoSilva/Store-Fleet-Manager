const Store = require('../models/storeModel');
const Vehicle = require('../models/VehicleModel');

exports.createStore = async (req, res) => {
    try {
        const { nome, distrito, concelho, freguesia } = req.body;

        const newStore = new Store({ nome, distrito, concelho, freguesia });
        await newStore.save();

        res.status(201).json({ message: 'Store created successfully', store: newStore });
    } catch (error) {
        res.status(500).json({ message: 'Error creating store', error: error.message });
    }
};

exports.getAllStores = async (req, res) => {
    try {
        const stores = await Store.find().sort({ nome: 1 });
        res.json(stores);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stores', error: error.message });
    }
};

exports.getStoreByNome = async (req, res) => {
    try {
        const store = await Store.findOne({ nome: req.params.nome });
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }
        res.json(store);
    } catch (error) {
        console.error('Error fetching store:', error.message);
        res.status(500).json({ message: 'Error fetching store', error: error.message });
    }
};

exports.getStoreWithVehicles = async (req, res) => {
    try {
        const storeName = req.params.nome;

        const store = await Store.findOne({ nome: storeName });
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        const vehicles = await Vehicle.find({ store: store._id });

        if (vehicles.length === 0) {
            return res.status(200).json({
                store,
                message: 'No vehicles are associated with this store.',
            });
        }

        res.status(200).json({
            store,
            vehicles,
        });
    } catch (error) {
        console.error('Error fetching store with vehicles:', error.message);
        res.status(500).json({ message: 'Error fetching store with vehicles', error: error.message });
    }
};

exports.updateStore = async (req, res) => {
    try {
        const { nome, distrito, concelho, freguesia } = req.body;

        const store = await Store.findOne({ nome: req.params.nome });
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        store.nome = nome || store.nome;
        store.distrito = distrito || store.distrito;
        store.concelho = concelho || store.concelho;
        store.freguesia = freguesia || store.freguesia;

        const updatedStore = await store.save();

        res.json({ message: 'Store updated successfully', store: updatedStore });
    } catch (error) {
        console.error('Error updating store:', error.message);
        res.status(500).json({ message: 'Error updating store', error: error.message });
    }
};

exports.getStoresByLocation = async (req, res) => {
    try {
        const { distrito, concelho, freguesia } = req.body;

        const query = {};
        if (distrito) query.distrito = distrito;
        if (concelho) query.concelho = concelho;
        if (freguesia) query.freguesia = freguesia;

        const stores = await Store.find(query);

        if (stores.length === 0) {
            return res.status(404).json({ message: 'No stores found for the specified location.' });
        }

        res.json(stores);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stores by location', error: error.message });
    }
};

exports.deleteStore = async (req, res) => {
    try {
        const storeName = req.params.nome;

        const store = await Store.findOne({ nome: storeName });
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        const associatedVehicles = await Vehicle.find({ store: store._id });
        if (associatedVehicles.length > 0) {
            return res.status(400).json({
                message: 'Cannot delete store. There are vehicles associated with this store.',
                vehicles: associatedVehicles,
            });
        }

        await store.deleteOne();

        res.json({ message: 'Store deleted successfully' });
    } catch (error) {
        console.error('Error deleting store:', error.message);
        res.status(500).json({ message: 'Error deleting store', error: error.message });
    }
};

exports.countStoresDistrict = async (req, res) => {
    try {
        const stores = await Store.aggregate([
            {
                $group: {
                    _id: '$distrito',
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    distrito: '$_id',
                    count: 1,
                },
            },
        ]);

        if (!stores || stores.length === 0) {
            return res.status(404).json({ message: 'No Stores' });
        }

        res.json(stores);
    } catch (error) {
        console.error('Error Fetching Stores:', error);
        res.status(500).json({ message: 'Error Fetching Stores', error: error.message });
    }
};

exports.countVehiclesByDistrict = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({});
        console.log("Vehicle Data:", vehicles);

        const vehicleCounts = {};
        vehicles.forEach((vehicle) => {
            if (vehicle.store) {
                vehicleCounts[vehicle.store] = (vehicleCounts[vehicle.store] || 0) + 1;
            }
        });
        console.log("Vehicle Counts by Store:", vehicleCounts);

        const stores = await Store.find({});
        console.log("Store Data:", stores);

        const districtVehicleCounts = {};
        stores.forEach((store) => {
            const district = store.distrito;
            const storeVehicleCount = vehicleCounts[store._id] || 0;
            districtVehicleCounts[district] = (districtVehicleCounts[district] || 0) + storeVehicleCount;
        });
        console.log("Vehicle Counts by District:", districtVehicleCounts);

        res.json(districtVehicleCounts);
    } catch (error) {
        console.error("Error fetching vehicle counts by district:", error);
        res.status(500).json({ message: "Error fetching vehicle counts by district", error: error.message });
    }
};