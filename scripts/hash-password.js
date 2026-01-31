const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
  console.log("Usage: node hash-password.js <password>");
  process.exit(1);
}

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("Hashed Password:");
  console.log(hash);
});
