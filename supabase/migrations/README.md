# Supabase

The existing database (tables `aanvragen`, `contact_messages`, admin login via Supabase Auth)
is reused **unchanged**. This folder contains optional, reviewed-before-use additions:

| File | What | Required? |
|---|---|---|
| `20261120_extend_aanvragen.sql` | Extra columns for the new form fields + server-side rate limit (max 5 per e-mail per hour) | No – without it the extra fields are written into `opmerkingen` |
| `../functions/notify-aanvraag` | Edge Function that e-mails info@crossingoflimits.nl on a new request (via Resend) | No |

Check the existing Row Level Security policies in the Supabase dashboard:

- `aanvragen` / `contact_messages`: **insert** allowed for `anon`, **select** only for the owner account.
- No `update`/`delete` for `anon`.

The previous Lovable site also had a sign-up option on `/auth`. The new admin only offers
sign-in; disable "Allow new users to sign up" under Authentication → Providers → Email.
