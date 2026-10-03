# Site assets

Put final brand and media files here:

- `logos/` — wordmarks and logo variants
- `images/` — hero, portfolio, campaign, and studio images
- `icons/` — custom icons and marks
- `videos/` — hero and project videos
- `fonts/` — licensed local font files

Files in `public` are served from the site root. For example, `public/assets/images/hero.jpg` is available at `/assets/images/hero.jpg`.

Use descriptive lowercase filenames, such as `damacii-wordmark-light.svg` or `project-01-cover.webp`.

Hero project images uploaded through `/admin` are stored in `images/hero/` during local development. On Vercel, they are stored in Vercel Blob instead.
