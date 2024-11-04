import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class NotificationService {

    private readonly templatesDir = path.resolve(process.cwd(), 'src/assets/notification');

    constructor(private readonly mailerService: MailerService) { }

    async sendNotificationEmail(email: string, subject: string, content: string) {
        try {
            const htmlTemplate = await this.loadHtmlTemplate('notification-template.html');
            const personalizedTemplate = htmlTemplate.replace('{{ content }}', content);
    
            await this.mailerService.sendMail({
                to: email,
                subject: subject,
                html: personalizedTemplate,
            });
        } catch (error) {
            throw new Error(`Error al enviar email: ${error.message}`);
        }
    }
    

    private async loadHtmlTemplate(templateName: string): Promise<string> {
        const templatePath = path.join(this.templatesDir, templateName);
        try {
            const content = await fs.promises.readFile(templatePath, 'utf8');
            return content;
        } catch (error) {
            throw new Error(`Error al cargar la plantilla: ${error.message}`);
        }
    }
    
    
    
}
