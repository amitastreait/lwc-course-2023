import { LightningElement, api } from 'lwc';

export default class Combobox extends LightningElement {
    @api name;
    @api label;
    @api value;
    @api placeholder;
    @api options;
    @api index;
    @api variant;

    handleChange(event) {
        event.preventDefault();
        let value = event.target.value;
        const picklist = new CustomEvent('select', {
            detail: {
                value: value,
                index: this.index
            },
            bubbles: true,
            composed: true,
            cancelable: true
        });
        this.dispatchEvent(picklist);
    }

}