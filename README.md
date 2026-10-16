# My Portfolio

The personal portfolio of **Kalyan**, a full-stack web and mobile developer based in Hyderabad, India.
Built with Next.js, React and TypeScript, with scroll-driven animations and a few working projects built into it.

## What is on the site

- **Hero, intro and Selected Projects** with scroll animations.
- **Services, Tech Stack and Certifications**, each with its own scroll effect.
- **Explore Some Crazy**
  - **MusicWave:** a music player with search, languages, a floating mini-player that keeps playing across pages,
    and Media Session controls.
  - **Media Downloader:** a secure downloader for audio and video you own or that is openly licensed
    (Internet Archive, Wikimedia Commons, direct files), with real progress. It refuses YouTube and other streaming
    platforms.
  - **Games:** links to an external quiz site.
- **Contact form** over a looping sky video, and a **footer** with a dotted name, a map of India with a live clock,
  and a race-car video.

## Tech

Next.js 16 (App Router, Turbopack), React 19, TypeScript, plain CSS, `lucide-react`.

## Run it

You need Node.js 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build
npm start
```

## Where things are

```
src/app/                 pages, global styles and API routes (/api/music, /api/media)
src/components/          the sections, MusicWave, the mini-player and the downloader
src/context/             the site-wide music player
src/data/contact.ts      email, phone, social links and city (edit these to update the footer)
src/lib/                 server helpers for the downloader
public/                  images, video and logos
```

## License

The source code is released under the [MIT License](LICENSE).

The license covers the code only. Images, videos, logos and album covers in `public/` and shown on the site
(for example brand and tool logos, client project screenshots, stock footage and music artwork from third parties)
belong to their respective owners and are not covered by it.
