import { bootstrap } from "./bootstrap.js";

const port = Number(process.env.PORT) || 8080;
const { app } = bootstrap();

app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});
