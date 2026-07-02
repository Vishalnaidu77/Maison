import app from "./src/app.js";
import { config } from "./src/config/config.js";
import { connectDB } from "./src/config/database.js";

const PORT = config.PORT || 5000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    })
    .catch((err) => {
        console.log(`Error starting server: ${err}`);
    })
