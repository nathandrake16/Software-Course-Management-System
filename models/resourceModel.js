// models/resourceModel.js
import mongoose from "mongoose";

const resourceSchema = mongoose.Schema({
    course: {
        type: String,
        required: true,
        enum: ["CSE370", "CSE470", "CSE471"], // Only allow specific courses
    },
    link: {
        type: String,
        required: true,
        trim: true, // Remove extra spaces from the link
    },
    isApproved: {
        type: Boolean,
        default: false, // Default value is false (pending approval)
    },
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

const Resource = mongoose.models.resources || mongoose.model("resources", resourceSchema);

export default Resource;