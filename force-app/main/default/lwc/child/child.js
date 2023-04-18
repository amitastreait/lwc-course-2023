import { LightningElement } from 'lwc';

export default class Child extends LightningElement {

    handleSlotChage() {
        console.log('Named Slot Changed!');
    }

    handleSecondSlotChage() {
        console.log('Named Second Slot Changed!');
    }

}