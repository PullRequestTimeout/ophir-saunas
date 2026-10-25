// Shared branded layout for every email. Table-based with inline styles, because email clients ignore most CSS;
// brand colours are copied from static/global.css. Web fonts are unreliable in email, so headings fall back to serif.

import { formatCents } from "$lib/utils/format";
import type { LineItem } from "$lib/types/booking";
import type { Email } from "./send";

const color = {
	background: "#FAF3EB",
	card: "#FFFFFF",
	primary: "#414833",
	green: "#BABE9F",
	grey: "#383838"
};
const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
const headingFont = "Abigail, Georgia, 'Times New Roman', serif";

export const CONTACT_EMAIL = "info@ophirsaunas.ca";

export interface EmailContent {
	subject: string;
	/** Inbox preview text */
	preheader: string;
	heading: string;
	/** Paragraphs before the details */
	intro: string[];
	/** Label/value rows; a value may contain line breaks */
	details?: [string, string][];
	items?: LineItem[];
	total?: { label: string; cents: number };
	/** Paragraphs after the details */
	outro?: string[];
	button?: { label: string; url: string };
}

export function escapeHtml(value: string) {
	return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

const paragraph = (text: string) =>
	`<p style="margin:0 0 16px;font-family:${font};font-size:16px;line-height:1.5;color:${color.grey};">${escapeHtml(text)}</p>`;

export function renderEmail(content: EmailContent): Email {
	const details = content.details?.length
		? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;background:${color.background};border-radius:12px;">
${content.details
	.map(
		([label, value]) => `<tr>
	<td valign="top" style="padding:10px 16px;font-family:${font};font-size:14px;font-weight:600;color:${color.primary};white-space:nowrap;">${escapeHtml(label)}</td>
	<td valign="top" style="padding:10px 16px;font-family:${font};font-size:15px;line-height:1.4;color:${color.grey};">${escapeHtml(value).replace(/\n/g, "<br />")}</td>
</tr>`
	)
	.join("\n")}
</table>`
		: "";

	const items = content.items?.length
		? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
${content.items
	.map(
		(item) => `<tr>
	<td style="padding:6px 0;font-family:${font};font-size:15px;color:${color.grey};">${escapeHtml(item.label)}${item.quantity > 1 ? ` × ${item.quantity}` : ""}</td>
	<td align="right" style="padding:6px 0;font-family:${font};font-size:15px;color:${color.grey};white-space:nowrap;">${formatCents(item.total_cents)}</td>
</tr>`
	)
	.join("\n")}
${
	content.total
		? `<tr>
	<td style="padding:10px 0 0;border-top:2px solid ${color.primary};font-family:${font};font-size:16px;font-weight:700;color:${color.primary};">${escapeHtml(content.total.label)}</td>
	<td align="right" style="padding:10px 0 0;border-top:2px solid ${color.primary};font-family:${font};font-size:16px;font-weight:700;color:${color.primary};">${formatCents(content.total.cents)}</td>
</tr>`
		: ""
}
</table>`
		: "";

	const button = content.button
		? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 16px;"><tr><td style="border-radius:20px;background:${color.primary};">
	<a href="${escapeHtml(content.button.url)}" style="display:inline-block;padding:10px 24px;font-family:${font};font-size:16px;font-weight:600;color:#FFFFFF;text-decoration:none;">${escapeHtml(content.button.label)}</a>
</td></tr></table>`
		: "";

	const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<title>${escapeHtml(content.subject)}</title>
</head>
<body style="margin:0;padding:0;background:${color.background};">
<div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(content.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${color.background};">
<tr><td align="center" style="padding:24px 12px;">
	<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
		<tr><td style="padding:0 8px 16px;font-family:${headingFont};font-size:28px;color:${color.primary};">Ophir Mobile Saunas</td></tr>
		<tr><td style="background:${color.card};border-radius:20px;padding:28px 24px;">
			<h1 style="margin:0 0 16px;font-family:${headingFont};font-size:26px;font-weight:400;line-height:1.2;color:${color.primary};">${escapeHtml(content.heading)}</h1>
			${content.intro.map(paragraph).join("\n")}
			${details}
			${items}
			${button}
			${(content.outro ?? []).map(paragraph).join("\n")}
		</td></tr>
		<tr><td style="padding:16px 8px;font-family:${font};font-size:13px;line-height:1.5;color:${color.grey};">
			Ophir Mobile Saunas · Rossland, BC<br />
			<a href="mailto:${CONTACT_EMAIL}" style="color:${color.primary};">${CONTACT_EMAIL}</a> · <a href="https://ophirsaunas.ca" style="color:${color.primary};">ophirsaunas.ca</a>
		</td></tr>
	</table>
</td></tr>
</table>
</body>
</html>`;

	const text = [
		content.heading,
		"",
		...content.intro.flatMap((p) => [p, ""]),
		...(content.details ?? []).map(([label, value]) => `${label}: ${value.replace(/\n/g, ", ")}`),
		...(content.details?.length ? [""] : []),
		...(content.items ?? []).map((item) => `${item.label}${item.quantity > 1 ? ` × ${item.quantity}` : ""}: ${formatCents(item.total_cents)}`),
		...(content.total ? [`${content.total.label}: ${formatCents(content.total.cents)}`, ""] : []),
		...(content.button ? [`${content.button.label}: ${content.button.url}`, ""] : []),
		...(content.outro ?? []).flatMap((p) => [p, ""]),
		"Ophir Mobile Saunas · Rossland, BC",
		`${CONTACT_EMAIL} · ophirsaunas.ca`
	].join("\n");

	return { subject: content.subject, html, text };
}
