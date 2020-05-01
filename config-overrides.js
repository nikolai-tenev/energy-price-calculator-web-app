const {
    override,
    addDecoratorsLegacy,
} = require("customize-cra");

module.exports = {
    webpack: (webpack, env) => {
        return override(
            addDecoratorsLegacy(),
        )(webpack, env);
    },
};
