const bcrypt = require('bcrypt');

// Function to verify a password
async function verifyPassword(plainPassword, hashedPassword) {
    try {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        if (isMatch) {
            console.log('Password is correct!');
        } else {
            console.log('Password is incorrect!');
        }
    } catch (error) {
        console.error('Error verifying password:', error);
    }
}

// Example usage
const hashedPassword = "$2b$10$VmnP/zGlZETWwwptSbgGtuzjdxCNDFou7BfepzwU6/74H8.15TZkK"; // Replace with actual hashed password
const inputPassword = "admin123"; // Replace with actual user input

verifyPassword(inputPassword, hashedPassword);
