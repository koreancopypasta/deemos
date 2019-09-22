# deemos
Democratically choosing videos to show for public gatherings

# Installing the Chrome Extension
- `git clone` this repo.
- `cd` to the root folder of the repository.
- Run `npm install`, and then (**IMPORTANT**) `npm run build`. If an error occurs in `npm run build`, try creating the folders `ChromeExtension/js` and `public/javascripts` inside the repo first.
- In `chrome://extensions/` add the `ChromeExtension` folder as an unpacked extension. The extension should then replace new tabs.
