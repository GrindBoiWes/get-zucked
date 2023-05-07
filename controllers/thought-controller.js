const { Thought } = require('../models');
const { User } = require('../models');

const thoughtController = {

  getAllThoughts(req,res) {
    Thought.find({})
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err)
      });
  },

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

  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: body }},
        { new: true, runValidators: true }
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

  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
        { _id: params.thoughtid },
        { $pull: {reactions: { reactionId: params.reactionId}}},
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
  };

};

module.exports = thoughtController;

