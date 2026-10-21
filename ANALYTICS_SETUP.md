# bentartaglia.tech analytics setup

## Level 1 — Cloudflare Web Analytics
Open Cloudflare dashboard → Workers & Pages → bentartaglia.tech project → Metrics → Enable Web Analytics if it is not already enabled.
Alternatively use Web Analytics → Add site → bentartaglia.tech (if the domain is proxied through Cloudflare, use automatic setup).
Confirm page views from a private browser test.

## Level 2 — Cloudflare Zaraz events
The site includes `analytics-events.js` on its main HTML pages. It emits the following via `zaraz.track`, but only when Zaraz is loaded and configured:
- `portfolio_document_download` with `kind=resume` or `kind=impact_sheet`
- `portfolio_contact_click` with `kind=email` or `kind=phone`
- `portfolio_outbound_click` with `kind=linkedin` or `kind=github`
- `portfolio_campaign_landing` with allowlisted `utm_source`, `utm_medium`, and `utm_campaign` values.

In Cloudflare → Zaraz, enable auto-injection for the site and configure an analytics destination with Events actions, fired by matching event names. Enable the destination's reporting/dashboard and check event arrival. Cloudflare Web Analytics by itself is not a custom-event reporting database.

## Outreach attribution examples
Use links with generic campaign labels, not recipient names:
- `https://bentartaglia.tech/?utm_source=recruiter_email&utm_medium=email&utm_campaign=oct_2026_outreach`
- `https://bentartaglia.tech/?utm_source=linkedin&utm_medium=social&utm_campaign=profile`

Avoid putting recipient names, email addresses, phone numbers, or secrets into campaign parameters.

## Validation
1. Check that Cloudflare deployment succeeded and the HTML includes `analytics-events.js`.
2. Confirm Web Analytics page visits appear.
3. In browser developer tools, confirm Zaraz loads.
4. Click each PDF button; verify one corresponding event arrives at the analytics destination.
5. Test a generic UTM URL and check campaign landing.
6. Verify contact/outbound clicks and exclude your own test traffic from interpretation.

This code intentionally does not create cross-page personal visitor sessions or identify individual recruiters. Events indicate clicks, not guaranteed completed downloads or contact messages. Consider privacy notice and consent requirements when selecting the destination or adding cookies.

## Current implementation status (2026-10-21)
- GA4 configured through Zaraz, pageviews and `portfolio_document_download` observed in GA4 Realtime by site owner.
- GA4 `Document Type` event-scoped custom dimension registered with event parameter `kind`.
- Zaraz consent purpose `Analytics` (ID `mOZs`) assigned to GA4. Decline yielded `mOZs:false`; an accepted-consent event test was confirmed by site owner.
- Cloudflare Monitoring currently assigned to Analytics per dashboard behavior.
- Cloudflare Web Analytics **separate** enablement/data reception remains unverified.
- Campaign attribution and double-count verification still require live QA.

## Campaign links to use
- Recruiter introduction: https://bentartaglia.tech/?utm_source=recruiter_email&utm_medium=email&utm_campaign=oct_2026_recruiter_intro
- Recruiter follow-up: https://bentartaglia.tech/?utm_source=recruiter_email&utm_medium=email&utm_campaign=oct_2026_recruiter_followup
- LinkedIn profile: https://bentartaglia.tech/?utm_source=linkedin&utm_medium=social&utm_campaign=professional_profile

Do not encode recruiter identities in URLs or promise personal-level attribution. The built-in GA4 campaign dimensions should reflect UTM parameters where attributed.

## Final acceptance checklist
1. With fresh opt-in consent, visit recruiter introduction URL. In GA4 Realtime, verify `portfolio_campaign_landing`. GA4 traffic acquisition reporting may take 24–48 hours.
2. Click a single résumé PDF download; verify exactly one `portfolio_document_download` event (`kind=resume`). Repeat once for impact sheet (`kind=impact_sheet`).
3. If GA4 Enhanced Measurement creates `file_download` as well, distinguish Google's automatic event from our custom event instead of summing them. Avoid configuring both as counted conversions.
4. In Cloudflare dashboard, locate Web Analytics → bentartaglia.tech. If absent, enable it and confirm the dashboard receives fresh pageviews.
5. Verify opt-out remains respected, including Zaraz event forwarding. Do not treat lack of visible browser `collect` requests as proof against server-side forwarding.
6. Check that monitoring and analytics tools are consistently assigned to consent purposes as intended.

