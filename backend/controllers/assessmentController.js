const Assessment = require("../models/Assessment");

exports.submitAssessment = async (req, res) => {
  try {
    const { name, skinType, question1, question2, feedback, consent } = req.body || {};

    if (!name || !skinType || !question1 || !feedback) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (!consent) {
      return res.status(400).json({ error: "Consent is required" });
    }

    const doc = await Assessment.create({
      name,
      skinType,
      question1,
      question2: Array.isArray(question2) ? question2 : [],
      feedback,
      consent: Boolean(consent),
    });

    return res.json({ message: "Assessment submitted successfully", id: doc._id.toString() });
  } catch (err) {
    console.error("submitAssessment error:", err);
    return res.status(500).json({ error: "Failed to submit assessment" });
  }
};

