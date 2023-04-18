import { LightningElement } from 'lwc';

export default class PicklistDemo extends LightningElement {

    handleChange(event) {
        let details = event.detail;
        console.log(JSON.stringify(details));
    }
}