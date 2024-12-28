/* eslint-disable no-unreachable */

/* eslint-disable react/prop-types */
/* eslint-disable @scandipwa/scandipwa-guidelines/always-both-mappings */
/* eslint-disable consistent-return */
/* eslint-disable react/sort-comp */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-props-destruction */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import PaymentMethodQuery from 'Query/PaymentMethod.query';
import { fetchMutation, fetchQuery } from 'Util/Request';

import StoredPaymentMethodComponent from './StoredPaymentMethod.component';

/** @namespace Seedsman/Component/StoredPaymentMethod/Container/mapStateToProps */
export const mapStateToProps = (state) => ({ isMobile: state.ConfigReducer.device.isMobile });

/** @namespace Seedsman/Component/StoredPaymentMethod/Container */
export class StoredPaymentMethodContainer extends Component {
    state = {
        PaymentMethod: {}
    };

    componentDidMount() {
        this.getPaymentMethodData();
    }

    async getPaymentMethodData() {
        const
            { customerPaymentTokens } = await fetchQuery(PaymentMethodQuery.getPaymentMethodQuery());

        this.setState({
            PaymentMethod: customerPaymentTokens
        });
    }

    containerProps() {
        const { PaymentMethod } = this.state;
        return { PaymentMethod };
        const { isMobile } = this.props;
        return { PaymentMethod, isMobile };
    }

    containerFunctions = {
        removePaymentMethod: this.removePaymentMethod.bind(this)
    };

    async removePaymentMethod(options) {
        const mutation = PaymentMethodQuery.deletePaymentMethod(options);

        const response = await fetchMutation(mutation);
        const { deletePaymentToken: { result } } = response;
        if (result) {
            return this.getPaymentMethodData();
        }
    }

    render() {
        return (
      <StoredPaymentMethodComponent
        { ...this.containerProps() }
        { ...this.containerFunctions }
      />
        );
    }
}

export default connect(mapStateToProps)(StoredPaymentMethodContainer);
