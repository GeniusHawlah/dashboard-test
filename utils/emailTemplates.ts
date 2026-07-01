type ContactUsRequest = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const BRAND_NAME = "GoFinance SIF";
const BRAND_FULL_NAME = "GoFinance Science Impactful Foundation";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return character;
    }
  });
}

function formatMultilineText(value: string) {
  return escapeHtml(value).replace(/\r?\n/g, "<br />");
}

function buildEmailShell({
  preheader,
  headline,
  intro,
  body,
  footer,
}: {
  preheader: string;
  headline: string;
  intro: string;
  body: string;
  footer: string;
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(headline)}</title>
</head>
<body style="margin:0;background:#f1f5f9;font-family:Arial,sans-serif;color:#0f172a;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    ${escapeHtml(preheader)}
  </div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:680px;background:#ffffff;border:1px solid #dbe4ee;border-radius:24px;overflow:hidden;box-shadow:0 18px 44px rgba(15,23,42,0.08);">
          <tr>
            <td style="padding:28px 32px;background:#0f172a;color:#ffffff;">
              <div style="font-size:12px;letter-spacing:0.14em;text-transform:uppercase;opacity:0.78;">${BRAND_NAME}</div>
              <div style="margin-top:10px;font-size:28px;line-height:1.15;font-weight:700;">${escapeHtml(headline)}</div>
              <div style="margin-top:10px;font-size:15px;line-height:1.7;opacity:0.9;">${escapeHtml(intro)}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 16px;">
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 28px;">
              <div style="border-top:1px solid #e2e8f0;padding-top:18px;font-size:13px;line-height:1.7;color:#475569;">
                ${escapeHtml(footer)}
              </div>
            </td>
          </tr>
        </table>
        <div style="padding:14px 12px 0;font-size:12px;line-height:1.6;color:#64748b;">
          ${escapeHtml(BRAND_FULL_NAME)}
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildFieldRow(label: string, value: string) {
  return `<tr>
    <td style="padding:0 0 10px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;">${escapeHtml(label)}</td>
    <td style="padding:0 0 10px;font-size:15px;line-height:1.7;color:#0f172a;font-weight:600;">${escapeHtml(value)}</td>
  </tr>`;
}

export function buildContactUsEmail({
  name,
  email,
  subject,
  message,
}: ContactUsRequest) {
  return buildEmailShell({
    preheader: `New contact message from ${name}`,
    headline: "New Contact Message",
    intro: "A visitor just reached out through the GoFinance SIF contact form.",
    footer:
      "Reply directly to the sender using the email address above. The message below is formatted for quick review.",
    body: `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
        ${buildFieldRow("Name", name)}
        ${buildFieldRow("Email", email)}
        ${buildFieldRow("Subject", subject)}
      </table>
      <div style="margin-top:18px;border:1px solid #dbe4ee;border-radius:18px;background:#f8fafc;padding:20px;">
        <div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;font-weight:700;">Message</div>
        <div style="margin-top:12px;font-size:15px;line-height:1.85;color:#0f172a;white-space:normal;">${formatMultilineText(message)}</div>
      </div>
    `,
  });
}

export function buildMenteeWelcomeEmail(firstName: string) {
  const safeFirstName = escapeHtml(firstName);

  return buildEmailShell({
    preheader: "Your mentee registration was received",
    headline: "Registration Received",
    intro: `Hello ${safeFirstName}, your mentorship registration has been received successfully.`,
    footer:
      "Your account is currently awaiting approval. If you did not submit this request, please contact support.",
    body: `
      <div style="font-size:15px;line-height:1.9;color:#0f172a;">
        <p style="margin:0 0 14px;">Thank you for registering with GoFinance SIF.</p>
        <p style="margin:0 0 14px;">We have received your details and will review your application shortly. Once your account is approved, you will be able to continue with the mentorship process.</p>
        <div style="margin:22px 0 0;border-left:4px solid #1d4ed8;background:#eff6ff;padding:16px 18px;border-radius:0 14px 14px 0;">
          <p style="margin:0;font-size:14px;line-height:1.8;color:#1e3a8a;font-weight:600;">Next step: wait for approval from the GoFinance SIF team.</p>
        </div>
      </div>
    `,
  });
}

export function buildMenteeApprovalEmail({
  name,
  dashboardUrl,
}: {
  name: string;
  dashboardUrl: string;
}) {
  const safeName = escapeHtml(name || "there");
  const safeDashboardUrl = escapeHtml(dashboardUrl);

  return buildEmailShell({
    preheader: "Your mentee registration has been approved",
    headline: "Registration Approved",
    intro: `Congratulations ${safeName}, your mentorship account is now active.`,
    footer:
      "You can now sign in to continue your mentorship journey and track your progress.",
    body: `
      <div style="font-size:15px;line-height:1.9;color:#0f172a;">
        <p style="margin:0 0 14px;">Your mentee registration has been approved by the GoFinance SIF team.</p>
        <p style="margin:0 0 18px;">You can now access your dashboard, view your program, and continue with the next steps in your mentorship journey.</p>
        <div style="margin:22px 0 18px;text-align:center;">
          <a href="${safeDashboardUrl}" target="_blank" rel="noreferrer" style="display:inline-block;border-radius:9999px;background:#1d4ed8;padding:14px 22px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">
            Open Dashboard
          </a>
        </div>
      </div>
    `,
  });
}

export function buildMenteeStatusUpdateEmail({
  name,
  status,
  dashboardUrl,
}: {
  name: string;
  status: string;
  dashboardUrl?: string;
}) {
  const safeName = escapeHtml(name || "there");
  const safeStatus = escapeHtml(status);
  const safeDashboardUrl = dashboardUrl ? escapeHtml(dashboardUrl) : "";

  return buildEmailShell({
    preheader: `Your mentee account status is now ${safeStatus}`,
    headline: "Account Status Updated",
    intro: `Hello ${safeName}, your account status is now ${safeStatus}.`,
    footer:
      "If you have questions about this update, please contact the GoFinance SIF team.",
    body: `
      <div style="font-size:15px;line-height:1.9;color:#0f172a;">
        <p style="margin:0 0 14px;">Your mentorship account has been updated successfully.</p>
        <div style="margin:18px 0 18px;border:1px solid #dbe4ee;border-radius:18px;background:#f8fafc;padding:16px 18px;">
          <p style="margin:0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;font-weight:700;">Current Status</p>
          <p style="margin:10px 0 0;font-size:22px;line-height:1.25;font-weight:800;color:#0f172a;">${safeStatus}</p>
        </div>
        ${
          dashboardUrl
            ? `<div style="margin:22px 0 18px;text-align:center;">
                <a href="${safeDashboardUrl}" target="_blank" rel="noreferrer" style="display:inline-block;border-radius:9999px;background:#1d4ed8;padding:14px 22px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">
                  Open Dashboard
                </a>
              </div>`
            : ""
        }
      </div>
    `,
  });
}

export function buildVerificationEmail(url: string) {
  const safeUrl = escapeHtml(url);

  return buildEmailShell({
    preheader: "Verify your GoFinance SIF email address",
    headline: "Verify Your Email",
    intro: "One more step to secure your account.",
    footer:
      "If you did not create this account, you can safely ignore this email.",
    body: `
      <div style="font-size:15px;line-height:1.9;color:#0f172a;">
        <p style="margin:0 0 14px;">Please verify your email address to activate your GoFinance SIF account.</p>
        <p style="margin:0 0 18px;">Click the button below to confirm your email and continue.</p>
        <div style="margin:22px 0 18px;text-align:center;">
          <a href="${safeUrl}" target="_blank" rel="noreferrer" style="display:inline-block;border-radius:9999px;background:#1d4ed8;padding:14px 22px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">
            Verify Email
          </a>
        </div>
        <p style="margin:0;color:#334155;">If the button does not work, open this link in your browser:</p>
        <p style="margin:10px 0 0;word-break:break-all;font-size:13px;line-height:1.8;color:#1d4ed8;">${safeUrl}</p>
      </div>
    `,
  });
}

export function buildForgotPasswordCodeEmail({
  name,
  code,
  expiresInMinutes,
}: {
  name: string;
  code: string;
  expiresInMinutes: number;
}) {
  const safeName = escapeHtml(name || "there");
  const safeCode = escapeHtml(code);
  const safeExpiry = escapeHtml(String(expiresInMinutes));

  return buildEmailShell({
    preheader: "Use this code to continue your password reset",
    headline: "Password Reset Code",
    intro: `Hello ${safeName}, use the code below to continue resetting your password.`,
    footer:
      "If you did not request a password reset, you can safely ignore this email.",
    body: `
      <div style="font-size:15px;line-height:1.9;color:#0f172a;">
        <p style="margin:0 0 16px;">Enter this 8-character alphanumeric code on the password reset page:</p>
        <div style="margin:20px 0 18px;padding:18px 20px;border-radius:18px;background:#eff6ff;border:1px solid #bfdbfe;text-align:center;">
          <div style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#1d4ed8;font-weight:700;">Reset Code</div>
          <div style="margin-top:10px;font-size:34px;line-height:1.1;letter-spacing:0.2em;font-weight:800;color:#0f172a;">${safeCode}</div>
        </div>
        <p style="margin:0;color:#334155;">This code expires in ${safeExpiry} minutes.</p>
      </div>
    `,
  });
}

export function buildPasswordResetSuccessEmail(name: string) {
  const safeName = escapeHtml(name || "there");

  return buildEmailShell({
    preheader: "Your password was changed successfully",
    headline: "Password Updated",
    intro: `Hello ${safeName}, your password has been updated successfully.`,
    footer:
      "If you did not make this change, please contact support as soon as possible.",
    body: `
      <div style="font-size:15px;line-height:1.9;color:#0f172a;">
        <p style="margin:0 0 14px;">Your password reset is complete.</p>
        <p style="margin:0 0 14px;">For security, we signed you out of your active sessions. You can now sign in again with your new password.</p>
        <div style="margin:22px 0 0;border-left:4px solid #0f172a;background:#f8fafc;padding:16px 18px;border-radius:0 14px 14px 0;">
          <p style="margin:0;font-size:14px;line-height:1.8;color:#334155;font-weight:600;">If this was not you, please reach out to the GoFinance SIF team immediately.</p>
        </div>
      </div>
    `,
  });
}

export function buildProgramApplicationMenteeSuccessEmail({
  name,
  programName,
  dashboardUrl,
}: {
  name: string;
  programName: string;
  dashboardUrl: string;
}) {
  const safeName = escapeHtml(name || "there");
  const safeProgramName = escapeHtml(programName);
  const safeDashboardUrl = escapeHtml(dashboardUrl);

  return buildEmailShell({
    preheader: "Your program application was submitted successfully",
    headline: "Application Submitted",
    intro: `Congratulations ${safeName}, you are all set for ${safeProgramName}.`,
    footer:
      "Your application is ready to go. Check your dashboard anytime for program and mentor updates.",
    body: `
      <div style="font-size:15px;line-height:1.9;color:#0f172a;">
        <p style="margin:0 0 14px;">Everything is in place for your next step with GoFinance SIF.</p>
        <p style="margin:0 0 18px;">Use the button below to open your dashboard whenever you are ready.</p>
        <div style="margin:22px 0 18px;text-align:center;">
          <a href="${safeDashboardUrl}" target="_blank" rel="noreferrer" style="display:inline-block;border-radius:9999px;background:#1d4ed8;padding:14px 22px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">
            Go to Dashboard
          </a>
        </div>
        <p style="margin:0;color:#334155;">Program: <strong>${safeProgramName}</strong></p>
      </div>
    `,
  });
}

export function buildProgramApplicationMentorNoticeEmail({
  mentorName,
  menteeName,
  menteeEmail,
  programName,
  mentorScoresUrl,
}: {
  mentorName?: string;
  menteeName: string;
  menteeEmail: string;
  programName: string;
  mentorScoresUrl: string;
}) {
  const safeMentorName = escapeHtml(mentorName || "mentor");
  const safeMenteeName = escapeHtml(menteeName);
  const safeMenteeEmail = escapeHtml(menteeEmail);
  const safeProgramName = escapeHtml(programName);
  const safeMentorScoresUrl = escapeHtml(mentorScoresUrl);

  return buildEmailShell({
    preheader: `${safeMenteeName} applied for ${safeProgramName}`,
    headline: "New Program Application",
    intro: `Hello ${safeMentorName}, a new mentee application is ready for you.`,
    footer:
      "Open your mentor scores page to view the application and continue from there.",
    body: `
      <div style="font-size:15px;line-height:1.9;color:#0f172a;">
        <p style="margin:0 0 14px;">A mentee has just applied for a program you are mentoring.</p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
          ${buildFieldRow("Mentee", safeMenteeName)}
          ${buildFieldRow("Email", safeMenteeEmail)}
          ${buildFieldRow("Program", safeProgramName)}
        </table>
        <div style="margin:22px 0 18px;display:flex;gap:12px;flex-wrap:wrap;">
          <a href="${safeMentorScoresUrl}" target="_blank" rel="noreferrer" style="display:inline-block;border-radius:9999px;background:#0f172a;padding:14px 22px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">
            Open Mentor Scores
          </a>
        </div>
      </div>
    `,
  });
}

export function buildEventCreatedMenteeNoticeEmail({
  name,
  programName,
  eventTitle,
  eventGeneratedId,
  eventDescription,
  eventNote,
  venue,
  eventDate,
  eventTime,
  dashboardUrl,
}: {
  name: string;
  programName: string;
  eventTitle: string;
  eventGeneratedId: string;
  eventDescription?: string;
  eventNote?: string;
  venue: string;
  eventDate: Date;
  eventTime: string;
  dashboardUrl: string;
}) {
  const safeName = escapeHtml(name || "there");
  const safeProgramName = escapeHtml(programName);
  const safeEventTitle = escapeHtml(eventTitle);
  const safeEventGeneratedId = escapeHtml(eventGeneratedId);
  const safeEventDescription = escapeHtml(
    eventDescription || "No additional instructions were added.",
  );
  const safeEventNote = escapeHtml(eventNote || "No note was added.");
  const safeVenue = escapeHtml(venue || "No venue provided.");
  const safeEventDate = escapeHtml(
    eventDate.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  );
  const safeEventTime = escapeHtml(eventTime);
  const safeDashboardUrl = escapeHtml(dashboardUrl);

  return buildEmailShell({
    preheader: `A new event has been added to ${safeProgramName}`,
    headline: "New Event Added",
    intro: `Hello ${safeName}, a new event is now available in your program.`,
    footer:
      "Open your dashboard to review the new event and keep track of your mentorship progress.",
    body: `
      <div style="font-size:15px;line-height:1.9;color:#0f172a;">
        <p style="margin:0 0 14px;">A new event has been added to your mentorship program.</p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
          ${buildFieldRow("Program", safeProgramName)}
          ${buildFieldRow("Event", safeEventTitle)}
          ${buildFieldRow("Event ID", safeEventGeneratedId)}
          ${buildFieldRow("Venue", safeVenue)}
          ${buildFieldRow("Date", safeEventDate)}
          ${buildFieldRow("Time", safeEventTime)}
        </table>
        <div style="margin:18px 0 0;border:1px solid #dbe4ee;border-radius:18px;background:#f8fafc;padding:18px 20px;">
          <div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;font-weight:700;">What to know</div>
          <div style="margin-top:10px;font-size:15px;line-height:1.85;color:#0f172a;">${safeEventDescription}</div>
          <div style="margin-top:12px;font-size:13px;line-height:1.8;color:#475569;">${safeEventNote}</div>
        </div>
        <div style="margin:22px 0 18px;text-align:center;">
          <a href="${safeDashboardUrl}" target="_blank" rel="noreferrer" style="display:inline-block;border-radius:9999px;background:#1d4ed8;padding:14px 22px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">
            Open Dashboard
          </a>
        </div>
      </div>
    `,
  });
}

export function buildEventCreatedMentorNoticeEmail({
  name,
  programName,
  eventTitle,
  eventGeneratedId,
  eventDescription,
  eventNote,
  venue,
  eventDate,
  eventTime,
  dashboardUrl,
}: {
  name: string;
  programName: string;
  eventTitle: string;
  eventGeneratedId: string;
  eventDescription?: string;
  eventNote?: string;
  venue: string;
  eventDate: Date;
  eventTime: string;
  dashboardUrl: string;
}) {
  const safeName = escapeHtml(name || "mentor");
  const safeProgramName = escapeHtml(programName);
  const safeEventTitle = escapeHtml(eventTitle);
  const safeEventGeneratedId = escapeHtml(eventGeneratedId);
  const safeEventDescription = escapeHtml(
    eventDescription || "No additional instructions were added.",
  );
  const safeEventNote = escapeHtml(eventNote || "No note was added.");
  const safeVenue = escapeHtml(venue || "No venue provided.");
  const safeEventDate = escapeHtml(
    eventDate.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  );
  const safeEventTime = escapeHtml(eventTime);
  const safeDashboardUrl = escapeHtml(dashboardUrl);

  return buildEmailShell({
    preheader: `A new event has been created for ${safeProgramName}`,
    headline: "Event Created",
    intro: `Hello ${safeName}, a new event has been created for your program.`,
    footer: "Review the new event and guide your mentees accordingly.",
    body: `
      <div style="font-size:15px;line-height:1.9;color:#0f172a;">
        <p style="margin:0 0 14px;">A new event is now available for the program you support.</p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
          ${buildFieldRow("Program", safeProgramName)}
          ${buildFieldRow("Event", safeEventTitle)}
          ${buildFieldRow("Event ID", safeEventGeneratedId)}
          ${buildFieldRow("Venue", safeVenue)}
          ${buildFieldRow("Date", safeEventDate)}
          ${buildFieldRow("Time", safeEventTime)}
        </table>
        <div style="margin:18px 0 0;border-left:4px solid #0f172a;background:#f8fafc;padding:16px 18px;border-radius:0 14px 14px 0;">
          <p style="margin:0;font-size:14px;line-height:1.85;color:#334155;">${safeEventDescription}</p>
          <p style="margin:12px 0 0;font-size:13px;line-height:1.8;color:#475569;">${safeEventNote}</p>
        </div>
        <div style="margin:22px 0 18px;text-align:center;">
          <a href="${safeDashboardUrl}" target="_blank" rel="noreferrer" style="display:inline-block;border-radius:9999px;background:#0f172a;padding:14px 22px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">
            Open Mentor Workspace
          </a>
        </div>
      </div>
    `,
  });
}

export function buildEventUpdatedMenteeNoticeEmail({
  name,
  programName,
  eventTitle,
  eventGeneratedId,
  eventDescription,
  eventNote,
  venue,
  eventDate,
  eventTime,
  dashboardUrl,
}: {
  name: string;
  programName: string;
  eventTitle: string;
  eventGeneratedId: string;
  eventDescription?: string;
  eventNote?: string;
  venue: string;
  eventDate: Date;
  eventTime: string;
  dashboardUrl: string;
}) {
  const safeName = escapeHtml(name || "there");
  const safeProgramName = escapeHtml(programName);
  const safeEventTitle = escapeHtml(eventTitle);
  const safeEventGeneratedId = escapeHtml(eventGeneratedId);
  const safeEventDescription = escapeHtml(
    eventDescription || "No additional instructions were added.",
  );
  const safeEventNote = escapeHtml(eventNote || "No note was added.");
  const safeVenue = escapeHtml(venue || "No venue provided.");
  const safeEventDate = escapeHtml(
    eventDate.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  );
  const safeEventTime = escapeHtml(eventTime);
  const safeDashboardUrl = escapeHtml(dashboardUrl);

  return buildEmailShell({
    preheader: `An event in ${safeProgramName} was updated`,
    headline: "Event Updated",
    intro: `Hello ${safeName}, an event in your program has been updated.`,
    footer:
      "Open your dashboard to review the latest event details and stay on track.",
    body: `
      <div style="font-size:15px;line-height:1.9;color:#0f172a;">
        <p style="margin:0 0 14px;">One of your program events has been updated.</p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
          ${buildFieldRow("Program", safeProgramName)}
          ${buildFieldRow("Event", safeEventTitle)}
          ${buildFieldRow("Event ID", safeEventGeneratedId)}
          ${buildFieldRow("Venue", safeVenue)}
          ${buildFieldRow("Date", safeEventDate)}
          ${buildFieldRow("Time", safeEventTime)}
        </table>
        <div style="margin:18px 0 0;border:1px solid #dbe4ee;border-radius:18px;background:#f8fafc;padding:18px 20px;">
          <div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;font-weight:700;">Updated details</div>
          <div style="margin-top:10px;font-size:15px;line-height:1.85;color:#0f172a;">${safeEventDescription}</div>
          <div style="margin-top:12px;font-size:13px;line-height:1.8;color:#475569;">${safeEventNote}</div>
        </div>
        <div style="margin:22px 0 18px;text-align:center;">
          <a href="${safeDashboardUrl}" target="_blank" rel="noreferrer" style="display:inline-block;border-radius:9999px;background:#1d4ed8;padding:14px 22px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">
            Open Dashboard
          </a>
        </div>
      </div>
    `,
  });
}

export function buildEventUpdatedMentorNoticeEmail({
  name,
  programName,
  eventTitle,
  eventGeneratedId,
  eventDescription,
  eventNote,
  venue,
  eventDate,
  eventTime,
  dashboardUrl,
}: {
  name: string;
  programName: string;
  eventTitle: string;
  eventGeneratedId: string;
  eventDescription?: string;
  eventNote?: string;
  venue: string;
  eventDate: Date;
  eventTime: string;
  dashboardUrl: string;
}) {
  const safeName = escapeHtml(name || "mentor");
  const safeProgramName = escapeHtml(programName);
  const safeEventTitle = escapeHtml(eventTitle);
  const safeEventGeneratedId = escapeHtml(eventGeneratedId);
  const safeEventDescription = escapeHtml(
    eventDescription || "No additional instructions were added.",
  );
  const safeEventNote = escapeHtml(eventNote || "No note was added.");
  const safeVenue = escapeHtml(venue || "No venue provided.");
  const safeEventDate = escapeHtml(
    eventDate.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  );
  const safeEventTime = escapeHtml(eventTime);
  const safeDashboardUrl = escapeHtml(dashboardUrl);

  return buildEmailShell({
    preheader: `An event for ${safeProgramName} was updated`,
    headline: "Event Updated",
    intro: `Hello ${safeName}, an event for your program has been updated.`,
    footer:
      "Review the updated event details and guide your mentees accordingly.",
    body: `
      <div style="font-size:15px;line-height:1.9;color:#0f172a;">
        <p style="margin:0 0 14px;">An event you oversee has just been updated.</p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
          ${buildFieldRow("Program", safeProgramName)}
          ${buildFieldRow("Event", safeEventTitle)}
          ${buildFieldRow("Event ID", safeEventGeneratedId)}
          ${buildFieldRow("Venue", safeVenue)}
          ${buildFieldRow("Date", safeEventDate)}
          ${buildFieldRow("Time", safeEventTime)}
        </table>
        <div style="margin:18px 0 0;border-left:4px solid #0f172a;background:#f8fafc;padding:16px 18px;border-radius:0 14px 14px 0;">
          <p style="margin:0;font-size:14px;line-height:1.85;color:#334155;">${safeEventDescription}</p>
          <p style="margin:12px 0 0;font-size:13px;line-height:1.8;color:#475569;">${safeEventNote}</p>
        </div>
        <div style="margin:22px 0 18px;text-align:center;">
          <a href="${safeDashboardUrl}" target="_blank" rel="noreferrer" style="display:inline-block;border-radius:9999px;background:#0f172a;padding:14px 22px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">
            Open Mentor Workspace
          </a>
        </div>
      </div>
    `,
  });
}
