const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

// Helper function to check if user is logged in
function isUserAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Please log in first" });
}

// 1. GET all notes for the LOGGED-IN user only
router.get("/", isUserAuthenticated, async (req, res) => {
  try {
    const userNotes = await Note.find({ owner: req.user._id }); 
    res.json(userNotes);
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// 2. POST a new note linked to the user
router.post("/", isUserAuthenticated, async (req, res) => {
  try {
    const newNote = new Note({
    title: req.body.title,
    content: req.body.content,
    owner: req.user._id 
  });
  await newNote.save();
  res.json(newNote);
  } catch (err) {
    res.status(400).json({ error: "Could not save note" });
  }
  
});

// 3. PATCH (Update) a specific note
router.patch("/:id", isUserAuthenticated, async (req, res) => {
  try {
    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id }, // Ensure they own it!
      { $set: req.body },
      { new: true }
    );
    if (!updatedNote) return res.status(404).send({message : "Note not found"});
    res.json(updatedNote);
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// 4. DELETE a specific note
router.delete("/:id", isUserAuthenticated, async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({ 
      _id: req.params.id, 
      owner: req.user._id 
    });
    if (!deletedNote) return res.status(404).send({message : "Note not found"});
    res.status(200).send("Deleted successfully");
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;