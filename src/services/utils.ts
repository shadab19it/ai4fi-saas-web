import { toast } from "sonner";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export const setLocalStorage = (name: string, data: any) => localStorage.setItem(name, JSON.stringify(data));
export const getLocalStorage = (name: string) => JSON.parse(localStorage.getItem(name) as any);

export const validatePassword = (password: string) => {
  if (!/[a-z]/.test(password)) {
    return "password should cantain atleast one lowercase letter!";
  } else if (!/[0-9]/.test(password)) {
    return "password should cantain atleast one number!";
  } else if (!/[#?!@$%^&*-]/.test(password)) {
    return "password should cantain atleast one special caracter #?!@$%^&*-";
  } else if (password.length < 6) {
    return "password should cantain atleast 6 characters!";
  } else {
    return "";
  }
};

export const getExtension = (filename: string) => {
  var parts = filename?.split("/");
  return parts[parts?.length - 1];
};

export const removeExtension = (filename: string) => {
  var lastDotPosition = filename.lastIndexOf(".");
  if (lastDotPosition === -1) return filename;
  else return filename.substr(0, lastDotPosition);
};

export const bytesToSize = (bytes: number) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 B";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString(), 10);
  if (i === 0) return `${bytes} ${sizes[i]}`;
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
};

export const truncateString = (str: string, num: number) => {
  if (str && str.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
};

export function parseCookies(cookieHeader: string) {
  const cookies: any = {};
  if (cookieHeader) {
    cookieHeader.split(";").forEach((cookie) => {
      const [name, ...rest] = cookie.split("=");
      cookies[name.trim()] = rest.join("=").trim();
    });
  }
  return cookies;
}

export const createImgFileFromUrl = async (url: string, type: string) => {
  const res = await fetch(url);
  const blob = await res.blob();
  const file = new File([blob], `${type}-${Math.random().toString(36).substring(7)}.jpg`, { type: blob.type });
  return file;
};

export const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  let bstr: string;
  try {
    bstr = atob(arr[1]);
  } catch (e) {
    const base64 = arr[1]?.replace(/[^A-Za-z0-9+/=]/g, '') || '';
    bstr = atob(base64);
  }
  const u8arr = new Uint8Array(bstr.length);
  for (let i = 0; i < bstr.length; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }
  return new File([u8arr], filename, { type: mime });
};

export const copySeed = (seedNo: number) => {
  navigator.clipboard
    .writeText(seedNo.toString())
    .then(() => {
      toast.success("Seed copied to clipboard!");
    })
    .catch((error) => {
      console.error("Failed to copy seed:", error);
      toast.error("Failed to copy seed");
    });
};
