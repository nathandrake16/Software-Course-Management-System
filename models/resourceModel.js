import mongoose from "mongoose";

const resourceSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    resource: {
        type: String,
        required: false 
    },
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
        required: true
    }
}, { timestamps: true });

const Resource = mongoose.models.resources || mongoose.model("resources", resourceSchema);

export default Resource;