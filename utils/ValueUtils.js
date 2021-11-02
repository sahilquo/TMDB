import { format } from "date-fns";
import { YOUTUBE_THUBNAIL_BASE_URL } from "../network/NetworkData";

export const roundNum = (num) => {
    return Math.round(num * 2) / 2;
}

export const convertCurrency = (num) => {
    if (num > 999 && num < 1000000) {
        return '$' + (num / 1000).toFixed(1).replace(/[.,]0$/, "") + ' K'; // convert to K for number from > 1000 < 1 million 
    } else if (num > 1000000) {
        return '$' + (num / 1000000).toFixed(1).replace(/[.,]0$/, "") + ' Million'; // convert to M for number from > 1 million 
    } else if (num > 100000000) {
        return '$' + (num / 1000000).toFixed(1).replace(/[.,]0$/, "") + ' Billion'; // convert to M for number from > 1 million 
    } else {
        return '$' + num
    }
}

export const formatDate = (value) => {
    let date = new Date(value.toString());
    return format(date, 'dd MMMM yyyy');
}

export const getVideoThumbnail = (videoKey) => {
    return `${YOUTUBE_THUBNAIL_BASE_URL}/${videoKey}/${THUMBNAIL_QUALITY.medium}`;
}

const THUMBNAIL_QUALITY = {
    /// 120*90
    defaultQuality: 'default.jpg',

    /// 320*180
    medium: 'mqdefault.jpg',

    /// 480*360
    high: 'hqdefault.jpg',

    /// 640*480
    standard: 'mqdesddefaultfault.jpg',

    /// Unscaled thumbnail
    max: 'maxresdefault.jpg',
};