import mongoose from "mongoose";
import validator from "validator";




const userSchema = new mongoose.Schema(
  {

    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email address",
      }
    },
    hashedPassword: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: {
        values: ['Employer', 'Jobsekeer'],
        message: 'Role must be employer or jobsekeer'
      },
    required: true
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
  },
});

const User = mongoose.model("User", userSchema);

export default User
