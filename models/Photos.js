const mongoose = require('mongoose');
const Joi = require('joi');

const PhotosSchema = new mongoose.Schema({
    photos: {
      type: mongoose.Schema.Types.Array,
      data: Buffer,
      contentType: String,
      ref: 'Photos',
      required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Photos', PhotosSchema);
