sync:
	rm -rf dist
	yarn upgrade
	yarn run build

build:
	yarn run test
	rm -rf dist
	tsc

rc: build
	node ./pkg.rc.js

publish: build
	node ./pkg.build.js