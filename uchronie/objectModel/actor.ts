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
        defiance = new nonDeterministicState<number>(0);
        infos: string[];
        avatarUrl: string;
        constructor(name: string) { super(name); }
    }

    export class patient extends animatedActor {
        //certain patients ont suivi une formation de premier soin
        firstAidSkill = new nonDeterministicState<number>(Math.floor(Math.random() * 80));
        public constructor(name: string) {
            super(name);
            this.defiance.set(0, () => 25 + Math.random() * 25);
        }
    }

    export class nurse extends animatedActor {
        bandAidSkill = new nonDeterministicState<number>(100);
        firstAidSkill = new nonDeterministicState<number>(100);
        injectionSkill = new nonDeterministicState<number>(100);
        perfusionSkill = new nonDeterministicState<number>(100);

    }

    export class doctor extends nurse {
        examineSkill = new nonDeterministicState<number>(100);
        //difficile, même les meilleurs échouent parfois
        operateSkill = new nonDeterministicState<number>(70 + Math.random() * 20);

    }

    export class ressource extends actor {
        quantity = new nonDeterministicState<number>();
        unit: string;

        public constructor(name: string, quantity: number, unit: string) {
            super(name);
            this.quantity.setKeyFrame(0, quantity);
            this.unit = unit;
        }
    }
}