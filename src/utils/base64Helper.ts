// Helper functions to encode and decode Base64 UTF-8 payloads for Firestore Database storage

export const encodeBase64 = (data: any): string => {
  try {
    const jsonStr = JSON.stringify(data);
    return btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (_, p1) => 
      String.fromCharCode(parseInt(p1, 16))
    ));
  } catch (err) {
    console.error("Base64 encode error:", err);
    return "";
  }
};

export const decodeBase64 = <T = any>(base64Str: string): T | null => {
  try {
    const jsonStr = decodeURIComponent(Array.prototype.map.call(atob(base64Str), (c: string) => 
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    return JSON.parse(jsonStr) as T;
  } catch (err) {
    console.error("Base64 decode error:", err);
    return null;
  }
};
