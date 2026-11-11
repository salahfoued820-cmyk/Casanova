import { Router, Request, Response } from 'express';
import { getAllGames, getGameBySlug, getJackpotGames, createGame } from '../controllers/game.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import User from '../models/User';

const router = Router();
const ADMIN_PIN = "salah2026";

// 1. جلب قائمة جميع اللاعبين وأرصدتهم
router.get('/admin/users', async (req: Request, res: Response) => {
  try {
    if (req.headers['x-admin-pin'] !== ADMIN_PIN) {
      return res.status(403).json({ success: false, message: 'كلمة سر الأدمن غير صحيحة' });
    }
    const users = await User.find({}, 'username email firstName lastName balance createdAt').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. شحن رصيد بالدينار التونسي (TND) لأي لاعب
router.post('/admin/deposit', async (req: Request, res: Response) => {
  try {
    if (req.headers['x-admin-pin'] !== ADMIN_PIN) {
      return res.status(403).json({ success: false, message: 'كلمة سر الأدمن غير صحيحة' });
    }
    const { userId, amount } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { balance: Number(amount) } },
      { new: true }
    );
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// مسارات الألعاب الأساسية للموقع
router.get('/', getAllGames);
router.get('/jackpots', getJackpotGames);
router.get('/:slug', getGameBySlug);
router.post('/', authenticateToken, createGame);

export default router;
