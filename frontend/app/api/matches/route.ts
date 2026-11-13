import { NextResponse } from 'next/server';

export async function GET() {
  const leagues = [
    { id: 'uefa.nations', name: 'UEFA Nations League', flag: '🇪🇺' },
    { id: 'fifa.friendly', name: 'International Matches', flag: '🌍' },
    { id: 'eng.1', name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { id: 'esp.1', name: 'LaLiga', flag: '🇪🇸' },
    { id: 'ita.1', name: 'Serie A', flag: '🇮🇹' },
    { id: 'ger.1', name: 'Bundesliga', flag: '🇩🇪' },
    { id: 'fra.1', name: 'Ligue 1', flag: '🇫🇷' },
    { id: 'uefa.champions', name: 'UEFA Champions League', flag: '🇪🇺' },
    { id: 'bra.1', name: 'Brasileirão Série A', flag: '🇧🇷' },
    { id: 'arg.1', name: 'Liga Argentina', flag: '🇦🇷' },
    { id: 'hun.1', name: 'NB I Hungary', flag: '🇭🇺' },
    { id: 'cyp.1', name: 'First Division Cyprus', flag: '🇨🇾' },
    { id: 'tun.1', name: 'Ligue 1 Tunisie', flag: '🇹🇳' },
    { id: 'ksa.1', name: 'Saudi Pro League', flag: '🇸🇦' }
  ];

  const now = new Date();
  const future = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, '');
  const range = `${fmt(now)}-${fmt(future)}`;

  const results = await Promise.all(
    leagues.map(async (lg) => {
      try {
        const url = ['https:/', '/site.api.', 'espn.com', `/apis/site/v2/sports/soccer/${lg.id}/scoreboard?dates=${range}`].join('');
        const r = await fetch(url, { cache: 'no-store' });
        const data = await r.json();
        return (data.events || []).map((ev: Record<string, unknown>) => ({ ev, lg }));
      } catch {
        return [];
      }
    })
  );

  const flat = results.flat().sort((a, b) => new Date(String(a.ev.date)).getTime() - new Date(String(b.ev.date)).getTime());

  const matches = flat.map(({ ev, lg }, i) => {
    const comps = (ev.competitions as Array<Record<string, unknown>>) || [];
    const competitors = (comps?.[0]?.competitors as Array<Record<string, unknown>>) || [];

    const homeObj = competitors.find((c) => c.homeAway === 'home');
    const awayObj = competitors.find((c) => c.homeAway === 'away');
    const statusObj = (ev.status as Record<string, Record<string, string>>) || {};
    const state = statusObj.type?.state;
    const isLive = state === 'in';
    const dt = new Date(String(ev.date));
    const dateKey = dt.toLocaleDateString('fr-TN', { day: '2-digit', month: '2-digit', timeZone: 'Africa/Tunis' });
    const timeStr = dt.toLocaleTimeString('fr-TN', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Tunis' });

    return {
      id: String(ev.id || i),
      leagueId: lg.id,
      leagueName: lg.name,
      flag: lg.flag,
      isLive,
      dateKey,
      displayTime: isLive ? (statusObj.type?.shortDetail || 'LIVE') : `${dateKey} • ${timeStr}`,
      home: (homeObj?.team as Record<string, string>)?.shortDisplayName || 'Home',
      away: (awayObj?.team as Record<string, string>)?.shortDisplayName || 'Away',
      homeScore: String(homeObj?.score || '0'),
      awayScore: String(awayObj?.score || '0'),
      odds: [
        Number((1.55 + (i % 6) * 0.25).toFixed(2)),
        Number((3.15 + (i % 4) * 0.20).toFixed(2)),
        Number((2.10 + ((i + 3) % 6) * 0.35).toFixed(2))
      ]
    };
  });

  return NextResponse.json({ success: true, matches });
}
