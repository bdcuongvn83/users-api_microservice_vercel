import app from "./index.js"; // Import the app from index.js

// Listen on port set in environment variable or default to 3000
const listener = app.listen(process.env.PORT || 3001, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
