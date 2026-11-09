/* =====================================================================
   OBF PROPERTIES — WEBSITE SETTINGS
   Change only the text between the quote marks. Keep quotes and commas.
   ===================================================================== */
window.OBF_CONFIG = {

  // 1. ONLINE DATABASE (Supabase) — see guide, step 2.
  //    While these two are empty, the site runs in DEMO MODE: anything you
  //    add in admin.html is saved only in the browser on this computer.
  SUPABASE_URL: "https://cjxmnipeexmatnubhgbi.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_Uu6vAQxxy6vBvMut92wd0Q_iEbfLQdl",


  // 2. OPTIONAL EMAIL ALERT for every enquiry (Formspree link) — guide, step 3.
  //    Enquiries always appear in the admin window either way.
  FORM_ENDPOINT: "",

  // 3. OFFICE DETAILS used by the enquiry form
  OFFICE_EMAIL: "office@obfproperty.ie",
  WHATSAPP_NUMBER: "353874770865",   // country code + number, no spaces or +
  REPLY_TIME: "[24 hours]",          // e.g. "24 hours"

  // 4. PLACES SHOWN IN "TRAVEL TIMES" on every property
  //    label = what visitors see; query = what Google Maps searches for;
  //    mode = "walking", "transit" (bus) or "driving"
  LANDMARKS: [
    { key: "centre", label: "City centre (Patrick's St)", query: "St Patrick's Street, Cork", mode: "walking" },
    { key: "ucc",    label: "UCC",                        query: "University College Cork", mode: "walking" },
    { key: "mtu",    label: "MTU Bishopstown",            query: "MTU Bishopstown Campus, Cork", mode: "transit" },
    { key: "cuh",    label: "Cork University Hospital",   query: "Cork University Hospital", mode: "transit" },
    { key: "kent",   label: "Kent Station",               query: "Kent Railway Station, Cork", mode: "walking" }
  ]
};
