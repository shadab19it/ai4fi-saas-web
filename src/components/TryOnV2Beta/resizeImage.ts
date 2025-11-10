export type InputImage = string | File | Blob; // string must be DataURL or an http(s) URL


export type FitMode = "contain" | "cover" | "stretch";


export interface ResizeOptions {
    width: number; // target width in px
    height: number; // target height in px
    keepAspect?: boolean; // if true, height is auto-computed from width (or width from height)
    fit?: FitMode; // none used if keepAspect true; for when both w & h are provided
    mimeType?: "image/png" | "image/jpeg" | "image/webp";
    quality?: number; // 0..1 (jpeg/webp)
    background?: string; // only used with contain mode to fill empty space, default transparent
}


// ---------- Helpers ----------
const isDataUrl = (s: string) => /^data:image\/(png|jpeg|jpg|webp);base64,/i.test(s);
const isHttpUrl = (s: string) => /^https?:\/\//i.test(s);


function readAsDataURL(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onerror = () => reject(fr.error);
        fr.onload = () => resolve(String(fr.result));
        fr.readAsDataURL(blob);
    });
}


async function inputToDataURL(input: InputImage): Promise<string> {
    if (typeof input === "string") {
        if (isDataUrl(input)) return input;
        if (isHttpUrl(input)) return input; // we'll set crossOrigin and load directly
        // If you need raw Base64 without header, add your own prefix before passing here.
        throw new Error(
            "String inputs must be a Data URL (start with data:image/...) or an http(s) URL."
        );
    }
    // File/Blob -> Data URL
    return await readAsDataURL(input);
}


function loadHTMLImageElement(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        // Allow cross-origin loading for http(s) URLs; caller is responsible for CORS availability
        if (isHttpUrl(src)) img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Failed to load image."));
        img.src = src;
    });
}


function computeContainCover(
    srcW: number,
    srcH: number,
    dstW: number,
    dstH: number,
    mode: FitMode
) {
    const srcAspect = srcW / srcH;
    const dstAspect = dstW / dstH;


    if (mode === "stretch") {
        return {
            sx: 0,
            sy: 0,
            sw: srcW,
            sh: srcH,
            dx: 0,
            dy: 0,
            dw: dstW,
            dh: dstH,
        } as const;
    }


    if (mode === "contain") {
        let dw = dstW;
        let dh = Math.round(dstW / srcAspect);
        if (dh > dstH) {
            dh = dstH;
            dw = Math.round(dstH * srcAspect);
        }
        return {
            sx: 0,
            sy: 0,
            sw: srcW,
            sh: srcH,
            dx: Math.floor((dstW - dw) / 2),
            dy: Math.floor((dstH - dh) / 2),
            dw,
            dh,
        } as const;
    }


    // cover - crop source to match destination aspect ratio, then scale to fill
    // Determine which dimension to use as reference
    if (srcAspect > dstAspect) {
        // Source is wider - crop width, use full height
        const sh = srcH;
        const sw = Math.round(srcH * dstAspect);
        const sx = Math.floor((srcW - sw) / 2);
        const sy = 0;
        return {
            sx,
            sy,
            sw,
            sh,
            dx: 0,
            dy: 0,
            dw: dstW,
            dh: dstH,
        } as const;
    } else {
        // Source is taller - crop height, use full width
        const sw = srcW;
        const sh = Math.round(srcW / dstAspect);
        const sx = 0;
        const sy = Math.floor((srcH - sh) / 2);
        return {
            sx,
            sy,
            sw,
            sh,
            dx: 0,
            dy: 0,
            dw: dstW,
            dh: dstH,
        } as const;
    }
}


async function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number) {
    return new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob as Blob), type, quality);
    });
}



export async function resizeImage(input: InputImage, opts: ResizeOptions): Promise<Blob> {
    // Validate dimensions
    if (!opts.width || opts.width <= 0 || !isFinite(opts.width)) {
        throw new Error("Invalid width: must be a positive finite number");
    }
    if (!opts.height || opts.height <= 0 || !isFinite(opts.height)) {
        throw new Error("Invalid height: must be a positive finite number");
    }

    const dataUrl = await inputToDataURL(input);
    const img = await loadHTMLImageElement(dataUrl);


    const mime = opts.mimeType ?? "image/png";
    const quality = opts.quality ?? 0.92;
    const fit = opts.fit ?? "contain";

    let targetW = Math.max(1, Math.round(opts.width));
    let targetH = Math.max(1, Math.round(opts.height));


    if (opts.keepAspect) {
        const srcAspect = img.naturalWidth / img.naturalHeight;
        if (opts.width && !opts.height) {
            targetH = Math.max(1, Math.round(opts.width / srcAspect));
        } else if (!opts.width && opts.height) {
            targetW = Math.max(1, Math.round(opts.height * srcAspect));
        } else if (opts.width && opts.height) {
            // prioritize width-derived height
            targetH = Math.max(1, Math.round(opts.width / srcAspect));
        } else {
            throw new Error("Provide at least width or height when keepAspect is true.");
        }
    }


    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context not available");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Clear canvas first
    ctx.clearRect(0, 0, targetW, targetH);

    // Fill background if provided (for all modes)
    if (opts.background) {
        ctx.fillStyle = opts.background;
        ctx.fillRect(0, 0, targetW, targetH);
    }

    if (!opts.keepAspect) {
        const { sx, sy, sw, sh, dx, dy, dw, dh } = computeContainCover(
            img.naturalWidth,
            img.naturalHeight,
            targetW,
            targetH,
            fit
        );
        ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
    } else {
        ctx.drawImage(img, 0, 0, targetW, targetH);
    }

    // Ensure canvas dimensions match target dimensions exactly
    if (canvas.width !== targetW || canvas.height !== targetH) {
        // Create a new canvas with exact dimensions if needed
        const finalCanvas = document.createElement("canvas");
        finalCanvas.width = targetW;
        finalCanvas.height = targetH;
        const finalCtx = finalCanvas.getContext("2d");
        if (!finalCtx) throw new Error("Canvas 2D context not available");
        finalCtx.drawImage(canvas, 0, 0, targetW, targetH);
        return await canvasToBlob(finalCanvas, mime, quality);
    }

    return await canvasToBlob(canvas, mime, quality);
}

export function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}


export function defaultExt(mime: string) {
    if (mime.endsWith("jpeg")) return "jpg";
    if (mime.endsWith("png")) return "png";
    if (mime.endsWith("webp")) return "webp";
    return "img";
}