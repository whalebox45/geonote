// 相對時間：交給 Intl.RelativeTimeFormat 處理單複數與各語系的說法
// （例：en "1 week ago" / "2 weeks ago"、zh-TW「1 週前」、ja「1 週間前」）
const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['second', 60],
  ['minute', 3600],
  ['hour', 86400],
  ['day', 604800],
  ['week', Infinity],
];

const SECONDS_PER_UNIT: Record<string, number> = {
  second: 1,
  minute: 60,
  hour: 3600,
  day: 86400,
  week: 604800,
};

function formatTimeAgo(isoDate: string, locale: string = 'en'): string {
  const diff = (Date.now() - new Date(isoDate).getTime()) / 1000;
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diff < 60) return rtf.format(0, 'second'); // "now" / 「現在」 / 「今」

  for (const [unit, limit] of UNITS) {
    if (diff < limit) {
      return rtf.format(-Math.floor(diff / SECONDS_PER_UNIT[unit]), unit);
    }
  }
  return rtf.format(-Math.floor(diff / SECONDS_PER_UNIT.week), 'week');
}

export {
  formatTimeAgo
};
