#!/usr/bin/env node
import getServer from '../main';

const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
const port = process.env.PORT || 4000;

getServer().listen(port, host);
