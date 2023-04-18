import { api, LightningElement, wire } from 'lwc';
import { updateRecord, getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import ID_FIELD from '@salesforce/schema/Contact.Id';
import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';

const FIELDS = [FIRSTNAME_FIELD, LASTNAME_FIELD, EMAIL_FIELD];
export default class UpdateRecord extends LightningElement {

    @api recordId;

    contactRecord;
    fieldVales = {}
    __errors;

    @wire(getRecord, {recordId : '$recordId', fields : FIELDS})
    wiredAccount(result){
        if(result.data){
            window.console.log(result.data);
            this.contactRecord = result.data;
        }else if(result.error){
            let message = 'Unknown error';
            if (Array.isArray(error.body)) {
                message = error.body.map(e => e.message).join(', ');
            } else if (typeof error.body.message === 'string') {
                message = error.body.message;
            }
            this.__errors = message;
            window.console.error({
                title : 'Error ',
                data : this.__errors
            });
        }
    }

    get firstName() {
        return getFieldValue(this.contactRecord, FIRSTNAME_FIELD);
    }

    get lastName() {
        return getFieldValue(this.contactRecord, LASTNAME_FIELD);
    }

    get email(){
        return getFieldValue(this.contactRecord, EMAIL_FIELD);
    }

    handleChange(event){
        event.preventDefault();
        let name = event.target.name;
        let value = event.target.value;
        this.fieldVales[name] = value;
    }

    handleUpdate(event){
        
        event.preventDefault();
        const fields = {};

        fields[ID_FIELD.fieldApiName]           = this.recordId;
        fields[FIRSTNAME_FIELD.fieldApiName]    = this.fieldVales.FirstName;
        fields[LASTNAME_FIELD.fieldApiName]     = this.fieldVales.LastName;
        fields[EMAIL_FIELD.fieldApiName]        = this.fieldVales.Email;

        const recordInput = { fields };
        updateRecord(recordInput)
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Contact updated',
                    variant: 'success'
                })
            );
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }
}