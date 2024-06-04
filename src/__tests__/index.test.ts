import TsColorConverter from '../index';
const colors = [
    {
        HEX: '#B8860B',
        RGB: 'rgb(184, 134, 11)',
        RGBA: 'rgba(184, 134, 11, 1)',
        HSL: 'hsl(42.7, 88.7%, 38.2%)',
        HSLA: 'hsla(42.7, 88.7%, 38.2%, 1)'
    },
    {
        HEX: '#ff5733',
        RGB: 'rgb(255, 87, 51)',
        RGBA: 'rgba(255, 87, 51, 1)',
        HSL: 'hsl(10.6, 100%, 60%)',
        HSLA: 'hsla(10.6, 100%, 60%, 1)'
    },
    {
        HEX: '#33ff57',
        RGB: 'rgb(51, 255, 87)',
        RGBA: 'rgba(51, 255, 87, 1)',
        HSL: 'hsl(130.6, 100%, 60%)',
        HSLA: 'hsla(130.6, 100%, 60%, 1)'
    },
    {
        HEX: '#3357ff',
        RGB: 'rgb(51, 87, 255)',
        RGBA: 'rgba(51, 87, 255, 1)',
        HSL: 'hsl(229.4, 100%, 60%)',
        HSLA: 'hsla(229.4, 100%, 60%, 1)'
    },
    {
        HEX: '#ff33a8',
        RGB: 'rgb(255, 51, 168)',
        RGBA: 'rgba(255, 51, 168, 1)',
        HSL: 'hsl(325.6, 100%, 60%)',
        HSLA: 'hsla(325.6, 100%, 60%, 1)'
    },
    {
        HEX: '#a833ff',
        RGB: 'rgb(168, 51, 255)',
        RGBA: 'rgba(168, 51, 255, 1)',
        HSL: 'hsl(274.4, 100%, 60%)',
        HSLA: 'hsla(274.4, 100%, 60%, 1)'
    },
    {
        HEX: '#33fff6',
        RGB: 'rgb(51, 255, 246)',
        RGBA: 'rgba(51, 255, 246, 1)',
        HSL: 'hsl(177.4, 100%, 60%)',
        HSLA: 'hsla(177.4, 100%, 60%, 1)'
    },
    {
        HEX: '#f6ff33',
        RGB: 'rgb(246, 255, 51)',
        RGBA: 'rgba(246, 255, 51, 1)',
        HSL: 'hsl(62.6, 100%, 60%)',
        HSLA: 'hsla(62.6, 100%, 60%, 1)'
    },
    {
        HEX: '#ff8f33',
        RGB: 'rgb(255, 143, 51)',
        RGBA: 'rgba(255, 143, 51, 1)',
        HSL: 'hsl(27.1, 100%, 60%)',
        HSLA: 'hsla(27.1, 100%, 60%, 1)'
    }
];
const types = ['HEX', 'RGB', 'RGBA', 'HSL', 'HSLA'];
const converter = new TsColorConverter();
// jest test
describe('CssColorConverter', () => {
    types.forEach((type) => {
        const otherTypes = types.filter((t) => t !== type);
        otherTypes.forEach((otherType) => {
            it(`should convert ${type} to ${otherType}`, () => {
                colors.forEach((color) => {
                    // @ts-ignore
                    let expectedValue = color[otherType];
                    if (otherType === 'HEX') {
                        expectedValue = expectedValue.toUpperCase();
                    }
                    // @ts-ignore
                    expect(converter[type.toLocaleLowerCase()](color[type]).to(otherType)).toBe(
                        expectedValue
                    );
                });
            });
        });
    });
    it('can return an object', () => {
        const color = converter.hex('#ff0000');
        expect(color.to('RGB', false)).toEqual({ r: 255, g: 0, b: 0 });
        expect(color.to('RGBA', false)).toEqual({ r: 255, g: 0, b: 0, a: 1 });
        expect(color.to('HSB', false)).toEqual({ h: 0, s: 100, b: 50 });
        expect(color.to('HSBA', false)).toEqual({ h: 0, s: 100, b: 50, a: 1 });
        expect(color.to('HSL', false)).toEqual({ h: 0, s: 100, l: 50 });
        expect(color.to('HSLA', false)).toEqual({ h: 0, s: 100, l: 50, a: 1 });
    });
    it('should throw an error when the input is invalid', () => {
        expect(() => converter.rgb('rgb(255,265,0)').to('HEX')).toThrow('Invalid rgb color');
        expect(() => converter.rgb('rgb(255,265,-1)').to('HEX')).toThrow('Invalid rgb color');
        expect(() => converter.rgba('rgb(255,25,2, 2)').to('HEX')).toThrow('Invalid rgba color');
        expect(() => converter.rgba('rgb(255,25,-2, 1)').to('HEX')).toThrow('Invalid rgba color');
        expect(() => converter.hex('#ff').to('RGB')).toThrow('Invalid hex color');
        expect(() => converter.hex('#fffggg').to('RGB')).toThrow('Invalid hex color');
        expect(() => converter.hex('#fffggg').to('RGB')).toThrow('Invalid hex color');
        expect(() => converter.hex('#fffffffff').to('RGB')).toThrow('Invalid hex color');
        expect(() => converter.hsl('hsl(360, 100%, -50%)').to('RGB')).toThrow('Invalid hsl color');
        expect(() => converter.hsl('hsl(360, 100%, -50%').to('RGB')).toThrow('Invalid hsl color');
    });
});
