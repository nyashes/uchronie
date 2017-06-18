var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var mainController = (function () {
    function mainController() {
    }
    mainController.currentTarget = function () {
        return mainController.submodules["targetListController"]["targetList"]
            .element.children(".selected").data("controller");
    };
    mainController.currentPlayer = function () {
        return mainController.submodules["targetListController"]["targetList"]
            .element.children(".player").data("controller");
    };
    mainController.submodules = {};
    return mainController;
}());
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
    baseListController.prototype.pushItem = function (item) {
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
        this.element.append(newElement);
    };
    return baseListController;
}(baseController));
var targetController = (function (_super) {
    __extends(targetController, _super);
    function targetController() {
        _super.apply(this, arguments);
    }
    targetController.prototype.init = function () {
        var _this = this;
        this.element.attr("id", this.model.name);
        this.element.find(".avatar").css("background-image", "url('" + this.model.avatarUrl + "')");
        this.element.find(".name").text(this.model.name);
        this.element.find(".infos").data("model", this.model.infos);
        this.element.unbind('click').bind('click', function () { return _this.click(_this); });
    };
    targetController.prototype.updateVisual = function () {
        var patient = this.model;
        for (var i = 0; i <= 4; ++i)
            this.element.toggleClass("gravity-" + i, Math.floor(patient.gravity.current()) == i);
    };
    targetController.prototype.click = function (instance) {
        instance.element.siblings(".selected").removeClass("selected");
        if (instance.element.hasClass("selected"))
            instance.element.removeClass("selected");
        else
            instance.element.addClass("selected");
    };
    targetController.prototype.select = function () {
        this.element.siblings(".selected").removeClass("selected");
        this.element.addClass("selected");
    };
    targetController.prototype.hover = function (instance) {
    };
    return targetController;
}(baseController));
var catController = (function (_super) {
    __extends(catController, _super);
    function catController() {
        _super.apply(this, arguments);
    }
    catController.prototype.init = function () {
        var _this = this;
        _super.prototype.init.call(this);
        this.element.children(".name").unbind("click").bind("click", function () {
            jQuery("#actionContainer").children().remove();
            jQuery("#actionContainer").append(_this.element.children(".actionList").clone(true, true).css("display", "block"));
        });
    };
    return catController;
}(baseController));
var actionController = (function (_super) {
    __extends(actionController, _super);
    function actionController() {
        _super.apply(this, arguments);
    }
    actionController.prototype.init = function () {
        var _this = this;
        this.element.children(".name").text(this.model.name);
        this.element.children(".delegate").unbind("click").bind("click", function () {
            var parameters = [];
            var player = mainController.currentPlayer();
            var targetFrame = mainController.currentTarget();
            var target = targetFrame.model;
            for (var _i = 0, _a = _this.model.signature; _i < _a.length; _i++) {
                var item = _a[_i];
                parameters.push(eval(item));
            }
            _this.model.delegate.apply(parameters.shift(), parameters);
        });
    };
    return actionController;
}(baseController));
var gameEventController = (function (_super) {
    __extends(gameEventController, _super);
    function gameEventController() {
        _super.apply(this, arguments);
    }
    gameEventController.prototype.init = function () {
        var _this = this;
        this.element.unbind('click').bind('click', function () {
            _this.model.action();
            _this.model.eventClass.setKeyFrame(objectModel.currentTime, 'discared');
        });
        this.element.text(this.model.text);
        objectModel.guiTick.push(function () {
            _this.element.removeClass();
            _this.element.addClass(_this.model.eventClass.current());
        });
    };
    return gameEventController;
}(baseController));
var ressourceController = (function (_super) {
    __extends(ressourceController, _super);
    function ressourceController() {
        _super.apply(this, arguments);
    }
    ressourceController.prototype.init = function () {
        _super.prototype.init.call(this);
        this.element.attr("id", this.model.name);
    };
    return ressourceController;
}(baseController));
;
var ressourceListController = (function (_super) {
    __extends(ressourceListController, _super);
    function ressourceListController() {
        _super.apply(this, arguments);
    }
    ressourceListController.prototype.add = function (name, quantity) {
        var controller = this.element.children("#" + name).data("controller");
        var toAdd = this.element.children("#" + name).data("model");
        toAdd.quantity.setKeyFrame(objectModel.currentTime, Math.max(toAdd.quantity.current() + quantity, 0));
        controller.init();
    };
    return ressourceListController;
}(baseListController));
;
var targetListController = (function (_super) {
    __extends(targetListController, _super);
    function targetListController() {
        _super.apply(this, arguments);
    }
    targetListController.prototype.select = function (name) {
        var toSelect = this.element.children("#" + name).data("controller");
        toSelect.select();
    };
    return targetListController;
}(baseListController));
;
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
var htmlProperty = (function () {
    function htmlProperty(_html, _attribute) {
        _html.data(_attribute, this);
        this.html = _html;
        this.attribute = _attribute;
    }
    htmlProperty.prototype.value = function (v) {
        if (v) {
            this.html.children(this.attribute).text(v);
        }
        return this.html.children(this.attribute).text();
    };
    return htmlProperty;
}());
function computeStars(prop, element) {
    var stars = 1;
    element.children().each(function (dum, child) {
        var currentChild = jQuery(child);
        var star = parseFloat(currentChild.attr("star"));
        if (!star)
            star = 1;
        stars += star;
    });
    element.children().each(function (dum, child) {
        var currentChild = jQuery(child);
        var star = parseFloat(currentChild.attr("star"));
        if (!star)
            star = 1;
        currentChild.css(prop, (star / stars * 100) + "%");
    });
}
function mcBinder(element) {
    if (element.hasClass("noParse"))
        return;
    if (element.attr("controller") != undefined) {
        var object = undefined;
        if (element.attr("model") != undefined)
            object = window[element.attr("model")];
        else if (element.data("model") != undefined)
            object = element.data("model");
        if (mainController.submodules[element.attr("controller")] == undefined)
            mainController.submodules[element.attr("controller")] = {};
        mainController.submodules[element.attr("controller")][element.attr("id")] =
            new window[element.attr("controller")](element, object);
    }
    makePageLayout(element);
}
function mvcBinder(element) {
    if (element.attr("view") != undefined) {
        element.load(element.attr("view"), null, function () { return mcBinder(element); });
    }
    else
        mcBinder(element);
}
function makePageLayout(rootNode) {
    rootNode.children().each(function (dum, element) { mvcBinder(jQuery(element)); });
    rootNode.children(".partition").each(function (dum, element) { computeStars("width", jQuery(element)); });
    rootNode.children(".vpartition").each(function (dum, element) { computeStars("height", jQuery(element)); });
}
jQuery(function () {
    jQuery("#actionList").data("model", [
        {
            name: "soin",
            actionList: [
                {
                    name: "ausculter (complet)",
                    signature: ["target", "targetFrame"],
                    delegate: function (frame) { alert("blessures: " + JSON.stringify(this.injuries.current().map(function (x) { return x.name; }))); frame.updateVisual(); }
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
                            this.injuries.setKeyFrame(objectModel.currentTime, newar);
                            mainController.submodules["ressourceListController"]["sideBarLeft"].add("perche", -1);
                            alert("perfusion appliquée");
                        }
                    }
                },
                {
                    name: "opérer",
                    signature: ["target", "targetFrame"],
                    delegate: function () { alert("a ausculté : " + this.name); }
                }, {
                    name: "évacuer",
                    signature: ["objectModel.animatedActor"],
                    delegate: function (actor) { alert("a ausculté : " + actor.name); }
                }, {
                    name: "vérifier matériel",
                    signature: ["objectModel.animatedActor"],
                    delegate: function (actor) { alert("a ausculté : " + actor.name); }
                }
            ]
        },
        {
            name: "ordre",
            actionList: [
                {
                    name: "ordre de médecin",
                    signature: ["objectModel.animatedActor", "objectModel.animatedActor"],
                    delegate: function (actor) { alert(this.name + " a ausculté : " + actor.name); }
                },
                {
                    name: "ordre d'infirmier",
                    signature: ["objectModel.animatedActor", "objectModel.animatedActor"],
                    delegate: function (actor) { alert(this.name + " a ausculté : " + actor.name); }
                },
                {
                    name: "ordre de patient",
                    signature: ["objectModel.animatedActor", "objectModel.animatedActor"],
                    delegate: function (actor) { alert(this.name + " a ausculté : " + actor.name); }
                }
            ]
        },
    ]);
    jQuery("#console").data("model", [
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
    ]);
    jQuery("#sideBarLeft").data("model", [
        new objectModel.ressource("couverture", 5, "unités"),
        new objectModel.ressource("pansements", 100, "unités"),
        new objectModel.ressource("oxygène", 500, "L"),
        new objectModel.ressource("morphine", 50, "mL"),
        new objectModel.ressource("augmentin", 50, "moles"),
        new objectModel.ressource("perche", 3, "unités")
    ]);
    jQuery("#targetList").data("model", [
        new objectModel.doctor({ name: "Joueur", infos: ["médecin leader"], avatarUrl: "./images/victeams2.png" }),
        new objectModel.doctor({ name: "Infirmier julien", infos: ["Efficace en pansements", "efficace en perfusions"], avatarUrl: "./images/victeams2.png" }),
        new objectModel.nurse({ name: "Auxiliaire jacob", infos: [""], avatarUrl: "./images/victeams2.png" }),
        new objectModel.nurse({ name: "Auxiliaire julie", infos: [], avatarUrl: "./images/victeams1.png" }),
        new objectModel.patient({ name: "Blessé 1", infos: ["nom: inconnu", "blessures: inconnu"], avatarUrl: "./images/victim.png" }),
        new objectModel.patient({ name: "Blessé 2", infos: ["nom: inconnu", "blessures: inconnu"], avatarUrl: "./images/victim.png" }),
        new objectModel.patient({ name: "Blessé 3", infos: ["nom: inconnu", "blessures: inconnu"], avatarUrl: "./images/victim.png" }),
        new objectModel.patient({ name: "Blessé 4", infos: ["nom: inconnu", "blessures: inconnu"], avatarUrl: "./images/victim.png" }),
    ]);
});
jQuery(function () { return makePageLayout(jQuery("body")); });
jQuery();
//# sourceMappingURL=app.js.map