// @ts-nocheck

/**
 * GdkPixbuf 2.0
 *
 * Generated from 2.0
 */

import * as GObject from "./gobject2";
import * as GModule from "./gmodule2";
import * as Gio from "./gio2";
import * as GLib from "./glib2";

export const PIXBUF_MAJOR: number;
export const PIXBUF_MICRO: number;
export const PIXBUF_MINOR: number;
export const PIXBUF_VERSION: string;
export function pixbuf_error_quark(): GLib.Quark;
export type PixbufDestroyNotify = (pixels: Uint8Array | string) => void;
export type PixbufModuleFillInfoFunc = (info: PixbufFormat) => void;
export type PixbufModuleFillVtableFunc = (module: PixbufModule) => void;
export type PixbufModuleIncrementLoadFunc = (context: any | null, buf: Uint8Array | string) => boolean;
export type PixbufModuleLoadAnimationFunc = (f?: any | null) => PixbufAnimation;
export type PixbufModuleLoadFunc = (f?: any | null) => Pixbuf;
export type PixbufModuleLoadXpmDataFunc = (data: string[]) => Pixbuf;
export type PixbufModulePreparedFunc = (pixbuf: Pixbuf, anim: PixbufAnimation) => void;
export type PixbufModuleSaveFunc = (
    f: any | null,
    pixbuf: Pixbuf,
    param_keys?: string[] | null,
    param_values?: string[] | null
) => boolean;
export type PixbufModuleSaveOptionSupportedFunc = (option_key: string) => boolean;
export type PixbufModuleSizeFunc = (width: number, height: number) => void;
export type PixbufModuleStopLoadFunc = (context?: any | null) => boolean;
export type PixbufModuleUpdatedFunc = (pixbuf: Pixbuf, x: number, y: number, width: number, height: number) => void;
export type PixbufSaveFunc = (buf: Uint8Array | string) => boolean;

export namespace Colorspace {
    export const $gtype: GObject.GType<Colorspace>;
}

export enum Colorspace {
    RGB = 0,
}

export namespace InterpType {
    export const $gtype: GObject.GType<InterpType>;
}

export enum InterpType {
    NEAREST = 0,
    TILES = 1,
    BILINEAR = 2,
    HYPER = 3,
}

export namespace PixbufAlphaMode {
    export const $gtype: GObject.GType<PixbufAlphaMode>;
}

export enum PixbufAlphaMode {
    BILEVEL = 0,
    FULL = 1,
}

export class PixbufError extends GLib.Error {
    static $gtype: GObject.GType<PixbufError>;

    constructor(options: { message: string; code: number });
    constructor(copy: PixbufError);

    // Fields
    static CORRUPT_IMAGE: number;
    static INSUFFICIENT_MEMORY: number;
    static BAD_OPTION: number;
    static UNKNOWN_TYPE: number;
    static UNSUPPORTED_OPERATION: number;
    static FAILED: number;
    static INCOMPLETE_ANIMATION: number;

    // Members
    static quark(): GLib.Quark;
}

export namespace PixbufRotation {
    export const $gtype: GObject.GType<PixbufRotation>;
}

export enum PixbufRotation {
    NONE = 0,
    COUNTERCLOCKWISE = 90,
    UPSIDEDOWN = 180,
    CLOCKWISE = 270,
}

export namespace PixbufFormatFlags {
    export const $gtype: GObject.GType<PixbufFormatFlags>;
}

export enum PixbufFormatFlags {
    WRITABLE = 1,
    SCALABLE = 2,
    THREADSAFE = 4,
}
export module Pixbuf {
    export interface ConstructorProperties extends GObject.Object.ConstructorProperties {
        [key: string]: any;
        bits_per_sample: number;
        colorspace: Colorspace;
        has_alpha: boolean;
        height: number;
        n_channels: number;
        pixel_bytes: GLib.Bytes;
        pixels: any;
        rowstride: number;
        width: number;
    }
}
export class Pixbuf extends GObject.Object implements Gio.Icon, Gio.LoadableIcon {
    static $gtype: GObject.GType<Pixbuf>;

    constructor(properties?: Partial<Pixbuf.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<Pixbuf.ConstructorProperties>, ...args: any[]): void;

    // Properties
    get bits_per_sample(): number;
    get colorspace(): Colorspace;
    get has_alpha(): boolean;
    get height(): number;
    get n_channels(): number;
    get pixel_bytes(): GLib.Bytes;
    get pixels(): any;
    get rowstride(): number;
    get width(): number;

    // Constructors

    static ["new"](
        colorspace: Colorspace,
        has_alpha: boolean,
        bits_per_sample: number,
        width: number,
        height: number
    ): Pixbuf;
    static new_from_bytes(
        data: GLib.Bytes | Uint8Array,
        colorspace: Colorspace,
        has_alpha: boolean,
        bits_per_sample: number,
        width: number,
        height: number,
        rowstride: number
    ): Pixbuf;
    static new_from_data(
        data: Uint8Array | string,
        colorspace: Colorspace,
        has_alpha: boolean,
        bits_per_sample: number,
        width: number,
        height: number,
        rowstride: number,
        destroy_fn?: PixbufDestroyNotify | null
    ): Pixbuf;
    static new_from_file(filename: string): Pixbuf;
    static new_from_file_at_scale(
        filename: string,
        width: number,
        height: number,
        preserve_aspect_ratio: boolean
    ): Pixbuf;
    static new_from_file_at_size(filename: string, width: number, height: number): Pixbuf;
    static new_from_inline(data: Uint8Array | string, copy_pixels: boolean): Pixbuf;
    static new_from_resource(resource_path: string): Pixbuf;
    static new_from_resource_at_scale(
        resource_path: string,
        width: number,
        height: number,
        preserve_aspect_ratio: boolean
    ): Pixbuf;
    static new_from_stream(stream: Gio.InputStream, cancellable?: Gio.Cancellable | null): Pixbuf;
    static new_from_stream_at_scale(
        stream: Gio.InputStream,
        width: number,
        height: number,
        preserve_aspect_ratio: boolean,
        cancellable?: Gio.Cancellable | null
    ): Pixbuf;
    static new_from_stream_finish(async_result: Gio.AsyncResult): Pixbuf;
    static new_from_xpm_data(data: string[]): Pixbuf;

    // Members

    add_alpha(substitute_color: boolean, r: number, g: number, b: number): Pixbuf;
    apply_embedded_orientation(): Pixbuf | null;
    composite(
        dest: Pixbuf,
        dest_x: number,
        dest_y: number,
        dest_width: number,
        dest_height: number,
        offset_x: number,
        offset_y: number,
        scale_x: number,
        scale_y: number,
        interp_type: InterpType,
        overall_alpha: number
    ): void;
    composite_color(
        dest: Pixbuf,
        dest_x: number,
        dest_y: number,
        dest_width: number,
        dest_height: number,
        offset_x: number,
        offset_y: number,
        scale_x: number,
        scale_y: number,
        interp_type: InterpType,
        overall_alpha: number,
        check_x: number,
        check_y: number,
        check_size: number,
        color1: number,
        color2: number
    ): void;
    composite_color_simple(
        dest_width: number,
        dest_height: number,
        interp_type: InterpType,
        overall_alpha: number,
        check_size: number,
        color1: number,
        color2: number
    ): Pixbuf | null;
    copy(): Pixbuf | null;
    copy_area(
        src_x: number,
        src_y: number,
        width: number,
        height: number,
        dest_pixbuf: Pixbuf,
        dest_x: number,
        dest_y: number
    ): void;
    copy_options(dest_pixbuf: Pixbuf): boolean;
    fill(pixel: number): void;
    flip(horizontal: boolean): Pixbuf | null;
    get_bits_per_sample(): number;
    get_byte_length(): number;
    get_colorspace(): Colorspace;
    get_has_alpha(): boolean;
    get_height(): number;
    get_n_channels(): number;
    get_option(key: string): string | null;
    get_options(): GLib.HashTable<string, string>;
    get_pixels(): Uint8Array;
    get_pixels(): Uint8Array;
    get_rowstride(): number;
    get_width(): number;
    new_subpixbuf(src_x: number, src_y: number, width: number, height: number): Pixbuf;
    read_pixel_bytes(): GLib.Bytes;
    read_pixels(): number;
    remove_option(key: string): boolean;
    rotate_simple(angle: PixbufRotation): Pixbuf | null;
    saturate_and_pixelate(dest: Pixbuf, saturation: number, pixelate: boolean): void;
    save_to_bufferv(
        type: string,
        option_keys?: string[] | null,
        option_values?: string[] | null
    ): [boolean, Uint8Array];
    save_to_callbackv(
        save_func: PixbufSaveFunc,
        type: string,
        option_keys?: string[] | null,
        option_values?: string[] | null
    ): boolean;
    save_to_streamv(
        stream: Gio.OutputStream,
        type: string,
        option_keys?: string[] | null,
        option_values?: string[] | null,
        cancellable?: Gio.Cancellable | null
    ): boolean;
    save_to_streamv_async(
        stream: Gio.OutputStream,
        type: string,
        option_keys?: string[] | null,
        option_values?: string[] | null,
        cancellable?: Gio.Cancellable | null,
        callback?: Gio.AsyncReadyCallback<this> | null
    ): void;
    savev(filename: string, type: string, option_keys?: string[] | null, option_values?: string[] | null): boolean;
    scale(
        dest: Pixbuf,
        dest_x: number,
        dest_y: number,
        dest_width: number,
        dest_height: number,
        offset_x: number,
        offset_y: number,
        scale_x: number,
        scale_y: number,
        interp_type: InterpType
    ): void;
    scale_simple(dest_width: number, dest_height: number, interp_type: InterpType): Pixbuf | null;
    set_option(key: string, value: string): boolean;
    static calculate_rowstride(
        colorspace: Colorspace,
        has_alpha: boolean,
        bits_per_sample: number,
        width: number,
        height: number
    ): number;
    static get_file_info(filename: string): [PixbufFormat | null, number, number];
    static get_file_info_async(
        filename: string,
        cancellable?: Gio.Cancellable | null
    ): Promise<[PixbufFormat | null, number, number]>;
    static get_file_info_async(
        filename: string,
        cancellable: Gio.Cancellable | null,
        callback: Gio.AsyncReadyCallback<Pixbuf> | null
    ): void;
    static get_file_info_async(
        filename: string,
        cancellable?: Gio.Cancellable | null,
        callback?: Gio.AsyncReadyCallback<Pixbuf> | null
    ): Promise<[PixbufFormat | null, number, number]> | void;
    static get_file_info_finish(async_result: Gio.AsyncResult): [PixbufFormat | null, number, number];
    static get_formats(): PixbufFormat[];
    static init_modules(path: string): boolean;
    static new_from_stream_async(stream: Gio.InputStream, cancellable?: Gio.Cancellable | null): Promise<Pixbuf>;
    static new_from_stream_async(
        stream: Gio.InputStream,
        cancellable: Gio.Cancellable | null,
        callback: Gio.AsyncReadyCallback<Pixbuf> | null
    ): void;
    static new_from_stream_async(
        stream: Gio.InputStream,
        cancellable?: Gio.Cancellable | null,
        callback?: Gio.AsyncReadyCallback<Pixbuf> | null
    ): Promise<Pixbuf> | void;
    static new_from_stream_at_scale_async(
        stream: Gio.InputStream,
        width: number,
        height: number,
        preserve_aspect_ratio: boolean,
        cancellable?: Gio.Cancellable | null,
        callback?: Gio.AsyncReadyCallback<Pixbuf> | null
    ): void;
    static save_to_stream_finish(async_result: Gio.AsyncResult): boolean;

    // Implemented Members

    equal(icon2?: Gio.Icon | null): boolean;
    hash(): number;
    serialize(): GLib.Variant | null;
    to_string(): string | null;
    vfunc_equal(icon2?: Gio.Icon | null): boolean;
    vfunc_hash(): number;
    vfunc_serialize(): GLib.Variant | null;
    vfunc_to_tokens(): [boolean, string[], number];
    load(size: number, cancellable?: Gio.Cancellable | null): [Gio.InputStream, string];
    load_async(size: number, cancellable?: Gio.Cancellable | null): Promise<[Gio.InputStream, string]>;
    load_async(size: number, cancellable: Gio.Cancellable | null, callback: Gio.AsyncReadyCallback<this> | null): void;
    load_async(
        size: number,
        cancellable?: Gio.Cancellable | null,
        callback?: Gio.AsyncReadyCallback<this> | null
    ): Promise<[Gio.InputStream, string]> | void;
    load_finish(res: Gio.AsyncResult): [Gio.InputStream, string];
    vfunc_load(size: number, cancellable?: Gio.Cancellable | null): [Gio.InputStream, string];
    vfunc_load_async(size: number, cancellable?: Gio.Cancellable | null): Promise<[Gio.InputStream, string]>;
    vfunc_load_async(
        size: number,
        cancellable: Gio.Cancellable | null,
        callback: Gio.AsyncReadyCallback<this> | null
    ): void;
    vfunc_load_async(
        size: number,
        cancellable?: Gio.Cancellable | null,
        callback?: Gio.AsyncReadyCallback<this> | null
    ): Promise<[Gio.InputStream, string]> | void;
    vfunc_load_finish(res: Gio.AsyncResult): [Gio.InputStream, string];
}
export module PixbufAnimation {
    export interface ConstructorProperties extends GObject.Object.ConstructorProperties {
        [key: string]: any;
    }
}
export class PixbufAnimation extends GObject.Object {
    static $gtype: GObject.GType<PixbufAnimation>;

    constructor(properties?: Partial<PixbufAnimation.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<PixbufAnimation.ConstructorProperties>, ...args: any[]): void;

    // Constructors

    static new_from_file(filename: string): PixbufAnimation;
    static new_from_resource(resource_path: string): PixbufAnimation;
    static new_from_stream(stream: Gio.InputStream, cancellable?: Gio.Cancellable | null): PixbufAnimation;
    static new_from_stream_finish(async_result: Gio.AsyncResult): PixbufAnimation;

    // Members

    get_height(): number;
    get_iter(start_time?: GLib.TimeVal | null): PixbufAnimationIter;
    get_static_image(): Pixbuf;
    get_width(): number;
    is_static_image(): boolean;
    vfunc_get_iter(start_time?: GLib.TimeVal | null): PixbufAnimationIter;
    vfunc_get_size(width: number, height: number): void;
    vfunc_get_static_image(): Pixbuf;
    vfunc_is_static_image(): boolean;
    static new_from_stream_async(
        stream: Gio.InputStream,
        cancellable?: Gio.Cancellable | null
    ): Promise<PixbufAnimation>;
    static new_from_stream_async(
        stream: Gio.InputStream,
        cancellable: Gio.Cancellable | null,
        callback: Gio.AsyncReadyCallback<PixbufAnimation> | null
    ): void;
    static new_from_stream_async(
        stream: Gio.InputStream,
        cancellable?: Gio.Cancellable | null,
        callback?: Gio.AsyncReadyCallback<PixbufAnimation> | null
    ): Promise<PixbufAnimation> | void;
}
export module PixbufAnimationIter {
    export interface ConstructorProperties extends GObject.Object.ConstructorProperties {
        [key: string]: any;
    }
}
export class PixbufAnimationIter extends GObject.Object {
    static $gtype: GObject.GType<PixbufAnimationIter>;

    constructor(properties?: Partial<PixbufAnimationIter.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<PixbufAnimationIter.ConstructorProperties>, ...args: any[]): void;

    // Members

    advance(current_time?: GLib.TimeVal | null): boolean;
    get_delay_time(): number;
    get_pixbuf(): Pixbuf;
    on_currently_loading_frame(): boolean;
    vfunc_advance(current_time?: GLib.TimeVal | null): boolean;
    vfunc_get_delay_time(): number;
    vfunc_get_pixbuf(): Pixbuf;
    vfunc_on_currently_loading_frame(): boolean;
}
export module PixbufLoader {
    export interface ConstructorProperties extends GObject.Object.ConstructorProperties {
        [key: string]: any;
    }
}
export class PixbufLoader extends GObject.Object {
    static $gtype: GObject.GType<PixbufLoader>;

    constructor(properties?: Partial<PixbufLoader.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<PixbufLoader.ConstructorProperties>, ...args: any[]): void;

    // Signals

    connect(id: string, callback: (...args: any[]) => any): number;
    connect_after(id: string, callback: (...args: any[]) => any): number;
    emit(id: string, ...args: any[]): void;
    connect(signal: "area-prepared", callback: (_source: this) => void): number;
    connect_after(signal: "area-prepared", callback: (_source: this) => void): number;
    emit(signal: "area-prepared"): void;
    connect(
        signal: "area-updated",
        callback: (_source: this, x: number, y: number, width: number, height: number) => void
    ): number;
    connect_after(
        signal: "area-updated",
        callback: (_source: this, x: number, y: number, width: number, height: number) => void
    ): number;
    emit(signal: "area-updated", x: number, y: number, width: number, height: number): void;
    connect(signal: "closed", callback: (_source: this) => void): number;
    connect_after(signal: "closed", callback: (_source: this) => void): number;
    emit(signal: "closed"): void;
    connect(signal: "size-prepared", callback: (_source: this, width: number, height: number) => void): number;
    connect_after(signal: "size-prepared", callback: (_source: this, width: number, height: number) => void): number;
    emit(signal: "size-prepared", width: number, height: number): void;

    // Constructors

    static ["new"](): PixbufLoader;
    static new_with_mime_type(mime_type: string): PixbufLoader;
    static new_with_type(image_type: string): PixbufLoader;

    // Members

    close(): boolean;
    get_animation(): PixbufAnimation | null;
    get_format(): PixbufFormat | null;
    get_pixbuf(): Pixbuf | null;
    set_size(width: number, height: number): void;
    write(buf: Uint8Array | string): boolean;
    write_bytes(buffer: GLib.Bytes | Uint8Array): boolean;
    vfunc_area_prepared(): void;
    vfunc_area_updated(x: number, y: number, width: number, height: number): void;
    vfunc_closed(): void;
    vfunc_size_prepared(width: number, height: number): void;
}
export module PixbufNonAnim {
    export interface ConstructorProperties extends PixbufAnimation.ConstructorProperties {
        [key: string]: any;
    }
}
export class PixbufNonAnim extends PixbufAnimation {
    static $gtype: GObject.GType<PixbufNonAnim>;

    constructor(properties?: Partial<PixbufNonAnim.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<PixbufNonAnim.ConstructorProperties>, ...args: any[]): void;

    // Constructors

    static ["new"](pixbuf: Pixbuf): PixbufNonAnim;
}
export module PixbufSimpleAnim {
    export interface ConstructorProperties extends PixbufAnimation.ConstructorProperties {
        [key: string]: any;
        loop: boolean;
    }
}
export class PixbufSimpleAnim extends PixbufAnimation {
    static $gtype: GObject.GType<PixbufSimpleAnim>;

    constructor(properties?: Partial<PixbufSimpleAnim.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<PixbufSimpleAnim.ConstructorProperties>, ...args: any[]): void;

    // Properties
    get loop(): boolean;
    set loop(val: boolean);

    // Constructors

    static ["new"](width: number, height: number, rate: number): PixbufSimpleAnim;

    // Members

    add_frame(pixbuf: Pixbuf): void;
    get_loop(): boolean;
    set_loop(loop: boolean): void;
}
export module PixbufSimpleAnimIter {
    export interface ConstructorProperties extends PixbufAnimationIter.ConstructorProperties {
        [key: string]: any;
    }
}
export class PixbufSimpleAnimIter extends PixbufAnimationIter {
    static $gtype: GObject.GType<PixbufSimpleAnimIter>;

    constructor(properties?: Partial<PixbufSimpleAnimIter.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<PixbufSimpleAnimIter.ConstructorProperties>, ...args: any[]): void;
}

export class PixbufFormat {
    static $gtype: GObject.GType<PixbufFormat>;

    constructor(copy: PixbufFormat);

    // Fields
    name: string;
    signature: PixbufModulePattern;
    domain: string;
    description: string;
    mime_types: string[];
    extensions: string[];
    flags: number;
    disabled: boolean;
    license: string;

    // Members
    copy(): PixbufFormat;
    free(): void;
    get_description(): string;
    get_extensions(): string[];
    get_license(): string;
    get_mime_types(): string[];
    get_name(): string;
    is_disabled(): boolean;
    is_save_option_supported(option_key: string): boolean;
    is_scalable(): boolean;
    is_writable(): boolean;
    set_disabled(disabled: boolean): void;
}

export class PixbufModule {
    static $gtype: GObject.GType<PixbufModule>;

    constructor(copy: PixbufModule);

    // Fields
    module_name: string;
    module_path: string;
    module: GModule.Module;
    info: PixbufFormat;
    load: PixbufModuleLoadFunc;
    load_xpm_data: PixbufModuleLoadXpmDataFunc;
    stop_load: PixbufModuleStopLoadFunc;
    load_increment: PixbufModuleIncrementLoadFunc;
    load_animation: PixbufModuleLoadAnimationFunc;
    save: PixbufModuleSaveFunc;
    is_save_option_supported: PixbufModuleSaveOptionSupportedFunc;
}

export class PixbufModulePattern {
    static $gtype: GObject.GType<PixbufModulePattern>;

    constructor(
        properties?: Partial<{
            prefix?: string;
            mask?: string;
            relevance?: number;
        }>
    );
    constructor(copy: PixbufModulePattern);

    // Fields
    prefix: string;
    mask: string;
    relevance: number;
}
