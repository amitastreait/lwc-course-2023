import { api, LightningElement } from 'lwc';

export default class TargetComponent extends LightningElement {
    @api codeValue;
    @api codeText;
}