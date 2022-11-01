import { Body, Composite } from "matter-js";
import { Container } from "pixi.js";
import { Manager } from "../Manager";
import { Sync } from "../multiplayer/Sync";

export class BaseEntity {
    public container: Container
    public body: Body
    public shouldSync: boolean = false

    constructor(container: Container, body: Body) {
        this.container = container
        this.body = body
        // @ts-ignore-next-line
        this.body.entity = this
    }

    public update() {
        if(this.shouldSync) {
            if(this.container.x !== this.body.position.x || this.container.y !== this.body.position.y) {
                Sync.queueEvent({
                    code: Sync.CODES.POSITIONUPDATE,
                    id: this.body.id,
                    x: this.body.position.x,
                    y: this.body.position.y,
                    vx: this.body.velocity.x,
                    vy: this.body.velocity.y,
                })
            }
        }
        this.container.x = this.body.position.x
        this.container.y = this.body.position.y
    }

    public destroy() {
        Manager.scene.removeEntity(this)
    }
}