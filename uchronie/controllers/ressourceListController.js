var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ressourceListController = (function (_super) {
    __extends(ressourceListController, _super);
    function ressourceListController() {
        _super.apply(this, arguments);
    }
    ressourceListController.prototype.add = function (name, quantity) {
        var controller = this.element.children("#" + name).data("controller");
        var toAdd = this.element.children("#" + name).data("model");
        toAdd.quantity.setKeyFrame(objectModel.currentTime, Math.max(toAdd.quantity.current() + quantity, 0));
        controller.init();
    };
    return ressourceListController;
}(baseListController));
var ressourceController = (function (_super) {
    __extends(ressourceController, _super);
    function ressourceController() {
        _super.apply(this, arguments);
    }
    ressourceController.prototype.init = function () {
        _super.prototype.init.call(this);
        this.element.attr("id", this.model.name);
    };
    return ressourceController;
}(baseController));
//# sourceMappingURL=ressourceListController.js.map