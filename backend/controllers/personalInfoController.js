const PersonalInfo = require('../models/PersonalInfo');

exports.createPersonalInfo = async (req, res) => {
  try {
    console.log("Incoming Request Body:", req.body);
    const personalInfo = new PersonalInfo(req.body);
    await personalInfo.save();
    res.status(201).json({ message: "Saved successfully!", personalInfo });
  } catch (error) {
    console.error("Error saving data:", error.message);
    res.status(400).json({ error: error.message });
  }
};

exports.getAllPersonalInfo = async (req, res) => {
  try {
    const infos = await PersonalInfo.find();
    res.status(200).json(infos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPersonalInfoById = async (req, res) => {
  try {
    const info = await PersonalInfo.findById(req.params.id);
    if (!info) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePersonalInfo = async (req, res) => {
  try {
    const updated = await PersonalInfo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.status(200).json({ message: "Updated successfully!", updated });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePersonalInfo = async (req, res) => {
  try {
    const deleted = await PersonalInfo.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get personal info for the logged-in user (by token)
exports.getPersonalInfoByToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const info = await PersonalInfo.findOne({ userId });
    if (!info) return res.status(404).json({ message: 'No personal info found.' });
    res.json(info);
  } catch (err) {
    console.error('PersonalInfo fetch error:', err); // log error
    res.status(500).json({ message: 'Server error.' });
  }
};

// Create or update personal info for the logged-in user (by token)
exports.createOrUpdatePersonalInfoByToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const update = req.body;
    const info = await PersonalInfo.findOneAndUpdate(
      { userId },
      { ...update, userId },
      { new: true, upsert: true }
    );
    res.json({ message: 'Personal info saved successfully!', data: info });
  } catch (err) {
    console.error('PersonalInfo save error:', err); // log error
    res.status(500).json({ message: 'Server error.' });
  }
};
