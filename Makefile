install:
	npm install

start:
	npx gulp dev

start-production:
	NODE_ENV=production node dist/bin/server.js

build:
	NODE_ENV=production npx gulp build

ssgBuild:
	NODE_ENV=production npx gulp ssgBuild

webpack-bundle:
	NODE_ENV=production npx webpack

lint:
	npx eslint --quiet .

lint-fix:
	npx eslint --fix --quiet .

lint-with-warn:
	npx eslint .

test:
	npx jest --runInBand --watch

test-one-file:
	npx jest --runInBand --watch $(arg)

prepare-deploy: ssgBuild
	rm -rf	babelconfig.js	bin	client .eslint.babel.js	.eslintignore	.eslintrc.js	gulpfile.js	jest.config.js	lib	main	package.json	package-lock.json	public	README.md	__tests__	webpack.config.js
	mv dist/* .
