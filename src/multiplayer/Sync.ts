import {Client, Match, Session, Socket} from "@heroiclabs/nakama-js"
import { v4 as uuidv4 } from 'uuid'

export class Sync {
    private static socket: Socket
    private static match: Match
    private static data: Record<number, any> = {}
    private static worker: Worker

    public static async initialize() {
        this.worker = new Worker(new URL('./worker.ts', import.meta.url), {
            type: 'module'
        })
    }

    public static queueEvent(event: any) {
        if(Object.keys(this.data).length > 5) {
            return
        }
        this.data[event.id] = event
    }

    public static async sendUpdate() {
        var opCode = 1
        if(!Object.keys(this.data).length) {
            return
        }
        // this.worker.postMessage(this.data);
        this.data = {}
    }
}