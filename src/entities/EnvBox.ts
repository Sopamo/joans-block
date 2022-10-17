import { Bodies, Composite, Constraint } from "matter-js";
import { Sprite } from "pixi.js";
import { Physics } from "../Physics";
import { BaseEntity } from "./BaseEntity";

export class EnvBox extends BaseEntity {
    constructor(x: number, y: number, width: number, height: number) {
        let container = Sprite.from("player");

        container.anchor.set(0.5);
        container.x = x;
        container.y = y;
        container.width = width
        container.height = height

        let body = Bodies.rectangle(x, y, width, height, {
            collisionFilter: {
                group: -1,
            },
            isStatic: false,
        })
        const constraint = Constraint.create({
            bodyA: body,
            pointB: {
                x: body.position.x,
                y: body.position.y,
            },
            stiffness: .2,
        })

        Composite.add(Physics.engine.world, constraint)

        super(container, body)
    }
}