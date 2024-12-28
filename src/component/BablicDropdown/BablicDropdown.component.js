/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import { PureComponent } from 'react';

import Field from 'Component/Field';
import FIELD_TYPE from 'Component/Field/Field.config';

// import { isHomePageUrl } from 'Util/Url';
import './BablicDropdown.style';
/** @namespace Seedsman/Component/BablicDropdown/Component */
export class BablicDropdownComponent extends PureComponent {
    renderDropDown() {
        const {
            DropDownlist,
            selectedOption,
            isBablicLoaded,
            isScriptAdded,
            countryCode,
            singleDropdown,
            switchLanguage,
            bablic_status,
            languageCode,
            code
        } = this.props;

        // eslint-disable-next-line fp/no-let
        let { selectedFlag } = this.props;

        if (isBablicLoaded && isScriptAdded && !DropDownlist) {
            return null;
        }

        if (!DropDownlist) {
            return null;
        }

        if (bablic_status && countryCode === 'eu') {
            // render the dropdown
            const availableLanguage = DropDownlist.length !== 0
            && DropDownlist?.map((option) => {
                const { key, name } = option;
                return {
                    id: key,
                    label: name,
                    value: key
                };
            });

            if (!availableLanguage) {
                return null;
            }

            if (languageCode === 'en' && countryCode === 'eu') {
                selectedFlag = 'https://flagcdn.com/48x36/eu.png';
            }

            return (
                <div block="LanguageSwitcher">
                    <img block="LanguageSwitcher" elem="Icon" width={ 40 } src={ selectedFlag } alt={ selectedOption } />
                    <Field
                      type={ FIELD_TYPE.select }
                      bablicExclude
                      attr={ {
                          id: 'LanguageSwitcherList',
                          name: 'LanguageSwitcherList',
                          defaultValue: selectedOption,
                          noPlaceholder: true
                      } }
                    //   value={ selectedOption }
                      events={ {
                          onChange: switchLanguage
                      } }
                      options={ availableLanguage }
                    />
                </div>
            );
        }

        return (
            <div block="LanguageSwitcher">
                <img block="LanguageSwitcher" elem="Icon" width={ 40 } src={ `https://flagcdn.com/48x36/${code}.png` } alt={ selectedOption } />
                <div className="LanguageSwitcherList">
                    { singleDropdown?.name || 'English' }
                </div>
            </div>
        );
    }

    render() {
        return <div block="BablicDropdown">{ this.renderDropDown() }</div>;
    }
}

export default BablicDropdownComponent;
