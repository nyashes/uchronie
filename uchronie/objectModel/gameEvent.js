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
var injuries;
(function (injuries) {
    injuries.hemoragy = {
        name: "hémoragie",
        return: "",
        signature: ["target"],
        delegate: function () {
            var target = this;
            target.gravity.setKeyFrame(objectModel.currentTime, target.gravity.current() + 0.1);
        }
    };
    injuries.bactery = {
        name: "infection",
        return: "",
        signature: ["target"],
        delegate: function () {
            var target = this;
            target.gravity.setKeyFrame(objectModel.currentTime, target.gravity.current() + Math.random() / 5);
        }
    };
    injuries.perfusion = {
        name: "perfusion",
        return: "",
        signature: ["target"],
        delegate: function () {
            var target = this;
            target.gravity.setKeyFrame(objectModel.currentTime, target.gravity.current() - 0.1);
            mainController.submodules["ressourceListController"]["sideBarLeft"].add("augmentin", -1);
            if (target.gravity.current() < 0) {
                target.kill();
                alert(target.name + " est mort d'une overdose");
            }
        }
    };
})(injuries || (injuries = {}));
//# sourceMappingURL=gameEvent.js.map