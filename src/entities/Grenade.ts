import { Bodies, Body, Composite, Events, Query, Vector } from "matter-js";
import { Sprite } from "pixi.js";
import { Physics } from "../Physics";
import { BaseEntity } from "./BaseEntity";
import { Player } from "./Player";

export class Grenade extends BaseEntity {
    private triggered = false
    private player: Player
    private collisionHandler?: (e: any) => void

    constructor(x: number, y: number, force: Vector, player: Player) {
        let container = Sprite.from("grenade");
        const size = 5

        container.anchor.set(0.5);
        container.x = x;
        container.y = y;
        container.width = size
        container.height = size

        let body = Bodies.circle(x, y, size)

        Body.applyForce(body, body.position, {
            x: force.x * body.mass,
            y: force.y * body.mass,
        })

        super(container, body)

        this.player = player
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
        event.pairs.forEach((pair: any) => {
            const grenadeIsInvolved = pair.bodyA === this.body || pair.bodyB === this.body
            const playerIsInvolced = pair.bodyA === this.player.body || pair.bodyB == this.player.body
            if(grenadeIsInvolved && !playerIsInvolced) {
                if(this.triggered) {
                    return
                }
                console.log('trigger')
                console.log(pair.bodyA)
                console.log(pair.bodyB)
                this.triggered = true
                pair.bodyA.entity.destroy()
            }
        })
    }

    public update() {
        super.update()
        if(this.triggered) {
            this.explode()
        }
    }
}