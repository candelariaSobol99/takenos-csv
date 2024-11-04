import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class NotificationService {


    constructor(private readonly mailerService: MailerService) { }

    async sendNotificationEmail(email: string, subject: string, content: string) {
        try {
            const htmlTemplate = this.getHtmlTemplate();
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
    

    private getHtmlTemplate(): string {
        return `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Nueva notificación</title>
                <style>
                    .email-container {
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        border: 1px solid rgb(201, 201, 201);
                        width: min-content;
                    }
                    img {
                        height: 100px;
                        width: 264px;
                        margin-left: 167px;
                    }
                    .logo-container {
                        width: 600px;
                        margin: 0 auto;
                        margin-bottom: 20px;
                    }
                    .detail {
                        font-size: 15px;
                        width: 600px;
                        margin: 0 auto;
                        text-align: center;
                        margin-bottom: 25px;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="logo-container">
                        <img src="https://cdn.prod.website-files.com/6527d4bd6b69f1cc1b43a656/6527eb442dddd2674a0dd8f7_takenos%20main%20logo.png" alt="takenos-logo">
                    </div>
                    <div class="content">
                        <div class="detail">
                            <h1>¡Hola!</h1>
                            <div style="margin-top: 15px;">Recibiste una notificación</div>
                        </div>
                        <div class="detail" style="border: 1px solid rgb(201, 201, 201); width: fit-content; padding: 0 30px; border-radius: 8px;">
                            <p>{{ content }}</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
    }
    
    
    
}
