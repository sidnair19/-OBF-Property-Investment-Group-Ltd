# OBF Properties website — guide

## What's in this folder

| File | What it is |
|---|---|
| `index.html` | The public website |
| `admin.html` | **Your property manager**: upload photos, add or edit properties, read enquiries |
| `config.js` | Settings: database keys, office email, travel-time places |
| `setup.sql` | One-time setup for the online database (step 2) |
| `privacy.html` | Privacy policy — a **draft** to fill in and get checked |
| `assets/` | Logo and the files that make the site work. Don't rename anything here |

---

## 1. Try it now (demo mode, 5 minutes)

1. Double-click **admin.html**. It opens in your browser with a yellow "Demo mode" bar.
2. Click **Add property**, drag in a few photos, and fill in the details and the Eircode. The map updates as you type.
3. For travel times, click **Check on Google Maps** next to each place, read the time, and type it in (e.g. "8 min walk").
4. Click **Save property**.
5. Double-click **index.html**. Your property now shows with its photos. Click it to see the gallery, map and travel times.
6. Fill in the enquiry form on index.html, then open admin.html → **Enquiries**. It's there.

In demo mode everything is saved only in the browser on your computer. Nobody else sees it. Step 2 makes it real.

---

## 2. Connect the online database (one-time, about 15 minutes)

This uses **Supabase**, a free online database. It stores your properties, photos and enquiries so the website shows them to everyone.

1. Go to **supabase.com** → Start your project → sign up (use the office email).
2. Click **New project**:
   - Name: `obf-website`
   - Database password: create one and save it somewhere safe
   - Region: **West EU (Ireland)**
   - Wait about a minute while it's created.
3. Open `setup.sql` in Notepad / TextEdit. On the **last line**, change `office@obfproperty.ie` to the email you'll sign in with. To let several people in, copy that line once for each email.
4. In Supabase, go to **SQL Editor** (left menu) → **New query** → paste the whole of `setup.sql` → click **Run**. It should say "Success".
5. Create your login: **Authentication** → **Users** → **Add user** → **Create new user**. Enter the same email and a password, and tick **Auto Confirm User**.
6. Stop strangers signing up: **Authentication** → **Sign In / Providers** (or **Providers**) → **Email** → turn **off** "Allow new users to sign up" → Save.
   (Even without this, only emails listed in step 3 can change anything. This is an extra lock.)
7. Copy your keys: **Project Settings** → **API** (sometimes called **Data API** / **API Keys**). Copy:
   - **Project URL** (looks like `https://abcdefgh.supabase.co`)
   - **anon public** key (a long code starting with `eyJ…`, or `sb_publishable_…`)
8. Open `config.js` in Notepad / TextEdit and paste them between the quote marks:
   ```
   SUPABASE_URL: "https://abcdefgh.supabase.co",
   SUPABASE_ANON_KEY: "eyJhbGciOi…",
   ```
   Save. It's safe for this key to be public: the database only lets your listed emails make changes.
9. Open **admin.html** again. The yellow bar is gone and it asks you to sign in. Use the email and password from step 5, then add your properties for real.

**Note:** Supabase's free plan may pause a project that has no activity for a week. A live website with visitors normally keeps it active. For guaranteed uptime, consider their paid plan; check supabase.com/pricing for current prices.

---

## 3. Get an email for every enquiry (optional, 5 minutes)

Enquiries always appear in admin.html → Enquiries. If you'd also like an email for each one:
1. Sign up at **formspree.io** with the inbox that should receive them.
2. Create a form. It gives you a link like `https://formspree.io/f/abcd1234`.
3. Paste it into `config.js`: `FORM_ENDPOINT: "https://formspree.io/f/abcd1234",`
4. To copy Mridul or Donal in, add their emails in the form's settings on Formspree.

---

## 4. Put the website online

**Easiest (free): Netlify**
1. Sign up at **netlify.com**.
2. Go to **Sites** → drag this whole folder onto the page. You get a live link in seconds.
3. **Domain settings** → add **obfproperty.ie**. Netlify shows the exact settings to enter where the domain is registered.
4. To update the site later (e.g. after editing config.js), drag the folder onto the same site again.

**Or** give this folder to whoever manages obfproperty.ie and ask them to *"replace the WordPress homepage with these files and keep a backup of the old site."*

Your property manager will then be at **obfproperty.ie/admin.html**. Bookmark it. It isn't linked from the website.

---

## 5. Everyday use

- **New property:** admin.html → Add property → photos, details, Eircode, travel times → Save.
- **Bed taken:** click **Update beds** on that property and enter the new number. The total on the website updates automatically. When it reaches 0, it shows "Fully let" and a "Join waitlist" button.
- **Hide a property** (renovation, all let): click **Hide**. Click **Show** to bring it back.
- **Reorder:** use the ↑ ↓ arrows. The top property shows first on the website.
- **Enquiries:** admin.html → Enquiries. Call, WhatsApp or email straight from there. Set the status (New → Contacted → Viewing booked → Let) so the team knows where each lead stands. **Download as spreadsheet** gives you an Excel-ready list.
- **Share one property** on Facebook, Daft or WhatsApp: open it on the website and click **Copy link to this property**. The link opens straight to that property.

---

## 6. Before you go live: checklist

- [ ] Database connected (step 2) and a test property added with photos
- [ ] Test enquiry sent and seen in admin.html → Enquiries
- [ ] BER rating on every property (required by law in Irish rental ads)
- [ ] No wording like "professionals only" or "no HAP / rent allowance" in descriptions (illegal under the Equal Status Acts)
- [ ] [Bracketed] text replaced in index.html: office hours, reply time (in config.js), FAQ answers
- [ ] Founding year (2015 vs 2020), staff numbers and company name match your official records
- [ ] Privacy policy filled in, checked, and the yellow "Draft" box deleted
- [ ] Tested on a phone
