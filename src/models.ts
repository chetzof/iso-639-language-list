export enum Scope {
  Individual = 'individual',
  Macrolanguage = 'macrolanguage',
  Special = 'special',
}

export enum Type {
  Ancient = 'ancient',
  Constructed = 'constructed',
  Extinct = 'extinct',
  Historical = 'historical',
  Living = 'living',
  Special = 'special',
}

export interface Language {
  name: string
  nativeName?: string
  type: Type
  scope: Scope
  iso6393: string
  iso6392B?: string
  iso6392T?: string
  iso6391?: string
  speakers?: number
  isRTL: boolean
}

export type LanguageDataset = Language[]
