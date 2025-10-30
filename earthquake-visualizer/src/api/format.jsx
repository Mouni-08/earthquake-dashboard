import { format } from 'date-fns'

export function formatTime(ms) {
  try {
    return format(new Date(ms), 'PPpp')
  } catch {
    return new Date(ms).toLocaleString()
  }
}
