import { LanguageCollection } from './src/index'
import { compile } from './build'
import { Type } from './src/models'

async function run(): Promise<void> {
  await compile(
    new LanguageCollection()
      .filterByType(Type.Living)
      .filterByNumberOfSpeakers(1000000)
      .sortByNumberOfSpeakers(10)
      .getAsKeyValue('iso6391', 'nativeName'),
    'dist/generated/top10-speakers-then-az-key-value.json',
  )

  await compile(
    new LanguageCollection()
      .filterByType(Type.Living)
      .filterByNumberOfSpeakers(1000000)
      .sortByNumberOfSpeakers(10)
      .getWithMapper((language) => ({
        value: language.iso6391,
        label: language.nativeName,
      })),
    'dist/generated/top10-speakers-then-az-value-label.json',
  )
}

run()
