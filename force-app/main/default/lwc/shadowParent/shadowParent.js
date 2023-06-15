import { LightningElement } from 'lwc';

export default class ShadowParent extends LightningElement {

    handleClick(){
        let childComponent = this.template.querySelector('c-shadow-child');
        console.log(' childComponent ', childComponent);

        let divInsideChild = this.template.querySelector('.child-container');
        console.log(' divInsideChild ', divInsideChild);
    }
}