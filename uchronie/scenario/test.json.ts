//equivalent to js var events = { json }
//except this will be defined in window by ts and merged with other namespace definitions
namespace events {
    export function augmentin() {
        return new objectModel.gameEvent(
            () => mainController.ressources().add('morphine', 50),
            "livraison d'augmentin",
            "notification"
        );
    };

    export function scream() {
        let list = mainController.actors().element.children();
        let picked = Math.ceil((list.length - 1) * Math.random() + 0.001);
        let name = jQuery(list.get(picked)).data().name;
        return new objectModel.gameEvent(
            () => mainController.actors().select(name),
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
        delegate: function () {
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

//define default stats for nurses in this scenario
namespace localObjectModel {
    export class nurse extends objectModel.nurse {
        constructor(data) {
            super(data);
            this.bandAidSkill.setKeyFrame(0, 50);
            this.firstAidSkill.setKeyFrame(0, 50);
        }
    }
}

//load function, called after all ts load but before html load
//errors here are considered fatal and will prevent application load
this({
    //preload: function () { alert("pre"); },
    //postload: function () { alert("post"); },

    /*action list*/
    actionList: [
        {
            name: "soin",
            actionList: [
                {
                    name: "ausculter (complet)",
                    signature: ["target", "targetFrame"],
                    delegate: function (frame: targetController) {
                        alert("blessures: " + JSON.stringify(this.injuries.current().map(x => x.name)));
                        frame.updateVisual();
                    }
                },
                {
                    name: "bander",
                    signature: ["target"],
                    delegate: function () {
                        let newar = this.injuries.get(objectModel.currentTime - 1).filter(x => x != injuries.hemoragy);
                        this.injuries.setKeyFrame(objectModel.currentTime, newar);
                        mainController.submodules["ressourceListController"]["sideBarLeft"].add("pansements", -1);
                        alert("bandage appliqué");
                    }
                },
                {
                    name: "perfusion augmentin",
                    signature: ["target"],
                    delegate: function () {
                        if (this.injuries.current().filter(x => x == injuries.perfusion).length > 0) {
                            let newar = this.injuries.get(objectModel.currentTime - 1).filter(x => x != injuries.perfusion);
                            this.injuries.setKeyFrame(objectModel.currentTime, newar);
                            alert("perfusion retirée");
                        }
                        else {
                            let newar = this.injuries.get(objectModel.currentTime - 1).filter(x => x != injuries.bactery);
                            newar.push(injuries.perfusion);
                            let patient: objectModel.patient = this;
                            this.injuries.setKeyFrame(objectModel.currentTime, newar);
                            mainController.submodules["ressourceListController"]["sideBarLeft"].add("perche", -1);
                            alert("perfusion appliquée");
                        }
                    }
                }
            ]
        },
        {
            name: "ordre",
            actionList: [
                {
                    name: "donner des ordres",
                    signature: ["target"],
                    delegate: function () { alert(this.name + " a ausculté : " + this.name); }
                }
            ]
        }
    ],

    /*pre console test data*/
    console: [
        new objectModel.gameEvent(() => {
            alert('demande de livraison automatique');
            mainController.submodules["ressourceListController"]["sideBarLeft"].add('morphine', 50);
        }, "plus de morphine", "warning"),
        new objectModel.gameEvent(() => {
            alert('5 blessés arrivent');
        }, "message du PMA", "notification"),
        new objectModel.gameEvent(() => {
            mainController.submodules["targetListController"]["targetList"].select('Blessé 1');
        }, "Blessé 1 est en danger!", "critical")
    ],

    /*ressources seed (you can only define them here)*/
    sideBarLeft: [
        new objectModel.ressource("couverture", 5, "unités"),
        new objectModel.ressource("pansements", 100, "unités"),
        new objectModel.ressource("oxygène", 500, "L"),
        new objectModel.ressource("morphine", 50, "mL"),
        new objectModel.ressource("augmentin", 50, "moles"),
        new objectModel.ressource("perche", 3, "unités")
    ],

    /*actors*/
    targetList: [
        new objectModel.doctor({ name: "Joueur", infos: ["médecin leader"], avatarUrl: "./images/victeams2.png" }),
        //use redefined nurses instead of default
        new localObjectModel.nurse({
            name: "Infirmier julien",
            infos: ["Efficace en pansements"],
            avatarUrl: "./images/victeams2.png",
            //make him start with more bandAidSkill than default nurse (50 in this model)
            constructor: function () { this.bandAidSkill.setKeyFrame(0, 80); }
        }),
        new localObjectModel.nurse({ name: "Auxiliaire jacob", infos: [""], avatarUrl: "./images/victeams2.png" }),
        new localObjectModel.nurse({ name: "Auxiliaire julie", infos: [], avatarUrl: "./images/victeams1.png" }),
        new objectModel.patient({ name: "Blessé 1", infos: ["nom: inconnu", "blessures: inconnu"], avatarUrl: "./images/victim.png" }),
        new objectModel.patient({ name: "Blessé 2", infos: ["nom: inconnu", "blessures: inconnu"], avatarUrl: "./images/victim.png" }),
        new objectModel.patient({ name: "Blessé 3", infos: ["nom: inconnu", "blessures: inconnu"], avatarUrl: "./images/victim.png" }),
        new objectModel.patient({ name: "Blessé 4", infos: ["nom: inconnu", "blessures: inconnu"], avatarUrl: "./images/victim.png" }),
    ],

});