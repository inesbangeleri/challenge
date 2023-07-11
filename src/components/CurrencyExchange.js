'use client'

import Image from 'next/image'
import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/20/solid'
import icon from '../../public/icon.svg'
import CommonText from './CommonText'

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
        const newRates = await fetchRates(value)
        setSelectadRates(newRates)
        setValueRate(newRates.rates[selectedTo[0]])
    }
      
    const onChangeTo = async (value) => {
        //console.log(value)
        //console.log('ratessss', selectadRates)
        setValueRate(selectadRates[value])
    }

    const onClick = async () =>{
        const from1 = selected
        const to1 = selectedTo
        setSelected(to1)
        setToSelected(from1)
        const newRates = await fetchRates(to1[0])
        setSelectadRates(newRates.rates)
        setValueRate(newRates.rates[from1[0]])
    }

  return (
    <div class="container mx-auto">
        <div className="grid grid-cols-1 mt-10 md:pt-14">  
            <div class="text-center content-center md:pb-9 text-white font-semibold leading-8 text-[32px]">
                {`${value} ${selected[0]} to ${selectedTo[0]}- Convert ${selected[1].name} to ${selectedTo[1].name}`}
            </div>
            <div class="ml-8 mr-8 mt-10 p-4 md:h-[435px] rounded-lg bg-white md:p-7 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                <div class="md:flex md:flex-col md:space-y-14">
                    <div class="flex flex-col md:flex md:flex-row  md:space-x-14" >
                        <div class="mt-3 md:grow">
                            <p class="pb-3 text-black font-semibold text-[16px] leading-5">Amount</p>
                            <div class="relative w-full">
                                <div class="text-black font-semibold text-[16px] leading-5 absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    $
                                </div>
                                <input
                                    class='block font-semibold text-[16px] text-black border-[1px] w-full cursor-default rounded-lg bg-white py-2 pl-7 pr-10 focus:ring-blue-500 focus:border-blue-500 text-left text-sm'
                                    type="text"
                                    value={value}
                                    onChange={handleChange}
                                    placeholder="Enter a positive number"
                                />
                            </div>
                        </div>
                        <div class="mt-3 md:grow">
                            <p class="pb-3 text-black font-semibold text-[16px] leading-5">From</p>
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
                        </div>
                        <div class="flex flex-none  w-14 h-14 justify-center mt-3 md:mt-10 md:items-start md:grow-0">
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
                        <div class="md:mt-3 md:grow">
                        <p class="pb-3 text-black font-semibold text-[16px] leading-5">To</p> 
                            <Listbox value={selectedTo} onChange={(e) => {
                                console.log('onChangeTo Data', e)
                                setToSelected(e)
                                onChangeTo(e[0])
                            }}>
                                <div >
                                    <Listbox.Button class="text-black font-semibold text-[16px] border-[1px] relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
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
                    <div class="flex flex-col md:flex md:flex-row " >
                        <div class="mt-5 md:flex md:flex-col md:space-y-4">
                            <div class="text-[24px] leading-8 text-black font-semibold md:text-[32px] md:leading-9 ">{`${value} ${selected[1].name} = ${value * valueRate} ${selectedTo[1].name}`}</div>
                            <div class="text-[#757575] text-[16px] leading-9 font-normal">{`${value} ${selected[0]} = ${value * valueRate} ${selectedTo[0]}`}</div>
                        </div>
                        <div class="hidden md:flex md:flex-col md:mt-24">
                            <div class="bg-[#E8F3FF] rounded-lg md:flex  md:p-5 ">
                                <p class="text-left text-black text-[14px] leading-9">We use the mid-market rate for our Converter. This is for informational purposes only. You won’t receive this rate when sending money.</p> 
                            </div>
                            <div class="ml-8 mr-8 mt-0 md:justify-items-end md:mr-0 md:ml-0 md:mt-0">
                                <p class="text-end text-black text-[12px] leading-6 font-light">
                                    <a class="underline decoration-black">Euro</a> to <a class="underline decoration-black">US Dollar</a> conversion — Last updated Dec 15, 2022, 19:17 UTC
                                </p> 
                            </div>
                        </div>    
                    </div>
                </div>
            </div>
            <div class="ml-8 mr-8 mt-0 md:hidden">
                <p class="text-left text-black text-[12px] leading-6 font-light">
                    <a class="underline decoration-black">Euro</a> to <a class="underline decoration-black">US Dollar</a> conversion — Last updated Dec 15, 2022, 19:17 UTC
                </p> 
            </div>
        </div>
    </div>
  )
}

/* 
<div className="grid grid-cols-1 mt-10 md:pt-14">  
<div class="text-center content-center md:pb-9 text-white font-semibold leading-8 text-[32px]">
    {`${value} ${selected[0]} to ${selectedTo[0]}- Convert ${selected[1].name} to ${selectedTo[1].name}`}
</div>
<div class="ml-8 mr-8 mt-10 p-4 md:h-[435px] rounded-lg bg-white md:p-7 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
    <div class="grid grid-cols-1 grid-rows-3 md:grid md:content-around md:grid-cols-4 md:grid-rows-2 md:gap-x-14" >  
        <div class="mt-3">
            <p class="pb-3 text-black font-semibold text-[16px] leading-5">Amount</p>
            <div class="relative w-full">
                <div class="text-black font-semibold text-[16px] leading-5 absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    $
                </div>
                <input
                    class='block font-semibold text-[16px] text-black border-[1px] w-full cursor-default rounded-lg bg-white py-2 pl-7 pr-10 focus:ring-blue-500 focus:border-blue-500 text-left text-sm'
                    type="text"
                    value={value}
                    onChange={handleChange}
                    placeholder="Enter a positive number"
                />
            </div>
        </div>
        <div class="mt-3">
            <p class="pb-3 text-black font-semibold text-[16px] leading-5">From</p>
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
        </div>
        <div class="flex flex-none  w-14 h-14 justify-center mt-3 md:mt-10 md:items-start">
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
        <div class="md:mt-3">
        <p class="pb-3 text-black font-semibold text-[16px] leading-5">To</p> 
            <Listbox value={selectedTo} onChange={(e) => {
                console.log('onChangeTo Data', e)
                setToSelected(e)
                onChangeTo(e[0])
            }}>
                <div >
                    <Listbox.Button class="text-black font-semibold text-[16px] border-[1px] relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
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
        <div class="mt-5 md:mt-0 md:col-span-1">
            <div class="text-[24px] leading-8 text-black font-semibold md:text-[32px] md:leading-9">{`${value} ${selected[1].name} = ${value * valueRate} ${selectedTo[1].name}`}</div>
        </div>
        <div class="md:col-span-4"></div>
        <div class="md:col-span-2">
            <div class="text-[#757575] text-[16px] leading-9 font-normal">{`${value} ${selected[0]} = ${value * valueRate} ${selectedTo[0]}`}</div>
        </div>
        <div class="md:col-span-2">
            <div class="hidden md:flex md:flex-col">
                <div class="bg-[#E8F3FF] rounded-lg md:flex md:h-[105px] md:w-[518px] md:p-5 ">
                    <p class="text-left text-black text-[14px] leading-9">We use the mid-market rate for our Converter. This is for informational purposes only. You won’t receive this rate when sending money.</p> 
                </div>
                <div class="ml-8 mr-8 mt-0">
                    <p class="text-left text-black text-[12px] leading-6 font-light">
                        <a class="underline decoration-black">Euro</a> to <a class="underline decoration-black">US Dollar</a> conversion — Last updated Dec 15, 2022, 19:17 UTC
                    </p> 
                </div>
            </div>
        </div>
        
    </div>
</div>
<div class="ml-8 mr-8 mt-0 md:hidden">
    <p class="text-left text-black text-[12px] leading-6 font-light">
        <a class="underline decoration-black">Euro</a> to <a class="underline decoration-black">US Dollar</a> conversion — Last updated Dec 15, 2022, 19:17 UTC
    </p> 
</div>
</div> */