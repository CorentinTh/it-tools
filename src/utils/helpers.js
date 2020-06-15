const copyToClipboard = (text) => {
    const input = document.createElement('textarea');
    input.innerHTML = text;
    document.body.appendChild(input);
    input.select();
    const result = document.execCommand('copy');
    document.body.removeChild(input);
    return result;
}

const fileIsImage = (file) => {
    return file.type.split('/')[0] === 'image';
}

const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const isInt = (value) => {
    return Number.isInteger(value);
}

const debounce = (callback, delay = 300) => {
    let timer;

    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => callback(...args), delay);
    }
}

const randFromArray = (array) => array[Math.floor(Math.random() * array.length)];

const randIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min) + min)

export {
    copyToClipboard,
    fileIsImage,
    formatBytes,
    isInt,
    debounce,
    randFromArray,
    randIntFromInterval
}