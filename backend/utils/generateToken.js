import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role.toUpperCase(), 
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export { generateToken };