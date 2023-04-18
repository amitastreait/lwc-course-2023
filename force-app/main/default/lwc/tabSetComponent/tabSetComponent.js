import { api, LightningElement , wire } from 'lwc';
import getContacts from '@salesforce/apex/AccordionController.getContacts';
export default class TabSetComponent extends LightningElement {

    @api recordId;
    tabContent = 'Tab two is active';
    contactList;
    error;
    name;

    connectedCallback(){
        if(this.recordId){
            alert(this.recordId);
        }
    }

    @wire(getContacts)
    wiredData({ error, data }) {
        if (data) {
            console.log('Data \n ', data);
            this.contactList = data;
            this.error = undefined;
            if(this.error){
                console.log(this.error.message);
            }
            console.log(this.name);

        } else if (error) {
            console.error('Error: \n ', error);
            this.contactList = undefined;
            this.error = error;
        }
    }

    errorCallback(error, stack){
        console.error('Error Callback : \n ', error);
        console.error('stack: \n ', stack);
    }

    handleActive(event){
        alert('Active ');
        event.preventDefault();
        this.tabContent = `Tab ${event.target.value} is now active`;
    }
}