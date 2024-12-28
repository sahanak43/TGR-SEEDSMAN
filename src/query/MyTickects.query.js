import { Field } from 'Util/Query';

/** @namespace Seedsman/Query/MyTickects/Query */
export class MyTickectsQuery {
    getListOfTickets() {
        return new Field('zendesk_tickets')
            .addFieldList([
                'id',
                'order',
                'order_url',
                ' status',
                'subject',
                'updated_at'
            ]);
    }

    getIndividualTickects(id) {
        return new Field('zendesk_ticket')
            .addArgument('id', 'Int!', id)
            .addFieldList([
                'created_at',
                'html_body',
                'name',
                'user_photo',
                this.getAttachments()
            ]);
    }

    getAttachments() {
        return new Field('attachments')
            .addFieldList([
                'content_url',
                'file_name',
                'is_image'
            ]);
    }

    createNewTickectMutation(input) {
        return new Field('zendeskCreateTicket')
            .addArgument('input', 'ZendeskFormInput!', input)
            .addField('ticket_id');
    }
}
export default new MyTickectsQuery();
