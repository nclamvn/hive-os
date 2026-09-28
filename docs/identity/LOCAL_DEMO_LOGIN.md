# Local demo sign-in

The sign-in page can prefill a disposable local pilot account for one-click UI testing. This is an explicit development fixture, **not** a production login shortcut.

1. Start the local PostgreSQL database and apply migrations as described in the project setup.
2. Run `npm run demo:provision` once. This creates and verifies the disposable user, then provisions its own Mathematics Pilot Lab workspace. The command is idempotent.
3. Run `npm run dev:demo` and open `http://localhost:3000/sign-in`. Email and password are prefilled; click **Sign in**.

The fixture is shown only when `DEMO_FIXTURES_ENABLED=true`, `NODE_ENV=development`, the deployment environment is development, both request and auth URL use loopback, and the database name is exactly `hiveos_dev`. No production or staging request receives demo credentials. The development server is bound to loopback. The account's published password is disposable; never reuse it for a real user or data source. Turn the fixture off by running ordinary `npm run dev`.
