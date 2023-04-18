import { LightningElement, wire } from 'lwc';
import { deleteRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';

import getLatestAccounts from '@salesforce/apex/AccountController.getAccountList';
import updateAccount from '@salesforce/apex/AccountController.updateAccount';

const columns = [
    { label: 'Name', fieldName: 'Name', type: 'text' },
    { label: 'Phone', fieldName: 'Phone', type: 'text' },
    { label: 'Industry', fieldName: 'Industry', type: 'text' }
];
export default class LwcRefreshApex extends LightningElement {

    cols = columns;
    selectedRecord;
    accountList = [];
    error;
    wiredAccountList = [];

    
    @wire(getLatestAccounts)
    accList(result) {
        this.wiredAccountList = result; //
        if (result.data) {
            this.accountList = result.data;
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.accountList = undefined;
        }
    }

    handelSelection(event) {
        if (event.detail.selectedRows.length > 0) {
            this.selectedRecord = event.detail.selectedRows[0].Id;
        }
    }
    deleteRecord() {
        deleteRecord(this.selectedRecord)
        .then(() => {
            console.log('refresh apex')
            refreshApex(this.wiredAccountList);
        })
        .catch(error => {
        })
    }

    updateRecord() {
        updateAccount({ 
            recordId: this.selectedRecord 
        })
        .then(result => {
            console.log('Result \n ', result);
            refreshApex(this.wiredAccountList);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}