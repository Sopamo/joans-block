import { Bodies, Body, Query } from "matter-js";
import { Sprite } from "pixi.js";
import { Sync } from "../multiplayer/Sync";
import { Physics } from "../Physics";
import { BaseEntity } from "./BaseEntity";

export class Dynamite extends BaseEntity {
    private timer = 200
    public shouldSync: boolean = true

    constructor(x: number, y: number) {
        let container = Sprite.from("grenade");
        const width = 5
        const height = 10

        container.anchor.set(0.5);
        container.x = x;
        container.y = y;
        container.width = width
        container.height = height

        let body = Bodies.rectangle(x, y, width, height)
        Sync.queueEvent({
            code: Sync.CODES.ADDENTITIY,
            type: 'Dynamite',
            x,
            y,
        })
        super(container, body)
    }

    public explode() {
        const blastRadius = 60
        const killRadius = 20
        const blastForce = .12
        const blastArea = Bodies.circle(this.body.position.x, this.body.position.y, blastRadius)
        const collisions = Query.collides(blastArea, Physics.engine.world.bodies)
        collisions.forEach(collision => {
            const object = collision.bodyA === blastArea ? collision.bodyB : collision.bodyA
            Body.applyForce(object, object.position, {
                x: collision.penetration.x * blastForce * object.mass,
                y: collision.penetration.y * blastForce * object.mass,
            })
        })
        const killArea = Bodies.circle(this.body.position.x, this.body.position.y, killRadius)
        const killAreaCollisions = Query.collides(killArea, Physics.engine.world.bodies)
        killAreaCollisions.forEach(collision => {
            const object = collision.bodyA === killArea ? collision.bodyB : collision.bodyA
            object.entity.destroy()
        })
        this.destroy()
    }

    public update() {
        super.update()
        if(this.timer-- === 0) {
            this.explode()
        }
    }
}