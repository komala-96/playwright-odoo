# Findings from automated E2E runs (martiserv.averigoqa.com)

Issues where the application, not the test script, appears to be the cause. Each has evidence so it can be raised as a defect or clarified.

| TC | Finding | Evidence |
|---|---|---|
| TC-019 | **Stock Value Report (Warehouse)** does not list products whose stock was added today. Filters: Warehouse = WH-QA-001-xxxxx, As of Date = today (and tomorrow), Report Type = Detail → "No data Found". Without the warehouse filter: 790 rows, none for the new products. | `stock.quant` for PROD-QA-001: 520 units at WH-QA-001/BIN-QA-001, value 6,240.00 (cost 12). The product is also **not offered in this report's Products filter** (searched by code and by name), while other Inventory reports (Product Addition/Deletion, Product Cost Change, Product Master) list it. The report likely reads a separate summary that doesn't include new products/stock (e.g. refreshed by a scheduled job the QA user can't see), or it skips bins under the warehouse view location. |
| TC-040 | **Product UoM Change Report** never shows data (Jan 2020 to today: 0 records). Changing a customer product line's UoM isn't recorded. | The report reads `uom.change.history` ("To record UoM change in Product Master"). On Product Master, **Unit of Measure is read-only**, and the Action menu item **"Uom category Update"** shows no dialog or visible change. Needs clarification: how should a product-master UoM change be made in the UI? |
| TC-026…029, 042, 043 (Customer 1 sales) | ~~Blocked by empty Default Setup (Subsidy / Fuel Charge / Hazard Fee products).~~ **Resolved for testing:** per instruction, Customer 1 now runs without Fuel Charge / Hazard Fee / Subsidy. | Those three charges are not tested on this instance. |
| TC-049/050/051 (and other reports) | In some Averigo Reports filters, the **Customers search box shows "No matching customers"** for customers that are in its own list (e.g. Receipt List, Open Invoice Customer Statement, Invoice List, Product Price Change). The same search works in Aging By Customer. | The server's `res.partner/name_search` returns the customers (seen in network traffic), and the unfiltered list contains them. The tests work around it by picking from the full list. Front-end search bug in those report pickers. |
| TC-057 (clarify) | **Sales Tax Report**: Tax Amount (33.17) and Gross Sales (6,550.17) match Customer 2's posted invoices exactly. But **Taxable Sales (471.17) ≠ Tax Amount ÷ Rate** (33.17 / 8.625% = 384.58), because Taxable Sales is Gross − Non-Taxable and so includes tax. | Database totals for the same customer and day: out_invoice untaxed 6,517.00, tax 33.17, total 6,550.17. Ask: should Taxable Sales be the pre-tax taxable base? |
| TC-062 (robustness) | **Purchase Order → Products "Add" with no product selected** crashes with a server error: `IndexError: list index out of range` ("Something went wrong"). | Reproduced: new PO, vendor set, Products empty (the product isn't on the vendor, so the picker offers nothing), click Add. It should validate ("select at least one product") instead of failing. |
| TC-067 | **AP Credit Memo: the Vendor picker only offers vendors with an open Material Issue** for every type, including Purchase Discount and Others, which shouldn't need one. A vendor with posted (even partially paid) bills but no open material issue can't get a Purchase Discount. | `debit.memo.partner_id` is restricted by `vendor_with_material_issue_ids` (request domain `id in [1692]`, the one vendor with an open issue). Partly paying a bill didn't change it. The test creates a material issue first as a workaround. |
| **TC-065 (defect)** | **Purchase Return credit memo posts a different amount than it shows.** The memo shows 20.00 (2 × billed cost 10.00), but its journal entry posts **22.66**, so the vendor's balance moves by 22.66, not 20.00. | debit.memo DM78: `amount_total_view` = 20.00, while its account.move (in_refund) DM78 has `amount_total` = 22.66 (earlier DM72/DM77: 22.72). 22.66 ≈ 2 × Product 1's current average cost (~11.33 after the TC-018 value adjustment), not the billed 10.00. For Product 3, whose cost never changed, memo and entry agree (DM76: 6.00 = 6.00). Expected: the entry uses the billed cost, or the memo shows what is posted. |
| **TC-069 (defect)** | **Direct Receipt with a non-default Location doesn't receive stock from the vendor.** Instead it transfers stock *out of* the chosen Location into Marti/Stock, so total on-hand is unchanged. | Marti/IN/00843 and 00844 (Location = WH-QA-001-55000): moves `WH-QA-001-55000/Stock → Marti/Stock`, product qty 779 → 779. Marti/IN/00847 (default Location "Martiserv"): move `Partners/Vendors → Marti/Stock` (correct). Expected: source = Vendors, destination = the chosen Location. |
| **TC-072 (defect / clarify)** | **Product Order Report → Current Stock** for Product 4 shows **−50** (run 1791175992196, 10/12/2026), while product on-hand is **450**. Truck Stock (58) is correct. | Move history: Marti/Stock got 3 × 20 = 60 from purchases, but 14 internal transfers moved **116** units (Each and 12-unit cases) to TRUCK-QA-001 → Marti/Stock = **−56**. The app let the truck be loaded with stock the main warehouse didn't have (negative quant, no warning). Current Stock = Marti/Stock (−56) + WH-QA-001/Stock (6) = −50. The 500 units in WH-QA-001/BIN-QA-001 are left out. Ask: should truck loads from an empty warehouse be blocked, and should Current Stock include bins? |
| **TC-077 (defect)** | **Material Transfer doesn't move stock to the chosen Transfer Location/Bin.** The transfer reaches Done, but the posted move's destination is the *source* bin, so nothing moves and there's no warning. | WH-QA-001-55000/INT/00003: move has `bin_location` = BIN-QA-001, `bin_dest_location` = **BIN-QA-002**, yet `location_dest_id` = **BIN-QA-001** (move line BIN-QA-001 → BIN-QA-001, qty 3). Same with Transfer Location = Martiserv and no bin (INT/00002). Bin stock stays 500. Expected: `location_dest_id` = the selected Transfer Bin/Location. Re-tested 10/12/2026 (run 1791175992196): **WH-QA-001-92196/INT/00001**, BIN-QA-001 → BIN-QA-002, 3 × Product 1: Done, move line `BIN-QA-001-92196 → BIN-QA-001-92196`, source bin stock stays 1050. Again with every field filled (Issuer, Owner, Scheduled Date, Shipping Policy, Note, case UoM, cost): **INT/00002**, 3 cases = 36 units → source still 1050, BIN-QA-002 still 0. |
| **TC-075 (defect)** | **Update Warehouse reconciliation duplicates stock held in bins.** Reconciling Product 3 (overage 2, spoilage 1, shrinkage 1) raised total on-hand from 516 to **1016**, where the expected net change is 0. | WHU/00402 counted On Hand 502 (500 of it in WH-QA-001/BIN-QA-001), then posted `[WHU/00402] Inventory … 502: Inventory adjustment → WH-QA-001-55000/Stock` while BIN-QA-001 kept its 500. Spoilage/shrinkage scrap moves (SP/03695, SP/03696) were posted correctly. Expected: adjust only the differences, in the locations where the stock actually is. Re-tested 10/13/2026 (run 1791175992196): Product 3 on-hand **484 → 984** (+500, the BIN-QA-001 stock again). |
| **TC-075 (defect)** | **Overage Shrinkage Spoilage (Warehouse) Report shows only Spoilage.** The same reconciliation's Overage (2) and Shrinkage (1) are missing. | Report rows for PROD-QA-003 on WH-QA-001: `… Spoilage 6.00 1 6.00` only (one per reconciliation run). Shrinkage was posted as a second scrap move (SP/03695/03696), and overage went into the inventory adjustment, but neither appears. Re-tested 10/13/2026: still only Spoilage for PROD-QA-003 (Overage 2 / Shrinkage 1 missing). |
| **TC-094 (defect)** | **Micro Market location: choosing a Product Catalog and clicking Add doesn't load the catalogue's products.** The selection is cleared and nothing is added. | Market MM-QA-001-55000 (id 4682): Product Catalog = PCAT-MM-QA-001-55000 (Micromarket type, Products 2-4), Add → Micromarket Products still has only Product 1; `stock.warehouse.catalog_ids` = [] afterwards. Adding products individually via Products + Add works. |
| **TC-095 (defect)** | **Receiving a Store Order adds the quantity to the Micro Market twice.** A store order for 4 × Product 1 raised the market's stock by 8. | Store order WH-QA-001-55000/INT/00012 (4 × PROD-QA-001): move lines `INT/00012 4 Truck/Stock → MM-QA-001-55000/Stock` **and** `INT/00013 4 Truck/Stock → MM-QA-001-55000/Stock` (same timestamp); earlier INT/00005/06/07 show the same. Re-tested 10/13/2026 (run 1791175992196): store order **WH-QA-001-92196/INT/00003** (Received) for 4 × Product 1 posted moves **INT/00003** and **INT/00004**, each Truck/Stock → MM-QA-001-92196/Stock qty 4 → market stock 0 → **8**. Market stock (quants and "Current Stock") is 24 for Product 1, while done store-order moves total 8. |

## TC-092 – Customer Retention Report shows datetimes in UTC, not the user's timezone
- **Steps:** CRM > Calendar Events > New, Start = tomorrow 10:00 (browser/user time IST, UTC+5:30), save. Averigo Reports > Customer Care > Customer Retention Report, Type = Events, Start = today, End = today+7, Status = All, Generate.
- **Expected:** the event row shows Due Date tomorrow 10:00 (as entered and as shown on the event form).
- **Actual:** the row shows 04:30, the raw UTC value stored in `calendar.event.start`. Created Date has the same problem (13:16 shown, local time 18:46). Near midnight the date can also shift by a day, so date filters may include or exclude the wrong events.
- **Re-test 10/13/2026:** Event-QA-CRM-001-92196 (TC-089, all fields; start 10/14 10:00 – 11:30 IST) → report Start **10-14-2026 04:30:00**, End 06:00:00, Created 14:34:34 (UTC). Location, Duration 1.5 and Description match. (The report has no Customer column for events, so the customer can't be checked there.)
- **Severity:** Medium (report accuracy).

## TC-043 – Partial sales-return credit memos over-credit by tax rounding
- **Steps:** Customer 1 invoice for 2 × Product 1 at 20.00 (taxable 8.625%, deposit 0.10 each): total **43.65** (tax 3.45). Inventory > Material Receipt > Sales Return of 1 unit, then AR > Credit Memo of type Sales Return (posted). Repeat for the remaining 1 unit.
- **Expected:** the two credit memos together equal the invoice (43.65).
- **Actual:** together they total **43.66**. Each memo rounds its own tax (20.00 × 8.625% = 1.725, rounded to 1.73), so the customer is credited 0.01 more than they paid.
- **Severity:** Low (rounding). The last partial return should take the remaining invoice tax rather than recalculating it.

## TC-002 – Product Category "Routes" picker offers routes that are silently dropped on save
- **Steps:** Inventory > Configuration > Product Categories > New. Fill Category Name. In **Routes**, pick **Buy** (or **Replenish on Order (MTO)**); the tag is shown. Save.
- **Expected:** either the route is saved, or the picker only offers routes that can be used on a category.
- **Actual:** the record saves with **no routes** and no message. `product.category.route_ids` only accepts routes flagged "Selectable on Product Category" (`product_categ_selectable`), but the picker lists all routes. Buy and MTO aren't flagged, so they're discarded. Category-selectable routes (e.g. "MM: Receive in 1 step (stock)") save correctly.
- **Severity:** Low/Medium (silent data loss on the form).
- **Also noted (minor):** the app allows two categories with the same name (two `CAT-QA-001-31000` were created by re-running TC-002).

### TC-019 re-test (run 1791175992196, all products)
- Re-run after TC-018 revalued **Products 1-4** (12 / 9 / 7 / 6): Stock Value Report (Warehouse), Warehouse = WH-QA-001-92196, Date = today, Report Type = Detail still returns **"No data Found"**, although each product has 500+ on hand in that warehouse. The Product Cost Change Report (TC-020) does show all four cost changes, so the valuation itself exists. Defect still open.

## TC-026 (clarify) – Customer "Subsidy" is added to the customer's bill (+), not deducted
- **Setup:** Setup > Default Setup > Sales: Subsidy Product = "subsidy product", Fuel Charge = "fuel charge", Hazard Fee = "hazard fee". Customer 1 has Fuel Charge, Hazard Fee and Subsidy ticked, Subsidy Amount = 2.00.
- **Observed:** confirming order S01357 adds three lines, carried onto invoice INV355: **subsidy product +2.00**, fuel charge +0.60, hazard fee +0.50. Order subtotal goes 505.00 -> 508.10; total 560.34 (invoice 560.35, see note below).
- **Question:** a subsidy normally reduces what the customer pays (the company or a sponsor covers it). Here it **increases** the customer's invoice by the subsidy amount. Please confirm the intended behaviour; if it should be a deduction, this is a defect.
- **Note:** see the next entry (1-cent tax difference between order and invoice).

## TC-026 – Invoice tax is 0.01 higher than the confirmed sales order's tax (customer with charges)
- **Steps:** Customer 1 (Fuel Charge / Hazard Fee / Subsidy on). Order: 2 x Product 1 in the case UoM (240.00 each, taxable 8.625%), 1 x service (25.00), S&H 5.00, insurance 2.00, discount 1.00. Confirm (adds subsidy +2.00, fuel 0.60, hazard 0.50), deliver, invoice, post.
- **Expected:** the invoice repeats the confirmed order's amounts.
- **Actual:** reproduced on two runs (S01357 -> INV355 and the next run): order tax **43.84**, invoice tax **43.85**; order total 560.34, invoice total 560.35. The subtotal matches (508.10), so the difference is in how tax is rounded on the order vs the invoice (per line vs per document) once the charge lines are added.
- **Also reproduced in TC-029** (Customer 1, 2 x Product 1 only, + subsidy/fuel/hazard): order tax 3.71 / total 47.01 vs invoice INV380 tax **3.72** / total **47.02** - so it happens on any Customer 1 order once the charge lines are added.
- **Severity:** Low (rounding), but the customer is billed 0.01 more than the confirmed order.

## TC-026 – S&H and Insurance charged in full on BOTH the service invoice and the delivery invoice
- **Steps:** Customer 1 order S01365 with S&H 5.00, Insurance 2.00, Discount 1.00, goods + a service product. Confirm -> **Create Service Invoice** (INV366) -> deliver -> delivery invoice (INV367).
- **Expected:** order-level S&H / Insurance are charged once (like the discount, which is split 0.44 + 0.56 = 1.00).
- **Actual:** INV366 charges S&H 5.00 + Insurance 2.00 **and** INV367 charges S&H 5.00 + Insurance 2.00 -> the customer is billed **14.00 instead of 7.00** (+7.00 overcharge). Invoices total 687.12 vs order 678.16 (+7.00 S&H/insurance, +1.96 for the product added at delivery).
- **Severity:** High (customer overbilled).

## TC-026 (clarify) – Product added in the Delivery wizard is invoiced but not added to the sales order
- **Steps:** Packing slip of S01365 > Delivery > Delivery Details > **Add a line**: Order No S01365, Dr Pepper 16.9oz, qty 1 (price 1.75 filled in) > Confirm Delivery.
- **Observed:** Dr Pepper is delivered and invoiced on INV367 (1.75 + 0.05 deposit + tax), but S01365's order lines don't include it, so the order total (678.16) no longer matches what was invoiced/delivered.
- **Question:** should a product added at delivery also be added to the sales order? If yes, this is a defect.

## TC-026 – Sales Order PDF prints raw template text "employee_discount = ..."
- **Steps:** Customer Care > Orders > S01368 > Action > Print > **Quotation / Order**.
- **Expected:** the Customer Details block shows the customer's address/phone.
- **Actual:** it prints **"employee_discount = San Francisco CA 94158"** - an unrendered template variable leaks into the document (the invoice PDF is fine).
- **Severity:** Medium (customer-facing document).

## TC-026 – Hazard Fee line is labelled "Fuel Charge" on the sales order (and its PDF)
- **Steps:** Customer 1 (Fuel Charge / Hazard Fee / Subsidy on). Confirm an order: three charge lines are added (subsidy 2.00, fuel 0.60, hazard 0.50).
- **Expected:** the 0.50 line is described "Hazard Fee".
- **Actual:** the 0.50 line's description is **"Fuel Charge"** (two "Fuel Charge" lines: 0.60 and 0.50) on the sales order lines and on the printed order PDF; the invoice line correctly reads "hazard fee". Subsidy line prints as "subsidy".
- **Severity:** Medium (misleading charge description to the customer).

## TC-042 (clarify) – Sales Return credit memo screen shows Total = product amount only; the posted total is higher
- **Steps:** Customer 1 invoice (Product 1 in cases, taxable, deposit 0.10/unit). Inventory > Material Receipt > Sales Return of 1 case, then AR > Credit Memo of type Sales Return (CR57), post.
- **Observed:** the memo form shows Total **246.00** (Tax 0.00, Deposit 0.00), but the posted entry and the customer balance use **268.30** = 246.00 + tax 21.23 + deposit 1.20 - discount share 0.13.
- **Question:** the refund amount itself looks right; should the memo screen show the tax / deposit / discount and the 268.30 total the customer is actually credited?

## TC-048 – Aging By Customer report leaves out invoices that are not yet due
- **Steps:** Customer 2 has Payment Terms = 30 Days. Its open items: 9 posted invoices dated 10/06/2026, due 11/05/2026 (≈ 4,790), credit memo CR62 (-150.70, due 11/07) and CR63 (-5.00, due 10/08). Customer balance = **4,634.46**. Averigo Reports > Accounts Receivable > **Aging By Customer Report**, Customers = Customer 2, Date = 10/08/2026, Report Type = Summary.
- **Expected:** not-yet-due items appear in the **Current** bucket; Current / Total = 4,634.46 (the customer's open balance).
- **Actual:** the row shows Current **-5.00** and Total **-5.00** - only CR63 (due today). Every invoice / memo with a due date after the aging date is missing, so the report understates receivables by 4,639.46.
- **Note:** TC-048 passed earlier when the customer had no payment terms (due date = invoice date). With 30-day terms the report drops everything not yet due.
- **Severity:** High (receivables materially understated).

## TC-055 (clarify) – Customer Order Activity Report shows the order's billing contact instead of the customer
- **Steps:** Customer 2's orders use its Billing Address contact ("QA C2 Billing Address 92196") as invoice address. Averigo Reports > Customer Care > **Customer Order Activity Report**, Customers = Customer 2.
- **Observed:** the row reads Accounts Manager, Customer No **C2-92196**, then **"QA C2 Billing Address 92196"** where the customer name is expected (followed by city/state/zip and the last order date 10/08/2026).
- **Question:** should the report show the customer (CUST-QA-002-92196) rather than the billing contact? Filtering by the customer works; only the displayed name differs.

## TC-065 re-test (run 1791175992196) – Purchase Return: wrong memo cost, memo screen ≠ posted amount, stock not returned
- **Steps:** Bill BILL/134 (Product 1, **10.00 per case**, bought in the vendor's 12-unit case UoM). Inventory > **Material Issue**: vendor, Issue Type = Purchase Return, Bill = BILL/134, Product 1 issue qty 2 > Submit (MI00377, state Approved) > **Create Credit Memo** (AP > Credit Memo, type Purchase Return) > posted **DM81**.
- **Expected:** the memo credits 2 × 10.00 = **20.00** (+ the matching deposit / tax); the memo screen shows the posted amount; 2 cases leave stock.
- **Actual:**
  1. **Cost:** DM81 posts Product 1 at **28.95** each (57.90), not the bill cost 10.00 (earlier run: average cost 22.66 vs 20) - **defect**, vendor credited the wrong amount.
  2. **Screen vs posted:** the memo form shows Total **22.58**, while the posted entry is **60.48** (57.90 + deposit 2.40 + tax 0.18).
  3. **Stock:** each Material Issue creates a return delivery (WH-QA-001-92196/OUT/00001, /OUT/00002) that stays **Ready / assigned** - so Product 1 stock is unchanged (1,756 before and after). Earlier runs' return deliveries (MI00370-374) were **done** automatically. There is no link from the Material Issue to its delivery in the UI, and Inventory > Delivery only covers sales pick lists/packing slips, so the user cannot complete it from the screen.
- **Also reproduced in TC-067** (Product 3, 1 unit, bill cost **6.00**): the Purchase Return memo **DM84** screen shows **6.10** (6.00 + deposit 0.10) but posts **7.02** = Product 3 at **6.92** (its average cost) + 0.10. So the memo form shows the bill cost while the posting uses the product's average cost; the vendor balance moves by the posted 7.02.
- **Severity:** High (vendor credited the wrong amount; returned goods stay in stock).

## TC-067 – Searching the AP Credit Memo list crashes ("Something went wrong")
- **Steps:** Financial Accounting > Accounts Payable > **Credit Memo** (list) > type a memo number (e.g. DM84) in the search box > Enter.
- **Expected:** the list is filtered to that memo.
- **Actual:** "Averigo Error - Something went wrong..." Server traceback: `ValueError: Invalid field debit.memo.invoice_origin in leaf ('invoice_origin', 'ilike', 'DM84')` - the list's default search uses a field that does not exist on `debit.memo`.
- **Severity:** Medium (users cannot search AP credit memos by text; opening them from the unfiltered list works).

## TC-068 – Direct bill computes tax on the product's average cost, not on the bill line
- **Steps:** Financial Accounting > Accounts Payable > Bills > New: vendor VEND-QA-001, Product 1, 20 (cases of 12) at **10.00** = **200.00** subtotal (taxable, deposit 0.10/unit) > Post (**BILL/139**).
- **Expected:** tax = 8.625% x 200.00 = **17.25** (the PO-generated bill for the identical line, TC-061, shows 17.26); total 241.26.
- **Actual:** Tax Amount **49.97** -> total **273.97**. 49.97 / 8.625% = 579.36 = 20 x **28.97**, i.e. Product 1's average cost per case, not the 10.00 bill cost. The vendor is overcharged 32.72 of tax.
- **Same root cause** as the Purchase Return memo (TC-065 / TC-067): AP documents value Product 1 at average cost instead of the line price.
- **Severity:** High (wrong tax on vendor bills).

## TC-069 – Direct Receipt PDF leaves "Received By" and "Notes" blank
- **Steps:** Inventory > Material Receipt > Direct Receipt > New: vendor VEND-QA-001, To Be Printed ✓, Receiver **Komala G**, Expected Date tomorrow 10:00, Vendor Invoice #, Note tab "QA direct receipt note", Product 1 × 5 cases at 10.00, Destination Bin > Confirm (**Marti/IN/00885**, Done) > Action > Print > Receipt.
- **Expected:** page 2 shows "Received By: Komala G" and "Notes: QA direct receipt note" (both saved on the receipt).
- **Actual:** "Received By:" and "Notes:" print empty. The PDF's Date is the print date and it omits Vendor Invoice #/Expected Date (no fields for them on the layout). Receipt #, vendor, Purchase Manager, product, order/received qty and UoM match the UI.
- **Note (automation):** the Expected Date must be entered after vendor/products — the vendor and Add products onchanges reset it to "now" (the user's value is overwritten silently). 
- **Severity:** Low (print layout).

## TC-070 – Purchase Order Notes (terms) box shows raw HTML after save
- **Steps:** Purchase > Purchase Order > New (vendor VEND-QA-001, all header/footer fields), type "QA backorder PO note" in the Notes box under the totals > Save (**P00809**).
- **Expected:** the box shows "QA backorder PO note" (20 / 250).
- **Actual:** it shows `<p>QA backorder PO note</p>` and the counter reads 27 / 250 – the HTML notes field is rendered with a plain-text (char limit) widget, so the stored `<p>` tags are displayed, eat into the 250-char limit, and re-saving would escape them. Internal Comments (plain text) is fine.
- **Severity:** Low (display / data quality).

## TC-070 – Backorder bills repeat the PO's S&H / Insurance / Discount and drop the line discount (vendor overbilled)
- **Steps:** PO **P00814**: Product 2 × 20 (case UoM) at 8.00, line discount 1.00 → subtotal 159.00; S&H 5.00, Insurance 2.00, Discount 1.00 → **Total 165.00**. Confirm > receive 10 (backorder created) > receive the backorder's 10 (Marti/IN/00901) > post both bills.
- **Expected:** the two bills together = 165.00 (header charges billed once; line discount kept).
- **Actual:** **BILL/146 = 86.00** and **BILL/147 = 86.00** → **172.00** billed (+7.00). Each bill = 10 × 8.00 = 80.00 + S&H 5.00 + Insurance 2.00 − Discount 1.00: the header charges are copied onto every partial bill and the 1.00 line discount is on neither.
- The PO PDF itself is correct (Received/Billed qty 20, Total 165.00).
- **Severity:** High (vendor overpaid on every partial receipt).

## TC-078 – Virtual Location Stock Transfer "Truck to Warehouse" can't be used: Add crashes (or finds nothing)
- **Steps:** Inventory > Virtual Location Stock Transfer > New: Transfer Type **Truck to Warehouse**, Warehouse **Martiserv**, User Komala, Transfer Reason, Category CAT-QA-001, Products = QA Product 4 (TRUCK-QA-001-92196 holds 58 units, loaded from Martiserv) > **Add**.
- **Expected:** the truck's stock of the product is loaded as a line to transfer back.
- **Actual:** "Something went wrong" – `ValueError: Expected singleton: stock.warehouse(191, 4683, 4681, 4690, 4693, 4686, 4684, 4695)` (the code assumes one truck per warehouse; Martiserv has eight). With a warehouse that has no truck (e.g. WH-QA-001-92196) Add loads no lines. The form has no Truck field, so a truck can't be chosen; the User field doesn't list the truck driver (an employee without a login).
- The other three types work with every field (run 1791175992196): **WHT/00363** Warehouse to Warehouse (WH-QA-001 → Martiserv, total on-hand unchanged), **WHT/00364** Warehouse to Virtual Location (−1), **WHT/00365** Virtual Location to Warehouse (+1). Line UoM is read-only (product UoM "Each").
- **Severity:** High (a transfer type is unusable).

## TC-080 – Equipment Part: changing the Sales Price can't be saved
- **Steps:** Equipment Management > Configuration > Equipment Parts > PART-QA-001-92196 [AVR01131] > Sales Price 1.00 → **25.00** > Save.
- **Expected:** the part saves with Sales Price 25.00.
- **Actual:** "Averigo Error – **Wrong value for price.change.history.type: 'product-master'**"; the change can only be discarded. Changing any other field (name, type, category, image, UoM, taxable, Cost 12.50, Preferred Vendor) saves fine – only Sales Price fails, so a part's price stays at the 1.00 default. (Parts list cards show "List Price: $ 0.00" for this part while the form shows 1.00.)
- **Severity:** Medium (part pricing can't be maintained).

## TC-084 – Closing a Billable case fails: "Incompatible companies on records" (CRV tax line)
- **Steps:** Service Management > Cases > New: Customer 1, Equipment 11742 (EQ1-SN-92196-WH), **Billable ✓**, Preventive ✓, priority 2, category/type/origin QA, Assigned To, Route, Reported By/Phone/Email, Parts Warehouse, description + internal comment > Save > Close Case (tech, internal + resolution comment) > Submit.
- **Expected:** the case closes (and bills the customer).
- **Actual:** "Averigo Error – Incompatible companies on records: “Draft-INV422 CRV 5 Cents” belongs to company “Martiserv” and “Originator Tax Distribution Line” (tax_repartition_line_id: 'account.tax.repartition.line,362') belongs to another company." The case stays Open. With Billable unticked the same case closes (**CM02481**, and with Assigned To / Tech Person / Parts Warehouse picked from their dropdowns **CM02485**: Closed, 1 note / 1 attachment / 1 internal / 1 resolution comment).
- The CRV (container deposit) tax's repartition line belongs to another company, so any billable case for a customer/product with CRV can't be closed.
- **Severity:** High (billable service cases can't be closed/billed).

## TC-084 – New case: Contact Name / Email typed before the first save are replaced by the customer's
- **Steps:** Cases > New: Customer 1, Contact Name "QA Case Contact", Email case.contact.qa@example.com (entered last, after all other fields) > Save.
- **Actual:** saved as Contact Name "CUST-QA-001-92196" and Email "cust1.92196@example.com" (the customer's). Editing them on the saved case and saving again keeps the typed values.
- **Severity:** Low (data entered on create is silently lost).

## TC-086 (clarify) – Equipment Location Report leaves Area/Pos empty
- **Steps:** Averigo Reports > Equipment Management > Equipment Location Report: Customers = Customer 1, Manufacturer = QA Manufacturer, Status = In Service > Generate.
- **Actual:** the row for Equipment 1 (EQ1-SN-92196-WH) shows Area/Pos **"-"**, while the equipment (installed at Customer 1 in TC-081) shows its location as **"CUST-QA-001-92196 - QA Area"**. All other columns (name, manufacturer, serial, customer, address, date, status) match.
- **Ask:** should Area/Pos show the equipment's install area/POS location? (Configuration > Equipment Area/POS Location has no New on this instance, so the area comes from the customer's area.)
- **Severity:** Low (report data).

## TC-094 – Micro Market location: ticking "Addl.Tax" crashes (Expected singleton: additional.tax)
- **Steps:** Micromarket Services > Locations > MM-QA-001-92196 > General Information > tick **Addl.Tax**.
- **Expected:** the box ticks (and the additional tax is applied to the market).
- **Actual:** "Something went wrong" – `averigo_micro_market/models/stock_warehouse.py`, `_onchange_addl_tax` (line 936): **`ValueError: Expected singleton: additional.tax(1, 406)`**. The onchange assumes a single Additional Tax record; this instance has two, so Addl.Tax can't be enabled on any market. Re-trying gives `ValueError: too many values to unpack (expected 1)` from the same onchange (same cause).
- **Severity:** Medium (additional tax can't be configured for micro markets).

## TC-096 – Update Location: a Min/Max-only update writes off the market's whole stock (Actual defaults to 0)
- **Steps:** Micromarket Services > Update Location > New: Micro Market MM-QA-001-92196 > load product lines. Product 1 had **8** in the market (after store order INT/00003). Change only Min/Max (2/10), leave Actual as shown (0, "Copy Actual Qty" not clicked) > Save > **Update & Reconcile** (**QUP/06143**).
- **Expected:** only Min/Max change; the market keeps its 8 units (Actual should default to the current stock, or an untouched Actual should be ignored / warned about).
- **Actual:** reconciling treats Actual 0 as a physical count and posts **QA/NEW - QUP/06143: 8 × Product 1, MM-QA-001-92196/Stock → Inventory adjustment** – market stock 8 → **0**, with no warning. Clicking "Copy Actual Qty" first avoids it (QUP/06154: Actual = Stock 2, no write-off).
- Also: Spoiled / Theft / Return post correctly (Spoiled and Theft → Virtual Locations/Martiserv: Scrap, Return → the line's Warehouse, e.g. SP/03714, SP/03715, INT/00009), but are accepted when the market has less than that on hand → market stock went to **−3**, then **−1** (no warning).
- **Severity:** High (a routine Min/Max update can silently write off a market's stock).

## TC-099C – Closing a micro market moves its stock out, but the market still shows the old Current Stock
- **Steps:** Micromarket Services > Locations > new market **MM-QA-001-92196-CLOSE4** (Customer 1, Product 1) > store order 2 × Product 1 (received; booked 2 + 2, see TC-095) > market **Active Market** smart button > Close Market: Reason, Transfer Stocks To **WH-QA-001-92196** > Confirm > "Are you sure want to Close this Market ?" Ok.
- **Expected:** the market is closed, its stock (4) is transferred to WH-QA-001-92196 and its Products tab shows Current Stock 0.
- **Actual:** closing works (button now "Closed Market", `is_closed` / market_status "close"; transfer **MM-QA-001-92196-CLOSE4/INT/00001**: 4 × Product 1, CLOSE4/Stock → WH-QA-001-92196/Stock; quant at CLOSE4/Stock = 0), but the market's **Products tab still shows Current Stock 4** (`product.micro.market.quantity` = 4) – the stored figure isn't updated by the close transfer.
- Note: closing does not archive the market (it stays active; Others > Archived Date/Reason stay empty) and markets can't be deleted.
- **Severity:** Low/Medium (wrong stock shown for closed markets; reports reading this figure would be off).

## Negative tests (tests/15-negative.spec.js, run 1791898854386, 10/14/2026) – invalid input the app accepts
Each was attempted by the automated negative case named; "saved" means no message appeared and the record was stored.
| NTC | Related TC | Invalid input / action | App response | Status |
|---|---|---|---|---|
| NTC-002 | TC-002 | New product category with the same name and parent as CAT-QA-001 | saved (duplicate category) | Confirmed (low) |
| NTC-005 | TC-005 | Warehouse short code of 8 characters | not saved, but **no message** shown | Confirmed (UX) |
| NTC-007 | TC-007 | New bin with no Location / warehouse | saved: bin NEG-BIN-210853 has an empty Location | Confirmed |
| NTC-009 | TC-009 | Order type with an existing name | saved; the list already holds many duplicates ("test" ×12, ORDTYPE-QA-001-55000 ×2) | Confirmed (low) |
| NTC-015 | TC-017 | Quantity adjustment with Counted = -5 for Product 1 | saved / applied without a message | To confirm on the stock |
| NTC-017 | TC-021 | Product catalogue with no products | saved | Confirmed (low) |
| NTC-018 | TC-022 | New customer without a Receivable Account | saved without a message | To confirm on the record |
| NTC-042 | TC-044 | Credit memo (Others) above the invoice total | saved without a message | To confirm (amount / posting) |
| NTC-053 | TC-062 | PO "Add" with no product selected | nothing happens, **no message** (earlier this crashed with IndexError) | Confirmed (UX) |
| NTC-054 | TC-063 | Receive 50 on a PO line ordered 1 | saved without a message | To confirm on the receipt |
| NTC-063 | TC-070 | Receive 15 on a backorder of 2 | saved without a message | To confirm on the receipt |
| NTC-065 | TC-077 | Material transfer of 999,999 units from BIN-QA-001 | saved without a message (no stock check) | To confirm on the transfer |
| NTC-068 | TC-080 | Change an equipment part's Sales Price | "Wrong value for price.change.history.type" (see TC-080) | Confirmed (known) |
| NTC-003 | TC-003 | Product 1 UoM Specifications line quantity (ratio) set to 0 | saved without a message (the test now restores 12) | Confirmed |
| NTC-012 | TC-012 | New product with Container Deposit ticked and Container Deposit Amount 0.00 | saved without a message | Confirmed |
| NTC-022 | TC-022 | Cancel a contact's address-type change (Billing to Delivery) | stored type unchanged, but the radio stays on the new type after Cancel (UI only) | Confirmed (UI, low) |
| NTC-030 | TC-030 | Packing slip: pick 5 of Product 2 on an order line of 1 | saved without a message (over-pick allowed) | Confirmed |
| NTC-036 | TC-036 | Deliver 524 of Product 4 with 519 on hand | saved without a message (no stock check on delivery) | To confirm on the delivery |
| NTC-051 | TC-060A | Vendor SAP Vendor No (internal reference) set to non-numeric text | saved without a message (the test restores the number) | Confirmed (low) |

## ultraserv.averigoqa.com run (RUN_ID 1792051668539)

| TC | Finding | Status |
|---|---|---|
| TC-019 | Stock Value Report (Warehouse) for WH-QA-001-68539, today, Detail returns "No data Found", although Products 1-4 have stock there (TC-017 adjustments and seed stock) and were revalued in TC-018. Reproduced on a second run outside the suite. | App defect (ultraserv) |
| TC-029 | Customer 1 order S (sale.order 17226) vs its invoice INV/00157294: same lines (Product 1 2 x 246 = 492, Subsidy 2, Fuel 12, Hazard 10), but order tax 31.98 / total 556.38 and invoice tax 31.99 / total 556.39 (1 cent rounding difference between order and invoice). | App defect (ultraserv) |
| TC-040 | Product UoM Change Report (today) returns "No data Found" after Customer 1's Product 1 line UoM is changed to UOM-QA-001-68539; Product UoM is read-only in Product Master, so the report has no source of changes (same as martiserv). | App defect (known, ultraserv too) |
| TC-042 | Sales return of 1 case on INV/00157294 + credit memo: Customer 1 balance drops by 1 cent less than the credit memo total (expected 307.97, shown 307.98). Same order/invoice rounding family as TC-029. | App defect (ultraserv) |
| TC-043 | Second sales return + credit memo on the same invoice: Customer 1 balance again 1 cent off (expected 45.65, shown 45.66). Same rounding family as TC-029 / TC-042. | App defect (ultraserv) |
| TC-048 | Aging By Customer Report (Customer 2, as of today, Summary) shows only CR/00104001 -5.00 (due today); the eight open invoices INV/00157295..302 (due 11/14/2026, residual 4,412.16) and credit CR/00103001 -150.70 are missing, so Total = -5.00 instead of the 4,256.46 open balance. Not-yet-due items should appear under Current. | App defect (ultraserv) |
| TC-055 | Customer Order Activity report: Customer 2's row (code C2-68539, 10/15/2026) shows the billing contact name "QA C2 Billing Address 68539" in the customer column instead of the customer CUST-QA-002-68539. Same on martiserv. | App defect (both instances) |
| TC-065 | Purchase Return (Material Issue of 2 cases of Product 1 on the vendor bill, billed 10.00 per case) -> credit memo total 22.58 instead of 20.00: the memo uses Product 1's average cost, not the billed cost (same as the martiserv TC-065 finding). Stock correctly drops by 24 units (2 cases x 12) on ultraserv. | App defect (known, ultraserv too) |
| TC-066 | AP > Advance Payment for VEND-QA-001-68539 ($40.00, Check): Confirm fails with "You have to define a sequence for vendor advance payments in your company." The payment stays Draft (account.payment 13807), so no vendor advance can be confirmed on ultraserv. Company configuration gap (missing sequence). | App/config defect (ultraserv) |
| TC-067 | AP Credit Memo, Purchase Return type: memo shows 6.10 but the vendor balances move by 7.06 (posted at average cost, not the billed cost). Same as martiserv TC-067 and the TC-065 root cause. | App defect (known, ultraserv too) |
| TC-068 | Direct bill BILL/2026/0522 (Product 1, subtotal 200.00): tax 196.96 (total 396.96) instead of ~17.26 at 8.63%; tax is not computed on the bill line (same as martiserv TC-068). | App defect (known, ultraserv too) |
| TC-069 | Direct Receipt with Receiver = Komala: the receipt PDF's "Received By:" line is blank (same as martiserv TC-069). | App defect (known, ultraserv too) |
| TC-070 | PO with backorder: (1) the PO Notes field shows raw HTML "<p>QA backorder PO note</p>"; (2) the partial-receipt bill BILL/2026/0523 (86.00) + backorder bill BILL/2026/0524 (86.00) = 172.00 vs PO total 165.00 (vendor over-billed by 7.00). Same as martiserv TC-070. | App defect (known, ultraserv too) |
| TC-072 | Purchase Order Report (vendor VEND-QA-001-68539, last 14 days to today, Status All, Summary) returns "No data Found", although the vendor has 5 confirmed POs dated 10/15/2026 (P04328-P04331, P04333). The Vendor Invoice Report with the same vendor filter works. | App defect (ultraserv) |
| TC-077 | Material Transfer (action 1790, form view 6681) has no Validate button for komala@averigo.com on ultraserv: the transfer reaches Ready, only Cancel is offered. The same view on martiserv shows button_validate (Ready state). The button is stripped for this user, most likely a missing permission group, so material transfers can't be completed on ultraserv. Needs an admin to grant the right group. | Setup/permission gap (ultraserv) |
| TC-077 (test data) | The first TC-077 attempt quick-created an internal user "Komala" (res.users 6244, login "@ultraserv") from the Owner picker. Left active (user's choice). Pickers for user/employee/owner fields no longer quick-create. Leftover transfers: WH-QA-001-68539/INT/00001..; all stay Ready/Draft. | Test-data note (ultraserv) |
| TC-078 | Virtual Location Stock Transfer, Truck to Warehouse: Add crashes with "ValueError: Expected singleton: stock.warehouse(4723, 4724, 219)" (same as martiserv TC-078). Warehouse to Warehouse works (WHT/06222). | App defect (known, ultraserv too) |
| TC-080 | Equipment part: saving Sales Price 25 raises an Averigo Error (price change history; same as martiserv TC-080). | App defect (known, ultraserv too) |
| TC-084 | Case: (1) the Contact Name/Email typed on a new case are replaced by the customer's (CUST-QA-001-68539 / cust1.edited...) after create; (2) Close Case on a Billable case fails with "Incompatible companies on records". Same as martiserv TC-084. | App defect (known, ultraserv too) |
| TC-091 | Event tickets: ultraserv has no product with service tracking = Event, so a ticket line can't be saved (Product is required on event.event.ticket). The test now skips the ticket there (noted in the report). Script fix too: the last question answer no longer leaves a blank (required) answer row. | Setup gap (ultraserv) |
| TC-091 (test data) | While diagnosing, three trial events were created: EVENT-QA-001-68539-Pnone, -Pimage, -Pnotes. | Test-data note (ultraserv) |
| TC-092 | Customer Retention Report shows the CRM meeting Event-QA-CRM-001-68539 at 04:30-06:00 (UTC) instead of 10:00-11:30 in the user's timezone (same as martiserv TC-092). | App defect (known, ultraserv too) |
| TC-094 | Micro Market MM-QA-001-68539: loading the product catalogue PCAT-MM-QA-001-68539 does not add its products (Products 2-4); they had to be added directly (same as martiserv). Market, fees and Product 1 are fine. | App defect (known, ultraserv too) |
| TC-095 | Store order for 4 x Product 1 (and 4 x Product 2) into MM-QA-001-68539: after receipt the market stock for Product 1 is 8 instead of 4 (quantity booked twice; same as martiserv TC-095). | App defect (known, ultraserv too) |
| TC-086 | Equipment Location Report: EQNAME-QA-68539 row shows Area/Pos "-" instead of "QA Area" (same as martiserv TC-086); all other report checks pass. | App defect (known, ultraserv too) |
| TC-099C | Close Market (Active Market button, transfer stock to WH-QA-001-68539): the market is closed but its stock stays at 4 instead of 0 (not transferred; same as martiserv TC-099C). | App defect (known, ultraserv too) |
| TC-075 | Update Warehouse reconciliation of Product 3 (overage 2, spoilage 1, shrinkage 1): on-hand 480 -> 980 (+500, the BIN-QA-001 stock duplicated) instead of no net change; Overage Shrinkage Spoilage (Warehouse) Report shows only Spoilage (Overage 2 / Shrinkage 1 missing). Same as martiserv TC-075. | App defect (known, ultraserv too) |
| TC-100 | Averigo Reports > MicroMarket > Product Move Report: the report screen does not open within 2 minutes on ultraserv (stays "Loading"), on two consecutive runs; the other MicroMarket reports in TC-100 (Stock Value, Stock Analysis, Store Order List, Unpicked Product List, Products with Min/Max) open and pass. Script fixes: Min/Max now compared with the market's current values (TC-096 alternates 2/10 and 3/12); reports retry once when the first result is empty. | App performance defect (ultraserv) |

### ultraserv positive run (RUN_ID 1792384909600, 10/19/2026): 88 pass, 25 fail

All 25 failures are the ultraserv defects above. Reruns on 10/19: TC-084, TC-086 and TC-099C fail as described above. TC-072 and TC-100 fail differently:

| TC | Finding | Status |
|---|---|---|
| TC-072 | Purchase Order Report now passes on ultraserv. Product Order Report > Current Stock for the main warehouse shows **-28** (the truck was loaded with stock the warehouse didn't have). This is the martiserv TC-072 defect at the top of this file, now reproduced on ultraserv. | App defect (known, ultraserv too) |
| TC-100 | Product Move Report is no longer the failing step. MicroMarket > Stock Value Report (MM-QA-001-09600, today, Detail) shows Product 1 PROD-QA-001-09600 with quantity **0** (cost $5.7164, value $0.00), while the market holds **13**. The test stops at this first step, so the other MicroMarket reports were not checked. Possibly related to TC-019 (warehouse Stock Value Report: "No data Found"). | New, to confirm (ultraserv) |
| TC-084 | Besides the two known case defects, Assigned To was empty after picking the first employee in the dropdown (soft check). Not investigated; could be test data or the script. | To check |

### ultraserv negative run (RUN_ID 1792051668539): 69 pass, 22 fail, 1 skipped

Same failures as martiserv (already logged above): NTC-002, 003, 005, 007, 009, 012, 015, 017, 018, 022, 030, 036, 042, 051, 053, 054, 063, 065, 068.

| NTC | Related TC | Bad input | App response | Status |
|---|---|---|---|---|
| NTC-060 | TC-067 | Purchase Discount debit memo for VEND-QA-001-68539 (no open material issue left) | vendor not offered: the AP Credit Memo vendor picker only lists vendors with an open Material Issue, for every memo type (same root cause as the martiserv TC-067 finding) | App defect (known) |
| NTC-082 | TC-095 | Store order to MM-QA-001-68539 with every quantity 0 | saved without a message (on martiserv this was refused) | App defect (ultraserv) |
| NTC-085 | TC-096 | Update Location: Spoiled 105 on Product 1 with market stock 5 | **accepted and reconciled**: on rerun 10/16 QUP/263274 went to Updated & Reconciled with Spoiled 105, and MM-QA-001-68539 stock for Product 1 is now **-100** (negative stock). The first attempt had only shown the value silently resetting to 0 on Save. | App defect (high, ultraserv) |
| NTC-026 | TC-028 | Pay more than the amount due | skipped: Customer 1's invoice is already fully paid on this data set | Not run (data state) |

NTC-016 and NTC-062 failed first on page-load timeouts (server slowness) and passed on rerun. Diagnosing NTC-085 left two extra Draft Update Location records (QUP/263270, QUP/263272).
| NTC-042 (re-test) | TC-044 | Credit memo type Others for Customer 2 against INV/00157300 (total 308.40), amount 1,308.40 | **posted** with no message: CR/00105001 (full run) and CR/00106001 (rerun 10/16), each 1,308.40 open, i.e. 1,000.00 more than the invoice. Confirmed on ultraserv. | App defect (confirmed, ultraserv) |
| NTC-005 / 022 / 053 (re-test 10/16) | TC-005 / TC-022 / TC-062 | same inputs | same results: warehouse code > 5 refused with no message; contact radio stays on Delivery after Cancel; PO Add with no product does nothing, no message | App defects confirmed (ultraserv) |

### Replacement negative scenarios (10/16/2026, ultraserv): 9 pass, 1 fail

NTC-005/030/036/042/051/053/054/063/082/085 were replaced because the original inputs are allowed by the app workflow (see the rows above). The new scenarios for NTC-005, 030, 036, 051, 053, 054, 063 and 082 are correctly refused.

| NTC | New scenario | App response | Status |
|---|---|---|---|
| NTC-042 | Credit memo (Others) for Customer 2 with amount 0 | **posted**: CR/00107001, total 0.00, with no message | App defect (ultraserv) |
| NTC-085 | Update Location, Spoiled -3 on Product 1 | correctly refused: "You can not enter negative quantities." when Update & Reconcile is clicked (confirmed manually by the user). The earlier "no message" result was a script issue: pressing Tab + Save first dropped the value, and the 10 s wait was too short. Test fixed and passing. | Not a defect (resolved) |

### ultraserv negative run (RUN_ID 1792384909600, 10/19-10/20/2026): 83 pass, 13 fail

Every failure was rerun once. NTC-062 failed first and passed on rerun. Still failing, same as the 1792051668539 run: NTC-002, 003, 007, 009, 012, 015, 017, 018, 022, 042, 060, 065, 068. NTC-065 can't really be tested on ultraserv: the transfer stops because Validate is missing (TC-077), not because the app refused it.

| NTC | Finding | Status |
|---|---|---|
| NTC-013 | Product Category on the ultraserv product form is an AveriGo dropdown (`o_av_cdd`) with no text input and no way to clear it. It's required and defaults to "Amenity", so the original scenario can't be performed. **Replaced 10/20/2026** with "Create a product without a Product Name": correctly refused. | Pass (replaced scenario) |
| NTC-026 | Customer 1's invoice is already paid (TC-028). **Replaced 10/20/2026** with "Pay more than the amount due on an open Customer 2 invoice" (amount due + 100): correctly refused. | Pass (replaced scenario) |
| NTC-091 | Script fixes: the wait for the Close Market dialog didn't wait (`isVisible`), then was too short (the dialog takes over 5 s to open); the test now also clicks Ok on the confirmation. App: Confirm with Reason for Closed / Transfer Stocks To empty first asks "Are you sure want to Close this Market ?"; after Ok the close is refused, the two fields are highlighted as required and the market stays active. Minor UX point: the confirmation is offered before the required fields are checked. | Pass |
