from main import db, models


def get_user_by_email(email):
    """
    Returns user model based on input email, or None if email doesn't exist
    :param email: email address
    :return: models.User object
    """
    return models.User.query.filter_by(email=email).first()


def get_user(id):
    """
    Returns user based on id of user. Mostly only for login manager module to use.
    :param id: integer id value
    :return: models.User object
    """
    return models.User.query.get(int(id))


def activate_user(user, user_data):
    """
    Activate_user is called to update the passed user with the properties in user_data. Then the boolean property of
    user.is_activated is set to True. I'm hoping to god you call this function correctly. User_data has to be the data
    collected from google, and if you pass anything else, a user gets activated without sufficient data. Beware.

    :param user: user model
    :param user_data: dictionary of data collected from google OAUTH
    :return: None
    """
    for key, value in user_data.iteritems():
        if hasattr(user, key):
            setattr(user, key, value)

    user.is_activated = True

    db.session.add(user)
    db.session.commit()


def put_inactive_user(email):
    """
    Creates and returns an inactive user. Useful when teachers register users.

    :param email: email address string
    :return: inactive user
    """
    user = models.User()
    user.email = email
    user.is_activated = False

    db.session.add(user)
    db.session.commit()

    return user


def put_active_user(user_data):
    """
    Attempts to create and return a new user. If a user with current email already exists, that user is either activated
    or returned depending on

    ONLY for use when creating new users. Use post_user to update user information

    :param user_data: dict of user data
    :return: models.User object
    """
    existing_user = get_user_by_email(user_data['email'])
    if existing_user is not None:
        if not existing_user.is_activated:
            activate_user(existing_user, user_data)
        return existing_user

    user = models.User()
    for key, value in user_data.iteritems():
        if hasattr(user, key):
            setattr(user, key, value)

    user.is_activated = True

    db.session.add(user)
    db.session.commit()
    return user


def post_user(user_data):
    """
    Attempts to update the information for an existing user. If a user by current email doesn't exist, a new user
    is created and returned by calling the put_active_user method. If the user is inactive, None is returned.

    :param user_data: dict of user data
    :return: models.User object or None if user is not activated
    """
    existing_user = get_user_by_email(user_data['email'])
    if existing_user is None:
        return put_active_user(user_data)

    if not existing_user.is_activated:
        return None

    for key, value in user_data.iteritems():
        if hasattr(existing_user, key):
            setattr(existing_user, key, value)

    db.session.add(existing_user)
    db.session.commit()
    return existing_user
