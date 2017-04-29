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
        for (var prop in this.model) {
            if (this.model.hasOwnProperty(prop)) {
                if (typeof this.model[prop] != "object")
                    this.element.children("." + prop).text(this.model[prop]);
                else
                    this.element.children("." + prop).data("model", this.model[prop]);
            }
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
            console.log(item + " put into " + newElement.html());
        }
        else {
            newElement.data("model", item);
            console.log(JSON.stringify(item) + " put into " + newElement.html());
        }
        this.element.append(newElement);
    };
    return baseListController;
}(baseController));
var targetContoller = (function (_super) {
    __extends(targetContoller, _super);
    function targetContoller() {
        _super.apply(this, arguments);
    }
    targetContoller.prototype.init = function () {
        var _this = this;
        this.element.attr("id", this.model.name);
        this.element.find(".avatar").css("background-image", "url('" + this.model.avatarUrl + "')");
        this.element.find(".name").text(this.model.name);
        this.element.find(".infos").data("model", this.model.infos);
        this.element.unbind('click').bind('click', function () { return _this.click(_this); });
    };
    targetContoller.prototype.click = function (instance) {
        instance.element.siblings(".selected").removeClass("selected");
        if (instance.element.hasClass("selected"))
            instance.element.removeClass("selected");
        else
            instance.element.addClass("selected");
    };
    targetContoller.prototype.select = function () {
        this.element.siblings(".selected").removeClass("selected");
        this.element.addClass("selected");
    };
    targetContoller.prototype.hover = function (instance) {
    };
    return targetContoller;
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
        this.element.children(".delegate").unbind("click").bind("click", function () { return _this.model.delegate(mainController.currentTarget().model); });
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
        this.element.unbind('click').bind('click', function () { eval(_this.model.action); _this.element.remove(); });
        this.element.text(this.model.text);
        this.element.addClass(this.model.eventClass);
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
        toAdd.quantity += quantity;
        if (toAdd.quantity < 0)
            toAdd.quantity = 0;
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
        var bindId;
        play.unbind("click").bind("click", function () {
            if (play.text() == "play") {
                bindId = setInterval(function () { return _this.changePosition(_this.currentPosition() + 1); }, 100);
                play.text("pause");
            }
            else {
                clearInterval(bindId);
                play.text("play");
            }
        });
        jQuery(function () { return _this.changePosition(0); });
    };
    timelineController.prototype.currentPosition = function () {
        return this.dragged.offset().left;
    };
    timelineController.prototype.changePosition = function (pos) {
        var currentPos = Math.min(pos, this.dragged.parent().width() - 30);
        this.dragged.css("left", currentPos);
        this.dragged.prev().css("width", currentPos);
        this.dragged.next().css("width", (this.dragged.next().parent().width() - currentPos - 30));
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
                    signature: ["objectModel.animatedActor"],
                    delegate: function (actor) { alert("a ausculté : " + actor.name); }
                }, {
                    name: "ausculter (tête)",
                    signature: ["objectModel.animatedActor"],
                    delegate: function (actor) { alert("a ausculté : " + actor.name); }
                }, {
                    name: "ausculter (torse)",
                    signature: ["objectModel.animatedActor"],
                    delegate: function (actor) { alert("a ausculté : " + actor.name); }
                }, {
                    name: "ausculter (jambe)",
                    signature: ["objectModel.animatedActor"],
                    delegate: function (actor) { alert("a ausculté : " + actor.name); }
                }, {
                    name: "opérer",
                    signature: ["objectModel.animatedActor"],
                    delegate: function (actor) { alert("a ausculté : " + actor.name); }
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
        {
            action: "alert('demande de livraison automatique'); mainController.submodules.ressourceListController.sideBarLeft.add('morphine', 50);",
            text: "00:30 - plus de morphine", eventClass: "warning"
        },
        { action: "alert('5 blessés arrivent')", text: "00:31 - message du PMA", eventClass: "notification" },
        {
            action: "mainController.submodules.targetListController.targetList.select('Blessé 1')",
            text: "00:32 - Blessé 1 est en danger!",
            eventClass: "critical"
        }
    ]);
    jQuery("#sideBarLeft").data("model", [
        { name: "couverture", quantity: 5, unit: "unités" },
        { name: "pansements", quantity: 100, unit: "unités" },
        { name: "oxygène", quantity: 500, unit: "L" },
        { name: "morphine", quantity: 50, unit: "mL" },
        { name: "augmentin", quantity: 50, unit: "moles" },
        { name: "perche", quantity: 3, unit: "unités" }
    ]);
    jQuery("#targetList").data("model", [
        { name: "Joueur", infos: ["médecin leader"], avatarUrl: "./images/victeams2.png" },
        { name: "Infirmier julien", infos: ["Efficace en pansements", "efficace en perfusions"], avatarUrl: "./images/victeams2.png" },
        { name: "Auxiliaire jacob", infos: [""], avatarUrl: "./images/victeams2.png" },
        { name: "Auxiliaire julie", infos: [], avatarUrl: "./images/victeams1.png" },
        { name: "Blessé 1", infos: ["nom: inconnu", "blessures: inconnu"], avatarUrl: "./images/victim.png" },
        { name: "Blessé 2", infos: ["nom: inconnu", "blessures: inconnu"], avatarUrl: "./images/victim.png" },
        { name: "Blessé 3", infos: ["nom: inconnu", "blessures: inconnu"], avatarUrl: "./images/victim.png" },
        { name: "Blessé 4", infos: ["nom: inconnu", "blessures: inconnu"], avatarUrl: "./images/victim.png" },
    ]);
});
jQuery(function () { return makePageLayout(jQuery("body")); });
//# sourceMappingURL=app.js.map