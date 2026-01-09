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

*Last updated: January 9, 2026*
