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

    const onClick = async () =>{
        //selected pase a ser selectedTo y selectedTo a selected
        const from1 = selected
        const to1 = selectedTo
        setSelected(to1)
        setToSelected(from1)
        //console.log('nuevo from', to1[0])
        //console.log('nuevo to',from1[0])
        const newRates = await fetchRates(to1[0])
        //console.log(newRates.rates)
        setSelectadRates(newRates.rates)
        //console.log('nuevo valor', newRates.rates[from1[0]])
        setValueRate(newRates.rates[from1[0]])
    }

  return (
    <div class="container mx-auto">
        <div className="grid grid-cols-1 mt-11 md:pt-14">  
            <div class="text-center content-center md:pb-9 text-white font-semibold leading-8 text-[32px]">
                {`${value} ${selected[0]} to ${selectedTo[0]}- Convert ${selected[1].name} to ${selectedTo[1].name}`}
            </div>
            <div class="ml-8 mr-8 mt-11 p-4 md:h-[435px] rounded-lg bg-white md:p-7 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                <div class="grid grid-cols-1 grid-rows-2 md:content-around md:grid-cols-4 md:grid-rows-2 md:gap-x-20" >  
                    <div class="mt-3">
                        <p class="pb-3 text-black font-semibold text-[16px] leading-5">Amount</p>
                        <input
                        className='text-black border-[1px] relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left sm:text-sm'
                        type="text"
                        value={value}
                        onChange={handleChange}
                        placeholder="Enter a positive number"
                        />
                    </div>
                    <div class="mt-3">
                        <p class="pb-3 text-black font-semibold text-[16px] leading-5">From</p>
                        <Listbox value={selected} onChange={(e) => {
                            console.log('onChange Data', e)
                            setSelected(e)
                            onChange(e[0])
                        }}>
                        <div className="relative mt-1">
                            <Listbox.Button className="text-black border-[1px] relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
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
                    <div class="flex justify-center mt-3">
                        <button onClick={onClick}>
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
                    <p class="pb-3 text-black font-semibold text-[16px] leading-5">To</p> 
                        <Listbox value={selectedTo} onChange={(e) => {
                            console.log('onChangeTo Data', e)
                            setToSelected(e)
                            onChangeTo(e[0])
                        }}>
                            <div className="relative mt-1">
                                <Listbox.Button class="text-black border-[1px] relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
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
                    <div class="mt-5">
                        <div class="text-[24px] leading-8 text-black font-semibold md:text-[32px] md:leading-9">{`${value} ${selected[1].name} = ${value * valueRate} ${selectedTo[1].name}`}</div>
                        <div class="text-[#757575] text-[16px] leading-9 font-normal">{`${value} ${selected[0]} = ${value * valueRate} ${selectedTo[0]}`}</div>
                    </div>
                    <div class="hidden bg-[#E8F3FF] rounded-lg md:h-[105px] md:w-[518px] md:p-5 md:col-span-3 md:visible">
                       <p class="text-left text-black text-[14px] leading-9">We use the mid-market rate for our Converter. This is for informational purposes only. You won’t receive this rate when sending money.</p> 
                    </div>
                </div>
            </div>
            <div class="ml-8 mr-8 mt-0">
                <p class="text-left text-black text-[12px] leading-6 font-light">
                    <a class="underline decoration-black">Euro</a> to <a class="underline decoration-black">US Dollar</a> conversion — Last updated Dec 15, 2022, 19:17 UTC
                </p> 
            </div>
        </div>
    </div>
  )
}

