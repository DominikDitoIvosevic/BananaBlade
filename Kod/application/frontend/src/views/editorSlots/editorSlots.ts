
import { View, Component, Injector } from 'angular2/core';
import { Router, RouteConfig, RouterLink, CanActivate } from 'angular2/router';
import { Http } from 'angular2/http';
import { CORE_DIRECTIVES, NgSelectOption, CheckboxControlValueAccessor, FORM_DIRECTIVES,
    FormBuilder, ControlGroup, Validators, Control } from 'angular2/common';
// NgSelectOption CheckboxControlValueAccessor

import { urlEncode } from '../../services/utilities';
import { AuthService } from '../../services/authService';


@CanActivate(AuthService.isEditorInjector())
@Component({
    selector: 'EditorSlots',
    templateUrl: './dest/views/editorSlots/editorSlots.html',
    directives: [ ]
})
export class EditorSlots {
    http: Http;
    fb: FormBuilder;
    router: Router;

    days: string[] = ["Pon", "Uto", "Sri", "Čet", "Pet", "Sub", "Ned"];
    hours: number[] = new Array();
    daysNum: number[] = [0, 1, 2, 3, 4, 5, 6];

    changing : boolean = false;

    today: Date = new Date();
    mondayDay: Date;

    calendarFields: number[][];

    slots: Slot[];
    thisWeeksSlots: Slot[];

    slotClicked(day, hour) {
        console.log(day + ' ' + hour);
        if (this.calendarFields[day][hour])
            this.router.navigate(['MakePlaylist', {'slotId': this.calendarFields[day][hour]}]);
    }

    requestForm: ControlGroup;
    time: Control;
    day0: Control;
    day1: Control;
    day2: Control;
    day3: Control;
    day4: Control;
    day5: Control;
    day6: Control;
    start_date: Control;
    end_date: Control;

    requestSlot(values) {
        console.log(values);
        let days_bit_mask = '' + (values.day0 ? 1 : 0) + (values.day1 ? 1 : 0) + (values.day2 ? 1 : 0) + (values.day3 ? 1 : 0) + (values.day4 ? 1 : 0) + (values.day5 ? 1 : 0) + (values.day6 ? 1 : 0);
        console.log(days_bit_mask);
        let start_date = new Date(values.start_date);
        let start_date2 = start_date.getFullYear() + '-' + (start_date.getMonth() + 1) + '-' + start_date.getDate();
        let end_date = new Date(values.end_date);
        let end_date2 = end_date.getFullYear() + '-' + (end_date.getMonth() + 1) + '-' + end_date.getDate();
        let requestObj = {
            'time': values.time,
            'days_bit_mask': days_bit_mask,
            'start_date': start_date2,
            'end_date': end_date2
        };
        this.http.post('/editor/slots/request', urlEncode(requestObj)).map((res) => res.json()).subscribe((res) => console.log(res), (err) => console.log(err));
    }

    initCalendar() {
        // Initialising fields representing fields from the calendar on view to false meaning the are not taken.
        this.calendarFields = new Array();
        for (let day in this.daysNum) {
            this.calendarFields[this.daysNum[day]] = new Array();
            for (let hour in this.hours) {
                this.calendarFields[this.daysNum[day]][this.hours[hour]] = 0;
            }
        }
        console.log(this.calendarFields);
    }

    updateCalendar() {
        this.initCalendar();
        let nextMonday = new Date(this.mondayDay.getTime() + 7 * 24 * 60 * 60 * 1000);
        for (let i in this.slots) {
            let slotTime = this.slots[i].time.getTime();
            if (slotTime >= this.mondayDay.getTime() && slotTime <= nextMonday.getTime()) {
                let dayOfWeek = ~~((slotTime / 1000 / 60 / 60 / 24) % 7);
                let hourOfDay = (slotTime / 1000 / 60 / 60) % 24;
                this.calendarFields[dayOfWeek][hourOfDay] = this.slots[i].id;
            }
        }
    }

    constructor(http: Http, fb: FormBuilder, router: Router) {
        // Initialising injected services.
        this.http = http;
        this.fb = fb;
        this.router = router;

        // Initialising the form for requesting slots.
        this.requestForm = fb.group({
            'time': new Control('', Validators.required),
            'day0': new Control(),
            'day1': new Control(),
            'day2': new Control(),
            'day3': new Control(),
            'day4': new Control(),
            'day5': new Control(),
            'day6': new Control(),
            'start_date': new Control('', Validators.required),
            'end_date': new Control('', Validators.required)
        });

        // Initialising the array that contains numbers representing allowed hours for slots.
        for (let i = 0; i <= 23; ++i) {
            this.hours.push(i);
        }


        // Calculating number of seconds since 00:00:00 of this week's Monday
        let secSinceMonday = this.today.getMilliseconds() + 1000 * (this.today.getSeconds() + 60 * (this.today.getMinutes() + 60 * (this.today.getHours() + 24 * ((this.today.getDay() + 6) % 7))));
        // Getting the Date object of this week's Monday at 00:00:00
        this.mondayDay = new Date(this.today.getTime() - secSinceMonday);

        this.initCalendar();

        // Fetching the list of allowed slots
        http.get('/editor/slots/list').map((res) => res.json()).subscribe((res) => {
            this.slots = new Array();
            for (let i in res.data.slots) {
                this.slots.push(new Slot(res.data.slots[i]));
            }
            this.updateCalendar();
            console.log(res);
        }, (err) => console.log(err));
    }

    toggleState(){ this.changing = !this.changing }

    getCount( day, hour ){
        var id = this.calendarFields[ day ][ hour ];
        for ( let i in this.slots )
            if ( id == this.slots[ i ].id )
                return this.slots[ i ].count;
        return -1;
    }
}

class Slot {
    id: number;
    time: Date;
    count: number;

    constructor(value) {
        this.id = value.id;
        this.time = new Date(value.time);
        this.count = value.count;
    }
}
