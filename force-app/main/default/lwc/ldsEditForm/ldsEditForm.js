import { LightningElement, api, track, wire } from 'lwc';
import NAME_FIELD from '@salesforce/schema/Contact.Name';
import getMetadataRecord from '@salesforce/apex/MetadataRetreiver.getMetadataObjectRecords';
export default class LdsEditForm extends LightningElement {
    fields = [NAME_FIELD, {
        objectApiName: 'Contact',
        fieldApiName: 'Email'
    }];
    // Flexipage provides recordId and objectApiName
    @api recordId;
    @api objectApiName;

    @api objectName = 'Case';
    @api placeToBeUsed = 'Case Record Page';

    @track fieldsToCreate = [
        { objectApiName: 'Case', fieldApiName: 'Subject' },
        { objectApiName: 'Case', fieldApiName: 'Status' },
        { objectApiName: 'Case', fieldApiName: 'Description' }
    ];

    connectedCallback() {

        console.log(`${this.objectName}`);
        console.log(`${this.placeToBeUsed}`);

    }

    @wire(getMetadataRecord, {
        objectApiName: '$objectName',
        placeToBeUsed: '$placeToBeUsed'
    })
    wiredFieldData({ error, data }) {
        if (data) {
            this.fieldsToCreate = data.map(field => {
                return {
                    objectApiName: field.ObjectAPIName__r.QualifiedApiName,
                    fieldApiName: field.FieldAPIName__r.QualifiedApiName
                };
            });
            console.log('this.fieldsToCreate ', JSON.stringify(this.fieldsToCreate));
        }
        if (error) {
            console.error('Error while fetching the metadata record .. ', error);
        }
    }

    handleSuccess(event) {
        console.log('Success ', JSON.stringify(event.detail));
        this.dispatchEvent(new ShowToastEvent({
            title: 'Success!',
            message: 'Record is created!.',
            variant: 'success'
        }));
    }

    handleError(event) {
        console.log('Error ', JSON.stringify(event.detail));
        this.dispatchEvent(new ShowToastEvent({
            title: `${event.detail.message}`,
            message: `${event.detail.detail}`,
            variant: 'error'
        }));
    }

    handleOnLoad(event) {
        let record = event.detail.records;
        console.log(JSON.stringify(event.detail));
    }
}