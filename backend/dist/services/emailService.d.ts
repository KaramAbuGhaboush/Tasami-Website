interface ContactMessage {
    name: string;
    email: string;
    company?: string;
    message: string;
    service: string;
    budget: string;
    createdAt: Date;
}
declare class EmailService {
    private transporter;
    constructor();
    sendContactNotification(contactMessage: ContactMessage): Promise<void>;
    private generateContactEmailHTML;
    private generateContactEmailText;
    testConnection(): Promise<boolean>;
}
export default EmailService;
//# sourceMappingURL=emailService.d.ts.map