namespace objectModel {
    export class actor {
        name: string;
        avatarUrl: string;
        infos: string[];
        constructor(name: string) { this.name = name; }
    }
    export class animatedActor extends actor {
        constructor(name: string) { super(name); }
    }
    export class ressource extends actor {
        quantity: number;
        unit: string;
    }
}