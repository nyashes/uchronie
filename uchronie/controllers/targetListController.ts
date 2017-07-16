class targetListController extends baseListController<objectModel.animatedActor> {
    public select(name: string) {
        let toSelect = this.element.children("#" + name).data("controller");
        toSelect.select();
    }
}

class targetController extends baseController<objectModel.animatedActor>{
    public init() {
        this.element.attr("id", this.model.name);
        this.element.find(".avatar").css("background-image", "url('" + this.model.avatarUrl + "')");
        this.element.find(".name").text(this.model.name);
        this.element.find(".infos").data("model", this.model.infos);

        this.element.unbind('click').bind('click', () => this.click(this));
    }
    public updateVisual() {
        let patient = this.model as objectModel.patient;
        for (var i = 0; i <= 4; ++i)
            this.element.toggleClass("gravity-" + i, Math.floor(patient.gravity.current()) == i);
    }

    public click(instance: targetController) {
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
    public hover(instance: targetController) {
    }
}