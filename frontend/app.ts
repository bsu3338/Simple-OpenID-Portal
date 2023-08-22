import express from 'express';
import passport from 'passport';
import { Issuer, Strategy } from 'openid-client';
import session from 'express-session';
import fs from 'fs';
import path from 'path';

const app = express();
if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', true);
}

const {
  OPENID_CLIENT_ID,
  OPENID_CLIENT_SECRET,
  OPENID_ISSUER,
  OPENID_SESSION_SECRET,
  OPENID_SCOPE,
  OPENID_CALLBACK_URL,
  REDIRECT_URL,
} = process.env;

const DATA_DIR = '/data';

Issuer.discover(OPENID_ISSUER!).then(issuer => {
  const client = new issuer.Client({
    client_id: OPENID_CLIENT_ID!,
    client_secret: OPENID_CLIENT_SECRET!,
    redirect_uris: [OPENID_CALLBACK_URL!],
    response_types: ['code'],
  });

  passport.use('openid', new Strategy({ client }, (tokenset, userinfo, done) => {
    return done(null, userinfo);
  }));

  app.use(session({
    secret: OPENID_SESSION_SECRET!,
    resave: false,
    saveUninitialized: true
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  app.use((req, res, next) => {
    if (!req.isAuthenticated() && req.path !== '/login' && req.path !== OPENID_CALLBACK_URL) {
      req.session!.returnTo = req.originalUrl;
    }
    next();
  });

  app.get('/login', passport.authenticate('openid', {
    scope: OPENID_SCOPE!.split(' ')
  }));

  app.get(OPENID_CALLBACK_URL!, passport.authenticate('openid', { failureRedirect: '/' }), (req, res) => {
    // Save user info to individual files
    const userInfoWithAgent = {
      ...req.user,
      userAgent: req.headers['user-agent'] || 'Unknown',
      ipAddress: req.ip
    };
    const filename = path.join(DATA_DIR, `${req.user.sub}_${Date.now()}.json`);
    fs.writeFile(filename, JSON.stringify(userInfoWithAgent, null, 2), (err) => {
      if (err) {
        console.error(`Failed to write user data to file: ${err}`);
        res.status(500).send('Internal Server Error');
        return;
      }
      const redirectURL = req.session!.returnTo || REDIRECT_URL || '/';
      delete req.session!.returnTo;  // Clear the session value
      res.redirect(redirectURL);
    });
  });

  app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
      res.send(`Hello ${req.user.name}`);
    } else {
      res.send('Please <a href="/login">login</a>');
    }
  });

  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
  });
});
