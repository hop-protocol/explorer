import fetch from 'isomorphic-fetch'
import { tokens } from '@hop-protocol/core/metadata'
import { CoingeckoApiKey } from './config'

function getCoinId (tokenSymbol: string) {
  return tokens[tokenSymbol]?.coingeckoId
}

export async function getPriceHistory (tokenSymbol: string, days: number) {
  const coinId = getCoinId(tokenSymbol)
  if (!coinId) {
    throw new Error(`coingecko coin id not found for token "${tokenSymbol}"`)
  }

  const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`
  return Promise.race([fetch(url)
    .then(async (res: any) => {
      if (res.status > 400) {
        throw await res.text()
      }
      return res.json()
    })
    .then((json: any) => {
      console.log('fetched', coinId)
      return json.prices.map((data: any[]) => {
        data[0] = Math.floor(data[0] / 1000)
        return data
      })
    }),
  new Promise((resolve: any, reject) => {
    setTimeout(() => reject(new Error('request timeout: ' + url)), 2 * 60 * 1000)
  })
  ])
}

export async function getPriceByTimestamp (tokenSymbol: string, unixTimestamp: number): Promise<number> {
  const coinId = getCoinId(tokenSymbol)

  // Coingecko granularity is 5 minutes. Look backwards to give it time to update
  const fiveMinutes = 5 * 60
  const startTimestamp = unixTimestamp - fiveMinutes
  const endTimestamp = unixTimestamp
  const url = `https://pro-api.coingecko.com/api/v3/coins/${coinId}/market_chart/range/?vs_currency=usd&from=${startTimestamp}&to=${endTimestamp}&x_cg_pro_api_key=${CoingeckoApiKey}`

  const res = await fetch(url)
  const resJson = await res.json()
  const price: number = resJson.prices[0][1]
  if (!price) {
    throw new Error(`Failed to get price at ${unixTimestamp}`)
  }

  return price
}
