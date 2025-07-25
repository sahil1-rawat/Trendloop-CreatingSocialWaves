import jwt from 'jsonwebtoken';
const generateToken = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: '15d',
  });
  res.cookie('token', token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'none',
    secure:true
  });
  return token;
};

export default generateToken;
