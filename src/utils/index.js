import { BASE_URL_TG } from './constants';

export const sendBotMessage = ({ phone, name, site, comment }) => {
  const textMessage =
    encodeURI(
      `Yangi ariza !\n\n<a href="${site}">Quduq nazorati saytidan </a>\nMijoz telefon raqami:<span class="tg-spoiler"> ${phone}</span>\nMijoz ismi: ${name}\nMijoz murojaati: ${comment}`
    ) + '&parse_mode=html';
  return BASE_URL_TG + textMessage;
};

export const sendEditedWells = ({ phone, wellName, adminName, adminId, site = location.origin || window.location.origin, wellId = '' }) => {
  const textMessage = encodeURI(
    `<strong>Quduq malu'motlarida o'zgarish !</strong>\n\n<a href="${site}">Quduq nazorati</a> saytidan\nAdmin ID'si:<span class="tg-spoiler">${adminId}</span>\nAdmin Ismi:<span class="tg-spoiler"> ${adminName}</span>\nQuduq nomi:<u><a href="${site}/wells/${wellId}">${wellName}</a></u>\nQuduqga biriktirilgan telefon raqami: <span class="tg-spoiler">${phone}</span>&parse_mode=html`
  );
  return BASE_URL_TG + textMessage;
};

export const sendDeletedWells = ({
  phone,
  wellName,
  adminName,
  adminId,
  site = location.origin || window.location.origin,
  wellId = ''
}) => {
  const textMessage = encodeURI(
    `<strong color="red">Quduq o'chirib tashlandi !</strong>\n\n<a href="${site}">Quduq nazorati</a> saytidan\nAdmin ID'si:<span class="tg-spoiler">${adminId}</span>\nAdmin Ismi:<span class="tg-spoiler"> ${adminName}</span>\nQuduq nomi:<u><a href="${site}/wells/${wellId}">${wellName}</a></u>\nQuduqga biriktirilgan telefon raqami: <span class="tg-spoiler">${phone}</span>&parse_mode=html`
  );
  return BASE_URL_TG + textMessage;
};

// export const userCreatedMessage = ({ phone, adminName, adminId }) => {
//   const textMessage = encodeURI(`<strong>Yangi nazoratchi qo'shildi</strong>`);
//   return BASE_URL_TG + textMessage;
// };

export function getFormData(object) {
  const formData = new FormData();
  Object.keys(object).forEach((key) => formData.append(key, object[key]));
  return formData;
}
