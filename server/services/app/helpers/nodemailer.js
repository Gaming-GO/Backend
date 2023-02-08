const nodemailer = require("nodemailer");

async function emailSender(sendTo,subject,description) {
    try {
        // let transporter = nodemailer.createTransport({
        //     service: "Gmail",
        //     auth: {
        //         user: "ruendyant.mayraclle@gmail.com",
        //         pass: "myxlvlblzwsqjfxo"
        //     },
        //   });

        let transporter = nodemailer.createTransport({
            // host: "smtp.live.com", // hostname
            // host: "smtp.office365.com",
            service:"hotmail",
            // secureConnection: false, // TLS requires secureConnection to be false
            // port: 587, // port for secure SMTP
            // tls: {
            //    ciphers:'SSLv3'
            // },
            auth: {
                user: 'GamingGoGG@outlook.com',
                pass: 'gyqvgevukaqlmpsh'
            }
        });
    
          let mailOptions = {
            from: "GamingGoGG@outlook.com",
            to: sendTo,
            subject: subject,
            text: description
          };
          
          await transporter.sendMail(mailOptions)
    } catch (error) {
        console.log(error);
    }
}

// emailSender("","fjdslfjssjf","dfjljsdflsjfldasf")

module.exports = emailSender;