import { LightningElement } from 'lwc';

export default class GetterSetterDemo extends LightningElement {

    upperCaseItem = 'Inital Text';

    get itemName(){
        alert('Called ');
        return this.upperCaseItem;
    }

    set itemName(value){
        this.upperCaseItem = value.toUpperCase();
    }

    handleClick() {
        this.itemName = 'After Click';
    }

    connectedCallback(){
        window.console.log('hello connectedCallback');
    }
    disconnectedCallback(){
        window.console.log('hello disconnectedCallback');
    }
}