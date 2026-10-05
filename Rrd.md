# Property Management Platform

## 1. Why We Need This

We need a centralized platform to manage the houses and rental resources we currently have.

Right now, information such as tenant status, check-in/check-out records, rental contracts, and payment status can easily become fragmented across different documents, messages, or spreadsheets.

As the number of properties, rooms, and tenants increases, it becomes harder to quickly understand:

- Who is currently staying in each property or room
- Who has already checked in or checked out
- When a rental contract starts and expires
- Whether the tenant has already paid the rent
- Which rooms or properties are currently available
- The overall status of each property

The goal is to provide one dashboard where the team can quickly understand and manage all property-related information.

The platform should be web-based and responsive so users can access it from:

- Mobile phones
- Tablets
- Laptops / desktops

---

## 2. What Is This About

This project is a **Property Management Dashboard** used to manage our houses, rooms, tenants, contracts, and rental payments.

The platform should allow users to add and manage different resources related to each property.

### Property / Resource Management

Users should be able to:

- Add a new property
- Add rooms or other rentable resources under a property
- View the current availability of each resource
- Edit property and resource information
- See who is currently assigned to a room or property

Example:

```text
Property A
│
├── Room 101
│   └── Tenant: John
│       └── Status: Checked In
│
├── Room 102
│   └── Available
│
└── Room 103
    └── Tenant: Alex
        └── Status: Checking Out
```

### Tenant Management

For each tenant, the system should maintain information such as:

- Name
- Contact information
- Assigned property / room
- Check-in date
- Expected check-out date
- Current status
- Rental payment status

Possible tenant statuses:

```text
Upcoming
   ↓
Checked In
   ↓
Checked Out
```

### Check-In / Check-Out Management

The system should allow users to record when someone:

- Plans to move in
- Checks in
- Plans to move out
- Checks out

The dashboard should clearly show the current occupancy status of every property or room.

### Contract Management

Each tenant should be able to have a rental contract associated with their stay.

The system should manage:

- Contract start date
- Contract end date
- Monthly rent
- Security deposit
- Contract document
- Contract status

Example:

```text
Contract Status

Active
Expiring Soon
Expired
Terminated
```

The system should also highlight contracts that are approaching their expiration date.

### Rental Payment Management

The system should track whether rent has been paid.

For every rental period, the user should be able to see:

```text
Paid
Unpaid
Overdue
Partial Payment
```

The dashboard should make it easy to identify tenants with outstanding rent.

Example:

```text
Tenant       Room      Rent       Status
--------------------------------------------
John         101       $20,000    Paid
Alex         103       $22,000    Unpaid
Kevin        201       $18,000    Overdue
```

### Dashboard

The main dashboard should provide a quick overview of the entire property system.

For example:

```text
PROPERTY DASHBOARD

Total Properties       5
Total Rooms             32
Occupied Rooms          24
Available Rooms          8

Current Tenants         24
Upcoming Check-ins       3
Upcoming Check-outs      2

Unpaid Rent              4
Contracts Expiring       3
```

Users should be able to click these numbers to see the related tenants, properties, or contracts.

---

## 3. What Problem We Want to Solve

### Problem 1 — Property Information Is Fragmented

Property, tenant, payment, and contract information may currently exist in different spreadsheets, files, or communication channels.

This makes it difficult to understand the complete status of a property.

The platform should become the **single source of truth** for property management.

---

### Problem 2 — Difficult to Track Who Is Staying Where

Without a centralized system, it can be difficult to quickly answer:

> Who is currently staying in this room?

or:

> Which rooms are available?

The platform should provide a clear view of occupancy and availability.

---

### Problem 3 — Check-In and Check-Out Are Difficult to Track

The team needs visibility into upcoming tenant movements.

The system should make it easy to identify:

- Who is checking in soon
- Who is currently staying
- Who is checking out soon
- Which rooms will become available

---

### Problem 4 — Contract Expiration Can Be Missed

Rental contracts have specific start and end dates.

Without proper tracking, the team may forget that a contract is about to expire.

The platform should clearly identify:

```text
Contract Expiring Soon
Contract Expired
Contract Active
```

This allows the team to follow up with tenants before the contract expires.

---

### Problem 5 — Rental Payments Are Difficult to Track

The team needs to quickly know:

> Has this tenant paid the rent?

The system should track rental payments for every tenant and clearly show:

- Paid
- Unpaid
- Overdue
- Partial payment

This makes outstanding payments easier to identify and follow up on.

---

### Overall Goal

The platform should allow the team to understand the entire property operation from one dashboard:

```text
Property
   │
   ├── Resource / Room
   │
   ├── Tenant
   │      │
   │      ├── Check-in / Check-out
   │      ├── Contract
   │      └── Rent Payment
   │
   └── Availability
```

The end goal is to make property management **centralized, clear, easy to track, and accessible from any device**.
