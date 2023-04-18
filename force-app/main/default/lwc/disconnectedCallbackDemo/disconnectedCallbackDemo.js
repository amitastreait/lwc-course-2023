import { LightningElement } from 'lwc';

export default class DisconnectedCallbackDemo extends LightningElement {
    showHide = true;

    handleClick(){
        this.showHide = this.showHide?false:true;
    }
}