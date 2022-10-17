import { Engine } from 'matter-js'

export class Physics {
    private static _engine: Engine
    public static readonly defaultCollisionCategory = 0x0001
    public static readonly floorCollisionCategory = 0x0002

    public static get engine(): Engine {
        return Physics._engine
    }

    private constructor() { /*this class is purely static. No constructor to see here*/ }
    public static initialize(): void {
        // create an engine
        Physics._engine = Engine.create({
            enableSleeping: true,
        });
    }
}