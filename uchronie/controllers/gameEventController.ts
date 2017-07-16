class gameEventController extends baseController<objectModel.gameEvent> {
    public init() {
        this.element.unbind('click').bind('click', () => {
            this.model.action();
            this.model.eventClass.setKeyFrame(objectModel.currentTime, 'discared');
        });
        this.element.text(this.model.text);
        objectModel.guiTick.push(() => {
            this.element.removeClass();
            this.element.addClass(this.model.eventClass.current());
        });

    }
}