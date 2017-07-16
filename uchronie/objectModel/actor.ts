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
        constructor(base: any) {
            super("");

            for (var prop in base)
                this[prop] = base[prop];

            if (this["constructor"]) {
                let ctor = () => {
                    this["constructor"].call(this);
                    delete this["constructor"];
                    objectModel.guiTick.splice(objectModel.guiTick.indexOf(ctor), 1);
                };
                objectModel.guiTick.push(ctor);
            }
        }
    }

    export class patient extends animatedActor {
        //certain patients ont suivi une formation de premier soin
        firstAidSkill = new nonDeterministicState<number>(Math.floor(Math.random() * 80));
        gravity = new nonDeterministicState<number>(1 + (Math.random() - 0.01) * 4);
        injuries = new nonDeterministicState<Array<actionMeta>>(new Array<actionMeta>());

        private eventIdx: number;
        public constructor(base: any) {
            super(base);
            //this.defiance.set(0, () => 25 + Math.random() * 25);
            this.eventIdx = tick.push(() => this.onUpdate());
        }

        public onUpdate() {
            var target = this;
            for (let item of this.injuries.current()) {
                let parameters = [];
                for (let param of item.signature)
                    parameters.push(eval(param));
                item.delegate.apply(parameters.shift(), parameters);
            }
        }

        public kill() {
            let targetList = mainController.submodules["targetListController"]["targetList"];
            this.gravity.setKeyFrame(currentTime, 5);
            this.injuries.setKeyFrame(currentTime, []);
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