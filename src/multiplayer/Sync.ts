import {Client, Match, Session, Socket} from "@heroiclabs/nakama-js"
import { v4 as uuidv4 } from 'uuid'

export class Sync {
    private static client: Client
    private static session: Session
    private static socket: Socket
    private static match: Match
    private static data: any[] = []

    public static async initialize() {
        this.client = new Client("defaultkey", "127.0.0.1", '7350', false)
        this.socket = this.client.createSocket()
        this.session = await this.getSession()

        var appearOnline = true
        await this.socket.connect(this.session, appearOnline)
    }

    private static async getSession() {
        var deviceId = uuidv4()
        var session = await Sync.client.authenticateDevice(deviceId)
        console.info("Successfully authenticated:", session)
        return session
    }

    public static async startMatch() {
        this.match = await this.socket.createMatch()
        return this.match
    }

    public static queueEvent(event: any) {
        this.data.push(event)
    }

    public static async sendUpdate() {
        var opCode = 1
        if(!this.data.length) {
            return
        }
        // this.socket.sendMatchState(this.match.match_id, opCode, JSON.stringify(this.data))
        this.data = []
    }
}