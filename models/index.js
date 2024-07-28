import sequelize from './connection.js';
import User from './user.js';
import Factory from './factory.js';
import UserFactory from './userFactory.js';
import Line from './line.js';
import UserLinePermission from './userLinePermission.js';

const db = {};

db.sequelize = sequelize;

db.User = User;
db.Factory = Factory;
db.UserFactory = UserFactory; // UserFactory 추가

User.init(sequelize);
Factory.init(sequelize);
UserFactory.init(sequelize);

User.associate(db);
Factory.associate(db);

export default db;
