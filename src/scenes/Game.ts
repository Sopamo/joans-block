import { Player } from "../entities/Player";
import { IScene } from "../Manager";
import { BaseScene } from "./BaseScene";
import { TestLevel } from "./levels/Test";

export class GameScene extends BaseScene implements IScene {
    private level: TestLevel

    constructor() {
        super();
        this.level = new TestLevel(this)
        const player = new Player(20, 20, 15, 15)
        this.addEntity(player)
    }
    public update(framesPassed: number): void {
    }
    resize(screenWidth: number, screenHeight: number): void {
        
    }
}