export function hasKey<O>(obj: O, key: keyof never): key is keyof O {
  return key in obj
}
