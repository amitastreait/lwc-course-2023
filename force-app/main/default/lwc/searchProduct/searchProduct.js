import { api } from 'lwc';
import LightningModal from 'lightning/modal';
export default class SearchProduct extends LightningModal {
    @api content;

    handleCancel() {
        this.close('cancel');
    }

    handleClick() {
        this.close('okay');
    }
}