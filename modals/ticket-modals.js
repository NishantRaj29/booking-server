const mongoose =require("mongoose");



const seatSchema = mongoose.Schema({
    A:{
        type:String,
        require:true,
    },
    B:{
        type:String,
        require:true,
    },
    C:{
        type:String,
        require:true,
    },
    D:{
        type:String,
        require:true,
    },
    E:{
        type:String,
        require:true,
    },
    F:{
        type:String,
        require:true,
    },
    G:{
        type:String,
        require:true,
    },
    H:{
        type:String,
        require:true,
    },
    I:{
        type:String,
        require:true,
    },
    J:{
        type:String,
        require:true,
    },
    K:{
        type:String,
        require:true,
    },
    L:{
        type:String,
        require:true,
    },
    M:{
        type:String,
        require:true,
    },
});



const Seats = new mongoose.model("Seats",seatSchema);

module.exports = Seats;