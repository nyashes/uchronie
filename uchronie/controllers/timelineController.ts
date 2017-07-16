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

        objectModel.guiTick.push(() => this.changePosition(objectModel.currentTime));
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