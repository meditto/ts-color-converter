import Decimal from 'decimal.js';

interface RGB {
    r: number;
    g: number;
    b: number;
}
interface RGBA extends RGB {
    a: number;
}
interface HSB {
    h: number;
    s: number;
    b: number;
}
interface HSBA extends HSB {
    a: number;
}
interface HSL {
    h: number;
    s: number;
    l: number;
}
interface HSLA extends HSL {
    a: number;
}
export type ColorType = 'HEX' | 'RGB' | 'RGBA' | 'HSB' | 'HSBA' | 'HSL' | 'HSLA';

/**
 * TsColorConverter class provides methods to convert colors between different formats.
 */
export default class TsColorConverter {
    private rgbaColor?: RGBA;
    /**
     * Converts the current color to the specified type.
     * @param type - The type to convert the color to.
     * @param returnAsString - Whether to return the result as a string.
     * @returns The converted color.
     * @throws Error if the color is not set or the type is invalid.
     */
    public to(
        type: ColorType,
        returnAsString = true
    ): string | RGB | RGBA | HSB | HSBA | HSL | HSLA | undefined {
        if (!this.rgbaColor) {
            throw new Error('Color is not set');
        }
        switch (type) {
            case 'HEX':
                return this.RGBAToHex(this.rgbaColor);
            case 'RGB':
                return this.RGBAToRGBA(this.rgbaColor, false, returnAsString);
            case 'RGBA':
                return this.RGBAToRGBA(this.rgbaColor, true, returnAsString);
            case 'HSB':
                return this.RGBAToHSBA(this.rgbaColor, false, returnAsString);
            case 'HSBA':
                return this.RGBAToHSBA(this.rgbaColor, true, returnAsString);
            case 'HSL':
                return this.RGBAToHSBA(this.rgbaColor, false, returnAsString, true);
            case 'HSLA':
                return this.RGBAToHSBA(this.rgbaColor, true, returnAsString, true);
            default:
                throw new Error('Invalid color type');
        }
    }
    /**
     * Sets the current color using an RGB value.
     * @param rgb - The RGB value as a string or an object.
     * @returns The TsColorConverter instance.
     * @throws Error if the RGB value is invalid.
     */
    public rgb(rgb: string | RGB): TsColorConverter {
        if (typeof rgb === 'string') {
            try {
                const [r, g, b] = this.ParseStringColor('rgb', rgb);
                const ranges = [
                    { value: r, min: 0, max: 255 },
                    { value: g, min: 0, max: 255 },
                    { value: b, min: 0, max: 255 }
                ];
                if (ranges.some(({ value, min, max }) => !this.inRange(value, min, max))) {
                    throw new Error('Invalid rgb color');
                }
                this.rgbaColor = { r, g, b, a: 1 };
            } catch (error: any) {
                throw new Error(error.message);
            }
        } else {
            const { r, g, b } = rgb;
            this.rgbaColor = { r, g, b, a: 1 };
        }
        return this;
    }
    /**
     * Sets the current color using an RGBA value.
     * @param rgba - The RGBA value as a string or an object.
     * @returns The TsColorConverter instance.
     * @throws Error if the RGBA value is invalid.
     */
    public rgba(rgba: string | RGBA): TsColorConverter {
        if (typeof rgba === 'string') {
            try {
                const [r, g, b, a] = this.ParseStringColor('rgba', rgba);
                const ranges = [
                    { value: r, min: 0, max: 255 },
                    { value: g, min: 0, max: 255 },
                    { value: b, min: 0, max: 255 },
                    { value: a, min: 0, max: 1 }
                ];
                if (ranges.some(({ value, min, max }) => !this.inRange(value, min, max))) {
                    throw new Error('Invalid rgba color');
                }
                this.rgbaColor = { r, g, b, a };
            } catch (error: any) {
                throw new Error(error.message);
            }
        } else {
            const { r, g, b, a } = rgba;
            this.rgbaColor = { r, g, b, a };
        }
        return this;
    }
    /**
     * Converts an RGBA value to an RGB or RGBA value.
     * @param rgba - The RGBA value.
     * @param alpha - Whether to include the alpha channel.
     * @param returnAsString - Whether to return the result as a string.
     * @returns The converted color.
     */
    private RGBAToRGBA(rgba: RGBA, alpha: boolean, returnAsString: boolean) {
        const { r, g, b, a } = rgba;
        if (alpha) {
            return returnAsString ? `rgba(${r}, ${g}, ${b}, ${a})` : { r, g, b, a };
        }
        return returnAsString ? `rgb(${r}, ${g}, ${b})` : { r, g, b };
    }
    /**
     * Sets the current color using a HEX value.
     * @param color - The HEX value.
     * @returns The TsColorConverter instance.
     * @throws Error if the HEX value is invalid.
     */
    public hex(color: string): TsColorConverter {
        this.rgbaColor = this.hexToRGBA(color);
        return this;
    }
    /**
     * Converts an RGBA value to a HEX value.
     * @param rgba - The RGBA value.
     * @returns The HEX value.
     */
    private RGBAToHex(rgba: RGBA) {
        const { r, g, b, a } = rgba;
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        if (a !== 1) {
            let alpha = (Number(a.toFixed(1)) * 255).toString(16).slice(0, 2).toLocaleUpperCase();
            if (alpha === '0') {
                alpha = '00';
            }
            return (hex + alpha).toLocaleUpperCase();
        }
        return hex.toUpperCase();
    }
    /**
     * Converts a HEX value to an RGBA value.
     * @param hex - The HEX value.
     * @returns The RGBA value.
     * @throws Error if the HEX value is invalid.
     */
    private hexToRGBA(hex: string): RGBA {
        if (!/^#([A-Fa-f0-9]{3}){1,2}(([A-Fa-f0-9]){1,2})?$/.test(hex)) {
            throw new Error('Invalid hex color');
        }
        hex = hex.slice(1);
        let alpha = 1;
        if (hex.length === 3) {
            hex = hex
                .split('')
                .map((x) => x + x)
                .join('');
        } else if (hex.length === 8) {
            const alphaHex = hex.slice(-2);
            alpha = Number((parseInt(alphaHex, 16) / 255).toFixed(1));
            hex = hex.slice(0, -2);
        } else if (hex.length === 4) {
            const alphaHex = hex.slice(-1);
            alpha = Number((parseInt(alphaHex + alphaHex, 16) / 255).toFixed(1));
            hex = hex
                .slice(0, -1)
                .split('')
                .map((x) => x + x)
                .join('');
        }
        hex = '0x' + hex;
        // @ts-ignore
        return { r: (hex >> 16) & 255, g: (hex >> 8) & 255, b: hex & 255, a: alpha };
    }

    /**
     * Sets the current color using an HSB value.
     * @param hsb - The HSB value as a string or an object.
     * @returns The TsColorConverter instance.
     * @throws Error if the HSB value is invalid.
     */
    public hsb(hsb: string | HSB): TsColorConverter {
        if (typeof hsb === 'string') {
            try {
                const [h, s, b] = this.ParseStringColor('hsl', hsb);
                const ranges = [
                    { value: h, min: 0, max: 360 },
                    { value: s, min: 0, max: 100 },
                    { value: b, min: 0, max: 100 }
                ];
                if (ranges.some(({ value, min, max }) => !this.inRange(value, min, max))) {
                    throw new Error('Invalid hsl color');
                }
                this.rgbaColor = this.HSBAtoRGBA({ h, s, b, a: 1 });
            } catch (error: any) {
                throw new Error(error.message);
            }
        } else {
            this.rgbaColor = this.HSBAtoRGBA({ ...hsb, a: 1 });
        }
        return this;
    }
    /**
     * Sets the current color using an HSL value.
     * @param hsl - The HSL value as a string or an object.
     * @returns The TsColorConverter instance.
     * @throws Error if the HSL value is invalid.
     */
    public hsl(hsl: string | HSL): TsColorConverter {
        if (typeof hsl === 'string') {
            return this.hsb(hsl);
        }
        const { h, s, l } = hsl;
        return this.hsb({ h, s, b: l });
    }
    /**
     * Sets the current color using an HSBA value.
     * @param hsba - The HSBA value as a string or an object.
     * @returns The TsColorConverter instance.
     * @throws Error if the HSBA value is invalid.
     */
    public hsba(hsba: string | HSBA): TsColorConverter {
        if (typeof hsba === 'string') {
            try {
                const [h, s, b, a] = this.ParseStringColor('hsla', hsba);
                const ranges = [
                    { value: h, min: 0, max: 360 },
                    { value: s, min: 0, max: 100 },
                    { value: b, min: 0, max: 100 },
                    { value: a, min: 0, max: 1 }
                ];
                if (ranges.some(({ value, min, max }) => !this.inRange(value, min, max))) {
                    throw new Error('Invalid hsla color range');
                }
                this.rgbaColor = this.HSBAtoRGBA({ h, s, b, a });
            } catch (error: any) {
                throw new Error(error.message);
            }
        } else {
            this.rgbaColor = this.HSBAtoRGBA(hsba);
        }
        return this;
    }
    /**
     * Sets the current color using an HSLA value.
     * @param hsla - The HSLA value as a string or an object.
     * @returns The TsColorConverter instance.
     * @throws Error if the HSLA value is invalid.
     */
    public hsla(hsla: string | HSLA): TsColorConverter {
        if (typeof hsla === 'string') {
            return this.hsba(hsla);
        }
        const { h, s, l, a } = hsla;
        return this.hsba({ h, s, b: l, a });
    }
    /**
     * Converts an HSBA value to an RGBA value.
     * @param hsba - The HSBA value.
     * @returns The RGBA value.
     * @throws Error if the HSBA value is invalid.
     */
    private HSBAtoRGBA(hsba: HSBA): RGBA {
        // source https://www.baeldung.com/cs/convert-color-hsl-rgb
        const hue = new Decimal(hsba.h);
        const saturation = new Decimal(hsba.s).div(100);
        const brightness = new Decimal(hsba.b).div(100);
        const chroma = new Decimal(1)
            .minus(new Decimal(brightness).times(2).minus(1).abs())
            .times(saturation);
        const huePrime = hue.div(60);
        const x = chroma.times(new Decimal(1).minus(new Decimal(huePrime.mod(2)).minus(1).abs()));
        const ranges: [number, number, [Decimal, Decimal, Decimal]][] = [
            [0, 1, [chroma, x, new Decimal(0)]],
            [1, 2, [x, chroma, new Decimal(0)]],
            [2, 3, [new Decimal(0), chroma, x]],
            [3, 4, [new Decimal(0), x, chroma]],
            [4, 5, [x, new Decimal(0), chroma]],
            [5, 6, [chroma, new Decimal(0), x]]
        ];
        const range = ranges.find(([min, max]) => this.DecimalInRange(huePrime, min, max));
        if (!range) throw new Error('Invalid hsba color');
        const m = brightness.minus(chroma.div(2));
        const [r, g, b] = range[2].map((v) => v.plus(m).times(255).round().toNumber());
        return { r, g, b, a: hsba.a };
    }
    /**
     * Converts an RGBA value to an HSBA or HSLA value.
     * @param rgba - The RGBA value.
     * @param alpha - Whether to include the alpha channel.
     * @param returnAsString - Whether to return the result as a string.
     * @param hsl - Whether to convert to HSL instead of HSB.
     * @returns The converted color.
     */
    private RGBAToHSBA(rgba: RGBA, alpha: boolean, returnAsString: boolean, hsl: boolean = false) {
        const r = new Decimal(rgba.r).div(255);
        const g = new Decimal(rgba.g).div(255);
        const b = new Decimal(rgba.b).div(255);
        let max = Decimal.max(r, g, b);
        let min = Decimal.min(r, g, b);
        const luminance = max.plus(min).div(2);
        if (max.equals(min)) {
            const value = hsl
                ? { h: 0, s: 0, l: Number(luminance.times(100).toFixed(1)), a: rgba.a }
                : { h: 0, s: 0, b: Number(luminance.times(100).toFixed(1)), a: rgba.a };
            return this.ReturnStringOrObject(value, alpha, returnAsString);
        }
        const d = max.minus(min);
        const saturation = luminance.lte(0.5)
            ? d.div(max.plus(min))
            : d.div(new Decimal(2).minus(max.plus(min)));
        let hue: Decimal = new Decimal(0);
        if (max.equals(r)) {
            hue = g
                .minus(b)
                .div(d)
                .plus(g.lt(b) ? 6 : 0);
        } else if (max.equals(g)) {
            hue = b.minus(r).div(d).plus(2);
        } else if (max.equals(b)) {
            hue = r.minus(g).div(d).plus(4);
        }
        hue = hue.times(60);
        if (hue.lessThan(0)) {
            hue = hue.plus(360);
        }
        const value = hsl
            ? {
                  h: Number(hue.toFixed(1)),
                  s: Number(saturation.times(100).toFixed(1)),
                  l: Number(luminance.times(100).toFixed(1)),
                  a: rgba.a
              }
            : {
                  h: Number(hue.toFixed(1)),
                  s: Number(saturation.times(100).toFixed(1)),
                  b: Number(luminance.times(100).toFixed(1)),
                  a: rgba.a
              };
        return this.ReturnStringOrObject(value, alpha, returnAsString);
    }
    /**
     * Parses a color string to extract its components.
     * @param type - The type of the color (e.g., 'rgb', 'rgba', 'hsl', 'hsla').
     * @param color - The color string.
     * @returns The extracted components.
     * @throws Error if the color string is invalid.
     */
    private ParseStringColor(type: 'rgb' | 'rgba' | 'hsl' | 'hsla', color: string) {
        const lengths = {
            rgb: 3,
            rgba: 4,
            hsl: 3,
            hsla: 4
        };
        const length = lengths[type];
        const regex = new RegExp(`${type}\\(([^)]+)\\)`);
        const match = color.match(regex);
        if (!match) {
            throw new Error(`Invalid ${type} color`);
        }
        const values = color
            .split(',')
            .map((x) => parseFloat(x.trim().match(/\-?\d+(\.\d+)?/) as any as string));
        if (values.length !== length) {
            throw new Error(`Invalid ${type} color`);
        }
        return values;
    }
    /**
     * Checks if a Decimal value is within a specified range.
     * @param value - The Decimal value.
     * @param min - The minimum value.
     * @param max - The maximum value.
     * @returns Whether the value is within the range.
     */
    private DecimalInRange(value: Decimal, min: number, max: number) {
        return value.gte(min) && value.lte(max);
    }
    /**
     * Returns the color value as a string or an object.
     * @param value - The color value.
     * @param alpha - Whether to include the alpha channel.
     * @param returnAsString - Whether to return the result as a string.
     * @returns The color value as a string or an object.
     */
    private ReturnStringOrObject(
        value: HSBA | RGBA | HSLA,
        alpha: boolean,
        returnAsString: boolean
    ) {
        if (!returnAsString) {
            if (alpha) return value;
            else {
                const { a, ...other } = value;
                return other;
            }
        }
        const type = Object.keys(value)
            .filter((key) => alpha || key !== 'a')
            .join('');
        // console.log('type', type, value);

        switch (type) {
            case 'rgb':
                const rgb = value as RGB;
                return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            case 'rgba':
                const rgba = value as RGBA;
                return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
            case 'hsb':
                const hsb = value as HSB;
                return `hsl(${hsb.h}, ${hsb.s}%, ${hsb.b}%)`;
            case 'hsl':
                const hsl = value as HSL;
                return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
            case 'hsba':
                const hsba = value as HSBA;
                return `hsla(${hsba.h}, ${hsba.s}%, ${hsba.b}%, ${hsba.a})`;
            case 'hsla':
                const hsla = value as HSLA;
                return `hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${hsla.a})`;
        }
    }
    /**
     * Checks if a number is within a specified range.
     * @param value - The number.
     * @param min - The minimum value.
     * @param max - The maximum value.
     * @returns Whether the number is within the range.
     */
    private inRange(value: number, min: number, max: number) {
        return value >= min && value <= max;
    }
}
