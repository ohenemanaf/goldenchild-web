# Golden Child Complex School website

The website for **Golden Child Complex School**, which teaches from Creche to Junior High School across four campuses: James Town, First Stop, Abaase and Kasoa-Ofankor.

Live site: https://ohenemanaf.github.io/goldenchild-web/

## Pages

| File | Contents |
|---|---|
| `index.html` | Home page: about the school, academic programs, campuses, achievements, admissions summary, news, contact |
| `admission.html` | Admission steps, required documents, fee summary |
| `fee.html` | Full fee structure, notes and payment options |

## How it's built

A plain static site with no build step: edit the HTML and push to `main`, and GitHub Pages publishes it.

```
assets/
├── css/site.css      # all styles (hand-written; replaces the Tailwind CDN script)
├── js/site.js        # mobile menu, contact form, footer year
├── fonts/            # Poppins, self-hosted
├── icons.svg         # Lucide icon sprite: <svg class="icon"><use href="assets/icons.svg#mail"/></svg>
└── images/           # school crest
.nojekyll             # tells GitHub Pages to serve files as they are
```

- **Light:** about 170 KB per visit (previously about 7–23 MB, mostly a stock video and large photos).
- **Contact form:** with no server, the form opens the visitor's email app with the message ready to send to goldenschool@yahoo.com.
- **No third-party scripts or hotlinked images.** Everything is served from this repository.

## Adding real photos

The site currently uses icons instead of photos, because the earlier photos and video were stock and AI images, not the school. To add real photos (with permission for any children shown):

1. Resize each photo to about 1200 px wide, and save it as JPG or WebP under 200 KB.
2. Put it in `assets/images/`, for example `assets/images/campus-james-town.jpg`.
3. Add it to the matching card in `index.html`:
   ```html
   <img src="assets/images/campus-james-town.jpg" alt="James Town campus" width="1200" height="800" loading="lazy">
   ```
