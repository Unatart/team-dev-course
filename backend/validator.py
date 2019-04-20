""" @package validator
User data validator
Attributes:
    MAX_LEN (int): maximum username and password length
    MIN_LEN (int): minimum username and password length
"""

import validate_email


MAX_LEN = 30
MIN_LEN = 1


class Validator:
    """User data validator
    """
    @staticmethod
    def validate_username(username):
        """Validate username
        Check that username has correct length and character set
        Returns:
            True if username is correct
            False otherwise
        """
        if username is None or len(username) < MIN_LEN or len(username) > MAX_LEN:
            return False
        for key in username:
            if not str(key).isalpha() and key not in "_." and not '0' <= key <= '9':
                return False
        return True

    @staticmethod
    def validate_password(password):
        """Validate password
        Check that password has correct length
        Returns:
            True if password is correct
            False otherwise
        """
        return password is not None and MIN_LEN <= len(password) <= MAX_LEN

    @staticmethod
    def validate_email(email):
        """Validate email
        Returns:
            True if email is correct
            False otherwise
        """
        return validate_email.validate_email(email)
