#!/usr/bin/python3
import sys 
import configparser

import dapp

if sys.version_info[0] < 3:
	print ('python2 not supported, please use python3')
	sys.exit (0)

try:
	import requests
except:
	print ('please install requests library (pip3 install requests)')
	sys.exit (0)

def main():
	# Parse configuration
	config = configparser.ConfigParser()

if __name__ == "__main__":
	main()