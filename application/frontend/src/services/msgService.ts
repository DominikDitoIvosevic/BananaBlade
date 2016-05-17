///<reference path="../../node_modules/angular2/typings/browser.d.ts"/>

import { Injectable, Inject } from 'angular2/core';
import { Subject } from 'rxjs/Rx';

let MESSAGE_TEXT = "message_text";
let MESSAGE_TYPE = "message_type";

let INFO = "info";
let SUCCESS = "success";
let ERROR = "error";

export class Message {
  text: string;
  type: string;

  constructor(msg: any, type?: string) {
    this.text = typeof msg === "string" ? msg : JSON.stringify(msg);
    if ( !type ) this.type = INFO;
  }
}

@Injectable()
export class MsgService {
    public message: Subject<Message>;

    constructor() {
      this.message = new Subject();
        // FOR TESTING
        //setTimeout(() => this.setMessage("ASD"), 1000);
    }

    setMessage(msg: any, type?: string) {
      let newMsg = new Message(msg, type);
      this.message.next(newMsg);
    }
}
