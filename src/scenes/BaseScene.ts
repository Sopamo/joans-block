import { Composite } from "matter-js";
import { Container } from "pixi.js";
import { BaseEntity } from "../entities/BaseEntity";
import { Physics } from "../Physics";

export class BaseScene extends Container {
    private _entities: BaseEntity[] = []
    public addEntity(entity: BaseEntity) {
        Composite.add(Physics.engine.world, entity.body)
        this._entities.push(entity)
        this.addChild(entity.container)
    }

    public getEntities() {
        return this._entities
    }
}