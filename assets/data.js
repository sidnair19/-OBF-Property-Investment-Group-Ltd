/* OBF Properties — shared data layer used by index.html and admin.html.
   No need to edit this file. Settings live in config.js. */
(function () {
  var C = window.OBF_CONFIG || {};
  var BUCKET = "property-photos";
  var configured = !!(C.SUPABASE_URL && C.SUPABASE_ANON_KEY);
  var sb = null;
  if (configured && window.supabase && window.supabase.createClient) {
    sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY);
  }
  // demo = no database set up yet; online = connected; offline = set up but library failed to load
  var mode = !configured ? "demo" : (sb ? "online" : "offline");

  /* ---------- demo storage: this browser only (IndexedDB) ---------- */
  var dbp = null;
  function idb() {
    if (!dbp) dbp = new Promise(function (res, rej) {
      var r = indexedDB.open("obf-demo", 1);
      r.onupgradeneeded = function () { r.result.createObjectStore("kv"); };
      r.onsuccess = function () { res(r.result); };
      r.onerror = function () { rej(r.error); };
    });
    return dbp;
  }
  function lget(k) {
    return idb().then(function (db) {
      return new Promise(function (res, rej) {
        var q = db.transaction("kv").objectStore("kv").get(k);
        q.onsuccess = function () { res(q.result); };
        q.onerror = function () { rej(q.error); };
      });
    });
  }
  function lset(k, v) {
    return idb().then(function (db) {
      return new Promise(function (res, rej) {
        var t = db.transaction("kv", "readwrite");
        t.objectStore("kv").put(v, k);
        t.oncomplete = function () { res(); };
        t.onerror = function () { rej(t.error); };
      });
    });
  }

  /* ---------- helpers ---------- */
  function uid() {
    return window.crypto && crypto.randomUUID ? crypto.randomUUID()
      : "id-" + Date.now().toString(36) + Math.random().toString(36).slice(2);
  }
  function check(r) { if (r.error) throw r.error; return r.data; }
  function offline() {
    return Promise.reject(new Error("Couldn't reach the online database. Check your internet connection and try again."));
  }
  function fromRow(row) {
    return Object.assign({}, row.data || {}, { id: row.id, published: row.published, sort_order: row.sort_order });
  }
  function toRow(p) {
    var data = Object.assign({}, p);
    delete data.id; delete data.published; delete data.sort_order;
    return { id: p.id, data: data, published: p.published !== false, sort_order: p.sort_order || 0, updated_at: new Date().toISOString() };
  }
  function byOrder(a, b) { return (a.sort_order || 0) - (b.sort_order || 0); }

  /* Shrinks a photo before upload so the site stays fast */
  function compress(file, maxSide, quality) {
    if (!/^image\//.test(file.type)) return Promise.reject(new Error(file.name + " isn't a photo."));
    var load = window.createImageBitmap
      ? createImageBitmap(file)
      : new Promise(function (res, rej) {
          var img = new Image();
          img.onload = function () { res(img); };
          img.onerror = rej;
          img.src = URL.createObjectURL(file);
        });
    return load.catch(function () {
      throw new Error(file.name + " couldn't be opened. Please use JPG or PNG photos (on iPhone, choose 'Most Compatible' in Camera settings).");
    }).then(function (img) {
      var w = img.width, h = img.height, s = Math.min(1, maxSide / Math.max(w, h));
      var c = document.createElement("canvas");
      c.width = Math.round(w * s); c.height = Math.round(h * s);
      var ctx = c.getContext("2d");
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0, c.width, c.height);
      return new Promise(function (res, rej) {
        c.toBlob(function (b) { b ? res(b) : rej(new Error("Couldn't process " + file.name)); }, "image/jpeg", quality);
      });
    });
  }
  function toDataURL(blob) {
    return new Promise(function (res, rej) {
      var fr = new FileReader();
      fr.onload = function () { res(fr.result); };
      fr.onerror = rej;
      fr.readAsDataURL(blob);
    });
  }

  /* ---------- public API ---------- */
  window.OBF = {
    mode: mode,

    listProperties: function (opts) {
      var pub = opts && opts.publishedOnly;
      if (mode === "offline") return offline();
      if (sb) {
        var q = sb.from("properties").select("*").order("sort_order", { ascending: true });
        if (pub) q = q.eq("published", true);
        return q.then(check).then(function (rows) { return rows.map(fromRow); });
      }
      return lget("properties").then(function (l) {
        l = (l || []).slice().sort(byOrder);
        return pub ? l.filter(function (p) { return p.published !== false; }) : l;
      });
    },

    saveProperty: function (p) {
      p = Object.assign({}, p);
      if (!p.id) p.id = uid();
      if (mode === "offline") return offline();
      if (sb) return sb.from("properties").upsert(toRow(p)).then(check).then(function () { return p; });
      return lget("properties").then(function (l) {
        l = l || [];
        var i = l.findIndex(function (x) { return x.id === p.id; });
        if (i >= 0) l[i] = p; else l.push(p);
        return lset("properties", l);
      }).then(function () { return p; });
    },

    deleteProperty: function (id) {
      if (mode === "offline") return offline();
      if (sb) return sb.from("properties").delete().eq("id", id).then(check);
      return lget("properties").then(function (l) {
        return lset("properties", (l || []).filter(function (x) { return x.id !== id; }));
      });
    },

    uploadPhoto: function (file) {
      if (mode === "offline") return offline();
      return compress(file, sb ? 1800 : 1280, sb ? 0.82 : 0.75).then(function (blob) {
        if (sb) {
          var path = new Date().toISOString().slice(0, 7) + "/" + uid() + ".jpg";
          return sb.storage.from(BUCKET)
            .upload(path, blob, { contentType: "image/jpeg", cacheControl: "31536000" })
            .then(check)
            .then(function () { return { url: sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl, path: path }; });
        }
        return toDataURL(blob).then(function (url) { return { url: url, path: null }; });
      });
    },

    deletePhotos: function (paths) {
      paths = (paths || []).filter(Boolean);
      if (!sb || !paths.length) return Promise.resolve();
      return sb.storage.from(BUCKET).remove(paths).then(function () {}, function () {});
    },

    submitEnquiry: function (data) {
      if (mode === "offline") return offline();
      if (sb) return sb.from("enquiries").insert({ data: data }).then(check);
      return lget("enquiries").then(function (l) {
        l = l || [];
        l.unshift({ id: uid(), created_at: new Date().toISOString(), status: "new", data: data });
        return lset("enquiries", l);
      });
    },

    listEnquiries: function () {
      if (mode === "offline") return offline();
      if (sb) return sb.from("enquiries").select("*").order("created_at", { ascending: false }).then(check);
      return lget("enquiries").then(function (l) { return l || []; });
    },

    setEnquiryStatus: function (id, status) {
      if (mode === "offline") return offline();
      if (sb) return sb.from("enquiries").update({ status: status }).eq("id", id).then(check);
      return lget("enquiries").then(function (l) {
        (l || []).forEach(function (e) { if (e.id === id) e.status = status; });
        return lset("enquiries", l || []);
      });
    },

    deleteEnquiry: function (id) {
      if (mode === "offline") return offline();
      if (sb) return sb.from("enquiries").delete().eq("id", id).then(check);
      return lget("enquiries").then(function (l) {
        return lset("enquiries", (l || []).filter(function (e) { return e.id !== id; }));
      });
    },

    /* sign-in (online mode only) */
    getUser: function () {
      if (!sb) return Promise.resolve(mode === "demo" ? { email: "Demo mode" } : null);
      return sb.auth.getSession().then(function (r) { return r.data.session ? r.data.session.user : null; });
    },
    signIn: function (email, password) {
      return sb.auth.signInWithPassword({ email: email, password: password }).then(function (r) {
        if (r.error) throw r.error;
        return r.data.user;
      });
    },
    signOut: function () { return sb ? sb.auth.signOut() : Promise.resolve(); },
    isAdmin: function () {
      if (!sb) return Promise.resolve(true);
      return sb.rpc("is_admin").then(check);
    }
  };
})();
