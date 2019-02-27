import mongoose, {Schema} from 'mongoose';


const Base = {

    addedDate: {type: Date, required: false, default: new Date().getTime()},
    modifiedDate: {type: Date, required: false},
    addedBy: {type: Number, required: false},
    modifiedBy: {type: Number, required: false},
    deleted: {type: Boolean, required: true, default: false},
    deletedBy: {type: Date, required: false},
};

function setAddedDate(){

    Base.addedDate = new Date();
}

function setUpdatedDate(){
    // let base = this;
    Base.modifiedDate = new Date();
}

module.exports = {Base,setAddedDate,setUpdatedDate};
