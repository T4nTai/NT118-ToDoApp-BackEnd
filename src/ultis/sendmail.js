import { transporter } from '../config/mail.js';
import { generateInviteEmail } from '../ultis/invitation_email_template.js';



export async function sendNotificationEmail({ to, inviterName, targetType, targetName, role }) {
    const html = generateInviteEmail({
        receiverEmail: to,
        inviterName,
        targetType,
        targetName,
        role
    });

    await transporter.sendMail({
        from: process.env.NODEMAILER_USER,
        to,
        subject: `Thông báo tham gia ${targetType}: ${targetName}`,
        html
    });
}