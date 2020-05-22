import { Static } from './core';
import { object } from './referenceTypes/object';
import { array } from './referenceTypes/array';
import { dictionary } from './referenceTypes/dictionary';
import { allowEither } from './utils/allowEither';
import { boolean } from './primitivesTypes/boolean';
import { ValidationErrors } from "./errors/ValidationErrors";
import { enumerated } from './utils/enum';
import { constant } from './utils/constant';
import { number } from './primitivesTypes/number';
import { string } from './primitivesTypes/string';
import { ValidationError } from './errors/ValidationError';
import { constrain } from './core';
import { uuidv4String } from './patternConstrainedStrings/uuidv4';
import { lengthConstrainedString } from './constrainedValues/lengthConstrainedString';
import { rangeConstrainedNumber } from './constrainedValues/rangeConstrainedNumber';
import { allowNull } from './utils/allowNull';

const constrainToName = lengthConstrainedString<'Name'>({ minLength: 1, maxLength: 25 });
const constrainToPrice = rangeConstrainedNumber<'Price'>({ min: 0, decimalPlaces: 2 });

const constrainToProduct = object({
  required: {
    id: uuidv4String,
    name: constrainToName,
    price: constrainToPrice,
  },
  optional: {
    inStock: boolean,
  }
});
type Product = Static<typeof constrainToProduct>;

function demoValidation<T>(title: string, fn: () => T[]) {
  console.info(title.toUpperCase());
  try {
    const output = fn();
    console.info(...output);
  } catch (err) {
    if (err instanceof ValidationErrors) {
      console.error(err.message);
    } else if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
  }
  console.info('\n');
}


demoValidation('Constrained Values Demo', () => {
  const id = uuidv4String('');
  const name = constrainToName('Product 1');
  const price = constrainToPrice(1.33);
  const product: Product = { id, name, price };
  return [product.name, product.price];
});

demoValidation('Constrained Object Demo', () => {
  const product: Product = constrainToProduct({ name: 'Product 1', price: 1.33 });
  return [product.name, product.price];
});

demoValidation('Constrained Array Demo', () => {
  const constrainToProducts = array(constrainToProduct);
  type Products = Static<typeof constrainToProducts>;
  const products: Products = constrainToProducts([
    constrainToProduct({ name: 'Product 1', price: 1.33 }),
    { name: constrainToName('Product 2'), price: constrainToPrice(1.33) },
    { name: 'Product 3', price: 1.334 },
  ]);
  return [products];
});

demoValidation('Constrained Dictionary Demo', () => {
  function dictionaryKey(input: unknown) {
    const stringInput = string(input);
    if (stringInput.length < 1 || stringInput.length > 2) {
      throw new Error('expected string between 1 and 2 characters');
    }
    return constrain<'DictionaryKey', string>(stringInput);
  }
  const constrainToProductDictionary = dictionary(
    dictionaryKey,
    constrainToProduct,
  );
  type ProductDictionary = Static<typeof constrainToProductDictionary>
  const productDictionary: ProductDictionary = constrainToProductDictionary({
    '1': constrainToProduct({ name: 'Product 1', price: 1.33 }),
    '2': { name: constrainToName('Product 2'), price: constrainToPrice(1.33) },
    '234': { name: '', price: 1.333 },
  });
  return [productDictionary];
});

demoValidation('Allow Either Demo', () => {
  const constrainToStringOrBoolean = allowEither(string, boolean);
  type StringOrBoolean = Static<typeof constrainToStringOrBoolean>;
  const stringOrBoolean: StringOrBoolean = constrainToStringOrBoolean(1);
  return [stringOrBoolean];
});

demoValidation('Constrained Enum Demo', () => {
  enum TrafficLight {
    Red,
    Orange,
    Green,
  };
  const constrainToTrafficLight = enumerated(TrafficLight);
  const trafficLight = constrainToTrafficLight(TrafficLight.Green);
  return [trafficLight];
});

demoValidation('Constrained Constant Demo', () => {
  const constrainToTen = constant(10);
  type Ten = Static<typeof constrainToTen>;
  const ten: Ten = constrainToTen(10);
  return [ten];
});

demoValidation('Compose Rules Demo', () => {
  function constrainToSquareNumber(input: unknown) {
    try {
      const numberInput = number(input);
      const isSquareNumber = numberInput > 0 && Math.sqrt(numberInput) % 1 === 0;
      if (isSquareNumber) {
        return numberInput;
      }
    } finally {
      throw new ValidationError('expected square number', input);
    }
  };
  type SquareNumber = Static<typeof constrainToSquareNumber>;
  const squareNumber: SquareNumber = constrainToSquareNumber(4);
  return [squareNumber];
});

demoValidation('Old Example', () => {
  const constrainToExample = object({
    required: {
      x: rangeConstrainedNumber<'x'>({ min: 0, max: 1 }),
      y: object({
        required: {
          z: allowEither(
            lengthConstrainedString<'z string'>({ maxLength: 1 }),
            allowEither(
              constant<'z constant', boolean>(true),
              rangeConstrainedNumber<'z number'>({ decimalPlaces: 0 })),
          ),
        },
        optional: {},
      })
    },
    optional: {
      a: boolean,
      b: array(allowNull(boolean)),
    },
  });
  type ExampleRecord = Static<typeof constrainToExample>;
  const myData = { y: { z: '' }, x: 1 };
  const myRecord: ExampleRecord = constrainToExample(myData);
  return [myRecord];
})
