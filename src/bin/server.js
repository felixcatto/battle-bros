#!/usr/bin/env node
import app from '../server/app';


app.listen(process.env.PORT || 4000);
