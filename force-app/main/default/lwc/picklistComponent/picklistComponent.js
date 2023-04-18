import { api, LightningElement, wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
export default class PicklistComponent extends LightningElement {

    @api fieldApiName='Account.Type';
    @api required;
    @api label = 'Type';
    @api value;

    rendered= false;

    __errors;
    __options = [];

    
    renderedCallback(){
        if(this.rendered){
            return;
        }
        this.rendered = true;
        if( this.required ) {
            let textArea = this.template.querySelector('lightning-combobox');
            textArea.required = true;
        }
    }

    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: '$fieldApiName' })
    wiredValues(result){
        if(result.data){
            window.console.log('Picklist data \n ', result.data);
            this.__options = result.data.values;
        }else if(result.error){
            let message = 'Unknown error';
            if (Array.isArray(error.body)) {
                message = error.body.map(e => e.message).join(', ');
            } else if (typeof error.body.message === 'string') {
                message = error.body.message;
            }
            this.__errors = message;
            window.console.error({
                title : 'Error ',
                data : this.__errors
            });
        }
    }

    get options(){
        let choices = this.__options.map(item => {
            return {
                label : item.label,
                value : item.value
            };
        });
        window.console.log('choices ', choices);
        return choices;
    }

    handleChange = event => {
        event.preventDefault();
        const changeEvent = new CustomEvent('change', {
            detail: {
                value : event.target.value
            }
        });
        this.dispatchEvent(changeEvent);
    }
}