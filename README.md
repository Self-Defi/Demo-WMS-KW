# Kaitlyn Wolfe — Warehouse Management System (WMS) Demo

This repository demonstrates a **lightweight Warehouse Management System prototype** designed to improve visibility between **Warehouse Operations and Procurement**.

The goal is to eliminate inventory blind spots and create a shared system where all incoming items can be quickly located, tracked, and verified.

This is a **proof-of-concept demo** and not intended to replace enterprise WMS platforms. Instead, it demonstrates a simple and scalable framework for organizing warehouse inventory and processes.

---

# Core Concept

The system focuses on three operational pillars:

1. **Inventory Intake Logging**
2. **Rack Location Tracking**
3. **Cycle Count Verification**

Together these create a process where inventory knowledge lives in the **system**, not in individual employees.

---

# Warehouse Rack System

Warehouse racks follow a simple readable format:

Meaning:

| Example | Meaning |
|------|------|
| 100 | Rack series |
| 01 | Shelf level |
| A/B | Left or right side |

This format makes locations easy to read, scan, and communicate.

---

# Inventory Intake Fields

Each inventory item contains the following fields:

| Field | Description |
|------|-------------|
| Project | Client or design project |
| Job | Internal job number |
| Received Date | Date received into warehouse |
| Warehouse Intake | Item description |
| Location | Rack location |
| Status | Received / Delivered / Hold |
| Notes | Operational notes |
| Damage / Comments | Condition notes |

These fields allow warehouse staff and procurement to track inventory without relying on external spreadsheets.

---

# Cycle Count System

A **daily random cycle count** verifies that physical inventory matches system records.

Typical workflow:

1. Select 10–20 random rack locations
2. Verify quantity and condition
3. Confirm system location matches reality
4. Flag discrepancies

This prevents inventory drift and identifies issues early.

---

# Repository Structure
