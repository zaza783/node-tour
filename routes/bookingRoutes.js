const express = require('express');
const bookingController = require('../controllers/bookingController');
const router = express.Router();

router.route('/create-booking').post(bookingController.createBooking);
router.route('/getBooking').get(bookingController.getAllBooking);
router.route('/updateBooking/:id').patch(bookingController.updateBooking);
router.route('/deleteBooking/:id').delete(bookingController.deleteBooking)

module.exports = router;