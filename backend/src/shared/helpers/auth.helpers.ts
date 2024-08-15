import bcrypt from 'bcrypt';

const hash = (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) reject(err);
      resolve(hashedPassword);
    });
  });
};

export const AuthHelpers = {
  hash,
};
