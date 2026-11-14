import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { getAllGames, getGameBySlug, getJackpotGames, createGame } from '../controllers/game.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import User from '../models/User';

const router = Router();
const ADMIN_PIN = process.env.ADMIN_PIN || "salah2026";

// =========================================================================
// 🎮 قائمة إعدادات الألعاب: أضف اسم أي لعبة جديدة ومضاعفاتها هنا فقط!
// =========================================================================
const GAMES_CONFIG: Record<string, { multipliers: number[] }> = {
  'wheel': { multipliers: [0, 0.5, 1.2, 1.5, 2, 0, 3, 5] },
  'casanova': { multipliers: [0, 0, 1.5, 2, 0.5, 3, 10] },
  'slots': { multipliers: [0, 0, 0.5, 1, 2, 5, 15] },
  'dice': { multipliers: [0, 0, 1.9, 1.9] },
  'coin': { multipliers: [0, 1.95] },
  // أضف أي لعبة أخرى بنفس الصيغة، مثال:
  // 'aviator': { multipliers: [0, 1.2, 1.5, 2, 4, 10] },
};

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

// 3. جلب المباريات الحقيقية لـ 3 أسابيع بدون قيود CORS
router.get('/live-matches', async (req: Request, res: Response) => {
  try {
    const leagues = [
      { id: 'eng.1', name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
      { id: 'esp.1', name: 'LaLiga', flag: '🇪🇸' },
      { id: 'ita.1', name: 'Serie A', flag: '🇮🇹' },
      { id: 'ger.1', name: 'Bundesliga', flag: '🇩🇪' },
      { id: 'fra.1', name: 'Ligue 1', flag: '🇫🇷' },
      { id: 'uefa.champions', name: 'UEFA Champions League', flag: '🇪🇺' },
      { id: 'uefa.nations', name: 'UEFA Nations League', flag: '🇪🇺' },
      { id: 'bra.1', name: 'Brasileirão Série A', flag: '🇧🇷' },
      { id: 'arg.1', name: 'Liga Argentina', flag: '🇦🇷' },
      { id: 'por.1', name: 'Liga Portugal', flag: '🇵🇹' },
      { id: 'ned.1', name: 'Eredivisie', flag: '🇳🇱' },
      { id: 'tur.1', name: 'Super Lig', flag: '🇹🇷' },
      { id: 'hun.1', name: 'NB I Hungary', flag: '🇭🇺' },
      { id: 'cyp.1', name: 'First Division Cyprus', flag: '🇨🇾' },
      { id: 'tun.1', name: 'Ligue 1 Tunisie', flag: '🇹🇳' },
      { id: 'ksa.1', name: 'Saudi Pro League', flag: '🇸🇦' },
      { id: 'fifa.friendly', name: 'International Matches', flag: '🌍' }
    ];

    const now = new Date();
    const future = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, '');
    const range = `${fmt(now)}-${fmt(future)}`;

    const results = await Promise.all(
      leagues.map(async (lg) => {
        try {
          const espnUrl = ['https:/', '/site.api.', 'espn.com', `/apis/site/v2/sports/soccer/${lg.id}/scoreboard?dates=${range}`].join('');
          const r = await fetch(espnUrl);
          const data: any = await r.json();
          return (data.events || []).map((ev: any) => ({ ev, lg }));
        } catch {
          return [];
        }
      })
    );

    const flat = results.flat().sort((a, b) => new Date(a.ev.date).getTime() - new Date(b.ev.date).getTime());

    const matches = flat.map(({ ev, lg }, i) => {
      const comp = ev.competitions?.[0];
      const homeObj = comp?.competitors?.find((c: any) => c.homeAway === 'home');
      const awayObj = comp?.competitors?.find((c: any) => c.homeAway === 'away');
      const state = ev.status?.type?.state;
      const isLive = state === 'in';
      const dt = new Date(ev.date);
      const dateKey = dt.toLocaleDateString('fr-TN', { day: '2-digit', month: '2-digit', timeZone: 'Africa/Tunis' });
      const timeStr = dt.toLocaleTimeString('fr-TN', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Tunis' });

      return {
        id: ev.id || String(i),
        leagueId: lg.id,
        leagueName: lg.name,
        flag: lg.flag,
        isLive,
        dateKey,
        displayTime: isLive ? (ev.status?.type?.shortDetail || 'LIVE') : `${dateKey} • ${timeStr}`,
        home: homeObj?.team?.shortDisplayName || 'Home',
        away: awayObj?.team?.shortDisplayName || 'Away',
        homeScore: homeObj?.score || '0',
        awayScore: awayObj?.score || '0',
        odds: [
          Number((1.55 + (i % 6) * 0.25).toFixed(2)),
          Number((3.15 + (i % 4) * 0.20).toFixed(2)),
          Number((2.10 + ((i + 3) % 6) * 0.35).toFixed(2))
        ]
      };
    });

    res.json({ success: true, matches });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. مسار موحد لتشغيل أي لعبة موجودة في GAMES_CONFIG وتحديث الرصيد
router.post('/play/:gameName', authenticateToken, async (req: any, res: Response) => {
  try {
    const gameName = req.params.gameName.toLowerCase();
    const gameConfig = GAMES_CONFIG[gameName];

    if (!gameConfig) {
      return res.status(404).json({ success: false, message: `اللعبة (${gameName}) غير مفعلة` });
    }

    const userId = req.user.id || req.user._id;
    const betAmount = Number(req.body.betAmount);

    if (!betAmount || betAmount <= 0) {
      return res.status(400).json({ success: false, message: 'مبلغ الرهان غير صالح' });
    }

    const user = await User.findById(userId);
    if (!user || user.balance < betAmount) {
      return res.status(400).json({ success: false, message: 'الرصيد غير كافٍ' });
    }

    // اختيار مضاعف عشوائي آمن من قائمة اللعبة
    const { multipliers } = gameConfig;
    const randomIndex = crypto.randomInt(0, multipliers.length);
    const chosenMultiplier = multipliers[randomIndex];

    const winAmount = Number((betAmount * chosenMultiplier).toFixed(2));
    const netChange = winAmount - betAmount;

    user.balance = Number((user.balance + netChange).toFixed(2));
    await user.save();

    res.json({
      success: true,
      game: gameName,
      multiplier: chosenMultiplier,
      winAmount,
      newBalance: user.balance,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. مسارات الألعاب الأساسية للموقع
router.get('/', getAllGames);
router.get('/jackpots', getJackpotGames);
router.get('/:slug', getGameBySlug);
router.post('/', authenticateToken, createGame);

export default router;
