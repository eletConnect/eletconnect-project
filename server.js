const express = require('express');
const session = require('express-session');
const cors = require('cors');

const authRoute = require('./src/auth/auth.route');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(cors());
app.use(session({
  secret: 'FS+Silj87FH5XSBUfqARoJN2oGNvKAGYYbiBvNT+p8C2dstmqH0oCq4iENQQFmQpCHAfXFHaRSJNYszwdMnlDg==',
  resave: false,
  saveUninitialized: false
}));

app.use('/auth', authRoute);

app.listen(PORT, () => {
  console.log(`[eletConnect]: O servidor está online novamente.`);
});
