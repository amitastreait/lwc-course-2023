import LightningDatatable from 'lightning/datatable';

import imageTemplate from './templates/image.html'
import picklistTemplate from './templates/picklist.html';
import lookupTemplate from './templates/lookup.html';
import linkTemplate from './templates/link.html';

export default class Ltngdatatable extends LightningDatatable {

    static customTypes = {
        image: {  // the name of the new datatype
            template: imageTemplate, // The HTML file that will get rendered
            typeAttributes: ['height', 'width', 'alt']  // the attribute of the custom data type that we have created
            // value - imageUrl
        },
        picklist: {
            template: picklistTemplate,
            typeAttributes: ['name', 'label', 'placeholder', 'options', 'index', 'variant']
        },
        lookup: {
            template: lookupTemplate,
            typeAttributes: ["recordId", "recordName", "objectName", "iconName", "label", "placeholder", "fields", 'displayFields', 'parentApiName', 'index']
        },
        link: {
            template: linkTemplate,
            typeAttributes: ['recordId', 'recordName']
        },
    };

    handleChange(event) {
        event.preventDefault();
        let selectEvent = new CustomEvent('select', {
            detail: {
                value: event.target.value
            },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(selectEvent);
    }
}