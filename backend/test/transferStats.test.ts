import TransferStats from '../src/TransferStats'

// run with:
// NETWORK=mainnet ts-node test/transferStats.test.ts

async function main () {
  // Ethereum
  let txHash = '0xec4f2c2052d4db8721b249788ec4405b0719990b4d3692259b1cdb4a4ce0b5c2'
  let res = await TransferStats.getTransferStatusForTxHash(txHash)
  let expected = 0
  if (res?.bondTotalCostUsd !== expected) {
    throw new Error(`Expected ${expected} but got ${res?.bondTotalCostUsd}`)
  }
  console.log('completed test 1')

  // Optimism -> Polygon
  txHash = '0x37a2efd2b18aecaf15b7165bb5c5be0adccd86920609726ab3174086298cf0ed'
  res = await TransferStats.getTransferStatusForTxHash(txHash)
  expected = 0.018402865186104324
  if (res?.bondTotalCostUsd !== expected) {
    throw new Error(`Expected ${expected} but got ${res?.bondTotalCostUsd}`)
  }
  console.log('completed test 2')

  // Arbitrum -> Base
  txHash = '0x2163e14255b08ecc1edccc9f01746baa061a17e4c76c1fc2e4cfef2a399b69f5'
  res = await TransferStats.getTransferStatusForTxHash(txHash)
  expected = 0.16579387556699104
  if (res?.bondTotalCostUsd !== expected) {
    throw new Error(`Expected ${expected} but got ${res?.bondTotalCostUsd}`)
  }
  console.log('completed test 3')

  // Optimism -> arbitrum
  txHash = '0x0eb6222f90bd65f59629118f8829cdf2a655820f06e5559c6455388136b63b4b'
  res = await TransferStats.getTransferStatusForTxHash(txHash)
  expected = 5.1111111111
  if (res?.bondTotalCostUsd !== expected) {
    throw new Error(`Expected ${expected} but got ${res?.bondTotalCostUsd}`)
  }
  console.log('completed test 4')
}

main().catch(console.error)
