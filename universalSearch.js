import { LightningElement,track } from 'lwc';
import searchRecords from '@salesforce/apex/UniversalSearchController.searchRecords';

export default class UniversalSearch extends LightningElement {
    searchTerm = '';
    @track accounts = [];
    @track contacts = [];
    @track opportunities = [];
    isLoading = false;
    errorMessage = '';
    hasSearched = false;

    handleSearchTermChange(event) {
        this.searchTerm = event.target.value;
    }

    handleKeyUp(event) {
        if (event.keyCode === 13) {
            this.handleSearch();
        }
    }

    handleSearch() {
        this.errorMessage = '';

        if (!this.searchTerm || this.searchTerm.trim().length < 2) {
            this.errorMessage = 'Please enter at least 2 characters to search.';
            return;
        }
""
        this.isLoading = true;
        this.hasSearched = false;

        searchRecords({ searchTerm: this.searchTerm.trim() })
            .then((result) => {
                this.accounts = (result.accounts || []).map(a => ({
                    ...a,
                    recordUrl: '/' + a.Id
                }));
                this.contacts = (result.contacts || []).map(c => ({
                    ...c,
                    recordUrl: '/' + c.Id,
                    accountName: (c.Account && c.Account.Name) ? c.Account.Name : '—'

                }));
                this.opportunities = (result.opportunities || []).map(o => ({
                    ...o,
                    recordUrl: '/' + o.Id
                }));
                this.hasSearched = true;
                this.isLoading = false;

            })
            .catch((error) => {
                this.errorMessage = 'Search failed: ' + 
                    (error.body ? error.body.message : error.message);
                this.accounts = [];
                this.contacts = [];
                this.opportunities = [];
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    handleClear() {
        this.searchTerm = '';
        this.accounts = [];
        this.contacts = [];
        this.opportunities = [];
        this.errorMessage = '';
        this.hasSearched = false;
    }

    get hasAccounts() {
        return this.accounts.length > 0;
    }
    get hasContacts() {
        return this.contacts.length > 0;
    }
    get hasOpportunities() {
        return this.opportunities.length > 0;
    }
    get hasResults() {
        return this.hasAccounts || this.hasContacts || this.hasOpportunities;
    }
    get accountCount() {
        return this.accounts.length;
    }
    get contactCount() {
        return this.contacts.length;
    }
    get oppCount() {
        return this.opportunities.length;
    }
}
