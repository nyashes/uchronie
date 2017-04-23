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
        }
        return animatedActor;
    }(actor));
    objectModel.animatedActor = animatedActor;
    var ressource = (function (_super) {
        __extends(ressource, _super);
        function ressource() {
            _super.apply(this, arguments);
        }
        return ressource;
    }(actor));
    objectModel.ressource = ressource;
})(objectModel || (objectModel = {}));
//# sourceMappingURL=actor.js.map