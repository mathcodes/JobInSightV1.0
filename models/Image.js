const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  images: [{
    contentType: {
        type: String,
        default: 'none',
        required: true,
    },
    path: {
        type: String,
        required: true
    },
    image: {
        type: Buffer,
        contentType: String,
        required: true
    }
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
}
});

const Image = mongoose.model('Image', ImageSchema);

module.exports = Image;