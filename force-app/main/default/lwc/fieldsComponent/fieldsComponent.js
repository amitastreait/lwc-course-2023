import { api, LightningElement } from 'lwc';

export default class FieldsComponent extends LightningElement {
    @api options;
    _selected = [];
    
    get selected() {
        return this._selected.length ? this._selected : 'none';
    }

    handleChange(event) {
        this._selected = event.detail.value;
    }

    handleSave = event => {
        event.preventDefault();
        const eventFields = new CustomEvent('fields', {
            detail: {
                fields : this._selected
            }
        });
        this.dispatchEvent(eventFields);
    }

    handleCancel = event => {
        event.preventDefault();
        const eventCancel = new CustomEvent('cancel', {
            detail: {}
        });
        this.dispatchEvent(eventCancel);
    }

}