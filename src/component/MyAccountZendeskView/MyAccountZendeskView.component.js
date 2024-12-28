/* eslint-disable react/jsx-no-bind */
/* eslint-disable semi */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable react/prop-types */
// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/Field';
import FIELD_TYPE from 'Component/Field/Field.config';
import Form from 'Component/Form';
import Html from 'Component/Html';
import TextPlaceholder from 'Component/TextPlaceholder';
import { formatDateTime } from 'Util/DateTime';
import defaultavatar from 'Util/images/default-avatar.webp';

import './MyAccountZendeskView.style';

/** @namespace Seedsman/Component/MyAccountZendeskView/Component */
export class MyAccountZendeskViewComponent extends PureComponent {
    static propTypes = {
        // TODO: implement prop-types
    };

    renderHeadingSection() {
        const { orderId, handelBackButton } = this.props;
        return (
            <div block="MyAccount" elem="HeadingSection">
                <h2 block="MyAccount" elem="Heading">
                    { `Ticket #  ${orderId}` }
                </h2>
                <button
                  block="Button button-back"
                  onClick={ handelBackButton }
                >
                    Back
                </button>
            </div>
        );
    }

    renderPlaceloader() {
        const { isLoading } = this.props;
        return (
            <div block="MyAccountMyTicketView" elem="ticket-card">
            <div block="profile" elem="img">
                <div block="image">
                    <img src={ defaultavatar } alt="profile-img" />
                </div>
            </div>
            <div block="profile" elem="details">
                <div block="name">
                    <span><TextPlaceholder isLoading={ isLoading } /></span>
                    <span block="created_at"><TextPlaceholder isLoading={ isLoading } /></span>
                </div>
                <div block="html-content"><TextPlaceholder isLoading={ isLoading } /></div>
            </div>
            </div>
        );
    }

    renderTicketCard() {
        const { MyticketsData: { zendesk_ticket = [] } = {} } = this.props;
        if (!zendesk_ticket.length) {
            return this.renderPlaceloader();
        }

        return zendesk_ticket.map((ticket) => (
            <div block="MyAccountMyTicketView" elem="ticket-card">
            <div block="profile" elem="img">
                <div block="image">
                    <img src={ defaultavatar } alt="profile-img" />
                </div>
            </div>
            <div block="profile" elem="details">
                <div block="name">
                    <span>{ ticket.name }</span>
                    <span block="created_at">{ formatDateTime(ticket.created_at, true, false) }</span>
                </div>
                <div block="html-content"><Html content={ ticket.html_body } /></div>
            </div>
            </div>
        ));
    }

    renderCommentForm() {
        return (
            <div block="MyAccountMyTicketView" elem="form">
                <Form
                  key="ViewTicket-Form"
                  block="ViewTicket-Form"
                // onSubmit={ onForgotPasswordSuccess }
                >
                <Field
                  type={ FIELD_TYPE.textarea }
                  label="comment"
                  attr={ {
                      id: 'Ticket-comment',
                      name: 'comment',
                      class: 'view_ticket_comment'
                  } }
                  validateOn={ ['onChange'] }
                  validationRule={ {
                      isRequired: true
                  } }
                  addRequiredTag
                />
                    <button block="Button submit_button">Submit</button>
                </Form>
            </div>
        );
    }

    render() {
        return (
            <div block="MyAccountMyTicketView">
                { this.renderHeadingSection() }
                { /* { this.renderCommentForm() } */ }
                { this.renderTicketCard() }
            </div>
        );
    }
}

export default MyAccountZendeskViewComponent;
