# OG Meta Generator

A post-build script that generates language-specific HTML files with localized Open Graph meta tags for the electricity price map.

## How It Works

After React builds `index.html`, this script:
1. Reads the built `index.html`
2. For each language (36 languages) and page type (map, about, country):
   - Injects localized `<title>`, OG meta tags, and Twitter card meta tags
   - Saves to the appropriate directory structure

## Directory Structure

```
build/
├── index.html              # English map page
├── about/index.html        # English about page
├── country/
│   ├── Finland/index.html  # English country pages
│   └── ...
├── fi/
│   ├── index.html          # Finnish map page
│   ├── about/index.html    # Finnish about page
│   └── country/
│       ├── Finland/index.html
│       └── ...
├── sv/
│   └── ...
└── ...
```

## Usage

After building the React app:

```bash
cd frontend
npm run build

cd ../og-meta
node generate-html.js
```

Or add to your build script in `frontend/package.json`:

```json
{
  "scripts": {
    "build": "react-scripts build && node ../og-meta/generate-html.js"
  }
}
```

## CloudFront Function

Deploy `cloudfront-function.js` as a CloudFront Function to route requests to the correct index.html:

1. Go to CloudFront → Functions → Create function
2. Runtime: **cloudfront-js-2.0**
3. Paste the code from `cloudfront-function.js`
4. Publish the function
5. Associate with your distribution's default cache behavior as a **Viewer Request** function

The function rewrites URIs:
- `/fi/map` → `/fi/index.html`
- `/fi/country/Finland` → `/fi/country/Finland/index.html`
- `/about` → `/about/index.html`
- Static assets pass through unchanged

## Configuration

Edit `generate-html.js` to change:
- `BUILD_DIR` - Path to React build output
- `BASE_URL` - Your site's base URL
- `IMAGE_URL` - OG image URL

## Adding Languages

Edit `translations.js` to add translations. The script falls back to English for any missing translations.

## Adding Countries

Edit the `countries` array in `generate-html.js` and add country name translations to `translations.js`.
