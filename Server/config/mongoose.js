const mongoose=require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function main(){
   await mongoose.connect(process.env.DB_URL)
}

main().then(()=>{
    console.log("Database Connected");
}).catch((err)=>{
    console.log(`Error while connecting to Database : ${err}`);
})