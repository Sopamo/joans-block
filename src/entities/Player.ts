import { Bodies, Composite, Constraint } from "matter-js";
import { Sprite } from "pixi.js";
import { BaseEntity } from "./BaseEntity";

export class Player extends BaseEntity {
    constructor(x: number, y: number, width: number, height: number) {
        let container = Sprite.from("player");

        container.anchor.set(0.5);
        container.x = x;
        container.y = y;
        container.width = width
        container.height = height

        let body = Bodies.rectangle(x, y, width, height, { frictionAir: 0.06, 
            friction: 0.005,
            staticFriction: 0.01,
        })

        super(container, body)
    }
}