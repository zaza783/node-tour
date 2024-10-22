const Booking = require('../models/bookingModels');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllBooking = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Booking.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
   const bookings = await features.query;
  
    res.status(200).json({
     status: 'success',
    results: bookings.length,
       data: {
       bookings
       } 
     });
  });




  exports.createBook = catchAsync(async (req, res, next) => {
    const newBooking = await Booking.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
         booking: newBooking
       }
     });
   });
 
    exports.updateBooking = catchAsync(async (req, res, next) => {
      const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
 
      if (!booking) {
        return next(new AppError('No tour found with that ID', 404))
      }
 
       res.status(200).json({
       status: 'success',
       data: {
       booking
       }
     }); 
  });
 
 
 exports.deleteBooking = catchAsync(async (req, res, next) => {
       const booking = await Booking.findByIdAndDelete(req.params.id);
 
       if (!booking) {
        return next(new AppError('No tour found with that ID', 404))
      }
 
      res.status(204).json({
      status: 'success',
      data: null
     });
  }); 