import { LightningElement, wire } from 'lwc';
import getContacts from '@salesforce/apex/AccordionController.getContacts';
export default class AccordionComponent extends LightningElement {

    contactList;
    error;

    @wire(getContacts)
    wiredData({ error, data }) {
        if (data) {
            console.log('Data \n ', data);
            this.contactList = data;
            this.error = undefined;
        } else if (error) {
            console.error('Error: \n ', error);
            this.contactList = undefined;
            this.error = error;
        }
    }
    handleSectionToggle(event){
        event.preventDefault();
        let openSections = event.detail.openSections;
        console.log(openSections);
        alert(openSections);
    }
}