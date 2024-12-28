import { connect } from 'react-redux';

import {
    mapDispatchToProps as sourceMapDispatchToProps,
    mapStateToProps as sourceMapStateToProps,
    ProductContainer as SourceProductContainer
} from 'SourceComponent/Product/Product.container';
import { showNotification } from 'Store/Notification/Notification.action';
import { showPopup } from 'Store/Popup/Popup.action';
import { setConfigParameters } from 'Store/Product/Product.action';
import fromCache from 'Util/Cache/Cache';
import history from 'Util/History';
import { getNewParameters, getVariantIndex } from 'Util/Product';
import {
    getMaxQuantity,
    getMinQuantity,
    getName,
    getPrice,
    getProductInStock
} from 'Util/Product/Extract';
import { appendWithStoreCode } from 'Util/Url';
import { validateGroup } from 'Util/Validator';

/** @namespace Seedsman/Component/Product/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    ...sourceMapDispatchToProps(dispatch),
    setConfigParameters: (parameters) => dispatch(setConfigParameters(parameters)),
    showNotification: (type, message) => dispatch(showNotification(type, message)),
    showPopup: (payload) => dispatch(showPopup('AddToCartPopup', payload))
});

/** @namespace Seedsman/Component/Product/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    ...sourceMapStateToProps(state),
    cartId: state.CartReducer.cartTotals?.id
});

/** @namespace Seedsman/Component/Product/Container */
export class ProductContainer extends SourceProductContainer {
    state = {
        // Used for customizable & bundle options
        enteredOptions: this.setDefaultProductOptions('defaultEnteredOptions', 'enteredOptions'),
        selectedOptions: this.setDefaultProductOptions('defaultSelectedOptions', 'selectedOptions'),
        addToCartTriggeredWithError: false,
        // Used for downloadable
        downloadableLinks: [],

        quantity: 1,

        // Used to add to the base price a selected option prices
        adjustedPrice: {},

        // Used for configurable product - it can be ether parent or variant
        selectedProduct: null,
        // eslint-disable-next-line react/destructuring-assignment
        parameters: this.props.parameters,
        isShowPopup: false,
        contentExpand: false
    };

    containerFunctions = {
        addToCart: this.addToCart.bind(this),

        // Used to update entered and selected state values
        updateSelectedValues: this.updateSelectedValues.bind(this),
        setDownloadableLinks: this.setStateOptions.bind(this, 'downloadableLinks'),
        setQuantity: this.setQuantity.bind(this),
        setAdjustedPrice: this.setAdjustedPrice.bind(this),

        getActiveProduct: this.getActiveProduct.bind(this),
        setActiveProduct: this.updateConfigurableVariant.bind(this),
        getMagentoProduct: this.getMagentoProduct.bind(this),
        setValidator: this.setValidator.bind(this),
        scrollOptionsIntoView: this.scrollOptionsIntoView.bind(this),
        updateAddToCartTriggeredWithError: this.updateAddToCartTriggeredWithError.bind(this),
        onClickShowPopup: this.onClickShowPopup.bind(this),
        handlePopup: this.handlePopup.bind(this)
    };

    async addToCart(isBuyNow = false) {
        this.updateSelectedValues();
        const { showError } = this.props;

        if (this.hasError()) {
            return;
        }

        const { addProductToCart, cartId } = this.props;
        const products = this.getMagentoProduct();
        await addProductToCart({ products, cartId })
            .catch(
                /** @namespace Seedsman/Component/Product/Container/ProductContainer/addToCart/addProductToCart/catch */
                (error) => {
                    if (error) {
                        showError(error);
                    }
                }
            );

        if (isBuyNow) {
            history.push({ pathname: appendWithStoreCode('/checkout') });
        }
    }

    hasError() {
        const { errorMessages, errorFields, values } = validateGroup(this.validator);
        const { showNotification } = this.props;

        if (
            errorFields
            || errorMessages
            || this.validateConfigurableProduct()
            || this.filterAddToCartFileErrors(values)
        ) {
            this.scrollOptionsIntoView();
            this.setState({ addToCartTriggeredWithError: true });
            showNotification('info', 'Incorrect or missing options!');

            return true;
        }

        return false;
    }

    /**
     * Updates configurable products selected variant
     * @param key
     * @param value
     */
    // eslint-disable-next-line consistent-return
    updateConfigurableVariant(key, value, checkEmptyValue = false) {
        const { parameters: prevParameters } = this.state;
        const { setConfigParameters } = this.props;

        const newParameters = getNewParameters(prevParameters, key, value);

        const { [key]: oldValue, ...currentParameters } = newParameters;
        const parameters = oldValue === '' && checkEmptyValue ? currentParameters : newParameters;

        this.setState({ parameters });

        const { product: { variants, configurable_options } } = this.props;
        const { selectedProduct } = this.state;

        const newIndex = Object.keys(parameters).length === Object.keys(configurable_options).length
            ? getVariantIndex(variants, parameters)
        // Not all parameters are selected yet, therefore variantIndex must be invalid
            : -1;

        const newProduct = newIndex === -1 ? null : variants[newIndex];

        if (newProduct !== selectedProduct) {
            setConfigParameters(parameters);

            this.setState({
                selectedProduct: newProduct,
                parameters
            });

            return newProduct;
        }
    }

    onClickShowPopup() {
        this.setState({
            isShowPopup: true
        });
    }

    handlePopup() {
        this.setState({
            isShowPopup: false
        });
    }

    containerProps() {
        const {
            quantity,
            parameters,
            adjustedPrice,
            unselectedOptions,
            addToCartTriggeredWithError,
            isShowPopup
        } = this.state;
        const {
            product,
            product: { options = [] } = {},
            configFormRef,
            device,
            isWishlistEnabled
        } = this.props;

        const activeProduct = this.getActiveProduct();
        const magentoProduct = this.getMagentoProduct();
        const {
            price_range: priceRange = {},
            dynamic_price: dynamicPrice = false,
            type_id: type
        } = activeProduct || {};

        const output = {
            inStock: fromCache(getProductInStock, [activeProduct, product]),
            maxQuantity: getMaxQuantity(activeProduct),
            minQuantity: getMinQuantity(activeProduct),
            productName: getName(product),
            productPrice: fromCache(getPrice, [priceRange, dynamicPrice, adjustedPrice, type, options])
        };

        return {
            isWishlistEnabled,
            unselectedOptions,
            quantity,
            product,
            configFormRef,
            parameters,
            device,
            magentoProduct,
            addToCartTriggeredWithError,
            isShowPopup,
            ...output
        };
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductContainer);
