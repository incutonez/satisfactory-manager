import js from "@eslint/js";
import pluginIncutonez from "@incutonez/eslint-plugin";
import stylisticTs from "@stylistic/eslint-plugin-ts";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import pluginImport from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config({
    ignores: ["dist"],
}, {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser,
    },
    plugins: {
        "react-hooks": reactHooks,
        "react-refresh": reactRefresh,
        react: reactPlugin,
    },
    rules: {
        ...reactHooks.configs.recommended.rules,
        "react/jsx-first-prop-new-line": [1, "multiline"],
        "react/jsx-one-expression-per-line": [1, {
            allow: "literal",
        }],
        "react/jsx-props-no-multi-spaces": "error",
        "react/jsx-tag-spacing": ["error", {
            beforeClosing: "never",
            beforeSelfClosing: "always",
        }],
        "react/jsx-closing-bracket-location": "error",
        "react/jsx-max-props-per-line": [1, {
            maximum: 1,
            when: "always",
        }],
        "react-refresh/only-export-components": ["warn", {
            allowConstantExport: true,
        }],
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/ban-ts-comment": ["error", {
            "ts-expect-error": "allow-with-description",
            "ts-nocheck": "allow-with-description",
        }],
    },
}, {
    plugins: {
        "simple-import-sort": pluginImport,
        "@incutonez": pluginIncutonez,
        "@stylistic/ts": stylisticTs,
    },
    rules: {
        "quote-props": ["error", "as-needed"],
        "padding-line-between-statements": ["error", {
            blankLine: "always",
            prev: "*",
            next: "export",
        }],
        "space-before-function-paren": ["error", {
            anonymous: "never",
            named: "never",
            asyncArrow: "always",
        }],
        "function-call-argument-newline": ["error", "never"],
        "function-paren-newline": ["error", "never"],
        "no-mixed-spaces-and-tabs": "off",
        "no-var": "error",
        "@stylistic/ts/indent": ["error", "tab", {
            SwitchCase: 1,
            ignoredNodes: ["PropertyDefinition"],
        }],
        semi: [2, "always"],
        quotes: ["error", "double"],
        curly: "error",
        "multiline-ternary": ["error", "always-multiline"],
        "brace-style": ["error", "stroustrup"],
        "comma-dangle": ["error", "always-multiline"],
        "eol-last": ["error", "always"],
        "object-curly-newline": ["error", {
            ObjectExpression: {
                multiline: true,
                minProperties: 1,
            },
            ObjectPattern: "never",
        }],
        "object-curly-spacing": ["error", "always"],
        "object-property-newline": "error",
        "no-trailing-spaces": ["error"],
        "arrow-spacing": "error",
        "no-duplicate-imports": "error",
        "arrow-parens": "error",
        "computed-property-spacing": ["error", "never"],
        "func-call-spacing": ["error", "never"],
        "new-parens": "error",
        "prefer-const": "error",
        "array-bracket-spacing": ["error", "never"],
        "comma-spacing": ["error", {
            before: false,
            after: true,
        }],
        "@incutonez/array-element-newline": ["error", {
            multiline: true,
            minItems: 5,
            bracesSameLine: true,
        }],
        "@incutonez/array-bracket-newline": ["error", {
            multiline: true,
            minItems: 5,
            bracesSameLine: true,
        }],
        "key-spacing": "error",
        "space-infix-ops": "error",
        "no-multi-spaces": "error",
        "space-before-blocks": "error",
        "keyword-spacing": "error",
        "space-in-parens": "error",
        "simple-import-sort/imports": ["error", {
            groups: [[
                "^\\u0000",
                "^react",
                "^@?\\w",
                "^[^.]",
                "^\\.",
            ]],
        }],
    },
});
