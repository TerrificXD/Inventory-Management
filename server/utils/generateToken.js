const jwt = require("jsonwebtoken");

// This function generates a JWT token for a user
// It takes a user object as an argument and returns a signed token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, user: user.role, company: user.company }, // Include user ID, role, and company in the token payloa
    process.env.JWT_SECRET, // Use the secret key from environment variables
    { expiresIn: "1d" } // Set the token to expire in 1 day
  );
};

module.exports = generateToken;