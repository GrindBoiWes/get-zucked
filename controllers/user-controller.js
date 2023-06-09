const { User } = require('../models/');
// fetches all users
const userController = {
    async getAllUsers(req,res) {
        try {
            const users = await User.find({}).populate('thoughts').populate('friends');
            res.json(users);
        } catch (err) {
            console.error('Error in getAllUsers!!', err)
            res.status(500).json(err)
        }
    },
// finds user based off of their unique id 
    async getUserById(req,res) {
        try {
            const user = await User.findById(req.params.id).populate('thoughts').populate('friends');
            res.json(user)
        } catch (err) {
            console.error('Error in getUserById!!', err);
            res.status(500).json(err);
        }
    },
// creates a new user and assigns it a unique id
    async createUser(req,res) {
        try {
            const user = await User.create(req.body);
            res.json(user)
        } catch (err) {
            console.error('Error in createUser!!', err);
            res.status(500).json(err)
        }
    },
// updates user by finding their id
    async updateUser(req,res) {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true});
            res.json(user);
        } catch (err) {
            console.error('Error in updateUser!!', err);
            res.status(500).json(err);
        }
    },
// deletes user by user id
    async deleteUser(req,res) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.json(user);
        } catch (err) {
            console.error('Error in deleteUser!!', err)
            res.status(500).json(err)
        }
    },
// adds a friend through their user id
    async addFriend(req,res) {
        try {
            const user = await User.findByIdAndUpdate(
                req.params.userId,
                { $addToSet: {friends: req.params.friendId}},
                { new: true }
            );
            res.json(user);
        } catch (err) {
            console.error('Error in addFriend!!', err);
            res.status(500).json(err)
        }
    },
// deletes a user through their unique id
    async removeFriend(req,res) {
        try {
            const user = await User.findByIdAndUpdate(
                req.params.userId,
                { $pull: {friends: req.params.friendId }},
                { new: true }
            );
            res.json(user);
        } catch (err) {
            console.error('Error in removeFriend!!', err);
            res.status(500).json(err)
        }
    }
};

module.exports = userController;