sync:
	rm -rf dist
	yarn upgrade
	yarn run build

build:
	yarn run test
	rm -rf dist
	tsc

rc: build
	node -r ts-node/register ./package.ts --rc 1

publish: build
	node -r ts-node/register ./package.ts