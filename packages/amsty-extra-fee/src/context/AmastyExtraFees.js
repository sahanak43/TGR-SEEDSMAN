/**
 * Amasty Extra Fee compatibility for ScandiPWA
 * @copyright Scandiweb, Inc. All rights reserved.
 */

import { createContext, useEffect, useState } from 'react';

import { ChildrenType } from 'Type/Common.type';
import { fetchMutation, fetchQuery } from 'Util/Request';
import getStore from 'Util/Store';

import { FEE_TYPE_CHECKBOX } from '../component/Fee/Fee.config';
import ExtraFeeQuery from '../query/ExtraFee.query';
import ExtraFeeMutationQuery from '../query/ExtraFeeMutation.query';
import { getQuoteFees, updateCart } from '../util/AmastyExtraFees';

export const AmastyExtraFeesContext = createContext({
    cartId: '',
    setCartId: () => {},

    indexedFeeItems: {},
    setIndexedFees: () => {},

    indexedAppliedFees: {},
    setIndexedAppliedFees: () => {},

    isLoading: false,
    setIsLoading: () => {},

    applyFee: () => {}
});

AmastyExtraFeesContext.displayName = 'AmastyExtraFeesContext';

/** @namespace Scandiweb/AmastyExtraFee/Context/AmastyExtraFees/AmastyExtraFeesProvider */
export const AmastyExtraFeesProvider = ({ children }) => {
    const [indexedAppliedFees, setIndexedAppliedFees] = useState({});
    const [indexedFees, setIndexedFees] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [cartId, setCartId] = useState('');

    const updateAppliedFeeOptions = async () => {
        // vvv applied option to item Array<{ fee_id: Int, option_id: Int }>
        const { getAppliedFeeOptions: { items } } = await fetchQuery(
            // reapply the fee options from the backend.
            ExtraFeeQuery.getAppliedFeeOptions({ cartId })
        );

        const indexedAppliedFeeItems = JSON.parse(JSON.stringify(indexedFees));

        items.forEach(({ option_id, fee_id }) => {
            indexedAppliedFeeItems[fee_id].options[option_id].isApplied = true;
        });

        setIndexedAppliedFees(indexedAppliedFeeItems);
        setIsLoading(false);
    };

    const getValueToApply = (feeId, optionId) => {
        const { options, frontend_type } = indexedAppliedFees[feeId];

        if (optionId === -1) {
            // vvv 0 resets cart fees
            return 0;
        }

        if (frontend_type !== FEE_TYPE_CHECKBOX) {
            return optionId;
        }

        const optionIds = Object.entries(options).reduce((acc, [oldOptionId, oldOption]) => {
            const { isApplied } = oldOption;

            if (oldOptionId !== optionId) {
                return isApplied ? [...acc, oldOptionId] : acc;
                // ^^^ if this option was not touched, include it if it was applied
            }

            return isApplied ? acc : [...acc, optionId];
            // ^^^ toggle the option i.e. if it was applied => remove, etc.
        }, []);

        return !optionIds.length ? 0 : optionIds.join(',');
    };

    const applyFee = async (feeId, optionId) => {
        const optionIds = getValueToApply(feeId, optionId);
        setIsLoading(true);
        await fetchMutation(ExtraFeeMutationQuery.applyExtraFees(cartId, feeId, optionIds));
        updateCart();
        await updateAppliedFeeOptions();
    };

    // onMount
    useEffect(() => {
        const { id } = getStore().getState().CartReducer.cartTotals;
        setCartId(id);
    }, []);

    // onChange `cartId`
    useEffect(() => {
        if (!cartId) {
            return;
        }
        (async () => {
            setIsLoading(true);
            const fees = await getQuoteFees(cartId);
            setIndexedFees(fees);
        })();
    }, [cartId]);

    // onChange `indexedFees`
    useEffect(() => {
        if (!cartId || !indexedFees) {
            return;
        }
        updateAppliedFeeOptions();
    }, [indexedFees]);

    const value = {
        indexedAppliedFees,
        isLoading,
        applyFee
    };

    return (
         <AmastyExtraFeesContext.Provider value={ value }>
             { children }
         </AmastyExtraFeesContext.Provider>
    );
};

AmastyExtraFeesProvider.displayName = 'AmastyExtraFeesProvider';

AmastyExtraFeesProvider.propTypes = {
    children: ChildrenType.isRequired
};
