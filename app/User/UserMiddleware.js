import UserSchema from "./UserSchema";

export const authenticateUserMiddleware = async (req, res, next) => {
  console.log(req.headers.authorization);
  const token = req.headers.authorization;

  if (!token) {
    return res.status(400).json({
      status: false,
      message: "Token Not Found",
    });
  }

  const user = await UserSchema.findOne({ "tokens.accessToken.token": token });

  if (!user) {
    return res.status(422).json({
      status: false,
      message: "Invalid Token",
    });
  }

  req.user = user;
  next();
};
