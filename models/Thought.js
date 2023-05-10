const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');
// Creates the database for newly added reaction
const ReactionSchema = new Schema (
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
    
        reactionBody: {
            type: String,
            required: true,
            maxLength: 280,
        },
    
        username: {
            type: String,
            required: true,
        },
    
        createdAt: {
            type: Date,
            default: Date.now,
            get: (timestamp) => new Date(timestamp).toLocaleDateString(),
        },
    },
    {
        toJSON: {
            getters: true,
        },
        id: false,
    }
);
// Creates the thought database with specific parameters
const ThoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxLength: 280,
        },
    
        createdAt: {
            type: Date,
            default: Date.now,
            get: (timestamp) => new Date(timestamp).toLocaleDateString(),
        },
    
        username: {
            type: String,
            required: true,
        },
   
        reactions: [ReactionSchema],
    },
    {
        toJSON: {
            getters: true,
        },
        id: false,
    }
);
// This will return the length of the reactions array
ThoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;