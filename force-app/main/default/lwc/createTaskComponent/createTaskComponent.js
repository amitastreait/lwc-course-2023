import { LightningElement, api, track, wire } from 'lwc';
import fetchPicklistValues from '@salesforce/apex/ReminderService.fetchPicklistValues';
import createToDoItem from '@salesforce/apex/ReminderService.createToDoItem';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CreateTaskComponent extends LightningElement {

    @track statusOptions = [];
    @track priorityOptions = [];
    isLoading = false;

    @api recordId; // undefined

    @api recordToCreate = {
        "Subject": "",
        "ActivityDate": null,
        "Status": "",
        "Priority": "",
        "Description": ""
    };

    @wire(fetchPicklistValues, {
        objectApiName: "Task",
        fieldApiName: "Status"
    })
    wiredStatusValues({ error, data }) {
        if (data) {
            this.statusOptions = data;
        }
        if (error) {
            console.error(error);
        }
    }

    @wire(fetchPicklistValues, {
        objectApiName: "Task",
        fieldApiName: "Priority"
    })
    wiredPriorityValues({ error, data }) {
        if (data) {
            this.priorityOptions = data;
        }
        if (error) {
            console.error(error);
        }
    }

    handleChange(event) {
        event.preventDefault();
        let value = event.target.value;
        let name = event.target.name;
        let existingValues = { ...this.recordToCreate }; // JSON.parse(JSON.stringify(this.recordToCreate)); 
        existingValues[name] = value;
        this.recordToCreate = JSON.parse(JSON.stringify(existingValues)); // { ... existingValues }
        //this.recordToCreate[name] = value;
    }

    handleSubmit(event) {

        event.preventDefault();
        if (this.validateInput() === false) {
            return;
        }

        this.isLoading = true;
        createToDoItem({
            taskString: JSON.stringify(this.recordToCreate)
        })
            .then((result) => {
                // successfull
                console.log('The Todo Item Created Successfully');
                let successMessage = new ShowToastEvent({
                    'title': 'Success!',
                    'message': 'ToDo List is Submitted',
                    'variant': 'success'
                });
                this.dispatchEvent(successMessage);

                this.dispatchEvent(new CustomEvent('success'));
            })
            .catch((error) => {
                console.error('Error occured while creating the Todo Item', JSON.stringify(error));
                let successMessage = new ShowToastEvent({
                    'title': 'Error!',
                    'message': JSON.stringify(error),
                    'variant': 'error'
                });
                this.dispatchEvent(successMessage);
            })
            .finally(() => {
                this.isLoading = false;
            });

    }

    validateInput() {

        const allValid = [
            ...this.template.querySelectorAll('lightning-input'),
        ].reduce((validSoFar, inputCmp) => {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);

        const allValidCombobox = [
            ...this.template.querySelectorAll('lightning-combobox'),
        ].reduce((validSoFar, inputCmp) => {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);

        return allValid && allValidCombobox;
    }

}