import mongoose from "mongoose";

const InformaticsLectureTermSchema = new mongoose.Schema({
	term: {
		type: String,
		required: true,
		unique: true,
	},
});

const InformaticsLectureTerm = mongoose.model(
	"InformaticsLectureTerm",
	InformaticsLectureTermSchema,
	"lectures"
);

export default InformaticsLectureTerm;
