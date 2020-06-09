let _PERMS = {};

module.exports.registerPerms = (perms) => _PERMS = perms;

module.exports.hasFeatureFlag = (perm) => {
    return _PERMS[perm];
}