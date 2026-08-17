# ProyectoBAR

Early project (2023) — a server-rendered web app for **inventory and sales management**,
with role-based access and corporate login.

Kept public as part of my portfolio history: it predates my current work, and its
structure (server-rendered Handlebars, callbacks, no tests) reflects that.

## Features

- **Inventory** — product catalogue with images, stock movements and a bulk loader.
- **Sales** — register a sale, an approval flow (`ValidarVentas`) and sales history.
- **Roles** — access is gated per role, so an operator and an approver don't see the same screens.
- **Authentication** — local login with Passport + bcrypt, and an alternative login against
  **Active Directory** over LDAP (`activedirectory2`) for corporate users.
- **Reporting** — export to Excel with `exceljs`.
- **UX** — flash messages, custom 401/404 pages.

## Architecture

```
src/
  index.js        entry point — Express, Handlebars, session, Passport
  keys.js         DB and LDAP configuration
  routes/         authentication · crud · roles · inventory · sales · history
  views/          Handlebars templates (layouts + partials)
  lib/            passport strategies, handlebars helpers, auth guards
  public/         css, js, images
```

## Stack

Node.js · Express · Express-Handlebars · MySQL · Passport (local + Active Directory) ·
bcryptjs · express-session · exceljs · Bootstrap

## Running it

```bash
npm install
# set your MySQL and LDAP settings in src/keys.js
npm run dev     # nodemon, http://localhost:8033
```

Requires a MySQL database (`dbp_bar`). `src/keys.js` ships with local placeholder values,
not real credentials.
