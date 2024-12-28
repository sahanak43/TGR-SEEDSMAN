/* eslint-disable no-debugger */
/* eslint-disable no-unused-expressions */
import { ConfigQuery as SourceConfigQuery } from 'SourceQuery/Config.query';
import { Field } from 'SourceUtil/Query';

/** @namespace Seedsman/Query/Config/Query */
export class ConfigQuery extends SourceConfigQuery {
    _getStoreConfigFields() {
        const fields = super._getStoreConfigFields();
        fields.push(
            'recaptcha_frontend_type_recaptcha_public_key',
            'bablic_status',
            'bablic_script_url',
            'catalog_default_sort_by',
            'carriers_freeshipping_active',
            'carriers_freeshipping_free_shipping_subtotal',
            'ring_fenced_status',
            'ring_fenced_url',
            'insider_url',
            'zendesk_script_url',
            'zendesk_status',
            'plp_enable',
            'pdp_enable',
            'reviews_widget_url',
            'reviews_url',
            'amsorting_global_direction',
            'amrewards_points_rate',
            'website_id',
            'display_tax_in_checkout',
            'enable_google_address_search',
            'recaptcha_frontend_type_for_place_order',
            this.getMinOrderAmtDet(),
            this.getRobotsMetaData()
        );

        return fields;
    }

    getMinOrderAmtDet() {
        return new Field('minimum_order_amount')
            .addFieldList(this.getMinOrderAmt());
    }

    getRobotsMetaData() {
        return new Field('seo_robots')
            .addFieldList(this.getRobotsMetaValue());
    }

    getRobotsMetaValue() {
        return [
            'route_path',
            'robots'
        ];
    }

    getMinOrderAmt() {
        return [
            'minimum_amount',
            'enable',
            'description_message',
            'include_discount_amount'
        ];
    }

    getAddressTypeOptions() {
        return new Field('getAddressTypeOptions')
            .addFieldList(this.getAddressTypeOption());
    }

    getAddressTypeOption() {
        return [
            'value',
            'label'
        ];
    }

    getCurrencyData() {
        return new Field('currencyData')
            .addFieldList([
                this.getCurrencyField(),
                'current_currency_code',
                'current_currency_symbol'
            ]);
    }

    getCurrencyField() {
        return new Field('available_currencies_data')
            .addFieldList([
                'available_currency_codes',
                'base_currency_code',
                'base_currency_symbol',
                'symbol',
                'id',
                'label',
                'value'
            ]);
    }
}
export default new ConfigQuery();
