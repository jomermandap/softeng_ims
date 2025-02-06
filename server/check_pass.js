const bcrypt = require('bcrypt');

const hashedPassword = "$2b$10$VmnP/zGlZETWwwptSbgGtuzjdxCNDFou7BfepzwU6/74H8.15TZkK"; // Your hashed password
const plaintextPassword = "admin123"; // Replace this with the password you want to check

bcrypt.compare(plaintextPassword, hashedPassword, (err, result) => {
    if (err) {
        console.error("Error comparing passwords:", err);
    } else if (result) {
        console.log("✅ Password is correct!");
    } else {
        console.log("❌ Incorrect password.");
    }
});
