'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown'
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
  useClose,
} from '@headlessui/react'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export type IdButtonProps = {
  ids: string[]
  position: number
}

export default function IdButton({ ids, position }: IdButtonProps) {
  return (
    <Popover className="relative">
      <PopoverButton
        className={
          'flex items-center space-x-2 rounded-md bg-gray-400/10 px-2 py-1 text-xs ring-1 ring-inset ring-gray-400/20'
        }
      >
        <span>{ids[position]}</span>
        <FontAwesomeIcon
          icon={faCaretDown}
          className={'h-3 w-3 -translate-y-0.5 text-neutral-500'}
        />
      </PopoverButton>
      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <PopoverPanel anchor="bottom start" focus>
          <EditIdForm ids={ids} position={position} />
        </PopoverPanel>
      </Transition>
    </Popover>
  )
}

type EditIdFormProps = {
  ids: string[]
  position: number
}

function EditIdForm({ ids, position }: EditIdFormProps) {
  const [id, setId] = useState(ids[position])
  const router = useRouter()
  const close = useClose()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (id === ids[position]) {
      close()
      return
    }
    if (position === 0) router.push(`/compare/${id}...${ids[1]}`)
    else router.push(`/compare/${ids[0]}...${id}`)
    close()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex min-w-60 flex-col rounded-md bg-white text-xs ring-1 ring-inset ring-gray-400/20 [--anchor-gap:4px] [--anchor-padding:4px]"
    >
      <div className={'border-b border-b-gray-400/20 px-4 py-2 font-medium'}>
        Choose alternate id
      </div>
      <input
        className={
          'mx-2 my-2 flex-1 items-center space-x-2 rounded-md bg-gray-400/10 px-2.5 py-1.5 text-xs ring-1 ring-inset ring-gray-400/20'
        }
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <div
        className={'flex justify-end border-t border-t-gray-400/20 px-2 py-2'}
      >
        <button
          className={
            'rounded-md bg-green-600 px-4 py-1 text-sm font-medium text-neutral-100 ring-1 ring-inset ring-neutral-800/10'
          }
          type={'submit'}
        >
          Submit
        </button>
      </div>
    </form>
  )
}
