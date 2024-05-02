"use strict";

// Define the main Vue application object
let app = {};

// Define the data and methods for the Vue instance
app.data = {
    data() {
        return {
            contacts: [],

            // Temporary storage for a new contact before it is added
            new_contact: {
                name: "",
                affiliation: "",
                description: "",
                image: "",
            },
        };
    },
    methods: {
        add_contact() {
            let self = this;
            axios.post(add_contact_url, {
                name: self.new_contact.name,
                affiliation: self.new_contact.affiliation,
                description: self.new_contact.description,
                image: self.new_contact.image,
            }).then(function (response) {
                console.log("Got the id: " + response.data.id);
                self.contacts.unshift({
                    id: response.data.id,
                    name: self.new_contact.name,
                    affiliation: self.new_contact.affiliation,
                    description: self.new_contact.description,
                    image: self.new_contact.image,
                });
                // Reset the new_contact object after adding to the list
                self.resetNewContact();
            }).catch(function (error) {
                console.error('Error adding contact:', error);
            });
        },
        resetNewContact() {
            this.new_contact = {
                name: "",
                affiliation: "",
                description: "",
                image: "",
            };
        }
    }
};

// Initialize the Vue application
app.vue = Vue.createApp(app.data).mount("#app");

// Load initial data from the server
app.load_data = function () {
    axios.get(get_contacts_url).then(function (response) {
        console.log("Data loaded with status:", response.status);
        app.vue.contacts = response.data.contacts;
    }).catch(function (error) {
        console.error('Error loading contacts:', error);
    });
};

// Execute the data loading function
app.load_data();
