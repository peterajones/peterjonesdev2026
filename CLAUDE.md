# Claude Code Session Documentation

This file documents solutions and fixes implemented with Claude Code assistance.

## Netlify Forms with Next.js 15 ✅ FIXED (January 2026)

### Problem
Contact form was detected by Netlify but submissions were not appearing in the Netlify Forms dashboard.

### Root Cause
Next.js 15 with `@netlify/plugin-nextjs@5` requires special configuration for Netlify Forms. Modern Next.js versions don't generate fully-static HTML pages, which means:
- Netlify can detect the form at deploy time
- But form submissions get intercepted by Next.js routing instead of Netlify's form handler
- Standard form POST approaches (to `/` or action URLs) don't work

### Solution

#### 1. Static Form Definition
Created `public/__forms.html` to register form fields with Netlify at deploy time:

```html
<!DOCTYPE html>
<html>
  <body>
    <form name="contact" method="POST" netlify-honeypot="bot-field" data-netlify="true">
      <input type="hidden" name="form-name" value="contact" />
      <input type="hidden" name="bot-field" />
      <input type="text" name="name" />
      <input type="text" name="email" />
      <textarea name="message"></textarea>
    </form>
  </body>
</html>
```

**Important:** All form fields must be present in this static HTML file for Netlify to recognize them.

#### 2. Updated ContactForm Component
Modified `pages/contact/ContactForm.js` to POST to the static form file:

```javascript
'use client';
import { useRouter } from 'next/router';

export default function ContactForm() {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });
      router.push('/contact/success');
    } catch (error) {
      console.error('Error:', error);
      alert('Form submission failed. Please try again.');
    }
  };

  return (
    <form name="contact" onSubmit={handleSubmit}>
      <input type="hidden" name="form-name" value="contact" />
      <p style={{ display: 'none' }}>
        <label>Don't fill this out if you're human: <input name="bot-field" /></label>
      </p>
      {/* Other form fields */}
    </form>
  );
}
```

### Key Implementation Details

1. **POST Target:** Must POST to `/__forms.html` (not `/` or any other URL)
2. **Form Names:** Must match exactly between static HTML and React component
3. **All Fields Required:** Every input field must exist in both the static HTML and the component
4. **Content-Type:** Must be `application/x-www-form-urlencoded`
5. **Honeypot Field:** Include bot-field in both files for spam protection
6. **Local Testing:** Will NOT work locally - forms only function when deployed to Netlify

### Testing
- Form submissions now appear in Netlify Dashboard → Forms → contact
- Tested on production deployment at peterjones.dev
- Submissions are captured and stored properly

### References
- [Using Netlify Forms with Next.js - OpenNext](https://opennext.js.org/netlify/forms)
- [Next.js on Netlify - Framework Limitations](https://docs.netlify.com/frameworks/next-js/overview/#limitations)
- [Forms Setup - Netlify Docs](https://docs.netlify.com/manage/forms/setup/)

### Related Files
- `public/__forms.html` - Static form definition for Netlify
- `pages/contact/ContactForm.js` - Contact form component
- `pages/contact/index.js` - Contact page
- `pages/contact/success.js` - Success page after submission
- `netlify.toml` - Netlify build configuration

---

## Google Places Autocomplete (weather-app) ✅ FIXED (September 2026)

### Problem
The weather-app's city search field (Google Places autocomplete) stopped working. Console showed:
```
As of March 1st, 2025, google.maps.places.AutocompleteService is not
available to new customers. Please use
google.maps.places.AutocompleteSuggestion instead.
```

### Root Cause
Two separate issues, both on the Google Cloud/API side of a March 1, 2025 change, not app logic:

1. **Deprecated classes.** `google.maps.places.AutocompleteService` and `PlacesService` (callback-based) are no longer available to any API key/project created after March 1, 2025. The replacements are `google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions()` (predictions) and `placePrediction.toPlace()` + `place.fetchFields()` (place details/coordinates) — both async/Promise-based.
2. **CSP blocked the new endpoint.** The new classes call `places.googleapis.com` (a different host than the classic `maps.googleapis.com` script loader). The site's CSP `connect-src` only allowlisted `maps.googleapis.com`, so the browser silently blocked the new API calls in production even after the code migration, surfacing as `RpcError: Rpc failed due to xhr error` in the console.

### Solution

1. Migrated `Components/projects/weather-app/WeatherApp.js` off `AutocompleteService`/`PlacesService` to `AutocompleteSuggestion.fetchAutocompleteSuggestions({ input, includedPrimaryTypes: ['locality'] })` and `suggestion.placePrediction.toPlace().fetchFields({ fields: ['location'] })`.
2. Added `https://places.googleapis.com` to `connect-src` in the CSP defined in `next.config.js`.
3. In Google Cloud Console, checked **"Places API (New)"** under the API key's API restrictions — separate from the legacy "Places API" that was already enabled, since the new classes hit a different REST endpoint.

### Key Implementation Details

1. **API shape changed:** the new methods are async and return `{ suggestions }` / a `Place` object, not callback + status-code (`PlacesServiceStatus.OK`) pairs.
2. **Suggestion shape:** `suggestion.placePrediction.placeId` / `.text.text`, not `.place_id` / `.description`.
3. **CSP:** any new Google API surface that calls a REST endpoint different from the script-loader host (`maps.googleapis.com`) needs its own `connect-src` entry — the browser blocks it client-side regardless of correct Cloud Console API-key configuration.
4. **`@react-google-maps/api`'s `<LoadScript>`** (used in `Components/MapsProvider.js`) already appends `&loading=async`, so no change was needed there.
5. A cosmetic `InvalidValueError: <callback> is not a function` console error from Google's own loader script is a known harmless quirk of this loading style; not worth chasing.
6. A `google.maps.places.PlacesService is not available to new customers` console warning may appear intermittently even after full migration (no code calls it) — reproduced as non-deterministic across identical test runs on both this repo and the `peterjonesdev2027` rebuild; treated as Google-side console noise, not an app issue.

### Testing
- Verified locally (`next dev`) and against production: city autocomplete returns suggestions and selecting one correctly sets coordinates for the weather lookup, with no CSP violations or RPC errors in the console.

### Related Files
- `Components/projects/weather-app/WeatherApp.js` - Weather app search/autocomplete component
- `Components/MapsProvider.js` - `<LoadScript>` wrapper (loads the `places` library site-wide)
- `next.config.js` - CSP headers (`connect-src` must include both `maps.googleapis.com` and `places.googleapis.com`)

---

*Last updated: September 15, 2026*
