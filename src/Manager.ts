import { Application } from "@pixi/app";
import { DisplayObject } from "@pixi/display";
import { Engine } from "matter-js";
import { BaseEntity } from "./entities/BaseEntity";
import { Physics } from "./Physics";
import { Keyboard } from "./Keyboard";
import { Sync } from "./multiplayer/Sync";

export class Manager {
    private constructor() { /*this class is purely static. No constructor to see here*/ }

    // Safely store variables for our game
    private static app: Application;
    private static currentScene: IScene;
    private static sendUpdate: number = 0
    private static lastDeltaMS: number = 0

    // We no longer need to store width and height since now it is literally the size of the screen.
    // We just modify our getters
    public static get width(): number {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 200;
    }
    public static get height(): number {
        return Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 200;
    }

    // Use this function ONCE to start the entire machinery
    public static async initialize(background: number): Promise<void> {
        this.sendUpdate = 0
        // Create our pixi app
        Manager.app = new Application({
            view: document.getElementById("scene") as HTMLCanvasElement,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            resizeTo: document.getElementById("scene")!,
            backgroundColor: background,
        });
        Manager.app.resize()

        await Sync.initialize()

        Physics.initialize()

        Keyboard.initialize()

        // Add the ticker
        Manager.app.ticker.add(Manager.update)
    }

    public static resize(): void {
        // if we have a scene, we let it know that a resize happened!
        if (Manager.currentScene) {
            Manager.currentScene.resize(Manager.width, Manager.height);
        }
    }

    public static get scene() {
        return this.currentScene
    }

    // Call this function when you want to go to a new scene
    public static changeScene(newScene: IScene): void {
        // Remove and destroy old scene... if we had one..
        if (Manager.currentScene) {
            Manager.app.stage.removeChild(Manager.currentScene);
            Manager.currentScene.destroy();
        }

        // Add the new one
        Manager.currentScene = newScene;
        Manager.app.stage.addChild(Manager.currentScene);
    }

    // This update will be called by a pixi ticker and tell the scene that a tick happened
    private static async update(framesPassed: number): Promise<void> {
        if(!this.lastDeltaMS) {
            this.lastDeltaMS = Manager.app.ticker.deltaMS - 1000/60
        }
        Engine.update(Physics.engine, Manager.app.ticker.deltaMS, Manager.app.ticker.deltaMS / this.lastDeltaMS)
        this.lastDeltaMS = Manager.app.ticker.deltaMS
        if (Manager.currentScene) {
            Manager.currentScene.update(framesPassed);
            Manager.currentScene.getEntities().forEach((entity: BaseEntity) => {
                entity.update()
            })
        }
        Manager.sendUpdate++
        
        if(Manager.sendUpdate >= 1) {
            Manager.sendUpdate = 0
            await Sync.sendUpdate()
        }
    }
}

export interface IScene extends DisplayObject {
    update(framesPassed: number): void;
    resize(screenWidth: number, screenHeight: number): void;
    addEntity(entity: BaseEntity): void;
    removeEntity(entity: BaseEntity): void;
    getEntities(): Set<BaseEntity>;
}