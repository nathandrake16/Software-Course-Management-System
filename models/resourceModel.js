import mongoose from "mongoose";

const resourceSchema = mongoose.Schema({
    course: {
        type: String,
        required: true,
        enum: ['CSE370', 'CSE470', 'CSE471']
    },
    semester: {
        type: String,
        required: true,
        enum: ['FALL24', 'SPRING25', 'SUMMER25']
    },
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }],
    resources: {
        type: String,

        required: true // Make sure to set this when creating a section
    }
}, { timestamps: true });

const Resource = mongoose.models.resources || mongoose.model("resources", resourceSchema);

export default Resource;