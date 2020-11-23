module.exports = {
    "verbose": true,
    "transform": {
        "^.+\\.js$": "babel-jest",
    },
    "globals": {
        "NODE_ENV": "test"
    },
    "moduleFileExtensions": [
        "js",
    ],
    "moduleDirectories": [
        "node_modules",
    ],
    "transformIgnorePatterns": [
        "node_modules/(?!(react-native|localit|react-native-button)/)"
    ]

};