import moment from 'moment';
import { USER_TICKET_VALIDATION_MESSAGES } from '../data/data';

export const generateStrongPassword = () => {
  const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specialCharacters = '@$!%*?&';

  const passwordArray = [
    upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)],
    lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    specialCharacters[Math.floor(Math.random() * specialCharacters.length)],
  ];

  const allCharacters = upperCaseLetters + lowerCaseLetters + numbers + specialCharacters;

  for (let i = passwordArray.length; i < 8; i++) {
    passwordArray.push(allCharacters[Math.floor(Math.random() * allCharacters.length)]);
  }
  const shuffledPassword = passwordArray.sort(() => Math.random() - 0.5).join('');

  return shuffledPassword;
};

export const getFirstCaracterOfFirstTwoWord = (fullName) => {
  if (fullName) {
    const firstTwoWords = fullName.split(' ').slice(0, 2);
    const initials = firstTwoWords.map((word) => word.charAt(0)).join('');
    return initials.toUpperCase();
  }
};

export const truncateString = (str, num) => {
  if (!str) return '---';
  if (str.length > num) {
    return str.slice(0, num) + '...';
  }
  return str;
};

export const getWarningMessage = (length) => {
  if (length === 0) return USER_TICKET_VALIDATION_MESSAGES.SELECT_AT_LEAST_ONE;

  if (length > 1) return USER_TICKET_VALIDATION_MESSAGES.SELECT_ONE_TICKET;
  return null;
};

export const toUTC = (date) => {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
};

export const printDateRangeLastThirtyDays = () => {
  const today = new Date();
  const last30Days = new Date(today);
  last30Days.setDate(today.getDate() - 30);

  return `${moment(last30Days.toISOString().split('T')[0]).format('ll')} - ${moment(
    today.toISOString().split('T')[0]
  ).format('ll')}`;
};

export const formatAdditionalEmail = (emails) => {
  if (!emails) return '-';

  try {
    const parsed = typeof emails === 'string' ? JSON.parse(emails) : emails;
    return Array.isArray(parsed) ? parsed.join(', ') : '-';
  } catch (e) {
    return '-';
  }
};

export const formatIdleTime = (row) => {
  const start = `${row.idle_start_hr}H: ${row.idle_start_min.toString().padStart(2, '0')}Min`;
  const end = `${row.idle_end_hr}H: ${row.idle_end_min.toString().padStart(2, '0')}Min`;
  return `${start} - ${end}`;
};

export const htmlToPlainText = (html) => {
  if (!html) return '';

  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};



export const SUPER_APP_COMPANY_MAP = {
  8: 'CID000004',
  9: 'CID000005',
  10: 'CID000006',
  11: 'CID000007',
  12: 'CID000008',
  13: 'CID000009',
  14: 'CID000010',
  15: 'CID000011',
  16: 'CID000012',
  17: 'CID000013',
  18: 'CID000014',
};