const express = require('express');
const tourController = require('../controllers/tourController');
const router = express.Router();

router.route('/create-tour').post(tourController.createTour);
router.route('/getTour').get(tourController.getAllTours);
router.route('/updateTour/:id').patch(tourController.updateTour);
router.route('/deleteTour/:id').delete(tourController.deleteTour)

module.exports = router;

