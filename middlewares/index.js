import userDao from '../dao/userDao.js';

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    userDao
      .selectUser({ id: req.user.id })
      .then((user) => {
        if (roles.includes(user.role)) {
          return next();
        } else {
          res.status(403).json({ message: 'Access Denied' });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  };
};

export { isAuthenticated, authorizeRole };
