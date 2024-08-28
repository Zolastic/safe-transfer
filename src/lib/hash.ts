import bcrypt from "bcrypt";

export default class Hash {
  saltRounds = 10;

  async generateSalt(): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(this.saltRounds, (err, salt) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        resolve(salt);
      });
    });
  }

  async hash(plaintext: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(plaintext, this.saltRounds, (err, hash) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        resolve(hash);
      });
    });
  }

  async compare(plaintext: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(plaintext, hash, (err, result) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        resolve(result);
      });
    });
  }
}
