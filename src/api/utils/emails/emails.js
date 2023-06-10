const Mail = require("../../model/email.model");
const { emailAdd, mailgunDomain, mailgunApi } = require("../../../config/vars");

//send email to mentioned users
exports.sendEmail = async (
  email = "",
  type = "",
  content = null,
  subject = ""
) => {
  try {
    if (email !== "") {
      const getTemplate = await Mail.findOne({ type });
      console.log("email found",getTemplate)
      if (getTemplate) {
       
        var mailgun = require("mailgun-js")({
          apiKey: mailgunApi,
          domain: mailgunDomain,
        });
        let sub = "";
        if (subject) {
          sub = subject;
        } else {
          sub = getTemplate.subject;
        }
        const msg = {
          to: email,
          from: emailAdd,
          subject: sub,
          html: getHtml(getTemplate, content),
        };

        mailgun.messages().send(msg, function (err, body) {
          if (err) {
            console.log("tll error", err);
          } else {
            console.log("succes send ");
          }
        });
      }
    }
  } catch (e) {}
};

function getHtml(getTemplate, content) {
  let text = getTemplate.text;
  if (content) {
    console.log("content: ",Object.keys(content))
    // for (let key in content) {
      text = `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2"><div style="margin:50px auto;width:70%;padding:20px 0"><div style="border-bottom:1px solid #eee"><a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Your Brand</a></div><p style="font-size:1.1em">Hi,</p><p>Thank you for choosing Your Brand. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p><h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${content?.otp}</h2><p style="font-size:0.9em;">Regards,<br />Your Brand</p><hr style="border:none;border-top:1px solid #eee" /><div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300"><p>Your Brand Inc</p><p>1600 Amphitheatre Parkway</p><p>California</p></div></div></div>`;
    //   text = `<p>${content[key]}</p>`
    //   // text.concat( "'" + `${content[key]}` + "'");
    // }
  }
console.log("this will be text",text)
  return text;
}
