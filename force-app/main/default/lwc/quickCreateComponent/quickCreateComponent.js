import { api, LightningElement, track, wire } from 'lwc';
import getMetadataRecords from '@salesforce/apex/MetadataRetreiver.getMetadataObjectRecords';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const DEFAULT_STYLE = 'color:red; display:none;';

export default class QuickCreateComponent extends LightningElement {

    @api objApiName = 'Case';
    @api placeToBeUsed = 'Case Record Page';

    @track fieldsToCreate = [
        { objectApiName: 'Case', fieldApiName: 'Subject' },
        { objectApiName: 'Case', fieldApiName: 'Status' },
        { objectApiName: 'Case', fieldApiName: 'Description' }
    ];

    length;
    style = DEFAULT_STYLE;
    areDetailsVisible = false;

    get messageStyle() {
        return this.style;
    }

    set messageStyle(value) {
        this.style = value;
    }

    @wire(getMetadataRecords, {
        objectApiName: '$objApiName',
        placeToBeUsed: '$placeToBeUsed',
        usedFor: 'Add New Record'
    })
    wireMetadataRecords({ error, data }) {
        if (data) {
            this.fieldsToCreate = data.map((field) => {
                return {
                    objectApiName: field.ObjectAPIName__r.QualifiedApiName,
                    fieldApiName: field.FieldAPIName__r.QualifiedApiName
                }
            });
            if (this.fieldsToCreate && this.fieldsToCreate.length > 0) {
                this.length = this.fieldsToCreate.length;
                this.style = 'color:red; display:block;'
            } else {
                this.length = 0;
                this.style = 'color:red; display:block;';
            }
        }
        if (error) {
            console.error(`Error while retreiving the Custom metadata record `, error);
        }
    }

    handleSuccess(event) {
        event.preventDefault();
        let successEvent = new ShowToastEvent({
            title: "Success!",
            message: "Record Created",
            variant: "success"
        });
        this.dispatchEvent(successEvent);
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

    handleLoad(event) {
        event.preventDefault();
        console.log('LDS Call....');
        this.areDetailsVisible = true;
        console.log(this.areDetailsVisible)
    }
}