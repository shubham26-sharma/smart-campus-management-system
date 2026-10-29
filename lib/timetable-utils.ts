export function compareTimetableTimes(first: string, second: string) {
  const toMinutes = (value: string) => {
    const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(value.trim())
    if (!match) return Number.POSITIVE_INFINITY

    const hours = Number(match[1]) % 12
    const minutes = Number(match[2])
    return (hours + (match[3].toUpperCase() === 'PM' ? 12 : 0)) * 60 + minutes
  }

  return toMinutes(first) - toMinutes(second)
}
