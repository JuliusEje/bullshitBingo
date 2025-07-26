import mongoose from "mongoose";

const MeetingBingoFieldSchema = new mongoose.Schema({
	phrase: {
		type: String,
		required: true,
		unique: true,
	},
});

const MeetingBingoField = mongoose.model(
	"MeetingBingoField",
	MeetingBingoFieldSchema,
	"meetings"
);

export default MeetingBingoField;
