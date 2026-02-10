import { parsePhoneNumberFromString } from 'libphonenumber-js'

export const normalizePhoneNumber = (input?: string | null): string | null => {
  if (!input) return null

  const trimmed = input.trim()
  const parsed = parsePhoneNumberFromString(trimmed)

  if (!parsed || !parsed.isValid()) return null

  return parsed.number
}

export const isValidPhoneNumber = (input: string): boolean => {
  return normalizePhoneNumber(input) !== null
}
