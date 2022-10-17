import { Body, Composite } from "matter-js";
import { Container } from "pixi.js";
import { Manager } from "../Manager";

export class BaseEntity {
    public container: Container
    public body: Body

    constructor(container: Container, body: Body) {
        this.container = container
        this.body = body
        // @ts-ignore-next-line
        this.body.entity = this
    }

    public update() {
        this.container.x = this.body.position.x
        this.container.y = this.body.position.y
    }

    public destroy() {
        Manager.scene.removeEntity(this)
    }
}