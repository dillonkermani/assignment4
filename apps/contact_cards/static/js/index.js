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

            uploading: false,
            uploaded: false,
            selection_done: false,
            upload_file: "",
            file: null,

        };
    },
    methods: {
        find_contact_idx: function(contact) {
            // Finds the index of an item in the list.
            for (let i = 0; i < this.contacts.length; i++) {
                if (this.contacts[i] === contact) {
                    return i;
                }
            }
            return null;
        },
        add_contact() {
            let self = this;
            axios.post(add_contact_url, {
                name: self.new_contact.name,
                affiliation: self.new_contact.affiliation,
                description: self.new_contact.description,
                image: self.new_contact.image,
            }).then(function (response) {
                console.log("Got the id: " + response.data.id);
                self.contacts.push({
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
        },
        delete_contact: function(contact) {
            let self = this;
            let idx = self.find_contact_idx(contact); // Find the index of the contact by name
            if (idx === null) {
                console.log("Contact not found: " + name);
                return;
            }
            let contact_id = self.contacts[idx].id; // Get the contact's id
            axios.post(del_contact_url, {
                id: contact_id, // Use the contact's id here
            }).then(function (r) {
                self.contacts.splice(idx, 1); // Removes the contact from sight.
                console.log("Deleted contact " + name);
                console.log("Updated contacts: " + self.contacts);
            });
        },
        triggerFileInput() {
            this.$refs.fileInput.click(); // Accesses the file input using the ref attribute and triggers its click event
          },
        handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            // Creates a URL for the selected file
            this.new_contact.image = URL.createObjectURL(file);
        }
        },
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
