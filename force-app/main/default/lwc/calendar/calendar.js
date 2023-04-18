import { LightningElement } from 'lwc';
import fullcalendar from '@salesforce/resourceUrl/fullcalendar';
import { loadScript } from "lightning/platformResourceLoader";
export default class Calendar extends LightningElement {

    connectedCallback() {
        loadScript(this, fullcalendar)
            .then(() => {
                console.log('FullCalendar JS loaded...');
            })
            .catch((error) => {
                console.error('Error while loading fullcalendar resources... ', error);
            })
            .finally(() => {
                console.log('Finally Executed...');
            })
    }
}