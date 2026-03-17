const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    skinType: { type: String, required: true },
    question1: { type: String, required: true },
    question2: { type: [String], default: [] },
    feedback: { type: String, required: true },
    consent: { type: Boolean, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assessment", assessmentSchema);

