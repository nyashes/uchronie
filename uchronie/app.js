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
        this.element.find(".avatar").attr("src", this.model.avatarUrl);
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
                    name: "ausculter",
                    signature: ["objectModel.animatedActor"],
                    delegate: function (actor) { alert("a ausculté : " + actor.name); }
                }, {
                    name: "ausculter",
                    signature: ["objectModel.animatedActor"],
                    delegate: function (actor) { alert("a ausculté : " + actor.name); }
                }, {
                    name: "ausculter",
                    signature: ["objectModel.animatedActor"],
                    delegate: function (actor) { alert("a ausculté : " + actor.name); }
                }, {
                    name: "ausculter",
                    signature: ["objectModel.animatedActor"],
                    delegate: function (actor) { alert("a ausculté : " + actor.name); }
                }, {
                    name: "ausculter",
                    signature: ["objectModel.animatedActor"],
                    delegate: function (actor) { alert("a ausculté : " + actor.name); }
                }, {
                    name: "ausculter",
                    signature: ["objectModel.animatedActor"],
                    delegate: function (actor) { alert("a ausculté : " + actor.name); }
                }, {
                    name: "ausculter",
                    signature: ["objectModel.animatedActor"],
                    delegate: function (actor) { alert("a ausculté : " + actor.name); }
                }, {
                    name: "ausculter",
                    signature: ["objectModel.animatedActor"],
                    delegate: function (actor) { alert("a ausculté : " + actor.name); }
                }
            ]
        },
        {
            name: "ordre",
            actionList: [
                {
                    name: "demander d'ausculter",
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
            action: "mainController.submodules.targetListController.targetList.select('morty')",
            text: "00:32 - morty est en danger!",
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
        { name: "rick", infos: ["true rick", "SMART", "alcoholic"], avatarUrl: "https://images.moviepilot.com/images/c_limit,q_auto,w_710/vdc49xfybuuua6fd2jjx/everything-we-know-so-far-about-rick-and-morty-season-3.jpg" },
        { name: "morty", infos: ["true morty", "as dumb as rick is smart", "innocent"], avatarUrl: "http://content.internetvideoarchive.com/content/photos/9249/337362_014.jpg" },
        { name: "snuffles", infos: ["true snuffles", "uplifted animal", "dream of world domination"], avatarUrl: "http://vignette3.wikia.nocookie.net/rickandmorty/images/7/70/Snuffles-helmet.jpg/revision/latest?cb=20131212193614" },
        { name: "rick2", infos: [], avatarUrl: "https://images.moviepilot.com/images/c_limit,q_auto,w_710/vdc49xfybuuua6fd2jjx/everything-we-know-so-far-about-rick-and-morty-season-3.jpg" },
        { name: "morty2", infos: [], avatarUrl: "http://content.internetvideoarchive.com/content/photos/9249/337362_014.jpg" },
        { name: "snuffles2", infos: [], avatarUrl: "http://vignette3.wikia.nocookie.net/rickandmorty/images/7/70/Snuffles-helmet.jpg/revision/latest?cb=20131212193614" },
        { name: "rick3", infos: [], avatarUrl: "https://images.moviepilot.com/images/c_limit,q_auto,w_710/vdc49xfybuuua6fd2jjx/everything-we-know-so-far-about-rick-and-morty-season-3.jpg" },
        { name: "morty3", infos: [], avatarUrl: "http://content.internetvideoarchive.com/content/photos/9249/337362_014.jpg" },
        { name: "snuffles3", infos: [], avatarUrl: "http://vignette3.wikia.nocookie.net/rickandmorty/images/7/70/Snuffles-helmet.jpg/revision/latest?cb=20131212193614" },
    ]);
});
jQuery(function () { return makePageLayout(jQuery("body")); });
//# sourceMappingURL=app.js.map