import sequelize from './connection.js';
import User from './user.js';
import Factory from './factory.js';
import UserFactory from './userFactory.js';
import Line from './line.js';
import UserLinePermission from './userLinePermission.js';
import LoginLog from './loginLog.js';

const db = {};

db.sequelize = sequelize;

db.User = User;
db.Factory = Factory;
db.UserFactory = UserFactory; // UserFactory 추가
db.Line = Line;
db.UserLinePermission = UserLinePermission;
db.LoginLog = LoginLog;

User.init(sequelize);
Factory.init(sequelize);
UserFactory.init(sequelize);
Line.init(sequelize);
UserLinePermission.init(sequelize);
LoginLog.init(sequelize);

User.associate(db);
Factory.associate(db);
Line.associate(db);
LoginLog.associate(db);
// UserLinePermission.associate(db);

export default db;
