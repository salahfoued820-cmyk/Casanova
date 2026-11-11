import User from '../models/User';

const ADMIN_PIN = "salah2026"; // كلمة السر السرية الخاصة بك للأدمن

// 1. جلب قائمة جميع اللاعبين وأرصدتهم
router.get('/admin/users', async (req: Request, res: Response) => {
  if (req.headers['x-admin-pin'] !== ADMIN_PIN) {
    return res.status(403).json({ success: false, message: 'كلمة سر الأدمن غير صحيحة' });
  }
  const users = await User.find({}, 'username email firstName lastName balance createdAt').sort({ createdAt: -1 });
  res.json({ success: true, users });
});

// 2. شحن رصيد بالدينار التونسي (TND) لأي لاعب
router.post('/admin/deposit', async (req: Request, res: Response) => {
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
});
