
INSERT INTO poppy.pp_lang(locale, title, icon) VALUES('en-US', 'English', '-----');
INSERT INTO poppy.pp_lang(locale, title, icon) VALUES('zh-CN', '中文', '-----');

INSERT INTO poppy.pp_role(id, appId, title) VALUES(${roleId}, ${appId}, '${roleTitle}');
INSERT INTO poppy.pp_app (id, title, expireAt) VALUES(${appId}, '${appTitle}', DATE_ADD(NOW(), INTERVAL 20 YEAR));
INSERT INTO poppy.pp_app_domain (id, `domain`, appId) VALUES(${appDomainId}, '${appDomain}', ${appId});

INSERT INTO poppy.pp_user (id, appId, roleId, accountName) VALUES(${userId}, ${appId}, ${roleId}, '${userName}');
INSERT INTO poppy.pp_user_credential (userId, nonce, passwd) VALUES(${userId}, '${userNonce}', '${userPassword}');

-- menu
INSERT INTO poppy.pp_menu (id, menuCode, appId, `parent`, `type`, linkUrl, icon, hasPermission, `title`) VALUES(${systemMenuId}, 'systemSetting', ${appId}, 0, 'menu', NULL, 'icon', 1, 'System Setting');
