import sequelize from "./connection.js";
import User from "./user.js";

const db = {}

db.sequelize = sequelize;

db.User = User;

User.init(sequelize);

export default db;