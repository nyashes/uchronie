var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var catController = (function (_super) {
    __extends(catController, _super);
    function catController() {
        _super.apply(this, arguments);
    }
    catController.prototype.init = function () {
        var _this = this;
        _super.prototype.init.call(this);
        this.element.children(".name").unbind("click").bind("click", function () {
            jQuery("#actionContainer").children().remove();
            jQuery("#actionContainer").append(_this.element.children(".actionList").clone(true, true).css("display", "block"));
        });
    };
    return catController;
}(baseController));
//# sourceMappingURL=catController.js.map