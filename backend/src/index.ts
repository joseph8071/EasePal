import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";

//connections and listeners
const PORT = process.env.PORT || 3000;
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => console.log("Server Running and connected to DB"));
  })
  .catch((error) => console.log(error));
