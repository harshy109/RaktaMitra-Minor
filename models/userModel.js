const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  aadhar: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  },
  emergencyContact: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
  },
  medicalHistory: { type: String },
  password: { type: String, required: true },
});

userSchema.index({ location: '2dsphere' });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);