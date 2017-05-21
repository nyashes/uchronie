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
        function animatedActor(name) {
            _super.call(this, name);
            this.defiance = new objectModel.nonDeterministicState(0);
        }
        return animatedActor;
    }(actor));
    objectModel.animatedActor = animatedActor;
    var patient = (function (_super) {
        __extends(patient, _super);
        function patient(name) {
            _super.call(this, name);
            //certain patients ont suivi une formation de premier soin
            this.firstAidSkill = new objectModel.nonDeterministicState(Math.floor(Math.random() * 80));
            this.defiance.set(0, function () { return 25 + Math.random() * 25; });
        }
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