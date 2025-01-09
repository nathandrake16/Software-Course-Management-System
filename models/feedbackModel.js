import mongoose from "mongoose";

const feedbackSchema = mongoose.Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'groups',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    student_progresss: {
        type: String,
        required: true
    },
}, { timestamps: true });

const Feedback = mongoose.models.feedbacks || mongoose.model("feedbacks", feedbackSchema);

export default Feedback;
