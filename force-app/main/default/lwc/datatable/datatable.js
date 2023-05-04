import { LightningElement, track, wire } from 'lwc';
import listAccount from '@salesforce/apex/AccountService.listAccounts';

import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const columns = [
    {
        label: 'Link', fieldName: 'Name', type: 'link', editable: true,
        typeAttributes: {
            recordId: {
                fieldName: 'Id'
            },
            recordName: {
                fieldName: 'Name'
            },
        }
    },
    { label: 'Id', fieldName: 'Id', editable: true },
    { label: 'Name', fieldName: 'Name', type: 'text', editable: true },
    { label: 'Phone', fieldName: 'Phone', type: 'phone', editable: true },
    { label: 'Industry', fieldName: 'Industry', type: 'text', editable: true },
    {
        label: 'Image', fieldName: 'imageUrl', type: 'image',
        typeAttributes: {
            height: 50,
            width: 50,
            alt: 'Panther School Image'
        }
    },
    {
        label: 'Industry', fieldName: 'Industry', type: 'picklist', wrapText: true,
        typeAttributes: {
            name: 'Industry',
            label: 'Industry',
            placeholder: 'Select Industry',
            index: 0,
            variant: 'label-hidden',
            options: [
                { label: 'Education', value: 'Education' },
                { label: 'Banking', value: 'Banking' },
                { label: 'Aparel', value: 'Aparel' },
                { label: 'Technology', value: 'Technology' }
            ]
        },
        editable: true
    }
];
export default class Datatable extends LightningElement {

    @track dataList = [];
    @track columnsList = columns;
    @track errors;

    @track draftValues = [];


    @wire(listAccount)
    wiredAccounts({ error, data }) {
        if (data) {
            this.dataList = data.map(item => {
                return {
                    ...item,
                    imageUrl: 'https://www.pantherschools.com/wp-content/uploads/2022/02/cropped-logoblack.png'
                };
            });
        }
        if (error) {
            this.errors = error;
        }
    }

    handleSelect(event) {
        event.preventDefault();
        let detail = event.detail;
        console.log(JSON.stringify(detail));
    }

    handleCellChange(event) {
        event.preventDefault();
        console.log('cell changed')
    }

    async handleSave(event) {
        // Convert datatable draft values into record objects
        const records = event.detail.draftValues.slice().map((draftValue) => {
            const fields = Object.assign({}, draftValue);
            return { fields };
        });

        // Clear all datatable draft values
        this.draftValues = [];

        try {
            // Update all records in parallel thanks to the UI API
            const recordUpdatePromises = records.map((record) =>
                updateRecord(record)
            );
            await Promise.all(recordUpdatePromises);

            // Report success with a toast
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Records updated',
                    variant: 'success'
                })
            );

            // Display fresh data in the datatable
            await refreshApex(this.dataList);
        } catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or reloading Records',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        }
    }
}