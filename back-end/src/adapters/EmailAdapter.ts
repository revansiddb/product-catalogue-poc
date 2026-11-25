import nodemailer from 'nodemailer';
import { EnquiryRequest, EmailProvider } from '../types/domain';

export class EmailAdapter implements EmailProvider {
  private transporter: nodemailer.Transporter;
  private fromEmail: string;
  private salesInboxEmail: string;

  constructor() {
    const host = process.env.SMTP_HOST ?? 'localhost';
    const port = process.env.SMTP_PORT ?? '1025';
    this.fromEmail = process.env.FROM_EMAIL ?? 'noreply@example.com';
    this.salesInboxEmail = process.env.SALES_INBOX_EMAIL ?? 'sales@example.com';

    this.transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: false,
    });
  }

  async sendEnquiry(enquiry: EnquiryRequest): Promise<void> {
    const text = [
      `Product Enquiry`,
      `---------------`,
      `Product ID   : ${enquiry.productId}`,
      `Product Title: ${enquiry.productTitle}`,
      ``,
      `From         : ${enquiry.name} <${enquiry.email}>`,
      ``,
      `Message:`,
      enquiry.message,
    ].join('\n');

    await this.transporter.sendMail({
      from: this.fromEmail,
      to: this.salesInboxEmail,
      subject: `Product Enquiry: ${enquiry.productTitle}`,
      text,
    });
  }
}
