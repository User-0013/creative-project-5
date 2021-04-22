const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const users = require("./users.js");
const User = users.model;
const validUser = users.valid;

// Schema for users
const userDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectID,
    ref: 'User'
  },
  academicPrestige: Number,
  yearInSchool: String,
  degreeStatus: String,
  // // Resources will be laid out as follows: [Food, Brain Power, Time]
  // resources: Array,
  // resourcesMax: Array,
  // Assignments will be laid out as follows: [Paper, Project, Exam]
  assignmentsEnglish: Array,
  assignmentsMathematics: Array,
  assignmentsHumanities: Array,
  assignmentsFineArts: Array,
  assignmentsCommunications: Array,
  assignmentsScience: Array,
  assignmentsSocialSciences: Array,
  taskQueue: Array,
  // Research will be laid out as follows: [English, Mathematics, Humanities,
  // Fine Arts, Communications, Science, Social Sciences, Spying, Embarassing,
  // Stealing, Finding Error, Food Efficiency, Brain Efficiency, Time Efficiency]
  research: Array,
});

// Create a model for users
const UserData = mongoose.model('UserData', userDataSchema);

router.post('/', validUser, async (req, res) => {
  try {
    // Get the user requesting to add data.
    const userToAdd = new UserData({
      user: req.user,
      academicPrestige: req.body.academicPrestige,
      yearInSchool: req.body.yearInSchool,
      degreeStatus: req.body.degreeStatus,
      assignmentsEnglish: req.body.assignmentsEnglish,
      assignmentsMathematics: req.body.assignmentsMathematics,
      assignmentsHumanities: req.body.assignmentsHumanities,
      assignmentsFineArts: req.body.assignmentsFineArts,
      assignmentsCommunications: req.body.assignmentsCommunications,
      assignmentsScience: req.body.assignmentsScience,
      assignmentsSocialSciences: req.body.assignmentsSocialSciences,
      taskQueue: req.body.taskQueue,
      research: req.body.research
    });
    await userToAdd.save();
    res.send(userToAdd);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get('/', validUser, async (req, res) => {
  try {
    const userFound = UserData.findOne({user: req.user}, async function (err, user) {
      if (err) {
        res.send(500);
        return;
      }
      if (!user) {
        res.send(404);
        return;
      } else {
        res.send(user);
      }
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// router.put('/api/users/:userID/login', async (req, res) => {
//   try {
//     const user = await UserData.findOne({_id: req.params.userID});
//     if (!user) {
//       res.sendStatus(404);
//       return;
//     }
//     user.lastLoggedIn = req.body.lastLoggedIn;
//     await user.save();
//     res.send(user);
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(500);
//   }
// });

router.put('/add-task', validUser, async (req, res) => {
  try {
    const user = await UserData.findOne({user: req.user});
    if (!user) {
      res.sendStatus(404);
      return;
    }
    user.assignmentsEnglish = req.body.assignmentsEnglish;
    user.assignmentsScience = req.body.assignmentsScience;
    user.assignmentsFineArts = req.body.assignmentsFineArts;
    user.assignmentsHumanities = req.body.assignmentsHumanities;
    user.assignmentsMathematics = req.body.assignmentsMathematics;
    user.assignmentsCommunications = req.body.assignmentsCommunications;
    user.assignmentsSocialSciences = req.body.assignmentsSocialSciences;
    await user.save();
    res.send(user);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.put('/update-task-queue', validUser, async (req, res) => {
  try {
    const user = await UserData.findOne({user: req.user});
    if (!user) {
      res.sendStatus(404);
      return;
    }
    user.taskQueue = req.body.taskQueue;
    await user.save();
    res.send(user);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.delete('/delete', validUser, async (req, res) => {
  try {
    await UserData.deleteOne({user: req.user});
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Schema for resources
const resourceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectID,
    ref: 'User'
  },
  food: Number,
  brainPower: Number,
  time: Number,
  maxFood: Number,
  maxBrainPower: Number,
  maxTime: Number
});

// Model for resources
const Resource = mongoose.model('Resource', resourceSchema);

router.post('/resources', validUser, async (req, res) => {
  try {
    let resources = new Resource({
      user: req.user._id,
      food: req.body.food,
      brainPower: req.body.brainPower,
      time: req.body.time,
      maxFood: req.body.maxFood,
      maxBrainPower: req.body.maxBrainPower,
      maxTime: req.body.maxTime
    });
    await resources.save();
    res.send(resources);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get('/resources', validUser, async (req, res) => {
  try {
    let resources = await Resource.findOne({user: req.user});
    res.send(resources);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.put('/resources', validUser, async (req, res) => {
  try {
    let resources = await Resource.findOne({user: req.user});
    if (!resources) {
      res.send(404);
      return;
    }
    resources.food = req.body.food;
    resources.brainPower = req.body.brainPower;
    resources.time = req.body.time;
    resources.maxFood = req.body.maxFood;
    resources.maxBrainPower = req.body.maxBrainPower;
    resources.maxTime = req.body.maxTime;
    await resources.save();
    res.send(resources);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.delete('/resources/delete', validUser, async (req, res) => {
  try {
    await Resource.deleteOne({user: req.user});
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = {
  routes: router,
  userData: UserData,
  resources: Resource
};
