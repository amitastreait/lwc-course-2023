/*
    @recordTypeId       --> Pass the Id of the record type
    @objectApiName      --> The Object API Name. i.e - Account
    @fieldApiName       --> The field API Name - i.e. Type
    @label              --> The field label that will be displayed to the user. i.e. Type
    @placeholder        --> The placeholder for the picklist value. i.e. Select Type
    @required           --> Use this attribute if the picklist value is required.
*/
import { api, LightningElement, track, wire } from 'lwc';
import { getPicklistValues, getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';

// import INSUSTRY_FIELD from '@salesforce/schema/Account.Industry';
// import ACCOUNT_OBJECT from '@salesforce/schema/Account';
// Payment__c
const DEFAULT_RECORD_TYPE_ID = '012000000000000AAA';

export default class Picklist extends LightningElement {

    @api recordTypeId = DEFAULT_RECORD_TYPE_ID;
    @api objectApiName = 'Account';
    @api fieldApiName = 'Type';
    @api label = "Type";
    @api placeholder = "Select Type";
    @api required = false;

    value;
    @track picklistValues = [];

    @wire(getPicklistValuesByRecordType, {
        recordTypeId: '$recordTypeId',
        objectApiName: '$objectApiName'
    })
    wiredPicklistValues({ error, data }) {
        if (data) {
            console.log(' picklist values ', data);
            /*
                data = {
                    picklistFieldValues : {
                        Type : {
                            values : []
                        },
                        Industry : {
                            values : []
                        },
                        AccountSource : {
                            values : []
                        }
                    }
                }
                data.picklistFieldValues['Type']
            */
            if (data.picklistFieldValues && data.picklistFieldValues[this.fieldApiName]) {
                let picklistValues = data.picklistFieldValues[this.fieldApiName];
                this.options = picklistValues.values;
            } else {
                // Message when picklist API Name is not availble
            }
        } else {
            console.error(error);
        }
    }
    /*
        @wire(getPicklistValues, {
            recordTypeId: '$recordTypeId',
            fieldApiName: INSUSTRY_FIELD
        })
        wiredPicklistValues({ error, data }) {
            if (data) {
                console.log(' picklist values ', data);
                this.options = data.values;
            } else {
                console.error(error);
            }
        }
    */
    get options() {
        return this.picklistValues;
    }

    set options(options) {
        this.picklistValues = options;
    }

    handleChange(event) {
        this.value = event.target.value;
        const changeEvent = new CustomEvent('change', {
            detail: {
                fieldApiName: this.fieldApiName,
                value: this.value
            }
        });
        this.dispatchEvent(changeEvent);
    }

    @api
    handleValidate() {
        if (this.required) {
            const allValid = [
                ...this.template.querySelectorAll('lightning-combobox'),
            ].reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);
            return allValid;
        }
        return true;
    }
}