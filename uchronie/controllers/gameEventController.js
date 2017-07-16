var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var gameEventController = (function (_super) {
    __extends(gameEventController, _super);
    function gameEventController() {
        _super.apply(this, arguments);
    }
    gameEventController.prototype.init = function () {
        var _this = this;
        this.element.unbind('click').bind('click', function () {
            _this.model.action();
            _this.model.eventClass.setKeyFrame(objectModel.currentTime, 'discared');
        });
        this.element.text(this.model.text);
        objectModel.guiTick.push(function () {
            _this.element.removeClass();
            _this.element.addClass(_this.model.eventClass.current());
        });
    };
    return gameEventController;
}(baseController));
//# sourceMappingURL=gameEventController.js.map