# Universal Salesforce Search

A mini Salesforce project built with **Lightning Web Components (LWC)**, **Apex**, and **SOSL** that lets users search a keyword across multiple objects (Account, Contact, Opportunity) from a single search bar — similar to Salesforce's own global search.

Built as a hands-on learning project to practice SOSL, imperative Apex calls, and LWC data binding.

---

## What This Project Demonstrates

- Writing multi-object search queries using **SOSL** (`FIND ... RETURNING`)
- Wrapping `List<List<SObject>>` results into a clean, LWC-friendly structure
- Making **imperative Apex calls** from LWC (not `@wire`)
- Handling loading states, empty states, and error states in LWC
- Basic Apex test coverage for SOSL, including `Test.setFixedSearchResults()`

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI | Lightning Web Components (LWC) |
| Backend | Apex (`@AuraEnabled`) |
| Search Engine | SOSL |
| Styling | SLDS (Salesforce Lightning Design System) |

---

## Project Structure

```
force-app/main/default/
├── classes/
│   ├── UniversalSearchController.cls
│   ├── UniversalSearchController.cls-meta.xml
│   ├── UniversalSearchControllerTest.cls
│   └── UniversalSearchControllerTest.cls-meta.xml
└── lwc/
    └── universalSearch/
        ├── universalSearch.html
        ├── universalSearch.js
        └── universalSearch.js-meta.xml
```

---

## Features

- Single search bar that queries **Account, Contact, and Opportunity** in one call
- Results grouped by object with counts, e.g. `Accounts (3)`
- Clickable record links that open the record in a new tab
- Loading spinner while the search is in progress
- "No records found" state when there are no matches
- Client-side validation — SOSL isn't called for empty or 1-character input
- Clear button to reset the search
- Search-on-Enter support

---

## How It Works (High Level)

1. User types a keyword and clicks **Search** (or presses Enter).
2. LWC calls `UniversalSearchController.searchRecords(searchTerm)` imperatively.
3. Apex runs a single SOSL query:
   ```sql
   FIND :searchKey IN NAME FIELDS
   RETURNING
       Account(Id, Name, Industry),
       Contact(Id, Name, Email, Account.Name),
       Opportunity(Id, Name, StageName, Amount)
   ```
4. The raw `List<List<SObject>>` result is mapped into a `SearchWrapper` class with named properties (`accounts`, `contacts`, `opportunities`) so the LWC doesn't have to deal with positional indexes.
5. LWC renders results grouped by object, or shows "No records found" / an error message as appropriate.

---

## Why SOSL Instead of SOQL?

SOQL queries one object at a time and needs to know exactly which object/field to filter on. SOSL searches across **multiple objects and fields in a single query**, which makes it the right tool for global/free-text search features where you don't know in advance which object will contain the match.

Use SOQL when you need precise filtering, relationships, aggregates, or you already know the target object. Use SOSL when the goal is "search everywhere for this keyword."

---

## Setup / Deployment

1. Clone this repo.
2. Deploy to a Salesforce scratch org or sandbox using SFDX/CLI:
   ```bash
   sf project deploy start -d force-app
   ```
3. Assign the `UniversalSearch` component to an App Page, Home Page, or Record Page via the Lightning App Builder.
4. Ensure you have Account, Contact, and Opportunity records with searchable names for testing.

> **Note:** Newly created/updated records can take a few seconds to appear in SOSL search results due to Salesforce's search index refresh delay.

---

## Running Tests

```bash
sf apex run test --class-names UniversalSearchControllerTest --result-format human
```

The test class covers:
- A happy-path search using `Test.setFixedSearchResults()` (required because SOSL isn't indexed synchronously in test context)
- Blank search term input
- Null search term input

---

## Known Limitations (By Design — Kept Simple on Purpose)

- Searches only `Account`, `Contact`, and `Opportunity` Name fields — not configurable via UI (yet)
- No pagination — returns whatever SOSL returns by default
- No "recent searches" persistence
- No sharing/field-level security customization beyond `with sharing` on the controller

These are intentionally left out to keep the project achievable as a focused 2-hour learning exercise. See **Possible Enhancements** below for where to take it next.

---

## Possible Enhancements

- Add more objects (Lead, Case, Custom Objects) to the `RETURNING` clause
- Make searchable objects configurable via an `@api` property
- Add pagination / `LIMIT` per object
- Persist recent searches using Custom Settings or Platform Cache
- Add debounce on keystroke for a live-search experience

---

## Author's Notes

Built as a practice project to strengthen SOSL, Apex-to-LWC data contracts, and LWC UI state handling (loading/empty/error). Feedback and PRs welcome.

<img width="617" height="532" alt="image" src="https://github.com/user-attachments/assets/ea0100f0-8457-49df-8d13-029e01b5c6fb" />


