# Namratha's birthday surprise

A small, mobile-first birthday website made with love by Arjun. It uses plain HTML, CSS and JavaScript; there is no build step.

## Run it locally

From this folder, run `python -m http.server 8000` and open `http://localhost:8000` in a browser. Tap **Open Your Surprise** to start the background song and reveal the page.

## Personalize it

- Replace the ten images in `photos/` with your photos, keeping the `memory-01.jpg` through `memory-10.jpg` filenames.
- Edit gallery captions in the `memories` list in `script.js`. Dates are generic because none were provided.
- Change the letter text in `script.js`.
- Replace `preetiya-hesare-neenu.mp3` to use a different song.

## Deploy with Cloudflare Pages

1. In the Cloudflare dashboard, select **Workers & Pages → Create → Pages → Connect to Git**.
2. Connect GitHub and select the `birthday` repository.
3. Choose branch `main`, preset **None**, leave the build command blank, and set the output directory to `.`.
4. Choose **Save and Deploy**. Cloudflare will provide a shareable `*.pages.dev` link after the build finishes.

The gallery and audio are personal files. This repository is public, so its files can be viewed and downloaded by anyone.
