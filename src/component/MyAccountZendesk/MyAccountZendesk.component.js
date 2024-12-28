/* eslint-disable react/jsx-no-bind */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable react/prop-types */
import { PureComponent } from 'react';

// import Pagination from 'Component/Pagination';
import TextPlaceholder from 'Component/TextPlaceholder';

import './MyAccountZendesk.style';

/** @namespace Seedsman/Component/MyAccountZendesk/Component */
export class MyAccountZendeskComponent extends PureComponent {
    static propTypes = {
        // eslint-disable-next-line react/forbid-prop-types
    };

    renderPlaceLoader() {
        const { isLoading } = this.props;
        const numberOfcolumn = 6;
        const numberofrow = 4;
        return (
            <>
                { Array.from({ length: numberofrow }, (_, i) => (
                    <tr key={ i }>
                        { Array.from(
                            { length: numberOfcolumn },
                            (_, i) => (
                                <td>
                                    <TextPlaceholder
                                      isLoading={ isLoading }
                                      key={ i }
                                    />
                                </td>
                            )
                        ) }
                    </tr>
                )) }
            </>
        );
    }

    renderTickets() {
        const {
            MyticketsData: { zendesk_tickets = [] } = {},
            handelviewticket,
            isLoading
        } = this.props;

        if (!zendesk_tickets.length && isLoading) {
            return this.renderPlaceLoader();
        }

        return zendesk_tickets.map((ticket) => (
            <tr block="MyAccountZendesk" elem="TicketRow" key={ ticket.id }>
                <td>{ ticket.id }</td>
                <td>{ ticket.order ? ticket.order : '--' }</td>
                <td>{ ticket.subject ? ticket.subject : '--' }</td>
                <td>{ ticket.status ? ticket.status : '--' }</td>
                <td>{ ticket.update_at ? ticket.update_at : '--' }</td>
                <td>
                    <button
                      block="MyAccountZendesk"
                      elem="view-button"
                      onClick={ () => {
                          handelviewticket(ticket.id);
                      } }
                    >
                        View Ticket
                    </button>
                </td>
            </tr>
        ));
    }

    renderTicketsMobile() {
        const {
            MyticketsData: { zendesk_tickets = [] } = {},
            handelviewticket
        } = this.props;

        return zendesk_tickets.map((ticket) => (
            <div block="MyAccountZendesk" elem="mobile">
                <div block="title">
                    <span>ID</span>
                    <span>Order #</span>
                    <span>Subject</span>
                    <span>Status</span>
                    <span>Update At</span>
                    <span>Action</span>
                </div>
                <div block="values">
                    <span>{ ticket.id }</span>
                    <span>{ ticket.order ? ticket.order : '--' }</span>
                    <span>{ ticket.subject ? ticket.subject : '--' }</span>
                    <span>{ ticket.status ? ticket.status : '--' }</span>
                    <span>{ ticket.update_at ? ticket.update_at : '--' }</span>
                    <span>
                        <button
                          block="MyAccountZendesk"
                          elem="view-button"
                          onClick={ () => {
                              handelviewticket(ticket.id);
                          } }
                        >
                            View Ticket
                        </button>
                    </span>
                </div>
            </div>
        ));
    }

    // renderPagination() {
    //     const total_pages = 2;

    //     if (total_pages === 0) {
    //         return null;
    //     }

    //     return (
    //         <Pagination
    //         //   isLoading={ isLoading }
    //           totalPages={ total_pages }
    //           mix={ { block: 'MyAccountMyOrders', elem: 'Pagination' } }
    //         />
    //     );
    // }

    renderTicketsTable() {
        const {
            device: { isMobile }
        } = this.props;

        if (isMobile) {
            return this.renderTicketsMobile();
        }

        return (
            <div block="MyAccountZendesk" elem="table">
                <table block="MyAccountZendesk" elem="Tickets">
                    <tr block="tickets-titls">
                        <th>ID</th>
                        <th>Order #</th>
                        <th>Subject</th>
                        <th>Status</th>
                        <th>Updated At</th>
                        <th>Action</th>
                    </tr>
                    { this.renderTickets() }
                </table>
            </div>
        );
    }

    render() {
        const { handelcreateNewTicket } = this.props;
        return (
            <div block="MyAccountZendesk">
                <div block="MyAccountZendesk" elem="Actions">
                    <button block="Button" onClick={ handelcreateNewTicket }>
                        Create ticket
                    </button>
                </div>
                { this.renderTicketsTable() }
                { /* { this.renderPagination() } */ }
            </div>
        );
    }
}

export default MyAccountZendeskComponent;
