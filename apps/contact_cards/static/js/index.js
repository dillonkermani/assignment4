"use strict";

// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};


app.data = {    
    data: function() {
        return {
            contacts: [],

            new_contact: {
                name: "",
                affiliation: "",
                description: "",
                image: "",
            }


        };
    },
    methods: {
        add_contact: function() {
            let self = this; 
            axios.post(add_contact_url, {
                contact: self.new_contact,
            }).then(function (r) {
                // This is time 2, much later, when the server answer comes back. 
                console.log("Got the id: " + r.data.id);
                self.contacts.unshift({
                    id: r.data.id,
                    contact: self.new_contact,
                });
                self.new_contact = {
                    name: "",
                    affiliation: "",
                    description: "",
                    image: "",
                };
            });
        },
    }
};

app.vue = Vue.createApp(app.data).mount("#app");

app.load_data = function () {
    axios.get(get_contacts_url).then(function (r) {
        console.log(r.status);
        app.vue.contacts = r.data.contacts;
    });
}

app.load_data();

