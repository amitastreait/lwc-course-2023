import { LightningElement, api } from 'lwc';
import updatePriceBook2 from '@salesforce/apex/AddProductsService.updatePriceBook2';

export default class ChoosePricebook extends LightningElement {

    @api parentId;
    @api parentObjectApiName;

    fields = ["Name", "IsActive"];
    displayFields = 'Name, IsActive';
    recordId;
    showSpinner = false;
    errorMessage;

    handleCancel() {
        this.dispatchEvent(new CustomEvent('cancel'));
    }
    handleSave() {
        console.log(this.recordId);
        if (this.recordId) {
            this.errorMessage = undefined;
        } else {
            this.errorMessage = `Select a Price Book to associate with this ${this.parentObjectApiName}.`;
            console.log(this.errorMessage);
            return;
        }

        this.showSpinner = true;
        updatePriceBook2({
            priceBook2Id: this.recordId,
            objectApiName: this.parentObjectApiName,
            recordId: this.parentId
        })
            .then((result) => {
                const selectedEvent = new CustomEvent('success', {
                    detail: {
                        priceBook2Id: this.recordId
                    }
                });
                this.dispatchEvent(selectedEvent);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                this.showSpinner = false;
            })
    }

    handleLookup(event) {
        let detail = event.detail;
        console.log(JSON.stringify(detail));
        this.recordId = detail.data.recordId; // undefined
    }
}