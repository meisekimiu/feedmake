module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "airbnb",
        "airbnb-typescript",
        "prettier"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "project": ["./tsconfig.json"]
    },
    "plugins": [
        "@typescript-eslint",
        "prettier"
    ],
    "rules": {
        "no-restricted-syntax": ["error", "ForInStatement", "LabeledStatement", "WithStatement"]
    }
}
