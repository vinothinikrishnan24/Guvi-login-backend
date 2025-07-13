import nodemailer from 'nodemailer';
import { randomInt } from 'crypto';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vinothinikrishnan24@gmail.com',
    pass: 'llcn tquo qoxc povx',
  },
});

export const generateRandomCode = (length = 6) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += characters.charAt(randomInt(characters.length));
  }
  return code;
};

export const sendResetCode = async (email) => {
  if (!email) {
    return {
      status: 400,
      data: { message: 'Email is required' },
    };
  }

  const user = await User.findOne({ email });
  if (!user) {
    return {
      status: 404,
      data: { message: 'User not found' },
    };
  }

  const code = generateRandomCode();
  const resetLink = `${process.env.url}/reset-password`;

  // Store code and expiry in User document
  try {
    user.code = code;
    user.expires = Date.now() + 3600000; // 1 hour expiry
    await user.save();
  } catch (error) {
    console.error('Error storing reset code:', error);
    return {
      status: 500,
      data: { message: 'Failed to store reset code' },
    };
  }

  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const templatePath = join(__dirname, '../templates/resetPasswordEmail.html');
    let htmlTemplate = await readFile(templatePath, 'utf8');
    htmlTemplate = htmlTemplate.replace('{{code}}', code);
    htmlTemplate = htmlTemplate.replace('{{email}}', email);
    htmlTemplate = htmlTemplate.replace('{{resetLink}}', resetLink);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Code',
      html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
    return {
      status: 200,
      data: { message: 'Password reset code sent to your email' },
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      status: 500,
      data: { message: 'Failed to send reset code' },
    };
  }
};

export const handleRegister = async ({ username, email, password }) => {
  if (!username || !email || !password) {
    return {
      status: 400,
      data: { message: 'Please fill all the fields' },
    };
  }

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return {
      status: 400,
      data: { message: 'Email already exists' },
    };
  }

  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    return {
      status: 400,
      data: { message: 'Username already exists' },
    };
  }

  const user = await User.create({ username, email, password });
  const token = generateToken(user._id);

  return {
    status: 201,
    data: {
      id: user._id,
      username: user.username,
      email: user.email,
      token,
    },
  };
};

export const handleLogin = async ({ email, password }) => {
  if (!email || !password) {
    return {
      status: 400,
      data: { message: 'Please fill all the fields' },
    };
  }

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return {
      status: 401,
      data: { message: 'Invalid credentials' },
    };
  }

  const token = generateToken(user._id);
  return {
    status: 200,
    data: {
      id: user._id,
      username: user.username,
      email: user.email,
      token,
    },
  };
};

export const verifyResetCode = async (code) => {
  if (!code) {
    return {
      status: 400,
      data: { message: 'Code is required' },
    };
  }
  const user = await User.findOne({ code });
  if (!user) {
    return {
      status: 400,
      data: { message: 'Invalid or expired code' },
    };
  }

  if (Date.now() > user.expires) {
    user.code = null;
    user.expires = null;
    await user.save();
    return {
      status: 400,
      data: { message: 'Code has expired' },
    };
  }

  return {
    status: 200,
    data: { message: 'Code is valid', email: user.email },
  };
};

export const resetPassword = async ({ code, password }) => {
  if (!code || !password) {
    return {
      status: 400,
      data: { message: 'Code and password are required' },
    };
  }

  const user = await User.findOne({ code });
  if (!user) {
    return {
      status: 400,
      data: { message: 'Invalid or expired code' },
    };
  }

  if (Date.now() > user.expires) {
    user.code = null;
    user.expires = null;
    await user.save();
    return {
      status: 400,
      data: { message: 'Code has expired' },
    };
  }

  // Update user's password and clear reset code fields
  user.password = password;
  user.code = null;
  user.expires = null;
  await user.save();

  return {
    status: 200,
    data: { message: 'Password has been reset successfully' },
  };
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};