var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import Decimal from 'decimal.js';
var TsColorConverter = /** @class */ (function () {
    function TsColorConverter() {
    }
    TsColorConverter.prototype.to = function (type, returnAsString) {
        if (returnAsString === void 0) { returnAsString = true; }
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
    };
    /* ------ RGB / RGBA ------ */
    TsColorConverter.prototype.rgb = function (rgb) {
        var _this = this;
        if (typeof rgb === 'string') {
            try {
                var _a = this.ParseStringColor('rgb', rgb), r = _a[0], g = _a[1], b = _a[2];
                var ranges = [
                    { value: r, min: 0, max: 255 },
                    { value: g, min: 0, max: 255 },
                    { value: b, min: 0, max: 255 }
                ];
                if (ranges.some(function (_a) {
                    var value = _a.value, min = _a.min, max = _a.max;
                    return !_this.inRange(value, min, max);
                })) {
                    throw new Error('Invalid rgb color');
                }
                this.rgbaColor = { r: r, g: g, b: b, a: 1 };
            }
            catch (error) {
                throw new Error(error.message);
            }
        }
        else {
            var r = rgb.r, g = rgb.g, b = rgb.b;
            this.rgbaColor = { r: r, g: g, b: b, a: 1 };
        }
        return this;
    };
    TsColorConverter.prototype.rgba = function (rgba) {
        var _this = this;
        if (typeof rgba === 'string') {
            try {
                var _a = this.ParseStringColor('rgba', rgba), r = _a[0], g = _a[1], b = _a[2], a = _a[3];
                var ranges = [
                    { value: r, min: 0, max: 255 },
                    { value: g, min: 0, max: 255 },
                    { value: b, min: 0, max: 255 },
                    { value: a, min: 0, max: 1 }
                ];
                if (ranges.some(function (_a) {
                    var value = _a.value, min = _a.min, max = _a.max;
                    return !_this.inRange(value, min, max);
                })) {
                    throw new Error('Invalid rgba color');
                }
                this.rgbaColor = { r: r, g: g, b: b, a: a };
            }
            catch (error) {
                throw new Error(error.message);
            }
        }
        else {
            var r = rgba.r, g = rgba.g, b = rgba.b, a = rgba.a;
            this.rgbaColor = { r: r, g: g, b: b, a: a };
        }
        return this;
    };
    TsColorConverter.prototype.RGBAToRGBA = function (rgba, alpha, returnAsString) {
        var r = rgba.r, g = rgba.g, b = rgba.b, a = rgba.a;
        if (alpha) {
            return returnAsString ? "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(a, ")") : { r: r, g: g, b: b, a: a };
        }
        return returnAsString ? "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")") : { r: r, g: g, b: b };
    };
    /* ------ HEX ------ */
    TsColorConverter.prototype.hex = function (color) {
        this.rgbaColor = this.hexToRGBA(color);
        return this;
    };
    TsColorConverter.prototype.AlphaToHex = function (alpha) {
        var hex = {
            0: '00',
            0.1: '1A',
            0.2: '33',
            0.3: '4D',
            0.4: '66',
            0.5: '80',
            0.6: '99',
            0.7: 'B3',
            0.8: 'CC',
            0.9: 'E6',
            1: 'FF'
        };
        if (!hex[alpha])
            return 'FF';
        return hex[alpha];
    };
    TsColorConverter.prototype.HexToAlpha = function (alphaHex) {
        alphaHex = alphaHex.toUpperCase();
        var hex = {
            '00': 0,
            '1A': 0.1,
            '33': 0.2,
            '4D': 0.3,
            '66': 0.4,
            '80': 0.5,
            '99': 0.6,
            B3: 0.7,
            CC: 0.8,
            E6: 0.9,
            FF: 1
        };
        if (!hex[alphaHex])
            return 1;
        return hex[alphaHex];
    };
    TsColorConverter.prototype.RGBAToHex = function (rgba) {
        var r = rgba.r, g = rgba.g, b = rgba.b, a = rgba.a;
        var hex = "#".concat(((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1));
        if (a !== 1) {
            var alpha = this.AlphaToHex(a);
            return (hex + alpha).toLocaleUpperCase();
        }
        return hex.toUpperCase();
    };
    TsColorConverter.prototype.hexToRGBA = function (hex) {
        if (!/^#([A-Fa-f0-9]{3}){1,2}(([A-Fa-f0-9]){1,2})?$/.test(hex)) {
            throw new Error('Invalid hex color');
        }
        hex = hex.slice(1);
        var alpha = 1;
        if (hex.length === 3) {
            hex = hex
                .split('')
                .map(function (x) { return x + x; })
                .join('');
        }
        else if (hex.length === 8) {
            var alphaHex = hex.slice(-2);
            alpha = this.HexToAlpha(alphaHex);
            hex = hex.slice(0, -2);
        }
        else if (hex.length === 4) {
            var alphaHex = hex.slice(-1);
            alpha = this.HexToAlpha(alphaHex + alphaHex);
            hex = hex
                .slice(0, -1)
                .split('')
                .map(function (x) { return x + x; })
                .join('');
        }
        hex = '0x' + hex;
        // @ts-ignore
        return { r: (hex >> 16) & 255, g: (hex >> 8) & 255, b: hex & 255, a: alpha };
    };
    /* ------ HSLA/HSLA ------ */
    TsColorConverter.prototype.hsb = function (hsb) {
        var _this = this;
        if (typeof hsb === 'string') {
            try {
                var _a = this.ParseStringColor('hsl', hsb), h = _a[0], s = _a[1], b = _a[2];
                var ranges = [
                    { value: h, min: 0, max: 360 },
                    { value: s, min: 0, max: 100 },
                    { value: b, min: 0, max: 100 }
                ];
                if (ranges.some(function (_a) {
                    var value = _a.value, min = _a.min, max = _a.max;
                    return !_this.inRange(value, min, max);
                })) {
                    throw new Error('Invalid hsl color');
                }
                this.rgbaColor = this.HSBAtoRGBA({ h: h, s: s, b: b, a: 1 });
            }
            catch (error) {
                throw new Error(error.message);
            }
        }
        else {
            this.rgbaColor = this.HSBAtoRGBA(__assign(__assign({}, hsb), { a: 1 }));
        }
        return this;
    };
    TsColorConverter.prototype.hsl = function (hsl) {
        if (typeof hsl === 'string') {
            return this.hsb(hsl);
        }
        var h = hsl.h, s = hsl.s, l = hsl.l;
        return this.hsb({ h: h, s: s, b: l });
    };
    TsColorConverter.prototype.hsba = function (hsba) {
        var _this = this;
        if (typeof hsba === 'string') {
            try {
                var _a = this.ParseStringColor('hsla', hsba), h = _a[0], s = _a[1], b = _a[2], a = _a[3];
                var ranges = [
                    { value: h, min: 0, max: 360 },
                    { value: s, min: 0, max: 100 },
                    { value: b, min: 0, max: 100 },
                    { value: a, min: 0, max: 1 }
                ];
                if (ranges.some(function (_a) {
                    var value = _a.value, min = _a.min, max = _a.max;
                    return !_this.inRange(value, min, max);
                })) {
                    throw new Error('Invalid hsla color range');
                }
                this.rgbaColor = this.HSBAtoRGBA({ h: h, s: s, b: b, a: a });
            }
            catch (error) {
                throw new Error(error.message);
            }
        }
        else {
            this.rgbaColor = this.HSBAtoRGBA(hsba);
        }
        return this;
    };
    TsColorConverter.prototype.hsla = function (hsla) {
        if (typeof hsla === 'string') {
            return this.hsba(hsla);
        }
        var h = hsla.h, s = hsla.s, l = hsla.l, a = hsla.a;
        return this.hsba({ h: h, s: s, b: l, a: a });
    };
    TsColorConverter.prototype.HSBAtoRGBA = function (hsba) {
        var _this = this;
        // source https://www.baeldung.com/cs/convert-color-hsl-rgb
        var hue = new Decimal(hsba.h);
        var saturation = new Decimal(hsba.s).div(100);
        var brightness = new Decimal(hsba.b).div(100);
        var chroma = new Decimal(1)
            .minus(new Decimal(brightness).times(2).minus(1).abs())
            .times(saturation);
        var huePrime = hue.div(60);
        var x = chroma.times(new Decimal(1).minus(new Decimal(huePrime.mod(2)).minus(1).abs()));
        var ranges = [
            [0, 1, [chroma, x, new Decimal(0)]],
            [1, 2, [x, chroma, new Decimal(0)]],
            [2, 3, [new Decimal(0), chroma, x]],
            [3, 4, [new Decimal(0), x, chroma]],
            [4, 5, [x, new Decimal(0), chroma]],
            [5, 6, [chroma, new Decimal(0), x]]
        ];
        var range = ranges.find(function (_a) {
            var min = _a[0], max = _a[1];
            return _this.DecimalInRange(huePrime, min, max);
        });
        if (!range)
            throw new Error('Invalid hsba color');
        var m = brightness.minus(chroma.div(2));
        var _a = range[2].map(function (v) { return v.plus(m).times(255).round().toNumber(); }), r = _a[0], g = _a[1], b = _a[2];
        return { r: r, g: g, b: b, a: hsba.a };
    };
    // TODO: Refactor to use Decimal.js
    TsColorConverter.prototype.RGBAToHSBA = function (rgba, alpha, returnAsString, hsl) {
        if (hsl === void 0) { hsl = false; }
        var r = new Decimal(rgba.r).div(255);
        var g = new Decimal(rgba.g).div(255);
        var b = new Decimal(rgba.b).div(255);
        var max = Decimal.max(r, g, b);
        var min = Decimal.min(r, g, b);
        var luminance = max.plus(min).div(2);
        if (max.equals(min)) {
            var value_1 = hsl
                ? { h: 0, s: 0, l: Number(luminance.times(100).toFixed(1)), a: rgba.a }
                : { h: 0, s: 0, b: Number(luminance.times(100).toFixed(1)), a: rgba.a };
            return this.ReturnStringOrObject(value_1, alpha, returnAsString);
        }
        var d = max.minus(min);
        var saturation = luminance.lte(0.5)
            ? d.div(max.plus(min))
            : d.div(new Decimal(2).minus(max.plus(min)));
        var hue = new Decimal(0);
        if (max.equals(r)) {
            hue = g
                .minus(b)
                .div(d)
                .plus(g.lt(b) ? 6 : 0);
        }
        else if (max.equals(g)) {
            hue = b.minus(r).div(d).plus(2);
        }
        else if (max.equals(b)) {
            hue = r.minus(g).div(d).plus(4);
        }
        hue = hue.times(60);
        if (hue.lessThan(0)) {
            hue = hue.plus(360);
        }
        var value = hsl
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
    };
    TsColorConverter.prototype.ParseStringColor = function (type, color) {
        var lengths = {
            rgb: 3,
            rgba: 4,
            hsl: 3,
            hsla: 4
        };
        var length = lengths[type];
        var regex = new RegExp("".concat(type, "\\(([^)]+)\\)"));
        var match = color.match(regex);
        if (!match) {
            throw new Error("Invalid ".concat(type, " color"));
        }
        var values = color
            .split(',')
            .map(function (x) { return parseFloat(x.trim().match(/\-?\d+(\.\d+)?/)); });
        if (values.length !== length) {
            throw new Error("Invalid ".concat(type, " color"));
        }
        return values;
    };
    TsColorConverter.prototype.DecimalInRange = function (value, min, max) {
        return value.gte(min) && value.lte(max);
    };
    TsColorConverter.prototype.ReturnStringOrObject = function (value, alpha, returnAsString) {
        if (!returnAsString) {
            if (alpha)
                return value;
            else {
                var a = value.a, other = __rest(value, ["a"]);
                return other;
            }
        }
        var type = Object.keys(value)
            .filter(function (key) { return alpha || key !== 'a'; })
            .join('');
        // console.log('type', type, value);
        switch (type) {
            case 'rgb':
                var rgb = value;
                return "rgb(".concat(rgb.r, ", ").concat(rgb.g, ", ").concat(rgb.b, ")");
            case 'rgba':
                var rgba = value;
                return "rgba(".concat(rgba.r, ", ").concat(rgba.g, ", ").concat(rgba.b, ", ").concat(rgba.a, ")");
            case 'hsb':
                var hsb = value;
                return "hsl(".concat(hsb.h, ", ").concat(hsb.s, "%, ").concat(hsb.b, "%)");
            case 'hsl':
                var hsl = value;
                return "hsl(".concat(hsl.h, ", ").concat(hsl.s, "%, ").concat(hsl.l, "%)");
            case 'hsba':
                var hsba = value;
                return "hsla(".concat(hsba.h, ", ").concat(hsba.s, "%, ").concat(hsba.b, "%, ").concat(hsba.a, ")");
            case 'hsla':
                var hsla = value;
                return "hsla(".concat(hsla.h, ", ").concat(hsla.s, "%, ").concat(hsla.l, "%, ").concat(hsla.a, ")");
        }
    };
    TsColorConverter.prototype.inRange = function (value, min, max) {
        return value >= min && value <= max;
    };
    return TsColorConverter;
}());
export default TsColorConverter;
