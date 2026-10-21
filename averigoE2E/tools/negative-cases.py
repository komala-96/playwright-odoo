# Adds a "Negative Test Cases" sheet to End_to_End_QA_Test_Cases_Updated.xlsx, one negative case per scenario,
# each linked to its source test case (sequential ID, with the old/script ID).
import openpyxl, copy
from openpyxl.styles import Alignment, Font, PatternFill, Border, Side
LOGIN = '1. Log in to the Martiserv (AveriGo) application with a QA user account that has the access named in Preconditions.'
def st(*s): return '\n'.join([LOGIN] + [f'{i + 2}. {t}' for i, t in enumerate(s)])
OBS, RULE = 'Observed in test runs', 'Validation rule (to confirm)'
# (old TC it derives from, module, scenario, preconditions, test data, steps, expected, priority, basis)
N = [
 ('TC-001', 'User Setup', 'Create employee without mandatory fields', 'HR access', 'Employee with empty name',
  st('Open Employees > New.', 'Leave the employee name empty and fill other fields.', 'Click Save.'), 'Save is blocked and the empty mandatory field is highlighted; no employee is created.', 'Medium', RULE),
 ('TC-004', 'Inventory', 'Create route with a non-numeric Route ID', 'Truck exists', 'Route ID "ROUTE-ABC"',
  st('Open Routes > New.', 'Enter Route ID with letters (ROUTE-ABC), select the truck.', 'Click Save.'), 'The non-numeric Route ID is rejected with a validation message; no route is created.', 'Medium', OBS),
 ('TC-005', 'Inventory', 'Create warehouse with a short code longer than 5 characters', 'Inventory access', 'Short code "WHQA001X"',
  st('Open Inventory > Locations > New warehouse.', 'Enter a short code of 8 characters.', 'Click Save.'), 'The short code is rejected (maximum 5 characters); the warehouse is not saved.', 'Medium', OBS),
 ('TC-010', 'Inventory', 'Create a product with a product code / UPC already used', 'Product 1 exists', 'Product 1 code and UPC',
  st('Open Product Master > New.', 'Enter the same product code and UPC as Product 1.', 'Click Save.'), 'The duplicate code / UPC is rejected with a clear message; no second product is created.', 'High', RULE),
 ('TC-022', 'Customer', 'Save a customer without a Receivable Account', 'Customer Care access', 'New customer, Receivable Account empty',
  st('Open Customer > New and fill name, code, address.', 'Leave Account Setup > Receivable Account empty.', 'Click Save.'), 'Save is blocked with a visible message naming the missing Receivable Account (not a silent failure).', 'High', OBS),
 ('TC-022', 'Customer', 'Customer PO # with special characters', 'Customer 1 with PO # ticked', 'PO # "PO#123/A"',
  st('Open Customer 1 and tick PO # (if not ticked).', 'Enter a PO # containing # and /.', 'Click Save.'), 'Special characters are rejected (letters and digits only); the PO # is not saved.', 'Medium', OBS),
 ('TC-022', 'Customer', 'Customer with both Subsidy amount and Subsidy %', 'Customer 1 with Subsidy ticked', 'Subsidy amount 2 and Subsidy % 5',
  st('Open Customer 1 (Subsidy ticked).', 'Enter both a Subsidy amount and a Subsidy %.', 'Click Save.'), 'Only one subsidy method is allowed: save is blocked with a message.', 'Medium', OBS),
 ('TC-022', 'Customer', 'Create a customer with a code already used', 'Customer 1 exists', 'Customer 1 code',
  st('Open Customer > New.', 'Enter Customer 1\'s code with a different name.', 'Click Save.'), 'The duplicate customer code is rejected; no customer is created.', 'High', RULE),
 ('TC-023', 'Customer', 'Cancel a contact address-type change', 'Customer 1 with a Billing Address contact', 'Billing Address contact',
  st('Open Customer 1 > Contacts & Addresses and open the Billing Address.', 'Change Address Type to Delivery Address.', 'On "Are you sure to change the Address Type?" click Cancel.'), 'The contact keeps Billing Address; nothing changes.', 'Low', OBS),
 ('TC-027', 'Sales', 'Confirm a sales order without lines', 'Customer 2 exists', 'Order with no products',
  st('Open Sales > New for Customer 2.', 'Do not add any product.', 'Click Confirm.'), 'Confirmation is blocked with a message; the order stays in draft.', 'High', RULE),
 ('TC-027', 'Sales', 'Add the same product twice to an order', 'Customer 2 with Product 1', 'Product 1 twice',
  st('Open Sales > New for Customer 2.', 'Add Product 1, then try to add Product 1 again.'), 'The second line for the same product is refused with a message.', 'Medium', OBS),
 ('TC-040', 'Sales', 'Delete a confirmed sales order without cancelling', 'A confirmed order', 'Confirmed order',
  st('Open the confirmed order.', 'Action > Delete.'), 'Deletion is blocked; the order must be cancelled first and stays listed.', 'High', OBS),
 ('TC-029', 'Accounts Receivable', 'Receive a payment of zero or more than the open balance', 'An open invoice for Customer 2', 'Amount 0; amount above the balance',
  st('Open Receive Payment for Customer 2.', 'Enter amount 0 and try to save; then enter more than the open balance.'), 'A zero amount is rejected; an over-payment is refused or clearly kept as an advance.', 'High', RULE),
 ('TC-044', 'Sales Return', 'Return more than the invoiced quantity', 'A posted invoice for Product 1', 'Return qty above invoiced qty',
  st('Open Sales Return for the invoice.', 'Enter a return quantity greater than invoiced.', 'Save / Post the credit memo.'), 'The quantity above the invoiced quantity is rejected.', 'High', RULE),
 ('TC-062', 'Purchase', 'Create a vendor with a non-numeric Vendor No', 'Purchase access', 'Vendor No "VEND-12A"',
  st('Open Vendors > New.', 'Enter a Vendor No with letters.', 'Click Save.'), 'Vendor No accepts digits only: the value is rejected.', 'Medium', OBS),
 ('TC-062', 'Purchase', 'Edit the email of a vendor that has a primary contact', 'Vendor with a primary contact', 'New email',
  st('Open the vendor with a primary contact.', 'Try to change the Email field.'), 'Email is read-only (it shows the primary contact\'s email) and cannot be changed.', 'Low', OBS),
 ('TC-065', 'Purchase', 'Click Add on a PO with no product selected', 'Vendor exists', 'Products field empty',
  st('Open Purchase Order > New, select the vendor.', 'Leave Products empty and click Add.'), 'A validation message asks to select a product; no server error.', 'High', OBS),
 ('TC-069', 'Purchase', 'Delete a confirmed purchase order without cancelling', 'A confirmed PO', 'Confirmed PO',
  st('Open the confirmed PO.', 'Action > Delete.'), 'Deletion is blocked; the PO must be cancelled first.', 'High', OBS),
 ('TC-068', 'Accounts Payable', 'Post a bill without a vendor or lines', 'Purchase access', 'Bill with no vendor / no lines',
  st('Open Purchase > Bill > New.', 'Leave vendor (or lines) empty.', 'Click Post.'), 'Posting is blocked with a message.', 'Medium', RULE),
 ('TC-078', 'Inventory', 'Material transfer of more than the bin holds', 'Product 1 in BIN-QA-001', 'Quantity above bin stock',
  st('Open Material Transfer > New, WH-QA-001.', 'Product 1 from BIN-QA-001 with a quantity above its stock.', 'Confirm / Validate.'), 'The transfer is refused (insufficient stock) instead of creating negative stock.', 'High', RULE),
 ('TC-079', 'Inventory', 'Virtual transfer of more than on hand', 'Product 1 in WH-QA-001', 'Transfer quantity above On Hand',
  st('Open Virtual Location Stock Transfer > New (Warehouse to Virtual Location).', 'Add Product 1 with a quantity above On Hand.', 'Click Transfer.'), 'The transfer is refused with a message.', 'High', RULE),
 ('TC-081', 'Equipment', 'Change an equipment part\'s Sales Price and save', 'Equipment part exists', 'Sales Price 25',
  st('Open the equipment part.', 'Change Sales Price and save.'), 'The new price saves (currently fails with "Wrong value for price.change.history.type" - see FINDINGS).', 'Medium', OBS),
 ('TC-082', 'Equipment', 'Create equipment with a serial number already used', 'Equipment 1 exists', 'Equipment 1 serial',
  st('Open Equipment > New.', 'Enter Equipment 1\'s serial number.', 'Click Save.'), 'Rejected: "duplicate key ... account_asset_serial_no" style message; no equipment is created.', 'High', OBS),
 ('TC-082', 'Equipment', 'Change the warehouse of an In Service equipment', 'Equipment 1 In Service', 'Another warehouse',
  st('Open Equipment 1 (In Service).', 'Try to change the Warehouse.'), 'Warehouse is read-only while In Service.', 'Low', OBS),
 ('TC-085', 'Case Management', 'Close a case without the resolution comment', 'An open case', 'Empty Resolution Comment',
  st('Open the case > Close Case.', 'Leave Internal / Resolution Comment empty.', 'Click Submit.'), 'Submit is blocked: the required comments are highlighted; the case stays open.', 'Medium', RULE),
 ('TC-087', 'CRM', 'Create a lead without Company Name, ZIP, Title or contact name', 'CRM access', 'Mandatory fields empty',
  st('Open CRM > Leads > New.', 'Enter only the lead name.', 'Click Save.'), 'Save is blocked; Company Name, ZIP, Title and First / Last name are highlighted.', 'Medium', OBS),
 ('TC-089', 'CRM', 'Calendar event without Customer or Event Type', 'CRM access', 'Customer / Event Type empty',
  st('Open Calendar Events > New.', 'Leave Customer and Event Type empty.', 'Click Save.'), 'Save is blocked with the mandatory fields highlighted.', 'Low', OBS),
 ('TC-090', 'Survey', 'Survey question with an empty answer choice', 'A survey exists', 'Blank choice line',
  st('Open the survey > question.', 'Add an answer line and leave it empty.', 'Save the question.'), 'Rejected: "Suggested answer value must not be empty".', 'Low', OBS),
 ('TC-091', 'Events', 'Event whose end is before its start', 'Events access', 'End date before start date',
  st('Open Events > New.', 'Set the end date earlier than the start date.', 'Click Save.'), 'The date range is rejected with a message.', 'Medium', RULE),
 ('TC-096', 'Micro Market', 'Update Location with Min greater than Max', 'MM-QA-001 with Product 1', 'Min 12, Max 3',
  st('Open Update Location for MM-QA-001 and load the lines.', 'For Product 1 set Min 12 and Max 3.', 'Save.'), 'Rejected: Min must not exceed Max.', 'Medium', OBS),
 ('TC-096', 'Micro Market', 'Update & Reconcile with no change', 'MM-QA-001 with Product 1', 'No values changed',
  st('Open Update Location for MM-QA-001 and load the lines.', 'Change nothing; Save > Update & Reconcile.'), 'Refused: "There is no changed found to update and reconcile!"', 'Low', OBS),
 ('TC-096', 'Micro Market', 'Spoiled / Theft / Return above the market stock', 'MM-QA-001 with little stock', 'Spoiled + Theft + Return above Stock',
  st('Open Update Location for MM-QA-001.', 'Enter Spoiled / Theft / Return totalling more than Stock.', 'Update & Reconcile.'), 'Refused with a message instead of taking the market stock negative (currently allowed - see FINDINGS).', 'High', OBS),
 ('TC-094', 'Micro Market', 'Create a micro market with a name already used', 'MM-QA-001 exists', 'Name MM-QA-001',
  st('Open Locations > New micro market.', 'Enter MM-QA-001 as the name.', 'Click Save.'), 'The duplicate market name is rejected; no second market is created.', 'Medium', OBS),
 ('TC-099', 'Micro Market', 'Front Desk / Employee discount above 100%', 'MM-QA-001 exists', 'Discount 150%',
  st('Open Front Desk/Employee Discount > New (Employee).', 'Enter Discount 150.', 'Save > Confirm.'), 'Rejected: the discount must be between 0 and 100.', 'Medium', RULE),
 ('TC-100', 'Payments', 'Same user, same deduction type and market in two payment methods', 'Payroll Deduction method with the employee exists', 'Same user email',
  st('Open Other Payment Methods > New (Payroll Deduction, MM-QA-001).', 'Add the same app user email.', 'Save.'), 'Rejected: the user already has this deduction type for the market in another list.', 'High', OBS),
 ('TC-101', 'Micro Market', 'Surge pricing overlapping an existing surge', 'A confirmed surge for Products 2 and 3', 'Same products and period',
  st('Open Surge Pricing > New.', 'Same products, market and overlapping period.', 'Save.'), 'Rejected: the products already have surge pricing during the selected period.', 'Medium', OBS),
 ('TC-103', 'Micro Market', 'Close a market without a reason or transfer warehouse', 'An active micro market', 'Reason / Transfer Stocks To empty',
  st('Open the market > Active Market.', 'Leave Reason for Closed and Transfer Stocks To empty.', 'Click Confirm.'), 'Confirm is blocked with the required fields highlighted; the market stays active.', 'Medium', OBS),
 ('TC-103', 'Micro Market', 'Delete a micro market', 'A micro market exists', 'Any market',
  st('Open the market.', 'Open the Action menu.'), 'No Delete action is offered (markets can only be closed / archived).', 'Low', OBS),
 ('TC-095', 'Micro Market', 'Store order with every quantity 0', 'MM-QA-001 with products', 'All Ordered Quantity 0',
  st('Open Store Orders > New for MM-QA-001 (show all).', 'Leave every quantity 0.', 'Save > Approve.'), 'Approval is blocked: nothing to order.', 'Medium', RULE),

 # ---- one negative case for every remaining non-report test case (Related TC = sequential ID) ----
 ('TC-002', 'Inventory', 'Create a product category with a name already used', 'Category CAT-QA-001 exists', 'Name CAT-QA-001 under the same parent',
  st('Open Inventory > Configuration > Product Categories > New.', 'Enter the existing category name under the same parent.', 'Click Save.'), 'The duplicate category is rejected (or clearly flagged); no second identical category is created.', 'Low', RULE),
 ('TC-003', 'Inventory', 'Create a UoM with ratio 0 or negative', 'UoM category Unit exists', 'Ratio 0 / -12',
  st('Open Inventory > Configuration > UoM > New.', 'Enter type Bigger than the reference with ratio 0 (then -12).', 'Click Save.'), 'A zero or negative ratio is rejected with a message.', 'Medium', RULE),
 ('TC-006', 'Inventory', 'Create a truck without its mandatory fields', 'Inventory access', 'Truck name / plate empty',
  st('Open Locations > New truck.', 'Leave the name (and short code) empty.', 'Click Save.'), 'Save is blocked with the mandatory fields highlighted.', 'Low', RULE),
 ('TC-007', 'Inventory', 'Create a bin without a warehouse', 'Inventory access', 'Bin with no parent warehouse',
  st('Open Bin Locations > New.', 'Enter the bin name and leave the warehouse empty.', 'Click Save.'), 'Save is blocked: a bin must belong to a warehouse.', 'Medium', RULE),
 ('TC-008', 'Customer', 'Make a customer its own parent', 'Parent customer PCUST-QA-001 exists', 'Parent = itself',
  st('Open the parent customer.', 'Set Parent customer to the same customer.', 'Click Save.'), 'Rejected: a customer cannot be its own parent (recursive hierarchy).', 'Low', RULE),
 ('TC-009', 'Customer', 'Create an order type with a name already used', 'Order type ORDTYPE-QA-001 exists', 'Same name',
  st('Open Customer Care > Configuration > Order Types > New.', 'Enter the existing order type name.', 'Click Save.'), 'The duplicate order type is rejected or clearly flagged.', 'Low', RULE),
 ('TC-011', 'Inventory', 'Create a product with a negative sales price or cost', 'Inventory access', 'List price -15, cost -8',
  st('Open Product Master > New (Product 2 data).', 'Enter a negative list price and cost.', 'Click Save.'), 'Negative price / cost is rejected with a message.', 'Medium', RULE),
 ('TC-012', 'Inventory', 'Product with deposit ON but no deposit amount', 'Inventory access', 'Container deposit ticked, amount empty',
  st('Open Product Master > New (Product 3 data).', 'Tick Container Deposit and leave the deposit amount empty.', 'Click Save.'), 'Save is blocked until a deposit amount is entered.', 'Medium', RULE),
 ('TC-013', 'Inventory', 'Create a product without a category or UoM', 'Inventory access', 'Category / UoM empty',
  st('Open Product Master > New (Product 4 data).', 'Leave Product Category and Unit of Measure empty.', 'Click Save.'), 'Save is blocked with the mandatory fields highlighted.', 'Medium', RULE),
 ('TC-014', 'Inventory', 'Quantity adjustment on a service product', 'Service product exists', 'Service product',
  st('Open Inventory Adjustment > Quantity Adjustments > New.', 'Try to select the service product.'), 'The service product is not offered (services carry no stock).', 'Low', RULE),
 ('TC-017', 'Inventory', 'Quantity adjustment to a negative counted quantity', 'Product 1 in WH-QA-001', 'Counted -5',
  st('Open Quantity Adjustments > New for WH-QA-001 and Product 1 > Add.', 'Enter Counted quantity -5.', 'Validate Inventory.'), 'A negative counted quantity is rejected.', 'High', RULE),
 ('TC-018', 'Inventory', 'Value adjustment to a negative cost', 'Product 1 exists', 'New cost -10',
  st('Open Value Adjustments > New.', 'Add Product 1 with new cost -10.', 'Validate.'), 'A negative cost is rejected; the product cost is unchanged.', 'High', RULE),
 ('TC-021', 'Inventory', 'Product catalogue with no products', 'Inventory access', 'Catalogue name only',
  st('Open Product Catalog > New (customer type).', 'Enter a name and add no products.', 'Click Save.'), 'Save is blocked (or warns) when the catalogue has no products.', 'Low', RULE),
 ('TC-024', 'Customer', 'Create Customer 2 with an invalid email', 'Customer Care access', 'Email "cust2-at-example"',
  st('Open Customer > New (Customer 2 data).', 'Enter an email without @.', 'Click Save.'), 'The invalid email is rejected with a message.', 'Medium', RULE),
 ('TC-028', 'AR', 'Pay more than the invoice amount due', 'Customer 1 invoice with an amount due', 'Payment above the amount due',
  st('Open the invoice > Register / Receive Payment.', 'Enter an amount above the amount due.', 'Confirm.'), 'The over-payment is refused, or the excess is clearly kept as an advance; the invoice is not shown as over-paid.', 'High', RULE),
 ('TC-030', 'Sales', 'Confirm an order with a zero or negative quantity', 'Customer 1 with Product 1', 'Quantity 0 / -2',
  st('Open Sales > New for Customer 1.', 'Add Product 1 with quantity 0 (then -2).', 'Confirm.'), 'Confirmation is blocked for a zero or negative quantity.', 'High', RULE),
 ('TC-031', 'Sales', 'Invoice an order before it is delivered', 'Confirmed Customer 2 order (Product 1 + service)', 'Undelivered order',
  st('Confirm the order and do not deliver it.', 'Try to create the invoice for Product 1.'), 'Invoicing the undelivered stock product is blocked (only delivered quantities invoice).', 'High', RULE),
 ('TC-032', 'Sales', 'Deliver more than ordered', 'Confirmed Customer 2 order for Product 1', 'Delivered qty above ordered',
  st('Open the order\'s delivery.', 'Enter a delivered quantity above the ordered quantity.', 'Validate.'), 'The extra quantity is refused or needs explicit confirmation.', 'Medium', RULE),
 ('TC-033', 'Sales', 'Order Product 2 for a customer without it on Order Products', 'Customer without Product 2 on Order Products', 'Product 2',
  st('Open Sales > New for that customer.', 'Search Product 2 on the order lines.'), 'Product 2 is not offered (orders only offer the customer\'s products).', 'Medium', OBS),
 ('TC-034', 'Sales', 'Change the line UoM to one of another category', 'Customer 2 order with Product 2', 'UoM from a different category (e.g. weight)',
  st('Open the order line for Product 2.', 'Pick a UoM from another category.'), 'Only UoMs of the product\'s category are offered / accepted.', 'Low', RULE),
 ('TC-035', 'Sales', 'Negative unit price on an order line', 'Customer 2 order with Product 3', 'Unit price -12',
  st('Open the order line for Product 3.', 'Enter unit price -12.', 'Save / Confirm.'), 'A negative price is rejected.', 'Medium', RULE),
 ('TC-036', 'Sales', 'Cancel an order that is already invoiced', 'Customer 2 Product 3 order invoiced', 'Invoiced order',
  st('Open the invoiced order.', 'Click Cancel.'), 'Cancellation is blocked while a posted invoice exists.', 'High', RULE),
 ('TC-037', 'Sales', 'Remove the tax from a taxable product line', 'Customer 2 order with Product 4 (tax ON)', 'Taxable unticked on the line',
  st('Open the order line for Product 4.', 'Try to untick Taxable / remove the tax.'), 'The line tax follows the product / customer set-up and cannot be removed ad hoc (or the change is audited).', 'Low', RULE),
 ('TC-038', 'Sales', 'Order Product 4 with no stock available', 'Product 4 with no stock in the delivery warehouse', 'Quantity above stock',
  st('Create and confirm an order for more Product 4 than is in stock.', 'Try to validate the delivery.'), 'The delivery cannot be validated beyond available stock (backorder offered).', 'High', RULE),
 ('TC-039', 'Sales', 'Deliver a service product', 'Confirmed order with only the service product', 'Service order',
  st('Confirm the service order.', 'Look for a delivery for the service line.'), 'No delivery is created for a service product; it is invoiced directly.', 'Low', OBS),
 ('TC-043', 'AR', 'Customer advance of zero or negative amount', 'Customer 1 exists', 'Amount 0 / -100',
  st('Open Customer Advance > New for Customer 1.', 'Enter amount 0 (then -100).', 'Save / Post.'), 'A zero or negative advance is rejected.', 'High', RULE),
 ('TC-045', 'Sales Return', 'Return again after the full quantity was returned', 'Invoice fully returned', 'Return qty 1',
  st('Open Sales Return for the same invoice.', 'Enter a further return quantity.'), 'No quantity is left to return: the return is refused.', 'High', RULE),
 ('TC-046', 'Sales Return', 'Credit memo above the invoice amount', 'Posted Customer 2 invoice', 'Credit memo amount above the invoice',
  st('Open Credit Memo > New for the invoice.', 'Enter an amount above the invoice total.', 'Post.'), 'The credit memo above the invoice amount is refused.', 'High', RULE),
 ('TC-047', 'AR', 'Post a direct invoice without lines', 'Customer 1 exists', 'Invoice with no lines',
  st('Open Accounting > Invoices > New for Customer 1.', 'Add no lines.', 'Post.'), 'Posting an empty invoice is blocked.', 'Medium', RULE),
 ('TC-048', 'AR', 'Direct invoice line with a zero or negative quantity', 'Customer 2 exists', 'Product 1 qty 0 / -1',
  st('Open a direct invoice for Customer 2.', 'Add Product 1 with quantity 0 (then -1).', 'Post.'), 'Zero / negative quantities are refused on a customer invoice.', 'Medium', RULE),
 ('TC-049', 'AR', 'Direct invoice with the service product at a negative price', 'Service product exists', 'Price -50',
  st('Open a direct invoice.', 'Add the service product with price -50.', 'Post.'), 'A negative line price is rejected.', 'Medium', RULE),
 ('TC-055', 'Sales', 'Invoice the backorder quantity before it is delivered', 'Order partly delivered with a backorder', 'Backorder not delivered',
  st('Deliver part of the order (backorder created) and invoice it.', 'Try to invoice the remaining quantity before delivering the backorder.'), 'Only delivered quantities can be invoiced; the second invoice waits for the backorder delivery.', 'High', RULE),
 ('TC-060', 'Inventory', 'Use an archived product in a new order', 'Referenced Product 1 archived (deletion blocked)', 'Archived product',
  st('Archive the product (Action > Archive).', 'Create a new sales order and search for the product.'), 'The archived product is not offered on new orders.', 'Medium', RULE),
 ('TC-061', 'Customer', 'Use an archived customer in a new order', 'Referenced customer archived (deletion blocked)', 'Archived customer',
  st('Archive the customer.', 'Create a new sales order and search for the customer.'), 'The archived customer is not offered on new orders.', 'Medium', RULE),
 ('TC-063', 'Purchase', 'Edit a vendor to a non-numeric internal reference', 'Vendor VEND-QA-001', 'Internal reference "REF-AB"',
  st('Open the vendor.', 'Change Internal Reference to letters.', 'Save.'), 'Rejected: the internal reference accepts digits only.', 'Low', OBS),
 ('TC-064', 'Purchase', 'Pay a bill for more than its amount due', 'Posted Product 1 bill', 'Payment above the amount due',
  st('Open Bill Payment for the vendor.', 'Enter more than the bill\'s amount due.', 'Confirm.'), 'The over-payment is refused or kept as a vendor advance; the bill is not over-paid.', 'High', RULE),
 ('TC-066', 'Purchase', 'Receive more than ordered on a PO', 'Confirmed Product 3 PO', 'Received qty above ordered',
  st('Open Receive Products.', 'Enter a received quantity above the ordered quantity.', 'Verify Quantities Against Bill.'), 'The extra quantity is refused or needs explicit confirmation.', 'High', RULE),
 ('TC-067', 'Purchase', 'Confirm a PO with a zero cost line', 'Vendor with Product 4', 'Cost 0',
  st('Create a PO for Product 4 with cost 0.', 'Confirm.'), 'A zero cost is flagged / blocked before confirmation.', 'Medium', RULE),
 ('TC-070', 'Purchase', 'Material issue of more than was received', 'Product 1 received from the vendor', 'Issue qty above received',
  st('Open Material Issue > New for the vendor.', 'Enter a quantity above what was received / is in stock.', 'Submit.'), 'The issue above the available quantity is refused.', 'High', RULE),
 ('TC-071', 'AP', 'Vendor advance of zero or negative amount', 'Vendor exists', 'Amount 0 / -100',
  st('Open Vendor Advance > New.', 'Enter amount 0 (then -100).', 'Save / Post.'), 'A zero or negative advance is rejected.', 'High', RULE),
 ('TC-072', 'AP', 'Debit memo for a vendor without an open material issue', 'Vendor with posted bills but no open material issue', 'That vendor',
  st('Open AP Credit Memo > New (Purchase Discount / Others).', 'Search the vendor.'), 'The vendor should be offered for Purchase Discount / Others (currently only vendors with an open material issue are offered - see FINDINGS).', 'Medium', OBS),
 ('TC-073', 'AP', 'Second payment above the remaining bill balance', 'Direct bill half paid', 'Payment above the remaining balance',
  st('Open Bill Payment for the bill.', 'Enter more than the remaining balance.', 'Confirm.'), 'The payment above the remaining balance is refused or kept as an advance.', 'High', RULE),
 ('TC-074', 'Purchase', 'Direct receipt without a vendor or product', 'Inventory access', 'Vendor / product empty',
  st('Open Material Receipt > Direct Receipt > New.', 'Leave the vendor (or products) empty.', 'Confirm.'), 'Confirmation is blocked with the mandatory fields highlighted.', 'Medium', RULE),
 ('TC-075', 'Purchase', 'Receive more than the backorder quantity', 'PO backorder of 10 open', 'Received 15',
  st('Open the backorder.', 'Enter received quantity 15.', 'Verify Quantities Against Bill.'), 'The extra quantity is refused or needs explicit confirmation.', 'High', RULE),
 ('TC-076', 'Purchase', 'Use an archived vendor on a new PO', 'Referenced vendor archived (deletion blocked)', 'Archived vendor',
  st('Archive the vendor.', 'Create a new purchase order and search for the vendor.'), 'The archived vendor is not offered on new purchase orders.', 'Medium', RULE),
 ('TC-080', 'Equipment', 'Create an equipment configuration with an empty name', 'Equipment access', 'Equipment Type / Name with empty name',
  st('Open Configuration > Equipment Type > New.', 'Leave the name empty.', 'Save.'), 'Save is blocked: the name is mandatory.', 'Low', RULE),
 ('TC-083', 'Equipment', 'Install equipment at a micro market of another customer', 'Equipment 2 Active; market of a different customer', 'Customer 1 + another customer\'s market',
  st('Open Equipment 2 > Equipment Activity > Install.', 'Select Customer 1 and a micro market that belongs to another customer.'), 'Only Customer 1\'s micro markets are offered / accepted.', 'Medium', RULE),
 ('TC-084', 'Equipment', 'Install equipment that is already In Service', 'Equipment 2 In Service', 'Install activity',
  st('Open Equipment 2 (In Service).', 'Equipment Activity > Install.'), 'Install is not offered / is refused for equipment already In Service.', 'Medium', RULE),
 ('TC-086', 'Equipment', 'Install an archived equipment', 'Referenced equipment archived (deletion blocked)', 'Archived equipment',
  st('Archive the equipment.', 'Try an Equipment Activity (Install) or select it on a new case.'), 'The archived equipment is not offered for new activities or cases.', 'Low', RULE),
 ('TC-088', 'CRM', 'Opportunity with an Expected Closing date in the past', 'CRM access', 'Expected Closing yesterday',
  st('Open CRM > Opportunities > New.', 'Set Expected Closing to yesterday.', 'Save.'), 'A past closing date is warned about / flagged as overdue.', 'Low', RULE),
 ('TC-093', 'Micro Market', 'Micro market catalogue with a non-Micromarket type', 'Inventory access', 'Catalogue type Customer',
  st('Create a catalogue of type Customer.', 'Open a micro market > Products > Product Catalog and search for it.'), 'Only Micromarket-type catalogues are offered for a micro market.', 'Low', RULE),
 ('TC-098', 'Micro Market', 'Special with End date before Start date or discount above 100%', 'MM-QA-001 exists', 'End before start; discount 150%',
  st('Open Specials > New.', 'Set End date before Start date (then Discount 150%).', 'Save.'), 'Both are rejected with a message.', 'Medium', RULE),
 ('TC-102', 'Micro Market', 'Discontinue a product not carried by the market', 'Product not on MM-QA-001', 'That product',
  st('Open Discontinue Products.', 'Select Customer 1 and MM-QA-001, then search the product.'), 'Only products the selected markets carry are offered.', 'Low', OBS),
]
# Keep the sheet in test-case order (stable: cases for the same TC keep their order).
N.sort(key=lambda n: int(n[0][3:6]))
F = 'End_to_End_QA_Test_Cases_Updated.xlsx'
w = openpyxl.load_workbook(F)
tc = w['Test Cases']
seq2old = {tc.cell(r, 1).value: tc.cell(r, 11).value for r in range(2, tc.max_row + 1) if tc.cell(r, 1).value}
old2seq = {v: k for k, v in seq2old.items()}
seq2scen = {tc.cell(r, 1).value: tc.cell(r, 3).value for r in range(2, tc.max_row + 1) if tc.cell(r, 1).value}
if 'Negative Test Cases' in w.sheetnames: del w['Negative Test Cases']
ws = w.create_sheet('Negative Test Cases', index=1)
hdr = ['NTC ID', 'Related TC', 'Related Scenario', 'Module', 'Negative Scenario', 'Preconditions', 'Test Data', 'Test Steps', 'Expected Result', 'Priority', 'Type', 'Basis']
src_h = tc.cell(1, 1)
for c, h in enumerate(hdr, 1):
    x = ws.cell(1, c, h); x.font = copy.copy(src_h.font); x.fill = copy.copy(src_h.fill); x.alignment = copy.copy(src_h.alignment); x.border = copy.copy(src_h.border)
body = copy.copy(tc.cell(2, 6).font); wrap = Alignment(wrap_text=True, vertical='top'); thin = copy.copy(tc.cell(2, 6).border)
obs_fill = PatternFill('solid', fgColor='FFE2EFDA'); rule_fill = PatternFill('solid', fgColor='FFFFF2CC')
# The related TC numbers above are written in the workbook's sequential numbering where they refer to moved cases;
# store them as given (sequential) and show the old/script ID alongside.
for i, (rel, mod, scen, pre, data, steps, exp, prio, basis) in enumerate(N, 1):
    old = seq2old.get(rel, rel)
    vals = [f'NTC-{i:03d}', f'{rel} (old {old})' if old != rel else rel, seq2scen.get(rel, ''), mod, scen, pre, data, steps, exp, prio, 'Negative', basis]
    for c, v in enumerate(vals, 1):
        x = ws.cell(i + 1, c, v); x.font = copy.copy(body); x.alignment = wrap; x.border = copy.copy(thin)
    ws.cell(i + 1, 12).fill = obs_fill if basis == OBS else rule_fill
for col, wd in zip('ABCDEFGHIJKL', [10, 18, 30, 16, 40, 30, 28, 60, 50, 10, 11, 24]): ws.column_dimensions[col].width = wd
ws.freeze_panes = 'A2'; ws.auto_filter.ref = f'A1:L{ws.max_row}'
sm = w['Test Summary']
for r in range(2, sm.max_row + 1):
    if sm.cell(r, 1).value == 'Negative test cases (Negative Test Cases sheet)': sm.delete_rows(r); break
nr = sm.max_row + 1
sm.cell(nr, 1, 'Negative test cases (Negative Test Cases sheet)').font = copy.copy(sm.cell(nr - 1, 1).font); sm.cell(nr, 2, len(N))
w.save(F)
import collections
print(len(N), 'negative cases;', dict(collections.Counter(n[8] for n in N)), dict(collections.Counter(n[7] for n in N)))
missing = [n[0] for n in N if n[0] not in seq2scen]; print('related TC not found:', missing)

# Same sheet in the source workbook the tests read (Related TC as the script / old ID).
d = openpyxl.load_workbook('data/End_to_End_QA_Test_Cases.xlsx')
if 'Negative Test Cases' in d.sheetnames: del d['Negative Test Cases']
dws = d.create_sheet('Negative Test Cases', index=1)
for c in range(1, ws.max_column + 1):
    for r in range(1, ws.max_row + 1):
        x = ws.cell(r, c); y = dws.cell(r, c, x.value)
        y.font = copy.copy(x.font); y.fill = copy.copy(x.fill); y.alignment = copy.copy(x.alignment); y.border = copy.copy(x.border)
for r in range(2, dws.max_row + 1):
    rel = str(dws.cell(r, 2).value).split()[0]
    dws.cell(r, 2).value = seq2old.get(rel, rel)
for col in 'ABCDEFGHIJKL': dws.column_dimensions[col].width = ws.column_dimensions[col].width
dws.freeze_panes = 'A2'; dws.auto_filter.ref = ws.auto_filter.ref
d.save('data/End_to_End_QA_Test_Cases.xlsx')
