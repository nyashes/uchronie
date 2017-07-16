var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var objectModel;
(function (objectModel) {
    var actionCat = (function () {
        function actionCat() {
        }
        return actionCat;
    }());
    objectModel.actionCat = actionCat;
    var actionMeta = (function () {
        function actionMeta() {
        }
        return actionMeta;
    }());
    objectModel.actionMeta = actionMeta;
    var actor = (function () {
        function actor(name) {
            this.name = name;
        }
        return actor;
    }());
    objectModel.actor = actor;
    var animatedActor = (function (_super) {
        __extends(animatedActor, _super);
        function animatedActor(base) {
            var _this = this;
            _super.call(this, "");
            this.defiance = new objectModel.nonDeterministicState(0);
            for (var prop in base)
                this[prop] = base[prop];
            if (this["constructor"]) {
                var ctor_1 = function () {
                    _this["constructor"].call(_this);
                    delete _this["constructor"];
                    objectModel.guiTick.splice(objectModel.guiTick.indexOf(ctor_1), 1);
                };
                objectModel.guiTick.push(ctor_1);
            }
        }
        return animatedActor;
    }(actor));
    objectModel.animatedActor = animatedActor;
    var patient = (function (_super) {
        __extends(patient, _super);
        function patient(base) {
            var _this = this;
            _super.call(this, base);
            //certain patients ont suivi une formation de premier soin
            this.firstAidSkill = new objectModel.nonDeterministicState(Math.floor(Math.random() * 80));
            this.gravity = new objectModel.nonDeterministicState(1 + (Math.random() - 0.01) * 4);
            this.injuries = new objectModel.nonDeterministicState(new Array());
            //this.defiance.set(0, () => 25 + Math.random() * 25);
            this.eventIdx = objectModel.tick.push(function () { return _this.onUpdate(); });
        }
        patient.prototype.onUpdate = function () {
            var target = this;
            for (var _i = 0, _a = this.injuries.current(); _i < _a.length; _i++) {
                var item = _a[_i];
                var parameters = [];
                for (var _b = 0, _c = item.signature; _b < _c.length; _b++) {
                    var param = _c[_b];
                    parameters.push(eval(param));
                }
                item.delegate.apply(parameters.shift(), parameters);
            }
        };
        patient.prototype.kill = function () {
            var targetList = mainController.submodules["targetListController"]["targetList"];
            this.gravity.setKeyFrame(objectModel.currentTime, 5);
            this.injuries.setKeyFrame(objectModel.currentTime, []);
        };
        return patient;
    }(animatedActor));
    objectModel.patient = patient;
    var nurse = (function (_super) {
        __extends(nurse, _super);
        function nurse() {
            _super.apply(this, arguments);
            this.bandAidSkill = new objectModel.nonDeterministicState(100);
            this.firstAidSkill = new objectModel.nonDeterministicState(100);
            this.injectionSkill = new objectModel.nonDeterministicState(100);
            this.perfusionSkill = new objectModel.nonDeterministicState(100);
        }
        return nurse;
    }(animatedActor));
    objectModel.nurse = nurse;
    var doctor = (function (_super) {
        __extends(doctor, _super);
        function doctor() {
            _super.apply(this, arguments);
            this.examineSkill = new objectModel.nonDeterministicState(100);
            //difficile, même les meilleurs échouent parfois
            this.operateSkill = new objectModel.nonDeterministicState(70 + Math.random() * 20);
        }
        return doctor;
    }(nurse));
    objectModel.doctor = doctor;
    var ressource = (function (_super) {
        __extends(ressource, _super);
        function ressource(name, quantity, unit) {
            _super.call(this, name);
            this.quantity = new objectModel.nonDeterministicState();
            this.quantity.setKeyFrame(0, quantity);
            this.unit = unit;
        }
        return ressource;
    }(actor));
    objectModel.ressource = ressource;
})(objectModel || (objectModel = {}));
//# sourceMappingURL=actor.js.map