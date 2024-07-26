import sequelize from './connection.js';
import User from './user.js';
import Factory from './factory.js';
import Line from './line.js';
import UserFactory from './userFactory.js';
import UserLinePermission from './userLinePermission.js';

const db = {};

db.sequelize = sequelize;

db.User = User;
db.Factory = Factory;
db.Line = Line;
db.UserFactory = UserFactory;
db.UserLinePermission = UserLinePermission;

User.init(sequelize);
Factory.init(sequelize);
Line.init(sequelize);
UserFactory.init(sequelize);
UserLinePermission.init(sequelize);

User.associate(db);
Factory.associate(db);
Line.associate(db);

export default db;
