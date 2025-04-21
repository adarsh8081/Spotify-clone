const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { User } = require('../models');

// Get current user profile
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('playlists')
      .populate('likedSongs')
      .populate('following', 'name email profileImage')
      .populate('followers', 'name email profileImage');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
});

// Update user profile
router.put('/me', authenticate, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = password;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user profile',
      error: error.message
    });
  }
});

// Delete user account
router.delete('/me', authenticate, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);

    res.json({
      success: true,
      message: 'User account deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user account',
      error: error.message
    });
  }
});

// Follow a user
router.post('/:id/follow', authenticate, async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself'
      });
    }

    const userToFollow = await User.findById(req.params.id);
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const currentUser = await User.findById(req.user.id);

    // Check if already following
    if (currentUser.following.includes(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already following this user'
      });
    }

    // Add to following and followers
    currentUser.following.push(req.params.id);
    userToFollow.followers.push(req.user.id);

    await Promise.all([currentUser.save(), userToFollow.save()]);

    res.json({
      success: true,
      message: 'Successfully followed user'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error following user',
      error: error.message
    });
  }
});

// Unfollow a user
router.post('/:id/unfollow', authenticate, async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot unfollow yourself'
      });
    }

    const userToUnfollow = await User.findById(req.params.id);
    if (!userToUnfollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const currentUser = await User.findById(req.user.id);

    // Check if not following
    if (!currentUser.following.includes(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'You are not following this user'
      });
    }

    // Remove from following and followers
    currentUser.following = currentUser.following.filter(
      id => id.toString() !== req.params.id
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== req.user.id
    );

    await Promise.all([currentUser.save(), userToUnfollow.save()]);

    res.json({
      success: true,
      message: 'Successfully unfollowed user'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error unfollowing user',
      error: error.message
    });
  }
});

// Get user's followers
router.get('/:id/followers', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('followers')
      .populate('followers', 'name email profileImage');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      followers: user.followers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching followers',
      error: error.message
    });
  }
});

// Get user's following
router.get('/:id/following', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('following')
      .populate('following', 'name email profileImage');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      following: user.following
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching following users',
      error: error.message
    });
  }
});

module.exports = router; 