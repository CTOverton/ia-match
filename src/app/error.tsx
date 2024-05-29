'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className={'absolute h-full w-full'}>
      <div className={'flex h-full w-full items-center justify-center'}>
        <div
          className={
            'rounded-md bg-gray-400/10 px-4 py-2 ring-1 ring-inset ring-gray-400/20'
          }
        >
          <h2>Something went wrong!</h2>
        </div>
      </div>
    </div>
  )
}
