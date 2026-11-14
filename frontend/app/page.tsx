'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const P_BASE = ['https:/', '/demopragmatic.com', '/gs2c/openGame.do?gameSymbol='].join('');
const P_END = ['&websiteUrl=https%3A%2F%2Fcasanova-af97.onrender.com', '&jurisdiction=99&lang=FR&cur=TND'].join('');
const A_BASE = ['https:/', '/://amatic.com', '/games/'].join('');
const ESPN_BASE = ['https:/', '/site.api.', 'espn.com', '/apis/site/v2/sports/soccer/'].join('');


const TOP_LEAGUES = [
  { id: 'ALL', flag: '🌍', name: 'Tous les Championnats' },
  { id: 'uefa.champions', flag: '🇪🇺', name: 'UEFA Champions League' },
  { id: 'uefa.europa', flag: '🇪🇺', name: 'UEFA Europa League' },
  { id: 'conmebol.libertadores', flag: '🏆', name: 'CONMEBOL Libertadores' },
  { id: 'eng.1', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', name: 'Premier League' },
  { id: 'esp.1', flag: '🇪🇸', name: 'LaLiga' },
  { id: 'ita.1', flag: '🇮🇹', name: 'Serie A' },
  { id: 'ger.1', flag: '🇩🇪', name: 'Bundesliga' },
  { id: 'fra.1', flag: '🇫🇷', name: 'Ligue 1' },
  { id: 'fra.2', flag: '🇫🇷', name: 'Ligue 2' },
  { id: 'ned.1', flag: '🇳🇱', name: 'Eredivisie' },
  { id: 'por.1', flag: '🇵🇹', name: 'Liga Portugal' },
  { id: 'tur.1', flag: '🇹🇷', name: 'Super Lig' },
  { id: 'usa.1', flag: '🇺🇸', name: 'MLS' },
  { id: 'bra.1', flag: '🇧🇷', name: 'Brasileirão Série A' },
  { id: 'arg.1', flag: '🇦🇷', name: 'Liga Argentina' },
  { id: 'hun.1', flag: '🇭🇺', name: 'NB I Hungary' },
  { id: 'cyp.1', flag: '🇨🇾', name: 'First Division Cyprus' },
  { id: 'rou.1', flag: '🇷🇴', name: 'Liga 1 Romania' },
  { id: 'pol.1', flag: '🇵🇱', name: 'Ekstraklasa Poland' },
  { id: 'tun.1', flag: '🇹🇳', name: 'Ligue 1 Tunisie' },
  { id: 'ksa.1', flag: '🇸🇦', name: 'Saudi Pro League' },
  { id: 'fifa.friendly', flag: '🌐', name: 'International Friendlies' }
];

const PRAG_60 = [
  ['vs20olympgate', 'Gates of Olympus', '⚡👑'], ['vs20fruitsw', 'Sweet Bonanza', '🍭🍬'], ['vs10bbbonanza', 'Big Bass Bonanza', '🎣🐟'],
  ['vswayslions', '5 Lions Megaways', '🦁🐉'], ['vs20doghouse', 'The Dog House', '🐶🏠'], ['vs25wolfgold', 'Wolf Gold', '🐺🌕'],
  ['vs20sugarrush', 'Sugar Rush', '🧸🍩'], ['vs20starlight', 'Starlight Princess', '👸✨'], ['vs20fruitparty', 'Fruit Party', '🍓🍇'],
  ['vswaysdogs', 'Dog House Megaways', '🐕🦴'], ['vs20olympx', 'Gates of Olympus 1000', '⚡🔥'], ['vs20sugarrushx', 'Sugar Rush 1000', '🍬💥'],
  ['vs20starlightx', 'Starlight 1000', '👸💫'], ['vs10bbsplash', 'Big Bass Splash', '🚤🎣'], ['vs10txchunk', 'Big Bass Amazon', '🌴🐟'],
  ['vs20procount', 'Wisdom of Athena', '🦉🏛️'], ['vs20zeusvs', 'Zeus vs Hades', '⚡🔥'], ['vs20midas', 'Hand of Midas', '🖐️💰'],
  ['vs20rhino', 'Great Rhino', '🦏🌅'], ['vswaysmadame', 'Madame Destiny', '🔮🦉'], ['vs20wildwest', 'Wild West Gold', '🤠💰'],
  ['vs25mustang', 'Mustang Gold', '🐎🔥'], ['vs40pirate', 'Pirate Gold', '🏴‍☠️💎'], ['vs25chilli', 'Chilli Heat', '🌶️🎺'],
  ['vs20gemsbonanza', 'Gems Bonanza', '💎👑'], ['vs20juicyfr', 'Juicy Fruits', '🍉👑'], ['vs20bonanzagold', 'Bonanza Xmas', '🎄🍭'],
  ['vs20fparty2', 'Fruit Party 2', '🍍🍓'], ['vswaysbufking', 'Buffalo King', '🦬🏔️'], ['vs40wildwest', 'Wild West Megaways', '🔫💰']
];

const AMAT_30 = [
  ['hotfruits100', 'Hot Fruits 100', '7️⃣🍒🔥'], ['bookofaztec', 'Book of Aztec', '📖🗿👑'],
  ['luckyjoker40', 'Lucky Joker 40', '🃏🔔🍀'], ['allwaysfruits', 'All Ways Fruits', '🍇🍊7️⃣'],
  ['bellsonfire', 'Bells on Fire', '🔔🔥7️⃣'], ['casanova', 'Casanova', '🎭🌹👑'],
  ['hotfruits20', 'Hot Fruits 20', '🍒🍋7️⃣'], ['hotfruits40', 'Hot Fruits 40', '🍉🍇🔥'],
  ['luckyjoker100', 'Lucky Joker 100', '🃏⭐💰'], ['bookoffortune', 'Book of Fortune', '📖🧙‍♂️🦉'],
  ['wildshark', 'Wild Shark', '🦈🐠🌊'], ['eyeofra', 'Eye of Ra', '👁️🏺🐍'],
  ['diamondcats', 'Diamond Cats', '💎🐱👑'], ['billyonaire', 'Billyonaire', '🎩💵🚗'],
  ['arisingphoenix', 'Arising Phoenix', '🔥🦅👑'], ['bluedolphin', 'Blue Dolphin', '🐬🐚🌊']
];
const LIVE_30 = [
  ['rla', 'Roulette Crystal', '🎡🔴⚫'],
  ['bjma', 'American Blackjack', '🃏♠️♥️'],
  ['bjmb', 'Multihand Blackjack', '🃏💎👑'],
  ['bca', 'Baccarat', '🎴💰✨'],
  ['bnadvanced', 'Dragon Tiger', '🐉🐅🔥'],
  ['cs5triple', 'Spaceman Crash', '🚀👨‍🚀💫']
];


const ALL_GAMES = [
  ...PRAG_60.map(([code, name, icon], i) => ({
    id: `p-${i}`, name, provider: 'PRAGMATIC' as const, bg: 'from-purple-800 via-indigo-900 to-amber-600', icon, code
  })),
  ...AMAT_30.map(([code, name, icon], i) => ({
    id: `a-${i}`, name, provider: 'AMATIC' as const, bg: 'from-red-700 via-orange-600 to-amber-500', icon, code
  })),
  ...LIVE_30.map(([code, name, icon], i) => ({
    id: `l-${i}`, name, provider: 'LIVE' as const, bg: 'from-emerald-800 via-teal-900 to-amber-700', icon, code
  }))
];


interface MatchItem {
  id: string;
  leagueId: string;
  leagueName: string;
  flag: string;
  isLive: boolean;
  dateKey: string;
  displayTime: string;
  home: string;
  away: string;
  homeScore: string;
  awayScore: string;
  odds: [number, number, number];
}

interface EspnEvent {
  id?: string;
  date: string;
  status?: { type?: { state?: string; shortDetail?: string } };
  competitions?: Array<{
    competitors?: Array<{ homeAway?: string; score?: string; team?: { shortDisplayName?: string } }>;
  }>;
}

export default function ModernSportCasinoHome() {
  const [tab, setTab] = useState<'SPORT' | 'LIVE' | 'CASINO' | 'LIVE_CASINO'>('SPORT');
  const [selectedDay, setSelectedDay] = useState<string>('ALL');
  const [selectedLeague, setSelectedLeague] = useState<string>('ALL');
  const [sportSearch, setSportSearch] = useState<string>('');
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openedMatch, setOpenedMatch] = useState<MatchItem | null>(null);

  const [ticket, setTicket] = useState<{ id: string; match: string; pick: string; odd: number }[]>([]);
  const [showBetslip, setShowBetslip] = useState<boolean>(false);
  const [stake, setStake] = useState<number>(10);
  const [betSuccess, setBetSuccess] = useState<boolean>(false);

  const [provider, setProvider] = useState<'TOUS' | 'PRAGMATIC' | 'AMATIC'>('TOUS');
  const [gameSearch, setGameSearch] = useState<string>('');
  const [activeGame, setActiveGame] = useState<typeof ALL_GAMES[number] | null>(null);

  // توليد أيام الـ 3 أسابيع (21 يوماً) تلقائياً
  const daysStrip = Array.from({ length: 21 }, (_, idx) => {
    const d = new Date(Date.now() + idx * 24 * 60 * 60 * 1000);
    const key = d.toLocaleDateString('fr-TN', { day: '2-digit', month: '2-digit', timeZone: 'Africa/Tunis' });
    const dayName = idx === 0 ? 'TODAY' : d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'Africa/Tunis' }).toUpperCase();
    return { key, dayName };
  });

      useEffect(() => {
    const fetchAllLeagues = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/matches');

        const data = await res.json();
        if (data.success && Array.isArray(data.matches)) {
          setMatches(data.matches);
        }
      } catch {}
      setLoading(false);
    };
    fetchAllLeagues();
  }, []);


  const togglePick = (m: MatchItem, pick: string, odd: number) => {
    setBetSuccess(false);
    setTicket((prev) => {
      const exists = prev.find((x) => x.id === m.id && x.pick === pick);
      if (exists) return prev.filter((x) => x.id !== m.id);
      return [...prev.filter((x) => x.id !== m.id), { id: m.id, match: `${m.home} vs ${m.away}`, pick, odd }];
    });
  };

  if (activeGame) {
    const url = activeGame.provider === 'casanova-af97'
      ? `${A_BASE}${activeGame.code}/index.html?language=fr&currency=TND`
      : `${P_BASE}${activeGame.code}${P_END}`;
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        <div className="bg-[#08301d] px-4 py-2.5 flex justify-between items-center border-b border-emerald-700">
          <button onClick={() => setActiveGame(null)} className="bg-amber-400 text-black font-black px-3 py-1 rounded text-xs">✕ QUITTER</button>
          <span className="font-bold text-white text-sm">{activeGame.name}</span>
          <span className="text-xs text-amber-400 font-bold">{activeGame.provider}</span>
        </div>
        <iframe src={url} title={activeGame.name} className="w-full flex-1 border-0" allowFullScreen />
      </div>
    );
  }

  const filteredMatches = matches.filter((m) => {
    if (tab === 'LIVE' && !m.isLive) return false;
    if (selectedDay !== 'ALL' && m.dateKey !== selectedDay) return false;
    if (selectedLeague !== 'ALL' && m.leagueId !== selectedLeague) return false;
    if (sportSearch && !m.home.toLowerCase().includes(sportSearch.toLowerCase()) && !m.away.toLowerCase().includes(sportSearch.toLowerCase()) && !m.leagueName.toLowerCase().includes(sportSearch.toLowerCase())) return false;
    return true;
  });

  const totalOdd = ticket.reduce((a, b) => a * b.odd, 1);

  return (
    <div className="min-h-screen bg-[#042415] text-white pb-24 relative">
      {/* شاشة تفاصيل المباراة عند الضغط عليها */}
      {openedMatch && (
        <div className="fixed inset-0 z-50 bg-[#042415] flex flex-col overflow-y-auto pb-20">
          <div className="bg-[#031a0f] p-3 flex items-center justify-between border-b border-emerald-800">
            <button onClick={() => setOpenedMatch(null)} className="text-amber-400 font-bold text-sm">← Retour</button>
            <span className="text-xs font-bold text-emerald-300">{openedMatch.flag} {openedMatch.leagueName}</span>
            <span className="text-xs text-amber-400">{openedMatch.displayTime}</span>
          </div>
          <div className="bg-[#073620] p-4 flex justify-between items-center text-center">
            <div className="w-1/3 font-bold text-sm">{openedMatch.home}</div>
            <div className="w-1/3">
              <div className="text-2xl font-black text-amber-400">{openedMatch.isLive ? `${openedMatch.homeScore} : ${openedMatch.awayScore}` : 'VS'}</div>
              <div className="text-[10px] text-emerald-300 mt-1">{openedMatch.displayTime}</div>
            </div>
            <div className="w-1/3 font-bold text-sm">{openedMatch.away}</div>
          </div>
          <div className="mx-3 my-3 h-40 rounded-xl bg-gradient-to-b from-green-700 to-green-800 border-2 border-white/40 relative flex items-center justify-center shadow-inner">
            <div className="w-20 h-20 rounded-full border-2 border-white/30"></div>
            <div className="absolute inset-y-0 left-1/2 w-[2px] bg-white/30"></div>
            <div className="absolute bg-black/75 px-4 py-1.5 rounded-lg text-xs font-bold text-amber-300">
              {openedMatch.isLive ? `⚽ En Direct • ${openedMatch.home}` : `🕒 Coup d'envoi: ${openedMatch.displayTime}`}
            </div>
          </div>
          <div className="p-3">
            <div className="bg-[#073620] p-3 rounded-xl border border-emerald-700">
              <div className="text-xs font-bold text-amber-400 mb-2">★ 1x2 Résultat Final</div>
              <div className="grid grid-cols-3 gap-2">
                {['1', 'X', '2'].map((lbl, idx) => (
                  <button key={lbl} onClick={() => togglePick(openedMatch, lbl, openedMatch.odds[idx])} className="bg-[#042415] hover:bg-amber-400 hover:text-black py-2.5 px-3 rounded-lg border border-emerald-700 flex justify-between text-xs font-bold">
                    <span>{lbl}</span>
                    <span className="text-amber-400">{openedMatch.odds[idx].toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1. الشريط العلوي للأقسام (مثل الصورة تماماً) */}
      <div className="bg-[#062e1b] px-3 py-2.5 flex items-center justify-between text-xs font-bold border-b border-emerald-900 overflow-x-auto gap-4">
        <button onClick={() => setTab('SPORT')} className={`whitespace-nowrap pb-1 ${tab === 'SPORT' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-white'}`}>🏠 Sport</button>
        <button onClick={() => setTab('LIVE')} className={`whitespace-nowrap pb-1 ${tab === 'LIVE' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-white'}`}>🔴 Live</button>
        <button onClick={() => setTab('CASINO')} className={`whitespace-nowrap pb-1 ${tab === 'CASINO' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-white'}`}>🎰 Casino</button>
        <button onClick={() => setTab('LIVE_CASINO')} className={`whitespace-nowrap pb-1 ${tab === 'LIVE_CASINO' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-white'}`}>🃏 Casino en Direct</button>
        <button onClick={() => setActiveGame(ALL_GAMES[0])} className="whitespace-nowrap pb-1 text-amber-300">✈️ Aviator</button>
      </div>
      {(tab === 'SPORT' || tab === 'LIVE') ? (
        <div>
          {tab === 'SPORT' && (
            <div className="bg-[#031c10] px-2 py-2 flex items-center gap-2 overflow-x-auto border-b border-emerald-900">
              <button
                onClick={() => setSelectedDay('ALL')}
                className={`px-3 py-1.5 rounded-lg text-center min-w-[64px] border transition ${selectedDay === 'ALL' ? 'bg-amber-400 text-black border-amber-300 font-black' : 'bg-[#073620] text-white border-emerald-800'}`}
              >
                <div className="text-[10px]">ALL</div>
                <div className="text-[11px] font-bold">21 JOURS</div>
              </button>
              {daysStrip.map((d) => (
                <button
                  key={d.key}
                  onClick={() => setSelectedDay(d.key)}
                  className={`px-3 py-1.5 rounded-lg text-center min-w-[64px] border transition ${selectedDay === d.key ? 'bg-amber-400 text-black border-amber-300 font-black' : 'bg-[#073620] text-white border-emerald-800'}`}
                >
                  <div className="text-[10px] opacity-80">{d.dayName}</div>
                  <div className="text-[11px] font-bold">{d.key}</div>
                </button>
              ))}
            </div>
          )}

          {matches.length > 0 && (
            <div className="p-3 flex gap-2.5 overflow-x-auto">
              {matches.slice(0, 6).map((m) => (
                <div key={m.id} className="min-w-[270px] bg-[#073821] rounded-xl p-3 border border-amber-400/60 shadow-lg flex-shrink-0">
                  <div onClick={() => setOpenedMatch(m)} className="cursor-pointer">
                    <div className="flex justify-between items-center text-[10px] text-emerald-200 mb-1.5">
                      <span>⚽ {m.displayTime} | {m.flag} {m.leagueName}</span>
                      <span className="border border-amber-400 text-amber-400 px-1 rounded font-bold text-[9px]">LIVE</span>
                    </div>
                    <div className="font-bold text-xs mb-1 truncate">{m.home}</div>
                    <div className="font-bold text-xs mb-2.5 truncate">{m.away}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['1', 'X', '2'].map((lbl, idx) => (
                      <button key={lbl} onClick={() => togglePick(m, lbl, m.odds[idx])} className="bg-[#042415] hover:bg-amber-400 hover:text-black py-1.5 px-2 rounded border border-emerald-800 flex justify-between text-[11px] font-bold">
                        <span className="text-emerald-400">{lbl}</span>
                        <span>{m.odds[idx].toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="px-3 mb-3">
            <input
              type="text"
              placeholder="🔍 Enter Team or Championship name..."
              value={sportSearch}
              onChange={(e) => setSportSearch(e.target.value)}
              className="w-full bg-white text-gray-900 rounded-lg px-3.5 py-2.5 text-xs font-semibold focus:outline-none shadow"
            />
          </div>
          <div className="bg-[#f5b800] text-black px-4 py-2.5 font-black text-xs tracking-wider uppercase flex justify-between items-center">
            <span>TOP LEAGUES</span>
            {selectedLeague !== 'ALL' && (
              <button onClick={() => setSelectedLeague('ALL')} className="bg-black text-amber-400 px-2 py-0.5 rounded text-[10px]">
                TOUS ✕
              </button>
            )}
          </div>

          <div className="max-h-52 overflow-y-auto divide-y divide-emerald-900/80 border-b-2 border-amber-400/40">
            {TOP_LEAGUES.map((lg) => (
              <button
                key={lg.id}
                onClick={() => setSelectedLeague(lg.id)}
                className={`w-full px-4 py-2.5 flex items-center justify-between text-left text-xs font-bold ${selectedLeague === lg.id ? 'bg-[#0c4d2f] text-amber-400' : 'bg-[#06311d] text-white'}`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-base">{lg.flag}</span>
                  <span>{lg.name}</span>
                </span>
                <span className="text-emerald-400 text-xs">›</span>
              </button>
            ))}
          </div>

          <div className="bg-[#0a4a2c] px-4 py-2 font-black text-xs text-amber-400 flex justify-between">
            <span>MATCHS ({filteredMatches.length})</span>
            <span>HEURE TUNISIE 🇹🇳</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-emerald-300">Chargement des matchs... ⚽</div>
          ) : (
            <div className="divide-y divide-emerald-900">
              {filteredMatches.slice(0, 60).map((m) => (
                <div key={m.id} className="bg-[#073620] p-3">
                  <div onClick={() => setOpenedMatch(m)} className="cursor-pointer">
                    <div className="flex justify-between text-[10px] text-emerald-200 mb-1">
                      <span>{m.displayTime} | {m.flag} {m.leagueName}</span>
                      <span className={m.isLive ? 'bg-red-600 text-white px-1.5 rounded font-black animate-pulse' : 'text-amber-400 font-bold'}>
                        {m.isLive ? `LIVE ${m.homeScore}-${m.awayScore}` : '1x2 ⌄'}
                      </span>
                    </div>
                    <div className="text-xs font-bold mb-2">
                      <div>{m.home}</div>
                      <div className="mt-0.5">{m.away}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['1', 'X', '2'].map((lbl, idx) => {
                      const picked = ticket.some((t) => t.id === m.id && t.pick === lbl);
                      return (
                        <button key={lbl} onClick={() => togglePick(m, lbl, m.odds[idx])} className={`py-2 px-2.5 rounded flex justify-between text-xs font-bold border ${picked ? 'bg-amber-400 text-black border-amber-300' : 'bg-[#042415] text-white border-emerald-800'}`}>
                          <span className={picked ? 'text-black' : 'text-emerald-400'}>{lbl}</span>
                          <span>{m.odds[idx].toFixed(2)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="p-3 max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-2 mb-3">
            {(['TOUS', 'PRAGMATIC', 'AMATIC'] as const).map((p) => (
              <button key={p} onClick={() => setProvider(p)} className={`py-2.5 rounded-lg font-black text-xs border ${provider === p ? 'bg-[#0c4d2f] border-amber-400 text-white' : 'bg-[#06311d] border-emerald-800 text-emerald-200'}`}>
                {p}
              </button>
            ))}
          </div>
          <input type="text" placeholder="🔍 Rechercher le jeu..." value={gameSearch} onChange={(e) => setGameSearch(e.target.value)} className="w-full bg-white text-black rounded-lg px-3 py-2 text-sm mb-3" />
          <div className="grid grid-cols-3 gap-2">
            {ALL_GAMES.filter((g) => (tab === 'LIVE_CASINO' ? g.provider === 'LIVE' : g.provider !== 'LIVE' && (provider === 'TOUS' || g.provider === provider)) && g.name.toLowerCase().includes(gameSearch.toLowerCase())).map((g) => (
              <div key={g.id} onClick={() => setActiveGame(g)} className="cursor-pointer rounded-xl overflow-hidden bg-[#083822] border border-emerald-700 hover:border-amber-400">
                <div className={`h-28 bg-gradient-to-br ${g.bg} flex flex-col items-center justify-center p-2 text-center`}>
                  <div className="text-3xl mb-1">{g.icon}</div>
                  <div className="font-black text-[10px] text-white uppercase leading-tight">{g.name}</div>
                </div>
                <div className="p-1.5 text-[10px] font-bold truncate text-center">{g.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {ticket.length > 0 && (
        <button onClick={() => setShowBetslip(true)} className="fixed bottom-20 right-4 z-40 w-16 h-16 rounded-full bg-[#107c41] border-2 border-emerald-300 shadow-2xl flex flex-col items-center justify-center">
          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center">{ticket.length}</span>
          <span className="text-lg">🧾</span>
          <span className="text-[9px] font-black">BETSLIP</span>
        </button>
      )}

      {showBetslip && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center p-3">
          <div className="bg-[#073620] border-2 border-amber-400 rounded-2xl w-full max-w-md p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="font-black text-amber-400">🧾 BETSLIP ({ticket.length})</span>
              <button onClick={() => setShowBetslip(false)} className="text-sm font-bold text-red-400">✕</button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
              {ticket.map((t) => (
                <div key={t.id} className="bg-[#042415] p-2 rounded flex justify-between text-xs">
                  <span>{t.match} <b className="text-amber-400">[{t.pick}]</b></span>
                  <span className="font-bold">{t.odd.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <input type="number" value={stake} onChange={(e) => setStake(Number(e.target.value))} className="w-24 bg-white text-black font-bold px-2 py-1.5 rounded text-sm" />
              <span className="text-xs font-bold text-emerald-300">Gain: {(stake * totalOdd).toFixed(2)} TND</span>
              <button onClick={() => setBetSuccess(true)} className="bg-amber-400 text-black font-black px-4 py-2 rounded-lg text-xs">PARIER</button>
            </div>
            {betSuccess && <div className="text-center text-xs font-bold text-green-400">✅ Pari enregistré pour le fun!</div>}
          </div>
        </div>
      )}

      <div className="fixed bottom-0 inset-x-0 bg-[#031a0f] border-t border-emerald-800 grid grid-cols-5 text-center z-40">
        <button onClick={() => setTab('SPORT')} className={`py-2 flex flex-col items-center ${tab === 'SPORT' ? 'bg-amber-400 text-black font-black' : 'text-emerald-200'}`}><span className="text-base">🎫</span><span className="text-[9px] font-bold">SPORT</span></button>
        <button onClick={() => setTab('LIVE')} className={`py-2 flex flex-col items-center ${tab === 'LIVE' ? 'bg-amber-400 text-black font-black' : 'text-emerald-200'}`}><span className="text-base">⚽</span><span className="text-[9px] font-bold">LIVE</span></button>
        <button onClick={() => setTab('CASINO')} className={`py-2 flex flex-col items-center ${tab === 'CASINO' ? 'bg-amber-400 text-black font-black' : 'text-emerald-200'}`}><span className="text-base">🎰</span><span className="text-[9px] font-bold">CASINO</span></button>
        <Link href="/dashboard" className="py-2 flex flex-col items-center text-emerald-200"><span className="text-base">👤</span><span className="text-[9px] font-bold">COMPTE</span></Link>
        <button onClick={() => setActiveGame(ALL_GAMES[0])} className="py-2 flex flex-col items-center text-emerald-200"><span className="text-base">✈️</span><span className="text-[9px] font-bold">AVIATOR</span></button>
      </div>
    </div>
  );
}
