import twilio from "twilio";

let client = null;

function getClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) return null;
  if (!client) client = twilio(sid, token);
  return client;
}

function toWhatsAppNumber(phone = "") {
  let digits = String(phone).replace(/\D/g, "");
  const countryCode = (process.env.DEFAULT_COUNTRY_CODE || "91").replace(/\D/g, "");

  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length === 10) digits = countryCode + digits;

  return `whatsapp:+${digits}`;
}

export async function sendWelcomeWhatsApp({ name, phone, role }) {
  const twilioClient = getClient();
  let from = process.env.TWILIO_WHATSAPP_FROM;

  if (!twilioClient || !from) {
    console.warn("WhatsApp not configured. Skipping welcome message.");
    return false;
  }

  if (!from.startsWith("whatsapp:")) from = `whatsapp:${from}`;

  const roleText = role === "farmer" ? "farmer" : "buyer";
  const body =
    `🌾 Namaste ${name}!\n\n` +
    `Welcome to Apna-Anaj. Your ${roleText} account has been created successfully.\n\n` +
    `Thank you for joining us!`;

  await twilioClient.messages.create({
    from,
    to: toWhatsAppNumber(phone),
    body
  });

  return true;
}