namespace objectModel {
    type time = number;
    export var currentTime: time = 0;
    export var tick = [];
    window.setInterval(() => { for (let f of tick) f(); }, 100);

    var binding = window.setInterval(() => currentTime++, 100);
    export function play() {
        pause();
        binding = window.setInterval(() => currentTime++, 100);
    }
    export function pause() {
        window.clearInterval(binding);
    }

    class timedValue<T> {
        public t: time;
        public v: T;
    }

    export interface INonDeterministicState<T> {
        current(): T;
    }

    export interface IOneWayRecursiveState<T> extends INonDeterministicState<T> {
        next(offset: number): T;
    }

    export interface IRecursiveState<T> extends IOneWayRecursiveState<T> {
        previous(offset: number): T;
    }

    export interface IDeterministicState<T> extends IRecursiveState<T> {
        get(time: time): T;
    }

    export class nonDeterministicState<T> implements INonDeterministicState<T> {
        private stateStack: timedValue<T>[] = [];

        public current(): T { return this.get(objectModel.currentTime);}

        public get(t: time): T {
            let filtered = this.stateStack.filter((x) => x.t <= t);
            if (filtered.pop)
                return filtered.pop().v;
            return undefined;
        }

        public set(t: time, transformation: (current: T) => T) {
            this.stateStack = this.stateStack.map((x) => x.t >= t ? { t: x.t, v: transformation(x.v) } : x);
        }

        public setKeyFrame(t: time, v: T) {
            this.stateStack.push({ t: t, v: v });
            this.stateStack.sort((a, b) => a.t < b.t ? -1 : 1);
        }
    }

    export class deterministicState<T> implements IDeterministicState<T> {
        private fn: (n: number) => T;
        public constructor(fn: (n: number) => T) {
            this.fn = fn;
        }

        public get(t: time): T {
            return this.fn(t);
        }
        public next(offset: number = 1): T {
            return this.get(currentTime + offset);
        }
        public previous(offset: number = 1): T {
            return this.get(currentTime - offset);
        }
        public current(): T { return this.get(currentTime); }
    }
}