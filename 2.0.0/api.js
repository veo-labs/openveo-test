YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "BackEndPage",
        "CheckboxesField",
        "DateField",
        "Field",
        "Page",
        "SelectField",
        "TableAssert",
        "TablePage",
        "TextField",
        "TextareaField",
        "TimeField",
        "browser",
        "generator",
        "i18n"
    ],
    "modules": [
        "e2e",
        "unit"
    ],
    "allModules": [
        {
            "displayName": "e2e",
            "name": "e2e",
            "description": "Exposes a list of modules to help writing end to end tests on OpenVeo using protractor."
        },
        {
            "displayName": "unit",
            "name": "unit",
            "description": "Exposes a list of modules to help writing server unit tests on OpenVeo using mocha."
        }
    ],
    "elements": []
} };
});