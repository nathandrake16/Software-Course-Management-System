import mongoose from "mongoose";

const sectionSchema = mongoose.Schema({
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
    section_number: {
        type: Number,
        unique: true, // Ensure this is unique if required
        required: true // Make sure to set this when creating a section
    }
}, { timestamps: true });

const Section = mongoose.models.sections || mongoose.model("sections", sectionSchema);

export default Section;