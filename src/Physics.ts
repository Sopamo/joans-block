import { Bodies, Composite, Engine } from 'matter-js'

export class Physics {
    private static _engine: Engine

    public static get engine(): Engine {
        return Physics._engine
    }

    private constructor() { /*this class is purely static. No constructor to see here*/ }
    public static initialize(): void {
        // create an engine
        Physics._engine = Engine.create({
            enableSleeping: true,
        });
        const block = Bodies.rectangle(0, 0, 100, 100)
        Composite.add(Physics.engine.world, [block])
    }
}