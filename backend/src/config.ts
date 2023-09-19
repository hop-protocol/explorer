import { goerli as goerliAddresses, mainnet as mainnetAddresses } from '@hop-protocol/core/addresses'
import { goerli as goerliNetworks, mainnet as mainnetNetworks } from '@hop-protocol/core/networks'
import { getDefaultRpcUrl } from './utils/getDefaultRpcUrl'

require('dotenv').config()

export const network = process.env.NETWORK || 'mainnet'
export const isGoerli = network === 'goerli'
export const port = Number(process.env.PORT || 3000)
export const ipRateLimitReqPerSec = Number(process.env.IP_RATE_LIMIT_REQ_PER_SEC || 100)
export const ipRateLimitWindowMs = Number(process.env.IP_RATE_LIMIT_WINDOW_MS || 1 * 1000)
export const postgresConfig = {
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DBNAME,
  password: process.env.POSTGRES_PASS,
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : 5432,
  maxConnections: process.env.POSTGRES_MAX_CONNECTIONS ? parseInt(process.env.POSTGRES_MAX_CONNECTIONS, 10) : 10
}
export const regenesisEnabled = process.env.REGENESIS_ENABLED === 'true'

const tokenSet = new Set([])
const chainSet = new Set([])

const addresses = isGoerli ? goerliAddresses : mainnetAddresses
for (const token in addresses.bridges) {
  tokenSet.add(token)

  for (const chain in addresses.bridges[token]) {
    chainSet.add(chain)
  }
}

let enabledTokens = Array.from(tokenSet)
let enabledChains = Array.from(chainSet)

if (process.env.ENABLED_TOKENS) {
  enabledTokens = process.env.ENABLED_TOKENS.split(',').map((token: any) => token.trim()).filter(Boolean)
}

if (process.env.ENABLED_CHAINS) {
  enabledChains = process.env.ENABLED_CHAINS.split(',').map((chain: any) => chain.trim()).filter(Boolean)
}

export { enabledTokens, enabledChains }

export const rpcUrls : any = {}

for (const chain of enabledChains) {
  rpcUrls[chain] = process.env[`${chain.toUpperCase()}_RPC`] || getDefaultRpcUrl(network, chain)
}

export const networks = isGoerli ? goerliNetworks : mainnetNetworks
export const CoingeckoApiKey = process.env.COINGECKO_API_KEY || ''

export const NativeTokenPerChainSlug: Record<string, string> = {
  ethereum: 'ETH',
  optimism: 'ETH',
  arbitrum: 'ETH',
  polygon: 'MATIC',
  gnosis: 'ETH',
  nova: 'ETH',
  base: 'ETH'
}

// TODO: maybe move this to core config?
export const transferTimes = {
  ethereum: {
    optimism: 2,
    arbitrum: 10,
    polygon: 20,
    gnosis: 20,
    nova: 10,
    base: 2
  },
  optimism: {
    ethereum: 25,
    arbitrum: 25,
    polygon: 25,
    gnosis: 25,
    nova: 25,
    base: 25
  },
  arbitrum: {
    ethereum: 12,
    optimism: 12,
    polygon: 12,
    gnosis: 12,
    nova: 12,
    base: 12
  },
  polygon: {
    ethereum: 10,
    optimism: 10,
    arbitrum: 10,
    gnosis: 10,
    nova: 10,
    base: 10
  },
  gnosis: {
    ethereum: 4,
    optimism: 4,
    arbitrum: 4,
    polygon: 4,
    nova: 4,
    base: 4
  },
  nova: {
    ethereum: 12,
    optimism: 12,
    arbitrum: 12,
    polygon: 12,
    gnosis: 12,
    base: 12
  },
  base: {
    ethereum: 25,
    optimism: 25,
    arbitrum: 25,
    polygon: 25,
    gnosis: 25,
    nova: 25
  },
  scroll: {
    ethereum: 1,
    optimism: 1,
    arbitrum: 1,
    polygon: 1,
    gnosis: 1,
    nova: 1,
    base: 1
  }
}

// note: keep the addresses lowercased
export const integrations : Record<string, string> = {
  '0xc30141b657f4216252dc59af2e7cdb9d8792e1b0': 'socket', // socket registry
  '0x8b14984de0ddd2e080d8679febe2f5c94b975af8': 'socket', // socket registry
  '0xc9b6f5eeabb099bbbfb130b78249e81f70efc946': 'socket', // socket registry
  '0x3a23f943181408eac424116af7b7790c94cb97a5': 'socket', // socket gateway
  '0x362fa9d0bca5d19f743db50738345ce2b40ec99f': 'lifi',
  '0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae': 'lifi',
  '0x82e0b8cdd80af5930c4452c684e71c861148ec8a': 'metamask',
  '0xf26055894aeaae23d136defaa355a041a43d7dfd': 'chainhop',
  '0xf762c3fc745948ff49a3da00ccdc6b755e44305e': 'chainhop',
  '0xf80dd9cef747710b0bb6a113405eb6bc394ce050': 'chainhop',
  '0x696c91cdc3e79a74785c2cdd07ccc1bf0bc7b788': 'chainhop',
  '0x777777773491ff5cef6bb758f3baa9d70886909c': 'viaprotocol' // via protocol
}

console.log('network:', network)
console.log('enabledTokens:', enabledTokens)
console.log('enabledChains:', enabledChains)
console.log('rpcUrls:', rpcUrls)
