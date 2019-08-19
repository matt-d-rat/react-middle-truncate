# react-middle-truncate

[![][travis_img]][travis_url] [![][github_issues_img]][github_issues_url] [![github_forks_img]][github_forks_url] [![github_stars_img]][github_stars_url] [![][license_img]][license_url]

A React component for intelligently truncating text in the middle of the string with an ellipsis. You can see the component in action in this [demo][url-demo].

## Installation

```bash
npm install react-middle-truncate --save
```

## Usage

The truncation point is determined by taking into account the inherited `font` CSS properties of the element, and rendering the result to [Canvas][url-docs-canvas] in order to dynamically calculate the width of the text. Should the width of the text not fit into the available space to render, truncation is applied. The result of which looks like this:

```javascript
import MiddleTruncate from 'react-middle-truncate';

<MiddleTruncate
  text="Hello world this is a really long string"
  start={/Hello\sworld/}
  end={6} />
```

![Result of Middle Truncation using the code sample above][img-screenshot]

You'll note from the code sample above we can use the `start` and `end` props to determine how much of the start and end of the string to preserve. These props can either be numeric, which indicates how many characters of the string from that direction to preserve, or you can provide a [Regular Expression][url-docs-regexp] to dynamically match parts of the string.

In the case of using a [Regular Expression][url-docs-regexp] for the `end` prop, remember to match from the end of the pattern using the `$` flag.

### Options

| Prop                 | Type               | Description                                                                                                                                                                            | Default |
|----------------------|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|
| `text`               | `String`           | The input text to truncate if there isn't enough space to render the entire string.                                                                                                    | `''`    |
| `ellipsis`           | `String`           | The ellipsis to use when the text is truncated.                                                                                                                                        | `'...'` |
| `start`              | `Number` `RegExp`  | The number of characters or a Regular Expression match from the start of the text to preserve.                                                                                         | `0`     |
| `end`                | `Number` `RegExp`  | The number of characters or a Regular Expression match from the end of the text to preserve.                                                                                           | `0`     |
| `smartCopy`          | `Boolean` `String` | Can be one of the following: `false`, `'partial'` or `'all'`. Allows the the full un-truncated text to be copied to the user's clipboard when they select and copy the truncated text. | `'all'` |
| `onResizeDebounceMs` | `Number`           | A delay in milliseconds to debounce the window resize event listener.                                                                                                                  | `100`   |

### Why and when to middle truncate?

We have access to CSS text truncation with the `text-overflow: ellipsis;` which will truncate the text at the end of a string for us. So why do you need middle truncation, and when should you use it?

Ultimately it boils down to whether text at the end or in the middle of the string is more likely to differentiate the item.

In the case of a street address, the end of the string is likely to be less important in helping the user to differentiate items from one another, as most strings of that category are likely to end in road, street, avenue etc... So in that case truncating at the end of the string would be a better solution.

In the case of a connection string or a URL, the start and/or end of the string is likely to contain more valuable information to help the user differentiate items from one another, such as the protocol and sub domain parts at the start, and the port number at the end of the string are more likely to be different. In that case truncating in the middle of the string would be a better solution.

## Contributing

Pull requests of any kind are welcome from the community. Please ensure you have read the guidelines for [Contributing][url-contributing] and this project's [Code of Conduct][url-code-of-conduct] before raising a pull request.

### Maintainers

* Matt Fairbrass [@matt\_d_rat][url-twitter]

## License

MIT License

[url-demo]: https://matt-d-rat.github.io/react-middle-truncate
[url-docs-canvas]: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
[url-docs-regexp]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
[url-twitter]: https://twitter.com/matt_d_rat
[url-contributing]: CONTRIBUTING.md
[url-code-of-conduct]: CODE_OF_CONDUCT.md

[img-screenshot]: src/demo/assets/images/screenshot.png "Result of applying middle truncation to the text"

[license_img]: https://img.shields.io/github/license/matt-d-rat/react-middle-truncate.svg
[license_url]: https://github.com/matt-d-rat/react-middle-truncate/blob/master/LICENSE
[github_issues_img]: https://img.shields.io/github/issues/matt-d-rat/react-middle-truncate.svg
[github_issues_url]: https://github.com/matt-d-rat/react-middle-truncate/issues
[github_forks_img]: https://img.shields.io/github/forks/matt-d-rat/react-middle-truncate.svg
[github_forks_url]: https://github.com/matt-d-rat/react-middle-truncate/network
[github_stars_img]: https://img.shields.io/github/stars/matt-d-rat/react-middle-truncate.svg
[github_stars_url]: https://github.com/matt-d-rat/react-middle-truncate/stargazers
[travis_img]: https://img.shields.io/travis/matt-d-rat/react-middle-truncate.svg?style=flat-square
[travis_url]: https://travis-ci.org/matt-d-rat/react-middle-truncate
