

class mainController {
    static submodules: { [key: string]: { [key: string]: any } } = {};

    constructor() {

    }
}

class baseController<T> {
    public element: JQuery;
    public model: T;
    constructor(element: JQuery, model: T) {
        this.element = element;
        this.model = model;
        this.element.data("controller", this);
        this.init();
    }
    public init() {
        for (var prop in this.model) {
            if (this.model.hasOwnProperty(prop)) {
                this.element.find("." + prop).text(this.model[prop]);
            }
        }
    }
}

class baseListController<T> extends baseController<T[]> {
    private displayProprety: string;

    public init() {
        let baseElement = this.element.children(".element");
        this.displayProprety = baseElement.css("display");
        baseElement.css("display", "none");
        baseElement.addClass('noParse');
        for (let actor of this.model) {
            this.pushItem(actor);
        }
        if (baseElement.attr("controller"))
            mainController.submodules[baseElement.attr("controller")] = [];
    }
    public pushItem(item: T) {
        let baseElement = this.element.children(".element");
        var newElement = baseElement.clone();
        newElement.css("display", this.displayProprety);
        newElement.removeClass("element");
        newElement.removeClass("noParse");
        if (typeof item != "object")
            newElement.text(item as any);
        else
            newElement.data("model", item);

        this.element.append(newElement);
        //mvcBinder(newElement);
    }
}

class targetContoller extends baseController<objectModel.animatedActor>{
    public init() {
        this.element.attr("id", this.model.name);
        this.element.find(".avatar").attr("src", this.model.avatarUrl);
        this.element.find(".name").text(this.model.name);
        this.element.find(".infos").data("model", this.model.infos);

        this.element.unbind('click').bind('click', () => this.click(this));
    }

    public click(instance: targetContoller) {
        instance.element.siblings(".selected").removeClass("selected");
        if (instance.element.hasClass("selected"))
            instance.element.removeClass("selected");
        else
            instance.element.addClass("selected");
    }
    public select() {
        this.element.siblings(".selected").removeClass("selected");
        this.element.addClass("selected");
    }
    public hover(instance: targetContoller) {
    }
}

class gameEventController extends baseController<objectModel.gameEvent> {
    public init() {
        this.element.unbind('click').bind('click', () => { eval(this.model.action); this.element.remove(); });
        this.element.text(this.model.text);
        this.element.addClass(this.model.eventClass);
    }
}

class ressourceController extends baseController<objectModel.ressource> {
    public init() {
        super.init();
        this.element.attr("id", this.model.name);
    }
};

class ressourceListController extends baseListController<objectModel.ressource> {
    public add(name: string, quantity: number) {
        let controller = this.element.children("#" + name).data("controller");
        let toAdd = this.element.children("#" + name).data("model") as objectModel.ressource;
        toAdd.quantity += quantity;
        if (toAdd.quantity < 0)
            toAdd.quantity = 0;

        controller.init();
    }
};
class consoleController extends baseListController<objectModel.gameEvent> { };
class targetListController extends baseListController<objectModel.animatedActor> {
    public select(name: string) {
        let toSelect = this.element.children("#" + name).data("controller");
        toSelect.select();
    }
};


class htmlProperty {
    html: JQuery;
    attribute: string;

    constructor(_html: JQuery, _attribute: string) {
        _html.data(_attribute, this);
        this.html = _html;
        this.attribute = _attribute;
    }

    public value(v?: string | number | boolean): string | number | boolean {
        if (v) {
            this.html.children(this.attribute).text(v);
        }
        return this.html.children(this.attribute).text();
    }
}

function computeStars(prop: string, element: JQuery) {
    var stars: number = 1;
    element.children().each((dum, child) => {
        var currentChild = jQuery(child);
        var star: number = parseFloat(currentChild.attr("star"));
        if (!star)
            star = 1;
        stars += star;

    });
    element.children().each((dum, child) => {
        var currentChild = jQuery(child);
        var star: number = parseFloat(currentChild.attr("star"));
        if (!star)
            star = 1;
        currentChild.css(prop, (star / stars * 100) + "%");
    });
}
function mcBinder(element: JQuery) {
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

function mvcBinder(element: JQuery) {
    if (element.attr("view") != undefined) {
        element.load(element.attr("view"), null, () => mcBinder(element));
    }
    else
        mcBinder(element);
}

function makePageLayout(rootNode) {
    rootNode.children().each((dum, element) => { mvcBinder(jQuery(element)); });
    rootNode.children(".partition").each((dum, element) => { computeStars("width", jQuery(element)); });
    rootNode.children(".vpartition").each((dum, element) => { computeStars("height", jQuery(element)); });
}

jQuery(() => {
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
jQuery(() => makePageLayout(jQuery("body")));
