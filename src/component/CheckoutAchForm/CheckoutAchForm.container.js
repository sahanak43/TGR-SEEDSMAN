import { PureComponent } from 'react';

import { CheckoutAchFormComponent } from './CheckoutAchForm.component';
/** @namespace Seedsman/Component/CheckoutAchForm/Container */
export class CheckoutAchFormContainer extends PureComponent {
    state = {
        accountNumber: '',
        RoutingNumber: ''
    };

    containerFunctions = {
        handleFieldRoutingNumber: this.handleFieldRoutingNumber.bind(this)
    };

    containerProps() {
        const {
            accountNumber,
            RoutingNumber
        } = this.state;

        return {
            accountNumber,
            RoutingNumber
        };
    }

    handleFieldRoutingNumber(e) {
        const { name, value } = e.target;

        switch (name) {
        case 'AccountNumber':
            this.setState({
                accountNumber: value
            });

            break;
        case 'RoutingNumber':
            this.setState({
                RoutingNumber: value
            });
            break;

        default:
            break;
        }
    }

    render() {
        return (
            <CheckoutAchFormComponent
              { ...this.containerProps() }
              { ...this.containerFunctions }
            />
        );
    }
}
export default CheckoutAchFormContainer;
