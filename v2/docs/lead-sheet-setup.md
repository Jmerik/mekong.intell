# Lead sheet setup (about 5 minutes)

Every request from the website is saved in a Google Sheet as well as sent to Telegram, so a lead is never
lost if Telegram is down or the Vercel logs (1 hour on the Hobby plan) have expired.

## 1. Create the sheet and the script

1. Go to <https://sheets.new> and name the file **Mekong Intelligence leads**.
2. In the sheet choose **Extensions > Apps Script**.
3. Delete the sample code, paste the whole of [`lead-sheet.gs`](lead-sheet.gs), and save.
4. Choose **Project Settings** (gear icon) > **Script Properties** > **Add script property**:
   - Property: `LEAD_SECRET`
   - Value: a long random string. Generate one with `openssl rand -hex 24` or any password manager.
     Keep a copy: the website needs the same value.

## 2. Deploy it as a web app

1. **Deploy > New deployment** > gear icon > **Web app**.
2. Description: `Lead receiver`. **Execute as: Me**. **Who has access: Anyone**.
   (The secret protects it. Without the secret, requests are refused.)
3. **Deploy**, approve the permission prompt, and copy the **Web app URL** (it ends in `/exec`).

## 3. Give the website the URL and secret

In Vercel: **Project > Settings > Environment Variables**, add for the Production environment:

| Name | Value |
| --- | --- |
| `LEAD_SHEET_WEBHOOK_URL` | the Web app URL from step 2 |
| `LEAD_SHEET_SECRET` | the same value as `LEAD_SECRET` |

Also add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` if they are not there yet, then **redeploy**
(Deployments > the latest one > Redeploy), because variables only apply to new deployments.

## 4. Test it

Submit the Quick Look form on the site. Within a few seconds you should have:

- a message in Telegram, and
- a new row in the **Leads** tab of the sheet (the tab and the header row are created on the first lead).

If the sheet row is missing, open **Apps Script > Executions** to see the error. If you change the script
code later, use **Deploy > Manage deployments > Edit > New version**, otherwise the old version keeps running.

## Good to know

- The sheet contains personal data (names, emails). Keep its sharing limited to the people who need it.
- The last column, **Status**, starts as `New`. Use it to track follow-up.
- If one destination fails (say Telegram), the visitor still sees success because the other one has the lead.
  If both fail, the visitor sees an error and is pointed to Telegram.
