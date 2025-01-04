import mongoose from "mongoose";

const groupSchema = mongoose.Schema({
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sections', // Reference to the Section model
        required: true
    },
    students: [{
        name: String,
        university_email: String,
    }],
    group_number: {
        type: Number,
        required: true,
        unique: true
    },
    progress: {
        string: {
            type: String,
            default: "Group Formed"
        },
        details: { // This field will store the progress details
            type: String,
            default: ""
        },
        isApproved: {
            type: Boolean,
            default: false
        }
    }
}, { timestamps: true });

const Group = mongoose.models.groups || mongoose.model("groups", groupSchema);

export default Group;