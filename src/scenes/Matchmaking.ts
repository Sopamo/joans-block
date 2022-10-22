import { IScene, Manager } from "../Manager";
import { BaseScene } from "./BaseScene";
import { GameScene } from "./Game";
import { createApp } from 'vue'
import Matchmaking from "./matchmaking/Matchmaking.vue";

export class MatchmakingScene extends BaseScene implements IScene {
    constructor() {
        super();
        const appElement = document.createElement('div')
        appElement.id = 'app'
        document.body.appendChild(appElement)
        createApp(Matchmaking).mount('#app')
    }

    public update(framesPassed: number): void {
        // To be a scene we must have the update method even if we don't use it.
    }
    resize(screenWidth: number, screenHeight: number): void {
    }

    public destroy() {
        super.destroy()
        document.getElementById('app')?.remove()
    }
}