# Ring.cx

## Dependecies

It depends on JQuery & Semantics UI. We build it with everything from Semantics UI but later we shall desactivate many of the unused features.

    $ cd libs/
    $ npm install

    ? Set-up Semantic UI
    ❯ Automatic (Use defaults locations and all components)
    ? Set-up Semantic UI Automatic (Use defaults locations and all components)
    ❯ Yes
    ? Where should we put Semantic UI inside your project? (semantic/)

    $ npm install -g gulp
    $ cd semantics/
    $ gulp build

## Development

The manifests of Firefox & Chrome are different. Make a copy of the one you want for the browser of you choice and name it *manifest.json*. Chrome has issues with SVG which means it's better to use PNG format for the default icon.

### Firefox

1. Go to *about:debugging#addons*
2. Click *Load Temporary Add-on*
3. Select the *manifest.json*

### Chrome

1. Go to *chrome://extensions/*
2. Check *Developer mode*
3. Click *Load unpacked extension*

