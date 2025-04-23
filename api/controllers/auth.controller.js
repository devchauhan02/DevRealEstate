import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  console.log("Received signup data:", { name, email, password });


  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      { id: savedUser._id, email: savedUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' } 
    );
    
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'Strict',
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
      },
      token,
    });
  } catch (error) {
    console.error('Error during sign-up:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const signin = async (req, res) => {
    console.log('Request body:', req.body);
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log('User found:', user);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isPasswordValid); 
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    console.log('Generated token:', token);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'Strict',
    });

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic || '',
      },
      token, 
    });
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const googleSignIn = async (req, res, next) => {
  const { name, email, profilePic } = req.body;

  if (!name || !email || !profilePic) {
    return res.status(400).json({ message: 'Please fill all the fields!' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const token = jwt.sign(
        { id: existingUser._id, email: existingUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'Strict',
      });
  
      existingUser.password = undefined;

      return res.status(200).json({
        message: 'User signed in successfully!',
        user: {
          id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          profilePic: existingUser.profilePic, // Include profilePic in the response
        },
        token, // Include the token in the response
      });
    }

    // Generate a random password for new users
    const generatedPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    // Create a new user
    const newUser = new User({
      name: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4),
      email,
      password: hashedPassword,
      profilePic,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
    newUser.password = undefined;

    return res.status(201).json({
      message: 'User signed up successfully!',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profilePic: newUser.profilePic, // Include profilePic in the response
      },
      token, // Include the token in the response
    });
  } catch (error) {
    console.error('Error during Google Sign-In:', error);
    next(error);
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
