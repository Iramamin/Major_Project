//code for connection to local host and acquiring mongo ,express etc(Basic setup).
const express = require ('express');
const app = express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
//connect to mongodb
main()
.then(()=>{
console.log("connection sucussful");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect( MONGO_URL);
}


app.listen(8080,()=>{
    console.log("server is listening on port 8080");
});

//setup view engine and middleware
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

//Basic API
app.get("/",()=>{
console.log("welcome to port");
});

//initial route
app.get("/testListing",(req,res)=>{
res.send("hi i am root");
});


//index route
app.get("/listings",async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("/listings/index.ejs",{allListings});
});


//new route
app.get("/listings/new",function (req, res) {
        res.render("listings/new.ejs");
    });

//show route 
app.get("/listings/:id", async(req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id);
  res.render("listings/show.ejs",{listing});
});


//create route
app.post("/listings",async(req,res)=>{
const newListing = new Listing(req.body.listing);
await newListing.save();
res.redirect("/listings");
});


//edit route
app.get("/listings/:id/edit", async(req,res)=>{
let {id}=req.params;
const listing=await Listing.findById(id);
res.render("listings/edit.ejs",{listing});
});

//update route
app.put("/listing/:id",async(req,res)=>{
let {id}=req.params;
await Listing.findByIdAndUpdate(id,{...req.body.listing});
res.redirect(`/listings/${id}` );

});

//delete route
app.delete("/listings/:id",async (req,res)=>{
let {id}=req.params;
let deletedListing=await Listing.findByIdAndDelete(id);
console.log(deletedListing);
res.redirect("/listings");
});

















/*/app.get("/testListing",async(req,res)=>{
    let sampleListing=new Listing({
        title:"My New Villa",
        discription:"By the Beach",
        price:1200,
        location:"Calangute,Goa",
        country:"india"
    });
    await sampleListing.save();
     console.log("sample was saved");
     res.send("successful testing");
    });/*/



