import { Composite } from "matter-js";
import { Container } from "pixi.js";
import { BaseEntity } from "../entities/BaseEntity";
import { Physics } from "../Physics";

export class BaseScene extends Container {
    private _entities: Set<BaseEntity> = new Set()
    public addEntity(entity: BaseEntity) {
        Composite.add(Physics.engine.world, entity.body)
        this._entities.add(entity)
        this.addChild(entity.container)
    }

    public removeEntity(entity: BaseEntity) {
        this._entities.delete(entity)
        Composite.remove(Physics.engine.world, entity.body)
        this.removeChild(entity.container)
    }

    public getEntities() {
        return this._entities
    }
}