class actionController extends baseController<objectModel.actionMeta> {
    public init() {
        this.element.children(".name").text(this.model.name);
        this.element.children(".delegate").unbind("click").bind("click", () => {
            var parameters = [];

            var player = mainController.currentPlayer();
            var targetFrame = mainController.currentTarget();
            var target = targetFrame.model;
            for (let item of this.model.signature)
                parameters.push(eval(item));
            this.model.delegate.apply(parameters.shift(), parameters);
        });
    }
}
