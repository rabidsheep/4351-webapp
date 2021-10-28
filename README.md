# 4351-webapp

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

**If you get a ton of "DEPRECATION WARNING: Using / for division is deprecated and will be removed in Dart Sass 2.0.0." warnings:** You can either ignore it for now or try the [Automatic Migration solution](https://sass-lang.com/documentation/breaking-changes/slash-div#automatic-migration).

### Compiles and minifies for production
```
npm run build
```

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