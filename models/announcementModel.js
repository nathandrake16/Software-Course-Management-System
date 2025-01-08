import mongoose from "mongoose";

const announcementSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    sections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sections' 
    }],
    deadline: {
        type: Date,
        required: false
    }
}, { 
    timestamps: true 
});

const Announcement = mongoose.models.announcements || mongoose.model("announcements", announcementSchema);

export default Announcement;
