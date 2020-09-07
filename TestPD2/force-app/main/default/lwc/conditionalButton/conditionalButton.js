//conditionalButton.js
import { LightningElement, track } from 'lwc';
export default class ConditionalButton extends LightningElement {
    @track show = true;
    handleClick(){
        this.show = !this.show;
    }
}