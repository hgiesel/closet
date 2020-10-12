---
name: Bug report
about: Create a report to help us improve
title: ''
labels: bug
assignees: hgiesel

---

**Describe the bug**
A clear and concise description of what the bug is.

 - Anki client: [e.g. AnkiDesktop, AnkiDroid, AnkiMobile on iOS, AnkiWeb]
 - if AnkiDesktop, please name your OS [e.g. Windows, macOS, Linux]
 - if AnkiDesktop, please name the version. You can find it in the "About" section [e.g. 2.1.26]

**Debug information**
To help you debug, I need some information. I have two suggestions for you to help me. It would be best, if you did both, as that way I can help you the quickest.

#### Method 1
1. You download the [AnkiWebView Inspector](https://ankiweb.net/shared/info/31746032)
1. Open a card which doesn't work in the reviewer, right-click on the card, and select "Inspect". This will open a tab to the right. 
1. In this tab, select "Console", however usually it is automatically selected.
1. Look for an error message. If there is none, try typing in `initCloset()` and click enter, and see if there is now an error message
1. Take a screenshot of the error (or absence of it), and upload it here.

#### Method 2
1. You put cards (however many you like), and put them into a new Anki Deck.
1. You export it by finding it on the main screen, clicking on the small right wheel next to it, and choose "Export"
1. As Export format choose "**Anki Deck Package**", **uncheck** "Include scheduling information", **check** "Include media".
1. You will get a file with the ending ".apkg". Upload this file here.
