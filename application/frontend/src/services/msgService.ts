///<reference path="../../node_modules/angular2/typings/browser.d.ts"/>

import { Injectable, Inject } from 'angular2/core';
import { Subject } from 'rxjs/Rx';

let MESSAGE_TEXT = "message_text";
let MESSAGE_TYPE = "message_type";

let INFO = "info";
let SUCCESS = "success";
let ERROR = "error";

export enum MsgType {
  Info,
  Success,
  Error
}

export class Message {
  text: string;
  type: MsgType;

  constructor(text: string, type?: MsgType) {
    this.text = text;
    if ( !type ) this.type = MsgType.Info;
    else this.type = type;
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

    setMessage(text: string, type?: MsgType) {
      let newMsg = new Message(text, type);
      this.message.next(newMsg);
    }
}
