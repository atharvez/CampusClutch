const Notification = require('../models/Notification');
const sendEmail = require('./sendEmail');

/**
 * Helper to create an in-app notification and optionally send an email alert.
 */
const createNotification = async ({ recipient, sender, type, message, link, emailSubject, emailHtml }) => {
    try {
        // 1. Create In-App Notification
        const notification = await Notification.create({
            recipient,
            sender,
            type,
            message,
            link
        });

        // 2. Send Secondary Email Alert if recipient has email (we need to populate/know it)
        // Note: For email, we assume we're passed the target email directly or the user object
        if (recipient.email) {
            await sendEmail({
                email: recipient.email,
                subject: emailSubject || message,
                html: emailHtml || `<p>${message}</p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}${link}">View on CampusClutch</a>`
            });
        }

        return notification;
    } catch (error) {
        console.error('Error creating notification:', error.message);
    }
};

module.exports = createNotification;
