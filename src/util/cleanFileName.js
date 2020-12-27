export const cleanFileName = (fileName = "", prefix = null) => {
    return fileName.replace(prefix ? prefix : "/", "").replace(/\/([^/]*)$/, '$1');
}