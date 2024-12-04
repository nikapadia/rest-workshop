# REST API Workshop
An extremely basic REST API I used as a demo for my [RCOS](https://rcos.io/) workshop. I do not recommend using this repo as a template for your own projects. This repo should be used as a jumping off point to build an understand of how REST APIs work. There are better templates out there, use those.

If you are interested in viewing the accomping slides for the workshop, click [here](https://docs.google.com/presentation/d/1aR3JjTjWZMqHRK_kTTkCTf0BrRaAX5_XvkQNVqPt5VQ/).

## Requirements
- [Node.js](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/installation)

pnpm is a faster and more storage efficient than npm. The pnpm website has more info as to why if you are interested.

## How to run

1. Clone the repository
2. Install nodemon globally by running `pnpm install -g nodemon`
3. Run `pnpm install`
4. Run `pnpm start`

Nodemon will automatically reload your server when changes are made so if you don't need that just use regular node. To do this, modify the scripts in `package.json` to the following:

```json
"scripts": {
  "start": "node index.js"
},
```
