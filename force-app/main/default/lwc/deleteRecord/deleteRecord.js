import { api, LightningElement } from 'lwc';
import { deleteRecord } from 'lightning/uiRecordApi';

import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class DeleteRecord extends NavigationMixin(LightningElement) {

    @api recordId;
    @api objectApiName;

    handleDelete(){
        deleteRecord(this.recordId)
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Record deleted',
                    variant: 'success'
                })
            );

            this[NavigationMixin.Navigate]({
                type: 'standard__objectPage',
                attributes: {
                    actionName: "home",
                    objectApiName: this.objectApiName
                }
            });
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error deleting record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }
}