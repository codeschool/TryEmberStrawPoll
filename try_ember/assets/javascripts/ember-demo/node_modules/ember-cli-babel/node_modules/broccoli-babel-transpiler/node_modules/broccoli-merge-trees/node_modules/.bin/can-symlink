#!/usr/bin/env node
var canSymlink = require('./');
var chalk = require('chalk');

if (canSymlink()) {
	console.log(chalk.green('Able to create symlinks.'));
} else {
	console.log(chalk.red('Unable to create symlinks! Make sure your shell is running with the appropriate permissions.'));
}