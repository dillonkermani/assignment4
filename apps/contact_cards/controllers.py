"""
This file defines actions, i.e. functions the URLs are mapped into
The @action(path) decorator exposed the function at URL:

    http://127.0.0.1:8000/{app_name}/{path}

If app_name == '_default' then simply

    http://127.0.0.1:8000/{path}

If path == 'index' it can be omitted:

    http://127.0.0.1:8000/

The path follows the bottlepy syntax.

@action.uses('generic.html')  indicates that the action uses the generic.html template
@action.uses(session)         indicates that the action uses the session
@action.uses(db)              indicates that the action uses the db
@action.uses(T)               indicates that the action uses the i18n & pluralization
@action.uses(auth.user)       indicates that the action requires a logged in user
@action.uses(auth)            indicates that the action requires the auth object

session, db, T, auth, and tempates are examples of Fixtures.
Warning: Fixtures MUST be declared with @action.uses({fixtures}) else your app will result in undefined behavior
"""

from py4web import action, request, abort, redirect, URL
from yatl.helpers import A
from .common import db, session, T, cache, auth, logger, authenticated, unauthenticated, flash
from .models import get_user_email


@action('index')
@action.uses('index.html', db, auth.user)
def index():
    return dict(
        get_contacts_url = URL('get_contact'),
        add_contact_url = URL('add_contact'),
        del_contact_url = URL('del_contact'),
        update_contact_url = URL('update_contact'),
    )

@action('get_contacts')
@action.uses(db, auth.user)
def get_contacts():
    contacts = db(db.contacts.user_email == get_user_email()).select(~db.contacts.id).as_list()
    print("Loaded contacts: ", contacts)
    return dict(contacts=contacts)

@action('add_contact', method="POST")
@action.uses(db, auth.user, session)
def add_contact():
    contact = request.json.get('contact')
    id = db.contacts.insert(contact_name=contact['name'], contact_affiliation=contact['affiliation'], contact_description=contact['description'], contact_image=contact['image'])
    return dict(id=id)



