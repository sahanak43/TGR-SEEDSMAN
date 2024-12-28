// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/Field';
import FIELD_TYPE from 'Component/Field/Field.config';

import './LanguageSwitcher.style.scss';
// import { getCurrency } from 'Util/Currency';

/** @namespace Seedsman/Component/LanguageSwitcher/Component */
export class LanguageSwitcherComponent extends PureComponent {
    render() {
        const availableLanguage = [{ id: 'EN', label: 'EN', value: 'EN' }];
        return (
                <div block="LanguageSwitcher">
                    <Field
                      type={ FIELD_TYPE.select }
                      attr={ {
                          id: 'LanguageSwitcherList',
                          name: 'LanguageSwitcherList',
                          defaultValue: 'gyugug',
                          noPlaceholder: true
                      } }
                    // //   events={ {
                    // //       onChange: handleCurrencySelect
                    // //   } }
                      options={ availableLanguage }
                    />
                </div>
        );
    }
}

export default LanguageSwitcherComponent;
