import { api, LightningElement } from 'lwc';

export default class PasswordComponent extends LightningElement {
    
    alternativeText = 'Show';
    showPassword=false;
    
    togglePassword(){
        let passwordInput = this.template.querySelector('[data-id="password"]');
        if(passwordInput && passwordInput.type === 'password'){
            passwordInput.type = 'text';
            this.showPassword = true;
            this.alternativeText = 'Hide';
        }else if(passwordInput && passwordInput.type === 'text'){
            passwordInput.type = 'password';
            this.alternativeText = 'Show';
            this.showPassword = false;
        }
    }

    handleChange(event){
        event.preventDefault();
        const passwordEvent = new CustomEvent('passwordChange', {
            detail: {
                password : event.target.value
            }
        });
        this.dispatchEvent(passwordEvent);
    }
}