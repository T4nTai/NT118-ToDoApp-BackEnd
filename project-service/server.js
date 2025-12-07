import app from "./src/app.js";
import { sequelize } from "./src/config/db.js";
import { PORT } from "./src/config/env.js";
import initAssociations  from "./src/models/association.model.js";

async function start() {
  try {
    await sequelize.authenticate();
    console.log("Connected to Project DB")
    initAssociations();
    app.listen(PORT, () => {
      console.log(`🚀 Project-Service running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Project-Service error:", err);
  }
}

start();