'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const P_BASE = ['https:/', '/demogamesfree.pragmaticplay.net', '/gs2c/openGame.do?gameSymbol='].join('');
const P_END = ['&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net', '&jurisdiction=99&lang=FR&cur=TND'].join('');
const P_IMG = ['https:/', '/demogamesfree.pragmaticplay.net', '/game_pic/rec/325/'].join('');
const A_BASE = ['https:/', '/://amatic.com', '/games/'].join('');

const PRAG_60 = [
  ['vs20olympgate', 'Gates of Olympus'], ['vs20fruitsw', 'Sweet Bonanza'], ['vs10bbbonanza', 'Big Bass Bonanza'],
  ['vswayslions', '5 Lions Megaways'], ['vs20doghouse', 'The Dog House'], ['vs25wolfgold', 'Wolf Gold'],
  ['vs20sugarrush', 'Sugar Rush'], ['vs20starlight', 'Starlight Princess'], ['vs20fruitparty', 'Fruit Party'],
  ['vswaysdogs', 'Dog House Megaways'], ['vs20olympx', 'Gates of Olympus 1000'], ['vs20sugarrushx', 'Sugar Rush 1000'],
  ['vs20starlightx', 'Starlight Princess 1000'], ['vs10bbsplash', 'Big Bass Splash'], ['vs10txchunk', 'Big Bass Amazon Xtreme'],
  ['vs20procount', 'Wisdom of Athena'], ['vs20zeusvs', 'Zeus vs Hades'], ['vs20midas', 'The Hand of Midas'],
  ['vs20rhino', 'Great Rhino Megaways'], ['vswaysmadame', 'Madame Destiny Megaways'], ['vs20wildwest', 'Wild West Gold'],
  ['vs25mustang', 'Mustang Gold'], ['vs40pirate', 'Pirate Gold'], ['vs25chilli', 'Chilli Heat'],
  ['vs20gemsbonanza', 'Gems Bonanza'], ['vs20juicyfr', 'Juicy Fruits'], ['vs20bonanzagold', 'Sweet Bonanza Xmas'],
  ['vs20fparty2', 'Fruit Party 2'], ['vswaysbufking', 'Buffalo King Megaways'], ['vs40wildwest', 'Wild West Megaways'],
  ['vs20cleocatra', 'Cleocatra'], ['vs20gatotgates', 'Gates of Gatot Kaca'], ['vs10bookoftut', 'John Hunter Book of Tut'],
  ['vs25scarab', 'Tomb of Scarab Queen'], ['vs20pbonanza', 'Pyramid Bonanza'], ['vs20muertos', 'Muertos Multiplier'],
  ['vs10bhall', 'Big Bass Halloween'], ['vs10bbfloats', 'Big Bass Keeping Reel'], ['vs20forge', 'Forge of Olympus'],
  ['vs20candyblitz', 'Candy Blitz'], ['vs20tweethouse', 'The Tweety House'], ['vs25peking', 'Peking Luck'],
  ['vs20kraken', 'Release the Kraken'], ['vs20kraken2', 'Release the Kraken 2'], ['vs20chickdrop', 'Chicken Drop'],
  ['vs20bchouse', 'Barn Festival'], ['vs20drgbless', 'Dragon Hero'], ['vs20magicpot', 'Magic Money Maze'],
  ['vs20swordofares', 'Sword of Ares'], ['vs20spinscore', 'Spin & Score Megaways'], ['vs20pizzapizza', 'Pizza! Pizza? Pizza!'],
  ['vs20mochimon', 'Mochimon'], ['vs20rabbitgarden', 'Rabbit Garden'], ['vs20wildhop', 'Wild Hop & Drop'],
  ['vs20stickybees', 'Sticky Bees'], ['vs20excalibur', 'Excalibur Unleashed'], ['vs20lampinf', 'Lamp of Infinity'],
  ['vs20heist', 'Heist for Golden Nuggets'], ['vs20fatpanda', 'Fat Panda'], ['vs20spellmaster', 'Spellbinding Mystery']
];

const AMAT_30 = [
  ['hotfruits100', 'Hot Fruits 100', '7️⃣🍒🔥'], ['bookofaztec', 'Book of Aztec', '📖🗿👑'],
  ['luckyjoker40', 'Lucky Joker 40', '🃏🔔🍀'], ['allwaysfruits', 'All Ways Fruits', '🍇🍊7️⃣'],
  ['bellsonfire', 'Bells on Fire', '🔔🔥7️⃣'], ['casanova', 'Casanova', '🎭🌹👑'],
  ['hotfruits20', 'Hot Fruits 20', '🍒🍋7️⃣'], ['hotfruits40', 'Hot Fruits 40', '🍉🍇🔥'],
  ['luckyjoker100', 'Lucky Joker 100', '🃏⭐💰'], ['luckyjoker10', 'Lucky Joker 10', '🃏🍒🔔'],
  ['bookoffortune', 'Book of Fortune', '📖🧙‍♂️🦉'], ['wildshark', 'Wild Shark', '🦈🐠🌊'],
  ['admiral', 'Admiral Nelson', '⚓🚢🧭'], ['eyeofra', 'Eye of Ra', '👁️🏺🐍'],
  ['diamondcats', 'Diamond Cats', '💎🐱👑'], ['billyonaire', 'Billyonaire', '🎩💵🚗'],
  ['arisingphoenix', 'Arising Phoenix', '🔥🦅👑'], ['bluedolphin', 'Blue Dolphin', '🐬🐚🌊'],
  ['lovelylady', 'Lovely Lady', '🔮🍀🐞'], ['hottwenty', 'Hot Twenty', '7️⃣⭐🍒'],
  ['wild7', 'Wild 7', '7️⃣🔥🍉'], ['dragonspearl', 'Dragons Pearl', '🐉🔮🏮'],
  ['grandtiger', 'Grand Tiger', '🐅👑🔥'], ['fortunegirl', 'Fortune Girl', '💃🌸💰'],
  ['bigpanda', 'Big Panda', '🐼🎋💰'], ['wildrespin', 'Wild Respin', '🍒⭐🔔'],
  ['hotscatter', 'Hot Scatter', '⭐🔥7️⃣'], ['mermaidsgold', 'Mermaids Gold', '🧜‍♀️🐚💎'],
  ['goldenbook', 'Golden Book', '📒🕌👑'], ['royalunicorn', 'Royal Unicorn', '🦄🏰💎']
];

const LIVE_GAMES = [
  ['101', 'Roulette Live', '🎡🔴⚫'], ['103', 'Blackjack Live', '🃏♠️♥️'],
  ['104', 'Baccarat Live', '🎴💎👑'], ['801', 'Mega Wheel Live', '🎡🌈💰'],
  ['1101', 'Sweet Bonanza CandyLand', '🍭🎡🎪'], ['1301', 'Mega Roulette', '⚡🎡🔥']
];

const ALL_GAMES = [
  ...PRAG_60.map(([code, name], i) => ({
    id: `p-${i}`, name, provider: 'PRAGMATIC' as const, drops: true, bg: 'from-purple-900 to-amber-700', icon: '⚡', code
  })),
  ...AMAT_30.map(([code, name, icon], i) => ({
    id: `a-${i}`, name, provider: 'AMATIC' as const, drops: false, bg: 'from-red-800 to-amber-600', icon, code
  })),
  ...LIVE_GAMES.map(([code, name, icon], i) => ({
    id: `l-${i}`, name, provider: 'LIVE' as const, drops: false, bg: 'from-emerald-800 to-teal-950', icon, code
  }))
];

const MATCHES = [
  { id: 'm1', league: '🇹🇳 Ligue 1 Tunisie', status: 'LIVE', time: "64'", home: 'Espérance ST', away: 'Club Africain', odds: [2.10, 3.10, 3.40] },
  { id: 'm2', league: '🇹🇳 Ligue 1 Tunisie', status: 'LIVE', time: "38'", home: 'Étoile du Sahel', away: 'CS Sfaxien', odds: [2.35, 2.95, 3.15] },
  { id: 'm3', league: '🇪🇸 La Liga', status: 'LIVE', time: "72'", home: 'Real Madrid', away: 'FC Barcelona', odds: [1.95, 3.60, 3.50] },
  { id: 'm4', league: '🇬🇧 Premier League', status: 'À VENIR', time: '20:45', home: 'Manchester City', away: 'Liverpool', odds: [2.05, 3.50, 3.30] },
  { id: 'm5', league: '🇮🇹 Serie A', status: 'À VENIR', time: '21:00', home: 'Inter Milan', away: 'AC Milan', odds: [1.85, 3.45, 4.10] },
  { id: 'm6', league: '🇫🇷 Ligue 1', status: 'À VENIR', time: '21:00', home: 'Paris SG', away: 'Olympique Marseille', odds: [1.55, 4.20, 5.50] }
];

export default function FullCasinoAndSport() {
  const [section, setSection] = useState<'CASINO' | 'LIVE_CASINO' | 'SPORT' | 'LIVE_SPORT'>('CASINO');
  const [subTab, setSubTab] = useState<'TOUS' | 'FAVORIS' | 'DROPS'>('TOUS');
  const [provider, setProvider] = useState<'TOUS' | 'PRAGMATIC' | 'AMATIC'>('TOUS');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<string[]>(['p-0', 'p-1', 'a-0', 'l-0']);
  const [active, setActive] = useState<typeof ALL_GAMES[number] | null>(null);
  const [ticket, setTicket] = useState<{ match: string; pick: string; odd: number }[]>([]);
  const [stake, setStake] = useState(10);
  const [betPlaced, setBetPlaced] = useState(false);

  const getUrl = (g: typeof ALL_GAMES[number]) =>
    g.provider === 'AMATIC'
      ? `${A_BASE}${g.code}/index.html?language=fr&currency=TND`
      : `${P_BASE}${g.code}${P_END}`;

  const toggleFav = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const addPick = (match: string, pick: string, odd: number) => {
    setBetPlaced(false);
    setTicket(prev => [...prev.filter(x => x.match !== match), { match, pick, odd }]);
  };

  if (active) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        <div className="bg-[#082017] px-4 py-2.5 flex justify-between items-center border-b border-[#164a35]">
          <button onClick={() => setActive(null)} className="bg-amber-400 text-black font-black px-3.5 py-1.5 rounded-lg text-xs">✕ QUITTER</button>
          <span className="font-bold text-white text-sm">{active.name} (Démo)</span>
          <span className="text-xs text-emerald-400 font-bold">{active.provider}</span>
        </div>
        <iframe src={getUrl(active)} title={active.name} className="w-full flex-1 border-0" allowFullScreen />
      </div>
    );
  }

  const gamesList = ALL_GAMES.filter(g => {
    if (section === 'LIVE_CASINO') return g.provider === 'LIVE';
    if (g.provider === 'LIVE') return false;
    if (subTab === 'FAVORIS' && !favorites.includes(g.id)) return false;
    if (subTab === 'DROPS' && !g.drops) return false;
    if (provider !== 'TOUS' && g.provider !== provider) return false;
    if (search && !g.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const filteredMatches = MATCHES.filter(m => section === 'LIVE_SPORT' ? m.status === 'LIVE' : true);
  const totalOdd = ticket.reduce((acc, item) => acc * item.odd, 1);

  return (
    <div className="min-h-screen bg-[#061811] text-white pb-24">
      <div className="bg-[#082017] px-3 py-2.5 flex items-center justify-between text-xs font-bold border-b border-[#123d2c] overflow-x-auto gap-4">
        <button onClick={() => setSection('SPORT')} className={`whitespace-nowrap pb-1 ${section === 'SPORT' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-emerald-200'}`}>⚽ Sport</button>
        <button onClick={() => setSection('LIVE_SPORT')} className={`whitespace-nowrap pb-1 ${section === 'LIVE_SPORT' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-emerald-200'}`}>🔴 Live</button>
        <button onClick={() => setSection('CASINO')} className={`whitespace-nowrap pb-1 ${section === 'CASINO' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-emerald-200'}`}>🎰 Casino</button>
        <button onClick={() => setSection('LIVE_CASINO')} className={`whitespace-nowrap pb-1 ${section === 'LIVE_CASINO' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-emerald-200'}`}>🃏 Casino en Direct</button>
      </div>
      <div className="max-w-4xl mx-auto p-3">
        {(section === 'SPORT' || section === 'LIVE_SPORT') ? (
          <div>
            <h2 className="text-base font-black text-amber-400 mb-3">
              {section === 'LIVE_SPORT' ? '🔴 Matchs en Direct (Live)' : '⚽ Paris Sportifs (Direct & À venir)'}
            </h2>
            <div className="space-y-3 mb-6">
              {filteredMatches.map(m => (
                <div key={m.id} className="bg-[#0c2d20] p-3.5 rounded-xl border border-[#164a35]">
                  <div className="flex justify-between text-[11px] text-emerald-300 mb-1.5">
                    <span>{m.league}</span>
                    <span className={m.status === 'LIVE' ? 'text-red-400 font-black animate-pulse' : 'text-amber-300'}>
                      {m.status === 'LIVE' ? `● LIVE ${m.time}` : `🕒 ${m.time}`}
                    </span>
                  </div>
                  <div className="font-bold text-sm mb-3">{m.home} <span className="text-amber-400 mx-1">vs</span> {m.away}</div>
                  <div className="grid grid-cols-3 gap-2">
                    {['1', 'X', '2'].map((label, idx) => (
                      <button key={label} onClick={() => addPick(`${m.home} - ${m.away}`, label, m.odds[idx])} className="bg-[#082017] hover:bg-amber-400 hover:text-black py-2 px-3 rounded-lg border border-[#164a35] flex justify-between text-xs font-bold transition">
                        <span className="text-emerald-400">{label}</span>
                        <span>{m.odds[idx].toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {ticket.length > 0 && (
              <div className="bg-[#0a261b] p-4 rounded-xl border-2 border-amber-400">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-black text-amber-400 text-sm">🎫 Ticket de Jeu ({ticket.length})</span>
                  <button onClick={() => setTicket([])} className="text-xs text-red-400">Vider</button>
                </div>
                {ticket.map((t, i) => (
                  <div key={i} className="text-xs flex justify-between py-1 border-b border-white/10">
                    <span>{t.match} ({t.pick})</span>
                    <span className="text-amber-300 font-bold">{t.odd.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between mt-3 gap-2">
                  <input type="number" value={stake} onChange={e => setStake(Number(e.target.value))} className="w-24 bg-white text-black font-bold px-2 py-1.5 rounded text-sm" />
                  <span className="text-xs font-bold text-emerald-300">Gain: {(stake * totalOdd).toFixed(2)} TND</span>
                  <button onClick={() => setBetPlaced(true)} className="bg-amber-400 text-black font-black px-4 py-2 rounded-lg text-xs">VALIDER</button>
                </div>
                {betPlaced && <p className="text-green-400 text-xs font-bold mt-2 text-center">✅ Ticket enregistré pour le fun!</p>}
              </div>
            )}
          </div>
        ) : (
          <div>
            {section === 'CASINO' && (
              <>
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
                      {p === 'PRAGMATIC' ? 'PRAGMATIC (60)' : p === 'AMATIC' ? 'AMATIC (30)' : 'TOUS (90)'}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="flex gap-2 mb-4">
              <input type="text" placeholder={`🔍 Rechercher (${gamesList.length} jeux)...`} value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 bg-white text-gray-900 rounded-lg px-3 py-2.5 text-sm focus:outline-none" />
              <button className="bg-amber-400 text-black font-black text-xs px-4 rounded-lg">RECHERCHER</button>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {gamesList.map((g) => (
                <div key={g.id} onClick={() => setActive(g)} className="cursor-pointer rounded-xl overflow-hidden bg-[#0c2d20] border border-[#164a35] hover:border-amber-400 flex flex-col shadow-md">
                  <div className={`h-32 sm:h-40 bg-gradient-to-br ${g.bg} relative flex flex-col items-center justify-center overflow-hidden`}>
                    {g.provider === 'PRAGMATIC' ? (
                      <img src={`${P_IMG}${g.code}.png`} alt={g.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      <div className="p-2 text-center">
                        <div className="text-3xl sm:text-4xl mb-1">{g.icon}</div>
                        <div className="font-black text-[11px] text-white uppercase leading-tight">{g.name}</div>
                      </div>
                    )}
                    {g.drops && <span className="absolute top-1.5 left-1.5 bg-black/80 text-amber-300 text-[8px] font-black px-1.5 py-0.5 rounded">DROPS & WINS</span>}
                  </div>
                  <div className="bg-[#0b291d] px-2 py-2 flex items-center justify-between">
                    <span className="text-[11px] font-semibold truncate">{g.name}</span>
                    <button onClick={(e) => toggleFav(e, g.id)} className={`text-sm ml-1 ${favorites.includes(g.id) ? 'text-amber-400' : 'text-emerald-500'}`}>★</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-[#082017] border-t border-[#144532] grid grid-cols-5 text-center z-40">
        <button onClick={() => setSection('SPORT')} className={`py-2 flex flex-col items-center ${section === 'SPORT' ? 'bg-amber-400 text-black font-black' : 'text-emerald-200/80'}`}><span className="text-base">🎫</span><span className="text-[9px] font-bold">SPORT</span></button>
        <button onClick={() => setSection('LIVE_SPORT')} className={`py-2 flex flex-col items-center ${section === 'LIVE_SPORT' ? 'bg-amber-400 text-black font-black' : 'text-emerald-200/80'}`}><span className="text-base">⚽</span><span className="text-[9px] font-bold">LIVE</span></button>
        <button onClick={() => setSection('CASINO')} className={`py-2 flex flex-col items-center ${section === 'CASINO' ? 'bg-amber-400 text-black font-black' : 'text-emerald-200/80'}`}><span className="text-base">🎰</span><span className="text-[9px] font-bold">CASINO</span></button>
        <button onClick={() => setSection('LIVE_CASINO')} className={`py-2 flex flex-col items-center ${section === 'LIVE_CASINO' ? 'bg-amber-400 text-black font-black' : 'text-emerald-200/80'}`}><span className="text-base">🃏</span><span className="text-[9px] font-bold">EN DIRECT</span></button>
        <Link href="/dashboard" className="py-2 flex flex-col items-center text-emerald-200/80"><span className="text-base">👤</span><span className="text-[9px] font-bold">COMPTE</span></Link>
      </div>
    </div>
  );
}
