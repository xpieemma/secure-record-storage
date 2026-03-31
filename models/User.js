import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({ // Define the user schema
  username: { // The username of the user
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: { // The email of the user
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Must use a valid email address'],
  },
  password: { // The password of the user
    type: String,
    required: true,
    minlength: 5,
  },
});

userSchema.pre('save', async function (next) {  // Hash the password before saving
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
 // next(); // next is not a function it would not work, it would throw an error "next is not a function"
});

userSchema.methods.isCorrectPassword = async function (password) { // Compare the password with the hashed password
  return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema); // Create the User model
export default User; // Export the User model