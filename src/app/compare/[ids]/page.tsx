import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowRightArrowLeft'
import { faPlusMinus } from '@fortawesome/free-solid-svg-icons/faPlusMinus'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import IdButton from '@/components/idButton'

async function getMetadata(id: string) {
  const res = await fetch(`https://archive.org/metadata/${id}`)

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

const metadataCompareKeys = [
  { key: 'identifier', label: 'identifier', compare: false },
  { key: 'title', label: 'title', compare: true },
  { key: 'creator', label: 'creator', compare: true },
  { key: 'date', label: 'date', compare: true },
  { key: 'year', label: 'year', compare: true },
  { key: 'originalFileLength', label: 'original Length', compare: false },
  { key: 'derivativeFileLength', label: 'derived Length', compare: false },
  { key: 'description', label: 'description', compare: true, weight: 0.5 },
  // { key: 'mediatype', label: 'media type', compare: true },
  { key: 'originalurl', label: 'url', compare: false },
  { key: 'season', label: 'season', compare: false },
  { key: 'episode', label: 'episode', compare: false },
  {
    key: 'firstexclusive',
    label: 'first exclusive',
    compare: false,
    weight: 1,
  },
  { key: 'show_title', label: 'show title', compare: false },
  { key: 'subject', label: 'subject', compare: false },
  { key: 'collection', label: 'collection', compare: false },
  { key: 'scanner', label: 'scanner', compare: false },
  { key: 'uploader', label: 'uploader', compare: false },
  { key: 'publicdate', label: 'public date', compare: false },
  { key: 'addeddate', label: 'added date', compare: false },
  { key: 'curation', label: 'curation', compare: false },
]

function compareDates(date1: string, date2: string) {
  const d1 = new Date(date1)
  const d2 = new Date(date2)

  return Math.abs(d1.getTime() - d2.getTime()) / (1000 * 3600 * 24)
}

function cleanString(str: string) {
  if (!str) return ''
  return str.toLowerCase().replace(/[^A-Z0-9]+/gi, '')
}

export default async function Compare({ params }: { params: { ids: string } }) {
  const ids = params.ids.split('...')
  const results = await Promise.all(ids.map((id) => getMetadata(id)))

  const originalFiles = results.map((data) =>
    data.files.find((file: any) => file.source === 'original' && file.length),
  )
  const derivativeFiles = results.map((data) =>
    data.files.find((file: any) => file.source === 'derivative' && file.length),
  )

  const thumbnails = results.map((data) => {
    const dir = data.dir
    const file = data.files.find(
      (file: any) =>
        file.source === 'original' &&
        (file.format === 'PNG' ||
          file.format === 'JPG' ||
          file.format === 'JPEG' ||
          file.name.includes('webp')),
    )

    if (!file) return null

    return `https://archive.org${dir}/${file.name}`
  })

  const compareData = results.map((data, index) => ({
    ...data.metadata,
    originalFileLength: originalFiles[index]?.length,
    derivativeFileLength: derivativeFiles[index]?.length,
  }))

  const compareField = (field: string): boolean | 'similar' => {
    switch (field) {
      case 'date':
        const difference = compareDates(
          compareData[0].date,
          compareData[1].date,
        )

        if (difference === 0) return true
        if (difference < 3) return 'similar'
        return false
      case 'description':
        const clean1 = cleanString(compareData[0].description)
        const clean2 = cleanString(compareData[1].description)

        return (
          clean1 === clean2 ||
          clean1.includes(clean2) ||
          clean2.includes(clean1)
        )
      default:
        return (
          cleanString(compareData[0][field]) ===
          cleanString(compareData[1][field])
        )
    }
  }

  const getBackground = (isMatch: boolean | 'similar' | null) => {
    if (isMatch === null) return ''
    if (isMatch === 'similar') return 'bg-yellow-400/10 text-yellow-400'

    return isMatch
      ? 'bg-green-400/10 text-green-400'
      : 'bg-red-400/10 text-red-400'
  }

  return (
    <main className={'space-y-4 p-4'}>
      <h1 className={'text-xl'}>Compare videos</h1>
      <hr />
      <div
        className={
          'rounded-md bg-gray-400/10 px-4 py-2 ring-1 ring-inset ring-gray-400/20'
        }
      >
        <div className={'flex items-center justify-between'}>
          <div className={'flex space-x-2'}>
            <IdButton ids={ids} position={0} />
            <div className={'flex items-center justify-center'}>
              <FontAwesomeIcon
                icon={faArrowRightArrowLeft}
                className={'h-4 w-4 text-neutral-500'}
              />
            </div>
            <IdButton ids={ids} position={1} />
          </div>

          {/*<div className={'flex space-x-2'}>*/}
          {/*  <button*/}
          {/*    className={*/}
          {/*      'rounded-md bg-gray-400/10 px-4 py-1 text-sm font-medium text-red-500 ring-1 ring-inset ring-neutral-800/10'*/}
          {/*    }*/}
          {/*  >*/}
          {/*    Deny*/}
          {/*  </button>*/}
          {/*  <button*/}
          {/*    className={*/}
          {/*      'rounded-md bg-green-600 px-4 py-1 text-sm font-medium text-neutral-100 ring-1 ring-inset ring-neutral-800/10'*/}
          {/*    }*/}
          {/*  >*/}
          {/*    Confirm*/}
          {/*  </button>*/}
          {/*</div>*/}
        </div>
      </div>
      <div className={''}>
        <div className={'mb-2 grid grid-cols-3'}>
          <div></div>
          {ids.map((id, index) => (
            <div key={id} className={'mx-2 overflow-clip rounded-md'}>
              <iframe
                src={`https://archive.org/embed/${id}`}
                className={'aspect-video w-full bg-gray-400/10'}
                allowFullScreen
              ></iframe>
            </div>
          ))}
        </div>

        <div
          className={
            'overflow-clip rounded-l-md ring-1 ring-inset ring-gray-400/20'
          }
        >
          <div className={`grid grid-cols-3 text-sm odd:bg-gray-400/10`}>
            <div className={'flex justify-between px-4 py-2'}>thumbnail</div>
            {thumbnails.map((data, index) => (
              <div key={index} className={'px-2 py-2'}>
                <img
                  key={index}
                  className={'max-h-40 rounded-md object-contain'}
                  src={data ?? ''}
                  alt={'thumbnail'}
                />
              </div>
            ))}
          </div>
          {metadataCompareKeys.map(({ key, label, compare }) => {
            const difference = compareDates(
              compareData[0].date,
              compareData[1].date,
            )

            return (
              <div
                key={key}
                className={`grid grid-cols-3 text-sm ${compare ? getBackground(compareField(key)) : 'odd:bg-gray-400/10'} `}
              >
                <div className={'flex justify-between px-4 py-2'}>
                  {label}
                  {key === 'date' && difference > 0 && (
                    <span>
                      <FontAwesomeIcon
                        icon={faPlusMinus}
                        className={'mx-1 inline h-2.5 w-2.5 text-yellow-400'}
                      />
                      {difference}
                    </span>
                  )}
                </div>
                {compareData.map((data, index) => (
                  <div key={index} className={'overflow-auto px-2 py-2'}>
                    {data[key]}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
