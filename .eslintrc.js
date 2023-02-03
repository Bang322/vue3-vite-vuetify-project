module.exports = {
    extends: ['plugin:vue/vue3-recommended', 'plugin:vuetify/base', 'prettier'],
    plugins: ['prettier'],
    rules: {
        /*'semi': ['error', 'always'],
            'quotes': ['error', 'single'],
            'indent': ['error', 4],
            'vue/html-indent': ['error', 4, {
                'attribute': 1,
                'baseIndent': 1,
                'closeBracket': 0,
                'alignAttributesVertically': true,
                'ignores': []
            }]*/
        'vue/html-self-closing': [
            'error',
            {
                html: {
                    void: 'always',
                    normal: 'always',
                    component: 'always'
                }
            }
        ],
        'prettier/prettier': [
            'error',
            {
                singleQuote: true,
                semi: true,
                tabWidth: 4,
                bracketSpacing: true,
                trailingComma: 'none',
                singleAttributePerLine: true,
                printWidth: 80,
                arrowParens: 'avoid'
            }
        ]
    }
};
