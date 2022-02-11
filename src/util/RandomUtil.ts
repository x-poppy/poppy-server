import randomstring from 'randomstring';

export default {
  randomNumberString(length: number): string {
    return randomstring.generate({
      length,
      charset: 'numeric'
    });
  }
}
