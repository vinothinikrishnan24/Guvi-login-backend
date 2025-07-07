import {
  handleRegister,
  handleLogin,
  sendResetCode,
  resetPassword,
  verifyResetCode,
} from "../services/auth.services.js"

export const registerUser = async (req, res) => {
  try {
    const result = await handleRegister(req.body);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const result = await handleLogin(req.body);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Forgot Password Controller
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await sendResetCode(email);
    res.json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('Error in forgotPassword controller:', error);
    res.status(500).json({ message: 'Failed to send reset email' });
  }
};

// Reset Password Controller
export const resetPasswords = async (req, res) => {
  try {
    const { code, password } = req.body;
    await resetPassword(code, password);
    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Error in resetPassword controller:', error);
    res.status(400).json({ message: error.message || 'Failed to reset password' });
  }
};

export const verifyResetCodes = async (req, res) => {
  try {
    const { code } = req.body;
    const data = await verifyResetCode(code);
    return res.status(data.status).json(data.data);
  } catch (error) {
    console.error('Error in resetPassword controller:', error);
    res.status(400).json({ message: error.message || 'Failed to reset password' });
  }
};