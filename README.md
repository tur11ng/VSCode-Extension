<!--20221110-->
<span id="jump-begin"/> <h1 align="center"> Action buttons customizer </h1>

<p align="center">
   This plugin can add custom buttons to the toolbar in the upper right corner of the interface. <br/>
   The plugin itself does not provide substantial functionality, but provides a way to set up buttons for arbitrary commands. <br/>
   First of all, it's not perfect at present, see <a href="#jump-en">end of article</a> for details.
</p>


## Screenshot

<span id="jump-pic"/> [![Screenshot](https://liangruliu.github.io/images/vscodeExt/CT_screenshot.png)](https://liangruliu.github.io/images/vscodeExt/CT_screenshot.png)


## Preface & Introduction

+ For those frequently used functions, for easier use, you can bind shortcut keys to them, but there is actually another way: add buttons to the toolbar.
+ In the past, I used a plugin called [Shortcut Menu Bar](https://marketplace.visualstudio.com/items?itemName=jerrygoyal.shortcut-menu-bar) to add buttons. However, it doesn't support customizing icons, which is a problem for me, who has high requirements for aesthetics.
+ Now I've made my own plugin, which can not only customizes the icon, but also supports showing the button based on the filename, so it can be used as a supplement to the Code Runner plugin.


## Installation & Usage

1. Click the extension button on the left side of VSCode, search in the search box, and click `[install]`.
2. In the first startup after installation, please open `[Extension Settings]` and refresh it once as described in the `Button Config` item.
3. In the `Button Config` item, click `[Edit in settings.json]`, and then you can set your own button according to the code hints. The code hints are detailed enough, so I won't repeat them here.
4. This plugin itself doesn't provide substantial functionality. In the default configuration, there are several buttons that call commands not from VSCode but from other plugins, which are not available if you don't have them installed.


## Description

1. The location of the plugin code is (Default path on `Windows`): <br/>
   `C:/Users/<NAME>/.vscode/extensions/tur11ng.action-buttons-customizer-<VER>`
2. <span id="jump-en"/>
   I created this plugin. On the one hand, I need this feature; on the other hand, it's actually a learning process, because I'm neither good at Node.js nor VSCode plugin development. <br/>
   At present, the code implementation logic of this plugin's feature is very bad: I only know how to set buttons statically and haven't found a way to set them dynamically, so behind each modification of the settings, it's actually modifying the source code through file reading and writing to implement changes to the functionality. That's why you need to restart twice every time you apply a change. <br/>
   I even thought there's a possibility of program errors in this program, so I added the ability to manually refresh it. <br/>