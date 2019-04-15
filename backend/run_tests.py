import unittest

import tests.create_user_unit_tests
import tests.login_unit_tests
import tests.validator_unit_tests


if __name__ == "__main__":
    runner = unittest.TextTestRunner()
    runner.run(
        unittest.TestSuite(
            (
                unittest.makeSuite(tests.create_user_unit_tests.CreateUserTests),
                unittest.makeSuite(tests.login_unit_tests.LoginTests),
                unittest.makeSuite(tests.validator_unit_tests.ValidatorTests)
            )
        )
    )
