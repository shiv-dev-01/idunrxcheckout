# Idun Rx Checkout

Checkout for **Idun Rx**. Shoppers choose a treatment, enter contact and shipping details, apply a coupon when one is offered, pay, and reach the order confirmation page.

The repository name is `idunrxcheckout` because this project is the checkout code for Idun Rx.

## Stack

- React
- Create React App
- React Router
- Axios
- Tailwind CSS
- styled-components
- React Hot Toast
- Stripe

## Requirements

- Node.js 18 or later
- npm

## Run locally

```bash
git clone https://github.com/shiv-dev-01/idunrxcheckout.git
cd idunrxcheckout
npm install
npm start
```

The dev server opens at http://localhost:3000.

## Scripts

| Command | What it runs |
| --- | --- |
| `npm run start` | `react-scripts start` |
| `npm run start:server` | `node server/index.js` |
| `npm run dev` | `concurrently "npm run start:server" "npm start"` |
| `npm run build` | `react-scripts build` |
| `npm run test` | `react-scripts test` |
| `npm run eject` | `react-scripts eject` |

## Project files

- `public`
- `server`
- `src`
- `.env`
- `.env.example`
- `.gitignore`
- `GOAFFPRO_BACKEND_GUIDE.md`
- `GOAFFPRO_SDK_CONFIG.demo.json`
- `Idun Rx (52708) - API Integration.docx`
- `Idun Rx (52708) - UTT Integration.docx`
- `IMPACT_COM_INTEGRATION.md`
- `IMPACT_COM_TESTING.md`
- `package-lock.json`
- `package.json`
- `README.md`
- `STRIPE_SETUP.md`
- `tailwind.config.js`
- `YourCoach Technical Documentation (1).md`

## Configuration

API hosts and site settings are in `src\utils\Constant.js`.
Files named `.env` stay on your machine and are not part of this repository. Use `.env.example` when the project includes one.

