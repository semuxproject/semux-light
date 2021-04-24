import BigNumber from 'bignumber.js'
import { Buffer } from 'buffer'
import * as Long from 'long'
import { Transaction } from 'semux-js'
import { exec } from '../lib/api'
import { mutableReverse } from '../lib/utils'
import { AccountType } from './account'

export const TX_FEE_NANO = Long.fromNumber(5e6)
export const TX_FEE_SEM = new BigNumber(TX_FEE_NANO.toNumber()).div(1e9)

export interface TransactionTypeRemote {
  blockNumber: string
  hash: string
  type: 'COINBASE' | 'TRANSFER' | 'DELEGATE' | 'VOTE' | 'UNVOTE' | 'CREATE' | 'CALL'
  from: string
  to: string
  value: string
  fee: string
  nonce: string
  timestamp: string
  data: string
}
export interface PendingTransactionTypeRemote {
  hash: string
  type: 'COINBASE' | 'TRANSFER' | 'DELEGATE' | 'VOTE' | 'UNVOTE' | 'CREATE' | 'CALL'
  from: string
  to: string
  value: string
  fee: string
  nonce: string
  timestamp: string
  data: string
}

export interface TransactionType {
  blockNumber: string | undefined
  hash: string
  type: 'COINBASE' | 'TRANSFER' | 'DELEGATE' | 'VOTE' | 'UNVOTE' | 'CREATE' | 'CALL'
  from: string
  to: string
  value: BigNumber
  fee: BigNumber
  nonce: Long
  timestamp: Date
  data: string
}

export interface TransactionTypeCasePattern<T> {
  vote(): T
  unvote(): T
  transfer(): T
}

export function caseTypeOf<T>(tx: TransactionType, otherwise: T, casePattern: TransactionTypeCasePattern<T>) {
  switch (tx.type) {
    case 'VOTE': return casePattern.vote()
    case 'UNVOTE': return casePattern.unvote()
    case 'TRANSFER': return casePattern.transfer()
    default: return otherwise
  }
}

export function publishTx(tx: Transaction): Promise<undefined> {
  const encodedTx = Buffer.from(tx.toBytes().buffer).toString('hex')
  return exec('GET', `/broadcast-raw-transaction?raw=${encodedTx}`)
}

export async function fetchTxs(address: string, from: number, to: number): Promise<TransactionType[]> {
  const path = `/account/transactions?address=${address}&from=${from}&to=${to}`
  const remotes = to > from ? await exec<TransactionTypeRemote[]>('GET', path) : []
  return mutableReverse(remotes.map((r, idx) => ({
    blockNumber: r.blockNumber,
    hash: r.hash,
    type: r.type,
    from: r.from,
    to: r.to,
    value: new BigNumber(r.value).div(1e9),
    fee: new BigNumber(r.fee).div(1e9),
    nonce: Long.fromString(r.nonce),
    timestamp: new Date(parseInt(r.timestamp, 10)),
    data: r.data,
  })))
}

export async function fetchPendingTxs(address: string): Promise<TransactionType[]> {
  const path = `/account/pending-transactions?address=${address}&from=0&to=999`
  const remotes = await exec<PendingTransactionTypeRemote[]>('GET', path)
  return mutableReverse(remotes.map((r, idx) => ({
    blockNumber: undefined,
    hash: r.hash,
    type: r.type,
    from: r.from,
    to: r.to,
    value: new BigNumber(r.value).div(1e9),
    fee: new BigNumber(r.fee).div(1e9),
    nonce: Long.fromString(r.nonce),
    timestamp: new Date(parseInt(r.timestamp, 10)),
    data: r.data,
  })))
}
