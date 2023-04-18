/*
    1. The Password must not contain any whitespaces.
    2. The Password must contain at least one Uppercase character.
    3. The Password must contain at least one Lowercase character.
    4. The Password must contain at least one digit.
    5. The Password must have at least one Special Symbol
    6. The Password must be 10-16 characters long.

    LinkedIn - https://www.linkedin.com/pulse/create-strong-password-validation-regex-javascript-mitanshu-kumar/
*/
import { LightningElement, api } from 'lwc';
const PASSWORD_REGEX = /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{10,16}$/;

export default class Password extends LightningElement {

    message = '';

    handleInputChange = (event) => {
        event.preventDefault();
        const allValid = this.isValidPassword(event.target.value);
        if (allValid) {
            console.log('Password is Valid');
        } else {
            console.log(this.message)
        }
    }

    isValidPassword = (value) => {
        this.message = '';
        const isWhitespace = /^(?=.*\s)/;
        if (isWhitespace.test(value)) {
            this.message = "Password must not contain Whitespaces.";
        }
        const isContainsUppercase = /^(?=.*[A-Z])/;
        if (!isContainsUppercase.test(value)) {
            this.message = "Password must have at least one Uppercase Character.";
        }
        const isContainsLowercase = /^(?=.*[a-z])/;
        if (!isContainsLowercase.test(value)) {
            this.message = "Password must have at least one Lowercase Character.";
        }
        const isContainsNumber = /^(?=.*[0-9])/;
        if (!isContainsNumber.test(value)) {
            this.message = "Password must contain at least one Digit.";
        }
        const isContainsSymbol = /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])/;
        if (!isContainsSymbol.test(value)) {
            this.message = "Password must contain at least one Special Symbol.";
        }
        const isValidLength = /^.{10,16}$/;
        if (!isValidLength.test(value)) {
            this.message = "Password must be 10-16 Characters Long.";
        }
        return this.message ? false : true;
    }

    @api
    validatePassword(password) {
        if (!PASSWORD_REGEX.test(password)) {
            return false;
        }
        return true;
    }
}