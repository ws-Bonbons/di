sync:
	rm -rf dist
	yarn upgrade
	yarn run build

build:
	yarn run test
	rm -rf dist
	tsc
	mkdir dist/bin
	cp bin/atc dist/bin

rc: build
	node ./pkg --rc 1

publish: build
	node ./pkg