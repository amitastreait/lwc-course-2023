/* c/myApp.js */
import { LightningElement } from 'lwc';
import MyModal from 'c/myModal';
import imageTemplate from './templates/image.html'
export default class MyApp extends LightningElement {

    result;
    handleSelectEvent(detail) {
        const { id, value } = detail;
        console.log(`select event fired elem with id ${id} and value: ${value}`);
        this.result = `select event fired elem with id ${id} and value: ${value}`;
    }

    async handleClick() {
        const result = await MyModal.open({
            label: 'Update Contact',
            size: 'large',
            description: 'Accessible description of modal\'s purpose',
            content: imageTemplate,
            options: [
                { id: 1, label: 'Option 1' },
                { id: 2, label: 'Option 2' },
            ],
            onselect: (e) => {
                e.stopPropagation();
                this.handleSelectEvent(e.detail);
            }
        });
        // if modal closed with X button, promise returns result = 'undefined'
        // if modal closed with OK button, promise returns result = 'okay'
        console.log(result);
    }

    handleCloseClick() {
        this.close('canceled');
    }

    closeModal() {
        this.close('success');
    }

}