.PHONY: install start test generate-data docker-build docker-run

install:
	cd backend && npm install

start:
	cd backend && npm start

test:
	cd backend && npm test || node --test ../tests/store.test.js

generate-data:
	cd backend && node src/data/generateLargeData.js 2000

docker-build:
	docker build -t employee-management .

docker-run:
	docker run -p 5000:5000 employee-management
