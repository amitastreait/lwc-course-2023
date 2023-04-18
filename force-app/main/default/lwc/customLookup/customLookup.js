import { LightningElement, track, api } from 'lwc';
import findRecords from '@salesforce/apex/CustomLookupController.findRecords';
export default class CustomLookup extends LightningElement {
    @track records;
    @track error;
    @track selectedRecord;
    @api index;
    @api relationshipfield;
    @api iconname = "standard:account";
    @api objectName = 'Account';
    @api searchfield = 'Name';
    @api showLabel = false;
    iconUrl;

    ICON_URL = '/apexpages/slds/latest/assets/icons/{0}-sprite/svg/symbols.svg#{1}';

    connectedCallback() {
        this.iconUrl = '';
        let icons = this.iconname.split(':');
        this.iconUrl = this.ICON_URL.replace('{0}', icons[0]);
        this.iconUrl = this.iconUrl.replace('{1}', icons[1]);
        console.log(this.iconUrl);
    }

    handleOnchange(event) {
        //event.preventDefault();
        const searchKey = event.detail.value;
        findRecords({
            searchKey: searchKey,
            objectName: this.objectName,
            searchField: this.searchfield
        })
            .then(result => {
                this.records = result;
                for (let i = 0; i < this.records.length; i++) {
                    const rec = this.records[i];
                    this.records[i].Name = rec[this.searchfield];
                }
                this.error = undefined;
                //console.log(' records ', this.records);
            })
            .catch(error => {
                this.error = error;
                this.records = undefined;
            });
    }
    handleSelect(event) {
        const selectedRecordId = event.detail;
        /* eslint-disable no-console*/
        this.selectedRecord = this.records.find(record => record.Id === selectedRecordId);
        /* fire the event with the value of RecordId for the Selected RecordId */
        const selectedRecordEvent = new CustomEvent(
            "selectedrec",
            {
                //detail : selectedRecordId
                detail: { recordId: selectedRecordId, index: this.index, relationshipfield: this.relationshipfield }
            }
        );
        this.dispatchEvent(selectedRecordEvent);
    }

    handleRemove(event) {
        event.preventDefault();
        this.selectedRecord = undefined;
        this.records = undefined;
        this.error = undefined;
        /* fire the event with the value of undefined for the Selected RecordId */
        const selectedRecordEvent = new CustomEvent(
            "selectedrec",
            {
                detail: { recordId: undefined, index: this.index, relationshipfield: this.relationshipfield }
            }
        );
        this.dispatchEvent(selectedRecordEvent);
    }


}