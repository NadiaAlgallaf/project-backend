import app from "./app.js";
import connectToDB from "./config/db.js";

async function startServer() {
  const PORT = process.env.PORT || 3000;

  await connectToDB();

  app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
  });
}

startServer();