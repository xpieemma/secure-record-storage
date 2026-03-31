import { Router } from 'express';
import Note from '../../models/Note.js';
import { authMiddleware } from '../../utils/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }); // Find all notes for the current user
    res.json(notes);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id); // Find the note by id
    if (!note) {
      return res.status(404).json({ message: 'No note found with this id!' }); // Return an error if the note is not found
    }
    if (!note.user.equals(req.user._id)) {
      return res.status(403).json({ message: 'User is not authorized to view this note.' }); // Return an error if the user is not authorized to view the note
    }
    res.json(note);
  } catch (err) {
    res.status(500).json(err); // Return an error if the note retrieval fails
  }
});


router.post('/', async (req, res) => {
  try {
    const note = await Note.create({ // Create the note
      ...req.body, // Spread the request body
      user: req.user._id, // Set the user id
    });
    res.status(201).json(note); // Return the created note
  } catch (err) {
    res.status(400).json(err); // Return an error if the note creation fails
  }
});


router.put('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id); // Find the note by id
    if (!note) {
      return res.status(404).json({ message: 'No note found with this id!' }); // Return an error if the note is not found
    }
    if (!note.user.equals(req.user._id)) {
      return res.status(403).json({ message: 'User is not authorized to update this note.' }); // Return an error if the user is not authorized to update the note
    }
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Update the note
    res.json(updatedNote);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id); // Find the note by id
    if (!note) {
      return res.status(404).json({ message: 'No note found with this id!' }); // Return an error if the note is not found
    }
    if (!note.user.equals(req.user._id)) {
      return res.status(403).json({ message: 'User is not authorized to delete this note.' }); // Return an error if the user is not authorized to delete the note
    }
    await Note.findByIdAndDelete(req.params.id); // Delete the note
    res.json({ message: 'Note deleted!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;