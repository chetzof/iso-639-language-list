import originalList from 'iso-639-3'
import nativeNameList from 'iso-639/data/iso_639-1.json'
import { outputFile } from 'fs-extra'
import prettier from 'prettier'
import speakers from 'speakers'
import { join } from 'path'

const rtl = [
  'ara',
  'arc',
  'ave',
  'egy',
  'heb',
  'nqo',
  'pal',
  'phn',
  'sam',
  'syc',
  'syr',
  'per',
  'fas',
  'kur',
  'urd',
]

import { Language, LanguageDataset } from './src/models'
import { hasKey } from './src/util'

type WoormyLanguage = Exclude<Language, 'isRTL' | 'nativeName' | 'speakers'>

export async function compile(languages: any, path: string): Promise<void> {
  const formattedOutput = prettier.format(JSON.stringify(languages), {
    parser: 'json-stringify',
  })
  await outputFile(join('.', path), formattedOutput)
}

async function run(): Promise<void> {
  const dataset: LanguageDataset = (originalList as WoormyLanguage[]).map(
    (language) => {
      const iso6391 = language.iso6391
      const iso6393 = language.iso6393

      const out: Language = Object.assign({}, language, {
        isRTL: rtl.includes(iso6393),
      })

      if (!iso6391) {
        return out
      }

      if (hasKey(nativeNameList, iso6391)) {
        out['nativeName'] = nativeNameList[iso6391].nativeName
          .split(',')
          .shift()
      }

      if (hasKey(speakers, iso6393)) {
        out['speakers'] = speakers[iso6393]
      }

      return out
    },
  )
  await compile(dataset, 'src/data.json')
}

run()
