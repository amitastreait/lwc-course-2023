import LightningDatatable from 'lightning/datatable';
import imageTemplate from './templates/image.html';
import picklistTemplate from './templates/picklist.html';
import linkTemplate from './templates/link.html';
export default class ExtentedTable extends LightningDatatable {
    //Let's create the Custom Type for the different types
    static customTypes = {
        image: {  // the name of the new datatype
            template: imageTemplate, // The HTML file that will get rendered
            typeAttributes: ['height', 'width', 'alt']  // the attribute of custom data type that we have created
        },
        picklist: {
            template: picklistTemplate,
            typeAttributes: ['name', 'label', 'value', 'placeholder', 'options', 'index', 'variant']
        },
        link: {
            template: linkTemplate,
            typeAttributes: ["recordId", "recordName"]
        }
    };
}