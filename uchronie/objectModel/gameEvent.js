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
var events;
(function (events) {
    function augmentin() {
        return new objectModel.gameEvent(function () { return mainController.submodules["ressourceListController"]["sideBarLeft"].add('morphine', 50); }, "livraison d'augmentin", "notification");
    }
    events.augmentin = augmentin;
    ;
    function scream() {
        var list = mainController.submodules["targetListController"]["targetList"].element.children();
        var picked = Math.ceil((list.length() - 1) * Math.random() + 0.001);
        var name = list.get(picked).data().name;
        return new objectModel.gameEvent(function () { return mainController.submodules["targetListController"]["targetList"].select(name); }, name + " cri", "warning");
    }
    events.scream = scream;
    ;
})(events || (events = {}));
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
                var event_1 = new objectModel.gameEvent(function () { return null; }, target.name + " est mort d'une overdose", "critical");
                mainController.submodules["baseListController"]["console"].model.push(event_1);
                mainController.submodules["baseListController"]["console"].push(event_1);
            }
        }
    };
})(injuries || (injuries = {}));
//# sourceMappingURL=gameEvent.js.map