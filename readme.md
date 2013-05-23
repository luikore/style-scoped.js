Cross browser support for `<style scoped>`. Good for components. Very simple code.

## Compile

Requires ruby. Generates *scoped.js* and *test.html*

```bash
bundle
rake
```

## Use

```coffee
$ ->
  $.applyScopedCss()
```

In addition, it watches dom changes for browsers that support `MutationObserver`.

## Limits

The CSS parser is quite naive, not support `@` instructions or vars yet.
