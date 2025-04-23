import jwt from 'jsonwebtoken';
export const verifyToken = (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token && req.cookies?.access_token) {
    token = req.cookies.access_token;
  }

  if (!token) return res.status(401).json('You are not authenticated!');

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("JWT verify error:", err); 
      return res.status(403).json('Token is not valid!');}
    req.user = user;
    next();
  });
};
