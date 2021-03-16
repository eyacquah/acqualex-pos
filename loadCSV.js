const fs = require("fs");
const csv = require("csv-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Product = require("./models/productModel");
const Order = require("./models/orderModel");
const Branch = require("./models/branchModel");

dotenv.config({ path: "./config.env" });

async function deleteData() {
  try {
    console.log("Deleting data..");
    await Product.deleteMany();
    // await Branch.deleteMany();
    // await Order.deleteMany();

    console.log("Data successfuly deleted");
  } catch (err) {
    console.log(err);
  }
  process.exit();
}

const connectDb = async () => {
  try {
    const DB = process.env.DATABASE.replace(
      "<PASSWORD>",
      process.env.DATABASE_PASSWORD
    );

    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log("DB Connection successful");
  } catch (err) {
    console.log(err);
  }
};

const allData = [];

fs.createReadStream("data.csv")
  .pipe(csv())
  .on("data", (row) => {
    const data = {};
    data.title = row.item;
    data.price = +row.price;

    // Glass
    data.category = "6040bc0054c2322cf03b9a13";
    data.stockQuantity = 100;
    allData.push(data);
  })
  .on("end", async () => {
    try {
      console.log("Connecting DB");
      await connectDb();
      console.log("Loading data..");
      await Product.create(allData);
      //   await deleteData();
      console.log("Data loaded successfully");
    } catch (err) {
      console.log(err);
    }
    process.exit();
  });

// const importData = async () => {
//   try {
//     console.log("Reading File..");
//     readCSV();

//     console.log("Loading data..");
//     await Product.create(allData);
//     console.log("Data loaded successfully");
//   } catch (err) {
//     console.log(err);
//   }
//   process.exit();
// };

// connectDb();
// importData();
// if (process.argv[2] === "--import") {
//   connectDb();
//   importData();
// } else if (process.argv[2] === "--delete") {
//   deleteData();
// }
