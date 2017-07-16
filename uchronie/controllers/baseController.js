var baseController = (function () {
    function baseController(element, model) {
        this.element = element;
        this.model = model;
        this.element.data("controller", this);
        this.init();
    }
    baseController.prototype.init = function () {
        var _this = this;
        var _loop_1 = function() {
            if (this_1.model.hasOwnProperty(prop)) {
                if (typeof this_1.model[prop] != "object")
                    this_1.element.children("." + prop).text(this_1.model[prop]);
                else if (this_1.model[prop].current != undefined) {
                    var capture_1 = prop;
                    objectModel.guiTick.push(function () { return _this.element.children("." + capture_1).text(_this.model[capture_1].current()); });
                }
                else
                    this_1.element.children("." + prop).data("model", this_1.model[prop]);
            }
        };
        var this_1 = this;
        for (var prop in this.model) {
            _loop_1();
        }
    };
    return baseController;
}());
//# sourceMappingURL=baseController.js.map