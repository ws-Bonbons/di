sync:
	rm -rf dist
	yarn upgrade
	yarn run build

build:
	yarn run test
	rm -rf dist
	tsc

rc: build
	node ./pkg --rc 1

publish: build
	node ./pkg