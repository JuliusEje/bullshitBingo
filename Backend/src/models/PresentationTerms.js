import mongoose from "mongoose";

const PresentationTermsSchema = new mongoose.Schema({
	phrase: {
		type: String,
		required: true,
		unique: true,
	},
});

const PresentationTerms = mongoose.model(
	"PresentationTerms",
	PresentationTermsSchema,
	"presentation"
);

export default PresentationTerms;
