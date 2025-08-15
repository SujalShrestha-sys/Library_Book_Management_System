import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL,
            to,
            subject,
            text,
            html,
        })

        console.log("✅ Email sent to", to);
    } catch (error) {
        console.log(error);
    }
}

