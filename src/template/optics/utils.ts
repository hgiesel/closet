export const escapeRegExp = (s: string): string => {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const regExpString = (re: string | RegExp): string => {
    return re instanceof RegExp ? re.source : re
}
