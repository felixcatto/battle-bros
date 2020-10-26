install:
	npm install

start:
	npx gulp dev

build:
	NODE_ENV=production npx gulp prod

webpack-bundle:
	NODE_ENV=production npx webpack

lint:
	npx eslint .

lint-fix:
	npx eslint --fix .

test:
	npx jest --runInBand --watch

test-one-file:
	npx jest --runInBand --watch $(arg)

deploy:
	git push -f heroku master
