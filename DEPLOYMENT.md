# Free demo deployment

This project can be deployed with Netlify (frontend) and Render (FastAPI API).
Both services require the project to be in a GitHub repository.

## 1. Push the project to GitHub

Create a GitHub repository and upload the project files. Do not upload either
Python virtual environment (`backend/python/.venv` or `backend/python/venv`).

## 2. Deploy the frontend on Netlify

1. In Netlify, choose **Add new site → Import an existing project** and connect
   the same GitHub repository.
2. The `netlify.toml` file sets the publish directory to `frontend` and sends
   the site root to the homepage.
3. Once the Netlify site is created, copy its site origin, such as
   `https://your-site-name.netlify.app`.

## 3. Deploy the API on Render

1. In Render, choose **New → Blueprint** and connect the GitHub repository.
2. Render will read `render.yaml`. When asked for `FRONTEND_ORIGINS`, enter the
   Netlify site origin copied above.
3. Wait for the service to deploy. Its API URL will look like
   `https://aaharlink-api.onrender.com`.
4. Edit `frontend/js/config.js`, replacing its local URL with the Render API
   URL followed by `/api`, for example:

   ```js
   window.AAHARLINK_API_URL = "https://aaharlink-api.onrender.com/api";
   ```

5. Commit and push that change to GitHub so Netlify publishes the updated site.

The free Render service may sleep when idle and take a while to respond to the
first request. Its local SQLite database is temporary on the free service, so
demo accounts and listings can be lost when the service restarts.

Use fake accounts and demo data only. Do not share account passwords or API
secrets in the repository or chat.
