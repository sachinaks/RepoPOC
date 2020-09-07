import { LightningElement, api, track, wire } from 'lwc';
import getObjectList from '@salesforce/apex/DynamicDataTable.getObjectList';
import fetchAccounts from '@salesforce/apex/DynamicDataTable.fetchAccounts'; 
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {refreshApex} from '@salesforce/apex';

const columns = [  
    { label: 'Id', fieldName: 'Id' },  
    { label: 'Name', fieldName: 'Name' },  
    {type: "button", typeAttributes: {  
        label: 'Show details',  
        name: 'show_details',  
        title: 'View',  
        disabled: false,  
        value: 'view',  
        iconPosition: 'left'  
    }},  
    {type: "button", typeAttributes: {  
        label: 'Edit',  
        name: 'edit',  
        title: 'Edit',  
        disabled: false,  
        value: 'edit',  
        iconPosition: 'left'  
    }}  
];  
export default class DatatableObjectFields extends LightningElement {
    @track objdata = [];
    @track  objectname;
    @track recorddata = [];
    @track accounts;  
    @track error;  
    @track columns = columns;  
    @track bShowModal = false;
    @track currentRecordId;
    @track isEditForm = false;
    @track showLoadingSpinner = false;
    _objectRecordResult;


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
        
      } else if (error) {
         // this.error = error;
          this.objdata = [];
      }

}


handleObjectChange( event ) {  
   const searchKey = event.target.value;  

    
    if ( searchKey ) {  
        this.objectname = searchKey;
        fetchAccounts( { searchKey } )    
        .then(result => {  
            this._objectRecordResult = result;
            this.accounts = result;  
            if(this.accounts.length  == 0){
               // alert('hello');
                console.log('blank data returned');
                this.showInfoToast('Blank data returned','No Record exists','info', 'dismissable');
            }

        })  
        .catch(error => {  
            console.log('error, no record exists');
            //alert('hello');
            this.showInfoToast('Toast Info',error.message,'info','dismissable');
            this.error = error;  
            
        });  

    } else  
    this.accounts = [];  

}      
  
callRowAction( event ) {  
      
    const recId =  event.detail.row.Id;  
    const actionName = event.detail.action.name;  
    if ( actionName === 'Edit' ) {  

        this[NavigationMixin.Navigate]({  
            type: 'standard__recordPage',  
            attributes: {  
                recordId: recId,  
                objectApiName: 'Account',  
                actionName: 'edit'  
            }  
        })  

    } else if ( actionName === 'View') {  

        this[NavigationMixin.Navigate]({  
            type: 'standard__recordPage',  
            attributes: {  
                recordId: recId,  
                objectApiName: 'Account',  
                actionName: 'view'  
            }  
        })  

    }          

}  

showInfoToast(strTitle, strMessage, strVariant, strMode) {
    const evt = new ShowToastEvent({
        title: strTitle,
        message: strMessage,
        variant: strVariant,
        mode: strMode
    });
    this.dispatchEvent(evt);
}


handleRowAction(event) {
    const actionName = event.detail.action.name;
    const row = event.detail.row;
    switch (actionName) {
        case 'edit':
            this.editCurrentRecord(row);
            break;
        case 'show_details':
            this.showRowDetails(row);
            break;
        default:
    }
}

deleteRow(row) {
    const { id } = row;
    const index = this.findRowIndexById(id);
    if (index !== -1) {
        this.data = this.data
            .slice(0, index)
            .concat(this.data.slice(index + 1));
    }
}

findRowIndexById(id) {
    let ret = -1;
    this.data.some((row, index) => {
        if (row.id === id) {
            ret = index;
            return true;
        }
        return false;
    });
    return ret;
}

showRowDetails(row) {
    this.bShowModal = true;
    this.isEditForm = false;
    this.record = row;
}

closeModal() {
    this.bShowModal = false;
}

editCurrentRecord(currentRow) {
    // open modal box
    this.bShowModal = true;
    this.isEditForm = true;

    // assign record id to the record edit form
    this.currentRecordId = currentRow.Id;
}

// handleing record edit form submit
handleSubmit(event) {
    // prevending default type sumbit of record edit form
    event.preventDefault();
    let strObjName = this.objectname;
    // querying the record edit form and submiting fields to form
    this.template.querySelector('lightning-record-edit-form').submit(event.detail.fields);

    // closing modal
    this.bShowModal = false;

    // showing success message
    this.dispatchEvent(new ShowToastEvent({
        title: 'Success!!',
        message: event.detail.fields.Name + ' ' + strObjName + '  updated Successfully!!.',
        variant: 'success'
    }),); 
  
   

}

 // refreshing the datatable after record edit form success
 handleSuccess() {
   // return refreshApex(this.accounts);
   console.log('data refresh function called in success');
   console.log('object name success :: ' + this.objectname);
   let searchKey1 =  this.objectname;  
   if ( searchKey1 ) {  
    console.log('object name inside if searchKey1:: ' + searchKey1);
      // this.objectname = searchKey1;
       fetchAccounts( {searchKey : searchKey1} )    
       .then(result => {  

           this.accounts = JSON.parse(JSON.stringify(result));
           
           if(this.accounts.length  == 0){
              // alert('hello');
               console.log('blank data returned');
               this.showInfoToast('Blank data returned','No Record exists','info', 'dismissable');
           }

       })  
       .catch(error => {  
           console.log('error, no record exists');
           //alert('hello');
           this.showInfoToast('Error','Error','warning','dismissable');
           this.error = error;  
           
       });  

   } else  
   this.accounts = [];  
    
  
   
}

get getAccounts(){
    return this.accounts;
}

get getAccountsStr(){
    return JSON.stringify(this.accounts);
}


}