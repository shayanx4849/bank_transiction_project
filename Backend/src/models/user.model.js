import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: [true, "Email already exist"],
      required: [true, "Email are required for register user"],
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid Email address",
      ],
    },
    password: {
      type: String,
      required: [true, "password are required for register user"],
      minlength: [6, "password should contain more than 6 character"],
      select: false,
    },
    name: {
      type: String,
      required: [true, "name are required for register user"],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  return;
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
