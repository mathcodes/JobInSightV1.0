const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    team: {
      type: String,
      ref: 'Team',
      required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Team', TeamSchema);
