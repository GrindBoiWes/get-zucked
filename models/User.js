const { Schema, model } = require('mongoose');
// Creates user database with a username, email, thoughts, and friends
const UserSchema = new Schema ({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Enter A Valid Email!']
    },

    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thought',
        },
    ],

    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
    ],
  },
  {
    toJSON: {
        virtuals: true,
    },
    id: false,
  });
// This will return the length of the friends array
  UserSchema.virtual('friendCount').get(function () {
    return this.friends.length;
  });

const User = model('User', UserSchema);

module.exports = User;