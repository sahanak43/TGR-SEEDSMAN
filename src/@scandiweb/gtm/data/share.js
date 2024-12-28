/** @namespace Seedsman/@Scandiweb/Gtm/Data/Share/getShareData */
export const getShareData = async (type, contentType, productId) => ({
    ecommerce: {
        type, contentType, productId
    }
});
