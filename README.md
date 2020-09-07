# Personal Site

This is the code for my personal site. It will eventually have a personal
blog, a CV, and some other information. This is mostly done as a convenient
way to learn Svelte and Sapper, static site generation, Typescript,
TypeGraphQL, and MDsveX.

So far I've added the basic project, Typescript, and managing posts with a
SQLite3 database. Most of my work has been experimentation, so it is not
yet well tested. Additionally, the front end portion has not been touched.

### TODO:
- Add blog/ route for blog overview and most recent 10 posts.
- Add routes for /year, /year/month, /year/month/day
- Modify /[slug] route to be /[...meta] in order to support /year/month/day/[slug] route
- Create svelte pages for all of the above
- Implement UI design
- Test Test Test
- Generate static pages and deploy to github.
