const mongoose  = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");




//database connection 
main().then(()=>{
    console.log("connect to databse");
}).catch((err)=>  {
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner: "66c7613fd9307b4c543a79e9"}));
    await Listing.insertMany(initData.data);
    console.log("data was initiazed");
};

initDB();