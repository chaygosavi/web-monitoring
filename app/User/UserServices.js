import bcrypt from "bcrypt";
import UserSchema from "./UserSchema";

const verifyEmail = (email) => {
  return email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
};

export const signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        status: false,
        message: "All Fields are required",
      });
    }

    if (!verifyEmail(email)) {
      return res.status(400).json({
        status: false,
        message: "Email is not Valid",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 9);

    const newUser = new UserSchema({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      status: true,
      message: "User Successfully Created",
      data: newUser,
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: "Error creating user",
      error,
    });
  }
};
