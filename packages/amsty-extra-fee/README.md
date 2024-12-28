
## Features

This extension renders the Amasty Extra Fee component derived from the Amasty Extra Fee extension for Magento 2.

### Extra fee display locations

* Cart page
* Shipping page
* Billing page
* Checkout page
* My orders -> Order details pop-up

### Supported fee types

* Checkbox
* Dropdown

### Unsupported fee types

* Radio (dropdown will be rendered instead)

## Configuration

Please note that this extension requires the original  Amasty Extra Fee extension to function, you can purchase it from the [official marketplace](https://amasty.com/extra-fee-for-magento-2.html).

To configure the extension follow the instructions as described in the [official documentation](https://amasty.com/docs/doku.php?id=magento_2:extra_fee).
## Development
### Validation

No validation was implemented in Scandipwa. Required fields are marked with an asterisk and on the checkout, a page error will be thrown asking to check required fields.

### Styling

No major styling was implemented. Fields are imported from Scandipwa and the name and the description of the fee are styled as in the original extension.
