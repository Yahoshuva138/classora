import { Session } from '../types';

export interface BroadcastTemplateOptions {
  session?: Session;
  customNote?: string;
  groupName?: string;
  crName?: string;
}

/**
 * Generate formatted WhatsApp markdown messages for class communication
 */
export function generateSessionReminderMessage(
  session: Session,
  crName: string = 'Yahoshuva Kesaboyina (English CR)'
): string {
  return `📢 *CLASS REMINDER: English Language & Communication Skills*
━━━━━━━━━━━━━━━━━━━━
📚 *Topic:* ${session.topic}
📅 *Date:* ${session.date}
⏰ *Time:* ${session.startTime} – ${session.endTime}
🏛 *Venue:* ${session.location || 'Lecture Hall 2 / SST Academic Block'}
👨‍🏫 *Faculty:* ${session.faculty}

📝 *Important Instructions:*
• Please arrive 5 minutes prior to the session start.
• Attendance will be marked punctually at the start of class.
• Ensure your preparatory readings for this module are reviewed.

✨ *Sent via Classora Course OS*
_Class Representative: ${crName}_`;
}

export function generateDiscussionGroupMessage(
  groupName: string,
  memberNames: string[],
  crName: string = 'Yahoshuva Kesaboyina (English CR)'
): string {
  const membersList = memberNames.map((name, i) => `  ${i + 1}. ${name}`).join('\n');

  return `👥 *DISCUSSION TEAM ANNOUNCEMENT: ${groupName.toUpperCase()}*
━━━━━━━━━━━━━━━━━━━━
📌 *Activity:* SES-110 Group Discussion 1
🎯 *Course:* English Language & Communication Skills

📋 *Allocated Team Members:*
${membersList}

💡 *Ground Rules for GD:*
1. Everyone must participate and voice their perspective.
2. Maintain professional, constructive vocabulary.
3. Elect one opening speaker and one summary presenter.

✨ *Sent via Classora Course OS*
_Class Representative: ${crName}_`;
}

export function generateAttendanceAdvisoryMessage(
  crName: string = 'Yahoshuva Kesaboyina (English CR)'
): string {
  return `⚠️ *ACADEMIC NOTICE: Attendance Threshold Regularisation*
━━━━━━━━━━━━━━━━━━━━
Dear SST 2026 Batchmates,

Please review your current attendance record on the *Classora Student Portal*.

📌 *University Mandate:*
• *Minimum 75% attendance* is strictly required for mid-term eligibility.
• *85%+ attendance* qualifies for the Certificate of Merit and distinction.

If you have excused absences, medical certificates, or university-duty ODs pending, please submit a regularisation request via the Student Portal before this Friday.

✨ *Sent via Classora Course OS*
_Class Representative: ${crName}_`;
}
