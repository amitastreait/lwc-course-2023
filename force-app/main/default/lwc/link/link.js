import { LightningElement, api } from 'lwc';

export default class Link extends LightningElement {

    @api value;
    @api recordId;
    @api recordName;

    handleClick(event) {
        event.preventDefault();
        const selectEvent = new CustomEvent('linkclick', {
            detail: {
                value: this.value,
                recordId: this.recordId,
                recordName: this.recordName
            },
            cancelable: true,
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(selectEvent);
    }
}