install:
	npm install

start:
	npx gulp dev

build:
	NODE_ENV=production npx gulp prod

webpack-bundle:
	NODE_ENV=production npx webpack-cli

lint:
	npx eslint .

lint-fix:
	npx eslint --fix .

test:
	npx jest --watch

test-once:
	npx jest
