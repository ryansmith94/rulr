# Class Validation Problems

[Back to root readme.md](../readme.md)

In other languages you might use code similar to the TypeScript below for validation. Perhaps it's a little verbose wrapped in a class, but it doesn't hide much complexity and the class has useful properties in terms of type checking. Unfortunately, there are two problems as shown below in code comments that arise from extending JavaScript's base classes.

```ts
class PositiveNumber extends Number {
	constructor(value: unknown) {
		super(value)
		if (typeof value !== 'number' || value < 0) {
			throw new Error('expected positive number')
		}
	}
}

const price: PositiveNumber = -1 // Problem 1: This should error but doesn't.
const adjustedPrice = price + 1 // Problem 2: This shouldn't error but does.
```

#### Solution to Problem 1

Problem 1 is caused by TypeScript's type equivalence checking, but we can work around this by adding a symbol as a protected property. This solution isn't ideal because it requires an unnecessary property and the knowledge of this problem since TypeScript won't raise an error for this problem.

```ts
class PositiveNumber extends Number {
	protected readonly constraint = Symbol()
	constructor(value: unknown) {
		super(value)
		if (typeof value !== 'number' || value < 0) {
			throw new Error('expected positive number')
		}
	}
}

const price: PositiveNumber = -1 // Problem 1: Solved. This now errors.
const adjustedPrice = price + 1 // Problem 2: This shouldn't error but does.
```

#### Solution to Problem 2

Problem 2 is caused by TypeScript's requirement for the plus operator to be used on `number` type values, but our `price` variable is now a `PositiveNumber`. We can use the inherited `valueOf` method from the `Number` class we extended in the `PositiveNumber` class. This solution isn't ideal because it requires an unnecessary method call.

```ts
class PositiveNumber extends Number {
	protected readonly constraint = Symbol()
	constructor(value: unknown) {
		super(value)
		if (typeof value !== 'number' || value < 0) {
			throw new Error('expected positive number')
		}
	}
}

const price: PositiveNumber = -1 // Problem 1: Solved. This does error.
const adjustedPrice = price.valueOf() + 1 // Problem 2: Solved. This doesn't error.
```

#### Avoiding the irritation of these two solutions

Rulr gets around these two problems with "constrained" (nominal/branded/opaque) types as shown below.

```ts
import * as rulr from 'rulr'

const positiveNumberSymbol = Symbol()

function constrainToPositiveNumber(input: unknown) {
	if (typeof input === 'number' && input >= 0) {
		return rulr.constrain(positiveNumberSymbol, input)
	}
	throw new Error('expected positive number')
}

type PositiveNumber = rulr.Static<typeof constrainToPositiveNumber>

const price: PositiveNumber = -1 // Problem 1: Solved. This does error.
const adjustedPrice = price + 1 // Problem 2: Solved. This doesn't error.
```

#### Additional Resources
- [Michal Zalecki](https://michalzalecki.com) has written a great [post on nominal typing techniques in TypeScript](https://michalzalecki.com/nominal-typing-in-typescript/). They have also referenced a [further discussion on nominal typing in the TypeScript Github repository](https://github.com/Microsoft/TypeScript/issues/202).
- Charles Pick from CodeMix has wrote an interesting [post introducing opaque types and how they compare in TypeScript and Flow](https://codemix.com/opaque-types-in-javascript/).
- [Drew Colthorp](https://spin.atomicobject.com/author/colthorp/) has a post on [flavoured types](https://spin.atomicobject.com/2018/01/15/typescript-flexible-nominal-typing/) which are like branded types but allow inference.
- Ilia Choly created [issue #2361 in the TypeScript repository](https://github.com/microsoft/TypeScript/issues/2361) to discuss allowing the `valueOf` method to be used for types when using math operands.
