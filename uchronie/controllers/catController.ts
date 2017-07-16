class catController extends baseController<objectModel.actionCat> {
    public init() {
        super.init();
        this.element.children(".name").unbind("click").bind("click", () => {
            jQuery("#actionContainer").children().remove();
            jQuery("#actionContainer").append(this.element.children(".actionList").clone(true, true).css("display", "block"));
        });
    }
}