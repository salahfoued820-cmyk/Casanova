'use client';
import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

const PRAGMATIC_NAMES = [
  'Gates of Olympus', 'Sweet Bonanza', 'Big Bass Bonanza', 'The Dog House', 'Wolf Gold',
  'Sugar Rush', 'Starlight Princess', 'Fruit Party', 'Madame Destiny', 'Gems Bonanza',
  'Wild West Gold', 'Mustang Gold', 'Great Rhino', 'Buffalo King', 'John Hunter',
  'Chilli Heat', 'Pirate Gold', 'Juicy Fruits', 'Hand of Midas', 'Power of Thor'
];

const AMATIC_NAMES = [
  'Hot Fruits 100', 'Book of Aztec', 'Lucky Joker 40', 'All Ways Fruits', 'Book of Fortune',
  'Bells on Fire', 'Wild Shark', 'Admiral Nelson', 'Eye of Ra', 'Casanova',
  'Diamond Cats', 'Billyonaire', 'Arising Phoenix', 'Blue Dolphin', 'Lovely Lady', 'Hot Twenty'
];

const SYM_SETS = [
  ['⚡', '👑', '💎', '⏳', '🏆'],
  ['🍭', '🍉', '🍇', '💣', '🍬'],
  ['7️⃣', '🍒', '🍋', '🍉', '⭐'],
  ['📖', '🗿', '🦅', '👑', '💎'],
  ['🃏', '🔔', '🔥', '💰', '🍀']
];

const IMGS = [
  'https://unsplash.com',
  'https://unsplash.com',
  'https://unsplash.com',
  'https://unsplash.com',
  'https://unsplash.com'
];

const GAMES = [
  ...PRAGMATIC_NAMES.map((name, i) => ({
    id: `prag-${i}`,
    name,
    provider: 'Pragmatic',
    img: IMGS[i % IMGS.length],
    syms: SYM_SETS[i % SYM_SETS.length]
  })),
  ...AMATIC_NAMES.map((name, i) => ({
    id: `amat-${i}`,
    name,
    provider: 'Amatic',
    img: IMGS[(i + 2) % IMGS.length],
    syms: SYM_SETS[(i + 2) % SYM_SETS.length]
  }))
];

export default function GamesLobby() {
  const { user, token, login } = useAuth();
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [active, setActive] = useState<typeof GAMES[0] | null>(null);
  const [grid, setGrid] = useState<string[][]>([]);
  const [bet, setBet] = useState(5);
  const [spinning, setSpinning] = useState(false);
  const [win, setWin] = useState(0);

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  const start = (g: typeof GAMES[0]) => {
    setActive(g);
    setWin(0);
    setGrid(Array.from({ length: 5 }, () => Array.from({ length: 3 }, (_, i) => g.syms[i % g.syms.length])));
  };

  const spin = async () => {
    if (!active || spinning || !user || !token || (user.balance || 0) < bet) return;
    setSpinning(true);
    setWin(0);

    const timer = setInterval(() => {
      setGrid(Array.from({ length: 5 }, () => Array.from({ length: 3 }, () => active.syms[Math.floor(Math.random() * active.syms.length)])));
    }, 70);

    try {
      const res = await fetch(`${API}/games/play-slot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ bet, gameId: active.id })
      });
      const data = await res.json();
      setTimeout(() => {
        clearInterval(timer);
        setSpinning(false);
        if (data.success) {
          setGrid(data.grid);
          setWin(data.winAmount || 0);
          login(token, { ...user, balance: data.newBalance });
        }
      }, 600);
    } catch {
      clearInterval(timer);
      setSpinning(false);
    }
  };

  if (active) {
    return (
      <div className="fixed inset-0 z-50 bg-black text-white flex flex-col justify-between">
        <div className="bg-gray-900 px-4 py-3 flex justify-between items-center border-b border-gray-800">
          <button onClick={() => setActive(null)} className="bg-gray-800 px-3 py-1.5 rounded-lg text-sm font-bold">✕ Exit</button>
          <span className="font-bold text-yellow-400">{active.name}</span>
          <span className="text-xs text-gray-400">{active.provider}</span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.9)), url(${active.img})` }}>
          <div className="bg-gray-950/90 p-3 rounded-2xl border-2 border-yellow-500/60 max-w-xl w-full grid grid-cols-5 gap-2">
            {grid.map((col, c) => (
              <div key={c} className="flex flex-col gap-2">
                {col.map((sym, r) => (
                  <div key={r} className="h-20 md:h-24 bg-gray-900 rounded-xl flex items-center justify-center text-4xl md:text-5xl border border-white/10">
                    {sym}
                  </div>
                ))}
              </div>
            ))}
          </div>
          {win > 0 && <div className="mt-4 bg-green-600 px-6 py-2 rounded-full font-black text-xl animate-bounce">WIN TND {win.toFixed(2)}</div>}
        </div>

        <div className="bg-gray-950 p-4 border-t border-gray-800 flex items-center justify-between max-w-3xl mx-auto w-full">
          <div>
            <div className="text-[10px] text-gray-400">CREDIT</div>
            <div className="font-black text-green-400">TND {user?.balance?.toFixed(2) || '0.00'}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setBet(b => Math.max(1, b - 1))} className="w-8 h-8 bg-gray-800 rounded-full font-bold">-</button>
            <span className="font-bold text-sm w-16 text-center">{bet} TND</span>
            <button onClick={() => setBet(b => b + 1)} className="w-8 h-8 bg-gray-800 rounded-full font-bold">+</button>
          </div>
          <button onClick={spin} disabled={spinning} className="w-16 h-16 rounded-full bg-yellow-500 text-black font-black shadow-lg active:scale-95">
            {spinning ? '...' : 'SPIN'}
          </button>
        </div>
      </div>
    );
  }

  const list = GAMES.filter(g => {
    const matchTab = filter === 'ALL' || g.provider.toUpperCase() === filter;
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
          <div className="flex gap-2">
            {['ALL', 'PRAGMATIC', 'AMATIC'].map(tab => (
              <button key={tab} onClick={() => setFilter(tab)} className={`px-4 py-2 rounded-lg font-bold text-xs ${filter === tab ? 'bg-yellow-500 text-black' : 'bg-gray-900 text-gray-400'}`}>
                {tab}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="🔍 Search game..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-yellow-500 sm:w-64"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {list.map(g => (
            <div key={g.id} onClick={() => start(g)} className="cursor-pointer bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-500 transition">
              <div className="h-36 bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url(${g.img})` }}>
                <span className="text-5xl">{g.syms[0]}</span>
              </div>
              <div className="p-3">
                <div className="font-bold text-sm truncate">{g.name}</div>
                <div className="text-[11px] text-yellow-500">{g.provider}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
