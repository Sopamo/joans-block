export class Sync {
    private static data: Record<number, any> = {}
    private static worker: Worker

    public static async initialize() {
        this.worker = new Worker(new URL('./worker.ts', import.meta.url), {
            type: 'module'
        })
    }

    public static queueEvent(event: any) {
        this.data[event.id] = event
    }

    public static async sendUpdate() {
        if(!Object.keys(this.data).length) {
            return
        }
        this.worker.postMessage(this.data);
        this.data = {}
    }
}