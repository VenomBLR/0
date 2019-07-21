export BUILD_ID=dontKillMe
pkill node || true
npm install
npm run dev-deploy