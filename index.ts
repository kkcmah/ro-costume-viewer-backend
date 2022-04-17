import config from "./src/utils/config";
import app from "./src/app";

const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
console.log(`environment is ${process.env.NODE_ENV}`);
