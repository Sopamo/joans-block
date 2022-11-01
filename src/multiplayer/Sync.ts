import { Dynamite } from "../entities/Dynamite"
import { Grenade } from "../entities/Grenade"
import { Manager } from "../Manager"

export class Sync {
    private static data: any[] = []
    private static worker: Worker
    private static isHost = false
    public static readonly CODES = {
        STARTMATCH: 1,
        JOINMATCH: 2,
        POSITIONUPDATE: 3,
        ADDENTITIY: 4,
        STATESYNC: 5,
    }

    public static async initialize() {
        this.worker = new Worker(new URL('./worker.ts', import.meta.url), {
            type: 'module'
        })
        this.worker.addEventListener("message", function (msg) {
            let entities = Manager.scene.getEntities()
            Object.values(msg.data).forEach((value: any) => {
                if(value.code === Sync.CODES.POSITIONUPDATE) {
                    entities.forEach(e => {
                        if(e.body.id === value.id) {
                            e.body.position.x = value.x
                            e.body.position.y = value.y
                        }
                    })
                }
                if(value.code === Sync.CODES.ADDENTITIY) {
                    if(value.type === 'Dynamite') {
                        Manager.scene.addEntity(new Dynamite(value.x, value.y))
                    }
                    if(value.type === 'Grenade') {
                        Manager.scene.addEntity(new Grenade(value.x, value.y, value.force))
                    }
                }
            })
        });
    }

    public static queueEvent(event: any) {
        if(event.code === Sync.CODES.POSITIONUPDATE) {
            const existing = this.data.find(e => e.code === Sync.CODES.POSITIONUPDATE && e.id === event.id)
            if(existing) {
                existing.x = event.x
                existing.y = event.y
                existing.vx = event.vx
                existing.vy = event.vy
            } else {
                this.data.push(event)
            }
        } else {
            this.data.push(event)
        }
    }

    public static async startMatch() {
        this.isHost = true
        this.worker.postMessage({code: this.CODES.STARTMATCH})
    }

    public static async joinMatch(match_id: string) {
        this.worker.postMessage({code: this.CODES.JOINMATCH, match_id})
    }

    public static async sendUpdate() {
        if(!this.isHost) {
            return
        }
        if(!Object.keys(this.data).length) {
            return
        }
        this.worker.postMessage({
            code: this.CODES.STATESYNC,
            data: this.data
        });
        this.data = []
    }
}