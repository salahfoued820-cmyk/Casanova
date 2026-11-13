'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const P_BASE = ['https:/', '/demogamesfree.pragmaticplay.net', '/gs2c/openGame.do?gameSymbol='].join('');
const P_END = ['&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net', '&jurisdiction=99&lang=FR&cur=TND'].join('');
const A_BASE = ['https:/', '/://amatic.com', '/games/'].join('');

const GAMES = [
  { id: 'olympus', name: 'Gates of Olympus', provider: 'PRAGMATIC', drops: true, bg: 'from-purple-700 to-amber-600', icon: '⚡👑⚡', code: 'vs20olympgate' },
  { id: 'bonanza', name: 'Sweet Bonanza', provider: 'PRAGMATIC', drops: true, bg: 'from-pink-500 to-sky-400', icon: '🍭🍬🍉', code: 'vs20fruitsw' },
  { id: 'bigbass', name: 'Big Bass Bonanza', provider: 'PRAGMATIC', drops: true, bg: 'from-cyan-600 to-emerald-600', icon: '🎣🐟💰', code: 'vs10bbbonanza' },
  { id: '5lions', name: '5 Lions Megaways', provider: 'PRAGMATIC', drops: true, bg: 'from-amber-600 to-indigo-900', icon: '🦁🐉💰', code: 'vswayslions' },
  { id: 'doghouse', name: 'The Dog House', provider: 'PRAGMATIC', drops: true, bg: 'from-amber-500 to-red-700', icon: '🐶🏠🦴', code: 'vs20doghouse' },
  { id: 'wolfgold', name: 'Wolf Gold', provider: 'PRAGMATIC', drops: true, bg: 'from-orange-700 to-stone-900', icon: '🐺🌕🦅', code: 'vs25wolfgold' },
  { id: 'sugarrush', name: 'Sugar Rush', provider: 'PRAGMATIC', drops: true, bg: 'from-fuchsia-600 to-purple-800', icon: '🧸🍩🍬', code: 'vs20sugarrush' },
  { id: 'starlight', name: 'Starlight Princess', provider: 'PRAGMATIC', drops: true, bg: 'from-sky-500 to-pink-600', icon: '👸✨🌙', code: 'vs20starlight' },
  { id: 'fruitparty', name: 'Fruit Party', provider: 'PRAGMATIC', drops: true, bg: 'from-lime-500 to-yellow-500', icon: '🍓🍇🍎', code: 'vs20fruitparty' },
  { id: 'hotfruits100', name: 'Hot Fruits 100', provider: 'AMATIC', drops: false, bg: 'from-red-600 to-amber-500', icon: '7️⃣🍒🔥', code: 'hotfruits100' },
  { id: 'bookofaztec', name: 'Book of Aztec', provider: 'AMATIC', drops: false, bg: 'from-amber-600 to-stone-900', icon: '📖🗿👑', code: 'bookofaztec' },
  { id: 'luckyjoker40', name: 'Lucky Joker 40', provider: 'AMATIC', drops: false, bg: 'from-rose-700 to-yellow-600', icon: '🃏🔔🍀', code: 'luckyjoker40' },
  { id: 'allwaysfruits', name: 'All Ways Fruits', provider: 'AMATIC', drops: false, bg: 'from-orange-500 to-purple-800', icon: '🍇🍊7️⃣', code: 'allwaysfruits' },
  { id: 'bellsonfire', name: 'Bells on Fire', provider: 'AMATIC', drops: false, bg: 'from-red-700 to-yellow-500', icon: '🔔🔥7️⃣', code: 'bellsonfire' },
  { id: 'casanova', name: 'Casanova', provider: 'AMATIC', drops: false, bg: 'from-rose-800 to-amber-700', icon: '🎭🌹👑', code: 'casanova' }
];


export default function OfficialDemoLobby() {
  const [subTab, setSubTab] = useState<'TOUS' | 'FAVORIS' | 'DROPS'>('TOUS');
  const [provider, setProvider] = useState<'TOUS' | 'PRAGMATIC' | 'AMATIC'>('TOUS');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<string[]>(['olympus', 'bonanza', '5lions', 'hotfruits100']);
  const [active, setActive] = useState<typeof GAMES[number] | null>(null);

  const getUrl = (g: typeof GAMES[number]) =>
    g.provider === 'PRAGMATIC'
      ? `${P_BASE}${g.code}${P_END}`
      : `${A_BASE}${g.code}/index.html?language=fr&currency=TND`;

  const toggleFav = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  if (active) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        <div className="bg-[#082017] px-4 py-2.5 flex justify-between items-center border-b border-[#164a35]">
          <button onClick={() => setActive(null)} className="bg-amber-400 text-black font-black px-3.5 py-1.5 rounded-lg text-xs">
            ✕ QUITTER
          </button>
          <span className="font-bold text-white text-sm">{active.name} (Démo)</span>
          <span className="text-xs text-emerald-400 font-bold">{active.provider}</span>
        </div>
        <iframe src={getUrl(active)} title={active.name} className="w-full flex-1 border-0" allowFullScreen />
      </div>
    );
  }

  const list = GAMES.filter(g => {
    if (subTab === 'FAVORIS' && !favorites.includes(g.id)) return false;
    if (subTab === 'DROPS' && !g.drops) return false;
    if (provider !== 'TOUS' && g.provider !== provider) return false;
    if (search && !g.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#061811] text-white pb-24">
      <div className="max-w-4xl mx-auto p-3">
        <div className="grid grid-cols-3 gap-2 mb-3">
          {['TOUS', 'FAVORIS', 'DROPS'].map(k => (
            <button key={k} onClick={() => setSubTab(k as 'TOUS' | 'FAVORIS' | 'DROPS')} className={`py-2.5 rounded-lg font-extrabold text-xs border-b-2 ${subTab === k ? 'bg-[#0e3526] text-white border-amber-400' : 'bg-[#0a261b] text-emerald-200/80 border-transparent'}`}>
              {k === 'DROPS' ? 'DROPS & WINS' : k}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          {(['TOUS', 'PRAGMATIC', 'AMATIC'] as const).map(p => (
            <button key={p} onClick={() => setProvider(p)} className={`py-3 rounded-lg font-black text-xs border ${provider === p ? 'bg-[#0e3526] border-amber-400 text-white' : 'bg-[#0a261b] border-[#134230] text-emerald-200'}`}>
              {p === 'PRAGMATIC' ? 'PRAGMATIC PLAY' : p}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-4">
          <input type="text" placeholder="🔍 Rechercher le jeu..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 bg-white text-gray-900 rounded-lg px-3 py-2.5 text-sm focus:outline-none" />
          <button className="bg-amber-400 text-black font-black text-xs px-4 rounded-lg">RECHERCHER</button>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {list.map((g) => (
            <div key={g.id} onClick={() => setActive(g)} className="cursor-pointer rounded-xl overflow-hidden bg-[#0c2d20] border border-[#164a35] hover:border-amber-400 flex flex-col">
              <div className={`h-28 sm:h-36 bg-gradient-to-br ${g.bg} relative flex flex-col items-center justify-center p-2`}>
                {g.drops && <span className="absolute top-1.5 left-1.5 bg-black/75 text-amber-300 text-[8px] font-black px-1.5 py-0.5 rounded">DROPS & WINS</span>}
                <div className="text-3xl sm:text-4xl mb-1">{g.icon}</div>
                <div className="text-center font-black text-[11px] text-white uppercase leading-tight">{g.name}</div>
              </div>
              <div className="bg-[#0b291d] px-2 py-2 flex items-center justify-between">
                <span className="text-[11px] font-semibold truncate">{g.name}</span>
                <button onClick={(e) => toggleFav(e, g.id)} className={`text-sm ml-1 ${favorites.includes(g.id) ? 'text-amber-400' : 'text-emerald-500'}`}>★</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-[#082017] border-t border-[#144532] grid grid-cols-5 text-center z-40">
        <Link href="/" className="py-2 flex flex-col items-center text-emerald-200/80"><span className="text-base">🏠</span><span className="text-[9px] font-bold">ACCUEIL</span></Link>
        <div onClick={() => setProvider('PRAGMATIC')} className="py-2 flex flex-col items-center text-emerald-200/80 cursor-pointer"><span className="text-base">👑</span><span className="text-[9px] font-bold">PRAGMATIC</span></div>
        <div onClick={() => setProvider('TOUS')} className="py-2 flex flex-col items-center bg-amber-400 text-black cursor-pointer"><span className="text-base">🎰</span><span className="text-[9px] font-black">CASINO</span></div>
        <div onClick={() => setProvider('AMATIC')} className="py-2 flex flex-col items-center text-emerald-200/80 cursor-pointer"><span className="text-base">🍒</span><span className="text-[9px] font-bold">AMATIC</span></div>
        <Link href="/dashboard" className="py-2 flex flex-col items-center text-emerald-200/80"><span className="text-base">👤</span><span className="text-[9px] font-bold">COMPTE</span></Link>
      </div>
    </div>
  );
}
