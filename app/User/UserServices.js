import bcrypt from "bcrypt";
import UserSchema from "./UserSchema.js";
import jwt from "jsonwebtoken";

const secretKey = "MY_SECRET_KEY";

const generateToken = (data, exp = Date.now() / 1000 + 24 * 60 * 60) => {
  const token = jwt.sign(
    {
      exp,
      data,
    },
    secretKey
  );
  return token;
};

const decodeToken = (token) => {
  let data;
  try {
    data = jwt.verify(token, secretKey);
  } catch (error) {
    console.log(error);
  }
  return data;
};

export const generateNewAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({
      status: false,
      message: "Refresh Token Required",
    });
  }

  const user = await UserSchema.findOne({
    "tokens.refreshToken.token": refreshToken,
  });

  if (!user) {
    return res.status(422).json({
      status: false,
      message: "User Not Found",
    });
  }
  const aToken = generateToken({ email: user.email, name: user.name });

  user.tokens.accessToken = {
    token: aToken,
    expiredAt: new Date(Date.now() + 24 * 60 * 60),
  };

  await user.save();
  return res.status(201).json({
    status: true,
    message: "Access Tokens Created",
    data: user,
  });
};

const verifyEmail = (email) => {
  return email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
};

export const signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      status: false,
      message: "All Fields are required",
    });
  }

  try {
    if (!verifyEmail(email)) {
      return res.status(400).json({
        status: false,
        message: "Email is not Valid",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 9);

    const aToken = generateToken({ name, email });
    const rToken = generateToken(
      { name, email },
      Date.now() / 1000 + 20 * 24 * 60 * 60
    );

    const newUser = new UserSchema({
      name,
      email,
      password: hashedPassword,
      tokens: {
        accessToken: {
          token: aToken,
          expiredAt: new Date(Date.now() + 24 * 60 * 60),
        },
        refreshToken: {
          token: rToken,
          expiredAt: new Date(Date.now() + 20 * 24 * 60 * 60),
        },
      },
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

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
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

    const user = await UserSchema.findOne({ email });

    if (!user) {
      return res.status(422).json({
        status: false,
        message: "Invalid Email",
      });
    }

    const dbPassword = user.password;

    const comparison = bcrypt.compare(password, dbPassword);

    if (!comparison) {
      return res.status(422).json({
        status: false,
        message: "Invalid Credentials",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Login Successful",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: "Error creating user",
      error,
    });
  }
};
