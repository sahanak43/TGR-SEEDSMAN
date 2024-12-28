/* eslint-disable no-restricted-syntax */
/* eslint-disable max-lines */
/* eslint-disable react/require-default-props */
import PropTypes from 'prop-types';
import { Component } from 'react';

import Field from 'Component/Field';
import FIELD_TYPE from 'Component/Field/Field.config';
import Form from 'Component/Form';
import { CountriesType } from 'Type/Config.type';

export const API_KEY = 'AIzaSyBZPOzjJy-wLHcmXKOSwP90O_Sm8x_yhoE';

/** @namespace Seedsman/Util/GoogleMap/Index */
export class GooglemapContainer extends Component {
    static propTypes = {
        onAutoComplete: PropTypes.func.isRequired,
        countries: CountriesType.isRequired
    };

    componentDidMount() {
        if (typeof google === 'undefined') {
            this.appendMapScript();
            // eslint-disable-next-line no-undef
        } else if (typeof google?.maps === 'undefined') {
            this.appendMapScript();
        } else {
            this.loadMap();
        }
    }

    __construct() {
        this.autocomplete = {};
        this.suggestedAddeess = {};
    }

    /**
     * Appends the google map script
     */
    appendMapScript = () => {
        this.script = document.createElement('script');
        this.script.type = 'text/javascript';
        this.script.defer = true;
        this.script.async = true;
        this.script.id = 'googleMapScript';
        this.script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
        this.script.onload = () => {
            window.__googleMapsCallback = this.loadMap();
        };
        document.head.appendChild(this.script);
    };

    /**
     * Removes the google map script
     */
    removeMapScript = () => {
        if (this.script) {
            const _a = document.getElementById('googleMapScript');
            document.head.removeChild(_a);
        }
    };

    /**
     * Format Google place to Magento address format
     * @param {*} place
     * @returns Object
     */
    formatAddressAndSend(place) {
        const { onAutoComplete } = this.props;

        this.currentAddress = {};

        for (const component of place.address_components) {
            const componentType = component.types[0];
            switch (componentType) {
            case 'country':
                this.currentAddress = {
                    ...this.currentAddress,
                    countryId: component.short_name,
                    country: component.long_name
                };
                break;
            case 'postal_code':
                this.currentAddress = {
                    ...this.currentAddress,
                    postcode: component.long_name
                };
                break;
            case 'street_number':
                this.currentAddress = {
                    ...this.currentAddress,
                    AddressLine: component.long_name
                };
                break;
            case 'route':
                const { AddressLine = '' } = this.currentAddress;
                const street_value = AddressLine ? `${ AddressLine } ${ component.long_name }` : component.long_name;

                this.currentAddress = {
                    ...this.currentAddress,
                    street: [street_value]
                };
                break;

            case 'street_address':
                this.currentAddress = {
                    ...this.currentAddress,
                    street: [component.long_name]
                };
                break;
            case 'locality':
                this.currentAddress = {
                    ...this.currentAddress,
                    city: component.long_name
                };
                break;

            case 'administrative_area_level_1':
                this.currentAddress = {
                    ...this.currentAddress,
                    region: {
                        region: component.long_name,
                        region_id: component.short_name,
                        region_string: component.long_name
                    }
                };
                break;

            default:
                break;
            }
        }

        onAutoComplete(this.currentAddress);

        return { address: this.currentAddress };
    }

    /**
     * Map initializer
     */
    loadMap() {
        const { countries } = this.props;

        const countryId = countries.map((country) => country.id);

        const address1Field = document.querySelector('#ship-address');
        // eslint-disable-next-line no-undef
        this.autocomplete = new google.maps.places.Autocomplete(address1Field, {
            componentRestrictions: { country: countryId },
            fields: ['address_components', 'geometry'],
            types: ['address']
        });
        window?.google.maps.event.addListener(this.autocomplete, 'place_changed', () => {
            const place = this.autocomplete.getPlace();
            this.fillInAddress(place);
        });
    }

    fillInAddress(place) {
        this.formatAddressAndSend(place);
    }

    render() {
        return (
            <div block="GoogleMap" elem="AddressSugestion">
                <Form>
                    <Field
                      type={ FIELD_TYPE.text }
                      attr={ {
                          id: 'ship-address',
                          name: 'ship-address',
                          placeholder: 'Search Your Address here',
                          'aria-label': 'Search Your Address here'
                      } }
                      validateOn={ ['onChange'] }
                      label="Start typing your address/zipcode"
                    />
                </Form>
            </div>
        );
    }
}

export default GooglemapContainer;
