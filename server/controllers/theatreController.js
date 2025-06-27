const thearteModel = require('../models/theatreModel');

const  addTheatre = async (req, res) => {
    try {
        const response = await thearteModel.create(req.body);
        res.status(201).json({ success: true, message: 'Theatre added successfully' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

const updateTheatreDetails = async (req, res) => {
    try {
        const updateTheatre = await thearteModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updateTheatre) {
            return res.status(404).json({ success: false, message: 'Theatre not found' });
        }
        res.status(200).json({ success: true, message: 'Theatre updated successfully',data: updateTheatre });
    } catch (err) {
        const status = err.name === 'CastError' ? 404 : 500;
        res.status(status).json({ success: false, message: err.message });
    }

}

const updateTheatreStatus = async (req, res) => {
    try {
      const theatre = await thearteModel.findByIdAndUpdate(
        req.params.id,
        { isActive: req.body.isActive },
        { new: true }
      );
  
      if (!theatre) {
        return res.status(404).json({ success: false, message: 'Theatre not found' });
      }
  
      res.status(200).json({
        success: true,
        message: `Theatre ${req.body.isActive ? 'approved' : 'blocked'} successfully`,
        data: theatre,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

const deleteTheatre = async (req, res) => {
    try {
        const deleted = await thearteModel.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Theatre not found' });
        }
        res.status(200).json({ success: true, message: 'Theatre deleted successfully', data: deleted });
    } catch (err) {
        const status = err.name === 'CastError' ? 404 : 500;
        res.status(status).json({ success: false, message: err.message });
    }
}

const getAllTheatresForAdmin = async (req, res) => {
    try {
        const theatres = await thearteModel.find().populate('owner', 'name email');
      res.status(200).json({ success: true, data: theatres });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

const getAllTheatresByPartner = async (req, res) => {
    try {
        const allTheatresForOwner = await thearteModel.find({ owner: req.params.ownerId });
        res.status(200).json({ success: true, data: allTheatresForOwner });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

module.exports = {
    addTheatre,
    updateTheatreDetails,
    updateTheatreStatus,
    deleteTheatre,
    getAllTheatresForAdmin,
    getAllTheatresByPartner
}