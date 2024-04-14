const express = require('express');
const cluster = require('cluster');
const os = require('os');
const { Cashfree } = require("cashfree-pg");
const http = require('http');
const hpp = require('hpp');
const cors = require("cors");
const mongoSanitize = require('express-mongo-sanitize');
const numCpu = os.cpus().length;
const compression = require('compression');
const xss = require('xss-clean');
const dotenv = require('dotenv');
const next = require('next');
const connectToDb = require('./database/connect');
const session = require("express-session");
const passport = require("passport");
const usermodel = require('./model/userSchema');
const { Server } = require('socket.io');
const oauth2 = require("passport-google-oauth2").Strategy;
const cookieparser = require("cookie-parser");
const authentication = require('./auth/googleAuth');
const route = require('./routers/route');
const bodyParser = require("body-parser");

dotenv.config();
const PORT = 5000;
const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost'
const app = next({ dev,hostname,PORT });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const myserver = express();
    const server = http.createServer(myserver);

    // Apply middleware
    myserver.use(bodyParser.json());
    myserver.use(express.json());
    myserver.use(express.urlencoded({ extended: true }));
    myserver.use(cors());
    myserver.use(session({
      key: "quizpluser",
      secret: "neiuebofbe78f287fb233fy82bf8B348RB8UB3F3",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 240 * 60 * 60 * 1000,
        secure: false,
        httpOnly: false,
        sameSite: false
      }
    }));
    myserver.use(cookieparser());
    myserver.use(passport.initialize());
    myserver.use(passport.session());
    myserver.use(xss());
    myserver.use(mongoSanitize());
    myserver.use(hpp());
    myserver.use(compression({ level: 6, threshold: 0 }));
    myserver.disable('x-powered-by');

    // Set Cashfree credentials
    Cashfree.XClientId = process.env.cashfreeclientid;
    Cashfree.XClientSecret = process.env.cashfreesecret;
    Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

    // Socket.io setup
    const io = new Server(server, {
      path: '/quizpl/socket.io',
      cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT"],
      }
    });

   let users = [];
  io.on("connection",(socket)=>{
    users.push(socket.id)
      socket.join("quiz");
      io.to('quiz').emit("user-came",users);
      socket.on('disconnect',()=>{
        let data = users.filter((item)=>item!==socket.id)
        io.to('quiz').emit('user-went',data)
      })
  })

    // Passport setup
    passport.use(new oauth2({
      clientID: process.env.clientid,
      clientSecret: process.env.clientsecret,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"]
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await usermodel.findOne({ googleId: profile.id });
        if (!user) {
          user = new usermodel({ googleId: profile.id, displayName: profile.displayName, email: profile.emails[0].value, image: profile.photos[0].value });
          await user.save();
          return done(null, user);
        } else {
          await usermodel.findOneAndUpdate({ googleId: user.googleId }, { googleId: profile.id, displayName: profile.displayName, email: profile.emails[0].value, image: profile.photos[0].value }, { new: true });
          return done(null, user);
        }
      } catch (e) {
        return done(e, null);
      }
    }));

    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((user, done) => {
      done(null, user);
    });

    // Authentication routes
    myserver.get('/auth/google', passport.authenticate("google", { scope: ['profile', 'email'] }));
    myserver.get('/auth/google/callback', passport.authenticate("google", {
      successRedirect: "/",
      failureRedirect: "/failed"
    }));

    myserver.get("/loggedin", authentication, async (req, res) => {
      res.status(201).send(req.user);
    });

    myserver.get("/loggedout", (req, res) => {
      res.send(req.logout((err)=>{
        if(err){
          return next(err)
        }else{
          res.redirect("http://localhost:5000")
        }
      }));
    });

    // Route handling
    myserver.use('/', route);

    // Default route handler
       myserver.get('*', (req, res) => {
        return handle(req, res.setHeader('Cache-control', 'private, max-age=31536000'));
      });

    // Error handling
    myserver.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Something broke!');
    });
    // if (cluster.isPrimary) {
    //   for (let i = 0; i < numCpu; i++) {
    //     cluster.fork();
    //   }
    //   cluster.on('exit', () => {
    //     cluster.fork();
    //   });
    // } else {
      server.listen(PORT, (err) => {
        if (err) throw err;
        connectToDb();
        console.log('> Ready on http://localhost:' + PORT);
      });
    //}
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
