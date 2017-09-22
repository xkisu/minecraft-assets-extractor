# Minecraft Assets Extractor

This is a NodeJS script to convert the hashed asset files into human-readable files. 

When the script is ran it will detect the Minecraft versions you have installed and ask you to select the version you want to extract assets for. After selecting the version it will read the index JSON file for the version you selected and copy all the hashed files into human-readable files with the correct extensions in the script directory in a folder called "output" .

Currently the script is only confirmed to work on Windows, however it can easily be ported to Mac and Linux by modifying the "dotminecraft" variable if someone wishes to do so and test it.

Pull requests and suggestions for improvements are welcome! 

## Installation

Clone the reposity:
```
git clone https://github.com/xkisu/minecraft-assets-extractor.git ; cd minecraft-assets-extractor
```

Install the modules:
```
npm install
```

Run the script:
```
node .
```
