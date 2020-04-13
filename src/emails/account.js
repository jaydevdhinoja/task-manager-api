const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    const msg = {
        to: email,
        from: 'jaydev@gmail.com',
        subject: 'Welcome to Task Manager App',
        text: `Welcome to the Task Manager App, ${name}. Let me know how you get along with the app`
      };

    sgMail.send(msg)
    .then(() => {}, error => {
        console.error(error);
        
        if (error.response) {
            console.error(error.response.body)
        }
    });
}

const sendCancellationEmail = (email, name) => {
    const msg = {
        to: email,
        from: 'jaydev@gmail.com',
        subject: `Sorry to see you go! ${name} `,
        text: `Good bye ${name}!. I hope to see you again soon!`
      };

    sgMail.send(msg)
    .then(() => {}, error => {
        console.error(error);
        
        if (error.response) {
            console.error(error.response.body)
        }
    });
}

module.exports = {
    sendWelcomeEmail, sendCancellationEmail
}