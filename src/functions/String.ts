import ValidationError from '../errors/ValidationError';

// tslint:disable-next-line:no-class
export class StringValidationError extends ValidationError {
  constructor(data: any, public minLength: number, public maxLength: number) {
    super(`not a string with a length between ${minLength} and ${maxLength}`, data);
  }
}

// tslint:disable-next-line:only-arrow-functions
export default function(minLength = 0, maxLength = Infinity) {
  return (data: string) => {
    // tslint:disable-next-line:strict-type-predicates
    if (typeof data === 'string' && minLength < data.length && data.length < maxLength) {
      return [];
    }
    return [new StringValidationError(data, minLength, maxLength)];
  };
}
