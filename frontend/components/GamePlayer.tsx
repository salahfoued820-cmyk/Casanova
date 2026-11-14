'use client';
import React, { useState } from 'react';

interface GamePlayerProps {
  gameCode: string;
  gameTitle: string;
  token: string;
  onBalanceUpdate?: (newBalance: number) => void;
  onClose: () => void;
}

export default function GamePlayer({ gameCode, gameTitle, token, onBalanceUpdate, onClose }: GamePlayerProps) {
  const [bet, setBet] = useState<number>(1);
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handlePlay = async () => {
    setLoading(true);
    setResult('جاري اللعب...');

    try {
      // الاتصال المباشر برابطك وتمرير كود اللعبة ديناميكياً
      const response = await fetch(`https://casanova-af97.com{gameCode.toLowerCase()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ betAmount: bet }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(`المضاعف: ${data.multiplier}x | الربح: ${data.winAmount} TND`);
        if (onBalanceUpdate) onBalanceUpdate(data.newBalance);
      } else {
        setResult(data.message || 'تأكد من تسجيل الدخول أو توفر الرصيد');
      }
    } catch {
      setResult('تعذر الاتصال بخادم الألعاب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-slate-900 text-white rounded-xl max-w-lg mx-auto text-center space-y-5 border border-slate-700">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-amber-400">{gameTitle}</h2>
        <button onClick={onClose} className="px-3 py-1 bg-red-600 rounded text-sm">إغلاق</button>
      </div>

      <div className="py-8 bg-slate-800 rounded-lg text-2xl font-extrabold">
        {result || 'اختر مبلغ الرهان واضغط العب'}
      </div>

      <div className="flex justify-center gap-3">
        <input
          type="number"
          min="0.5"
          step="0.5"
          value={bet}
          onChange={(e) => setBet(Number(e.target.value))}
          className="px-4 py-2 rounded bg-slate-800 border border-slate-600 text-white w-32 text-center"
        />
        <button
          onClick={handlePlay}
          disabled={loading}
          className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded disabled:opacity-50"
        >
          {loading ? 'انتظر...' : 'العب الآن'}
        </button>
      </div>
    </div>
  );
}
