const router = require('express').Router();
const axios = require('axios').default;

// Auth
const auth = require('../config/auth');

// Models
const Tasks = require('../models/Tasks');
const Users = require('../models/Users');
const {tasksValidation} = require('../models/Tasks');

/**
 * POST
 * Task data
 */
router.post('/', auth, async (req, res) => {
    let flag = true;
    // Get User Details
    const user = await Users.findById(req.user);

    // // Validate the data before we create a task entry
    const {error} = tasksValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Checking if the user has task collections entry
    const tasksExist = await Tasks.findOne({userId: req.user._id});

    // TODO - Don't allow duplicate task entries to tasks array
    // loop through array, check if task is already there, if it is return error
    if (tasksExist) {
        tasksExist.tasks.forEach((entry)=>{
            if (entry.task.toLowerCase() === req.body.task.toLowerCase()) {
                flag = false;
                return res.status(400).send("Task Already In List");
            }
        });
    }
    
    // store the data to db
    if (!tasksExist && flag) {
        // Create a new task  entry
        const entry = new Tasks({
            userId: user._id
        });
        entry.tasks.push(req.body);
        try {
            const savedEntry = await entry.save();
            res.send(savedEntry);
        } catch(err) {
            res.status(400).send(err);
        }
    } 
    else if (tasksExist && flag) {
        // add to existing entry
        const entry = tasksExist;
        entry.tasks.push(req.body);
        try {
            const savedEntry = await entry.save();
            res.send(savedEntry);
        } catch(err) {
            console.log(err);
            res.status(400).send(err);
        }
    }
});

/**
 * DELETE
 * Delete task
 */
router.delete('/', auth, async (req, res) => {

    try {
        const entry = await Tasks.update({userId: req.user._id}, {
            "$pull": {
              "tasks": {
                "task": req.body.task
              }
            }
          });
        res.send("Deleted Task");     
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

/**
 * GET
 * User Task Data
 */
router.get('/', auth, async (req, res) => {

    // Checking if the user has tasks entry
    const tasksExist = await Tasks.findOne({userId: req.user._id});

    // retrieve task data
    const entry = tasksExist;
    try {
        res.send(entry);
    } catch(err) {
        console.log(err);
        res.status(400).send(err);
    }
});

/**
 * PUT
 * Edit Task completed or not
 */
router.put('/', auth, async (req, res) => {
    console.log(req.body);
    try {
        const entry = await Tasks.update(
            // match criteria
            {
                userId: req.user._id,
                tasks: { $elemMatch: {'task': req.body.task}}
            },

            // update first match
            {
                $set: {
                    'tasks.$.completed': req.body.completed
                }
            }
        )
        res.send("Edited Successfully");
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});
  

// Export
module.exports = router;