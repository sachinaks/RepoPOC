import { LightningElement, wire, track } from 'lwc';
import getObjectList from '@salesforce/apex/DynamicDataTable.getObjectList';

export default class DynamicDataTable extends LightningElement {
   @track accounts = [];
   @track objdata = [];
  //  error;

  @wire(getObjectList)
  wiredObjects({ error, data }) {
      if (data) {
          console.log('data',data)
          

          this.objdata = data.map(item => { 
             const container = {};
             container.label = item;
             container.value = item;
             return container;

          }).sort(function(a, b) {
            var nameA = a.label.toUpperCase(); // ignore upper and lowercase
            var nameB = b.label.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
          
            // names must be equal
            return 0;
          });
         // console.log(objects);
         // this.objdata = objects;
         // console.log(JSON.stringify(objects));
          
          //this.error = undefined;
      } else if (error) {
         // this.error = error;
          this.objdata = [];
      }

      
  }

  
  /**
   * test description added by milanjeet Singh
   * @param {*} event
  */
  handleChange(event) {
    this.value = event.detail.value;
  }
}