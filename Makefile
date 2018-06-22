install:
	npm install


start:
	npm run babel-node './src/index.js'


build:
	rm -rf dist
	npm run build


lint:
	npm run eslint --silent .


test_once:
	npm run jest --silent


test:
	npm run jest --silent -- --watch