# Golden Child Complex School website

The website for **Golden Child Complex School**, which teaches from Creche to Junior High School across four campuses: James Town, First Stop, Abaase and Kasoa-Ofankor.

Live site: https://ohenemanaf.github.io/goldenchild-web/

## Pages

| Page | Contents |
|---|---|
| `index.html` | Home: hero, announcements ticker, about, programmes, values, campuses, achievements, success stories, news |
| `about.html` | Story timeline, mission and vision, core values |
| `academics.html` | Each level (Creche to JHS) with GES curriculum subjects and where it's taught |
| `campuses.html` | The four campuses and a levels-by-campus table |
| `admission.html` | Steps, documents, fees, online enquiry form, questions and answers |
| `fee.html` | Full fee structure |
| `student-life.html` | Science Fair, sports, Cultural Day |
| `contact.html` | Message form, school information, campuses |

## Editing the site

Pages are built from one shared layout, so the header and footer only exist once.

1. Edit the page in `src/pages/`, or the header and footer in `src/layout.html`.
2. Run `node tools/build.mjs` (Node.js only, no packages needed). It writes the finished HTML files to the repository root.
3. Commit and push to `main`. GitHub Pages publishes the root folder as it is.

Inside `src/pages`, `{{icon:name}}` inserts an icon from `assets/icons.svg` (the build stops if the icon is missing), and `{{wave}}` adds the moving wave at the bottom of a page header.

## How it's built

```
src/layout.html, src/pages/   page sources (see above)
tools/build.mjs               builds the HTML pages
assets/css/site.css           all styles, including motion (switched off for "reduce motion")
assets/js/site.js             menu, scroll effects, counters, carousel, tabs, forms
assets/fonts/                 Poppins, self-hosted
assets/icons.svg              Lucide icons
.nojekyll                     tells GitHub Pages to serve files as they are
```

- **Light:** the whole site is about 330 KB; a visit to the home page downloads well under 200 KB.
- **Forms:** with no server, forms open the visitor's email app with the message ready to send to goldenschool@yahoo.com.
- **Motion:** opening animations, count-up figures, scroll reveals, rotating levels, a carousel, tabs, a timeline that fills as you scroll, moving waves and page transitions. All of it is off for visitors who choose "reduce motion", and everything is readable without JavaScript.

## Adding real photos

The site currently uses icons instead of photos, because the earlier photos and video were stock and AI images, not the school. To add real photos (with permission for any children shown):

1. Resize each photo to about 1200 px wide, and save it as JPG or WebP under 200 KB.
2. Put it in `assets/images/`, for example `assets/images/campus-james-town.jpg`.
3. Add it to the matching card in `index.html`:
   ```html
   <img src="assets/images/campus-james-town.jpg" alt="James Town campus" width="1200" height="800" loading="lazy">
   ```
