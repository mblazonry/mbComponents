# mblazonryComponents #

Home of mBlazonry's primary custom component source!



# Includes: #

- The skuid ["progress indicator" sample component](http://help.skuidify.com/m/11720/l/451511?data-resolve-url=true&data-manual-id=11720) code from the skuid docs.

- Barry Schnell's old ["popup controller" custom component](https://community.skuidify.com/skuid/topics/popup-controller-component-disable-x-escape-key-and-hook-dialog-events) code from the skuid community forums.

## Dev. Env. Prerequisites ##

You should download this repo using a Git client that has git SubModule support.

Try [SmartGit](https://www.syntevo.com/smartgit/download) (for Windows/Linux/Mac).

	Unsupported as of 07/02/2017:
		GitHub Desktop
		GitKraken

Clone the repo from the current address in your browser bar.
![Clone](http://i.imgur.com/tdZHyKL.png)

Be sure to select the "Include Submodules" option when cloning. This will make your life easier by fetching all submodules for you.
![SubModules](http://i.imgur.com/exD9aOz.png)

## Dev. Env. Setup ##

This section has two parts.

1.  I'll assume your working directory for this repo is named `mbComponents`. You should now open a command-line window/terminal at that folder!
	
	Windows: by shift-right-clicking on empty space in a folder and clicking *Open command window here*.
	Mac: [instructions here](https://stackoverflow.com/questions/420456/open-terminal-here-in-mac-os-finder).

2.  Install [Node.js](https://nodejs.org/en/) globally on your system. ([all downloads](https://nodejs.org/en/download/), and [Windows instructions](http://blog.teamtreehouse.com/install-node-js-npm-windows)).

3.  From your console, be sure you can run `npm`. It should display the help, and version number of npm.

4.  *From the repo dir*, run `npm install`. This sets up the app, grabbing all dependencies needed by the project and installing them to a local *node_modules* folder.

5.  If you run any of the automation now you'll get an error saying Gulp needs to be installed globally. So from the repo dir run `npm install gulp -g`

6.  Once finished, make sure `npm ls` displays the full list of installed modules.

### Using the custom Deploy Script ###

7.  Running the `gulp` command in the console set at the components' directory will run the default task of listing all available gulp tasks.

8.  Create a `.env` file in your working directory with the following two lines:

	**(case-sensitive)**
	`mB_USERNAME="username@org.com"`
	`mB_PASSWORD="passwordAndSecurityTokenConcatenated"`

	You will eventually need to create additional entries for each org you wish to deploy component packages to.

9. Make sure you can connect to the org with your credentials.

10. To deploy, run `gulp deploy` to automatically build and create the static resource and upload it to SF using jsforce!

11. You should now be good to go. 

### Sublime Text 3: Tips ###

1.  If you don't have it already, [install Package Control](https://packagecontrol.io/installation), the sublime package manager.

2. Now, we go about installing some packages:
	
	reccommended:
    [GitGutter](https://github.com/jisaacks/GitGutter)
    
    optional:
    [sublime-jsdocs](https://github.com/spadgos/sublime-jsdocs)
	[sublime-jshint](https://github.com/uipoet/sublime-jshint)
    [sublime-gulp](https://github.com/NicoSantangelo/sublime-gulp) (and here's [a guide](https://mijingo.com/blog/run-gulp-from-sublime-text))

3. [Optional] With all that installed, you should be able to right-click a file in the FOLDERS tree in Sublime's sidebar [right-click] → Gulp → "List Tasks to Run". That should show the various build options. Run the `default` build and do `Ctrl + ~` on your keyboard to show the console in Sublime, and observe the output.

4. Assuming all went well you should be good to develop mBlazonry's components and use interactive builds!

## THINGS WE DEPRECATED ##
<details>

### <summary>MavensMate [plug-in for editors](https://github.com/joeferraro/MavensMate#active-plugins)</summary> ###

Choose between using either editor plugins or the standalone mavensmate-app further [below](https://github.com/aklef/mBlazonryComponents#multiplatform-mavensmate-app-standalone).

(These are instructions for the Sublime Text 3 mavensmate plugin. These were tested only on Windows 7 64-bit round June 2016. YMMV)

1. To deploy, create a mavensmate project using the existing source in your working directory. 

2. Make sure you can connect to the org with your credentials.

3. And set it up like so:
![Mavensmate Project Settings](https://docs.google.com/drawings/d/13dryEkE4vxSCofTEtOnOmkr0-O4vMv7EawwpWDpU07I/pub?w=952&h=537) 

</details>

### <summary>[MavensMate-app](https://github.com/joeferraro/MavensMate-app) (Multiplatform & standalone)</summary> ###

If running mavensmate v7 or higher, you will need to have this app installed anyways. The mavensmate-app is an Electron-based tool that essentially runs in a webview on any platform and forms a coherent backbone to the few extension of mm for editors.

You can get it from [here](https://github.com/joeferraro/mavensmate-app/releases). Install it, and please make sure it runs.

The UI is essentially the same as for the mm editor plugins so you can follow the procedures listed above or elsewhere.


## BSD License ##

Copyright (c) 2015-2017, Andréas K.LeF, mBlazonry,
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
   
1. Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
3. Neither the name of the mBlazonry nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.

IN NO EVENT SHALL Andréas K.LeF. or mBlazonry BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
