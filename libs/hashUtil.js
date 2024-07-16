import crypto from 'crypto';

const iterations = 1004; // 반복 횟수 설정

const hashUtil = {
  // hash함수 생성
  makeHashPassword(password) {
    return new Promise((resolve, reject) => {
      if(!password) {
        reject(new Error('비밀번호가 일치하지 않습니다. 다시 확인해주세요.'));
      }

      // 1. salt 생성
      const salt = crypto.randomBytes(64).toString('base64');

      // 2. hash 생성
      crypto.pbkdf2(password, salt, iterations, 64, 'sha256', (err, deriivedKey) => {
        if(err) {
          throw err;
        }
        const hash = deriivedKey.toString('hex');

        // 3. 최종 패스워드 
        const encryptedPassword = `${salt}.${hash}`;

        resolve(encryptedPassword);
      });
    });
  },
  // 비밀번호 확인
  checkPasswordHash(password, encryptedPassword) {
    console.log("🚀 ~ checkPasswordHash ~ password, encryptedPassword:", password, encryptedPassword)
    
    return new Promise((resolve, reject) => {
      if (!password || !encryptedPassword) {
        reject(new Error('Not allowed null (password)'));
      }

      // 1. salt와 hash 분리
      const encryptedPasswordSplit = encryptedPassword.split('.');
      const salt = encryptedPasswordSplit[0];
      const encryptedHash = encryptedPasswordSplit[1];

      // 2. 입력된 password로부터 hash생성
      crypto.pbkdf2(password, salt, iterations, 64, 'sha256', (err, derivedKey) => {
        if (err) throw err;

        const hash = derivedKey.toString('hex');
        
        console.log("🚀 ~ crypto.pbkdf2 ~ hash === encryptedHash:", hash === encryptedHash)
        // 입력된 password와 암호화된 password를 비교한다.
        if (hash === encryptedHash) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },
};

export default hashUtil;