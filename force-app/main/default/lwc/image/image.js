import { LightningElement, api } from 'lwc';

export default class Image extends LightningElement {
    @api imageUrl;
    @api height;
    @api width;
    @api alt;
}