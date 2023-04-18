/* c/myModal.js */
import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class MyModal extends LightningModal {

    @api content;
    @api options = [];

    handleOkay() {
        this.close('okay');
    }

    handleDismiss() {
        this.close('cancel');
    }

    handleOptionClick(e) {
        const { target } = e;
        const { id } = target.dataset;
        // this.close() triggers closing the modal
        // the value of `id` is passed as the result
        const event = new CustomEvent('select', {
            detail: {
                id: id,
                value: 'amit'
            }
        });
        this.dispatchEvent(event);
        this.close(id);
    }
}