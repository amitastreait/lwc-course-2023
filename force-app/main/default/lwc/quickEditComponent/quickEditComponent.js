import { LightningElement, api, track, wire } from 'lwc';
import getMetadataRecords from '@salesforce/apex/MetadataRetreiver.getMetadataObjectRecords';
const DEFAULT_MESSGAE_STYLE = 'display:none; color:red;';

export default class QuickEditComponent extends LightningElement {
    @api recordId;
    @api objectApiName;
    @api placeToBeUsed;

    @track fieldsToEdit = [];
    length;
    style = DEFAULT_MESSGAE_STYLE;
    areDetailsVisible = false;

    get messageStyle() {
        return this.style;
    }

    set messageStyle(value) {
        this.style = value;
    }

    @wire(getMetadataRecords, {
        objectApiName: '$objectApiName',
        placeToBeUsed: '$placeToBeUsed',
        usedFor: 'Edit Record'
    })
    wiredMetaDataRecords({ error, data }) {
        if (data) {
            this.fieldsToEdit = data.map((field) => {
                return {
                    objectApiName: field.ObjectAPIName__r.QualifiedApiName,
                    fieldApiName: field.FieldAPIName__r.QualifiedApiName
                }
            });
            if (this.fieldsToEdit && this.fieldsToEdit.length > 0) {
                this.length = 1;
                this.style = DEFAULT_MESSGAE_STYLE;
            } else {
                this.length = 0;
                this.style = 'display:block; color:red;';
            }
        }
        if (error) {
            console.error(`Error while retreiving the Custom metadata record `, error);
        }
    }

    handleSuccess(event) {
        event.preventDefault();
        this.dispatchEvent(new CustomEvent('success'));
    }

    handleError(event) {
        event.preventDefault();
        this.dispatchEvent(new CustomEvent('error', {
            detail: {
                errorDetails: event.detail
            }
        }));
    }

    handleCancel() {
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    handleLoad(event) {
        event.preventDefault();
        this.areDetailsVisible = true;
    }

}