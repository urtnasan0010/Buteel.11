# Manual accessibility and user test plan

Status: prepared, not executed. Do not turn this checklist into a claim of completed testing. Record results in VALIDATION.md with date, tester, actual device/browser/assistive-technology versions, language, observed behaviour, and evidence. Use pass, fail, or not tested for each task. Do not record participants’ diagnoses or medical history.

The automated audit is documented separately in ACCESSIBILITY_AUDIT.md. Its keyboard, reflow, print and accessibility-tree checks do not mark the manual tasks below complete. Include TalkBack on an actual Android phone when arranging mobile reader sessions. The public statement intentionally retains TODO markers until manual findings and owner decisions are reviewed.

## Keyboard only

Use a clean browser session without a mouse. Run in Mongolian and English.

1. Tab from the address bar. The skip link must become visible. Activate it; continue into main content without traversing navigation again.
2. Reach every link, field, select, checkbox, and button with Tab/Shift+Tab. Focus must remain visible and follow the reading order. No trap or hidden control may receive focus.
3. Search for the Employment Support Centre; use the office-district selector. Submit, open the result, return, and reset. The fields must reflect the current URL, including after browser Back/Forward.
4. Open and close More filters using the keyboard. Select unknown cost and a communication filter. Confirm that an active filter remains discoverable on reload. Reset from the empty result state; no hidden checkbox should remain selected.
5. Switch language on home, directory with filters, detail, guides, about, and accessibility statement. The current route and filters must be preserved. Confirm the document language is mn/en in browser inspection, then check the actual reading voice in screen-reader sessions below.
6. On a detail page, locate call, email, map search, source, review date, and direct-confirmation status. Do not initiate a real call or send a message during tests. The map must remain optional.
7. On guides, toggle every checklist item, check the progress text, and reach Print. Preview all pages; labels and checkmarks should remain legible and unclipped.
8. On feedback, submit an empty correction. Focus must reach the field, its error must be associated and readable, and no success may be claimed. Prepare a harmless report; test clipboard success and failure/manual copying. No report should be transmitted.

## NVDA on Windows

Use an actual NVDA session, not the browser accessibility tree alone. Record the installed voices and whether a Mongolian voice is available. Repeat in English as a control. Do not treat an unavailable voice as a passing pronunciation test.

- Navigate headings and landmarks. Each page should have one clear main heading and a usable main/navigation/footer structure.
- Read the complete Mongolian names, Ө/ө and Ү/ү, addresses, phone numbers, source dates, and mixed-language labels. Note incorrect pronunciation, spelling-out, skipped content, or unwanted voice changes.
- Navigate controls by keyboard and read their names, roles, values, expanded states, and checkbox state changes. Search-result counts should be discoverable after navigation.
- Check required-field errors and checklist progress without looking at the screen. The error must make sense alongside the field label.
- Confirm that unknown accessibility is not read as unavailable and source checked is not presented as provider confirmed.

## VoiceOver and a physical phone

Record iPhone model, iOS/Safari version and voices; use a real device. Repeat the core find-contact task with touch exploration and sequential navigation in both languages. Check reading order, control names, rotor headings, language switching, open/closed filters, and whether calls/email/map searches can be identified without activating them. Check that the onscreen keyboard does not hide a focused field or the action needed to continue.

## Zoom, low vision, and limited connections

- Use the browser's actual 200% zoom on every main page, separately from the existing 200% root-text test. Also check enlarged system text on the phone. No text or controls may overlap or require horizontal scrolling for ordinary content.
- At a narrow phone width, use long Mongolian text and the longest organisation name. Confirm that touch controls remain distinct and focus is not clipped.
- Try reduced motion and high-contrast/forced-colour settings. Status must remain understandable without colour.
- Disable cache and throttle the connection. Check initial content, navigation, slow feedback hydration and failed loads. Record measured transfer sizes and loading times rather than estimating them.
- Existing print support is not offline support. Before claiming an offline checklist, produce and test a saved/printed artifact with the network disconnected, including Mongolian glyphs, checkboxes, page breaks, source date and unknown-information labels. No offline artifact is currently shipped.

## Sessions with 3–5 real users

Recruit only after the owner arranges consent and an accessible session format. Ask about preferred interaction methods, not diagnoses. Offer assistance and breaks, and compensate time where possible. Do not send invitations or share contact details automatically.

Tasks: find support for a need; distinguish office location from eligibility; find the phone/email; explain what Source checked means; explain an unknown access feature; prepare a checklist; report a wrong address. Include a no-result task so participants can tell whether more help may exist elsewhere. Record completion, assistance needed, barriers and suggestions without sensitive details. Prioritise anything preventing independent completion, then retest the fix with the affected interaction method.

## Before launch

- [ ] Complete keyboard, screen-reader and real-device checks; fix blocking failures.
- [ ] Complete initial real-user sessions and retest material fixes.
- [ ] Assign a corrections recipient and reviewer; agree a realistic response target. Delivery remains intentionally unconfigured until the owner chooses.
- [ ] Ask listed organisations to confirm their own contacts, current services, costs and access conditions. Keep unanswered fields unknown.
- [ ] Assign a listing maintainer. Proposed manual review cadence: three months for contact details, no later than six months for a full review. This is a proposed process, not an automated reminder service. Starting from 2026-11-14, those review dates are 2027-02-14 and 2027-05-14.
- [ ] Update source-specific review dates only after an actual review. Record direct confirmation separately; remove or qualify disputed information promptly.
- [ ] Test slow mobile connections, print output and any offline artifact before describing them as supported.
- [ ] Update the public accessibility statement to match completed tests and remaining barriers.
- [ ] Choose hosting based on the current app: it uses server-rendered search and request headers, so it is not a static export as currently implemented. A static host requires a deliberate adaptation; no deployment has been made.

## Draft provider confirmation request — not sent

Сайн байна уу? Бид хөгжлийн бэрхшээлтэй хүмүүст дэмжлэгийн байгууллагын мэдээллийг олоход туслах “Хүртээмж” лавлахыг бэлтгэж байна. Танай нийтэлсэн мэдээлэлд тулгуурласан бүртгэлийн холбоосыг хавсаргав: [бүртгэлийн холбоос]. Нэр, хаяг, утас, цахим шуудан, цаг болон одоо үзүүлж буй үйлчилгээгээ нягталж өгнө үү. Боломжтой бол зардал, хамрагдах нөхцөл, шаардлагатай баримт, шатгүй орц, лифт, хүртээмжтэй ариун цэврийн өрөө болон харилцааны дэмжлэгийн мэдээллээ тус тусад нь баталгаажуулна уу. Мэдэхгүй зүйлээ “тодорхойгүй” гэж үлдээж болно. Бид хувь хүний онош, эмнэлгийн баримт хүсэхгүй. Баярлалаа.

Before sending, the owner must supply a working review link, sender identity, and reply channel. No organisation has been contacted through this workflow.
