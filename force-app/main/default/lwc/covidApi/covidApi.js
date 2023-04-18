import { LightningElement } from 'lwc';

export default class CovidApi extends LightningElement {

    primaryData;

    async handleCovidCase(event) {
        fetch('https://api.covid19india.org/states_daily.json')
        .then(response => response.json())
        .then(data => {
            this.primaryData = data;
            window.console.log( this.primaryData );
        });
    }

}