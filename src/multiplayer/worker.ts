import { v4 as uuidv4} from 'uuid'
import {Client, Match} from "@heroiclabs/nakama-js"
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
  match = await socket.createMatch()
}

async function joinMatch(match_id: string) {
  match = await socket.joinMatch(match_id)
  socket.onmatchdata = (matchState) => {
    console.log('got update')
    switch (matchState.op_code) {
        case Sync.CODES.POSITIONUPDATE:
            const data = new TextDecoder().decode(matchState.data)
            postMessage(JSON.parse(data))
            break;
        default:
            console.log("Unsupported op code");
            break;
    }
};
}

onmessage = async function(e: MessageEvent) {
  if(e.data.code === Sync.CODES.STARTMATCH) {
    await startMatch()
    console.log('start match')
    console.log(match.match_id)
  } else if (e.data.code === Sync.CODES.JOINMATCH) {
    console.log('join match')
    await joinMatch(e.data.match_id)
  } else if (e.data.code === Sync.CODES.STATESYNC) {
    console.log('sending update')
    socket.sendMatchState(match.match_id, Sync.CODES.POSITIONUPDATE, JSON.stringify(e.data.data))
  } else {
    console.error('unknown code', e.data.code)
  }
}