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

export {
    copyToClipboard,
    fileIsImage
}