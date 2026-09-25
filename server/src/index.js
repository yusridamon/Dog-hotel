require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;
// Bind to 0.0.0.0 so managed hosts (Railway, etc.) can route traffic to the
// container. Locally this is equivalent to listening on localhost.
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🐾 Dog Hotel Server running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});
