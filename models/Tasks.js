const mongoose = require('mongoose');
const Joi = require('joi');

const TasksSchema = new mongoose.Schema({
  tasks: [{
    task: {
        type: String,
        required: true,
        min: 1,
        max: 60
    },
    completed: {
        type: Boolean,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}],
userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
}
});

// Validation
const tasksValidation = (data) => {
  const schema = Joi.object({
      task: Joi.string().min(1).max(60).required(),
      completed: Joi.boolean().required()
  })
  return schema.validate(data);
}

module.exports = mongoose.model('Tasks', TasksSchema);
module.exports.tasksValidation = tasksValidation;
