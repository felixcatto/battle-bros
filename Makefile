install:
	npm install


start:
	npm run gulp dev


build:
	rm -rf dist
	NODE_ENV=production npm run gulp prod


deploy: build
	node dist/bin/server.js


lint:
	npm run eslint --silent .


test_once:
	npm run jest --silent


test:
	npm run jest --silent -- --watch
