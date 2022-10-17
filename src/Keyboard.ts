export class Keyboard {
    public static readonly state: Map<string, boolean> = new Map()
    private static listeners: Map<string, Function[]> = new Map()
    public static initialize() {
        document.addEventListener("keydown", Keyboard.keyDown);
        document.addEventListener("keyup", Keyboard.keyUp);
    }
    private static keyDown(e: KeyboardEvent): void {
        Keyboard.state.set(e.code, true)
        console.log(e.code)
        if(Keyboard.listeners.has(e.code)) {
            Keyboard.listeners.get(e.code)?.forEach(cb => cb())
        }
    }
    private static keyUp(e: KeyboardEvent): void {
        Keyboard.state.set(e.code, false)
    }
    public static on(code: string, callback: Function): void {
        if(!Keyboard.listeners.has(code)) {
            Keyboard.listeners.set(code, [])
        }
        Keyboard.listeners.get(code)?.push(callback)
    }
}