const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { User } = require('../models');

// Get user's followers
router.get('/:userId/followers', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('followers', 'username profileImage bio')
      .select('followers');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.followers);
  } catch (error) {
    console.error('Error fetching followers:', error);
    res.status(500).json({ message: 'Error fetching followers' });
  }
});

// Get user's following
router.get('/:userId/following', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('following', 'username profileImage bio')
      .select('following');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.following);
  } catch (error) {
    console.error('Error fetching following:', error);
    res.status(500).json({ message: 'Error fetching following' });
  }
});

// Check if current user is following target user
router.get('/:userId/is-following', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const isFollowing = currentUser.following.includes(req.params.userId);
    res.json(isFollowing);
  } catch (error) {
    console.error('Error checking follow status:', error);
    res.status(500).json({ message: 'Error checking follow status' });
  }
});

// Follow a user
router.post('/:userId/follow', auth, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user.id);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (currentUser.following.includes(targetUser._id)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    currentUser.following.push(targetUser._id);
    targetUser.followers.push(currentUser._id);

    await Promise.all([currentUser.save(), targetUser.save()]);

    res.json({ message: 'Successfully followed user' });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ message: 'Error following user' });
  }
});

// Unfollow a user
router.delete('/:userId/unfollow', auth, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user.id);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!currentUser.following.includes(targetUser._id)) {
      return res.status(400).json({ message: 'Not following this user' });
    }

    currentUser.following = currentUser.following.filter(
      id => id.toString() !== targetUser._id.toString()
    );
    targetUser.followers = targetUser.followers.filter(
      id => id.toString() !== currentUser._id.toString()
    );

    await Promise.all([currentUser.save(), targetUser.save()]);

    res.json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ message: 'Error unfollowing user' });
  }
});

module.exports = router; 