#! /usr/bin/env node

'use strict';

const program = require('commander');
const clone   = require('git-clone');
const fs      = require('fs');
const rimraf  = require('rimraf');
const npm     = require("npm");

program
    .version('0.1.0')
    .description('Command line interface fro ms-crud');

program
    .command('create [location]')
    .description('Create a new project')
    .option('-n, --name [name]', 'The name of the project. This value will be used as name of the destination folder')
    .action((location, options) => {
        // set default location value
        location = location || '.';

        // trim last character only if it is equal to /
        if(location.substr(location.length - 1) === '/' || location.substr(location.length - 1) === '\\') {
            location = location.slice(0, -1);
        }

        let name = options.name || 'ms-crud-instance',
            path = location + '/' + name,
            repo = 'https://github.com/3xl/ms-crud.git';        

        if(fs.existsSync(path)) {
            console.log('Folder already exists');

            return false;
        } else {
            console.log('Creating "%s" folder in "%s"...', name, path);

            // crate folder
            fs.mkdirSync(path);

            // clone ms-crud repository
            console.log('Cloning project from %s repository...', repo);

            clone(repo, path, {}, () => {
                // remove .git files and folders
                rimraf.sync(path + '/.git');
                rimraf.sync(path + '/.gitignore');
                rimraf.sync(path + '/app/models/.gitignore');
                
                console.log('Removed all .git files and folders');
                
                // run npm install in the project directory
                npm.load(function(err) {                  
                    // install module ffi
                    npm.commands.install([path], function(er, data) {
                        console.log('Project created correctly.\nRename the .env.example file in .env and edit the each variable according to your environment.');
                    });
                });
            });

        }
        
    });

program.parse(process.argv);
