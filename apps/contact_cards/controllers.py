from py4web import action, request, abort, redirect, URL
from yatl.helpers import A
from .common import db, session, T, cache, auth, logger, authenticated, unauthenticated, flash
from .models import get_user_email

@action('index')
@action.uses('index.html', db, auth.user)
def index():
    return dict(
        get_contacts_url = URL('get_contacts'),
        add_contact_url = URL('add_contact'),
        del_contact_url = URL('del_contact'),
        update_contact_url = URL('update_contact'),
    )

@action('get_contacts')
@action.uses(db, auth.user)
def get_contacts():
    # Ensures contacts are ordered by creation with the most recent first
    contacts = db(db.contacts.user_email == get_user_email()).select(orderby=db.contacts.id).as_list()
    return dict(contacts=contacts)

@action('add_contact', method="POST")
@action.uses(db, auth.user, session)
def add_contact():
    id = db.contacts.insert(
        name=request.json.get('name'),
        affiliation=request.json.get('affiliation'),
        description=request.json.get('description'),
        image=request.json.get('image')
    )
    return dict(id=id)

@action('del_contact', method="POST")
@action.uses(db, auth.user, session)
def del_contact():
    id = request.json.get('id')
    db(db.contacts.id == id).delete()
    return "ok"
