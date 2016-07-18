///<reference path="../../node_modules/angular2/typings/browser.d.ts"/>

import { Injectable } from 'angular2/core';
import { Http } from 'angular2/http';

import { MsgService, MsgType, urlEncode } from './services'

let SELF: HttpAdvanced = null;

@Injectable()
export class HttpAdvanced {
    msgService: MsgService;
    http: Http;

    constructor(msgService: MsgService, http: Http) {
        this.msgService = msgService;
        this.http = http;
        SELF = this;
    }

    private processUrl(oldUrl: string): string {
        if (oldUrl && oldUrl[0] !== '/') oldUrl = '/' + oldUrl;
        return "http://localhost:8000" + oldUrl;
    }

    /*
     * This is for plain ol' GET requests .. with callback of course.
     */
    public get(url, callback) {
        url = this.processUrl(url);
        return this.http.get(url).subscribe((res) => {
            let msg = this.extractMsg(res);
            callback(msg);
        }, this.httpErrorHandler);
    }

    /*
     * GET without logging to message service.
     */
    public getNoError(url, callback) {
        url = this.processUrl(url);
        return this.http.get(url).subscribe((res) => {
            let msg = this.extractMsg(res);
            callback(msg);
        }, (err) => {
            let msg = this.extractMsg(err);
        });
    }

    /*
     * This is for POST request WITHOUT callback.
     * (Simply the positive response will be logged to console and
     *  negative to msgService)
     */
    public post(url, data) {
        url = this.processUrl(url);
        return this.http.post(url, urlEncode(data)).subscribe((res) => {
            let msg = this.extractMsg(res);
            this.msgService.setMessage(msg, MsgType.Success);
        }, this.httpErrorHandler);
    }

    /*
     * This is for making POST requests which plan on executing a callback.
     */
    public postWithRes(url, data, callback) {
        url = this.processUrl(url);
        return this.http.post(url, urlEncode(data)).subscribe((res) => {
            let msg = this.extractMsg(res);
            if (callback) callback(msg);
        }, this.httpErrorHandler);
    }

    public postWithBothMsg(url, data, callback?) {
        url = this.processUrl(url);
        return this.http.post(url, urlEncode(data)).subscribe((res) => {
            let msg = this.extractMsg(res);
            this.msgService.setMessage(msg, MsgType.Success);
            if (callback) callback(msg);
        }, this.httpErrorHandler);
    }

    public postPure(url, data, callback?) {
        url = this.processUrl(url);
        return this.http.post(url, data).subscribe((res) => {
            let msg = this.extractMsg(res);
            this.msgService.setMessage(msg, MsgType.Success);
            if (callback) callback(res);
        }, this.httpErrorHandler);
    }

    private extractMsg(msg) {
        let msg2 = msg.json ? (msg.json().error_message || msg.json().success_message || msg.json().data || msg.json()) : msg;
        return msg2;
    }

    private httpErrorHandler(err) {
        let msg = SELF.extractMsg(err);
        SELF.msgService.setMessage(msg, MsgType.Error);
        return msg;
    }

    private httpSuccessHandler(success) {
        let msg = SELF.extractMsg(success);
        SELF.msgService.setMessage(msg, MsgType.Success);
        return msg;
    }
}
