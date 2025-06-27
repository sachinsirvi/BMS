const express = require('express');
const auth = require('../middlewares/authMiddleware');
const theatreRouter = express.Router();
const { addTheatre, updateTheatreDetails, deleteTheatre, getAllTheatresForAdmin, getAllTheatresByPartner, updateTheatreStatus } = require('../controllers/theatreController');

// add a theatre
theatreRouter.post('/add-theatre', auth, addTheatre);

// update a theatre
theatreRouter.put('/update-theatre/:id', auth, updateTheatreDetails);

// Approve or Block Theatre
theatreRouter.put('/update-theatre-status/:id', auth, updateTheatreStatus);
  
// delete a theatre
theatreRouter.delete('/delete-theatre/:id', auth, deleteTheatre);

// get all theatres for admin
theatreRouter.get('/get-all-theatres', auth, getAllTheatresForAdmin);
  
// get all theatres owned by partner
theatreRouter.get('/get-all-theatres-by-owner/:ownerId', auth, getAllTheatresByPartner);

module.exports = theatreRouter;

