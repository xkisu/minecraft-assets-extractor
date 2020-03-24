var fs = require('fs-extra')
var path = require('path');

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var rimraf = require('rimraf');
var mkdirp = require('mkdirp');

var dotminecraft;
// https://minecraft.gamepedia.com/.minecraft#Locating_.minecraft
if (process.platform == 'win32') {
    dotminecraft = path.join(process.env.APPDATA, '/.minecraft'); // windows
} else if (process.platform == 'darwin') {
    dotminecraft = path.join(process.env.HOME, '/Library/Application Support/minecraft'); // mac
} else {
    dotminecraft = path.join(process.env.HOME, '/.minecraft'); // linux
}

if (fs.existsSync(dotminecraft)) {

    var soundindexes = path.join(dotminecraft, 'assets/indexes');

    if (fs.existsSync(soundindexes)) {
        console.error(`Loading sound indexes...`);
        var soundindexfiles = []
        let i = 0;
        fs.readdirSync(soundindexes).forEach(file => {
            console.log(`[${i}] ${file}`);
            soundindexfiles.push(file);
            ++i;
        })

        rl.question(`Please select a version (0-${i-1}) \n> `, (answer) => {
            var selectedindex = parseInt(answer);

            if (selectedindex != undefined && selectedindex < soundindexfiles.length) {
                console.log(`You selected ${soundindexfiles[selectedindex]}, parsing...`);

                var soundindexpath = path.join(soundindexes, soundindexfiles[selectedindex]);

                var json = JSON.parse(require('fs').readFileSync(soundindexpath, 'utf8'));

                var count = 0;
                for (var key in json.objects)
                    if (json.objects.hasOwnProperty(key))
                        count++;

                console.log(`Index file contains ${count} indexes`);

                var outputdir = path.join(__dirname, 'output');


                if (fs.existsSync(outputdir)) {
                    console.log(`Removing exists outfile folder ${outputdir}`);
                    rimraf.sync(outputdir);
                }

                try {
                    console.log(`Creating outfile folder ${outputdir}`);
                    fs.mkdirSync(outputdir)
                } catch (err) {
                    console.error(`Error creating outfile folder ${outputdir}`);
                    if (err.code !== 'EEXIST') throw err
                }

                var objectsfolder = path.join(dotminecraft, 'assets/objects');

                for (var key in json.objects) {
                    if (json.objects.hasOwnProperty(key)) {
                        console.log(`Parsing ${key}`);
                        var hash = json.objects[key].hash;
                        console.log(`|-> Hash ${hash}`);

                        var hashprefix = hash.substring(0, 2); // first 2 characters of hash are the folder the file is in
                        console.log(`|-> Folder ${hashprefix}`);

                        var objectpath = path.join(objectsfolder, hashprefix, hash);
                        console.log(`|-> Path ${objectpath}`);

                        var objectoutputfolder = path.join(outputdir, path.dirname(key));
                        var objectoutputpath = path.join(outputdir, key);

                        if (fs.existsSync(objectpath)) {
                            if (!fs.existsSync(objectoutputfolder)) {
                                mkdirp.sync(objectoutputfolder);
                            }
                            fs.copySync(objectpath, objectoutputpath);

                            console.log(`└-> Output ${objectoutputpath}\n\n`);
                        } else {
                            console.error('Cannot find object file!');
                            process.exit(1);
                        }

                    }
                }

                console.log('Completed!');

            } else {
                console.error('Invalid selection!');
                rl.close();
            }
        });

    } else {
        console.error(`${soundindexes} does not exist!`);
    }
} else {
    console.error(`${dotminecraft} does not exist!`);
}
