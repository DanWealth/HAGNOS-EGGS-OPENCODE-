# **Hagnos Eggs — Product Requirements Document (PRD)**

**Product:** Hagnos Eggs  
 **Product Type:** B2B Agricultural Marketplace  
 **Primary Market:** Nigeria  
 **Initial Operating Corridor:** Ibadan–Ogun axis → Lagos  
 **Primary Delivery Day:** Tuesday  
 **Ordering Window:** Monday  
 **Document Status:** Product Requirements Document

---

# **1\. Product Overview**

## **1.1 Product Description**

**Hagnos Eggs** is a B2B agricultural marketplace that connects poultry farms in the Ibadan-Ogun axis directly with commercial buyers, including bakeries, supermarkets, and hotels, as well as neighborhood Hub Operators in Lagos.

The platform is designed to streamline bulk egg procurement through:

* Automated demand aggregation

* Transparent size-based pricing

* Secure payment authorization and holding

* Automated supply-discrepancy adjustments

* Digital wallet credits

* Coordinated logistics and delivery

* Physical crate exchange

The platform aims to reduce the logistics friction typically associated with the Nigerian agricultural supply chain.

---

# **2\. Product Objectives**

The primary objectives of Hagnos Eggs are to:

1. Aggregate buyer demand before farm procurement.

2. Allow the Administrator to establish weekly egg prices.

3. Enable buyers to pre-order eggs within a defined Monday ordering window.

4. Securely authorize and hold buyer funds until order validation.

5. Coordinate Tuesday farm procurement and delivery.

6. Handle egg-size shortages through automated price adjustments.

7. Credit buyers automatically when they receive a lower-priced egg size than ordered.

8. Establish a digital wallet for rollover credits.

9. Encourage physical crate swaps to reduce crate-related logistics costs.

10. Maintain efficient delivery economics through a minimum order volume.

---

# **3\. Target Users**

## **3.1 Commercial Buyers**

**Examples:** Bakeries, hotels, supermarkets.

### **Needs**

* Standardized egg sizes, primarily Large and Medium.

* Predictable delivery times.

* Reliable supply.

* Price stability.

* Convenient digital payments.

### **Behavior**

* Tech-literate.

* Prefer card or bank-transfer payments.

* Operate according to weekly production schedules.

* Require reliable supply to avoid production interruptions.

---

## **3.2 Hub Operators**

**Examples:** Neighborhood depot partners.

### **Needs**

* Steep wholesale discounts to create retail margins.

* Reliable bulk supply.

* Local visibility.

* Ability to serve retail customers and "Indomie" joints.

* Fast digital transactions.

### **Behavior**

* Operate physical shops.

* Experience high-volume turnover.

* Prefer digital transactions for platform purchases.

* Serve cash-based end consumers.

---

## **3.3 Platform Administrator**

The Administrator controls the operational and commercial configuration of the platform.

### **Needs**

* Set weekly egg prices.

* View total funds held from buyer orders.

* Manage supply discrepancies.

* Update order sizes when required.

* Coordinate logistics.

* Group deliveries into routes.

* Manage wallet balances.

* Initiate farm payments and dispatch.

---

# **4\. Core Product Workflow**

The primary weekly operating cycle is:

SUNDAY NIGHT  
Admin Sets Weekly Prices  
        ↓  
MONDAY  
Buyers Place Orders & Funds Are Authorized/Held  
        ↓  
MONDAY 11:59 PM  
Ordering Window Closes  
        ↓  
TUESDAY MORNING  
Admin Validates Supply  
        ↓  
Admin Pays Farm  
        ↓  
Truck Is Dispatched  
        ↓  
TUESDAY EVENING  
Eggs Delivered to Hubs/Bakeries  
        ↓  
Empty Crates Swapped  
        ↓  
TUESDAY NIGHT  
Orders Finalized  
        ↓  
Funds Released  
        ↓  
Breakage/Price Differences Credited to Wallet

---

# **5\. Functional Requirements**

## **5.1 Weekly Price Management**

### **Requirement**

The Administrator must be able to configure the weekly selling price for each egg size.

### **Supported Egg Sizes**

* Large

* Medium

* Pullet

### **Requirements**

* Prices must be configurable by the Administrator.

* Prices must be locked once the Monday ordering window opens.

* Buyers must see the applicable prices before placing an order.

* The selected prices must be attached to the order at checkout.

---

# **6\. Monday Ordering Window**

## **6.1 Order Opening**

The platform must open for orders every Monday morning.

The Administrator's configured prices become the active prices for the ordering period.

## **6.2 Order Closing**

The ordering window must close strictly at:

**Monday, 11:59 PM**

The purpose of the cut-off is to provide sufficient time for Tuesday morning farm execution.

## **6.3 Minimum Order**

The minimum order is:

**10 crates per delivery destination.**

Orders below the minimum must not be accepted.

### **Business Rule**

> MOV \= 10 crates per delivery destination.

---

# **7\. Order Creation**

When creating an order, the buyer must:

1. Select the egg size.

2. Enter the number of crates.

3. Select or confirm the delivery destination.

4. Review the order value.

5. Apply available wallet balance.

6. Pay or authorize the remaining amount.

7. Confirm the order.

### **Supported Size Selection**

The buyer must explicitly select one of:

* **Large**

* **Medium**

* **Pullet**

---

# **8\. Payment & Fund Holding**

## **8.1 Payment Authorization**

When a buyer places an order, the platform must integrate with a payment gateway to securely authorize and hold the total order funds.

Funds must not be treated as fully settled until Tuesday validation.

## **8.2 Payment State**

An order should move through payment states such as:

Payment Pending  
      ↓  
Payment Authorized / Funds Held  
      ↓  
Order Validated  
      ↓  
Funds Released

The platform must maintain a record of the amount authorized for every order.

---

# **9\. Digital Wallet**

## **9.1 Wallet Overview**

Every buyer profile must have a closed-loop **In-App Digital Wallet**.

The wallet is used primarily to hold credits generated from order adjustments.

## **9.2 Wallet Inputs**

The wallet can receive automated credits resulting from:

* Egg-size downgrades.

* Delivery breakage equivalents.

## **9.3 Wallet Outputs**

Wallet balances must automatically become a primary payment method during the next Monday ordering cycle.

### **Example**

If a buyer receives a credit of ₦5,000 after Tuesday fulfillment:

Current Wallet Balance: ₦5,000

Next Monday Order:  
Order Total: ₦50,000  
Wallet Credit: ₦5,000  
Remaining Payment: ₦45,000

---

# **10\. Auto-Offset Engine**

## **10.1 Purpose**

The Auto-Offset Engine handles situations where the farm cannot supply the exact egg size ordered.

## **10.2 Supply Shortage**

If a farm experiences a size shortage on Tuesday morning, the Administrator must be able to update the affected order.

## **10.3 Down-Grading Logic**

Example:

Buyer Ordered:  
Large Eggs

Actual Supply:  
Medium Eggs

The system must:

1. Identify the affected order.

2. Change the fulfilled egg size from Large to Medium.

3. Retrieve the applicable prices.

4. Calculate the price difference.

5. Confirm the resulting credit.

6. Add the difference to the buyer's digital wallet.

7. Record the wallet transaction against the order.

### **Example**

Large Price: ₦X  
Medium Price: ₦Y

Price Difference:  
₦X \- ₦Y \= ₦Z

Wallet Credit:  
₦Z

The buyer therefore does not lose the value of the price difference.

---

# **11\. Delivery Breakage**

## **11.1 Requirement**

The platform must account for delivery breakage during order fulfillment.

Where an applicable breakage credit is determined, the corresponding amount must be credited to the buyer's digital wallet.

## **11.2 Wallet Record**

Each wallet credit should be traceable to its originating order.

Example:

Wallet Transaction  
\------------------  
Type: Breakage Credit  
Order: \#HG-000123  
Amount: ₦X  
Date: Tuesday  
Status: Credited

---

# **12\. Crate Management**

## **12.1 First-Time Buyers**

First-time buyers must be charged a **First-Time Crate Fee**.

The fee must be added to the checkout total.

## **12.2 Returning Buyers**

For subsequent orders, the checkout screen must display:

> "Please have \[X\] clean, empty plastic crates ready for physical swap upon delivery."

## **12.3 Physical Crate Swap**

At delivery:

Full Crates Delivered  
        ↕  
Empty Crates Collected

The system should record the expected crate quantity associated with the order.

---

# **13\. Logistics Management**

## **13.1 Tuesday Dispatch**

On Tuesday morning, after supply validation, the Administrator must be able to initiate the logistics process.

The process consists of:

1. Confirming farm supply.

2. Confirming orders.

3. Grouping destinations into delivery routes.

4. Arranging the rented truck.

5. Dispatching the truck.

6. Delivering to Hubs and commercial buyers.

7. Collecting empty crates.

8. Completing delivery records.

---

# **14\. Delivery Destinations**

The platform must support delivery to:

* Commercial buyers.

* Neighborhood Hub Operators.

Each delivery destination must have:

* Buyer/Hub identity.

* Delivery address.

* Order quantity.

* Egg size.

* Expected crate quantity.

* Delivery status.

---

# **15\. Order Status Lifecycle**

Orders should progress through a defined lifecycle:

Draft  
  ↓  
Placed  
  ↓  
Payment Authorized  
  ↓  
Funds Held  
  ↓  
Supply Validated  
  ↓  
Ready for Dispatch  
  ↓  
Dispatched  
  ↓  
Delivered  
  ↓  
Fulfillment Finalized  
  ↓  
Funds Released

Where a supply discrepancy occurs:

Supply Validated  
      ↓  
Size Adjustment Required  
      ↓  
Order Updated  
      ↓  
Price Difference Calculated  
      ↓  
Wallet Credit Created  
      ↓  
Delivered

---

# **16\. Administrator Requirements**

The Administrator dashboard should provide visibility and control over:

### **Pricing**

* Weekly prices.

* Large price.

* Medium price.

* Pullet price.

### **Orders**

* Total orders.

* Total crates ordered.

* Orders by buyer type.

* Orders by egg size.

* Orders requiring adjustment.

### **Payments**

* Total funds authorized.

* Total funds held.

* Total funds released.

* Outstanding payment issues.

### **Logistics**

* Delivery destinations.

* Crates per destination.

* Route groupings.

* Dispatch status.

* Delivery status.

### **Wallet**

* Total wallet liabilities.

* Individual buyer wallet balances.

* Wallet credits.

* Wallet deductions.

* Wallet transaction history.

---

# **17\. Business Rules**

| Rule | Requirement |
| ----- | ----- |
| Minimum Order | 10 crates per delivery destination |
| Ordering Day | Monday |
| Order Cut-off | Monday, 11:59 PM |
| Primary Delivery Day | Tuesday |
| Egg Sizes | Large, Medium, Pullet |
| First-Time Buyer | First-Time Crate Fee applies |
| Returning Buyer | Empty crate swap required |
| Size Downgrade | Price difference credited to wallet |
| Breakage | Applicable credit sent to wallet |
| Wallet Usage | Primary payment method for next Monday order |
| Price Control | Administrator |
| Tuesday Execution | Farm payment \+ truck dispatch |

---

# **18\. Success Metrics**

## **18.1 Minimum Order Volume**

**Target:** 10 crates per delivery destination.

This protects the efficiency of rented vehicle operations.

## **18.2 Fulfillment Rate**

**Target:** At least 95% of orders delivered within the Tuesday evening delivery window.

## **18.3 Breakage Rate**

**Target:** Less than 2%.

## **18.4 Ordering Compliance**

The platform should enforce the Monday ordering deadline so that orders are received before Tuesday farm execution.

---

# **19\. Guardrails**

The platform must enforce the following:

* Orders below 10 crates must not be accepted.

* Monday ordering must close at 11:59 PM.

* Weekly prices must be locked for the active ordering period.

* Buyers must select an egg size before checkout.

* Funds must remain held until the defined fulfillment validation point.

* Size adjustments must create an auditable price-difference calculation.

* Wallet credits must be linked to the originating order.

* Wallet transactions must be recorded.

* First-time buyers must be charged the applicable crate fee.

* Returning buyers must receive the crate-swap reminder.

---

# **20\. MVP Scope**

The initial MVP should include:

### **Buyer**

* Account/profile

* Egg-size selection

* Crate quantity selection

* Order creation

* Checkout

* Payment authorization

* Wallet

* Order history

* Delivery information

### **Administrator**

* Weekly price management

* Order management

* Supply-size adjustment

* Wallet adjustment visibility

* Payment/fund visibility

* Delivery management

* Basic route grouping

* Crate tracking

### **Core Automation**

* Monday ordering window

* 11:59 PM cut-off

* Minimum 10-crate validation

* Payment authorization

* Size downgrade calculation

* Automatic wallet credit

* Wallet rollover to subsequent orders

---

# **21\. Out of Scope for Initial MVP**

The following can be considered for later phases:

* Automated dynamic pricing.

* Advanced demand forecasting.

* AI-powered demand prediction.

* Automated farm allocation.

* Real-time truck GPS tracking.

* Automated multi-farm procurement optimization.

* Credit facilities for buyers.

* Consumer-facing retail marketplace.

* Advanced analytics and forecasting.

---

# **22\. Key User Journey — Commercial Buyer**

Buyer Logs In  
      ↓  
Monday Ordering Window Opens  
      ↓  
Buyer Selects Egg Size  
      ↓  
Buyer Selects Number of Crates  
      ↓  
System Validates Minimum 10 Crates  
      ↓  
Wallet Balance Applied  
      ↓  
Remaining Amount Authorized  
      ↓  
Order Confirmed  
      ↓  
Funds Held  
      ↓  
Tuesday Supply Validation  
      ↓  
Order Fulfilled  
      ↓  
Crates Swapped  
      ↓  
Any Size Difference / Breakage Calculated  
      ↓  
Applicable Credit Added to Wallet  
      ↓  
Funds Released  
      ↓  
Order Completed

---

# **23\. Key User Journey — Hub Operator**

Hub Operator Logs In  
      ↓  
Monday Ordering Window Opens  
      ↓  
Selects Egg Size  
      ↓  
Selects Crate Quantity  
      ↓  
Confirms Delivery Location  
      ↓  
Payment Authorized  
      ↓  
Funds Held  
      ↓  
Tuesday Delivery  
      ↓  
Full Crates Received  
      ↓  
Empty Crates Returned  
      ↓  
Order Finalized  
      ↓  
Applicable Credits Added to Wallet

---

# **24\. Key User Journey — Administrator**

Sunday Night  
      ↓  
Set Weekly Prices  
      ↓  
Monday  
Monitor Incoming Orders  
      ↓  
11:59 PM  
Ordering Window Closes  
      ↓  
Tuesday Morning  
Review Aggregated Demand  
      ↓  
Validate Farm Supply  
      ↓  
Adjust Affected Orders  
      ↓  
Pay Farm  
      ↓  
Group Delivery Routes  
      ↓  
Dispatch Rented Truck  
      ↓  
Tuesday Evening  
Monitor Deliveries  
      ↓  
Confirm Crate Swaps  
      ↓  
Finalize Orders  
      ↓  
Release Funds  
      ↓  
Credit Wallets Where Applicable

---

# **25\. Acceptance Criteria**

The MVP will be considered functionally complete when:

1. An Administrator can set weekly prices.

2. Buyers can place orders only during the Monday ordering window.

3. The system prevents orders below 10 crates per destination.

4. Buyers can select Large, Medium, or Pullet.

5. Buyers can authorize payment through the configured payment gateway.

6. Authorized funds can be held until fulfillment validation.

7. Administrators can modify an order when the requested egg size is unavailable.

8. The system automatically calculates the price difference after a size downgrade.

9. The price difference is credited to the buyer's wallet.

10. Wallet balances can be applied to the next Monday order.

11. First-time buyers are charged the First-Time Crate Fee.

12. Returning buyers receive the physical crate-swap reminder.

13. Administrators can view orders and delivery destinations.

14. Administrators can manage Tuesday dispatch and fulfillment.

15. Applicable breakage credits can be recorded against orders and credited to wallets.

16. Orders can be moved through their complete fulfillment lifecycle.

17. The system maintains an auditable record of payments, adjustments, wallet credits, and fulfillment.

---

# **26\. Product Success Definition**

Hagnos Eggs succeeds when it can reliably operate the following weekly cycle:

**Aggregate demand → Lock weekly prices → Secure buyer funds → Procure from farms → Dispatch efficiently → Deliver on Tuesday → Manage discrepancies → Swap crates → Release funds → Roll credits into the next week's orders.**

# **Hagnos Eggs — Product Requirements Document (PRD)**

**Product:** Hagnos Eggs  
 **Product Type:** B2B Agricultural Marketplace  
 **Primary Market:** Nigeria  
 **Initial Operating Corridor:** Ibadan–Ogun axis → Lagos  
 **Primary Delivery Day:** Tuesday  
 **Ordering Window:** Monday  
 **Document Status:** Product Requirements Document

---

# **1\. Product Overview**

## **1.1 Product Description**

**Hagnos Eggs** is a B2B agricultural marketplace that connects poultry farms in the Ibadan-Ogun axis directly with commercial buyers, including bakeries, supermarkets, and hotels, as well as neighborhood Hub Operators in Lagos.

The platform is designed to streamline bulk egg procurement through:

* Automated demand aggregation

* Transparent size-based pricing

* Secure payment authorization and holding

* Automated supply-discrepancy adjustments

* Digital wallet credits

* Coordinated logistics and delivery

* Physical crate exchange

The platform aims to reduce the logistics friction typically associated with the Nigerian agricultural supply chain.

---

# **2\. Product Objectives**

The primary objectives of Hagnos Eggs are to:

1. Aggregate buyer demand before farm procurement.

2. Allow the Administrator to establish weekly egg prices.

3. Enable buyers to pre-order eggs within a defined Monday ordering window.

4. Securely authorize and hold buyer funds until order validation.

5. Coordinate Tuesday farm procurement and delivery.

6. Handle egg-size shortages through automated price adjustments.

7. Credit buyers automatically when they receive a lower-priced egg size than ordered.

8. Establish a digital wallet for rollover credits.

9. Encourage physical crate swaps to reduce crate-related logistics costs.

10. Maintain efficient delivery economics through a minimum order volume.

---

# **3\. Target Users**

## **3.1 Commercial Buyers**

**Examples:** Bakeries, hotels, supermarkets.

### **Needs**

* Standardized egg sizes, primarily Large and Medium.

* Predictable delivery times.

* Reliable supply.

* Price stability.

* Convenient digital payments.

### **Behavior**

* Tech-literate.

* Prefer card or bank-transfer payments.

* Operate according to weekly production schedules.

* Require reliable supply to avoid production interruptions.

---

## **3.2 Hub Operators**

**Examples:** Neighborhood depot partners.

### **Needs**

* Steep wholesale discounts to create retail margins.

* Reliable bulk supply.

* Local visibility.

* Ability to serve retail customers and "Indomie" joints.

* Fast digital transactions.

### **Behavior**

* Operate physical shops.

* Experience high-volume turnover.

* Prefer digital transactions for platform purchases.

* Serve cash-based end consumers.

---

## **3.3 Platform Administrator**

The Administrator controls the operational and commercial configuration of the platform.

### **Needs**

* Set weekly egg prices.

* View total funds held from buyer orders.

* Manage supply discrepancies.

* Update order sizes when required.

* Coordinate logistics.

* Group deliveries into routes.

* Manage wallet balances.

* Initiate farm payments and dispatch.

---

# **4\. Core Product Workflow**

The primary weekly operating cycle is:

SUNDAY NIGHT  
Admin Sets Weekly Prices  
        ↓  
MONDAY  
Buyers Place Orders & Funds Are Authorized/Held  
        ↓  
MONDAY 11:59 PM  
Ordering Window Closes  
        ↓  
TUESDAY MORNING  
Admin Validates Supply  
        ↓  
Admin Pays Farm  
        ↓  
Truck Is Dispatched  
        ↓  
TUESDAY EVENING  
Eggs Delivered to Hubs/Bakeries  
        ↓  
Empty Crates Swapped  
        ↓  
TUESDAY NIGHT  
Orders Finalized  
        ↓  
Funds Released  
        ↓  
Breakage/Price Differences Credited to Wallet

---

# **5\. Functional Requirements**

## **5.1 Weekly Price Management**

### **Requirement**

The Administrator must be able to configure the weekly selling price for each egg size.

### **Supported Egg Sizes**

* Large

* Medium

* Pullet

### **Requirements**

* Prices must be configurable by the Administrator.

* Prices must be locked once the Monday ordering window opens.

* Buyers must see the applicable prices before placing an order.

* The selected prices must be attached to the order at checkout.

---

# **6\. Monday Ordering Window**

## **6.1 Order Opening**

The platform must open for orders every Monday morning.

The Administrator's configured prices become the active prices for the ordering period.

## **6.2 Order Closing**

The ordering window must close strictly at:

**Monday, 11:59 PM**

The purpose of the cut-off is to provide sufficient time for Tuesday morning farm execution.

## **6.3 Minimum Order**

The minimum order is:

**10 crates per delivery destination.**

Orders below the minimum must not be accepted.

### **Business Rule**

> MOV \= 10 crates per delivery destination.

---

# **7\. Order Creation**

When creating an order, the buyer must:

1. Select the egg size.

2. Enter the number of crates.

3. Select or confirm the delivery destination.

4. Review the order value.

5. Apply available wallet balance.

6. Pay or authorize the remaining amount.

7. Confirm the order.

### **Supported Size Selection**

The buyer must explicitly select one of:

* **Large**

* **Medium**

* **Pullet**

---

# **8\. Payment & Fund Holding**

## **8.1 Payment Authorization**

When a buyer places an order, the platform must integrate with a payment gateway to securely authorize and hold the total order funds.

Funds must not be treated as fully settled until Tuesday validation.

## **8.2 Payment State**

An order should move through payment states such as:

Payment Pending  
      ↓  
Payment Authorized / Funds Held  
      ↓  
Order Validated  
      ↓  
Funds Released

The platform must maintain a record of the amount authorized for every order.

---

# **9\. Digital Wallet**

## **9.1 Wallet Overview**

Every buyer profile must have a closed-loop **In-App Digital Wallet**.

The wallet is used primarily to hold credits generated from order adjustments.

## **9.2 Wallet Inputs**

The wallet can receive automated credits resulting from:

* Egg-size downgrades.

* Delivery breakage equivalents.

## **9.3 Wallet Outputs**

Wallet balances must automatically become a primary payment method during the next Monday ordering cycle.

### **Example**

If a buyer receives a credit of ₦5,000 after Tuesday fulfillment:

Current Wallet Balance: ₦5,000

Next Monday Order:  
Order Total: ₦50,000  
Wallet Credit: ₦5,000  
Remaining Payment: ₦45,000

---

# **10\. Auto-Offset Engine**

## **10.1 Purpose**

The Auto-Offset Engine handles situations where the farm cannot supply the exact egg size ordered.

## **10.2 Supply Shortage**

If a farm experiences a size shortage on Tuesday morning, the Administrator must be able to update the affected order.

## **10.3 Down-Grading Logic**

Example:

Buyer Ordered:  
Large Eggs

Actual Supply:  
Medium Eggs

The system must:

1. Identify the affected order.

2. Change the fulfilled egg size from Large to Medium.

3. Retrieve the applicable prices.

4. Calculate the price difference.

5. Confirm the resulting credit.

6. Add the difference to the buyer's digital wallet.

7. Record the wallet transaction against the order.

### **Example**

Large Price: ₦X  
Medium Price: ₦Y

Price Difference:  
₦X \- ₦Y \= ₦Z

Wallet Credit:  
₦Z

The buyer therefore does not lose the value of the price difference.

---

# **11\. Delivery Breakage**

## **11.1 Requirement**

The platform must account for delivery breakage during order fulfillment.

Where an applicable breakage credit is determined, the corresponding amount must be credited to the buyer's digital wallet.

## **11.2 Wallet Record**

Each wallet credit should be traceable to its originating order.

Example:

Wallet Transaction  
\------------------  
Type: Breakage Credit  
Order: \#HG-000123  
Amount: ₦X  
Date: Tuesday  
Status: Credited

---

# **12\. Crate Management**

## **12.1 First-Time Buyers**

First-time buyers must be charged a **First-Time Crate Fee**.

The fee must be added to the checkout total.

## **12.2 Returning Buyers**

For subsequent orders, the checkout screen must display:

> "Please have \[X\] clean, empty plastic crates ready for physical swap upon delivery."

## **12.3 Physical Crate Swap**

At delivery:

Full Crates Delivered  
        ↕  
Empty Crates Collected

The system should record the expected crate quantity associated with the order.

---

# **13\. Logistics Management**

## **13.1 Tuesday Dispatch**

On Tuesday morning, after supply validation, the Administrator must be able to initiate the logistics process.

The process consists of:

1. Confirming farm supply.

2. Confirming orders.

3. Grouping destinations into delivery routes.

4. Arranging the rented truck.

5. Dispatching the truck.

6. Delivering to Hubs and commercial buyers.

7. Collecting empty crates.

8. Completing delivery records.

---

# **14\. Delivery Destinations**

The platform must support delivery to:

* Commercial buyers.

* Neighborhood Hub Operators.

Each delivery destination must have:

* Buyer/Hub identity.

* Delivery address.

* Order quantity.

* Egg size.

* Expected crate quantity.

* Delivery status.

---

# **15\. Order Status Lifecycle**

Orders should progress through a defined lifecycle:

Draft  
  ↓  
Placed  
  ↓  
Payment Authorized  
  ↓  
Funds Held  
  ↓  
Supply Validated  
  ↓  
Ready for Dispatch  
  ↓  
Dispatched  
  ↓  
Delivered  
  ↓  
Fulfillment Finalized  
  ↓  
Funds Released

Where a supply discrepancy occurs:

Supply Validated  
      ↓  
Size Adjustment Required  
      ↓  
Order Updated  
      ↓  
Price Difference Calculated  
      ↓  
Wallet Credit Created  
      ↓  
Delivered

---

# **16\. Administrator Requirements**

The Administrator dashboard should provide visibility and control over:

### **Pricing**

* Weekly prices.

* Large price.

* Medium price.

* Pullet price.

### **Orders**

* Total orders.

* Total crates ordered.

* Orders by buyer type.

* Orders by egg size.

* Orders requiring adjustment.

### **Payments**

* Total funds authorized.

* Total funds held.

* Total funds released.

* Outstanding payment issues.

### **Logistics**

* Delivery destinations.

* Crates per destination.

* Route groupings.

* Dispatch status.

* Delivery status.

### **Wallet**

* Total wallet liabilities.

* Individual buyer wallet balances.

* Wallet credits.

* Wallet deductions.

* Wallet transaction history.

---

# **17\. Business Rules**

| Rule | Requirement |
| ----- | ----- |
| Minimum Order | 10 crates per delivery destination |
| Ordering Day | Monday |
| Order Cut-off | Monday, 11:59 PM |
| Primary Delivery Day | Tuesday |
| Egg Sizes | Large, Medium, Pullet |
| First-Time Buyer | First-Time Crate Fee applies |
| Returning Buyer | Empty crate swap required |
| Size Downgrade | Price difference credited to wallet |
| Breakage | Applicable credit sent to wallet |
| Wallet Usage | Primary payment method for next Monday order |
| Price Control | Administrator |
| Tuesday Execution | Farm payment \+ truck dispatch |

---

# **18\. Success Metrics**

## **18.1 Minimum Order Volume**

**Target:** 10 crates per delivery destination.

This protects the efficiency of rented vehicle operations.

## **18.2 Fulfillment Rate**

**Target:** At least 95% of orders delivered within the Tuesday evening delivery window.

## **18.3 Breakage Rate**

**Target:** Less than 2%.

## **18.4 Ordering Compliance**

The platform should enforce the Monday ordering deadline so that orders are received before Tuesday farm execution.

---

# **19\. Guardrails**

The platform must enforce the following:

* Orders below 10 crates must not be accepted.

* Monday ordering must close at 11:59 PM.

* Weekly prices must be locked for the active ordering period.

* Buyers must select an egg size before checkout.

* Funds must remain held until the defined fulfillment validation point.

* Size adjustments must create an auditable price-difference calculation.

* Wallet credits must be linked to the originating order.

* Wallet transactions must be recorded.

* First-time buyers must be charged the applicable crate fee.

* Returning buyers must receive the crate-swap reminder.

---

# **20\. MVP Scope**

The initial MVP should include:

### **Buyer**

* Account/profile

* Egg-size selection

* Crate quantity selection

* Order creation

* Checkout

* Payment authorization

* Wallet

* Order history

* Delivery information

### **Administrator**

* Weekly price management

* Order management

* Supply-size adjustment

* Wallet adjustment visibility

* Payment/fund visibility

* Delivery management

* Basic route grouping

* Crate tracking

### **Core Automation**

* Monday ordering window

* 11:59 PM cut-off

* Minimum 10-crate validation

* Payment authorization

* Size downgrade calculation

* Automatic wallet credit

* Wallet rollover to subsequent orders

---

# **21\. Out of Scope for Initial MVP**

The following can be considered for later phases:

* Automated dynamic pricing.

* Advanced demand forecasting.

* AI-powered demand prediction.

* Automated farm allocation.

* Real-time truck GPS tracking.

* Automated multi-farm procurement optimization.

* Credit facilities for buyers.

* Consumer-facing retail marketplace.

* Advanced analytics and forecasting.

---

# **22\. Key User Journey — Commercial Buyer**

Buyer Logs In  
      ↓  
Monday Ordering Window Opens  
      ↓  
Buyer Selects Egg Size  
      ↓  
Buyer Selects Number of Crates  
      ↓  
System Validates Minimum 10 Crates  
      ↓  
Wallet Balance Applied  
      ↓  
Remaining Amount Authorized  
      ↓  
Order Confirmed  
      ↓  
Funds Held  
      ↓  
Tuesday Supply Validation  
      ↓  
Order Fulfilled  
      ↓  
Crates Swapped  
      ↓  
Any Size Difference / Breakage Calculated  
      ↓  
Applicable Credit Added to Wallet  
      ↓  
Funds Released  
      ↓  
Order Completed

---

# **23\. Key User Journey — Hub Operator**

Hub Operator Logs In  
      ↓  
Monday Ordering Window Opens  
      ↓  
Selects Egg Size  
      ↓  
Selects Crate Quantity  
      ↓  
Confirms Delivery Location  
      ↓  
Payment Authorized  
      ↓  
Funds Held  
      ↓  
Tuesday Delivery  
      ↓  
Full Crates Received  
      ↓  
Empty Crates Returned  
      ↓  
Order Finalized  
      ↓  
Applicable Credits Added to Wallet

---

# **24\. Key User Journey — Administrator**

Sunday Night  
      ↓  
Set Weekly Prices  
      ↓  
Monday  
Monitor Incoming Orders  
      ↓  
11:59 PM  
Ordering Window Closes  
      ↓  
Tuesday Morning  
Review Aggregated Demand  
      ↓  
Validate Farm Supply  
      ↓  
Adjust Affected Orders  
      ↓  
Pay Farm  
      ↓  
Group Delivery Routes  
      ↓  
Dispatch Rented Truck  
      ↓  
Tuesday Evening  
Monitor Deliveries  
      ↓  
Confirm Crate Swaps  
      ↓  
Finalize Orders  
      ↓  
Release Funds  
      ↓  
Credit Wallets Where Applicable

---

# **25\. Acceptance Criteria**

The MVP will be considered functionally complete when:

1. An Administrator can set weekly prices.

2. Buyers can place orders only during the Monday ordering window.

3. The system prevents orders below 10 crates per destination.

4. Buyers can select Large, Medium, or Pullet.

5. Buyers can authorize payment through the configured payment gateway.

6. Authorized funds can be held until fulfillment validation.

7. Administrators can modify an order when the requested egg size is unavailable.

8. The system automatically calculates the price difference after a size downgrade.

9. The price difference is credited to the buyer's wallet.

10. Wallet balances can be applied to the next Monday order.

11. First-time buyers are charged the First-Time Crate Fee.

12. Returning buyers receive the physical crate-swap reminder.

13. Administrators can view orders and delivery destinations.

14. Administrators can manage Tuesday dispatch and fulfillment.

15. Applicable breakage credits can be recorded against orders and credited to wallets.

16. Orders can be moved through their complete fulfillment lifecycle.

17. The system maintains an auditable record of payments, adjustments, wallet credits, and fulfillment.

---

# **26\. Product Success Definition**

Hagnos Eggs succeeds when it can reliably operate the following weekly cycle:

**Aggregate demand → Lock weekly prices → Secure buyer funds → Procure from farms → Dispatch efficiently → Deliver on Tuesday → Manage discrepancies → Swap crates → Release funds → Roll credits into the next week's orders.**

