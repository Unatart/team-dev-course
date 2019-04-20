""" @package run_tests
Point of entry for test runner
"""

import unittest

from tests import create_user_unit_tests, login_unit_tests, validator_unit_tests


def main():
    runner = unittest.TextTestRunner()
    runner.run(
        unittest.TestSuite(
            (
                unittest.makeSuite(create_user_unit_tests.CreateUserTests),
                unittest.makeSuite(login_unit_tests.LoginTests),
                unittest.makeSuite(validator_unit_tests.ValidatorTests)
            )
        )
    )


if __name__ == "__main__":
    main()
