import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import jsend from 'jsend';
import { config } from 'dotenv';

import routes from './routes';
import { errorMsg, successMsg } from './utils/message';

config();
const app = express();

/* = ===========
 APP SET PORT
============= */
const port = parseInt(process.env.PORT, 10);
app.set('port', port);

/* = ===========
 APP USE CORS
============= */
app.use(cors());

/* = ==============
  SET BODY PARSER
================== */
const json = bodyParser.json({ limit: '50mb' });
const urlencoded = bodyParser.urlencoded({
  extended: true, limit: '50mb'
});
app.use(urlencoded);
app.use(json);

// JSEND MIDDLEWARE
app.use(jsend.middleware);

/* = ===================
  ROUTES GOES HERE
===================== */
app.use('/api/v1', routes);

app.get('/', (req, res) => res.status(200).jsend.success(successMsg('Application is up and running', 200, '/', {
  verb: req.method, protocol: req.protocol, url: req.url, operationStatus: 'Proccess Completed!'
})));

/**
 * @desc HANDLES NON EXISTING ROUTES
 */
app
  .route('/*')
  .all((req, res) => res.status(404).jsend.fail(errorMsg('Route Invalid', 404, '', req.params, 'Route Not Found', {
    error: true, verb: req.method, protocol: req.protocol, operationStatus: 'Process Failed'
  })));


/**
 * @desc APPLICATION INITIALIZATION
 */
app.listen(app.get('port'), () => {
  if (process.env.NODE_ENV === 'development') {
    const message = '  App is initialized and running on http://localhost:%d in %s mode';

    console.info(message, app.get('port'), app.get('env'));

    console.info('  Press CTRL-C to stop\n');
  } else {
    console.log('App is running!');
  }
});

export default app;
