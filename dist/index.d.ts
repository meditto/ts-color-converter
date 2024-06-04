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
export default class TsColorConverter {
    private rgbaColor?;
    to(type: ColorType, returnAsString?: boolean): string | {
        r: number;
        g: number;
        b: number;
    } | {
        h: number;
        s: number;
        b: number;
    } | {
        h: number;
        s: number;
        l: number;
    } | undefined;
    rgb(rgb: string | RGB): TsColorConverter;
    rgba(rgba: string | RGBA): TsColorConverter;
    private RGBAToRGBA;
    hex(color: string): TsColorConverter;
    private AlphaToHex;
    private HexToAlpha;
    private RGBAToHex;
    private hexToRGBA;
    hsb(hsb: string | HSB): TsColorConverter;
    hsl(hsl: string | HSL): TsColorConverter;
    hsba(hsba: string | HSBA): TsColorConverter;
    hsla(hsla: string | HSLA): TsColorConverter;
    private HSBAtoRGBA;
    private RGBAToHSBA;
    private ParseStringColor;
    private DecimalInRange;
    private ReturnStringOrObject;
    private inRange;
}
export {};
