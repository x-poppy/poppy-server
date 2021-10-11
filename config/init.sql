-- root role
INSERT INTO poppy.pp_role (roleNo, parent, inherited, appNo, hasAppResPerms, `level`, displayName, `desc`) VALUES(${roleNo}, NULL, 1, ${appNo}, 1, 0, 'root', 'The root role for the system');

-- root app
INSERT INTO poppy.pp_app (appNo, parent, `level`, roleNo, expireAt,  displayName, `desc`) VALUES(${appNo}, NULL, 0, ${roleNo}, date_add(now(), INTERVAL 99 YEAR) ,'Poppy System', 'The poppy System');

INSERT INTO poppy.pp_app_domain (`domain`, appNo) VALUES('${appDomain}', ${appNo});

INSERT INTO poppy.pp_menu (menuCode, parent, appNo, appLevel, `type`, icon, hasPermission, priority, label) VALUES('Setting', NULL, ${appNo}, 0, 'menu', NULL, 1, 0, 'Setting');


INSERT INTO poppy.pp_user (userNo, appNo, roleNo, nonce, accountName, mobileNo, emailAddr, passwd, optKey, registerIP) VALUES(${userNo}, ${appNo}, ${roleNo}, '${userNonce}', '${userAccountName}', NULL, NULL, '${userPassword}', NULL, '127.0.0.1');

-- root app theme
INSERT INTO poppy.pp_app_theme (appNo, `key`, `value`, `desc`) VALUES(${appNo}, '--login-page-bg', 'azure', 'background for login page');

INSERT INTO poppy.pp_app_theme (appNo, `key`, `value`, `desc`) VALUES(${appNo}, '--home-page-bg', 'border-box', 'background for home page');

INSERT INTO poppy.pp_app_theme (appNo, `key`, `value`, `desc`) VALUES(${appNo}, '--default-page-bg', 'cadetblue', 'background for default page');

-- root page
-- INSERT INTO poppy.pp_page (appNo, pageCode,`type`, `content`, `desc`) VALUES(${appNo}, 'test', 'htmlUrl', 'test', 'for test');
