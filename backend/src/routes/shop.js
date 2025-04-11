import express from 'express';
import { protect } from '../middleware/auth.js';
import ShopItem from '../models/ShopItem.js';
import User from '../models/User.js';

const router = express.Router();

// Get all shop items
router.get('/', async (req, res) => {
  try {
    const items = await ShopItem.find({ isActive: true });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Purchase an item
router.post('/purchase/:itemId', protect, async (req, res) => {
  try {
    const item = await ShopItem.findById(req.params.itemId);
    const user = await User.findById(req.user._id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (!item.isActive) {
      return res.status(400).json({ message: 'Item is not available' });
    }

    if (user.coins < item.price) {
      return res.status(400).json({ message: 'Not enough coins' });
    }

    // Check if user already owns the item
    const existingItem = user.inventory.find(
      invItem => invItem.itemId.toString() === item._id.toString()
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.inventory.push({
        itemId: item._id,
        quantity: 1
      });
    }

    // Deduct coins
    user.coins -= item.price;

    await user.save();

    res.json({
      message: 'Purchase successful',
      user: {
        coins: user.coins,
        inventory: user.inventory
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's inventory
router.get('/inventory', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('inventory.itemId');
    res.json(user.inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 