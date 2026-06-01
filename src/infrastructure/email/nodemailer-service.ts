import nodemailer from "nodemailer";
import { EmailService } from "../../domain/contracts/email/email-service";
import { EmailSendException } from "../../domain/errors/errors";
import { logger } from "../config/logger";

export class NodemailerService implements EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendEmail(to: string, subject: string, body: string): Promise<void> {
        try {
            logger.info({ to, subject }, 'sending email');

            await this.transporter.sendMail({
                from: `"SmartTasksManagement" <${process.env.SMTP_USER}>`,
                to,
                subject,
                html: body,
            });

            logger.info({ to, subject }, 'email sent successfully');
        } catch (error) {
            logger.error({ to, subject, error: (error as Error).message }, 'failed to send email');
            throw new EmailSendException("Falha no envio de e-mail");
        }
    }
}
