const { html } = require("./main.js");
const config = require("config");

const EmailConfirm = (to, name, ButtonLink) => {
  const greeting = "Hi";
  const MainText = "Verify your Email address, Click on the button below to verify your Email address";
  const DetailText = [
    {
      bold: "Step 1",
      text: "Click on the button below to verify your email address",
    },
  ];

  const ButtonText = "Verify";
  const subject = "Verify your Email";

  const htmlCode = html(greeting, name, MainText, DetailText, ButtonText, ButtonLink);
  return {
    to: to,
    from: config.get("user"),
    subject: subject,
    attachments: [],
    html: htmlCode,
  };
};

module.exports = EmailConfirm;
