const baseURL = "https://addresskit.cas.so";
// Lấy danh sách tỉnh/thành hiệu lực tại thời điểm cụ thể.
// /latest/provinces
export interface Province {
  code: string;
  name: string;
  englishName: string;
  administrativeLevel: string;
  decree: string;
}
export interface Commune {
  code: string;
  name: string;
  englishName: string;
  administrativeLevel: string;
  provinceCode: string;
  provinceName: string;
  decree: string;
}

export const getProvinces = async () => {
  const response = await fetch(`${baseURL}/latest/provinces`);
  return (await response.json()).provinces as Province[];
};

// Lấy danh sách phường/xã thuộc tỉnh
// /latest/provinces/{provinceID}/communes
export const getWardsOfProvince = async (provinceCode: string) => {
  const response = await fetch(
    `${baseURL}/latest/provinces/${provinceCode}/communes`
  );
  return (await response.json()).communes as Commune[];
};
