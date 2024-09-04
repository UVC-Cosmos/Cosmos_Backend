import userDao from '../dao/userDao.js';

export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    return next();
  }
  res.status(403).json({
    message:
      'Admin 계정이 아닙니다. Admin 권한을 갖고 있는 계정으로 접속해주세요.',
  });
};

export const isFactoryAdmin = (req, res, next) => {
  const user = req.user;
  if (user) {
    const factoryAdminRoles = [
      'A-factoryAdmin',
      'B-factoryAdmin',
      'C-factoryAdmin',
    ];

    if (factoryAdminRoles.includes(user.role)) {
      const factoryId = req.params.factoryId;

      if (
        (user.role === 'A-factoryAdmin' && factoryId === '1') ||
        (user.role === 'B-factoryAdmin' && factoryId === '2') ||
        (user.role === 'C-factoryAdmin' && factoryId === '3')
      ) {
        return next();
      } else {
        return res.status(403).json({ message: '공장 Admin이 아닙니다.' });
      }
    }
  }

  res.status(403).json({ message: '공장 Admin이 아닙니다.' });
};
