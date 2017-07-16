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
                    objectModel.guiTick.push(() => this.element.children("." + capture).text(this.model[capture].current()));
                }
                else
                    this.element.children("." + prop).data("model", this.model[prop]);
            }
        }
    }
}