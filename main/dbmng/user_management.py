from main import db, models


def get_user_by_email(email):
    """
    Returns user model based on input email, or None if email doesn't exist
    :param email: email address
    :return: models.User object
    """
    user = models.User.query.filter_by(email=email).first()
    return user


def get_user(id):
    """
    Returns user based on id of user. Mostly only for login manager module to use.
    :param id: integer id value
    :return: models.User object
    """
    return models.User.query.get(int(id))


def put_user(user_data):
    """
    Attempts to create and return a new user. If a user with current email already exists, that user is returned

    ONLY for use when creating new users. Use post_user to update user information

    :param user_data: dict of user data
    :return: models.User object
    """
    existing_user = get_user_by_email(user_data['email'])
    if existing_user is not None:
        return existing_user

    user = models.User()
    for key, value in user_data.iteritems():
        if hasattr(user, key):
            setattr(user, key, value)

    db.session.add(user)
    db.session.commit()
    return user


def post_user(user_data):
    """
    Attempts to update the information for an existing user. If a user by current email doesn't exist, a new user
    is created and returned by calling the put_user method.

    :param user_data: dict of user data
    :return: models.User object
    """
    existing_user = get_user_by_email(user_data['email'])
    if existing_user is None:
        return put_user(user_data)

    for key, value in user_data.iteritems():
        if hasattr(existing_user, key):
            setattr(existing_user, key, value)

    db.session.add(existing_user)
    db.session.commit()
    return existing_user
