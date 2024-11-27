import jwt from "jsonwebtoken";

const generateTokenAndSetCookies = (id, res) => {
  // Generate JWT
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

  // Set token in HTTP-only cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Secure in production
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token;
};

export default generateTokenAndSetCookies;
