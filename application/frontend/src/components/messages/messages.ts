import { Component, Input } from 'angular2/core';
import { COMMON_DIRECTIVES } from 'angular2/common';
import { MsgService, Message, MsgType } from '../../services/services';
import { Observable, Subscriber } from 'rxjs/Rx';

@Component({
  selector : 'messages',
  directives : [ COMMON_DIRECTIVES ],
  templateUrl : 'dist/components/messages/messages.html'
})
export class Messages{
  messageType : MsgType;
  messageText : string;
  shown : boolean = false;
  listenTimeoutInterval: number;
  displayTimeoutInterval: number;

  messageService: MsgService;

  constructor(private msgService: MsgService){
    this.shown = false;
    this.listenTimeoutInterval = 100;
    this.displayTimeoutInterval = 2100;
    this.msgService.message.subscribe((message) => this.displayMessage(message));
  }

  displayMessage(message: Message) {
    console.log( this.messageType, this.messageText );
    this.messageType = message.type;
    this.messageText = message.text;
    this.show();
  }

  show(){
    this.shown = true;
    Observable.timer(this.displayTimeoutInterval).subscribe(() => this.hide());
  }

  hide(){
    this.shown = false;
  }
}
