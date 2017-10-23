# Smarticles

They're articles but they're smart

## Requirements
- [Node](https://nodejs.org/en/download/)

## Installation
Clone the repo and run `npm i` to install dependencies.

Duplicate `keys.example.json` and rename it to `keys.json` then populate with appropriate keys.

## Data
The data for a Smarticle needs to come from a [Google Spreadsheet Template](https://docs.google.com/spreadsheets/d/1NDOhvRjHdcnWNccju8XcXtiVcsbGcqYTN7cPCV59olg) that should be duplicated. Then that spreadsheet should be shared with the Smarticle Google Service Account at `smarticles@smarticle-183516.iam.gserviceaccount.com`.

## Development
Run `npm run dev` to watch for changes and to host the site locally at [`http://localhost:8000`](http://localhost:8000).

Pretty much everything you'll need to touch is inside the `src` folder. Here live the javascript modules, the sass partials (css), handlebars templates (html) along with any additional assets like fonts and icons.

The `scripts` folder contains the compilation side of things. This is for server-side sorting of data and building of assets. The only file you will probably need to change in here is the data source, which is referenced inside `scripts/config.js`.

## Deployment
You can also use `npm run deploy` which currently deploys to the [Staging server for the Guardian Mobile Lab](http://stg.gdnmobilelab.com). If you want to deploy to Production you can use `npm run deploy -- prod`
