const bcyrpt = require('bcryptjs');

const hashPassword = (password) => {
  return bcyrpt.hashSync(password);
};

const comparePassword = (password, hashed) => {
  return bcyrpt.compareSync(password, hashed);
};

module.exports = {
  hashPassword,
  comparePassword,
};
