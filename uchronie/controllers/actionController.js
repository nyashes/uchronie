var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var actionController = (function (_super) {
    __extends(actionController, _super);
    function actionController() {
        _super.apply(this, arguments);
    }
    actionController.prototype.init = function () {
        var _this = this;
        this.element.children(".name").text(this.model.name);
        this.element.children(".delegate").unbind("click").bind("click", function () {
            var parameters = [];
            var player = mainController.currentPlayer();
            var targetFrame = mainController.currentTarget();
            var target = targetFrame.model;
            for (var _i = 0, _a = _this.model.signature; _i < _a.length; _i++) {
                var item = _a[_i];
                parameters.push(eval(item));
            }
            _this.model.delegate.apply(parameters.shift(), parameters);
        });
    };
    return actionController;
}(baseController));
//# sourceMappingURL=actionController.js.map