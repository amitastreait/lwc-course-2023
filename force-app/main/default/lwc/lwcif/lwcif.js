import { LightningElement } from 'lwc';
export default class Lwcif extends LightningElement {
    showCat = true;
    showRat = true;
    handleRatClick() {
        this.showRat = true;
        this.showCat = false;
    }
    handleCatClick() {
        this.showRat = false;
        this.showCat = true;
    }
    handleDogClick() {
        this.showRat = false;
        this.showCat = false;
    }
}