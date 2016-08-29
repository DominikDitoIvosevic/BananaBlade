import { Injectable, Inject } from 'angular2/core';
import { Http, Request } from 'angular2/http';
import { MsgService, MsgType, urlEncode } from './services';
import { Observable } from 'rxjs';

let XHR_PORT = "8000";

@Injectable()
export class HttpWithNotif {
  msgService: MsgService;
  http: Http;
  
  constructor(msgService: MsgService, http: Http) {
    this.msgService = msgService;
    this.http = http;
  }
  
  private extractMsg(msg: any) {
    let msg2 = msg.json ? (msg.json().error_message || msg.json().success_message || msg.json().data || msg.json()) : msg;
    return msg2;
  }
  
  private processUrl(oldUrl: string): string {
    if (oldUrl && oldUrl[0] !== '/') oldUrl = '/' + oldUrl;
    return "http://localhost:" + XHR_PORT + oldUrl;
  }
  
  private showMsgFactory(should: boolean = true): (err: any) => void {
    if (should) {
      return (err: any) => {
        let msg: string = this.extractMsg(err);
        this.msgService.setMessage(msg, MsgType.Error);
        return msg;
      }
    }
    else return (err: any) => {};
  }
  
  public post<T>(url: string, data: Object, msgSuccess = false, msgError = true): Observable<T> {
    let req = this.http.post(this.processUrl(url), urlEncode(data)).map(this.extractMsg);
    req.subscribe(this.showMsgFactory(msgSuccess), this.showMsgFactory(msgError));
    return req;
  }
  
  public get<T>(url: string, msgSuccess = false, msgError = true): Observable<T> {
    let req = this.http.get(this.processUrl(url)).map(this.extractMsg);
    req.subscribe(this.showMsgFactory(msgSuccess), this.showMsgFactory(msgError));
    return req;
  }
}


