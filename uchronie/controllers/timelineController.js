var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var timelineController = (function (_super) {
    __extends(timelineController, _super);
    function timelineController() {
        _super.apply(this, arguments);
    }
    timelineController.prototype.init = function () {
        var _this = this;
        this.dragged = this.element.find('.cursor');
        this.element.bind("mousemove", function (event) {
            if (_this.dragging) {
                _this.changePosition(event.clientX);
            }
        });
        this.dragged.unbind('mousedown').bind('mousedown', function (event) {
            _this.dragging = true;
            jQuery("html").bind('mouseup', function () {
                _this.dragging = false;
                jQuery("html").unbind('mouseup');
            });
        });
        var play = this.element.find(".playButton");
        play.unbind("click").bind("click", function () {
            if (play.text() == "play") {
                objectModel.play();
                play.text("pause");
            }
            else {
                objectModel.pause();
                play.text("play");
            }
        });
        objectModel.guiTick.push(function () { return _this.changePosition(objectModel.currentTime); });
    };
    timelineController.prototype.currentPosition = function () {
        return this.dragged.offset().left;
    };
    timelineController.prototype.changePosition = function (pos) {
        var currentPos = Math.min(pos, this.dragged.parent().width() - 30);
        this.dragged.css("left", currentPos);
        this.dragged.prev().css("width", currentPos);
        this.dragged.next().css("width", (this.dragged.next().parent().width() - currentPos - 30));
        objectModel.currentTime = currentPos;
    };
    return timelineController;
}(baseController));
//# sourceMappingURL=timelineController.js.map