export const title_case = (
  string: undefined | null | string | number
): string => {
  if (string === undefined || string === null) return ""
  return (
    string
      .toString()
      .replace(/([^A-Z])([A-Z])/g, "$1 $2") // split cameCase
      // eslint-disable-next-line no-useless-escape
      .replace(/[_\-]+/g, " ") // split snake_case and lisp-case
      .toLowerCase()
      .replace(/(^\w|\b\w)/g, function (m) {
        return m.toUpperCase()
      }) // title case words
      .replace(/\s+/g, " ") // collapse repeated whitespace
      .replace(/^\s+|\s+$/, "")
  ) // remove leading/trailing whitespace
}

export const filter_object = <Value extends any>(
  obj: Record<string, Value>,
  callback: (key: string, value: Value) => any
) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, val]) => callback(key, val))
  )
}

/**
 * MUTATES THE INPUT OBJECT
 */
export const rename_key = (
  obj: Record<string, any>,
  existing_key: string,
  new_key: string
) => {
  obj[new_key] = obj[existing_key]
  delete obj[existing_key]
}