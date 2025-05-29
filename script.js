document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const form = e.target;
  const name = form.name.value;
  const phone = form.phone.value;
  const type = form.type.value;
  const message = form.message.value;
  const photoFile = form.photo?.files[0]; // تأكد من وجود العنصر
  const submitBtn = form.querySelector("button[type='submit']");
  const statusMsg = document.getElementById("statusMsg");

  // تعطيل الزر مؤقتاً
  submitBtn.disabled = true;
  submitBtn.textContent = "⏳ جاري الإرسال...";
  statusMsg.textContent = "";

  // Google Sheets
  const sheetData = { name, phone, type, message };
  const sheetURL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

  fetch(sheetURL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sheetData)
  });

  // Telegram
  const telegramBotToken = "7934408364:AAGfsDSA-RvC0REdGK7r0ViW-rq69c7wqck";
  const telegramChatIds = ["5342929752"];
  const messageText = `
📩 رسالة جديدة من الموقع:

👤 الاسم: ${name}
📞 الهاتف: ${phone}
📂 النوع: ${type}
📝 الرسالة:
${message}
  `;

  const sendToTelegram = async () => {
    for (const chatId of telegramChatIds) {
      try {
        if (photoFile) {
          const formData = new FormData();
          formData.append("chat_id", chatId);
          formData.append("caption", messageText);
          formData.append("photo", photoFile);

          await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendPhoto`, {
            method: "POST",
            body: formData
          });
        } else {
          await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: chatId, text: messageText })
          });
        }
      } catch (error) {
        console.error("Telegram Error:", error);
      }
    }
  };

  sendToTelegram().finally(() => {
    statusMsg.textContent = "✅ تم إرسال رسالتك بنجاح!";
    form.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = " إرسال";
  });
});
