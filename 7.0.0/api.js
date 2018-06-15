YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "BackEndPage",
        "CheckboxField",
        "CheckboxesField",
        "DateField",
        "DateTimeField",
        "FakeField",
        "Field",
        "Helper",
        "MatchField",
        "MatchTagsField",
        "MatchTextField",
        "Page",
        "SelectField",
        "TableAssert",
        "TablePage",
        "TagsField",
        "TextField",
        "TextareaField",
        "TimeField",
        "TinyMCEField",
        "browser",
        "i18n",
        "karma-ng-inline-templates-preprocessor",
        "screenshotPlugin",
        "util"
    ],
    "modules": [
        "e2e",
        "unit",
        "util"
    ],
    "allModules": [
        {
            "displayName": "e2e",
            "name": "e2e",
            "description": "Exposes a list of modules to help writing end to end tests on OpenVeo using protractor.\n\n    require('@openveo/test').e2e;"
        },
        {
            "displayName": "unit",
            "name": "unit",
            "description": "Exposes a list of modules to help writing server unit tests on OpenVeo using mocha.\n\n    require('@openveo/test').ut;"
        },
        {
            "displayName": "util",
            "name": "util",
            "description": "Exposes a list of functions to help writing tests."
        }
    ],
    "elements": []
} };
});