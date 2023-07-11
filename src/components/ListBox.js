import Image from 'next/image'
import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/20/solid'

export default function ListBox() {
    return (
        <Listbox value={selected} onChange={(e) => {
            console.log('onChange Data', e)
            setSelected(e)
            onChange(e[0])
        }}>
        <div className="relative">
            <Listbox.Button className="text-black font-semibold text-[16px] border-[1px] relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate">{selected[1].name}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                />
                </span>
            </Listbox.Button>
        <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {currenciesArray.map((currency, idx) => (
                <Listbox.Option
                key={idx}
                className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                    }`
                }
                value={currency}
                >
                {({ selected }) => (
                    <>
                    <span
                        className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                        }`}
                    >
                        {currency[1].name}
                    </span>
                    {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                    ) : null}
                    </>
                )}
                </Listbox.Option>
            ))}
            </Listbox.Options>
        </Transition>
        </div>
        </Listbox>
    )
}