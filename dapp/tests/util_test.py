import unittest

class TestUtils(unittest.TestCase):
    def test_echo(self):
        self.assertEqual("Hello World!", 'Hello World!')
        self.assertNotEqual("Hello World!", "Bye World!")

