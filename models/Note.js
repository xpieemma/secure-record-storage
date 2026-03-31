import { Schema, model } from 'mongoose';

const noteSchema = new Schema({ // Define the note schema
  title: { // The title of the note
    type: String,
    required: true,
    trim: true,
  },
  content: { // The content of the note
    type: String,
    required: true,
  },
  createdAt: { // The date the note was created
    type: Date,
    default: Date.now,
  },
  user: { // The user who created the note
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Note = model('Note', noteSchema); // Create the Note model
export default Note; // Export the Note model
