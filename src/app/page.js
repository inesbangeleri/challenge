import Image from 'next/image'
import CurrencyExchange from '@/components/CurrencyExchange'

const fetchCurrencies = async () => {
  return fetch('https://api.vatcomply.com/currencies')
  .then(res => res.json())
}

const fetchRates = async () => {
  return fetch(`https://api.vatcomply.com/rates?base=USD`)
  .then(res => res.json())
}

export default async function Home() {
  const currencies = await fetchCurrencies()
  const rates = await fetchRates()
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <CurrencyExchange currencies={currencies} rates={rates}/>
    </main>
  )
}
