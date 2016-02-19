# 2.0.0 / 2016-02-19

- Add e2e tools to help write automated end to end tests using protractor. Consequently openveo-test is now split in 2 : the unit tests library and the end to end tests library. Unit test generator, which used to be accessible through require('@openveo/test').generator, is now accessible through require('@openveo/test').unit.generator
- Update server unit tests to fit new Database interface comming with [OpenVeo API](https://github.com/veo-labs/openveo-api) 2.0.0

# 1.0.2 / 2015-11-26

Remove peer dependencies on @openveo/core and @openveo/publish projects

# 1.0.1 / 2015-11-02

- Correct peer dependencies versions on projects [OpenVeo Core](https://github.com/veo-labs/openveo-core) and [OpenVeo Publish](https://github.com/veo-labs/openveo-publish). Versions were relying on unknown versions blocking installation of projects in development mode.

# 1.0.0 / 2015-10-26

First stable version of OpenVeo test providing mocks for Database, Web Service scopes and permissions.