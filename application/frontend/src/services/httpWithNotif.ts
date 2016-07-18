// import { Http } from 'angular2/http';
// import { MsgService, MsgType, urlEncode } from './services';
// 
// let XHR_PORT = "8000";
// 
// export class HttpWithNotif {
//   msgService: MsgService;
//   http: Http;
//   
//   constructor(msgService: MsgService, http: Http) {
//     this.msgService = msgService;
//     this.http = http;
//   }
//   
//   private processUrl(oldUrl: string): string {
//       if (oldUrl && oldUrl[0] !== '/') oldUrl = '/' + oldUrl;
//       return "http://localhost:" + XHR_PORT + oldUrl;
//   }
//   
//   private httpErrorHandler(err) {
//       let msg: string = this.extractMsg(err);
//       this.msgService.setMessage(msg, MsgType.Error);
//       return msg;
//   }
//   
//   private extractMsg(msg): Object {
//       let msg2 = msg.json ? (msg.json().error_message || msg.json().success_message || msg.json().data || msg.json()) : msg;
//       return msg2;
//   }
//   
//   public post(url: string, data: Object): Observable {
//     let req = this.http.post(this.processUrl(url), urlEncode(data)).map(this.extractMsg);
//     req.subscribe(() => {}, this.httpErrorHandler);
//     return req;
//   }
// }