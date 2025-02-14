// Dependencias
const express = require('express');
const router = express.Router();

// Archivos
const UserController = require('../controllers/user.controller')
const UserMiddlewares = require('../middlewares/user.middlewares')

// Rutas
router.post('/user/register', UserMiddlewares.registerMiddleware, UserController.register);
router.get('/user/verify/:jwt', UserController.verifyEmail);
router.get('/user/login', UserController.login);
router.get('/user/get/:id', UserController.getUserById)
router.put('/user/update/:id', UserController.updateUser)
router.delete('/user/delete/:id', UserMiddlewares.verifyOwner, UserController.deleteUsersById);

module.exports = router;