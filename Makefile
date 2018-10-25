install:
	npm install


start:
	npm run gulp dev


build:
	rm -rf dist
	NODE_ENV=production npm run gulp prod


webpack_bundle:
	NODE_ENV=production npx webpack-cli


lint:
	npm run eslint --silent .


test_once:
	npm run jest --silent


test:
	npm run jest --silent -- --watch
