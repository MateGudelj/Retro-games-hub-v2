// src/lib/timeUtils.ts

const formatter = new Intl.RelativeTimeFormat('en', {
  numeric: 'auto', // This will format '1 day ago' as 'yesterday'
});

// Define time units in seconds
const DIVISIONS = [
  { amount: 60, name: 'seconds' },
  { amount: 60, name: 'minutes' },
  { amount: 24, name: 'hours' },
  { amount: 7, name: 'days' },
  { amount: 4.34524, name: 'weeks' },
  { amount: 12, name: 'months' },
  { amount: Number.POSITIVE_INFINITY, name: 'years' },
];

export function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = (now.getTime() - date.getTime()) / 1000;

  // --- This is the 7-day cutoff logic you wanted ---
  // If the post is more than 7 days old, return the standard date format.
  if (seconds > 60 * 60 * 24 * 7) {
    return date.toLocaleDateString();
  }
  // --- End of cutoff logic ---

  let duration = seconds;
  for (let i = 0; i < DIVISIONS.length; i++) {
    const division = DIVISIONS[i];
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(-duration), division.name as Intl.RelativeTimeFormatUnit);
    }
    duration /= division.amount;
  }
}