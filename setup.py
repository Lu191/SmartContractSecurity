from setuptools import find_packages
from setuptools import setup

import dapp

setup(name='mmsaSCS',
	version=dapp.__version__,
	description='',
	setup_requires='setuptools',
	packages=[
		'dapp',
	],
	entry_points={
		'console_scripts': [
			'dapp=dapp.main:main',
		],
	},
    zip_safe=False,
	install_requires=['requests'],
)