import "dotenv/config";
import { connectDatabase } from "./config/database.js";
import { bootstrap } from "./bootstrap.js";

const port = Number(process.env.PORT) || 8080;

async function start() {
  await connectDatabase();
  const { app } = bootstrap();
  app.listen(port, () => {
    console.log(`Express en http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error("Error al iniciar:", err);
  process.exit(1);
});