/**
 * @description       : 
 * @author            : Amit Singh
 * @group             : 
 * @last modified on  : 01-03-2023
 * @last modified by  : Amit Singh
**/
import { LightningElement } from 'lwc';
import tailwind from '@salesforce/resourceUrl/tailwind';
import { loadStyle } from 'lightning/platformResourceLoader';
export default class Config extends LightningElement {

    connectedCallback() {
        Promise.all([
            loadStyle(this, tailwind)
        ]).then(() => {
            console.log(' resource loaded ');
        })
        .catch( (error) =>{
            console.log(' Error => ', error );
        });
    }
}