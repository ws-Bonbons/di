sync:
	rm -rf dist
	yarn upgrade
	yarn run build

run-test:
	yarn run test

clear:
	rm -rf dist

build-node:
	tsc

build-lib:
	tsc --project tsconfig.lib.json

build-es:
	tsc --project tsconfig.es.json

build: run-test clear build-node build-lib build-es
	cp README.md dist/

rc: build
	node ./pkg.rc.js

publish: build
	node ./pkg.build.js
