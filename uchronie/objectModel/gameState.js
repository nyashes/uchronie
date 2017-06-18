var objectModel;
(function (objectModel) {
    objectModel.currentTime = 0;
    objectModel.guiTick = [];
    objectModel.tick = [];
    window.setInterval(function () { for (var _i = 0, guiTick_1 = objectModel.guiTick; _i < guiTick_1.length; _i++) {
        var f = guiTick_1[_i];
        if (f)
            f();
    } }, 100);
    var upd = function () { for (var _i = 0, tick_1 = objectModel.tick; _i < tick_1.length; _i++) {
        var f = tick_1[_i];
        if (f)
            f();
    } };
    var binding = window.setInterval(function () { objectModel.currentTime++; upd(); }, 100);
    function play() {
        pause();
        binding = window.setInterval(function () { objectModel.currentTime++; upd(); }, 100);
    }
    objectModel.play = play;
    function pause() {
        window.clearInterval(binding);
    }
    objectModel.pause = pause;
    var timedValue = (function () {
        function timedValue() {
        }
        return timedValue;
    }());
    var nonDeterministicState = (function () {
        function nonDeterministicState(v) {
            this.stateStack = [];
            if (v != undefined)
                this.setKeyFrame(0, v);
        }
        nonDeterministicState.prototype.current = function () { return this.get(objectModel.currentTime); };
        nonDeterministicState.prototype.get = function (t) {
            var filtered = this.stateStack.filter(function (x) { return x.t <= t; });
            if (filtered.length > 0)
                return filtered.pop().v;
            return undefined;
        };
        nonDeterministicState.prototype.set = function (t, transformation) {
            this.setKeyFrame(t, this.current());
            this.stateStack = this.stateStack.map(function (x) { return x.t >= t ? { t: x.t, v: transformation(x.v) } : x; });
        };
        nonDeterministicState.prototype.setKeyFrame = function (t, v) {
            var filtered = this.stateStack.filter(function (x) { return x.t == t; });
            if (filtered.length > 0)
                filtered.pop().v = v;
            else {
                this.stateStack.push({ t: t, v: v });
                this.stateStack.sort(function (a, b) { return a.t < b.t ? -1 : 1; });
            }
        };
        return nonDeterministicState;
    }());
    objectModel.nonDeterministicState = nonDeterministicState;
    var deterministicState = (function () {
        function deterministicState(fn) {
            this.fn = fn;
        }
        deterministicState.prototype.get = function (t) {
            return this.fn(t);
        };
        deterministicState.prototype.next = function (offset) {
            if (offset === void 0) { offset = 1; }
            return this.get(objectModel.currentTime + offset);
        };
        deterministicState.prototype.previous = function (offset) {
            if (offset === void 0) { offset = 1; }
            return this.get(objectModel.currentTime - offset);
        };
        deterministicState.prototype.current = function () { return this.get(objectModel.currentTime); };
        return deterministicState;
    }());
    objectModel.deterministicState = deterministicState;
})(objectModel || (objectModel = {}));
//# sourceMappingURL=gameState.js.map