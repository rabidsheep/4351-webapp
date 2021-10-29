# 4351-webapp

## Project setup
```
npm install
```

Ensure that the config.js file is available in your local repo, ideally under /src/plugins.

### Compiles and hot-reloads for development
```
npm run serve
```

**If you get a ton of "DEPRECATION WARNING: Using / for division is deprecated and will be removed in Dart Sass 2.0.0." warnings:** You can either ignore it for now or try the [Automatic Migration solution](https://sass-lang.com/documentation/breaking-changes/slash-div#automatic-migration).

### Start Firebase emulators
```
firebase emulators:start
```

### Compiles and minifies for production
```
npm run build
```

### Deploy to firebase

```
npm run build && firebase deploy
```

Website: https://tcc4351.web.app/

### TODO
- [ ] date & time picker
    - [ ] system for determining high traffic days
        - holidays
        - otherwise, day already has a high amount of reservations, etc        
    - [ ] notice of $10 hold fee for high traffic days
- [ ] input/form validation
- [ ] guest vs logged in check
- [ ] prompt asking guest if they want to register
    - [ ] api call for quick registration