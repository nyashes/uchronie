var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var baseListController = (function (_super) {
    __extends(baseListController, _super);
    function baseListController() {
        _super.apply(this, arguments);
    }
    baseListController.prototype.init = function () {
        var baseElement = this.element.children(".element");
        this.displayProprety = baseElement.css("display");
        baseElement.css("display", "none");
        baseElement.addClass('noParse');
        if (!this.model) {
            console.error("error: no model found for list " + this.element.html());
        }
        else
            for (var _i = 0, _a = this.model; _i < _a.length; _i++) {
                var actor = _a[_i];
                this.pushItem(actor);
            }
        if (baseElement.attr("controller"))
            mainController.submodules[baseElement.attr("controller")] = [];
    };
    baseListController.prototype.pushItem = function (item, bind) {
        var baseElement = this.element.children(".element");
        var newElement = baseElement.clone();
        newElement.css("display", this.displayProprety);
        newElement.removeClass("element");
        newElement.removeClass("noParse");
        if (typeof item != "object") {
            newElement.text(item);
        }
        else {
            newElement.data("model", item);
        }
        if (bind)
            mvcBinder(newElement);
        this.element.append(newElement);
    };
    baseListController.prototype.push = function (item) {
        this.pushItem(item, true);
    };
    return baseListController;
}(baseController));
//# sourceMappingURL=baseListController.js.map