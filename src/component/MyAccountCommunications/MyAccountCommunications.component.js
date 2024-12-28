/* eslint-disable react/boolean-prop-naming */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/Field';
import { FIELD_TYPE } from 'Component/Field/Field.config';
import Form from 'Component/Form';
import Loader from 'Component/Loader';

import './MyAccountCommunications.style';

/** @namespace Seedsman/Component/MyAccountCommunications/Component */
export class MyAccountCommunicationsComponent extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        onSuccess: PropTypes.func.isRequired,
        sms_notify: PropTypes.bool.isRequired,
        receive_marketing_sms: PropTypes.bool.isRequired,
        receive_tracking_sms: PropTypes.bool.isRequired
    };

    renderSMSCommunicationField() {
        const { sms_notify } = this.props;

        return (
            <Field
              type={ FIELD_TYPE.checkbox }
              label="Subscribe to SMS Notifications."
              attr={ {
                  id: 'sms_notify',
                  name: 'sms_notify',
                  defaultChecked: sms_notify
              } }
              mix={ {
                  block: 'MyAccountCommunications',
                  elem: 'Checkbox'
              } }
            />
        );
    }

    renderTrackingSMSCommunicationField() {
        const { receive_tracking_sms } = this.props;

        return (
            <Field
              type={ FIELD_TYPE.checkbox }
              label="Subscribe to Tracking SMS Notifications."
              attr={ {
                  id: 'receive_tracking_sms',
                  name: 'receive_tracking_sms',
                  defaultChecked: receive_tracking_sms
              } }
              mix={ {
                  block: 'MyAccountCommunications',
                  elem: 'Checkbox'
              } }
            />
        );
    }

    renderMarketingSMSCommunicationField() {
        const { receive_marketing_sms } = this.props;

        return (
            <Field
              type={ FIELD_TYPE.checkbox }
              label="Subscribe to Marketing SMS Notifications."
              attr={ {
                  id: 'receive_marketing_sms',
                  name: 'receive_marketing_sms',
                  defaultChecked: receive_marketing_sms
              } }
              mix={ {
                  block: 'MyAccountCommunications',
                  elem: 'Checkbox'
              } }
            />
        );
    }

    renderSMSCommunication() {
        return (
            <div
              block="MyAccountCommunications"
              elem="EmailCommunication"
            >
                <h3>SMS Communications</h3>
                { this.renderSMSCommunicationField() }
            </div>
        );
    }

    renderTrackingSMSCommunication() {
        return (
            <div
              block="MyAccountCommunications"
              elem="EmailCommunication"
            >
                <h3>Tracking SMS Communications</h3>
                { this.renderTrackingSMSCommunicationField() }
            </div>
        );
    }

    renderMarketingSMSCommunication() {
        return (
            <div
              block="MyAccountCommunications"
              elem="EmailCommunication"
            >
                <h3>Marketing SMS Communications</h3>
                { this.renderMarketingSMSCommunicationField() }
            </div>
        );
    }

    renderSumbitForm() {
        return (
            <div block="MyAccountCommunications" elem="Buttons">
                <button
                  block="Button"
                  type="submit"
                  mix={ { block: 'MyAccountCommunications', elem: 'SaveButton' } }
                >
                    Save Changes
                </button>
            </div>
        );
    }

    renderCommunicationForm() {
        const { onSuccess } = this.props;

        return (
            <Form
              key="communication-subscribe"
              block="MyAccountCommunications"
              elem="Communications"
              onSubmit={ onSuccess }
            >
                { this.renderSMSCommunication() }
                { this.renderTrackingSMSCommunication() }
                { this.renderMarketingSMSCommunication() }
                { this.renderSumbitForm() }
            </Form>
        );
    }

    render() {
        const { isLoading } = this.props;

        return (
            <>
                <Loader isLoading={ isLoading } />
                <div
                  block="MyAccountCommunications"
                  elem="Wrapper"
                >
                    { this.renderCommunicationForm() }
                </div>
            </>
        );
    }
}
export default MyAccountCommunicationsComponent;
