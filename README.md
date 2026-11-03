# Namratha's birthday surprise

A self-contained, mobile-friendly birthday website made for Namratha by Arjun. It uses plain HTML, CSS and JavaScript, so there is no build step or package installation.

## Preview on your computer

Open `index.html` in a browser. For the most reliable audio and photo loading, use a local server from this folder:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Make it yours

- Replace the ten `photos/memory-XX.jpg` images with your own photos. Keep the same filenames, or edit the photo names in `script.js` and the portrait images in `index.html`.
- Edit captions and dates in the `memories` list at the top of `script.js`. Dates are generic for now because none were provided.
- Edit the `letter` text in `script.js` to add your own personal birthday message.
- Replace `preetiya-hesare-neenu.mp3` with another MP3 (or change the audio `src` in `index.html`). Music begins when she taps **Open Your Surprise**. The small sound toggle in the top bar can pause or resume it.
- Edit the questions and card symbols in `script.js` if you want to personalize the two mini-games.

## Publish with GitHub and Cloudflare Pages

1. Sign in to GitHub and create a repository named `namratha-birthday-surprise` under your account. For a straightforward Pages connection, make it public.
2. Upload the contents of this `our-song` folder to the repository root (the `index.html`, `style.css`, `script.js`, `photos/` folder, and MP3 should all sit at the top level or in their shown paths). Commit the files.
3. Sign in at [Cloudflare Pages](https://dash.cloudflare.com/) and choose **Workers & Pages → Create → Pages → Connect to Git**.
4. Authorize GitHub, select the new repository, and use these settings:
   - Production branch: `main`
   - Framework preset: `None`
   - Build command: leave blank
   - Build output directory: `.` (the repository root)
5. Choose **Save and Deploy**. Cloudflare will show the public `*.pages.dev` link when the first deployment finishes. Send that link to Namratha.

When you change a file and push a new commit to `main`, Cloudflare Pages automatically deploys the update.

## Notes

- The photographs were extracted from the supplied ten-page scan and resized for web use.
- Dates in the memories are intentionally not guessed.
- Browser audio needs a user gesture. The opening button starts the background song; if the browser blocks audio, the sound toggle gives her another way to start it.
- The site uses Google Fonts when online and falls back to built-in serif and sans-serif fonts when offline.
