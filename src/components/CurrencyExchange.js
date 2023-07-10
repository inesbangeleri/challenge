'use client'

import Image from 'next/image'
import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/20/solid'
import icon from '../../public/icon.svg'

const fetchRates = async (rate) => {
    return fetch(`https://api.vatcomply.com/rates?base=${rate}`)
    .then(res => res.json())
  }

export default function CurrencyExchange({ currencies, rates }) {
    const currenciesArray = Object.entries(currencies)
    const [selected, setSelected] = useState(currenciesArray.find(val => val[0] ===  'USD'))
    const [selectedTo, setToSelected] = useState(currenciesArray.find(val => val[0] ===  'EUR'))
    const [value, setValue] = useState(1.00)
    const [valueRate, setValueRate] = useState(rates.rates.EUR)
    const [selectadRates, setSelectadRates] = useState(rates.rates)

    const handleChange = event => {
        const inputValue = event.target.value;
    
        // Verificar si el valor es un número válido
        if (!/^\d*\.?\d*$/.test(inputValue)) {
          return;
        }
        
        // Verificar si el número es negativo
        const numberValue = parseFloat(inputValue);
        if (numberValue < 0) {
          return;
        }
        setValue(inputValue);   
      };

    const onChange = async (value) => {
        //console.log(value)
        const newRates = await fetchRates(value)
        setSelectadRates(newRates)
        //console.log('rates nuevos',newRates.rates)
        //console.log('rates del value', newRates.rates[selectedTo[0]])
        setValueRate(newRates.rates[selectedTo[0]])
    }
      
    const onChangeTo = async (value) => {
        //console.log(value)
        //console.log('ratessss', selectadRates)
        setValueRate(selectadRates[value])
    }

  return (
    <div className="container mx-auto">  
        <div class="grid grid-cols-4 " >  
            <div>
                <p>Amount:</p>
                <input
                className='text-black border-blue-200 border-2 rounded focus:ring-blue-200 focus:border-blue-200 focus:outline-none px-2'
                type="text"
                value={value}
                onChange={handleChange}
                placeholder="Enter a positive number"
                />
            </div>
            <div>
                <p>From:</p>
                <Listbox value={selected} onChange={(e) => {
                    console.log('onChange Data', e)
                    setSelected(e)
                    onChange(e[0])
                }}>
                <div className="relative mt-1">
                    <Listbox.Button className="">
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
            </div> 
            <div>
                <button onClick={() => alert('click')}>
                    <Image
                        priority="true"
                        src={icon}
                        alt="change"
                        width="40px"
                        height="40px"
                        layout="intrinsic"
                    />
                </button>
            </div>
            <div>
            <p>To:</p> 
                <Listbox value={selectedTo} onChange={(e) => {
                    console.log('onChangeTo Data', e)
                    setToSelected(e)
                    onChangeTo(e[0])
                }}>
                    <div className="relative mt-1">
                        <Listbox.Button>
                            <span className="block truncate">{selectedTo[1].name}</span>
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
            </div>
        </div>
        <div>
            <p class="text-sky-400">{`${value} ${selected[1].name} = ${value * valueRate} ${selectedTo[1].name}`}</p>
        </div>
    </div>
  )
}


