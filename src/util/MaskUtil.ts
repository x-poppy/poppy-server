import maskdata from 'maskdata';

// https://github.com/Sumukha1496/maskdata#mask-email-id
export function maskEmail(email: string | null): string {
  if (!email) return '';

  return maskdata.maskEmail2(email, {
    maskWith: "*",
    unmaskedStartCharactersBeforeAt: 5,
    unmaskedEndCharactersAfterAt: 200,
    maskAtTheRate: false
  });
}

// https://github.com/Sumukha1496/maskdata#mask-phone-number
export function maskPhone(mobile: string | null): string {
  if (!mobile) return '';

  const spaceIdx = mobile.indexOf(' ');
  return maskdata.maskPhone(mobile, {
    maskWith: "*",
    unmaskedStartDigits: spaceIdx + 4,
    unmaskedEndDigits: 4
  });
}

export default {
  maskEmail,
  maskPhone
}
