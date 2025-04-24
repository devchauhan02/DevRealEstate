
import User from '../models/user.model.js';
import Listing from '../models/listing.model.js';
import bcrypt from 'bcryptjs';

export const updateProfilePic = async (req, res) => {
  const { profilePic } = req.body;
  const userId = req.user.id; // Assuming you have user authentication

  try {
    const user = await User.findByIdAndUpdate(userId, { profilePic }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Profile picture updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile picture', error });
  }
};


export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, profilePic } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    let updated = false;

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    if (profilePic) user.profilePic = profilePic;

    // Save the updated user
    const updatedUser = await user.save();

    res.status(200).json({
      message: 'User updated successfully!',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profilePic: updatedUser.profilePic,
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteUser = async (req, res , next) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ message: 'You can only delete your own account' });
  }
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully!' });
  } catch (error) {
    next(error);
  }
};  

export const getUserListings = async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ message: 'You can only view your own listing' });
  }
  const { id } = req.params;

  try {
    const listings = await Listing.find({ userRef: id }).populate('userRef', 'name profilePic');  
    if (!listings) {
      return res.status(404).json({ message: 'No listings found for this user' });
    }
    res.status(200).json(listings);
  }catch (error) { 
    
    res.status(500).json({ message: 'Error fetching user listings', error });
  }
}