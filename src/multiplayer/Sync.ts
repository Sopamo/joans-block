export class Sync {
    private static data: Record<number, any> = {}
    private static worker: Worker
    private static isHost = false
    public static readonly CODES = {
        STARTMATCH: 1,
        JOINMATCH: 2,
        POSITIONUPDATE: 3,
    }

    public static async initialize() {
        this.worker = new Worker(new URL('./worker.ts', import.meta.url), {
            type: 'module'
        })
    }

    public static queueEvent(event: any) {
        this.data[event.id] = event
    }

    public static async startMatch() {
        this.isHost = true
        this.worker.postMessage({code: this.CODES.STARTMATCH})
    }

    public static async joinMatch(match_id: string) {
        this.worker.postMessage({code: this.CODES.STARTMATCH, match_id})
    }

    public static async sendUpdate() {
        if(!this.isHost) {
            return
        }
        if(!Object.keys(this.data).length) {
            return
        }
        this.worker.postMessage({
            code: this.CODES.POSITIONUPDATE,
            data: this.data
        });
        this.data = {}
    }
}