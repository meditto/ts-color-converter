
# CssColorConverter

CssColorConverter is a TypeScript library for converting between various color formats (HEX, RGB, RGBA, HSL, HSLA, HSB, HSBA). It provides a simple and consistent API for color manipulation and conversion.

## Features

- Convert colors between HEX, RGB, RGBA, HSL, HSLA, HSB, and HSBA formats.
- Validate color formats and ranges.
- Return colors as strings or objects.

## Installation

To install the library, use npm or yarn:

```bash
npm install css-color-converter
```

or

```bash
yarn add css-color-converter
```

## Usage

First, import the CssColorConverter class from the library:

```typescript
import CssColorConverter from 'css-color-converter';
```

## Example

```typescript
const converter = new CssColorConverter();

// Convert HEX to RGB
const rgb = converter.hex('#B8860B').to('RGB');
console.log(rgb); // "rgb(184, 134, 11)"
const rgbObject = converter.hex('#B8860B').to('RGB', false);
console.log(rgbObject); // { r: 184, g: 134, b: 11 }

// Convert RGB to HEX
const hex = converter.rgb('rgb(184, 134, 11)').to('HEX');
console.log(hex); // "#B8860B"

// Convert RGB to HSL
const hsl = converter.rgb('rgb(184, 134, 11)').to('HSL');
console.log(hsl); // "hsl(42.7, 88.7%, 38.2%)"
const hslObject = converter.rgb('rgb(184, 134, 11)').to('HSL', false);
console.log(hslObject); //  { h: 42.7, s: 88.7, l: 38.2 }
```

## API

### Methods

- **hex** (color: string): CssColorConverter

  - Set the current color in HEX format.

- **rgb** (color: string | RGB): CssColorConverter

  - Set the current color in RGB format.

- **rgba** (color: string | RGBA): CssColorConverter

  - Set the current color in RGBA format.

- **hsl** (color: string | HSL): CssColorConverter

  - Set the current color in HSL format.

- **hsla** (color: string | HSLA): CssColorConverter

  - Set the current color in HSLA format.

- **hsb** (color: string | HSB): CssColorConverter

  - Set the current color in HSB format.

- **hsba** (color: string | HSBA): CssColorConverter

  - Set the current color in HSBA format.

- **to** (type: ColorType, returnAsString = true): string | object

  - Convert the current color to the specified format.

### Types

- **ColorType**

  - 'HEX' | 'RGB' | 'RGBA' | 'HSB' | 'HSBA' | 'HSL' | 'HSLA'

- **RGB**

  - { r: number; g: number; b: number; }

- **RGBA**

  - { r: number; g: number; b: number; a: number; }

- **HSB**

  - { h: number; s: number; b: number; }

- **HSBA**

  - { h: number; s: number; b: number; a: number; }

- **HSL**

  - { h: number; s: number; l: number; }

- **HSLA**

  - { h: number; s: number; l: number; a: number; }

### Running Tests

To run the tests for the library, use the following command:

```bash
npm test
```

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any bugs or features.

### License

This project is licensed under the MIT License.
