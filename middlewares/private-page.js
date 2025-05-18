import jwt from 'jsonwebtoken';
const { verify } = jwt

export function privatePage(req, res, next) {
    const token = req.cookies?.token;

    if (!token) return res.redirect('/login');

    try {
        const decoded = verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch {
        return res.redirect('/login');
    }
}
