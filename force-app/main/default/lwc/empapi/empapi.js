import { LightningElement } from 'lwc';
import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled } from 'lightning/empApi';

export default class EmpApiLWC extends LightningElement {

    channelName = '/event/SAPAccount__e';

    subscription = {};
    responseString;

    handleChannelName(event) {
        this.channelName = event.target.value;
    }

    connectedCallback() {
        this.registerErrorListener();
    }

    disconnectedCallback() {
        this.handleUnsubscribe();
    }


    handleSubscribe() {
        subscribe(this.channelName, -1, this.subscribedata.bind(this)).then((response) => {
            // Response contains the subscription information on subscribe call
            console.log('Subscription request sent to: ', JSON.stringify(response.channel));
            this.subscription = response;
        });
    }

    subscribedata(response) {
        console.log(`Response from Event ${response}`);
        this.responseString = JSON.stringify(response);
    }

    handleUnsubscribe() {
        unsubscribe(this.subscription, (response) => {
            console.log('unsubscribe() response: ', JSON.stringify(response));
        });
    }

    registerErrorListener() {
        onError((error) => {
            console.log('Received error from server: ', JSON.stringify(error));
        });
    }
}