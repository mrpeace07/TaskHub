const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const getdate = require("./date.js");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

//github al akbekar use agate env
mongoose.connect(process.env.MONGO_URI);

const Item = mongoose.model("Item", { name: String });

const defaultItems = [
  { name: "Track Your Records" },
  { name: "Hit the + button to add a new item" },
  { name: "<-- Hit this to remove the item" },
];

app.get("/", async(req,res) =>{
  res.send("deployed");
})

app.get("/items", async (req, res) => { // first retrive madutte data na and then check madudte yavdar data idiya anta and then ila andre default items na add madutte and response ali jsone file na kaslutte
  try {
    let items = await Item.find({});
    if (items.length === 0) {
      items = await Item.insertMany(defaultItems);
    }
    res.json({ title: getdate(), items });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/add", async (req, res) => {
  try {
    const item = new Item({ name: req.body.name });
    await item.save();
    res.status(200).send("Item added");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/delete", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.body.id);
    res.status(200).send("Item deleted");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3003, () => {
  console.log("Server started on port 3003");
});
