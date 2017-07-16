var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//equivalent to js var events = { json }
//except this will be defined in window by ts and merged with other namespace definitions
var events;
(function (events) {
    function augmentin() {
        return new objectModel.gameEvent(function () { return mainController.ressources().add('morphine', 50); }, "livraison d'augmentin", "notification");
    }
    events.augmentin = augmentin;
    ;
    function scream() {
        var list = mainController.actors().element.children();
        var picked = Math.ceil((list.length - 1) * Math.random() + 0.001);
        var name = jQuery(list.get(picked)).data().name;
        return new objectModel.gameEvent(function () { return mainController.actors().select(name); }, name + " cri", "warning");
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
//define default stats for nurses in this scenario
var localObjectModel;
(function (localObjectModel) {
    var nurse = (function (_super) {
        __extends(nurse, _super);
        function nurse(data) {
            _super.call(this, data);
            this.bandAidSkill.setKeyFrame(0, 50);
            this.firstAidSkill.setKeyFrame(0, 50);
        }
        return nurse;
    }(objectModel.nurse));
    localObjectModel.nurse = nurse;
})(localObjectModel || (localObjectModel = {}));
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
                    delegate: function (frame) {
                        alert("blessures: " + JSON.stringify(this.injuries.current().map(function (x) { return x.name; })));
                        frame.updateVisual();
                    }
                },
                {
                    name: "bander",
                    signature: ["target"],
                    delegate: function () {
                        var newar = this.injuries.get(objectModel.currentTime - 1).filter(function (x) { return x != injuries.hemoragy; });
                        this.injuries.setKeyFrame(objectModel.currentTime, newar);
                        mainController.submodules["ressourceListController"]["sideBarLeft"].add("pansements", -1);
                        alert("bandage appliqué");
                    }
                },
                {
                    name: "perfusion augmentin",
                    signature: ["target"],
                    delegate: function () {
                        if (this.injuries.current().filter(function (x) { return x == injuries.perfusion; }).length > 0) {
                            var newar = this.injuries.get(objectModel.currentTime - 1).filter(function (x) { return x != injuries.perfusion; });
                            this.injuries.setKeyFrame(objectModel.currentTime, newar);
                            alert("perfusion retirée");
                        }
                        else {
                            var newar = this.injuries.get(objectModel.currentTime - 1).filter(function (x) { return x != injuries.bactery; });
                            newar.push(injuries.perfusion);
                            var patient = this;
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
        new objectModel.gameEvent(function () {
            alert('demande de livraison automatique');
            mainController.submodules["ressourceListController"]["sideBarLeft"].add('morphine', 50);
        }, "plus de morphine", "warning"),
        new objectModel.gameEvent(function () {
            alert('5 blessés arrivent');
        }, "message du PMA", "notification"),
        new objectModel.gameEvent(function () {
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
//# sourceMappingURL=test.json.js.map