const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const { User } = require('../models');
const jwt = require('jsonwebtoken');

// JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'your-secret-key'
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ 'google.id': profile.id });
          
          if (!user) {
            user = await User.create({
              email: profile.emails[0].value,
              name: profile.displayName,
              google: {
                id: profile.id,
                email: profile.emails[0].value
              }
            });
          }
          
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

// Facebook OAuth Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: '/api/auth/facebook/callback',
        profileFields: ['id', 'emails', 'name']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ 'facebook.id': profile.id });
          
          if (!user) {
            user = await User.create({
              email: profile.emails[0].value,
              name: `${profile.name.givenName} ${profile.name.familyName}`,
              facebook: {
                id: profile.id,
                email: profile.emails[0].value
              }
            });
          }
          
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

// Authentication middleware
const authenticate = passport.authenticate('jwt', { session: false });

// Role-based authorization middleware
const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    authenticate,
    (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: Insufficient permissions'
        });
      }
      next();
    }
  ];
};

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = {
  authenticate,
  authorize,
  auth
}; 