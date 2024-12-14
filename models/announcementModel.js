import mongoose from "mongoose";

const announcementSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    sections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sections' 
    }]
}, { 
    timestamps: true 
});

const Announcement = mongoose.models.announcements || mongoose.model("announcements", announcementSchema);

export default Announcement;
