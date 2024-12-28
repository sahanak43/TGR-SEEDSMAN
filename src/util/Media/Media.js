import getStore from 'Util/Store';

export const WYSIWYG_MEDIA = 'wysiwyg/';
export const CATEGORY_MEDIA = 'catalog/category/';
export const PRODUCT_MEDIA = 'catalog/product';
export const LOGO_MEDIA = 'logo/';
export const BRAND_LOGO_MEDIA = 'wysiwyg/brand-logos/';

export default (src, subPath = '', isMediaPath = true) => {
    // If isMediaPath is passed return local media path

    const { ConfigReducer: { secure_base_media_url, base_url } } = getStore().getState();
    const baseUrl = isMediaPath
        ? secure_base_media_url || '/media/'
        : base_url;

    return `${ baseUrl }${ subPath }${ src }`;
};
