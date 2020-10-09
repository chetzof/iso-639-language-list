import dataset from './data.json'
import { Language, LanguageDataset, Scope, Type } from './models'
import pick from 'lodash/pick'

type Sorter = { (collection: LanguageDataset): LanguageDataset }
type Filter = { (language: Language): boolean }

type Filters = Partial<Language>
export class LanguageCollection {
  protected filters: Filter[] = []
  protected sorters: Sorter[] = []

  public filterByScope(scope: Scope): this {
    this.filters.push((language) => language.scope === scope)
    return this
  }

  public filterByType(type: Type): this {
    this.filters.push((language) => language.type === type)
    return this
  }

  public filterByNumberOfSpeakers(minSpeakerNumber: number): this {
    this.filters.push(
      (language) =>
        language.speakers !== undefined &&
        language.speakers >= minSpeakerNumber,
    )
    return this
  }

  public sortByNumberOfSpeakers(topX?: number): this {
    this.sorters.push((dataset) => {
      const sorted = [...dataset].sort((langA, langB) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return langB.speakers! - langA.speakers!
      })

      if (!topX) {
        return sorted
      }

      const sortedSlice = sorted.slice(0, topX)
      const excludedLangCodes: string[] = sortedSlice.map(
        (lang) => lang.iso6393,
      )

      const filtered = dataset.filter(
        (lang) => !excludedLangCodes.includes(lang.iso6393),
      )

      return sortedSlice.concat(filtered)
    })

    return this
  }

  public getRaw(): LanguageDataset {
    let filteredDataset = (dataset as LanguageDataset).filter((language) => {
      return this.filters.every((filter) => filter(language))
    })

    const reducer = (
      accumulator: LanguageDataset,
      sorter: Sorter,
    ): LanguageDataset => {
      return sorter(accumulator)
    }

    filteredDataset = this.sorters.reduce(reducer, filteredDataset)

    return filteredDataset
  }

  public getWithFields<T extends keyof Filters>(
    fields: T[],
  ): { [K in T]: Language[K] }[] {
    return this.getRaw().map((language) => pick(language, fields))
  }

  public getWithMapper<T>(mapper: { (language: Language): T }) {
    return this.getRaw().map(mapper)
  }

  public getAsKeyValue<T extends keyof Language>(
    key: T,
    value: T,
  ): Record<string, Language[T]> {
    const out: Record<string, Language[T]> = {}
    for (const lang of this.getRaw()) {
      const langKey = lang[key] as string
      const langVal = lang[value]
      if (langKey === undefined) {
        continue
      }

      out[langKey] = langVal
    }

    return out
  }
}
