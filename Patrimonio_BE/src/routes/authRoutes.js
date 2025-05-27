const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middleware');  

router.post('/register/admin', (req, res) => authController.register(req, res, 'admin'));
router.post('/register/others', (req, res) => authController.register(req, res, 'inactive'));
router.post('/login', authController.login);
router.patch('/role/:username', verifyToken, isAdmin, authController.onOff);
router.get('/users',verifyToken,isAdmin, authController.fetchAllUsers);
module.exports = router;


