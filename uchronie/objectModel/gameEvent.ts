namespace objectModel {
    export class gameEvent {
        action: () => any;
        text: string;
        eventClass: nonDeterministicState<string>;

        public constructor(action: () => any, text: string, eventClass: string) {
            this.action = action;
            this.text = text;
            this.eventClass = new nonDeterministicState<string>();
            this.eventClass.setKeyFrame(currentTime-1, "discared");
            this.eventClass.setKeyFrame(currentTime, eventClass);
        }
    }
}

namespace injuries {
    export var hemoragy = {
        name: "hémoragie",
        return: "",
        signature: ["target"],
        delegate: function() {
            let target: objectModel.patient = this;
            target.gravity.setKeyFrame(objectModel.currentTime, target.gravity.current() + 0.1);
        }
    };

    export var bactery = {
        name: "infection",
        return: "",
        signature: ["target"],
        delegate: function () {
            let target: objectModel.patient = this;
            target.gravity.setKeyFrame(objectModel.currentTime, target.gravity.current() + Math.random() / 5);
        }
    };

    export var perfusion = {
        name: "perfusion",
        return: "",
        signature: ["target"],
        delegate: function () {
            let target: objectModel.patient = this;
            target.gravity.setKeyFrame(objectModel.currentTime, target.gravity.current() - 0.1);
            mainController.submodules["ressourceListController"]["sideBarLeft"].add("augmentin", -1);
            if (target.gravity.current() < 0) { //overdose
                target.kill();
                alert(target.name + " est mort d'une overdose");
            }
        }
    };
}
