namespace objectModel {
    export class gameEvent {
        action: () => any;
        text: string;
        eventClass: nonDeterministicState<string>;

        public constructor(action: () => any, text: string, eventClass: string) {
            this.action = action;
            this.text = text;
            this.eventClass = new nonDeterministicState<string>();
            this.eventClass.setKeyFrame(currentTime-1, "discared");
            this.eventClass.setKeyFrame(currentTime, eventClass);
        }
    }
}