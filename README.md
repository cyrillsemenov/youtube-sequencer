# YouTube Sequencer

> The YouTube Sequencer Chrome Extension offers an interactive tool for customizing video playback speeds and sequences on YouTube.

:page_facing_up: [Tutorial](TUTORIAL.md)

:tv: [Video tutorial](https://youtu.be/vSqUxEtbNO8)

:tv: [Demo](https://youtu.be/wlM8Nid6TB4)

I initially began this project as a simple keystroke emulator for creating sequences from YouTube videos, but it has evolved into a more complex tool. First prototype was made years ago using [puredata](https://github.com/pure-data/pure-data).

This extension allows for intricate control over YouTube video playback, enabling users to select specific slices of a video to play and adjust the sequence tempo. Users can also change the current note length (ranging from 1/16t to 1/2d) and modify the playback speed, which is mapped exponentially from 0.0625 to 16 over a range of 0 to 100. Sequences are persistent, meaning they can be saved and accessed even after a page reload.

> [!CAUTION]
> Currently, this project is in the proof-of-concept stage, and as such, encountering bugs is expected.

> [!TIP]
> If you're having trouble locating the sequencer UI, a page reload might resolve the issue.

## Installation

- **Clone** this repo or download a zip of the repo and unzip it on your computer.
- **Open [the extensions page](chrome://extensions)** in your browser: `chrome://extensions`. This link works on any chromium-based browser.
- **Toggle the "developer mode" on**. This is usually a toggle button at the top right of the extensions page.
- Click the button **_load unpacked extension_**.
- In the window that pops up, **select the folder that contains repo**, then **click _ok_**.
- **Done!** A new extension called **_YouTube Sequencer_** should have appeared in the list.

## TODO

- [x] [Port to Firefox.](https://extensionworkshop.com/documentation/develop/porting-a-google-chrome-extension/)
- [ ] Replace keystroke emulation for controlling video playback with direct manipulation of the `video.currentTime` property.
- [ ] Implement functionality to create custom slices of the video based on normalized or absolute time intervals.
- [ ] Save and load "dialogues". Save multiple sequences, store the video id sequence made for, comments and slices data.
- [ ] Create a bot that visits the specified video, downloads it, analyzes the audio data to find transients, and posts a comment with the timecodes of these transients.
- [ ] Transition the extension's architecture from using a fully injected script to incorporating a side panel interface.

## Links

- [Chrome extension boilerblate](https://github.com/SimGus/chrome-extension-v3-starter)
- [Inspiration: github.com/klntsky/youtubecore](https://github.com/klntsky/youtubecore)
