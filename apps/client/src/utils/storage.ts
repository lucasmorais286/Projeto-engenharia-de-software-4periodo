export const localStorageSet = (key: string, data: string) => {
	return localStorage.setItem(key, data);
};

export const localStorageGetKey = (key: string) => {
	return localStorage.getItem(key);
};

export const localStorageClear = () => {
	return localStorage.clear();
};
