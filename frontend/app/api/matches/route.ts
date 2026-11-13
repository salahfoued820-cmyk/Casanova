import { NextResponse } from 'next/server';

const LEAGUE_MAP: Record<string, { id: string; flag: string }> = {
  'English Premier League': { id: 'eng.1', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  'Spanish La Liga': { id: 'esp.1', flag: '🇪🇸' },
  'Italian Serie A': { id: 'ita.1', flag: '🇮🇹' },
  'German Bundesliga': { id: 'ger.1', flag: '🇩🇪' },
  'French Ligue 1': { id: 'fra.1', flag: '🇫🇷' },
  'UEFA Champions League': { id: 'uefa.champions', flag: '🇪🇺' },
  'UEFA Europa League': { id: 'uefa.europa', flag: '🇪🇺' },
  'UEFA Nations League': { id: 'uefa.nations', flag: '🇪🇺' },
  'Brazilian Serie A': { id: 'bra.1', flag: '🇧🇷' },
  'Argentinian Primera Division': { id: 'arg.1', flag: '🇦🇷' },
  'Portuguese Primeira Liga': { id: 'por.1', flag: '🇵🇹' },
  'Dutch Eredivisie': { id: 'ned.1', flag: '🇳🇱' },
  'Turkish Super Lig': { id: 'tur.1', flag: '🇹🇷' },
  'Hungarian NB I': { id: 'hun.1', flag: '🇭🇺' },
  'Cypriot First Division': { id: 'cyp.1', flag: '🇨🇾' },
  'Tunisian Ligue 1': { id: 'tun.1', flag: '🇹🇳' },
  'Saudi Pro League': { id: 'ksa.1', flag: '🇸🇦' }
};

export async function GET() {
  try {
    // جلب مباريات 7 أيام متتالية من مصدر مفتوح يدعم Vercel
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
      return d.toISOString().slice(0, 10);
    });

    const base = ['https:/', '/www.thesportsdb.', 'com/api/v1/json/3/eventsday.php?s=Soccer&d='].join('');

    const responses = await Promise.all(
      days.map(async (dayStr) => {
        try {
          const r = await fetch(`${base}${dayStr}`, { cache: 'no-store' });
          const data = await r.json();
          return (data.events as Array<Record<string, string>>) || [];
        } catch {
          return [];
        }
      })
    );

    const allEvents = responses.flat();

    const matches = allEvents.map((ev, i) => {
      const leagueName = ev.strLeague || 'Football';
      const mapped = LEAGUE_MAP[leagueName] || { id: 'fifa.friendly', flag: '⚽' };
      const rawDate = ev.strTimestamp || `${ev.dateEvent}T${ev.strTime || '18:00:00'}Z`;
      const dt = new Date(rawDate);
      const validDate = !isNaN(dt.getTime());

      const dateKey = validDate
        ? dt.toLocaleDateString('fr-TN', { day: '2-digit', month: '2-digit', timeZone: 'Africa/Tunis' })
        : (ev.dateEvent || '').slice(5).split('-').reverse().join('/');

      const timeStr = validDate
        ? dt.toLocaleTimeString('fr-TN', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Tunis' })
        : (ev.strTime || '20:00').slice(0, 5);

      const status = (ev.strStatus || '').toUpperCase();
      const isLive = status.includes('LIVE') || status.includes('HALF') || status.includes('IN PLAY') || /^\d+'/.test(status);

      return {
        id: ev.idEvent || String(i),
        leagueId: mapped.id,
        leagueName,
        flag: mapped.flag,
        isLive,
        dateKey,
        displayTime: isLive ? `LIVE ${ev.strProgress || ''}` : `${dateKey} • ${timeStr}`,
        home: ev.strHomeTeam || 'Équipe A',
        away: ev.strAwayTeam || 'Équipe B',
        homeScore: ev.intHomeScore ?? '0',
        awayScore: ev.intAwayScore ?? '0',
        odds: [
          Number((1.55 + (i % 6) * 0.25).toFixed(2)),
          Number((3.10 + (i % 4) * 0.20).toFixed(2)),
          Number((2.15 + ((i + 3) % 6) * 0.35).toFixed(2))
        ]
      };
    });

    return NextResponse.json({ success: true, count: matches.length, matches });
  } catch (err) {
    return NextResponse.json({ success: false, matches: [], error: String(err) });
  }
}
