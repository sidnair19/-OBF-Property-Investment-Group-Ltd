# OBF Properties website — how to put it live

## What's in this folder

| File | What it is |
|---|---|
| `index.html` | The whole website (home page, rooms, enquiry form, about, services, contact) |
| `privacy.html` | Privacy policy — a **draft** to fill in and get checked |
| `assets/obf-logo.png` | Your logo. Put property photos in this folder too |

To preview it, double-click `index.html` and it opens in your browser.

---

## 1. Fill in your property details (10 minutes)

1. Right-click `index.html` → **Open with** → **Notepad** (Windows) or **TextEdit** (Mac).
2. Search for **EDIT YOUR DETAILS HERE** (Ctrl+F / Cmd+F).
3. Replace everything in [square brackets]: property names, areas, Eircodes, prices, BER ratings, beds free, travel times.
4. For photos: copy the photo into the `assets` folder and write its name, e.g. `photo: "assets/douglas-house.jpg"`.
5. Change `TOTAL_BEDS = 49` whenever beds fill up. It updates everywhere on the page.
6. Save, then double-click `index.html` to check it.

Only change text **between the quote marks**. Keep the quote marks, commas and brackets `{ }` as they are.

**Also update by hand** (search for these in the file):
- `Since 2015`, `2015` and `50–100`: your LinkedIn says founded 2020 and 11–50 staff, so pick the correct figures.
- `[9am–5:30pm]`: your office hours.

---

## 2. Make enquiries arrive in your inbox

**Right now:** when someone sends the form, it opens *their* email app with the enquiry addressed to office@obfproperty.ie. They still have to press Send, so some people won't.

**To receive every enquiry automatically, use a free form service. Formspree is one example:**
1. Go to formspree.io and sign up with **office@obfproperty.ie** (or whoever should receive enquiries).
2. Create a new form. It gives you a link like `https://formspree.io/f/abcd1234`.
3. In `index.html`, find `var FORM_ENDPOINT = "";` and paste the link between the quotes:
   `var FORM_ENDPOINT = "https://formspree.io/f/abcd1234";`
4. Save. Every enquiry now arrives as an email, and Formspree also keeps a list of all of them.
5. To copy Mridul or Donal on every enquiry, add their emails in the form's settings on Formspree.

Free plans have a monthly limit. Check the provider's current pricing if you expect many enquiries.

---

## 3. Put the website online

Your current site (obfproperty.ie) runs on WordPress. There are two ways to replace it with this one:

**Option A: give this folder to whoever manages your website or hosting.**
Ask them to *"upload these files as the new homepage of obfproperty.ie and keep a backup of the old WordPress site."*

**Option B: host it yourself for free on Netlify.**
1. Sign up at netlify.com.
2. Drag this whole folder onto the Netlify dashboard. It gives you a live link in seconds.
3. In Netlify's **Domain settings**, connect **obfproperty.ie**. Netlify shows the exact settings to enter where your domain is registered.

---

## 4. Before you go live: checklist

- [ ] Every [bracketed] placeholder replaced
- [ ] BER rating shown on every property (required by law in Irish rental adverts)
- [ ] No wording like "professionals only" or "no rent allowance / HAP" anywhere (illegal under the Equal Status Acts)
- [ ] Privacy policy filled in, checked, and the yellow "Draft" box deleted
- [ ] Form sends to your inbox (send yourself a test enquiry)
- [ ] Founding year, staff numbers and company name match your official records
- [ ] Tested on a phone

---

## 5. Getting enquiries: where renters will find you

The website collects enquiries, but most renters will find you elsewhere first. Post each property on these and link back to your site:
- **Daft.ie**, Ireland's main rental site
- **Facebook Marketplace** and Cork housing / accommodation groups
- **Google Business Profile** for OBF Property (free; shows you on Google Maps)
- College accommodation boards (UCC, MTU) and large Cork employers' HR teams
