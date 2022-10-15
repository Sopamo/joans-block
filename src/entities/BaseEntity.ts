import { Body } from "matter-js";
import { Container } from "pixi.js";

export class BaseEntity {
    public container: Container
    public body: Body

    constructor(container: Container, body: Body) {
        this.container = container
        this.body = body
    }

    public update() {
        this.container.x = this.body.position.x
        this.container.y = this.body.position.y
    }
}