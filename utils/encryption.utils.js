import CryptoJS from "crypto-js";

export const Encryption = async({value , secretkey} = {}) => {  // 34an lw 7d 8lt w mb3t4 object da default value y3nii
    return CryptoJS.AES.encrypt(JSON.stringify(value) , secretkey).toString(); // we must applied solid principles at least single responsiplity this function only for encryption not decryption
}

export const decryption = async({cipher ,secretkey} = {}) => {
    return CryptoJS.AES.decrypt(cipher , secretkey).toString(CryptoJS.enc.Utf8)
}