import { v4 as uuidv4} from 'uuid'
import {Client, Match, Session, Socket} from "@heroiclabs/nakama-js"

const client = new Client("defaultkey", "127.0.0.1", '7350', false)
const socket = client.createSocket()
const session = await getSession()
await socket.connect(session, true)
const match = await startMatch()

async function getSession() {
  var deviceId = uuidv4()
  var session = await client.authenticateDevice(deviceId)
  console.info("Successfully authenticated:", session)
  return session
}

async function startMatch() {
  return await socket.createMatch()
}

onmessage = function(e: MessageEvent) {
  const opCode = 1
  socket.sendMatchState(match.match_id, opCode, JSON.stringify(e.data))
}