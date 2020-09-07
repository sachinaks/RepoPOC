import {LightningElement, track, api, wire } from 'lwc';


const actions = [
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' },
];

const columns = [
    { label: 'Name', fieldName: 'name' },
    { label: 'Created Date', fieldName: 'createddate', type: 'date' },
    { label: 'Last Modified Date', fieldName: 'lastmodifieddate', type: 'date' },
    
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];

export default class ConcatenateFirstNameLastName extends LightningElement {
    @track firstName;
    @track lastName;
    @track fullName;
    @api  objectname;
    @track objdata = [];
    data = [];
    columns = columns;
    record = {};



  //  async connectedCallback() {
     //   this.data = await fetchDataHelper({ amountOfRecords: 100 });
   // }
  



    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'delete':
                this.deleteRow(row);
                break;
            case 'edit':
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
        this.record = row;
    }

    

    handleClick(){
        this.fullName = this.firstName + ' ' + this.lastName;
    }
    

    handleFNameChange(event){
        this.firstName = event.target.value;
       
     }

     handleLNameChange(event){
        this.lastName = event.target.value;
        console.log(this.lastName);
        // committed from sachin-dev
     }

}