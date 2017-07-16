class ressourceListController extends baseListController<objectModel.ressource> {
    public add(name: string, quantity: number) {
        let controller = this.element.children("#" + name).data("controller");
        let toAdd = this.element.children("#" + name).data("model") as objectModel.ressource;
        toAdd.quantity.setKeyFrame(objectModel.currentTime, Math.max(toAdd.quantity.current() + quantity, 0));

        controller.init();
    }
}

class ressourceController extends baseController<objectModel.ressource> {
    public init() {
        super.init();
        this.element.attr("id", this.model.name);
    }
}