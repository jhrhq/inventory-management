import express from 'express';

/* import path from 'node:path';
import cookieParser from 'cookie-parser';
// import createError from 'http-errors';
import logger from 'morgan';

import indexRouter from './routes/index';
import usersRouter from './routes/users';
 */
const app = express();

// view engine setup
/* app.set('views', path.join(import.meta.dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(import.meta.dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter); */

app.get('/', (req, res) => {
  console.log('route is working');
});

// error handler
/* app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
}); */

export { app };
