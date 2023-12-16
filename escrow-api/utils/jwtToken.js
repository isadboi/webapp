const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

module.exports.createToken = (user, res) => {
  const token = jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      verifiedDate: user.verifiedDate,
      role: user.role,
      bio: user.bio,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
  res.status(StatusCodes.OK).json({
    token,
  });
};
