namespace objectModel {
    export class actionCat {
        public name: string;
        public actionList: actionMeta[];
    }
    export class actionMeta {
        public name: string;
        public return: string;
        public signature: string[];

        public delegate: any;
    }

    export class actor {
        name: string;
        actions: actionMeta[];

        constructor(name: string) { this.name = name; }
    }

    export class animatedActor extends actor {
        infos: string[];
        avatarUrl: string;
        constructor(name: string) { super(name); }
    }

    export class ressource extends actor {
        quantity: number;
        unit: string;
    }
}