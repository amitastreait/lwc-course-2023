import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import NAME_FIELD from '@salesforce/schema/Account.Name';
import OWNER_NAME_FIELD from '@salesforce/schema/Account.Owner.Name';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry'

const FIELDS = ['Account.Type', 'Account.Name', OWNER_NAME_FIELD, PHONE_FIELD, INDUSTRY_FIELD];

export default class GetRecord extends LightningElement {

    @api recordId;

    accountRecord;
    __errors;

    @wire(getRecord, {recordId : '$recordId', fields : FIELDS})
    wiredAccount(result){
        if(result.data){
            window.console.log(result.data);
            this.accountRecord = result.data;
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

    get name() {
        return getFieldValue(this.accountRecord, NAME_FIELD);
    }

    get phone() {
        return getFieldValue(this.accountRecord, PHONE_FIELD);
    }

    get industry(){
        return getFieldValue(this.accountRecord, INDUSTRY_FIELD);
    }
    
    get owner() {
        return getFieldValue(this.accountRecord, OWNER_NAME_FIELD);
    }
    get type() {
        return getFieldValue(this.accountRecord, 'Account.Type');
    }
    get typeWF() {
        let value = '';
        if(this.accountRecord){
            value = this.accountRecord.fields.Type.value;
        }
        return value;
    }
}