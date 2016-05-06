# mblazonryComponents #

Home of mBlazonry's primary custom component source!



## Includes ##

- The skuid ["progress indicator" sample component](http://help.skuidify.com/m/11720/l/451511?data-resolve-url=true&data-manual-id=11720) code from the skuid docs.

- Barry Scnell's old ["popup controller" custom component](https://community.skuidify.com/skuid/topics/popup-controller-component-disable-x-escape-key-and-hook-dialog-events) code from the skuid community forums.

## Setup ##

This section has two parts. You already did the initial setup part by downloading this repo.

First part:


1.  [download](https://nodejs.org/en/download/) and [install](http://blog.teamtreehouse.com/install-node-js-npm-windows) [Node.js](https://nodejs.org/en/) From the console you should now be able to run `npm`.

2.  In the repo directory, run `npm install mblazonrycomponents`

3.  That sets up the app, automatically grabbing all dependencies needed by the project and installing them to a node_modules folder locally.

4.  If you run any of the automation now you'll get an error saying Gulp needs to be installed globally. So from the repo dir run `npm install gulp -g`

5.  Once that's done installing, make sure `npm ls` returns a load of stuff.

6.  Now you're good to go.

Second, there are instructions for Sublime Text 3. These were tested only on Windows 7 64-bit round feb 2016. YMMV

1.  If you don't have it already, [install Package Control](https://packagecontrol.io/installation), the sublime package manager.

2. Now, we go about installing some packages:

    [sublime-gulp](https://github.com/NicoSantangelo/sublime-gulp) (and here's [a guide](https://mijingo.com/blog/run-gulp-from-sublime-text)),
	
	[sublime-jshint](https://github.com/uipoet/sublime-jshint),

    [sublime-jsdocs](https://github.com/spadgos/sublime-jsdocs) (reccommended),

    [GitGutter](https://github.com/jisaacks/GitGutter) (reccommended)

3. With all that installed, you should be able to right-click a file in the FOLDERS tree in Sublime's sidebar [right-click] → Gulp → "List Tasks to Run". That should show the various build options. Run the `default` build and do `Ctrl + ~` on your keyboard to show the console in Sublime, and observe the output.

4. Assuming all went well you should be good to develop mBlazonry's components and use automated builds!
    

## BSD License ##


Copyright (c) 2015-2016, Andréas K.LeF, mBlazonry,
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
   


1. Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
3. Neither the name of the mBlazonry nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL Andréas K.LeF. or mBlazonry BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
