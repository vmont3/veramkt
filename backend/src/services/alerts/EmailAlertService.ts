/**
 * Email Alert Service - Send alerts via Email (SendGrid/AWS SES)
 *
 * Setup Option 1 - SendGrid:
 * 1. Create account at sendgrid.com
 * 2. Get API key
 * 3. Add to .env: SENDGRID_API_KEY=xxxxx, SENDGRID_FROM_EMAIL=noreply@vera.ai
 *
 * Setup Option 2 - AWS SES:
 * 1. Configure AWS SES
 * 2. Verify domain
 * 3. Add AWS credentials to .env
 */

export interface EmailAlert {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

export class EmailAlertService {
    private provider: 'sendgrid' | 'ses' | 'none';

    constructor() {
        // Determine which provider is configured
        if (process.env.SENDGRID_API_KEY) {
            this.provider = 'sendgrid';
        } else if (process.env.AWS_SES_REGION) {
            this.provider = 'ses';
        } else {
            this.provider = 'none';
            console.warn('[EmailAlertService] No email provider configured. Email alerts disabled.');
        }
    }

    /**
     * Send alert email
     */
    async sendAlert(alert: EmailAlert): Promise<boolean> {
        if (this.provider === 'none') {
            console.warn('[EmailAlertService] Cannot send email - no provider configured');
            return false;
        }

        if (this.provider === 'sendgrid') {
            return this.sendViaSendGrid(alert);
        } else if (this.provider === 'ses') {
            return this.sendViaAWSSES(alert);
        }

        return false;
    }

    /**
     * Send via SendGrid
     */
    private async sendViaSendGrid(alert: EmailAlert): Promise<boolean> {
        try {
            // TODO: Implement SendGrid integration
            // const sgMail = require('@sendgrid/mail');
            // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            // await sgMail.send({
            //     to: alert.to,
            //     from: process.env.SENDGRID_FROM_EMAIL,
            //     subject: alert.subject,
            //     html: alert.html,
            //     text: alert.text
            // });

            console.log(`[EmailAlertService] Email would be sent via SendGrid to ${alert.to}`);
            console.log(`Subject: ${alert.subject}`);
            return true;
        } catch (error: any) {
            console.error('[EmailAlertService] SendGrid error:', error.message);
            return false;
        }
    }

    /**
     * Send via AWS SES
     */
    private async sendViaAWSSES(alert: EmailAlert): Promise<boolean> {
        try {
            // TODO: Implement AWS SES integration
            // const AWS = require('aws-sdk');
            // const ses = new AWS.SES({ region: process.env.AWS_SES_REGION });
            // await ses.sendEmail({
            //     Source: process.env.AWS_SES_FROM_EMAIL,
            //     Destination: { ToAddresses: [alert.to] },
            //     Message: {
            //         Subject: { Data: alert.subject },
            //         Body: {
            //             Html: { Data: alert.html },
            //             Text: { Data: alert.text }
            //         }
            //     }
            // }).promise();

            console.log(`[EmailAlertService] Email would be sent via AWS SES to ${alert.to}`);
            console.log(`Subject: ${alert.subject}`);
            return true;
        } catch (error: any) {
            console.error('[EmailAlertService] AWS SES error:', error.message);
            return false;
        }
    }

    /**
     * Format hot lead alert HTML
     */
    formatHotLeadAlert(data: {
        visitorId: string;
        totalScore: number;
        stage: string;
        lastSeen: Date;
        highValueActions: number;
        dashboardUrl?: string;
    }): { subject: string; html: string; text: string } {
        const subject = `🔥 Hot Lead Detected - Score: ${data.totalScore}/100`;

        const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 24px; }
        .metric { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0; }
        .metric-label { color: #6c757d; font-size: 12px; text-transform: uppercase; }
        .metric-value { color: #212529; font-size: 18px; font-weight: bold; }
        .cta { background: #007bff; color: white; padding: 15px 30px; text-align: center; border-radius: 8px; text-decoration: none; display: inline-block; margin-top: 20px; }
        .footer { text-align: center; color: #6c757d; font-size: 12px; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔥 Hot Lead Detected!</h1>
        </div>

        <p>A visitor with high buying intent has been detected on your website:</p>

        <div class="metric">
            <div class="metric-label">Visitor ID</div>
            <div class="metric-value">${data.visitorId.substring(0, 30)}...</div>
        </div>

        <div class="metric">
            <div class="metric-label">Intent Score</div>
            <div class="metric-value">${data.totalScore}/100</div>
        </div>

        <div class="metric">
            <div class="metric-label">Stage</div>
            <div class="metric-value">${data.stage.toUpperCase()}</div>
        </div>

        <div class="metric">
            <div class="metric-label">High-Value Actions</div>
            <div class="metric-value">${data.highValueActions}</div>
        </div>

        <div class="metric">
            <div class="metric-label">Last Seen</div>
            <div class="metric-value">${data.lastSeen.toLocaleString('pt-BR')}</div>
        </div>

        ${data.dashboardUrl ? `
        <a href="${data.dashboardUrl}" class="cta">View in Dashboard</a>
        ` : ''}

        <div class="footer">
            <p>This is an automated alert from VERA Marketing AI</p>
            <p>&copy; 2026 VERA - All rights reserved</p>
        </div>
    </div>
</body>
</html>
        `.trim();

        const text = `
🔥 HOT LEAD DETECTED!

Visitor: ${data.visitorId.substring(0, 30)}...
Intent Score: ${data.totalScore}/100
Stage: ${data.stage.toUpperCase()}
High-Value Actions: ${data.highValueActions}
Last Seen: ${data.lastSeen.toLocaleString('pt-BR')}

Action Required: Contact this lead immediately!

${data.dashboardUrl ? `View in dashboard: ${data.dashboardUrl}` : ''}
        `.trim();

        return { subject, html, text };
    }

    /**
     * Test connection
     */
    async testConnection(email: string): Promise<boolean> {
        return this.sendAlert({
            to: email,
            subject: '✅ VERA Alert System Connected!',
            html: '<p>You will now receive hot lead notifications via email.</p>',
            text: 'You will now receive hot lead notifications via email.'
        });
    }
}

// Singleton
export const emailAlertService = new EmailAlertService();
