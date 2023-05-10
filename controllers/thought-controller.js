const { Thought } = require('../models');
const { User } = require('../models');

const thoughtController = {
// fetches all thoughts
  getAllThoughts(req,res) {
    Thought.find({})
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err)
      });
  },
// finds the user's thoughts based off of their id
  getThoughtById({ params }, res) {
    Thought.findOne({_id: params.thoughtId})
      .then((dbThoughtData) => {
        if(!dbThoughtData) {
            res.status(404).json({ message: 'No thought has been found with this ID!'});
            return;
        }
        res.json(dbThoughtData)
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
// create a thought that is attached to the user id
  createThought({ body }, res) {
    Thought.create(body)
      .then((dbThoughtData) => {
        return User.findOneAndUpdate(
            { _id: body.userId },
            { $push: {thoughts: dbThoughtData._id}},
            { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user has been found with this ID!'});
            return;
        }
        res.json(dbUserData)
      })
      .catch((err) => 
       res.json(err));
  },
// updates thought based off of the user/thought id
  updateThought({ params, body}, res) {
    Thought.findOneAndUpdate({ _id: params.thoughtId }, body, {
        new: true,
        runValidators: true,
    })
    .then((dbThoughtData) => {
        if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought has been found with this ID!'});
            return;
        }
        res.json(dbThoughtData);
    })
    .catch((err) =>
      res.json(err));
  },
// deletes thoughts based off of the thought id
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought has been found with this ID!'});
            return;
        }
        return User.findOneAndUpdate(
            { thoughts: params.thoughtId},
            { $pull: { thoughts: params.thoughtId }},
            { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
            res.status(404).json({ message: ' No user has been found with this ID!'});
            return;
        }
        res.json(dbUserData);
      })
      .catch((err) => 
        res.status(400).json(err));
      },
// add's a reaction and links it with the user/thought id
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: body }},
        { new: true }
    )
    .then((dbThoughtData) => {
        if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought has been found with this ID!'});
            return;
        }
        res.json(dbThoughtData);
    })
    .catch((err) =>
      res.json(err));
  },
// deletes a reaction using the thought and reaction id
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: {reactions: { _id: params.reactionId}}},
        { new: true }
    )
    .then((dbThoughtData) => {
        if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought has been found with this ID!'});
            return;
        }
        res.json(dbThoughtData);
    })
    .catch((err) =>
      res.status(400).json(err));
  }

};

module.exports = thoughtController;

