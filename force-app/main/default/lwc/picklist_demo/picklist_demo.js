import { LightningElement, wire } from 'lwc';

import { getPicklistValues } from 'lightning/uiObjectInfoApi';

import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
// Payment__c.Status__c
const DEFAULT_RECORD_TYPE_ID = '012000000000000AAA';

export default class Picklist extends LightningElement {
    value;

    recordTypeId = DEFAULT_RECORD_TYPE_ID;

    @wire(getPicklistValues, {
        recordTypeId: '$recordTypeId',
        fieldApiName: INDUSTRY_FIELD
    })
    wiredPicklist({ error, data }) {
        if (data) {
            console.log(data);
        } else {
            console.error(` Error occurred while retrieving the picklist ${JSON.stringify(error)}`);
        }
    }

    get options() {
        return [
            { label: 'High', value: 'High' },
            { label: 'Medium', value: 'Medium' },
            { label: 'Low', value: 'Low' }
        ]
    }

    handleChange(event) {
        this.value = event.target.value;
    }
}