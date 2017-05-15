class mainController {
    static submodules: { [key: string]: { [key: string]: any } } = {};

    public static currentTarget(): baseController<objectModel.animatedActor> {
        return mainController.submodules["targetListController"]["targetList"]
            .element.children(".selected").data("controller");
    }

    public static currentPlayer(): baseController<objectModel.animatedActor> {
        return mainController.submodules["targetListController"]["targetList"]
            .element.children(".player").data("controller");
    }

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
                if (typeof this.model[prop] != "object")
                    this.element.children("." + prop).text(this.model[prop]);
                else if (this.model[prop].current != undefined) {
                    let capture = prop;
                    objectModel.tick.push(() => this.element.children("." + capture).text(this.model[capture].current()));
                }
                else
                    this.element.children("." + prop).data("model", this.model[prop]);
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
        if (!this.model) {
            console.error("error: no model found for list " + this.element.html());
        }
        else for (let actor of this.model) {
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
        if (typeof item != "object") {
            newElement.text(item as any);
            console.log(item + " put into " + newElement.html());
        }
        else {
            newElement.data("model", item);
            console.log(JSON.stringify(item) + " put into " + newElement.html());
        }
        this.element.append(newElement);
    }
}

class targetContoller extends baseController<objectModel.animatedActor>{
    public init() {
        this.element.attr("id", this.model.name);
        this.element.find(".avatar").css("background-image", "url('" + this.model.avatarUrl + "')");
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

class catController extends baseController<objectModel.actionCat> {
    public init() {
        super.init();
        this.element.children(".name").unbind("click").bind("click", () => {
            jQuery("#actionContainer").children().remove();
            jQuery("#actionContainer").append(this.element.children(".actionList").clone(true, true).css("display", "block"));
        });
    }
}

class actionController extends baseController<objectModel.actionMeta> {
    public init() {
        this.element.children(".name").text(this.model.name);
        this.element.children(".delegate").unbind("click").bind("click",
            () => this.model.delegate(mainController.currentTarget().model));
    }
}

class gameEventController extends baseController<objectModel.gameEvent> {
    public init() {
        this.element.unbind('click').bind('click', () => {
            this.model.action();
            this.model.eventClass.setKeyFrame(objectModel.currentTime, 'discared');
        });
        this.element.text(this.model.text);
        objectModel.tick.push(() => {
            this.element.removeClass();
            this.element.addClass(this.model.eventClass.current());
        });
        
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
        toAdd.quantity.setKeyFrame(objectModel.currentTime, Math.max(toAdd.quantity.current() + quantity, 0));

        controller.init();
    }
};

class targetListController extends baseListController<objectModel.animatedActor> {
    public select(name: string) {
        let toSelect = this.element.children("#" + name).data("controller");
        toSelect.select();
    }
};

class timelineController extends baseController<any> {
    dragged: JQuery;
    dragging: boolean;
    public init() {
        this.dragged = this.element.find('.cursor');

        this.element.bind("mousemove", (event) => {
            if (this.dragging) {
                this.changePosition(event.clientX);
            }
        });
        
        this.dragged.unbind('mousedown').bind('mousedown', (event) => {
            this.dragging = true;
            jQuery("html").bind('mouseup', () => {
                this.dragging = false;
                jQuery("html").unbind('mouseup');
            });
        });

        let play = this.element.find(".playButton");
        play.unbind("click").bind("click", () => {
            if (play.text() == "play") {
                objectModel.play();
                play.text("pause");
            }
            else { 
                objectModel.pause();
                play.text("play");
            }

        });

        objectModel.tick.push(() => this.changePosition(objectModel.currentTime));
    }
    public currentPosition(): number {
        return this.dragged.offset().left;
    }
    public changePosition(pos: number) {
        let currentPos = Math.min(pos, this.dragged.parent().width() - 30);
        this.dragged.css("left", currentPos);
        this.dragged.prev().css("width", currentPos);
        this.dragged.next().css("width", (this.dragged.next().parent().width() - currentPos - 30));
        objectModel.currentTime = currentPos;
    }
}

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
    jQuery("#actionList").data("model", [
        {
            name: "soin",
            actionList: [
                {
                    name: "ausculter (complet)",
                    signature: ["objectModel.animatedActor"],
                    delegate: function (actor: objectModel.animatedActor) { alert("a ausculté : " + actor.name); }
                }, {
                    name: "ausculter (tête)",
                    signature: ["objectModel.animatedActor"],
                    delegate: function (actor: objectModel.animatedActor) { alert("a ausculté : " + actor.name); }
                }, {
                    name: "ausculter (torse)",
                    signature: ["objectModel.animatedActor"],
                    delegate: function (actor: objectModel.animatedActor) { alert("a ausculté : " + actor.name); }
                }, {
                    name: "ausculter (jambe)",
                    signature: ["objectModel.animatedActor"],
                    delegate: function (actor: objectModel.animatedActor) { alert("a ausculté : " + actor.name); }
                }, {
                    name: "opérer",
                    signature: ["objectModel.animatedActor"],
                    delegate: function (actor: objectModel.animatedActor) { alert("a ausculté : " + actor.name); }
                }, {
                    name: "évacuer",
                    signature: ["objectModel.animatedActor"],
                    delegate: function (actor: objectModel.animatedActor) { alert("a ausculté : " + actor.name); }
                }, {
                    name: "vérifier matériel",
                    signature: ["objectModel.animatedActor"],
                    delegate: function (actor: objectModel.animatedActor) { alert("a ausculté : " + actor.name); }
                }
            ]
        },
        {
            name: "ordre",
            actionList: [
                {
                    name: "ordre de médecin",
                    signature: ["objectModel.animatedActor", "objectModel.animatedActor"],
                    delegate: function (actor: objectModel.animatedActor) { alert(this.name + " a ausculté : " + actor.name); }
                },
                {
                    name: "ordre d'infirmier",
                    signature: ["objectModel.animatedActor", "objectModel.animatedActor"],
                    delegate: function (actor: objectModel.animatedActor) { alert(this.name + " a ausculté : " + actor.name); }
                },
                {
                    name: "ordre de patient",
                    signature: ["objectModel.animatedActor", "objectModel.animatedActor"],
                    delegate: function (actor: objectModel.animatedActor) { alert(this.name + " a ausculté : " + actor.name); }
                }
            ]
        },
    ]);
    jQuery("#console").data("model", [
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
    ]);
    jQuery("#sideBarLeft").data("model", [
        new objectModel.ressource("couverture", 5, "unités"),
        new objectModel.ressource("pansements",100, "unités" ),
        new objectModel.ressource("oxygène", 500, "L" ),
        new objectModel.ressource("morphine", 50, "mL" ),
        new objectModel.ressource("augmentin", 50, "moles" ),
        new objectModel.ressource("perche", 3, "unités" )
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
jQuery(() => makePageLayout(jQuery("body")));