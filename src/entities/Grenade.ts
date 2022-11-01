import { Bodies, Body, Events, Query, Vector } from "matter-js";
import { Sprite } from "pixi.js";
import { Sync } from "../multiplayer/Sync";
import { Physics } from "../Physics";
import { BaseEntity } from "./BaseEntity";

export class Grenade extends BaseEntity {
    private timer = 10
    private triggered = false
    private collisionHandler?: (e: any) => void
    public shouldSync: boolean = true

    constructor(x: number, y: number, force: Vector) {
        let container = Sprite.from("grenade");
        const size = 5

        container.anchor.set(0.5);
        container.x = x;
        container.y = y;
        container.width = size
        container.height = size

        let body = Bodies.circle(x, y, size, {
            label: 'grenade'
        })

        Body.applyForce(body, body.position, {
            x: force.x * body.mass,
            y: force.y * body.mass,
        })

        super(container, body)
        Sync.queueEvent({
            code: Sync.CODES.ADDENTITIY,
            type: 'Grenade',
            x,
            y,
            force,
        })

        this.setupCollisionListener()
    }

    private setupCollisionListener() {
        this.collisionHandler = this.handleCollision.bind(this)
        Events.on(Physics.engine, 'collisionStart', this.collisionHandler)
    }

    public explode() {
        const blastRadius = 30
        const blastForce = .08
        const blastArea = Bodies.circle(this.body.position.x, this.body.position.y, blastRadius)
        const collisions = Query.collides(blastArea, Physics.engine.world.bodies)
        collisions.forEach(collision => {
            const object = collision.bodyA === blastArea ? collision.bodyB : collision.bodyA
            Body.applyForce(object, object.position, {
                x: collision.penetration.x * blastForce * object.mass,
                y: collision.penetration.y * blastForce * object.mass,
            })
        })
        if(this.collisionHandler) {
            Events.off(Physics.engine, 'collisionStart', this.collisionHandler)
        }
        this.destroy()
    }

    private handleCollision(event: any) {
        if(this.timer > 0) {
            return
        }
        event.pairs.forEach((pair: any) => {
            const grenadeIsInvolved = pair.bodyA.label === this.body || pair.bodyB === this.body
            const twoGrenades = pair.bodyA.label === 'grenade' && pair.bodyB.label === 'grenade'
            if(grenadeIsInvolved && !twoGrenades) {
                if(this.triggered) {
                    return
                }
                this.triggered = true
                pair.bodyA.entity.destroy()
            }
        })
    }

    public update() {
        super.update()
        this.timer--
        if(this.timer < -300) {
            this.triggered = true
        }
        if(this.triggered) {
            this.explode()
        }
    }
}