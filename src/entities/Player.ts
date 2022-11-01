import { Vector } from "matter-js";
import { Bodies, Body } from "matter-js";
import { Sprite } from "pixi.js";
import { Keyboard } from "../Keyboard";
import { Manager } from "../Manager";
import { BaseEntity } from "./BaseEntity";
import { Dynamite } from "./Dynamite";
import { Grenade } from "./Grenade";

export class Player extends BaseEntity {
    private movementForce = 0.0015
    private jumpForce = -0.035
    private jumpState: false|'up'|'down' = false
    public shouldSync: boolean = true

    constructor(x: number, y: number, width: number, height: number) {
        let container = Sprite.from("player");

        container.anchor.set(0.5);
        container.x = x;
        container.y = y;
        container.width = width
        container.height = height

        let body = Bodies.rectangle(x, y, width, height, { 
            frictionAir: 0.06, 
            friction: 0.005,
            staticFriction: 0.01,
        })

        Keyboard.on('Space', () => {
            if(this.jumpState !== false) {
                return
            }
            Body.applyForce(body, body.position, {
                x: 0,
                y: this.jumpForce * body.mass,
            })
            this.jumpState = 'up'
        })

        Keyboard.on('Enter', () => {
            this.throwGrenade()
        })

        Keyboard.on('KeyD', () => {
            this.dropDynamite()
        })

        super(container, body)
    }

    public update() {
        if(this.jumpState === 'up' && this.body.velocity.y > 0) {
            this.jumpState = 'down'
        }
        if(this.jumpState === 'down' && this.body.velocity.y <= .01) {
            this.jumpState = false
        }
        if(Keyboard.state.get('ArrowRight')) {
            console.log('right')
            Body.applyForce(this.body, this.body.position, {
                x: this.movementForce * this.body.mass,
                y: 0,
            })
        }
        if(Keyboard.state.get('ArrowLeft')) {
            Body.applyForce(this.body, this.body.position, {
                x: -1 * this.movementForce * this.body.mass,
                y: 0,
            })
        }
        super.update()
    }

    public destroy() {
        console.log('Player destroyed')
    }

    private throwGrenade() {
        Manager.scene.addEntity(new Grenade(this.body.position.x, this.body.position.y - 15, Vector.create(0.02, -0.02)))
    }

    private dropDynamite() {
        Manager.scene.addEntity(new Dynamite(this.body.position.x, this.body.position.y - 15))
    }
}