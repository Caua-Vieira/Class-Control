import nodemailer from "nodemailer";
import { EmailService } from "../../domain/contracts/email/email-service";

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
            await this.transporter.sendMail({
                from: `"ClassControl" <${process.env.SMTP_USER}>`,
                to,
                subject,
                html: body,
            });
            console.log(`Email enviado para ${to}`);
        } catch (error) {
            console.error("Erro ao enviar email:", error);
            throw new Error("Falha no envio de e-mail");
        }
    }
}
