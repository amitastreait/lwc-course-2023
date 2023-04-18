import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

export default class CloseCase extends LightningElement {
    @api recordId;
    @api objectApiName;
    @api placeToBeUsed;

    showCloseCaseComponent = false;

    handleClose() {
        this.showCloseCaseComponent = true;
    }

    handleCancel() {
        this.showCloseCaseComponent = false;
    }

    handleSuccess(event) {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Success!',
            message: 'Record Updated',
            variant: 'success'
        }));
    }

    handleError(event) {
        event.preventDefault();
        let successEvent = new ShowToastEvent({
            title: event.detail.message,
            message: event.detail.detail,
            variant: "error"
        });
        this.dispatchEvent(successEvent);
    }
}