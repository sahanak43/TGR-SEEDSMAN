/**
 * Mageplaza Product Label compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

/** @namespace Seedsman/@Scandiweb/MageplazaProductLabel/Util/ProductLabels/processCss */
export const processCss = (css, ruleId, productId, same) => {
    if (!css) {
        return '';
    }

    if (same) {
        /* eslint-disable no-param-reassign */
        css = css.replace(/design-labels/gm, `design-labels-${ruleId}-${productId}`);
        css = css.replace(/design-label-image/gm, `design-label-image-${ruleId}-${productId}`);
        css = css.replace(/design-label-text/gm, `design-label-text-${ruleId}-${productId}`);
        /* eslint-enable no-param-reassign */
    } else {
        /* eslint-disable no-param-reassign */
        css = css.replace(/design-labels-list/gm, `design-labels-${ruleId}-${productId}`);
        css = css.replace(/design-label-image-list/gm, `design-label-image-${ruleId}-${productId}`);
        css = css.replace(/design-label-text-list/gm, `design-label-text-${ruleId}-${productId}`);
        /* eslint-enable no-param-reassign */
    }

    return css;
};

/** @namespace Seedsman/@Scandiweb/MageplazaProductLabel/Util/ProductLabels/processLabel */
export const processLabel = (labelData, product, isProductPage, pWidth, pHeight) => {
    const {
        rule_id,
        same,
        label,
        label_css,
        label_color,
        label_image,
        label_template,
        label_position,
        label_font,
        label_font_size,
        label_position_grid,
        list_label,
        list_css,
        list_color,
        list_image,
        list_template,
        list_position,
        list_font,
        list_font_size,
        list_position_grid,
        product_tooltip,
        list_product_tooltip
    } = labelData;

    const isList = same ? true : !isProductPage;

    const {
        label: {
            width: lWidth,
            height: lHeight,
            percentTop,
            percentLeft
        }
    } = JSON.parse(!isList ? list_position : label_position);

    const ONE_HUNDRED = 100;

    // $width    = $posData['label']['width'] * 100 / $this->getProductImgWidth();
    // $height   = $posData['label']['height'] * 100 / $this->getProductImgHeight();
    // $top      = (($this->getProductImgHeight() - $posData['label']['height']) * $posData['label']['percentTop'] / 100) / $this->getProductImgHeight() * 100;
    // $left     = (($this->getProductImgWidth() - $posData['label']['width']) * $posData['label']['percentLeft'] / 100) / $this->getProductImgWidth() * 100;

    // vvv Enabled to match original formula
    /* eslint-disable no-mixed-operators */
    const width = `${(lWidth * ONE_HUNDRED / pWidth).toFixed(2)}%`;
    const height = `${(lHeight * ONE_HUNDRED / pHeight).toFixed(2)}%`;
    const top = `${(((pHeight - lHeight) * percentTop / ONE_HUNDRED) / pHeight * ONE_HUNDRED).toFixed(2)}%`;
    const left = `${(((pWidth - lWidth) * percentLeft / ONE_HUNDRED) / pWidth * ONE_HUNDRED).toFixed(2)}%`;
    /* eslint-enable no-mixed-operators */

    const positionMap = {
        tl: {
            width,
            height,
            top: 0,
            left: 0
        },
        tc: {
            width,
            height,
            top: 0,
            left
        },
        tr: {
            width,
            height,
            top: 0,
            right: 0
        },
        cl: {
            width,
            height,
            top,
            left: 0
        },
        cc: {
            width,
            height,
            top,
            left
        },
        cr: {
            width,
            height,
            top,
            right: 0
        },
        bl: {
            width,
            height,
            bottom: 0,
            left: 0
        },
        bc: {
            width,
            height,
            bottom: 0,
            left
        },
        br: {
            width,
            height,
            bottom: 0,
            right: 0
        }
    };

    // vvv Fallback to top-left
    const position = isList ? list_position_grid : label_position_grid;
    const positionStyle = positionMap[position || 'tl'];

    const fontFamily = isList ? list_font : label_font;
    const fontUrl = `https://fonts.googleapis.com/css?family=${ fontFamily.replace(' ', '+') }`;

    const textStyle = {
        fontFamily,
        fontSize: `${isList ? list_font_size : label_font_size}px`,
        color: isList ? list_color : label_color
    };

    const { id: productId } = product;
    const customCss = processCss(isList ? list_css : label_css, rule_id, productId, same);
    const templateSrc = isList ? list_template : label_template;
    const imageSrc = isList ? list_image : label_image;
    const replacedLabel = isList ? list_label : label;
    const replacedTooltipLabel = isList ? list_product_tooltip : product_tooltip;

    return {
        ruleId: rule_id,
        productId,
        positionStyle,
        textStyle,
        customCss,
        imageSrc: templateSrc || imageSrc,
        label: replacedLabel,
        tooltipLabel: replacedTooltipLabel,
        fontUrl
    };
};
