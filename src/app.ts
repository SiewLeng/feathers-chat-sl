import path from 'path';
import favicon from 'serve-favicon';
import compress from 'compression';
import helmet from 'helmet';
import cors from 'cors';

import feathers from '@feathersjs/feathers';
import configuration from '@feathersjs/configuration';
import express from '@feathersjs/express';
import socketio from '@feathersjs/socketio';


import { Application } from './declarations';
import logger from './logger';
import middleware from './middleware';
import services from './services';
import appHooks from './app.hooks';
import channels from './channels';
import { HookContext as FeathersHookContext } from '@feathersjs/feathers';
import authentication from './authentication';
import mongoose from './mongoose';
// Don't remove this comment. It's needed to format import lines nicely.

const app: Application = express(feathers());
export type HookContext<T = any> = { app: Application } & FeathersHookContext<T>;

// Load app configuration
app.configure(configuration());
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', express.static(app.get('public')));

// Set up Plugins and providers
app.configure(express.rest());
app.configure(socketio());

app.configure(mongoose);

// Configure other middleware (see `middleware/index.ts`)
app.configure(middleware);
app.configure(authentication);
// Set up our services (see `services/index.ts`)
app.configure(services);
// Set up event channels (see channels.ts)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger } as any));

app.hooks(appHooks);

/*
app.service('users').create({
  id: '413ea3f7-dfd8-4537-9155-77d2d6fb750d',
  email: 'apple@gmail.com',
  password: 'hello-kitty',
  dateOfBirth: new Date("10/23/2006"),
  hobbies: []
});

app.service('users').create({
  id: 'a8965837-d936-4142-b5aa-36630251a554d',
  email: 'banana@gmail.com',
  password: 'hello-jelly',
  dateOfBirth: new Date("08/04/2000"),
  hobbies: ['singing', 'shopping']
});

app.service('users').create({
  id: '2cb4c5d5-0d08-4d45-821e-4ef04888a6f7',
  email: 'strawberry@gmail.com',
  password: 'hello-hello',
  dateOfBirth: new Date("08/12/2003"),
  hobbies: ['singing', 'watching tv']
});
*/

/*
const params = { query: { id: '2cb4c5d5-0d08-4d45-821e-4ef04888a6f7' } };
app.service('users').patch(null, {
  $push: { hobbies: { $each: ['reading', 'sleeping'] } }
},params );
*/

/*
const params = { query: { id: '2cb4c5d5-0d08-4d45-821e-4ef04888a6f7' } };
app.service('users').patch(null, {
  $pull: { hobbies: { $in: ['sleeping'] } }
}, params);
*/

/*
const params = { query: { id: '413ea3f7-dfd8-4537-9155-77d2d6fb750d' } };
app.service('users').remove(null, params);
*/

app.service('users');

export default app;
