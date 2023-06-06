const nodemailer = require('nodemailer');

class EmailUtils {

    static async sendConfirmation(email, token) {
        const message = {};
        message.subject = 'Activate Email';
        message.html = `
        <div>
            <p>
                Confirm your email by following this <a href="http://localhost:3001/api/auth/activation/${token}" target="_blank">link</a>
            </p>
        </div>
        `;
        await this.sendMessage(email, message);
    }

    static async sendReset(email, token) {
        const message = {};
        message.subject = 'Reset Password';
        message.html = `
        <div>
            <p>
                Follow this <a href="http://localhost:3001/api/auth/password-reset/${token}" target="_blank">link</a> to reset your password
            </p>
        </div>
        `;
        await this.sendMessage(email, message);
    }

    static async sendMessage(email, message) {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
            
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: message.subject,
                text: '',
                html: message.html,
            });

            console.log("email sent sucessfully");
        } catch (error) {
            console.log("email not sent");
            console.log(error);
        }
    }
    
}

module.exports = EmailUtils;
