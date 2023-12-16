const { html } = require("./main.js");
const config = require("config");

const ForgotPassword = (to, name, ButtonLink) => {
  const greeting = "Hi";
  const MainText = "Forgot your Password ? Click on the button below to reset your password";
  const DetailText = [];

  const ButtonText = "Forgot Password";
  const subject = "Forgot Password!";

  const htmlCode = html(greeting, name, MainText, DetailText, ButtonText, ButtonLink);
  return {
    to: to,
    from: config.get("user"),
    subject: subject,
    attachments: [],
    html: htmlCode,
  };
};

module.exports = ForgotPassword;
