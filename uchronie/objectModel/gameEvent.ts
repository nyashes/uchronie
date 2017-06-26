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

namespace events {
    export function augmentin() {
        return new objectModel.gameEvent(
            () => mainController.submodules["ressourceListController"]["sideBarLeft"].add('morphine', 50),
            "livraison d'augmentin",
            "notification"
        );
    };

    export function scream() {
        let list = mainController.submodules["targetListController"]["targetList"].element.children();
        let picked = Math.ceil((list.length() - 1) * Math.random() + 0.001);
        let name = list.get(picked).data().name;
        return new objectModel.gameEvent(
            () => mainController.submodules["targetListController"]["targetList"].select(name),
            name + " cri",
            "warning"
        );
    };
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
                let event = new objectModel.gameEvent(() => null, target.name + " est mort d'une overdose", "critical"); 
                mainController.submodules["baseListController"]["console"].model.push(event);
                mainController.submodules["baseListController"]["console"].push(event);
            }
        }
    };
}
