import { useEffect, useState } from 'react'

function formatTime(timeZone) {
  // en-GB gives a 24-hour clock and short zone names, e.g. "10:37 CET".
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
    timeZoneName: 'short',
  }).format(new Date())
}

/** The current time in an IANA time zone, refreshed a few times a minute. */
export function useLocalTime(timeZone) {
  const [time, setTime] = useState(() => formatTime(timeZone))

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(timeZone)), 15_000)
    return () => clearInterval(id)
  }, [timeZone])

  return time
}
