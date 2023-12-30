import { tg } from './constants';

export const sendBotMessage = ({ phone, name, site, comment }) => {
  const BASE_URL = `https://api.telegram.org/bot${tg.token}/sendMessage?chat_id=${tg.chat_id}&text=`;
  const textMessage = `<strong>Yangi ariza !</strong>${tg.lineBreak}${tg.lineBreak}<a href="${site}">Quduq nazorati</a> saytidan${
    tg.lineBreak
  }Mijoz telefon raqami:<span class="tg-spoiler">%20%2B${phone}</span>${tg.lineBreak}Mijoz ismi:<u>%20${name}</u>${
    comment.length ? tg.lineBreak + 'Mijoz murojaati: ' + encodeURI(comment) : ''
  }&parse_mode=html`;
  return BASE_URL + textMessage;
};

export const sendEditedWells = ({ phone, wellName, adminName, adminId, site = location.origin || window.location.origin, wellId = '' }) => {
  const BASE_URL = `https://api.telegram.org/bot${tg.token}/sendMessage?chat_id=${tg.chat_id}&text=`;
  const textMessage = `<strong>Quduq malu'motlarida o'zgarish !</strong>${tg.lineBreak}${tg.lineBreak}<a href="${site}">Quduq nazorati</a> saytidan${tg.lineBreak}Admin ID'si:<span class="tg-spoiler">${adminId}</span>${tg.lineBreak}Admin Ismi:<span class="tg-spoiler"> ${adminName}</span>${tg.lineBreak}Quduq nomi:<u><a href="${site}/wells/${wellId}">%20${wellName}</a></u>${tg.lineBreak}Quduqga biriktirilgan telefon raqami: ${phone}&parse_mode=html`;
  return BASE_URL + textMessage;
};

export function getFormData(object) {
  const formData = new FormData();
  Object.keys(object).forEach((key) => formData.append(key, object[key]));
  return formData;
}
