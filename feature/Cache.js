import { Cache } from "react-native-cache";
import {
    Menu as PMenu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    MenuProvider,
  } from 'react-native-popup-menu';

const cache = new Cache({
    namespace: "myapp",
    policy: {
        maxEntries: 50000, // if unspecified, it can have unlimited entries
        stdTTL: 0 // the standard ttl as number in seconds, default: 0 (unlimited)
    },
    backend: AsyncStorage
});

/*<RNP.Button
                title="Skip"
                mode='text'
                style={styles.skip_button}
                onPress={async () =>
                          {
                              //Add User without name and E-mail, prompt user for name and e-mail later.
                              addUser(current_user.number,current_user.name,current_user.name,current_user.email,current_user.token);
                              let luser = {};
                              luser["_id"] = current_user.number;
                              luser["name"] = current_user.name;
                              luser["displayName"] = current_user.dspn;
                              luser["e_mail"] = current_user.email;
                              luser["auth_token"] = current_user.auth_token;
                              luser["auth_type"] = "Google FireBase";
                       
                              await cache.set("SignedIn_User", JSON.stringify(luser));
                              signIn()
                          } }
                disabled={false}
              >
              Skip
            </RNP.Button>  */

export const { cache };