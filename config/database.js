// config/database.js
// Mock Database Connection
// In a real app, you would connect to MongoDB or SQL here.

module.exports = {
    connect: () => {
        console.log("Mock Database Connected...");
    }
};
