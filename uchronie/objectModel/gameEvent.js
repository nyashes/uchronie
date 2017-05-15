var objectModel;
(function (objectModel) {
    var gameEvent = (function () {
        function gameEvent(action, text, eventClass) {
            this.action = action;
            this.text = text;
            this.eventClass = new objectModel.nonDeterministicState();
            this.eventClass.setKeyFrame(objectModel.currentTime - 1, "discared");
            this.eventClass.setKeyFrame(objectModel.currentTime, eventClass);
        }
        return gameEvent;
    }());
    objectModel.gameEvent = gameEvent;
})(objectModel || (objectModel = {}));
//# sourceMappingURL=gameEvent.js.map