# Setup
1. npm create vite@latest photoshare-frontend -- --template react
2. cd photoshare-frontend && npm install
3. npm install axios react-router jwt-decode tailwindcss@latest @tailwindcss/vite@latest daisyui@latest
4. Copy `vite.config.js` and the `src/` folder from this zip over the generated ones
   (delete the template's src/App.css and src/assets if you like).
5. In the BACKEND .env set CLIENT_ORIGIN=http://localhost:5173 and restart it.
6. npm run dev  ->  http://localhost:5173
Optional: create .env with VITE_API_URL=http://localhost:5000/api
