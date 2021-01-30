import { Accounts } from "meteor/accounts-base";
import { _ } from "meteor/underscore";

Accounts.onCreateUser((options, user) => {
	const { type } = options;
	Object.assign( user,{  type
	} );

	return user;

});