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
    private pushItem(item: T, bind?: boolean) {
        let baseElement = this.element.children(".element");
        var newElement = baseElement.clone();
        newElement.css("display", this.displayProprety);
        newElement.removeClass("element");
        newElement.removeClass("noParse");
        if (typeof item != "object") {
            newElement.text(item as any);
        }
        else {
            newElement.data("model", item);
        }
        if (bind) mvcBinder(newElement);
        this.element.append(newElement);
    }
    public push(item: T) {
        this.pushItem(item, true);
    }
}