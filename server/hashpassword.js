const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(`Hashed Password: ${hashedPassword}`);
};

hashPassword('admin123'); // Replace 'admin123' with your desired password
