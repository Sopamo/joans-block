import { v4 as uuidv4} from 'uuid'
import {Client, Match, Session, Socket} from "@heroiclabs/nakama-js"
import { Sync } from './Sync'

const client = new Client("defaultkey", "127.0.0.1", '7350', false)
const socket = client.createSocket()
const session = await getSession()
await socket.connect(session, true)
let match: Match

async function getSession() {
  var deviceId = uuidv4()
  var session = await client.authenticateDevice(deviceId)
  return session
}

async function startMatch() {
  return await socket.createMatch()
}

onmessage = async function(e: MessageEvent) {
  if(e.data.code === 'startMath') {
    match = await startMatch()
  } else if (e.data.code === Sync.CODES.JOINMATCH) {
    match = await socket.joinMatch(e.data.match_id)
  } else if (e.data.code === Sync.CODES.POSITIONUPDATE) {
    socket.sendMatchState(match.match_id, Sync.CODES.POSITIONUPDATE, JSON.stringify(e.data.data))
  }
}