import Field from 'Component/Field';
import FIELD_TYPE from 'Component/Field/Field.config';
import {
    CurrencySwitcher as SourceCurrencySwitcher
} from 'SourceComponent/CurrencySwitcher/CurrencySwitcher.component';

import './CurrencySwitcher.override.style';

/** @namespace Seedsman/Component/CurrencySwitcher/Component */
export class CurrencySwitcherComponent extends SourceCurrencySwitcher {
    render() {
        const {
            handleCurrencySelect,
            currencyData: {
                available_currencies_data: availableCurrencies
            } = {}
        } = this.props;

        if (availableCurrencies && availableCurrencies.length > 1) {
            const availableCurrenciesArray = [];

            // eslint-disable-next-line array-callback-return
            availableCurrencies.map((Currency) => {
                const currencyValue = `${Currency.value}`;
                const currencyLabel = `${Currency.symbol} ${Currency.label}`;
                const currencyOption = {
                    id: Currency.id,
                    label: currencyLabel,
                    value: currencyValue
                };

                availableCurrenciesArray.push(currencyOption);
            });

            return (
                <div block="CurrencySwitcher">
                    <Field
                      type={ FIELD_TYPE.select }
                      bablicExclude
                      attr={ {
                          id: 'CurrencySwitcherList',
                          name: 'CurrencySwitcherList',
                          defaultValue: this.getCurrencyValue(),
                          noPlaceholder: true
                      } }
                      events={ {
                          onChange: handleCurrencySelect
                      } }
                      options={ availableCurrenciesArray }
                    />
                </div>
            );
        }

        return null;
    }
}

export default CurrencySwitcherComponent;
