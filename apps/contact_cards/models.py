"""
This file defines the database models
"""

import datetime
from .common import db, Field, auth
from pydal.validators import *


def get_user_email():
    return auth.current_user.get('email') if auth.current_user else None

def get_time():
    return datetime.datetime.utcnow()


db.define_table(
    'contacts',
    Field('user_email', default=get_user_email),
    Field('name', default=''),
    Field('affiliation', default=''),
    Field('description', 'text', default=''),
    Field('image', 'text', default=''),
)

db.commit()
