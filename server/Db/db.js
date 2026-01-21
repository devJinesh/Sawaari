const mongoose = require("mongoose");

function connectDb() {
  // Set 'strictQuery' before calling connect
  mongoose.set('strictQuery', false);  // Or true to suppress warning
  
  mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  const connection = mongoose.connection;

  connection.on("connected", () => {
    console.log("Connection successful");
  });

  connection.on("error", (err) => {
    console.error("Connection failed", err);
  });

  connection.on("disconnected", () => {
    console.log("Disconnected from the database");
  });

  // Gracefully handle process termination to close MongoDB connection
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed due to app termination");
    process.exit(0);
  });
}

connectDb();
module.exports = mongoose;
