const express = require('express');
const authController = require('../controllers/authController');
const router = express();

// CRUD - Create - post
         // Read - GET
        // Update - PUT
        // DELETE - DELETE


router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
// router.use(authController.protect);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);




module.exports = router;