# Damacii Studios homepage

Responsive Next.js homepage for Damacii Studios. The hero project cards can be edited in a private admin panel.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set a strong `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` in `.env.local`. Open the site at `http://localhost:3000` and the editor at `http://localhost:3000/admin`. A local password and session secret have already been created in this workspace's ignored `.env.local` file.

In `/admin`, set the project name, hero title (one line per row), category, description, and image for each hero card. Save changes to update the public homepage. Visitors can hover a card, focus it with a keyboard, or tap it to switch the hero immediately. The preview cards are editable independently of the Selected Projects section.

Local edits are saved to `data/hero-projects.json`. Local uploads go into `public/assets/images/hero/`. You can also use a path to an image already in `public/assets/images/`.

## Deploy on Vercel

Connect a [Vercel Blob store](https://vercel.com/docs/vercel-blob) to the project. Vercel supplies `BLOB_READ_WRITE_TOKEN` for the connected store. Set `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` in the Vercel project's environment variables, then redeploy. The admin uses Blob to save project content and images because deployment files are not persistent storage. Images must be JPG, PNG, WebP, or AVIF, up to 4 MB.

Until Blob is connected, the production homepage shows the defaults and the editor cannot save or upload. Existing local edits in `data/hero-projects.json` are the starting defaults; after deployment, new edits are stored in Blob.

## Other content

The portfolio and service content is stored in `components/HomePage.tsx`. Colors, spacing, layout, and breakpoints are in `app/globals.css`. Other logos and media can be placed in `public/assets/`; see its README.

The project inquiry form opens a prefilled message in the visitor's email app. Set `INQUIRY_EMAIL` in `components/HomePage.tsx` to the real destination address before launch. Direct website submission would require an email or form service.
